#!/bin/sh

if [ -z "$DENO_INSTALL" ]; then
    echo "Installing Deno"
    curl -fsSL https://deno.land/x/install/install.sh | sh
    export DENO_INSTALL="/opt/buildhome/.deno"
    export PATH="$DENO_INSTALL/bin:$PATH"
else
    echo "Existing Deno installation found at $DENO_INSTALL"
fi

deno --version
deno run --unstable --allow-net --allow-run --allow-read=.. --allow-write=bundles/ bundle-es6.ts
cp -v netlify.toml bundles/
