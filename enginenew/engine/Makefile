.PHONY: init
init:
	@echo '安装依赖...'
	docker run -v $(shell pwd):/app -w /app -it --rm node:11.15 npm i

.PHONY: run
run:
	@echo '启动编辑器...'
	docker run -v $(shell pwd):/app -w /app --rm -it -p 5002:5002 -v /Users/jesse/Downloads/tempProject:/project node:11.15 node editorservice/StartService.js

.PHONY: run-test
run-test:
	@echo '启动编辑器用于测试...'
	docker run --rm -it -p 5002:5002  -v /data/engine:/app -w /app -v /data/ossfs/test/w3qqh7th:/project node:11.15 node editorservice/StartService.js --notOpenProjectPage --path /project
