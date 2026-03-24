# https://tech.davis-hansson.com/p/make/
SHELL := bash
.ONESHELL:
MAKEFLAGS += --no-print-directory

PRETTIER_CMD := npx prettier .

all: lint

serve:
	hugo server --noHTTPCache --bind 0.0.0.0 --baseURL http://0.0.0.0

lint:
	$(PRETTIER_CMD) --check

format:
	yamlfmt -dstar **/*.{yaml,yml}
	$(PRETTIER_CMD) --write
