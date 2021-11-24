#!/bin/sh

if [ -n $INSTALL_DENO ]; then
    curl -fsSL https://deno.land/x/install/install.sh | sh
    export DENO_INSTALL="/opt/buildhome/.deno"
    export PATH="$DENO_INSTALL/bin:$PATH"
fi

deno --version

mkdir bundles
echo "hello" >bundles/test.txt
