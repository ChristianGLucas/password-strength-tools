# password-strength-tools

Composable [Axiom](https://axiom.co) nodes for realistic password-strength
estimation, wrapping the MIT-licensed
[`zxcvbn-ts`](https://github.com/zxcvbn-ts/zxcvbn) library — a maintained
TypeScript rewrite of Dropbox's original `zxcvbn` algorithm.

Built for the Axiom marketplace (`christiangeorgelucas/password-strength-tools`).

## What this is

Given a candidate password (and optional user-context words like a site
name, username, or email), these nodes return:

- a strength **score** from 0 (weakest) to 4 (strongest)
- an estimated **guess count** (and its log10)
- **crack-time estimates** across four attack scenarios: online throttled
  (100 guesses/hour), online unthrottled (10/s), offline slow-hash
  (10,000/s — bcrypt/scrypt/argon2/PBKDF2-class), and offline fast-hash
  (10 billion/s — raw MD5/SHA or GPU cracking)
- **actionable feedback** — a warning about the dominant weak pattern plus
  concrete suggestions
- the **matched-pattern breakdown**: which dictionary, spatial/keyboard,
  repeat, sequence, date, or regex pattern the password matched, and where

## Nodes

| Node | Purpose |
|---|---|
| `EstimateStrength` | Full strength report for one password: score, guesses, crack times, feedback, and the matched-pattern sequence. |
| `CheckPolicy` | Pass/fail policy gate for a signup or password-change form: same analysis, compared against a `min_score` threshold, returning `meets_policy` plus one actionable `reason`. |

Both nodes share a `password` (required, non-empty) + `user_inputs`
(optional) request shape. An empty password returns a structured `error`
token instead of a crash.

## What this is NOT

This package **estimates strength offline and deterministically**. It:

- **never transmits** the password anywhere — everything runs in-process,
  in memory, using the bundled zxcvbn dictionaries (no network calls);
- **never logs or persists** the password;
- **is not a password hash.** A strength score is not a substitute for
  hashing a password for storage — pair a real password hash
  (bcrypt/scrypt/argon2) with this package's `CheckPolicy` gate at
  signup/change time; this package plays no part in hashing or storage.

## License

MIT. Wraps `@zxcvbn-ts/core`, `@zxcvbn-ts/language-common`, and
`@zxcvbn-ts/language-en` (all MIT), and their sole transitive dependency
`fastest-levenshtein` (MIT).
