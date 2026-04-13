#! /bin/bash

npm i 

case "$OSTYPE" in
  linux*)   OS="Linux" ;;
  darwin*)  OS="macOS" ;; 
  msys*)    OS="Windows" ;;
  cygwin*)  OS="Windows" ;;
  *)        OS="unknown" ;;
esac

if [[ "$OSTYPE" -eq "macOS" ]]; then
    npx electron-builder --mac
elif [[ "$OSTYPE" -eq "Linux" ]]; then
    npx electron-builder --linux
elif [[ "$OSTYPE" -eq "Windows" ]]; then
    npx electron-builder --win
fi
