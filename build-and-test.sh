#!/usr/bin/env bash
set -euxo pipefail

npm run build
npm run test
npm run test:integ
npm run test:cli
