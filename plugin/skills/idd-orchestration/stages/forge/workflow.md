---
name: idd-forge
license: Apache-2.0
description: Launch the Forge web UI for this project's IDD artifacts, with literal optional port/docs arguments, an observable background process and startup error reporting.
---

# Launch Forge

Use this skill when the user wants the local Forge artifact browser/editor. Resolve the consuming project root as the working directory. Installing this skill creates no artifacts; launching does not authorize editing artifacts. The published app is launched with `npx --yes @jasonrobey/idd-forge`. It requires Node 20 or newer and may acquire the package from npm. Preserve the user's configured host/model. No additional IDD npm dependency or global installation is needed.

## Validate before launch

Accept only these optional arguments, each at most once:

- `--port <integer>`: decimal integer from 1 through 65535.
- `--no-open`: disable automatic browser opening.
- `--docs <path>`: one nonempty literal path, including spaces; preserve its value.

Reject unknown/duplicate flags, missing values and invalid ports before starting a process. Parse arguments as tokens, not executable source; shell metacharacters in values are data. Prefer a native argv interface. If the tool takes shell text, quote **each** argv safely for that shell (for POSIX shells use single quotes and encode an embedded single quote as `'\''`). JSON string encoding is not shell escaping. Never interpolate raw user text or execute substitutions. Explain invalid input without creating files or guessing a corrected value.

Confirm Node/npx and a real host capability to keep a process running while inspecting its output. Use only actual available tools; a background process/session tool may return a task or terminal handle. If none exists, give the exact safely quoted command for the user to run in a terminal and state that launch did not happen. Do not invent tool names, session IDs or process state. Do not silently substitute a public executable if an explicitly supplied controlled fixture is unavailable.

## Start and inspect

Launch the validated argv from the consuming root through the native background/process capability. Retain its returned handle and launch command identity. Inspect startup output and running/exited state within **30 seconds**, without waiting for the server's normal exit. A live terminal that yields a real session handle is suitable; an unobservable detached shell is not sufficient evidence. The app normally uses port 4000 and may increment when busy: report the **actual printed URL**, never a predicted port.

If startup succeeds, report the URL and the real owned handle/PID, plus precise stop instructions using that native handle. If only an actual child PID is available, verify it belongs to this launch and provide PID-specific stop guidance. Never kill by process-name or port matching. Preserve any pre-existing servers. Leave the successfully observed process running for the user; do not claim it will survive client/session closure unless actually established.

If startup exits, surface the useful exact error and exit state; do not report success. Typical causes include Node version, unavailable npx, registry/install failure or invalid docs path. If no startup confirmation arrives within 30 seconds, stop only this owned launch through its handle, verify its exit if possible and report timeout plus partial state. If cleanup cannot be confirmed, state that and identify the owned handle for recovery. Do not launch another instance to conceal a failed one.

Do not write scratch files, initialize hierarchy directories, change project dependencies/settings, repair artifacts, or open an unrelated browser. The app controls its own browser opening unless `--no-open` is supplied. A controlled test launcher proves process/argument behavior only; distinguish it from the published Forge UI and native plugin alias integration.
