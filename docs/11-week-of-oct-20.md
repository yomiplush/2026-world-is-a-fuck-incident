# One week, seven items — a joke list, checked

[English](11-week-of-oct-20.md) | [**日本語**](11-week-of-oct-20.ja.md)

On 2026-10-22 the account **vx-underground** posted a list of the week's incidents and ended it
with *"What does this all mean? Idk"*. That is a fair summary of a genuinely confusing week, so
this document treats the list as an **index to be checked**, not as a source:

| # | The post says | What it actually is | Where | Status |
|---|---|---|---|---|
| 1 | "PHP2shell, leak, bad stuff" | two RCEs in PHP core, details leaked before release | [`01`](01-php2shell.md), timeline in [`00`](00-timeline.md) | confirmed |
| 2 | "Something about Railway?" | PaaS incident: customer environment variables (i.e. secrets) may have been decrypted | §2 below | confirmed by the vendor |
| 3 | "The number 4 is a valid cert" | eMudhra CA private keys were **small integers** — one is literally `4` | [`03`](03-emudhra-ca.md) | confirmed |
| 4 | "NodeJS and something about broccoli?" | Node.js October releases (also carried the CA-bundle update) | [`02`](02-nodejs-oct2026.md) | Node part confirmed; **"broccoli" not found** |
| 5 | "LiteLLM supply chain attack" | `litellm` 1.107.0 wheels execute a stealer on any Python start | [`10`](10-litellm-1-107-0.md) | confirmed |
| 6 | "GitLab CVSS 10" | unauthenticated RCE in self-managed GitLab, every release since 7.0 | [`09`](09-gitlab-19-5-1.md) | confirmed |
| 7 | "OpenCode leaking API keys" | Console incident: provider keys exposed, user keys revoked | §3 below | **reported, not published by the vendor** |

The post itself is a secondary source with no method, published on a social platform. Quoted
here because the *list* is a useful checklist — every row still has to survive its own
fact-check, and two of the seven did not fully.

## 1. Where the list came from

The post (vx-underground, 2026-10-22) reads:

> Today silly shenanigans:
> - PHP2shell, leak, bad stuff
> - Something about Railway?
> - The number 4 is a valid cert
> - NodeJS and something about broccoli?
> - LiteLLM supply chain attack
> - GitLab CVSS 10
> - OpenCode leaking API keys
>
> What does this all mean? Idk

It is written as a joke, and the jokes are accurate in a specific way: item 3 is funny because
it is true. That is why it works as an index — but not as evidence. Nothing in this repository
cites it for a fact.

## 2. Railway — environment variables, which is to say secrets

**Primary source**: Railway's own disclosure,
<https://blog.railway.com/p/security-disclosure-wednesday-october-21st> (2026-10-21, Jacob Cooper).

What Railway says:

- It detected anomalous activity in **systems that store customer environment variables**.
- An unauthorised third party **may have accessed encrypted environment variables and, for some,
  obtained the decrypted contents**.
- Environment variables are exactly where API keys, database URLs and registry credentials live.
- Railway believes this is **part of a series of attacks on platform companies aimed at
  compromising AI inference providers**, and has asked upstream providers to revoke keys
  proactively.
- **All deployments were paused** during the investigation.
- Initial analysis suggests a subset of users, but **all users** are told to roll credentials.

A platform telling you "rotate everything" is the highest-value sentence in an incident like
this, and Railway followed it with a checklist on 2026-10-22 — one post per credential type:

| Rotate / check | Railway's guidance |
|---|---|
| AWS | check for anomalous access |
| GCP | check for anomalous access |
| GitHub | check for anomalous access, and reconnect after the credential reset |
| MongoDB / MySQL / Redis | rotate database credentials |
| Stripe | check for unexpected usage |
| OpenAI / Anthropic / Grok / OpenRouter | check for unexpected usage |
| Object storage | redeploy buckets |

**If you deploy on Railway**: treat every value in every service's variables as compromised —
that includes the ones you forgot were there (SMTP passwords, webhook signing secrets, `JWT_SECRET`,
session keys, third-party API tokens). Rotating the database password but leaving an S3 key in an
env var is the normal way this goes wrong. Then read the logs for the window, because a stolen
key used against a provider does not touch your application logs at all — it shows up in the
*provider's* dashboard.

## 3. OpenCode — an undisclosed breach, and a separate repo leak

Two different things are being conflated in the list.

**3-1. The Console incident (reported by users).** Subscribers report that their API keys were
revoked with `401 api_key_expired` starting **2026-10-17 23:31 UTC**, that all workspaces were
restricted from the same date, and that the incident is described as a **"Console breach"** in
which third-party provider keys may have been exposed. Representative reports:

- `anomalyco/opencode#56833` — "Go subscriber: key revoked with no expiry date set; no formal
  compensation policy published for the Console breach" (2026-10-18)
- `anomalyco/opencode#56703` — "Console: all workspaces restricted since Oct 17, no breach email
  received" (2026-10-18)

What the vendor has published: **nothing, as far as this repository could find** on 2026-10-22.
Responses in both issues redirect to `help@anoma.ly`, and the public status page shows only
inference slowness/error rates — no breach entry, no postmortem. So the correct status is
**"reported by affected users, acknowledged only privately"**. Do not upgrade that to "confirmed
by the vendor" without a link.

**3-2. The repository secret leak (confirmed).** Separately, `anomalyco/opencode#56819`
(2026-10-18) reported secrets in the source tree; the project's own bot confirmed the finding: a
hardcoded **Daytona API key** in `daytona.ts` (line 15) from commit `0bedea52b`, and a Google API
secret in a test recording file. That is a hygiene failure, not a user-data breach — but it is
how supply-chain access starts, which is the same lesson as §2 of [`10`](10-litellm-1-107-0.md).

**If you use OpenCode**: rotate the provider keys you gave it (Anthropic, OpenAI, Google,
OpenRouter), check provider dashboards for usage you did not make, and do not treat a revoked
key as "the incident is handled" — revocation stops the attacker and stops you.

## 4. What could not be verified

- **"NodeJS and something about broccoli"** — the Node.js part is [`02`](02-nodejs-oct2026.md)
  (22.23.4 / 24.22.1 / 26.12.1, plus a CA-bundle update). No primary source was found for a
  "broccoli" incident in October 2026: the `broccoli` npm package was last modified 2025-11-11,
  and the GitHub Advisory Database has no entry for it. Either it refers to something not public,
  or it is a joke about a different thing entirely. **Recorded as unverified rather than
  guessed at.**
- **"The number 4"** is verified, but note what it verifies: not that a certificate with value
  `4` exists, but that the *private key* was the integer 4. See [`03`](03-emudhra-ca.md) §2.

## 5. What it all means

The list looks like seven unrelated things. It is really **two groups and one thread**.

- **Conventional vulnerability work** (1, 6): a memory-safety class bug in a widely deployed
  runtime or server. Fix by patching, verify by version, expect a long tail of unpatched hosts.
- **Trust material** (3): PKI. Fix by shipping updated trust stores and revoking.
- **Credential theft** (2, 5, 7): this is the group that actually defines the week. Railway
  says it out loud — *attacks on platform companies to reach AI inference providers* — and the
  other two fit the same shape: an AI gateway holding many provider keys (LiteLLM), and an AI
  coding tool whose Console held provider keys (OpenCode).

The thread is that **the valuable target in 2026 is the key, not the box**. RCE gets you a host;
a stolen `ANTHROPIC_API_KEY` or a cloud role gets you someone's bill, their data, and a quiet
position inside their AI pipeline, with no exploit to detect. Three of the seven items are the
same attack played against three different key stores.

Practically, that reorders the work:

1. **Inventory what holds provider keys**, then treat those systems as crown jewels: Railway
   env vars, LiteLLM/other gateways, AI coding tools, CI secrets.
2. **Rotate on suspicion, not on proof.** For credential theft, "we have no evidence" is the
   normal starting state — Railway did not wait for proof before pausing deployments and telling
   customers to roll keys.
3. **Put the alerting where the keys are used**, not only where they are stored: provider
   dashboards (spend and usage anomalies), cloud audit logs (`GetCallerIdentity`,
   `AssumeRole`), and GitHub audit logs for release workflows.
4. **Assume the same trick repeats.** LiteLLM was compromised twice in seven months with the
   same `.pth` mechanism; pinning and hashes are the only controls that survived contact with
   reality here.

## 6. Sources

- vx-underground post, 2026-10-22 — secondary, quoted above; used as an index only
- Railway disclosure: <https://blog.railway.com/p/security-disclosure-wednesday-october-21st>
  and the 2026-10-22 recommendation posts listed on <https://blog.railway.com>
- Railway status: <https://status.railway.com>
- OpenCode user reports: <https://github.com/anomalyco/opencode/issues/56833>,
  <https://github.com/anomalyco/opencode/issues/56703>
- OpenCode repo secret leak (confirmed by the project): <https://github.com/anomalyco/opencode/issues/56819>
- OpenCode status (no breach entry as of 2026-10-22): <https://status.opencode.ai>
- The four incidents with their own documents: [`01`](01-php2shell.md), [`02`](02-nodejs-oct2026.md),
  [`03`](03-emudhra-ca.md), [`09`](09-gitlab-19-5-1.md), [`10`](10-litellm-1-107-0.md)
