#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/.."
npm install
dotnet restore src/Backend/Bonix.slnx
