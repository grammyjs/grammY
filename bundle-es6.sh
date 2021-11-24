#!/bin/sh

if [ -n $INSTALL_DENO ]; then
    curl -fsSL https://deno.land/x/install/install.sh | sh
fi

deno --version
