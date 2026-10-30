# 2026 Hacker Initiative application draft

- **Project:** Open-Source Security Evidence Verification Toolkit
- **Parent project:** Infosec Briefing
- **Prepared:** 2026-10-30
- **Evidence baseline:** repository commit `06cc9bfdf65a3a92821cad1aff8d78abf0a01096`
- **Status:** Technical draft; not ready for submission. Requested amount is deliberately unset.

Companion documents: [budget](hacker-initiative-2026-budget.md), [evidence](hacker-initiative-2026-evidence.md), [questions and personal inputs](hacker-initiative-2026-questions.md).

## Submission readiness and program fit

The [2026 announcement](https://hackerinitiative.org/) specifically welcomes open-source provenance work under its Signal/Noise theme. That gives this proposal a plausible thematic fit; it is not an eligibility decision or endorsement. The proposed output is a reusable offline software tool, not funding for Infosec Briefing's website or news publication.

The [official application page](https://hackerinitiative.org/apply-now/) sets an award range of USD 5,000–25,000. There is currently no documented, allowable cash budget supporting the minimum. Do not enter USD 5,000 merely to satisfy the form. Before submission, resolve the budget, Japan-resident individual eligibility, and non-check payment questions in the companion documents.

The [live 2026 form linked by the foundation](https://docs.google.com/forms/d/e/1FAIpQLSc_6C9WO9PEXS3r1BN_Qq5LOL9xtoEux0pC6xTmxUlpxlanxg/viewform) gives the deadline as **November 9, 2026, 11:59 PM PST** and describes a remote presentation at the second review stage. Only its first form page was inspected without entering information. The [complete official preview](https://hackerinitiative.org/wp-content/uploads/2026/09/The-Hacker-Initiative-Grant-Application-2026.pdf) supplies the remaining field structure. Recheck the live form manually before copying responses; no form was advanced or submitted.

## Maintainer handoff — submission gates

This is a working checklist, not a set of declarations to copy into the form. Leave
an item unchecked until there is evidence that it has been resolved.

- [ ] Confirm that this Japan-resident individual and the bounded toolkit are eligible; retain the foundation's clarification privately where appropriate.
- [ ] Confirm an acceptable non-check payment arrangement and its fees, currency handling and onboarding requirements.
- [ ] Establish necessary, permitted cash costs with actual supporting quotations; set a request only after the [budget decision gate](hacker-initiative-2026-budget.md#decision-gate) is satisfied.
- [ ] Confirm personal capacity, start date, milestone dates and a workable reduced-award plan without assuming unpaid time or advance financing.
- [ ] Supply the required personal and legal form details privately, including other funding; keep sensitive identifiers and payment information out of GitHub.
- [ ] Reconcile reporting and payment-term conflicts with the actual agreement, and decide personally whether its obligations can be accepted.
- [ ] Recheck the current official form, deadline, narrative limits and final answers before the maintainer submits manually.

The [questions register](hacker-initiative-2026-questions.md) records the unresolved
issues. A prepared narrative and a public commit do not resolve these gates.

## Applicant fields — maintainer must complete privately

Known from the task: the applicant is an independent developer residing in Japan. The repository identifies its maintainer publicly as YomiPlush. That handle is not a verified legal payee name.

The maintainer must supply legal/contact information, legal status and any applicable identifiers, responsible parties, qualifications, other funding, and willingness to accept the applicable terms. Do not invent an organization, identifier, affiliation or funding history. Keep home addresses, tax identifiers and payment details out of this public repository. See the [personal-input checklist](hacker-initiative-2026-questions.md#cycle-specific-form-checklist).

Suggested project classification, subject to confirmation: **Research Project** and **Software/Tool Development**. These are the two most relevant options in the preview; selecting a category does not make an expense allowable. Do not complete the reporting or policy agreement fields on the maintainer's behalf.

## Project name

Open-Source Security Evidence Verification Toolkit

## Brief project description — form response

The following response is intended for the preview's 150–300-word description field. Its word count is checked during document validation; the headings and surrounding notes are not part of the response.

<!-- description:start -->
Infosec Briefing publishes cybersecurity research supported by saved source responses, collection manifests, structured records, and verification scripts. This proposal would extract a narrowly scoped, reusable toolkit for checking the evidence behind such records without contacting upstream services or changing historical files.

Published intelligence can be difficult to audit when archives use different hash conventions, references point into older snapshots, or failed requests disappear from summaries. A matching SHA-256 digest establishes consistency with a recorded digest; it does not establish that a security claim is true. The toolkit would make that distinction explicit.

The proposed work has four outputs: a versioned evidence manifest schema; offline verification adapters for two existing snapshot families; checks for missing files, inconsistent source references, and incomplete collection; and reproducible fixtures with technical learning exercises. Reports would distinguish integrity failures from collection gaps and unsupported formats. Verification would leave input evidence unchanged.

Existing Infosec Briefing archives and tests provide inspectable starting examples, including compressed and uncompressed responses and references to earlier originals. The generic toolkit described here has not yet been built. Original code and documentation would be released under the MIT license, with synthetic fixtures where redistribution of third-party evidence is inappropriate.

Independent researchers, developers, and learners could use the release to inspect published evidence and practice reproducible verification. The initial scope excludes a website rebuild, continuous collection service, vulnerability scanning, and automated judgments about exploitation. Implementation would be led by one independent developer in Japan, with delivery dates and resources confirmed before any grant commitment.
<!-- description:end -->

## Technical problem and proposed solution

The existing [dated verifier](../../tools/intel/verify-1847.py) is useful but tied to one snapshot and writes a derived output file. The [current evidence tests](../../tests/evidence_manifest_test.py) inspect a later manifest structure through project-specific assertions. Neither establishes that a reusable, read-only verification product already exists. [Evidence E2–E4](hacker-initiative-2026-evidence.md#existing-technical-evidence) identifies the precise starting points.

The proposed toolkit would accept an explicitly selected evidence root and format profile. A versioned contract would describe source URLs, acquisition timestamps, response status, artifact paths, SHA-256 values, and whether a hash applies to stored bytes or a decoded body. Adapters would interpret existing formats without rewriting the original evidence.

The verifier would recompute the declared hashes, resolve permitted historical references, and check that published source references map to recorded artifacts. It would retain failed or partial collection states and distinguish them from corruption. Invalid manifests, unsupported profiles, missing references and unsafe paths would produce actionable diagnostics rather than a successful empty report. Plain-text and machine-readable results would support both manual review and reproducible tests.

Initial compatibility is limited to the October 27 collection-manifest family and the October 29 saved-file evidence-manifest family. The October 30 archive can be a regression example for the latter. This is not a commitment to support every NVD/GHSA export or an arbitrary third-party evidence format.

## Public and educational benefits — proposed form response

The intended beneficiaries are independent security researchers auditing citations, developers reviewing vulnerability intelligence, and learners studying hashes, data provenance and reproducible analysis. They would receive a public tool, a documented manifest contract, small fixtures, and exercises with independently checkable expected results. No registration, proprietary dataset or paid service would be needed for the planned synthetic exercises.

Two proposed exercises would demonstrate why hashing a gzip file differs from hashing its decoded body, and why an unavailable source differs from evidence of no change. These are hands-on technical exercises, not a claim of existing classroom use, a public-awareness campaign, or measured learning outcomes. There are no verified adoption figures or external endorsements to report.

The release would make source declarations and consistency inspectable. It would not authenticate upstream organizations or certify that an advisory, exploitation claim or incident count is correct.

## Existing demonstrated accomplishments

- Public MIT-licensed original code and documentation, with third-party source rights kept separate: [E1](hacker-initiative-2026-evidence.md#existing-technical-evidence).
- Saved response hashes, historical-file references and an offline dated verifier: [E2–E3](hacker-initiative-2026-evidence.md#existing-technical-evidence).
- Project-specific tests for saved-file integrity, source coverage and API-window consistency: [E4](hacker-initiative-2026-evidence.md#existing-technical-evidence).
- A recollection command that rejects an existing output directory: [E5](hacker-initiative-2026-evidence.md#existing-technical-evidence).
- Public methodology explaining timestamps, overlap, unavailable sources and limits: [E6](hacker-initiative-2026-evidence.md#existing-technical-evidence).

These are maintainer-controlled artifacts and locally reproduced checks, not independent certification. They support feasibility; the toolkit schema, reusable adapters, new fixtures and educational exercises remain proposed.

## Goals, measurable deliverables and acceptance criteria

| Proposed deliverable | Measurable acceptance criterion |
|---|---|
| D1: Version 1 manifest contract | One machine-readable schema plus field and hash-domain documentation; both baseline families mapped to declared profiles |
| D2: Offline read-only verifier | One documented entry point verifies both baseline families; before/after input-file inventories and hashes match; runs with network access disabled |
| D3: Reference and completeness diagnostics | Missing artifacts, unmapped source references, inconsistent metadata and incomplete collections each have distinguishable results; verification errors cannot yield a successful empty result |
| D4: Reproducible fixture suite | At least 10 small fixtures spanning stored/decoded hashes, valid/invalid references, partial collection, malformed input and path containment; each has declared expected results |
| D5: Technical learning material and release | Two runnable exercises with expected outputs, English usage/troubleshooting documentation, license notices and a tagged public source release |

The fixture count and output formats are proposed acceptance targets, not completed results. Release checks would verify behavior and input preservation, not exploitation or factual accuracy of every source statement. Synthetic data would be preferred in teaching fixtures; existing third-party bodies would not automatically be redistributed as MIT content.

## Proposed milestones and development sequence

A tentative planning window is **three to four calendar months after an agreed start**, conditional on the maintainer confirming available time and resources. This is a proposed schedule, not a statement of work hours or an accepted commitment. The budget currently does not establish how development time would be supported.

| Milestone | Work and review artifact | Completion gate |
|---|---|---|
| M1: Contract and baseline | Inventory the two existing families; document byte domains, reference roots and collection states; define the versioned schema | Profile mapping and baseline examples reviewed against original files |
| M2: Integrity engine | Implement the two bounded adapters and read-only SHA-256 verification; document output statuses | Both baselines checked offline; changed bytes and missing artifacts detected; input inventory unchanged |
| M3: Consistency and failure behavior | Add reference mapping, completeness reporting and bounded handling of malformed input | All proposed fixture cases produce their declared results without rewriting evidence or fetching sources |
| M4: Reproduction and release | Complete exercises, usage notes, release instructions and verification record | Re-run from a clean checkout; publish source, fixtures and expected outputs; document remaining limits |

Calendar dates, report milestones and any reduced-award scope require maintainer approval and agreement review. The reporting terms and inconsistencies are documented in [questions](hacker-initiative-2026-questions.md#budget-agreement-and-reporting-readiness). No volunteer collaborators, external reviewers or educational partners are assumed.

## Intended use of funds and geographic location — draft status

Development would be undertaken by the applicant in Japan. **No amount is ready to enter in the funding field.** The [budget document](hacker-initiative-2026-budget.md) explains why the current evidence does not justify USD 5,000 of allowable spending and what must be established first. Other funding and existing resources must be confirmed by the maintainer; a sponsorship URL is not evidence of received income.

Website work, routine news production, promotion, and applicant salary/staff-training charges are outside this requested budget. Reclassifying labor as a stipend or generic research service is not a solution. Eligibility of any genuine third-party service or incremental technical expense must be confirmed before it becomes a funded line item. Repository instructions and executable exercises also need clear treatment under the program's publishing exclusions; do not silently repackage an excluded publication project.

If a genuine, proportionate, allowable budget cannot reach the program minimum, do not submit this draft as a USD 5,000 request. The technical idea may be viable independently of this particular funding opportunity.

## Risks, limits and applicant commitments to confirm

- A self-reported URL, timestamp and matching digest do not prove upstream authenticity. A malicious party can replace both a file and its digest. Digital signing, trusted timestamp infrastructure and truth scoring are not initial deliverables.
- Compatibility is bounded to two families. Historical hash conventions must be explicit; unknown conventions must not be guessed into a successful result.
- Untrusted manifests and compressed files need path containment, size/decompression bounds and useful errors. This is defensive input handling, not a security certification or a promise of a vulnerability-free parser.
- Source access and future API changes affect collection, but the planned verifier itself is offline. It cannot recover unavailable historical revisions.
- Fixture redistribution requires rights review. Synthetic teaching examples reduce that burden but do not remove notices from existing evidence.
- Single-maintainer availability, unsupported compensation, reduced awards and delayed installments may prevent the proposed schedule. Do not promise unpaid capacity or front an expense before its funding and allowability are settled.
- Any acceptance would require the maintainer personally to review the award agreement, reporting/financial records, attribution and publicity obligations, payment arrangements and tax responsibilities. No agreement has been accepted by preparing this draft.

## Public evidence links

- [Infosec Briefing repository](https://github.com/yomiplush/2026-world-is-a-fuck-incident)
- [Website — context for existing work](https://www.infosec-briefing.net/)
- [MIT license at the evidence baseline](https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/06cc9bfdf65a3a92821cad1aff8d78abf0a01096/LICENSE)
- [Claim-by-claim evidence and executed checks](hacker-initiative-2026-evidence.md)
- [Existing methodology](../research-methodology.md)
