#!/bin/bash
set -euo pipefail
IFS=$'\n\t'

function build() {
  local red="\033[1;31m";
  local reset="\033[0m";
  local env=$1

  echo "========================================="
  printf "Building ${red}$env${reset} extension...\n"

  gulp --env=$env --silent && google-chrome --pack-extension=dist && mv dist.crx "build/$env/mozsaico.crx" && mv dist.pem "build/$env/mozsaico.pem" || printf "Error building ${red}$env${reset} extension\n"

  printf "${red}$env${reset} extension successfully built!\n"
  export id=`cat "build/$env/mozsaico.pem" | openssl rsa -pubout -outform DER | openssl dgst -sha256 | awk '{print $2}' | cut -c 1-32 | tr '0-9a-f' 'a-p'`
  printf "Your ${red}$env${reset} extension id is: $red$id$reset\n"
  echo $id > "build/$env/mozsaico.id"
  printf "=========================================\n\n\n"
}

build development && build staging && build production
