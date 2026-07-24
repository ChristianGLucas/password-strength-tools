# password-strength-tools

Composable [Axiom](https://axiomide.com) nodes for realistic password-strength
estimation, wrapping the MIT-licensed
[`zxcvbn-ts`](https://github.com/zxcvbn-ts/zxcvbn) library — a maintained
TypeScript rewrite of Dropbox's original `zxcvbn` algorithm.

Built for the Axiom marketplace (`christiangeorgelucas/password-strength-tools`).

## Use it from your agent or app

Every node in this package is a **live, auto-scaling API endpoint** on the
[Axiom](https://axiomide.com) marketplace — call it from an AI agent or your own
code, with nothing to self-host.

**📦 See it on the marketplace:**
https://dev.axiomide.com/marketplace/christiangeorgelucas/password-strength-tools@0.1.1

**Hook it up to an AI agent (MCP).** Add Axiom's hosted MCP server to any MCP
client and every node becomes a typed tool your agent can call — search the
catalog, inspect a schema, and invoke it directly.

```bash
# Claude Code
claude mcp add --transport http axiom https://api.axiomide.com/mcp \
  --header "Authorization: Bearer $AXIOM_API_KEY"
```

Claude Desktop, Cursor, or any config-based client:

```json
{
  "mcpServers": {
    "axiom": {
      "type": "http",
      "url": "https://api.axiomide.com/mcp",
      "headers": { "Authorization": "Bearer YOUR_AXIOM_API_KEY" }
    }
  }
}
```

**Call it from the CLI.**

```bash
axiom invoke christiangeorgelucas/password-strength-tools/EstimateStrength --input '{ ... }'
```

**Call it over HTTP.**

```bash
curl -X POST https://api.axiomide.com/invocations/v1/nodes/christiangeorgelucas/password-strength-tools/0.1.1/EstimateStrength \
  -H "Authorization: Bearer $AXIOM_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{ ... }'
```

> Input/output schema for each node is on the marketplace page above, or via
> `axiom inspect node christiangeorgelucas/password-strength-tools/EstimateStrength`.

### Get started free

Install the CLI:

```bash
# macOS / Linux — Homebrew
brew install axiomide/tap/axiom

# macOS / Linux — install script
curl -fsSL https://raw.githubusercontent.com/AxiomIDE/axiom-releases/main/install.sh | sh
```

**Windows:** download the `windows/amd64` `.zip` from the
[releases page](https://github.com/AxiomIDE/axiom-releases/releases), unzip it,
and put `axiom.exe` on your `PATH`.

Then `axiom version` to verify, `axiom login` (GitHub or Google) to authenticate,
and create an API key under **Console → API Keys**. Docs and sign-up at
**[axiomide.com](https://axiomide.com)**.

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
