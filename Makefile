# https://tech.davis-hansson.com/p/make/
SHELL := bash
.ONESHELL:
MAKEFLAGS += --no-print-directory

PRETTIER_CMD := npx prettier .

all: lint

# Use http://localhost:1313
# 0.0.0.0 is used to allow access in local network
serve:
	echo "$$(ipconfig getifaddr en0)"
	qrtool encode -t unicode "http://$$(ipconfig getifaddr en0):1313"
	hugo server --noHTTPCache --bind 0.0.0.0 --baseURL http://localhost

lint:
	yamlfmt -lint -dstar **/*.{yaml,yml}
	$(PRETTIER_CMD) --check

format:
	yamlfmt -dstar **/*.{yaml,yml}
	$(PRETTIER_CMD) --write
