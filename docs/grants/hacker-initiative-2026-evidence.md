# 2026 Hacker Initiative evidence register

- **Prepared:** 2026-10-30
- **Repository baseline:** `06cc9bfdf65a3a92821cad1aff8d78abf0a01096`
- **Purpose:** Trace the application to inspectable existing work and distinguish it from proposed deliverables.

Related: [application](hacker-initiative-2026-application.md), [budget](hacker-initiative-2026-budget.md), [official-rule questions](hacker-initiative-2026-questions.md).

## Evidence boundaries

Repository artifacts are evidence of published implementation and stored records. They are not proof of adoption, independent validation, factual correctness of all security claims, or grant eligibility. Counts below concern files/records/checks, not users or incidents. The generic toolkit has not been implemented by creating these application documents.

The links below pin technical evidence to the baseline commit rather than a moving `main` branch. Local relative links are also supplied for reproduction. Third-party originals retain their own rights.

## Existing technical evidence

| ID | Supported statement | Inspectable evidence | Limit of the statement |
|---|---|---|---|
| E1 | Original software/documentation are offered under MIT | [Pinned LICENSE](https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/06cc9bfdf65a3a92821cad1aff8d78abf0a01096/LICENSE); [local license](../../LICENSE) | Does not relicense retrieved third-party advisories or responses |
| E2 | Fixed-window collection, pagination, retrieval metadata and hashes already exist | [Pinned collector](https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/06cc9bfdf65a3a92821cad1aff8d78abf0a01096/tools/intel/snapshot-1847.py); [base request/NVD code](../../tools/intel/snapshot-1027.py); [October 27 manifest](../../data/2026-10-27-1847/collection-summary.json) | Collection scripts do not automate every editorial judgment or recreate unavailable historical revisions |
| E3 | An existing offline verifier checks one dated collection | [Pinned verifier](https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/06cc9bfdf65a3a92821cad1aff8d78abf0a01096/tools/intel/verify-1847.py); [recorded output](../../data/2026-10-27-1847/verification.json) | Hardcoded snapshot; writes derived `verification.json`; not the proposed generic read-only tool |
| E4 | Later tests check stored-file hashes, source coverage, API windows and package consistency | [Pinned evidence tests](https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/06cc9bfdf65a3a92821cad1aff8d78abf0a01096/tests/evidence_manifest_test.py); [October 29 evidence manifest](../../data/20261029T050117Z-dbf8f2/update-infosec-evidence.json); [October 30 evidence manifest](../../data/2026-10-30-1031/update-infosec-evidence.json) | Project-specific tests; current execution follows `data/latest.json`; no external certification or general interoperability guarantee |
| E5 | Recollection protects an existing output directory from overwrite | [Pinned command](https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/06cc9bfdf65a3a92821cad1aff8d78abf0a01096/tools/intel/snapshot-20261030.py); [guard test](../../tests/collection_command_test.py) | A collection guard is not proof of a generic verifier's read-only behavior |
| E6 | Hash conventions, timestamps, source uncertainty and reproducibility limits are documented | [Pinned methodology](https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/06cc9bfdf65a3a92821cad1aff8d78abf0a01096/docs/research-methodology.md); [October 30 collection notes](../research-collection-2026-10-30-1031.md) | Public methodology is not an independently audited process |

## Why two baseline families are justified

### Family A: October 27 collection manifests

The [dated verifier](../../tools/intel/verify-1847.py) traverses nested `file`/`sha256` records, follows references into previous snapshots and handles the main, supplemental, vendor and discovery material. Different parts use decoded bytes, stored bytes, or both. This is evidence that an explicit hash-domain contract and carefully bounded adapters address an existing problem.

Its recorded and freshly reproduced result is **146 response records**, including **27 references to earlier originals**, across **29 editorial topic groups**. Those are not 146 independently discovered vulnerabilities or 29 newly confirmed incidents.

### Family B: October 29 saved-file evidence manifest

The [October 29 manifest](../../data/20261029T050117Z-dbf8f2/update-infosec-evidence.json) uses `sources` and `failures`, repository-relative artifact paths, acquisition metadata and SHA-256 of stored file bytes, including compressed files. Local JSON inspection counted **261 source rows**. That count does not establish successful verification of all rows by the later current-pointer tests.

The [October 30 manifest](../../data/2026-10-30-1031/update-infosec-evidence.json) is a further regression example: **411 source rows**, representing **355 distinct URLs**, with inherited evidence dates and explicit failures. This shows why source-row counts must not be substituted for unique sources or independent observations. The proposed tool must be tested against the pinned October 29 baseline as well as later examples; current tests alone do not establish that proposed compatibility.

## Freshly executed checks for this preparation

Executed locally on 2026-10-30 with Python **3.14.8**, from the repository root at the baseline commit, before application-document changes. These commands did not contact upstream data providers.

| Command | Observed result | What it demonstrates |
|---|---|---|
| `python3 -m unittest discover -s tests -p evidence_manifest_test.py` | 5 tests passed | Current October 30 saved-byte hashes, source mappings, API-window completeness, newly covered package data, historical ID retention, unknown-loss representation and source-matched English packages satisfy those assertions |
| `python3 -m unittest discover -s tests -p collection_command_test.py` | 1 test passed | The collector rejected the existing October 30 directory without modifying its collection manifest |
| `python3 tools/intel/verify-1847.py` | 146 response records verified; 27 earlier-original references; 29 groups | The dated integrity/reference/count checks reproduced; the script rewrites its derived verification output |

The broad build and browser checks listed in [earlier readiness notes](../grant-readiness.md#11-documentation-preparation-validation--2026-10-30) are historical records for that documentation change. They are not additional fresh results asserted here. No new toolkit fixture suite, external audit, usability study or educational outcome has been completed.

### Reproduction procedure

1. Check out commit `06cc9bfdf65a3a92821cad1aff8d78abf0a01096` in a separate local copy.
2. Use a compatible Python 3 interpreter; the fresh run above used the version stated, not an asserted compatibility matrix.
3. Run the three commands above from the root, retaining output and interpreter version.
4. Treat `verification.json` as derived output. Do not run live collectors as a substitute for offline evidence verification or claim that a writing verifier is read-only.

No production build, deployment or live data recollection is needed to reproduce these particular checks. For the proposed read-only behavior, new before/after input-preservation tests remain necessary.

## Artifact identifiers inspected during preparation

SHA-256 below applies to the bytes of each listed JSON file. These digests identify the inspected artifacts; they are not signatures or an independent trust anchor.

| Local artifact | SHA-256 |
|---|---|
| `data/2026-10-27-1847/collection-summary.json` | `4b844fbc3c25b68b91f6493fa455d827c8c222e035cd069805a5ca0e1e560b81` |
| `data/20261029T050117Z-dbf8f2/update-infosec-evidence.json` | `2e3fc9f0b815321542736cea3a94f46062fd4c47a6ed706f96f300bbc6e83e2b` |
| `data/2026-10-30-1031/update-infosec-evidence.json` | `e7f18b2baaeedc78419f3090a05328516516b811adf3d73d67c2ff16cc4f9c64` |

## Existing work versus proposed outputs

| Already inspectable | Still proposed |
|---|---|
| Dated collectors, original responses and several manifest conventions | A versioned reusable manifest contract |
| One dated verifier and project-specific evidence tests | A configurable read-only verifier with two bounded format adapters |
| Successful/failed retrieval records and source references | Consistent public diagnostics and machine-readable verification results |
| Methodology and operational research documentation | At least 10 purpose-built fixtures, two runnable learning exercises and a tagged toolkit release |

No adoption, sponsors, grants, independent endorsements or financial need are inferred from repository size, topic counts, passing local tests, or public sponsorship links.

## Official-source audit trail

Official sources were reviewed on 2026-10-30. [Questions](hacker-initiative-2026-questions.md) contains the rule findings and conflicts; this index identifies where they came from without reproducing the rules.

- [2026 theme and current call](https://hackerinitiative.org/)
- [Application process and exclusion list](https://hackerinitiative.org/apply-now/)
- [Grant guidelines](https://hackerinitiative.org/grant-guidelines/)
- [Application FAQ, including payment](https://hackerinitiative.org/application-faq/)
- [Official 2026 preview, linked by the application page](https://hackerinitiative.org/wp-content/uploads/2026/09/The-Hacker-Initiative-Grant-Application-2026.pdf)
- [Live form linked by the foundation; only its first page read](https://docs.google.com/forms/d/e/1FAIpQLSc_6C9WO9PEXS3r1BN_Qq5LOL9xtoEux0pC6xTmxUlpxlanxg/viewform)
- [Published reporting and award-letter terms](https://hackerinitiative.org/grant-reporting-template/)

No recipient SWIFT, PayPal or GitHub Sponsors payout arrangement was confirmed. Reading these sources did not establish Japan-specific tax treatment or applicant acceptance. No form values, correspondence, payment credentials or private banking details were collected or sent.
