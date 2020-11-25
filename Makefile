.PHONY: css
css:
	node_modules/.bin/postcss --env=production -o themes/robertbasic.com/static/css/main.css themes/robertbasic.com/static/css/tailwind/*.css
