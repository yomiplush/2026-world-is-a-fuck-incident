# The eMudhra intermediate-CA key compromise (October 2026)

[**English**](03-emudhra-ca.md) | [日本語](03-emudhra-ca.ja.md)

**This is not a software vulnerability.** The private keys of intermediate CA certificates issued by
the public CA eMudhra were compromised. It affects the TLS chain of trust, so server operators are
in scope.

## 1. What happened

- The **private keys of several eMudhra intermediate CA certificates were compromised**.
- Those intermediates are signed by two roots:
  - **Comodo AAA Services root**
  - **emSign ECC Root CA - G3**
- With a private key, an attacker can issue **certificates that look valid for any domain**. From a
  man-in-the-middle position, that means decrypting and modifying TLS traffic.

## 2. The three preconditions

Red Hat's summary (RHSB-2026-012) is the clearest:

1. The system's trust store (`ca-certificates` or equivalent) trusts those eMudhra intermediates
2. The attacker holds one of the compromised private keys
3. The attacker is in a network position to intercept TLS connections

**"Compromised" does not mean "your system was compromised".** Without all three there is no
impact. But precondition 1 stays true for everyone until the bundle is updated.

## 3. How the ecosystem responded

| Party | Response |
|---|---|
| Chrome / Android | Stopped trusting the affected certificates |
| Firefox (Mozilla) | Same. Red Hat credits Mozilla for publishing quickly |
| Go | Added a **denylist** in `crypto/x509`; `Verify` returns an error for the known intermediates (**CVE-2026-111943**) |
| Node.js | Shipped a **ca-cert update** in the October releases (22.23.4 / 24.22.1 / 26.12.1) |
| Red Hat | Recommends the `ca-certificates` update for every TLS user |

## 4. What to update (and what not to)

| Layer | Action |
|---|---|
| OS trust store | Update `ca-certificates` (Debian/Ubuntu: `apt install --only-upgrade ca-certificates`; Arch: `pacman -Syu ca-certificates`; RHEL: `dnf upgrade ca-certificates`) |
| Runtimes that bundle their own | Node.js / Go / Python (`certifi`) / Java (`cacerts`) — update the runtime |
| App-level pinning | Check individually. Remove any configuration that explicitly trusts the eMudhra intermediates |

**You do not need to**: change application code, change TLS settings, or reissue certificates
(unless your own certificate was issued by eMudhra — in which case check with that CA).

## 5. How to check

```bash
# is anything eMudhra-shaped left in the system trust store?
trust list 2>/dev/null | grep -i -A3 emudhra   # if p11-kit is present
grep -ril emudhra /etc/ssl/certs/ 2>/dev/null | head
openssl version -d                             # where the bundle lives

# the bundle Node uses
node -e 'console.log(process.versions.openssl)'   # did the version move?
```

The task is not "find a suspicious certificate". It is **"am I still trusting something I should
not?"**. If you monitor Certificate Transparency logs, look for eMudhra-issued certificates for your
own domains.

## 6. Sources

- Red Hat RHSB-2026-012: <https://access.redhat.com/security/vulnerabilities/RHSB-2026-012>
- NVD (Go's tracking ID): <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-111943>
- Node.js October advisory (ca-cert update): <https://nodejs.org/en/blog/vulnerability/october-2026-security-releases>
- Mozilla Security Blog: protecting Firefox users after the eMudhra intermediate compromise
