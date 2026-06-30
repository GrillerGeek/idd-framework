---
description: Launch the Forge web UI to browse and edit IDD artifacts in this repo
argument-hint: "[--port <number>] [--no-open] [--docs <path>]"
allowed-tools: "Bash(npx *) BashOutput"
---

Launch Forge — the local web UI for browsing, editing, and managing the IDD artifacts in this repository.

Forge reads `./docs/` relative to its working directory, runs an Express server (default port 4000, auto-increments if busy), and opens the user's browser automatically.

**Steps:**

1. Start Forge as a **background** process in the **repository root** (so it reads the correct `docs/` directory). Use the Bash tool with `run_in_background: true` and pass any `$ARGUMENTS` straight through:

   ```
   npx --yes @jasonrobey/idd-forge $ARGUMENTS
   ```

   Forge runs until the user stops it — do **not** wait for the process to exit.

2. Use BashOutput once (or twice with a short gap) to capture the URL Forge prints on startup, then report it to the user along with the background shell ID so they know how to stop it.

3. If the process exits with an error, surface the error verbatim and stop. Common causes:
   - Node < 20 (Forge requires Node 20+).
   - Registry/install failure (transient network, or `@jasonrobey/idd-forge` not yet reachable on the public npm registry).

**Optional flags to surface to the user only if relevant:**

- `--no-open` — skip auto-opening the browser (useful for remote/headless environments).
- `--port <n>` — pin a specific port.
- `--docs <path>` — point Forge at a non-default docs directory.

Forge live-reloads on YAML changes, so it remains useful in another tab while the user keeps running `/idd-framework:*` commands in this session.
