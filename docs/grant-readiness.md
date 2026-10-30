# Infosec Briefing — grant-readiness working document

[English](grant-readiness.md) · [日本語](grant-readiness.ja.md)

Prepared from repository evidence on 2026-10-30. This is preparation material,
not an application, funding commitment, or claim of eligibility or endorsement by
Hacker Initiative, OpenSSF or any foundation. Proposed work below requires
maintainer scoping, resources and scheduling.

## 1. Project overview

Infosec Briefing is an independent cybersecurity research and open-source project
operated by YomiPlush. It turns public primary-source information into dated reports,
structured registers, defensive guidance and sourced motion diagrams. Its technical
problem is interpreting overlapping, delayed and sometimes conflicting vulnerability
and incident records while preserving evidence, conditions and uncertainty.

## 2. Existing technical accomplishments — completed artifacts

These are repository deliverables, not claims of adoption or independently measured impact.

| Deliverable | Inspectable evidence |
|---|---|
| Fixed-window NVD/GHSA collection, pagination and saved provenance | [Collector](../tools/intel/snapshot-1847.py), [base NVD routines](../tools/intel/snapshot-1027.py), [manifest](../data/2026-10-27-1847/collection-summary.json) |
| Offline response integrity and overlap checks | [Verifier](../tools/intel/verify-1847.py), [dated verification output](../data/2026-10-27-1847/verification.json) |
| Structured records and saved primary-source evidence | [Latest pointer](../data/latest.json), [October 29 register](../data/20261029T050117Z-dbf8f2/incident-register.json), [evidence manifest](../data/20261029T050117Z-dbf8f2/update-infosec-evidence.json) |
| Documented interpretation and limits | [Source guide](08-intel-sources.md), [English research](research-20261029T050117Z-dbf8f2.en.md), [collection notes](research-collection-20261029T050117Z-dbf8f2.md) |
| Accessible reading paths and sourced motion presentation | [Site source and build guide](../site/README.md), [SEO checks](../tests/seo_test.py), [render checks](../tests/rig3d.test.cjs) |
| Stored language resources and translation checks | [Article translation implementation](../tools/article_languages.py), [translation guide](translations/README.md), [article tests](../tests/article_languages_test.py) |
| Defensive utilities and operational guidance | [PHP utilities](../tools/php2shell/), [Node version audit](../tools/node/nodefix-audit), [runbooks](../runbooks/) |

These artifacts do not establish that all tests currently pass; execute validation
against the checkout used for an application. Historical version advice is dated.

## 3. Public benefits and intended users

Intended users include independent researchers inspecting evidence, developers
checking affected dependencies, operators interpreting official remediation guidance,
and readers needing Japanese or English explanations. Public source links, raw
responses, structured data and explicit unknowns make claims inspectable and help
readers avoid treating database counts as incident counts or planned fixes as shipped
releases. No user totals, adoption estimates or measured harm reduction are asserted.

## 4. Research methodology

The [bilingual methodology guide](research-methodology.md) explains scripted NVD
and GHSA collection, primary-source evaluation, CVE/advisory cross-references,
identifier-set overlap, editorial classification, UTC/JST handling and manifest-specific
SHA-256 verification. Collection automation does not imply fully automated judgment.
Saved-evidence verification and live recollection are different activities. Rerunning
queries cannot guarantee recreation of historical revisions.

## 5. Existing open-source deliverables and ongoing maintenance

Code, original research documentation, site generators and defensive utilities are
available under [MIT](../LICENSE). Third-party source material retains its owners’
rights. The dated data archives, JSON registers, manifests, runbooks and language
resources are public research artifacts. The project as a whole should not be
represented as a vulnerability scanner, intrusion detection system or certification service.

Ongoing work consists of maintaining this publication and research workflow:
source review, corrections, new dated snapshots, dependency upkeep and translation
maintenance. The [latest pointer](../data/latest.json) records the current committed
cutoff; it is not a promise of continuous monitoring, a service level or a future cadence.

## 6. Proposed future technical development — not completed or funded

- Consolidate manifest/hash conventions and document a versioned schema while
  retaining compatibility with historical evidence.
- Add a read-only verification entry point that checks multiple snapshots and
  reports incomplete retrievals, missing references and hash mismatches explicitly.
- Improve CVE/GHSA cross-reference and duplicate-review tooling with fixtures for
  missing CVEs, rejected records, inclusive boundaries and conflicting source ranges.
- Strengthen English/Japanese terminology and source-alignment checks, with human
  review of technical meaning and accessible navigation.

These are candidate extensions of existing components, not approved grant activities.
They do not promise new vulnerability discoveries or confirmed exploitation results.

### Recommended first proposal: read-only evidence verification

For a first application, prioritize M1 and M2 as one bounded work package:
a schema guide and a read-only verifier for the existing October 27 and October 29
evidence formats. This is a recommendation, not an approved scope or completed
implementation. Existing collectors and tests provide a concrete starting point.

The proposed verifier should accept an explicit snapshot path, report the hash
convention used, retain recorded retrieval failures, check referenced originals,
and return a nonzero exit status for integrity or required-reference failures.
It must not fetch upstream data, rewrite evidence, or treat a recorded retrieval
failure as proof that the source contained no findings. Coverage gaps and integrity
failures should be distinguishable in its report.

A proposed acceptance review would compare file hashes before and after execution,
verify both historical examples, and use fixtures for a corrupted response,
a missing previous-file reference and an incomplete collection. Passing those
checks would establish the verifier's behavior, not validate every security claim.
Cross-reference enhancements and broader language tooling can remain later work,
subject to a separate estimate. No completion date or development effort is assumed.

## 7. Potential milestones and measurable deliverables

Sequence and acceptance criteria are proposals; dates and effort are not committed.

| Candidate milestone | Reviewable deliverable and proposed acceptance criterion |
|---|---|
| M1: Evidence schema | Versioned schema and field guide; validate representative October 27 and October 29 manifests without rewriting originals |
| M2: Offline verification | One documented read-only command for both examples; fixtures must detect a changed hash, missing reference and incomplete retrieval |
| M3: Cross-reference review | Documented ID/overlap output; fixtures cover published/modified overlap, CVE-less GHSA and Rejected status without inflating incident totals |
| M4: Bilingual publication | Equivalent English/Japanese methodology and usage examples; internal-link, keyboard, narrow-screen and existing relevant checks recorded for both languages |

## 8. Known limitations and research risks

Source access, API changes, throttling, anti-bot pages and unavailable bodies limit
coverage. Upstream revisions can prevent historical reconstruction. Editorial
interpretation and AI-assisted translation can introduce errors. Source conflicts,
unknown patch boundaries and historical prose not revalidated must remain visible.
Hash matches do not authenticate factual claims. Publication creates maintenance
and third-party rights responsibilities. None of the artifacts establish worldwide
coverage, a quantified audience or a guaranteed security outcome.

## 9. Funding needs and example budget categories

No requested amount or funding requirement has been established here. A future
budget should tie scoped milestones to estimated effort and documented costs:

- Maintainer/research engineering time for collectors, verification and review tooling.
- Research infrastructure: hosting, storage, backups and reproducible test environments.
- Maintenance and dependency updates, including regression verification.
- English/Japanese technical review and accessibility testing.
- Documentation, evidence curation and release preparation.

For the recommended M1/M2 package, use the following estimation worksheet.
Amounts remain unset until supported by maintainer estimates or actual quotes;
these rows are not a funding request.

| Cost item | Calculation basis | Evidence needed before setting an amount |
|---|---|---|
| Schema mapping and verifier implementation | Estimated hours × agreed hourly rate | Task breakdown covering both existing formats |
| Fixtures and acceptance review | Estimated hours × agreed hourly rate | Fixture list, review scope and reviewer estimate |
| English/Japanese documentation | Estimated hours × agreed hourly rate | Document scope and technical-review estimate |
| Incremental research infrastructure | Monthly incremental cost × proposed months | Provider quote or current invoice; identify existing covered costs |

Use a single stated currency, explain taxes or exchange assumptions if applicable,
and separate existing expenses, in-kind time and newly requested costs. Avoid
counting the same engineering or review hours in multiple rows. Include only
costs permitted by the selected program after checking its current terms.

The maintainer still needs to specify time allocation, rates, duration, existing
resources, cost assumptions and permitted expenses under the chosen program.
[GitHub Sponsors](https://github.com/sponsors/yomiplush) contributions support
continued open-source development, research infrastructure, maintenance and public
technical resources. No unapproved donor rewards or financial returns are promised.

## 10. Public links and remaining application preparation

- [Website](https://www.infosec-briefing.net/) and [About / editorial policy](https://www.infosec-briefing.net/about.en).
- [Research database](https://www.infosec-briefing.net/database.en) and [chronological archive](https://www.infosec-briefing.net/timeline.en).
- [Public repository](https://github.com/yomiplush/2026-world-is-a-fuck-incident), [license](../LICENSE), [issues](https://github.com/yomiplush/2026-world-is-a-fuck-incident/issues).
- [Methodology and reproduction commands](research-methodology.md), [datasets](../data/), [sponsorship](https://github.com/sponsors/yomiplush).

Before applying: choose a bounded technical proposal; verify current program terms
and eligibility; establish maintainer/applicant details, capacity, timeline and a
costed budget; define milestone evaluation and reporting; review third-party evidence
rights and translations. Supply any requested impact evidence from actual records,
without substituting invented audience metrics. Deployment, publication and grant
submission remain maintainer actions.

## 11. Documentation-preparation validation — 2026-10-30

The following checks were executed successfully against this local documentation
change. They are a dated validation record, not a promise that future revisions
will pass or an independent confirmation of all research claims.

| Command or check | Observed result |
|---|---|
| `npm run build` | Complete site build succeeded |
| `npm run check:assets` | Generated assets matched source |
| `python3 tools/intel/verify-1847.py` | 146 response records verified, including 27 references to earlier originals |
| `python3 -m unittest discover -s tests -p '*_test.py'` | 34 tests passed |
| `node --test tests/*.test.cjs` | 13 test files passed |
| `git diff --check` | No whitespace errors |
| `CDP_PORT=9238 node tests/article-languages.mjs` with local server and Chrome CDP | Japanese/English navigation passed for 6 reading routes at 3 emulated viewport configurations; no overflow; no-JavaScript links available |

Additional ad hoc checks covered both About pages at 5 viewport sizes, keyboard
navigation, language switching, 39 local links and 8 existing routes. A file-target
check resolved 105 local documentation links, and both original README bodies
were verified to remain verbatim after the new introductions. These counts describe
validation checks, not project users or adoption.

Browser checks used emulation, not physical devices. The live production site,
external-source availability, grant-program terms, human translation review and
third-party republication rights require separate review. No deployment or grant
submission formed part of these checks. Local browser setup is described in the
[site build and verification guide](../site/README.md).
