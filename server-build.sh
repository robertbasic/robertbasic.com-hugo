#!/bin/bash

cd /home/robert/robertbasic.com
git fetch && git pull
status=$(git status)
if [[ "$status" == *"Your branch is up to date with 'origin/master'."* ]]; then
    exit 0
fi

./node_modules/.bin/postcss --env=production -o themes/robertbasic.com/static/css/main.css themes/robertbasic.com/static/css/tailwind/*.css
./hugo

rsync -rau /home/robert/robertbasic.com/public/ /var/www/robertbasic.com/public
