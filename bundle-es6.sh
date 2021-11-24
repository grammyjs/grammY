#!/bin/sh

if [ -z $INSTALL_DENO ]; then
    curl -fsSL https://deno.land/x/install/install.sh | sh
fi

deno --version
