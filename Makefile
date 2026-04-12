# https://tech.davis-hansson.com/p/make/
SHELL := bash
.ONESHELL:
MAKEFLAGS += --no-print-directory

PRETTIER_CMD := npx prettier .

all: lint

# Use http://localhost:1313
# 0.0.0.0 is used to allow access in local network
serve:
	hugo server --noHTTPCache --bind 0.0.0.0 --baseURL http://localhost

build:
	hugo build

lint:
	$(PRETTIER_CMD) --check

format:
	$(PRETTIER_CMD) --write

qr-macos:
	qrtool encode -t unicode "http://$$(ipconfig getifaddr en0):1313"
