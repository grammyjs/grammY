#!/bin/bash
set -eu

# Cloudflare Workers don't support top-level await
sed -i~ 's/^if (isDeno)/if (false)/' ../src/platform.deno.ts
trap 'mv ../src/platform.deno.ts~ ../src/platform.deno.ts' EXIT

echo "Removing old bundle directory"

if [ -d "out" ]; then
  echo "Found node files. Skipping d2n step"
else
  echo "Running d2n"
  deno task backport
fi

echo "Creating bundle folder"
mkdir -p bundle/out

echo "Generating bundle package.json"
sed 's/".\/out\/mod.js"/".\/out\/grammy.js"/g' ../package.json > bundle/package.json
sed -i 's/"name": "grammy"/"name": "@grammyjs\/web"/' bundle/package.json
sed -i 's/        "prepare": "npm run backport",//' bundle/package.json

echo "Copying node files"
cp -R ../out bundle/
cp ../LICENSE bundle/
cp ../README.md bundle/
shopt -s globstar
rm bundle/**/*.js

echo "Bundling source"
deno bundle ../src/mod.ts bundle/out/grammy.js

echo "Done."