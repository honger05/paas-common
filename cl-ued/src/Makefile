
build:
	@spm-sea

deploy:
	@rm -rf ../dist
	@mkdir  ../dist
	@mkdir  ../dist/1.0.3
	@cp     dist/**/**/**/*.* ../dist/1.0.3
	@rm -rf dist
	@rm -rf spm_modules
	@echo
	@echo   " deploy to cl-ued/dist/1.0.3"
	@echo

one:
	@make build
	@make deploy