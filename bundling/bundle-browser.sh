#!/bin/bash
set -eu

# Cloudflare Workers don't support top-level await
sed -i~ 's/^if (isDeno)/if (false)/' ../src/platform.deno.ts
trap 'mv ../src/platform.deno.ts~ ../src/platform.deno.ts' EXIT

echo "Removing old bundle directory"
rm -rf bundle/out

if [ -d "../out" ]; then
  echo "Found node files. Skipping d2n step"
else
  echo "Running d2n"
  deno task backport
fi

echo "Creating bundle folder"
mkdir -p bundle/out

echo "Generating bundle package.json"
jq '. + {
  "name": "@grammyjs/web",
  "dependencies": {},
  "scripts": {},
}' <../package.json >bundle/package.json

echo "Copying node files"
cp -rv ../LICENSE ../README.md ../out bundle/
shopt -s globstar
rm bundle/**/*.js

echo "Bundling source"
deno bundle ../src/mod.ts bundle/out/mod.js

echo "Done."
