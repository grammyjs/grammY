#!/bin/bash

set -e

echo "Cleaning output directory"
rm -rf bundles
mkdir bundles

echo "Caching and bundling source code"
deno cache --quiet ../src/mod.ts
echo "Cached ../src/mod.ts"
deno run --unstable --quiet --allow-net --allow-read=../src/ --allow-write=bundles/ \
    bundle-es.ts dev ../src/mod.ts

cores=$(grep -c ^processor /proc/cpuinfo)
echo "Caching and bundling releases using $cores cores"
curl --silent https://cdn.deno.land/grammy/meta/versions.json |
    jq --raw-output '.versions | .[] | select(startswith("v1"))' |
    xargs -P$cores -I% bash -c \
        'deno cache --quiet https://deno.land/x/grammy@%/mod.ts &&
            echo "Cached %" &&
            deno run --unstable --allow-net --allow-write=bundles/ bundle-es.ts %'
echo 'Done.'
echo
echo 'Created output:'
du -ch bundles/*

echo "Copying config file into output directory"
cp -v netlify.toml bundles/
