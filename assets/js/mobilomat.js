const ANS_ICONS = { 1: "✓", 0: "○", "-1": "✗" };
const ANS_LABELS = {
  1: "Stimme zu",
  0: "Egal / Weiß nicht",
  "-1": "Stimme nicht zu",
};
const ANS_CLASS = {
  1: "vote-badge-pro",
  0: "vote-badge-neutral",
  "-1": "vote-badge-contra",
};
const ANS_COLOR = {
  1: "#aec905",
  0: "#f5c200",
  "-1": "#e03535",
};

// URL param sparse encoding: "qi:ans,qi:ans,..."
function parseAnswers(param) {
  const map = new Map();
  if (param) {
    param.split(",").forEach((p) => {
      const [qi, v] = p.split(":");
      if (qi !== undefined && v !== undefined) map.set(Number(qi), Number(v));
    });
  }
  return map;
}

function encodeAnswers(map) {
  return [...map].map(([qi, v]) => `${qi}:${v}`).join(",");
}

function renderBadge(el, ans) {
  if (ans == null) {
    el.classList.add("vote-badge-skip");
    el.innerHTML = `<span>→</span><span>Übersprungen</span>`;
    return;
  }
  const key = String(ans);
  el.classList.add(ANS_CLASS[key] ?? "vote-badge-skip");
  el.innerHTML = `<span>${ANS_ICONS[key] ?? "→"}</span><span>${ANS_LABELS[key] ?? "Übersprungen"}</span>`;
}

function initFragenPage(qi, nextUrl) {
  const param = new URLSearchParams(location.search).get("a") || "";
  const answers = parseAnswers(param);

  // Vote buttons: record answer and advance
  document.querySelectorAll("[data-vote]").forEach((el) => {
    const v = Number(el.dataset.vote);
    el.addEventListener("click", (e) => {
      e.preventDefault();
      el.classList.add("vote-btn-clicked");
      const next = new Map(answers);
      next.set(qi, v);
      setTimeout(() => {
        window.location.href = nextUrl + "?a=" + encodeAnswers(next);
      }, 300);
    });
  });

  // Skip button: advance without recording an answer
  document.querySelector("[data-skip]")?.addEventListener("click", (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("vote-btn-clicked");
    setTimeout(() => {
      window.location.href = nextUrl + "?a=" + encodeAnswers(answers);
    }, 300);
  });

  // Progress bar: carry answers forward and colour answered segments
  document.querySelectorAll(".progress-seg").forEach((seg) => {
    if (param) seg.href += "?a=" + param;
    const segQi = Number(seg.dataset.qi);
    if (segQi === qi) return;
    const ans = answers.get(segQi);
    if (ans != null) seg.style.backgroundColor = ANS_COLOR[String(ans)] ?? null;
  });

  // Hint for previously saved answer
  const myAns = answers.get(qi);
  if (myAns != null) {
    const btn = document.querySelector(`[data-vote="${myAns}"]`);
    if (btn) {
      btn.classList.add("vote-btn-prev");
      const hint = document.createElement("span");
      hint.textContent = "Zuletzt gewählt";
      hint.className = "ml-auto text-xs text-stone-400 dark:text-stone-500";
      btn.appendChild(hint);
    }
  }
}

function initErgebnisPage() {
  const PARAM = new URLSearchParams(location.search).get("a") || "";
  const answers = parseAnswers(PARAM);

  // Attach ?a= to subpage links and render answer badges
  document.querySelectorAll("[data-kandidat-link]").forEach((el) => {
    el.href = `/ergebnis/kandidat/${el.dataset.kandidatLink}/?a=${PARAM}`;
  });
  document.querySelectorAll("[data-frage-link]").forEach((el) => {
    el.href = `/ergebnis/frage/${el.dataset.frageLink}/?a=${PARAM}`;
  });
  document.querySelectorAll("[data-ans-qi]").forEach((el) => {
    renderBadge(el, answers.get(Number(el.dataset.ansQi)));
  });

  function pctClass(pct) {
    return pct >= 67 ? "pct-green" : pct >= 34 ? "pct-amber" : "pct-red";
  }
  function barClass(pct) {
    return pct >= 67 ? "bar-green" : pct >= 34 ? "bar-amber" : "bar-red";
  }

  const container = document.getElementById("summary-cards");
  const results = [...container.querySelectorAll("[data-candidate]")]
    .map((card) => {
      let score = 0,
        maxScore = 0;
      card.querySelectorAll("[data-qi][data-pos]").forEach((row) => {
        const ans = answers.get(Number(row.dataset.qi));
        if (ans == null) return;
        const pos = Number(row.dataset.pos);
        maxScore++;
        if (pos === ans) score++;
        else if (pos === 0 || ans === 0) score += 0.5;
      });
      const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      return { card, name: card.dataset.candidate, pct };
    })
    .sort((a, b) => b.pct - a.pct);

  results.forEach((r, rank) => {
    r.card.querySelector(".rank-num").textContent = rank + 1;
    r.card
      .querySelector(".rank-badge")
      .classList.toggle("rank-first", rank === 0);
    r.card
      .querySelector(".rank-badge")
      .classList.toggle("rank-other", rank !== 0);
    r.card.classList.toggle("card-top", rank === 0);
    const pctLabel = r.card.querySelector(".pct-label");
    pctLabel.textContent = r.pct + "%";
    pctLabel.classList.add(pctClass(r.pct));
    const bar = r.card.querySelector(".pct-bar");
    bar.style.width = r.pct + "%";
    bar.classList.add(barClass(r.pct));
    container.appendChild(r.card);
  });

  document.getElementById("restart-btn").addEventListener("click", () => {
    window.location.href = "/";
  });

  document
    .getElementById("share-btn")
    .addEventListener("click", async function () {
      const title = "Mein Mobil-O-Mat-Ergebnis für die OB-Wahl:";
      const ranking = results
        .map((r, i) => `${i + 1}. ${r.name}: ${r.pct}%`)
        .join("\n");
      const text = `${title}\n${location.href}\n\n${ranking}\n\nWer ist Dein Favorit?\n${location.origin}`;
      if (navigator.share) {
        await navigator.share({ text });
      } else {
        await navigator.clipboard.writeText(text + "\n" + location.origin);
        const orig = this.innerHTML;
        this.textContent = "✓ Kopiert!";
        setTimeout(() => (this.innerHTML = orig), 2000);
      }
    });
}

function initFragePage(qi, candidatePositions) {
  const param = new URLSearchParams(location.search).get("a") || "";
  const answers = parseAnswers(param);
  if (param)
    document.querySelectorAll("a[href]").forEach((el) => {
      if (el.href.startsWith(location.origin + "/ergebnis/"))
        el.href += "?a=" + param;
    });
  renderBadge(document.querySelector("[data-my-ans-qi]"), answers.get(qi));

  if (!candidatePositions) return;
  const stanceEls = [...document.querySelectorAll("[data-candidate]")];
  const container = stanceEls[0]?.parentElement;
  if (!container) return;

  const myAns = answers.get(qi);

  function matchScore(pos) {
    if (myAns == null) return 0;
    if (pos === myAns) return 2;
    if (pos === 0 || myAns === 0) return 1;
    return 0;
  }

  function overallPct(candidate) {
    const positions = candidatePositions[candidate] ?? [];
    let score = 0,
      maxScore = 0;
    positions.forEach((pos, idx) => {
      const ans = answers.get(idx);
      if (ans == null) return;
      maxScore++;
      if (pos === ans) score++;
      else if (pos === 0 || ans === 0) score += 0.5;
    });
    return maxScore > 0 ? score / maxScore : 0;
  }

  stanceEls
    .sort((a, b) => {
      const ms =
        matchScore(Number(b.dataset.pos)) - matchScore(Number(a.dataset.pos));
      if (ms !== 0) return ms;
      return overallPct(b.dataset.candidate) - overallPct(a.dataset.candidate);
    })
    .forEach((card) => container.appendChild(card));
}

function initKandidatPage() {
  const p = new URLSearchParams(location.search).get("a");
  if (p)
    document
      .querySelectorAll('[href="/ergebnis/"]')
      .forEach((el) => (el.href = "/ergebnis/?a=" + p));

  const answers = parseAnswers(p || "");
  document.querySelectorAll("[data-my-ans-qi]").forEach((el) => {
    renderBadge(el, answers.get(Number(el.dataset.myAnsQi)));
  });
}
