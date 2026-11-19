#!/bin/bash
set -e

yarn build
git add .
git commit -m "Update site"
git push

ssh giglistc@giglist.com.au \
  'cd /home/giglistc/public_html/giglist-react && bash -e ./pull.sh'