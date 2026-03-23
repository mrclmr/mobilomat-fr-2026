"use strict";

// DATA is injected by Hugo at build time from data/mobilomat/*.yaml
// const DATA = { meta, questions, candidates }

// ─── State ────────────────────────────────────────────────────────────────────

const state = {
  phase: "welcome", // 'welcome' | 'question' | 'results'
  answers: new Array(DATA.questions.length).fill(null), // null | 1 | 0 | -1 | 99
  currentQ: 0,
  resultsTab: "summary", // 'summary' | 'theses' | 'parties'
};

// ─── Score Calculation ────────────────────────────────────────────────────────

function getStance(candidateNameShort, qi) {
  return DATA.questions[qi].stances.find(
    (s) => s.candidate === candidateNameShort,
  );
}

function calcResults() {
  return DATA.candidates
    .map((c, idx) => {
      let score = 0;
      let maxScore = 0;
      for (let q = 0; q < DATA.questions.length; q++) {
        const ans = state.answers[q];
        if (ans === null || ans === 99) continue;
        maxScore += 1;
        const pos = getStance(c.nameShort, q).position;
        if (pos === ans) score += 1;
        else if (pos === 0 || ans === 0) score += 0.5;
      }
      const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
      return { idx, c, score, maxScore, pct };
    })
    .sort((a, b) => b.pct - a.pct);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function posIcon(pos) {
  return { 1: "✓", 0: "○", "-1": "✗" }[pos] ?? "→";
}

function posLabel(pos) {
  return (
    {
      1: "Stimme zu",
      0: "Egal / Weiß nicht",
      "-1": "Stimme nicht zu",
      99: "Übersprungen",
    }[pos] ?? "Keine Antwort"
  );
}

function voteBtnClass(btnPos, currentAnswer) {
  const active = currentAnswer === btnPos;
  const map = {
    1: active ? "vote-btn vote-btn-pro-active" : "vote-btn vote-btn-pro",
    0: active
      ? "vote-btn vote-btn-neutral-active"
      : "vote-btn vote-btn-neutral",
    "-1": active
      ? "vote-btn vote-btn-contra-active"
      : "vote-btn vote-btn-contra",
    99: active ? "vote-btn vote-btn-skip-active" : "vote-btn vote-btn-skip",
  };
  return map[btnPos] || "vote-btn vote-btn-skip";
}

function barColor(pct) {
  if (pct >= 67) return "bar-green";
  if (pct >= 34) return "bar-amber";
  return "bar-red";
}

function pctColor(pct) {
  if (pct >= 67) return "text-green-600 dark:text-green-400";
  if (pct >= 34) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function imprintHTML() {
  return `<p class="mt-6 text-center text-xs text-stone-400 dark:text-stone-600">
    <a href="${DATA.meta.imprintLink}" target="_blank" rel="noopener" class="hover:underline">Impressum</a>
  </p>`;
}

// ─── Render ───────────────────────────────────────────────────────────────────

function render() {
  const app = document.getElementById("app");
  app.innerHTML = "";
  ({
    welcome: renderWelcome,
    question: renderQuestion,
    results: renderResults,
  })[state.phase]?.(app);
}

function renderWelcome(app) {
  app.innerHTML = `
    <div class="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div class="w-full max-w-lg">
        <div class="mb-8 text-center">
          <div class="mb-5 inline-flex h-20 w-20 items-center justify-center rounded-full
                      bg-green-100 text-4xl dark:bg-green-900/30">🚲</div>
          <h1 class="mb-2">${DATA.meta.title1}</h1>
          <p class="text-stone-500 dark:text-stone-400">${DATA.meta.title2}</p>
        </div>
        <div class="card mb-5">
          <p class="leading-relaxed text-stone-600 dark:text-stone-300">${DATA.meta.description}</p>
        </div>
        <button onclick="startQuiz()" class="btn-primary w-full text-lg">Los geht's →</button>
        ${imprintHTML()}
      </div>
    </div>`;
}

function renderQuestion(app) {
  const q = DATA.questions[state.currentQ];
  const total = DATA.questions.length;
  const num = state.currentQ + 1;
  const ans = state.answers[state.currentQ];
  const pct = Math.round(((num - 1) / total) * 100);
  const isLast = state.currentQ === total - 1;

  app.innerHTML = `
    <div class="mx-auto flex min-h-screen max-w-lg flex-col p-4 sm:p-6">

      <div class="mb-5">
        <div class="mb-2 flex justify-between text-sm text-stone-400 dark:text-stone-500">
          <span>Frage ${num} von ${total}</span>
          <span>${pct}%</span>
        </div>
        <div class="h-1.5 overflow-hidden rounded-full bg-stone-200 dark:bg-stone-700">
          <div class="h-full rounded-full bg-green-500 transition-all duration-500" style="width:${pct}%"></div>
        </div>
      </div>

      <div class="card mb-5 flex-grow">
        <h2 class="mb-3">${q.short}</h2>
        <p class="leading-relaxed text-stone-600 dark:text-stone-300">${q.long}</p>
      </div>

      <div class="mb-5 space-y-2.5">
        <button onclick="vote(1)"  class="${voteBtnClass(1, ans)}">
          <span class="w-7 shrink-0 text-xl">✓</span><span>Stimme zu</span>
        </button>
        <button onclick="vote(0)"  class="${voteBtnClass(0, ans)}">
          <span class="w-7 shrink-0 text-xl">○</span><span>Egal&nbsp;/ Weiß nicht</span>
        </button>
        <button onclick="vote(-1)" class="${voteBtnClass(-1, ans)}">
          <span class="w-7 shrink-0 text-xl">✗</span><span>Stimme nicht zu</span>
        </button>
        <button onclick="vote(99)" class="${voteBtnClass(99, ans)}">
          <span class="w-7 shrink-0 text-lg">→</span><span>Überspringen</span>
        </button>
      </div>

      <div class="flex gap-3">
        <button onclick="prevQuestion()" ${state.currentQ === 0 ? "disabled" : ""} class="nav-btn flex-1">
          ← Zurück
        </button>
        <button onclick="${isLast ? "showResults()" : "nextQuestion()"}" class="nav-btn-primary flex-1">
          ${isLast ? "Ergebnisse →" : "Weiter →"}
        </button>
      </div>

      ${imprintHTML()}
    </div>`;
}

function renderResults(app) {
  const results = calcResults();
  const tab = state.resultsTab;

  const tabBtn = (id, label) =>
    `<button onclick="setTab('${id}')" class="${tab === id ? "tab tab-active" : "tab tab-inactive"}">${label}</button>`;

  const content =
    tab === "summary"
      ? renderSummaryTab(results)
      : tab === "theses"
        ? renderThesesTab(results)
        : renderPartiesTab(results);

  app.innerHTML = `
    <div class="mx-auto flex min-h-screen max-w-lg flex-col p-4 sm:p-6">
      <div class="mb-5">
        <h1 class="mb-1">Ergebnisse</h1>
        <p class="text-sm text-stone-500 dark:text-stone-400">Übereinstimmung mit Ihren Antworten</p>
      </div>

      <div class="mb-5 flex gap-1 rounded-xl bg-stone-200 p-1 dark:bg-stone-800">
        ${tabBtn("summary", "Überblick")}
        ${tabBtn("theses", "Fragen")}
        ${tabBtn("parties", "Kandidierende")}
      </div>

      <div class="flex-grow">${content}</div>

      <div class="mt-6 space-y-3">
        <button onclick="restart()" class="btn-primary w-full">↺ Neu starten</button>
        ${imprintHTML()}
      </div>
    </div>`;
}

function renderSummaryTab(results) {
  return results
    .map(
      (r, rank) => `
    <div class="card mb-3 ${rank === 0 ? "ring-2 ring-green-500 dark:ring-green-400" : ""}">
      <div class="mb-3 flex items-center gap-4">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold
                    ${rank === 0 ? "bg-green-500 text-white" : "bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-300"}">
          ${rank + 1}
        </div>
        <div class="min-w-0 flex-grow">
          <div class="truncate font-semibold text-stone-900 dark:text-stone-50">${r.c.nameShort}</div>
          ${r.c.description ? `<div class="text-xs text-stone-400 dark:text-stone-500">${r.c.description}</div>` : ""}
        </div>
        <div class="shrink-0 text-2xl font-bold ${pctColor(r.pct)}">${r.pct}%</div>
      </div>
      <div class="h-2 overflow-hidden rounded-full bg-stone-100 dark:bg-stone-700">
        <div class="h-full rounded-full transition-all duration-700 ${barColor(r.pct)}" style="width:${r.pct}%"></div>
      </div>
      ${r.c.url ? `<div class="mt-2 text-xs"><a href="${r.c.url}" target="_blank" rel="noopener" class="text-stone-400 hover:underline">Mehr erfahren →</a></div>` : ""}
    </div>`,
    )
    .join("");
}

function renderThesesTab(results) {
  const sorted = [...results].sort((a, b) => a.idx - b.idx);
  return DATA.questions
    .map((q, qi) => {
      const ans = state.answers[qi];
      const rows = sorted
        .map((r) => {
          const stance = getStance(r.c.nameShort, qi);
          const pos = stance.position;
          const posCol =
            pos === 1
              ? "text-green-600 dark:text-green-400"
              : pos === -1
                ? "text-red-600 dark:text-red-400"
                : "text-amber-600 dark:text-amber-400";
          return `
        <div class="border-b border-stone-100 py-2 last:border-0 dark:border-stone-700">
          <div class="flex items-start gap-2">
            <span class="mt-0.5 w-5 shrink-0 font-bold ${posCol}">${posIcon(pos)}</span>
            <div class="min-w-0">
              <span class="text-sm font-medium text-stone-700 dark:text-stone-300">${r.c.nameShort}:</span>
              <span class="ml-1 text-sm text-stone-500 dark:text-stone-400">${stance.opinion}</span>
            </div>
          </div>
        </div>`;
        })
        .join("");

      return `
      <details class="card mb-3">
        <summary class="flex cursor-pointer list-none items-start gap-3">
          <span class="mt-0.5 shrink-0 rounded bg-stone-100 px-2 py-1 text-xs font-semibold
                       text-stone-500 dark:bg-stone-700 dark:text-stone-400">${qi + 1}</span>
          <div class="min-w-0 flex-grow">
            <div class="font-medium text-stone-800 dark:text-stone-200">${q.short}</div>
            <div class="mt-0.5 text-xs text-stone-400 dark:text-stone-500">
              Ihre Antwort: <span class="font-medium">${ans === null ? "Keine Antwort" : posLabel(ans)}</span>
            </div>
          </div>
          <span class="mt-1 shrink-0 text-stone-400 dark:text-stone-500">›</span>
        </summary>
        <div class="mt-3 border-t border-stone-100 pt-3 dark:border-stone-700">
          <p class="mb-3 text-sm leading-relaxed text-stone-500 dark:text-stone-400">${q.long}</p>
          ${rows}
        </div>
      </details>`;
    })
    .join("");
}

function renderPartiesTab(results) {
  const sorted = [...results].sort((a, b) => a.idx - b.idx);
  return sorted
    .map((r) => {
      const res = results.find((x) => x.idx === r.idx);
      const rows = DATA.questions
        .map((q, qi) => {
          const stance = getStance(r.c.nameShort, qi);
          const pos = stance.position;
          const ans = state.answers[qi];
          let matchIcon = "",
            matchCol = "";
          if (ans !== null && ans !== 99) {
            if (pos === ans) {
              matchIcon = "✓";
              matchCol = "text-green-500";
            } else if (pos === 0 || ans === 0) {
              matchIcon = "~";
              matchCol = "text-amber-500";
            } else {
              matchIcon = "✗";
              matchCol = "text-red-400";
            }
          }
          const posCol =
            pos === 1
              ? "text-green-600 dark:text-green-400"
              : pos === -1
                ? "text-red-600 dark:text-red-400"
                : "text-amber-600 dark:text-amber-400";
          return `
        <div class="border-b border-stone-100 py-2.5 last:border-0 dark:border-stone-700">
          <div class="flex items-start gap-2">
            <span class="mt-0.5 w-4 shrink-0 text-sm font-bold ${matchCol}">${matchIcon}</span>
            <div class="min-w-0 flex-grow">
              <div class="mb-0.5 flex items-center gap-1.5">
                <span class="text-xs text-stone-400">${qi + 1}.</span>
                <span class="text-sm font-medium text-stone-700 dark:text-stone-200">${q.short}</span>
                <span class="ml-auto text-sm font-bold ${posCol}">${posIcon(pos)}</span>
              </div>
              <p class="text-xs leading-relaxed text-stone-400 dark:text-stone-500">${stance.opinion}</p>
            </div>
          </div>
        </div>`;
        })
        .join("");

      return `
      <details class="card mb-3">
        <summary class="flex cursor-pointer list-none items-center gap-3">
          <div class="min-w-0 flex-grow">
            <div class="font-semibold text-stone-900 dark:text-stone-50">${r.c.nameShort}</div>
            ${r.c.description ? `<div class="text-xs text-stone-400">${r.c.description}</div>` : ""}
          </div>
          <div class="shrink-0 text-lg font-bold ${pctColor(res.pct)}">${res.pct}%</div>
          <span class="ml-1 shrink-0 text-stone-400">›</span>
        </summary>
        <div class="mt-3 border-t border-stone-100 pt-3 dark:border-stone-700">${rows}</div>
      </details>`;
    })
    .join("");
}

// ─── Actions ──────────────────────────────────────────────────────────────────

function startQuiz() {
  state.phase = "question";
  state.currentQ = 0;
  render();
}

function vote(pos) {
  state.answers[state.currentQ] = pos;
  render();
}

function nextQuestion() {
  if (state.currentQ < DATA.questions.length - 1) {
    state.currentQ++;
    render();
  } else {
    showResults();
  }
}

function prevQuestion() {
  if (state.currentQ > 0) {
    state.currentQ--;
    render();
  }
}

function showResults() {
  state.phase = "results";
  state.resultsTab = "summary";
  render();
}

function setTab(tab) {
  state.resultsTab = tab;
  render();
}

function restart() {
  state.answers = new Array(DATA.questions.length).fill(null);
  state.currentQ = 0;
  state.phase = "welcome";
  render();
}

// ─── Init ─────────────────────────────────────────────────────────────────────

render();
