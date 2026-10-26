# Post follow-up: HTTP2Shell / Brotli across bundled consumers

**English** | [日本語・詳細](26-brotli-http2shell.ja.md)

The [requested EdwardTWinz post](https://x.com/EdwardTWinz/status/2113965463931666585) was published **October 24 at 12:06:56 UTC / 21:06:56 JST**, before the earlier review cutoff. Official syndication truncates its long-form body; a secondary viewer supplied the complete post. Technical claims are checked against primary sources. Retrieval metadata is [archived separately](../data/2026-10-25/brotli-followup.json).

“HTTP2Shell” and “Node2Shell” refer here to **the same CVE-2026-111497**, an upstream Brotli decoder flaw. It requires attacker-controlled data to reach a vulnerable decoder; HTTP/2 use alone is not the condition. Google's CNA assigns **CVSS v4.0 9.2 / Critical**, including `AT:P`; Node.js and Red Hat use different severity classifications. [Google CNA](https://raw.githubusercontent.com/CVEProject/cvelistV5/main/cves/2026/111xxx/CVE-2026-111497.json), [Node.js](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases), [Red Hat](https://access.redhat.com/security/cve/cve-2026-111497).

| Consumer | Fix or verification |
|---|---|
| Upstream C library | **1.0.10 / 1.1.1 / 1.2.1**. The exact affected branch ranges exclude the first two fixed backports. [Google release](https://github.com/google/brotli/releases/tag/v1.2.1) |
| Node.js | **22.23.4 / 24.22.1 / 26.12.1**, including container and embedded runtimes. [Official advisory](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) |
| Bun | **1.4.4**; rebuild compiled executables. [Maintainer advisory](https://github.com/oven-sh/bun/security/advisories/GHSA-663w-cv8g-jj2p) |
| Python bindings | **brotli 1.2.1 / brotlicffi 1.2.1.0**; inspect each environment and vendored copy. [Package advisory](https://github.com/advisories/GHSA-9v8h-qqgm-4m35) |
| Envoy | With Brotli decompression configured: **1.40.0 / 1.39.3 / 1.38.6 / 1.37.8**. **1.36.12** also fixes it, but that branch is unsupported. [Envoy](https://github.com/envoyproxy/envoy/security/advisories/GHSA-3wvj-j6qm-62mr), [support qualification](https://patchtheplanet.org/brotli) |
| Istio | With Brotli decompression enabled: **1.31.2 / 1.30.6 / 1.29.9**. Move off EOL 1.29. The bulletin's HTTP/2 authorization bypass is separate. [Istio](https://istio.io/latest/news/security/istio-security-2026-007/) |
| curl/libcurl, requests, httpx | Check the actual Brotli dependency and decoding configuration, including automatic responses. No universal curl fixed version is asserted. [curl](https://curl.se/docs/manpage.html#--compressed), [Requests](https://docs.python-requests.org/en/latest/user/quickstart/#binary-response-content), [HTTPX](https://www.python-httpx.org/quickstart/#binary-response-content) |

Until updated, prevent untrusted Brotli from reaching decoders. Reject input before decoding; inspect fetched responses through a documented raw-response path. Removing `br` from `Accept-Encoding` alone is insufficient. Check downstream decoders when disabling proxy filters. [Patch the Planet's operational guidance](https://patchtheplanet.org/brotli).

Imperva's official Node.js build RCE demonstration does not establish successful attacks against every consumer or real-world exploitation. Cloudflare's October 25 emergency rules default to **Log**, not blocking; their precise publication time was not established, so they are additional retrieval-time information rather than a claim about the 16:34 cutoff. [Imperva](https://www.imperva.com/blog/node2shell-from-brotli-data-to-remote-code-execution/), [Cloudflare](https://developers.cloudflare.com/changelog/post/2026-10-25-emergency-waf-release/).

## 00:18 JST follow-up — downstream reach (primary sources)

The requested cybersecuritynews write-up returned HTTP 403 at retrieval. Technical claims below are from JFrog, Microsoft, Node.js, Google CNA and Cloudflare. HTTP/2 use is not the vulnerability condition.

| Consumer | What JFrog / vendor observed | Fix or verification |
|---|---|---|
| .NET native Brotli | `System.IO.Compression` (`BrotliStream` / `BrotliDecoder`); optional HttpClient / ASP.NET Core request decompression. Local SIGSEGV; **RCE not demonstrated**. | Runtimes **8.0.33 / 9.0.22 / 10.0.14 / 11.0.0-rc.3.26522.148**. **.NET Framework not affected**. ASP.NET / HttpClient Brotli decompression is **not default**. NativeAOT must **republish**. [announcements#494](https://github.com/dotnet/announcements/issues/494) |
| FFmpeg → libjxl | JPEG XL `brob` box (Brotli metadata) → `BrotliDecoderDecompressStream()`. Crash with corrupted pointer **`0x414141414141`**. **RCE not demonstrated**. | libjxl **main** bumped to Brotli 1.2.1 (24 Oct). **No patched libjxl or FFmpeg release identified** at retrieval. |
| ClickHouse | HTTP `Content-Encoding: br`, ~**23 MB** body → remote crash. | PR [#127419](https://github.com/ClickHouse/ClickHouse/pull/127419) merged 25 Oct. **Patched release treated as unshipped** at JFrog publication; later tags were not verified as user-facing before this cutoff. |
| Apache Arrow / pyarrow | Bundled `ARROW_BROTLI_BUILD_VERSION=v1.0.9`. **534-byte** input → infinite decode loop (CPU), not a crash. | Issue [#55166](https://github.com/apache/arrow/issues/55166) **still open** at retrieval. System-linked patched Brotli is out of this pin. |

Microsoft CVSS 3.1 for the .NET advisory is **8.1** (CWE-787). Google CNA remains CVSS 4.0 **9.2**. Do not collapse those scores. Cloudflare emergency WAF rules from 25 Oct still default to **Log**. Bandit HTTP/2 resource-exhaustion CVEs registered in the 00:18 window are a **separate** cluster.

[00:18 collection](research-collection-2026-10-27-0018.md) / [vendor review](research-2026-10-27-0018.md) / [Detailed research](research-http2shell-2026-10-25.md) / [dedicated scene #40](https://www.infosec-briefing.net/?lang=en#40)
