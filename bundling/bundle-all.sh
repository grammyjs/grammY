#!/bin/bash

set -e
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

echo "Cleaning output directory"
rm -rf bundles
mkdir bundles

echo "Caching and bundling source code"
deno cache --quiet $SCRIPT_DIR/../src/mod.ts
echo "Cached $SCRIPT_DIR/../src/mod.ts"
deno run --quiet --allow-env --allow-net --allow-read --allow-write \
    bundle-es.ts dev $SCRIPT_DIR/../src/mod.ts

cores=$(grep -c ^processor /proc/cpuinfo)
echo "Caching and bundling releases using $cores cores"
curl --silent https://cdn.deno.land/grammy/meta/versions.json |
    jq --raw-output '.versions | .[] | select(startswith("v1"))' |
    xargs -P$cores -I% bash -c \
        'deno cache --quiet --no-check https://deno.land/x/grammy@%/mod.ts &&
            echo "Cached %" &&
            deno run --quiet --allow-env --allow-net --allow-read --allow-write bundle-es.ts %'
echo 'Done.'
echo
echo 'Created output:'
du -ch bundles/*

echo "Copying config file into output directory"
cp -v netlify.toml bundles/
