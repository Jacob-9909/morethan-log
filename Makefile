.PHONY: setup dev run

NOTION_PAGE_ID := 166bde17d01780afb931c6b4e84f9909
setup:
	docker build . -t morethan-log ; \
	docker run -it --rm -v $(PWD):/app morethan-log /bin/bash -c "yarn install" ; \
	echo NOTION_PAGE_ID=$(NOTION_PAGE_ID) > .env.local

dev:
	docker run -it --rm -v $(PWD):/app -p 8001:3000 morethan-log /bin/bash -c "yarn run dev"

run:
	docker run -it --rm -v $(PWD):/app morethan-log /bin/bash

