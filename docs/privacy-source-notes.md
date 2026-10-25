# Privacy implementation source notes

Checked 2026-10-25. Implementation research, not a legal compliance certification.

## Reference and consent behavior

- [gdpr-info.eu](https://gdpr-info.eu/) presents the GDPR articles and recitals and links to the official EU text. It is a legal reference, not a ready-to-publish privacy policy for this site. A notice must describe this site's actual processing.
- GDPR Article 13 calls for controller/contact details, purposes and legal bases, recipients, relevant international transfers, retention periods or criteria, and applicable rights. Article 7(3) requires withdrawal to be as easy as giving consent. [Official EU regulation](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng).
- The EDPB cookie taskforce says consent-required cookies must wait for positive consent; most participating authorities found missing reject options on a layer with an accept button incompatible with valid consent. Misleading colors, contrast or hidden rejection can invalidate choice. Equal prominence and one-click accept/reject are prudent implementation choices, not a claim that the EDPB prescribes specific CSS. [EDPB taskforce report, sections 3–7](https://www.edpb.europa.eu/system/files/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf).
- No action, ordinary scrolling, or continued browsing must not turn into acceptance. Provide a persistent, easily found way to revisit the choice and withdraw it. [EDPB consent guidance](https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en); [EDPB 2020 annual report, section 5.1.5](https://www.edpb.europa.eu/system/files/2021-06/edpb_aar_2020_final_27.05.21.pdf).
- The taskforce distinguishes national implementation of ePrivacy Article 5(3), which governs device storage/access, from GDPR rules for subsequent personal-data processing. A banner alone does not establish compliance. [EDPB taskforce report, section 2](https://www.edpb.europa.eu/system/files/2023-01/edpb_20230118_report_cookie_banner_taskforce_en.pdf).

## Cloudflare facts safe to disclose conditionally

- Cloudflare describes its listed security/traffic cookies as necessary unless stated otherwise. `__cf_bm` supports bot protection and expires after 30 minutes of continuous inactivity; `cf_clearance` stores challenge/JavaScript-detection results. Their presence depends on enabled products. Do not say this site always sets every Cloudflare cookie. [Cloudflare cookie documentation](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/).
- Cloudflare says cookie data may by default be processed in the United States; localization products can change processing/logging geography. Therefore avoid promising EU-only hosting or processing. [Cloudflare cookie documentation](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/).
- Cloudflare's end-user section describes processing IP addresses, traffic-routing and system-configuration information. Its policy distinguishes processor activities from its own controller activities; do not describe every Cloudflare operation as solely this operator's processor activity. [Cloudflare privacy policy, sections 2 and 6](https://www.cloudflare.com/privacypolicy/).
- Cloudflare describes global transfers and reliance on the Data Privacy Framework for specified US transfers, with standard contractual clauses in other stated cases. Cite its current explanation instead of certifying this site's particular transfer arrangement. [Cloudflare privacy policy, section 7](https://www.cloudflare.com/privacypolicy/).
- Cloudflare gives purpose/legal-obligation-based retention criteria rather than one universal duration. Browser-cookie expiry is not server-log retention. Do not invent a fixed log-deletion period. [Cloudflare privacy policy, section 11](https://www.cloudflare.com/privacypolicy/).

## Site scope and operator settings still to confirm

The implementation audit supplied for this task identified a static Cloudflare Pages site, an existing `briefing-lang` localStorage preference, no application analytics/ad pixels or first-party cookies, and a Cloudflare-injected challenge. These observations do not reveal Cloudflare account settings or prove that no infrastructure processing occurs.

- Record the implemented consent-storage key, fields and actual expiry behavior in the public notice; localStorage does not expire automatically.
- Describe accept/reject honestly: no optional trackers currently exist to enable. Neither choice should claim to disable provider security processing, nor authorize undefined future tracking.
- Verify operator legal identity/address if required, applicable jurisdiction, the relevant security-processing legal basis, Cloudflare products/logging/retention/localization settings, and the operator's contractual transfer arrangements. Public handle/email alone does not settle all controller-identification requirements.
- A new optional analytics/advertising integration needs its own inventory, prior-consent gate and withdrawal behavior before activation; a stored blanket acceptance is not authorization for unspecified future purposes.

Implementation contact: the public [GitHub profile](https://github.com/yomiplush) / [profile API](https://api.github.com/users/yomiplush) returned the operator name YomiPlush and public contact contact@yomiplush.dev on 2026-10-25. The published notice uses that public identity and contact; this is not verification of a legal name or address.
