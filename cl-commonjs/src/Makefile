
build:
	@spm-sea

deploy:
	@rm -rf ../dist
	@mkdir  ../dist
	@mkdir  ../dist/1.1.3
	@cp     dist/**/**/**/*.* ../dist/1.1.3
	@rm -rf dist
	@echo
	@echo   " deploy to cl-commonjs/dist/1.1.3"
	@echo

one:
	@make build
	@make deploy