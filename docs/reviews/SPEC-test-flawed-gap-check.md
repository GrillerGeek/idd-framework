BLOCKED — 3 blockers, 0 warnings

---

## GC-1

**Severity:** Blocker
**Spec block(s):** expectations (EXP-fx01, validation)
**Quoted text:** "The preference update performs well under load."
**Why an implementer must guess:** This criterion has no measurable threshold, no unit, and no pass/fail condition. One implementor might interpret "performs well" as "completes in under 200ms at 10 req/s"; another might interpret it as "does not time out under 1,000 concurrent users." Both implementations satisfy the literal criterion. The divergence is not stylistic — the two implementors would write materially different validation tests and make different database-layer design choices (e.g., whether to add an index, whether to use a connection pool). This is a direct divergence in what constitutes a passing implementation.
**Resolving question:** What measurable performance threshold must the preference update satisfy — specifically: what operation latency (p95 or p99), at what request rate, and what is the pass/fail boundary?

---

## GC-2

**Severity:** Blocker
**Spec block(s):** expectations (EXP-fx02, edge_cases)
**Quoted text:** "User submits a valid preferences read request and receives the correct preferences in the response." and "User submits preferences read request that is valid and receives a preferences object in the response."
**Why an implementer must guess:** Both edge cases are restatements of the happy-path description with minor wording variation. Neither describes a boundary condition, error state, or input that differs meaningfully from the happy path. An implementor looking for boundary tests would find none — they would either (a) skip boundary testing entirely because no boundaries are named, or (b) invent their own boundary scenarios. Two implementors will produce tests covering completely different edge conditions (e.g., one tests a deactivated user, another tests a missing JWT). The coverage gap is not recoverable by convention; different implementors will diverge on which boundaries matter.
**Resolving question:** What are the two semantically distinct scenarios beyond the happy path that this GET endpoint must handle correctly — for example, what happens when the requesting user's account is in a non-active state, or when the preferences record does not yet exist for the userId?

---

## GC-3

**Severity:** Blocker
**Spec block(s):** boundaries, deliverables
**Quoted text:** Boundaries: "Do not modify any files under src/notifications/ — that module is owned by the push-notification service team and is out of scope for this Spec." Deliverables: "src/notifications/preferences.ts — New service file implementing getNotificationPreferences(userId) and updateNotificationPreferences(userId, prefs)."
**Why an implementer must guess:** The Boundaries block explicitly prohibits all modifications to src/notifications/, while the Deliverables block requires creating a new file at src/notifications/preferences.ts. Creating a file is a modification to the directory. An implementor cannot satisfy both requirements simultaneously. One implementor will interpret the Boundary as overriding the Deliverable and skip the file (producing a broken implementation with no service layer). Another will interpret the Deliverable as more specific and create the file (violating the Boundary). A third will create the file at a different path (adding an undocumented architectural decision). All three outcomes are divergent.
**Resolving question:** Should src/notifications/preferences.ts be placed at a different path (e.g., src/services/notificationPreferences.ts) so it does not conflict with the src/notifications/ boundary, or should the boundary be narrowed to exclude the preferences.ts file specifically?
