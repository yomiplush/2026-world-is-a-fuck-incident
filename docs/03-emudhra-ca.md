# The eMudhra CA compromise — eight keys, and one of them was `4`

[English](03-emudhra-ca.md) | [**日本語**](03-emudhra-ca.ja.md)

**Not a software vulnerability.** Private keys for eight intermediate CAs of a publicly trusted
certificate authority (eMudhra, India) were compromised. Because they are intermediates, whoever
holds a key can issue a certificate for **any** domain that a browser accepts.

This document was rewritten on 2026-10-22: the first version said "several intermediates" and
named two roots. Both were too vague. The compromise is **eight certificates**, and the reason is
worse than theft — the keys were never strong enough to protect.

## 1. What is actually compromised

Eight intermediate CA certificates, all created in an **April 2025 key-generation ceremony**:

| Type | Certificates |
|---|---|
| TLS, domain validated | `EM DV TLS CA - G3B` (eMudhra BV, Netherlands), `EM DV TLS CA - G3C` (eMudhra Inc, US) |
| TLS, organization validated | `EM OV TLS CA - G3B`, `EM OV TLS CA - G3C` |
| TLS, extended validation | `EM EV TLS CA - G3B`, `EM EV TLS CA - G3C` |
| **Code signing** | `EM OV CS CA - G3B`, `EM OV CS CA - G3C` |

The six TLS CAs chain to `emSign ECC Root CA - G3` (via `emSign Root TLS CA - G3`). **All eight
were also cross-signed by Sectigo's `AAA Certificate Services` root in May 2025** — which is why
the older version of this document named Comodo/AAA: that is the second trust path, still valid
in stores that have not been updated.


### 1.1 The eight certificates, with hashes you can grep for

Cisco Talos reproduces the list from Mozilla's bug report. The full SHA-256 values are in
[`data/2026-10-22`](../data/2026-10-22/) sources and in the Talos and Mozilla posts; the first 24 hex
characters are enough to identify them in a trust store dump.

| Certificate | Holder | CCADB | SHA-256 of SPKI | Issuer |
|---|---|---|---|---|
| `EM EV TLS CA - G3B` | eMudhra BV | `A012304` | `E7568FE6E12331F4FD7DE61D…` | `emSign Root TLS CA - G3` |
| `EM OV TLS CA - G3B` | eMudhra BV | `A012308` | `98B896625C0C230ADEEC3EB2…` | `emSign Root TLS CA - G3` |
| `EM DV TLS CA - G3B` | eMudhra BV | `A012302` | `42C4ACCD12C4F59597925E1A…` | `emSign Root TLS CA - G3` |
| `EM EV TLS CA - G3C` | eMudhra Inc | `A012296` | `432EC25F0D28DE9006D97BF7…` | `emSign Root TLS CA - G3` |
| `EM OV TLS CA - G3C` | eMudhra Inc | `A012300` | `CB6E15165AC802E9B3F993F1…` | `emSign Root TLS CA - G3` |
| `EM DV TLS CA - G3C` | eMudhra Inc | `A012294` | `0164D7CEAE5BB909C272AF15…` | `emSign Root TLS CA - G3` |
| `EM OV CS CA - G3B` | eMudhra BV | `A012306` | `9E39DE2881273ACC225A149C…` | `emSign Root CS CA - G3` |
| `EM OV CS CA - G3C` | eMudhra Inc | `A012298` | `4B2460A466F95FD40113BCDC…` | `emSign Root CS CA - G3` |

Note the issuers: six chain to `emSign Root TLS CA - G3`, the two code-signing CAs chain to
`emSign Root CS CA - G3` — a **different** root from the one most write-ups name.

## 2. Why they broke: the keys are tiny integers

This is the part worth remembering, because it is not a story about an attacker stealing
anything:


### 2.1 The ceremony, in Talos's account

On **2025-04-30** eMudhra ran a key-generation ceremony for **24 subordinate CAs** under
`emSign Root TLS CA - G3`, cross-signed by `Comodo AAA Certificate Services`. A flaw in the
**wrap/unwrap step** produced a *second* set of P-384 keys — this time with 3–8 bits of entropy
instead of 384 — and those weak keys were the ones used for eight of the intermediates. Both Talos
and Ars Technica report the values, and Ars lists all eight: **4, 56, 66, 115, 155, 156, 230, 237**.

The proof that this was not theoretical: an informal advisory at `emudhra.we-have-a-problem.com`
carried the message *"We have a problem here – Wayne."* **digitally signed with the private key of
one of the certificates** (Ars Technica). Publishing a signature made with a key that is supposed
to be secret is the whole argument in one line.

- These are elliptic-curve keys on **P-384**. A private key is just an integer `d`; the public
  key is `d × G`.
- The ceremony generated `d` with **insufficient randomness**, so `d` is a *small* number.
- Scott Helme recovered all eight from the public certificates **in under a second on a laptop**.
  He reports one key is `4`, another `56`, another `115`.
- Ian Carroll's summary on the report thread: *"inherently weak single-byte keys that anyone can
  factor, and the issue cannot be contained."*

So the correct model is not "someone may hold these keys". It is **"everyone has these keys"**.
Revocation is the only remedy; there is no detection to write, and no rotation schedule that
helps.

## 3. Timeline (UTC, from the vendors' own posts)

| When | What |
|---|---|
| 2026-10-17 18:05 | Chrome Root Program receives the report from a researcher |
| 2026-10-17 19:45 | Chrome finishes corroborating and ships a **CRLSet** update blocking the **SPKI hashes** (no browser restart needed) |
| 2026-10-17 20:06 | Mozilla receives the report |
| 2026-10-17 22:59 | Mozilla's **OneCRL** update has reached all standard Firefox installs |
| 2026-10-19 ~22:00 | Android / Googlebooks receive the equivalent block via **Google Play Services** |
| 2026-10-20 | Chrome and Mozilla publish; Chrome removes **`emSign ECC Root CA - G3`** from the Chrome Root Store and updates CT logs to reject chains to these CAs |
| 2026-10-21 | eMudhra publishes its statement; Firefox 158.0.1, ESR 115.43.1 and ESR 153.5.1 ship, NSS 3.131.1 drops the root |

Blocking by **SPKI hash** rather than by certificate serial is the reason the response worked
this fast: it kills every certificate that shares the key, including ones nobody has seen yet.

## 4. How bad is it for TLS? The vendors say: contained

- eMudhra: none of the affected intermediates were deployed in production **except one**, and
  **none of them — including that one — ever issued an end-entity certificate**; corroborated by
  public CT logs on crt.sh.
- Chrome: **no TLS certificate chaining to the six TLS intermediates had been logged to
  Certificate Transparency** before the block, so no fraudulent certificate could have been
  trusted by a CT-enforcing client (Chrome, Android apps, and anything else that enforces CT).
- CT logs themselves now reject chains to these CAs.

That is a genuinely reassuring outcome for HTTPS. **But read the caveat in §5 before you relax.**

## 5. The caveat: CT does not cover code signing

Two of the eight are **code-signing** CAs. Certificate Transparency is a TLS mechanism; there is
no public log of code-signing certificates. So:

- "No CT entries for these CAs" tells you nothing about the two code-signing CAs.
- A forged code-signing certificate is not a phishing problem; it is **"this binary is signed by a
  trusted publisher"** on Windows/macOS/Java/.NET verification paths.
- eMudhra says those CAs issued no end-entity certificates either, and that claim is
  checkable only against their own records — not against a public log.

Practically: treat any artifact signed by an `EM OV CS CA - G3*` chain between April 2025 and
October 2026 as untrustworthy until re-verified, and expect platform vendors to tighten
code-signing validation for these chains. If you *are* a signer using these CAs, get a
replacement certificate from another CA and re-sign; timestamping does not save you here, because
the key that signed is forgeable, not merely stolen.


## 5.5 How big is the cleanup? "Bigger than Heartbleed", per Go's crypto maintainer

Cisco Talos and Ars Technica both widen the frame beyond browsers:

- **What is blocked already**: Chrome, Mozilla and Apple blocked the six TLS intermediates;
  **Microsoft blocked the two code-signing ones**. eMudhra revoked the certificates and stopped
  issuing under the G3 root (Talos).
- **What is not**: anything that ships its own trust store and never applies revocation —
  Docker images, Kubernetes nodes, Terraform and Prometheus builds, Python `certifi` copies,
  unmaintained CLI tools, IoT firmware, and "forgotten Linux machines".
  Filippo Valsorda (Go cryptography maintainer) to Ars: *"This will be a massive cleanup job,
  bigger than Heartbleed… There will be a very, very long tail."*
- **Why Go treated it as a vulnerability at all**: Go implements X.509 verification itself
  (`crypto/x509`) instead of deferring to OpenSSL, so the denylist had to ship in the runtime.
  That is `CVE-2026-111943`, fixed in **Go 1.27.3 / 1.26.10**, filtering chains by the SHA-256 of
  the SPKI for all eight certificates (Talos).
- **The sharpest near-term risk is not the browser**: Talos and Ars both point at **VPN clients**
  and other non-browser TLS consumers, especially where a government is plausibly intercepting.

That is the difference between "the browsers handled it" and "it is handled". The browsers handled
*theirs*.

## 6. Who shipped a fix, and what "fixed" means

| Layer | What changed |
|---|---|
| **Go** | `crypto/x509` denylists these intermediates: `Verify` now errors on chains containing them. Commit `7f86f95` (2026-10-19), **CVE-2026-111943**, handled on Go's URGENT track. Fixed releases reported as **1.27.3 / 1.26.10** |
| **Chrome / Android** | CRLSet (SPKI block) + `emSign ECC Root CA - G3` removed from the Chrome Root Store + CT logs reject the chains |
| **Firefox / NSS** | OneCRL block; Firefox **158.0.1**, ESR **115.43.1**, ESR **153.5.1**; **NSS 3.131.1** removes the root (protects apps that use Mozilla's store but not OneCRL) |
| **Node.js** | The October releases (**22.23.4 / 24.22.1 / 26.12.1** (see `02`)) refreshed the bundled CA list |
| **Python** | `certifi` **2026.10.19** |
| **Rust** | `webpki-roots` **1.0.10** |
| **PHP** | `composer/ca-bundle` **1.6.0 / 1.4.16** |
| **Linux distros** | Ubuntu **USN-8944-1 / USN-8944-2**, Debian **DSA-6572-1**, Red Hat **RHSB-2026-012**, Homebrew `ca-certificates` |
| **Independent summary** | Scott Helme's analysis of the weak keys (link in §8) |

Anything that bundles its own trust store must be updated **individually** — a patched OS does
not fix a Go binary built with `crypto/x509` from before that commit, nor a Node image with an
old `ca-certificates`, nor a Python venv with an old `certifi`.

## 7. What to do

### 7-1. Decide whether you are in scope

The Red Hat framing still holds — all three must be true for TLS interception to be possible:

1. Your trust store trusts one of these intermediates (true unless updated).
2. An attacker holds a key (they do — **anyone** does).
3. The attacker can intercept the TLS connection (network position, or a compromised peer).

Condition 1 is the one you control. Condition 2 is now permanently true, which is what makes this
different from a normal key theft.

### 7-2. Update the layers you actually own

```bash
# OS trust store
sudo apt install --only-upgrade ca-certificates      # Debian/Ubuntu
sudo dnf upgrade ca-certificates                     # RHEL/Fedora
sudo pacman -Syu ca-certificates                     # Arch

# Runtime-bundled stores — each is separate
python3 -c 'import certifi; print(certifi.__version__)'   # want 2026.10.19+
go version                                                # want 1.27.3 / 1.26.10+
node -p 'process.versions.openssl'                        # after a Node upgrade
composer show composer/ca-bundle 2>/dev/null | head -2
# Java keeps its own cacerts (keytool -list); rebuild images rather than editing it
```

### 7-3. Check for direct trust and pinning

```bash
trust list 2>/dev/null | grep -i -A3 emudhra   # p11-kit
grep -ril emudhra /etc/ssl/certs/ 2>/dev/null | head
openssl version -d                             # which bundle you are actually using
```

If any application pins an eMudhra intermediate, remove the pin. If your own service certificate
was issued by an eMudhra CA, **get it reissued by another CA** — the root removal means some
legitimate chains will stop working, and Chrome said so explicitly.

### 7-4. Do not do this

- Do not "wait and see". The trust decision has already been made by browsers; your hosts are the
  ones still trusting.
- Do not treat `ca-certificates` as the whole fix. Count the trust stores you ship: OS, language
  runtime, container base image, appliance firmware, `.NET`, Java `cacerts`.
- Do not describe a CRL/OneCRL block as remediation for code signing (§5).

## 8. Sources

- Cisco Talos, "Compromised eMudhra intermediate certificates" (2026-10-21) — the eight
  certificates with CCADB ids, the ceremony and wrap/unwrap cause, Microsoft's block of the two
  code-signing CAs, Go's CVE and fixed versions:
  <https://blog.talosintelligence.com/compromised-intermediate-certificates/>
- Ars Technica, "The Internet goes on high alert after discovery of 8 compromised TLS certs"
  (2026-10-20) — the eight key values, the signed "We have a problem here – Wayne" message,
  Valsorda's Heartbleed comparison and the long-tail list (secondary reporting, clearly marked):
  <https://arstechnica.com/security/2026/10/the-internet-goes-on-high-alert-after-discovery-of-8-compromised-tls-certs/>
- Mozilla bug report (source of the certificate table):
  <https://bugzilla.mozilla.org/show_bug.cgi?id=2083449>
- Informal advisory site referenced by both: <https://emudhra.we-have-a-problem.com/>
- Google (Chrome Root Program), 2026-10-20 — SPKI blocking, CT statement, root removal:
  <https://blog.google/security/protecting-chrome-and-android-users-from-compromised-emudhra-intermediate-ca-certificates/>
- Mozilla Security Blog, 2026-10-20:
  <https://blog.mozilla.org/security/2026/10/20/protecting-firefox-users-following-the-compromise-of-emudhra-intermediate-certificates/>
- eMudhra statement (updates 1–n, 2026-10-20/21), which also quotes Mozilla's timeline:
  <https://emudhra.com/en/post/certificate-security-incident>
- Scott Helme — recovering the keys, with the small-integer explanation:
  <https://scotthelme.co.uk/eight-bits-of-trust-emudhras-ca-keys-cracked-in-milliseconds/>
- Go: commit `7f86f957633ee31a1c17a1eb8452ca7a3d9bc141`,
  issue <https://github.com/golang/go/issues/82345>, CVE-2026-111943
  (<https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-111943>)
- Downstream: <https://pypi.org/pypi/certifi/json>, <https://ubuntu.com/security/notices/USN-8944-1>,
  <https://security-tracker.debian.org/tracker/DSA-6572-1>,
  <https://access.redhat.com/security/vulnerabilities/RHSB-2026-012>
- Secondary, for the eight-certificate list and scope: The Hacker News,
  <https://thehackernews.com/2026/10/eight-emudhra-ca-keys-compromised.html>
