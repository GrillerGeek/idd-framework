#!/bin/bash
# SPDX-License-Identifier: Apache-2.0
set -euo pipefail
probe_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cat "$probe_dir/../references/message.txt"
