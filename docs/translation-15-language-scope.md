# Fifteen-language research views: execution scope

Requested result: `/impact` and `/database` each offer the exact15-language catalog from `content/site-languages.json` at the current cutoff2026-10-28T04:18:44Z. All16impact examples and65database topics retain conditions, unknown values, references and digits. Arabic uses RTL and isolated technical version strings. Translation packages must match source/register hashes; missing packages cannot be published under a different-language label.

## Prepared local work

- Shared catalog, localized impact renderer, locale-preserving research tabs, translated advisory labels and downloadable impactJSON.
- Source packages: `data/translations/2026-10-28-1318/source.json` (299database strings) and `data/impact-translations/2026-10-28-1318/source.json` (132impact strings).
- All15database packages (299strings each) and all15impact packages (132strings each) now pass complete-key, numeric/identifier and current-source validation. Existing language memory was reused.
- The15-language contract and all25Python tests pass. The12Node regression suites also pass. Production publication follows browser verification.

## Approval requested for translation execution

The automatic approval reviewer rejected the initial database translation command because external destination, exact payload and consumption of normal Codex usage were not explicitly approved. The user subsequently explicitly approved the stated public payload, OpenAI Codex destination and normal usage consumption. The scoped translation commands are now running; no paid API or purchase is added.

Destination: existing authenticated Codex CLI using its default OpenAI provider. Local non-secret configuration confirms `OpenAI default`, with no custom provider endpoint configured. No API keys are added and no paid translation API or credit purchase is requested.

Payload: only the public Japanese strings from the two source packages above, plus target language catalog metadata and instructions to preserve facts, digits and technical IDs. Original public sources: https://www.infosec-briefing.net/database and https://www.infosec-briefing.net/impact . No private files or credentials are included in the translation prompt. The CLI runs read-only with instructions not to use tools/browse or read other files; normal Codex usage is consumed.

Commands executed after explicit approval:

`python tools/translations/manage.py run --locales zh,ko,es,fr,de,pt,ru,ar,hi,id,uk,pl,sv --workers 3 --run-dir /tmp/infosec-15-db`

`python tools/translations/impact.py run --locales zh,ko,es,fr,de,pt,ru,ar,hi,id,uk,pl,sv --workers 3 --run-dir /tmp/infosec-15-impact`

After generation: validate complete keys/numbers/CVEs/source hashes, build, check15-language selectors and locale-preserving tabs, test small screens and RTL, then normal push/deploy/live verification. No production deploy until complete validation.

## Validation and review

The read-only review identified stale impact locale artifacts and comparison against the wrong English store. Both were corrected; `tests/impact_locales_test.py` checks English-copy rejection against the impact store and deletion of stale artifacts. Strict numeric validation rejected changed date/grouping/ordinal formats; only the affected strings were regenerated, and no validator was weakened. Translation execution used the existing ChatGPT account login and default OpenAI provider; no API-key billing or purchased credits were added.

Browser checks passed for all15locales at320/390/844px:16impact cards,65database topics, expanded advisory details, same-locale tabs and ArabicRTL. Existing6reading-route JA/EN checks, X-style toolbar/safe-area checks, no-JavaScript impact tabs and native15-language selectors also passed. English article links now retain `/impact.en`; a regression test covers this. Initial asset delivery remains3requests/49,417bytes (132bytes above the previous CSS); no runtime translation service is added.

## Publication

Runtime source: `b9a0d0abb6e42e5658006d9e9a85cb3de9d47779`. Cloudflare Pages production deployment: `6e449742` (https://6e449742.2026-incident-briefing.pages.dev), published to https://www.infosec-briefing.net/. All47checked production HTML/impact-JSON/current-and-previous-CSS URLs match local artifacts byte for byte. Both current manifests report15/15ready locales. Data cutoff remains2026-10-28T04:18:44Z; translation publication does not imply a later incident scan.

The full15-locale x3-width browser suite also passed against the production origin after deployment, including locale-preserving database/impact navigation and the Japanese-to-Arabic dropdown change.
