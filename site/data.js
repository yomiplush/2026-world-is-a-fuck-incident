/* Bilingual scene data (ja / en).
   Facts are the same in both languages and come from the repository's docs/,
   which cite primary sources. Numbers live in shared fields; only copy differs. */
/* Languages offered by the pull-down. `native` is what the reader sees in the
   list; `html` is the BCP-47 tag; `dir` drives RTL layout. Adding a language is
   one entry here plus one file in i18n/ — the app lazy-loads it on selection and
   falls back to English for any field a locale does not translate. */
window.LANGUAGES = [
  { code: "en", native: "English",            html: "en",    dir: "ltr" },
  { code: "ja", native: "日本語",              html: "ja",    dir: "ltr" },
  { code: "zh", native: "中文（简体）",         html: "zh-Hans", dir: "ltr" },
  { code: "ko", native: "한국어",              html: "ko",    dir: "ltr" },
  { code: "es", native: "Español",            html: "es",    dir: "ltr" },
  { code: "fr", native: "Français",           html: "fr",    dir: "ltr" },
  { code: "de", native: "Deutsch",            html: "de",    dir: "ltr" },
  { code: "pt", native: "Português",          html: "pt",    dir: "ltr" },
  { code: "ru", native: "Русский",            html: "ru",    dir: "ltr" },
  { code: "ar", native: "العربية",             html: "ar",    dir: "rtl" },
  { code: "hi", native: "हिन्दी",                html: "hi",    dir: "ltr" },
  { code: "id", native: "Bahasa Indonesia",   html: "id",    dir: "ltr" }
];

window.CONTENT = {
  ui: {
    ja: {
      chapter: "BRIEFING", sound: "サウンド", on: "ON", off: "OFF",
      sources: "出典", close: "閉じる", tap: "つぎへ", replay: "最初から",
      hint: "タップ / クリック / スペース",
      hintEnd: "最後です。タップで最初に戻ります",
      coverKicker: "INCIDENT BRIEFING · 2026-10",
      coverTitleA: "ひと月で、", coverTitleB: "15件。",
      coverSub: "2026年10月に重なった15件を、時系列で。<br>Apache とカーネルの追補、10-23 の追記3件つき。タップで進みます。音が出ます。",
      coverStart: "TAP TO BEGIN",
      coverFoot: "出所はすべて一次ソース。1件だけ未確認（ConnectWise）。",
      drawerTitle: "出典 / SOURCES",
      drawerFoot: "14/15 は一次ソースで確認済み。ConnectWise は未確認として記載。",
      asof: "2026-10-23 10:36 JST 時点",
      lang: "JA"
    },
    en: {
      chapter: "BRIEFING", sound: "SOUND", on: "ON", off: "OFF",
      sources: "SOURCES", close: "CLOSE", tap: "NEXT", replay: "REPLAY",
      hint: "tap / click / space",
      hintEnd: "end of briefing — tap to restart",
      coverKicker: "INCIDENT BRIEFING · 2026-10",
      coverTitleA: "ONE MONTH,", coverTitleB: "15 INCIDENTS.",
      coverSub: "The fifteen October incidents, in order.<br>Plus Apache and kernel addenda and three 10-23 postscript scenes. Tap to advance.",
      coverStart: "TAP TO BEGIN",
      coverFoot: "Every claim traces to a primary source. One row (ConnectWise) is unverified.",
      drawerTitle: "SOURCES",
      drawerFoot: "14 of 15 verified against primary sources. ConnectWise is carried as unverified.",
      asof: "as of 2026-10-23 10:36 JST",
      lang: "EN"
    }
  },

  scenes: [
    {
      id: "intro", stamp: "OCT 2026",
      metric: { val: "15", label: { ja: "incidents · 1 month", en: "incidents · 1 month" } },
      visual: { type: "radar" }, cue: "alarm",
      sources: [{ name: "Repository", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident",
        note: { ja: "docs/14 が15件を1件ずつ検証", en: "docs/14 checks all fifteen rows" } }],
      ja: {
        kicker: "INCIDENT BRIEFING · 2026-10",
        title: "ひと月で、15件。",
        lede: "互いに無関係に見える事案が、同じ種類の弱点に集まった月。タップで時系列に進みます。",
        points: [
          "15件のうち <b>8件</b>が npm / pip / プラグイン / リリース資産 — コードではなく<em>配布</em>",
          "14件は<b>一次ソース</b>で確認済み。1件（ConnectWise）は未確認",
          "音が出ます。右上の SOUND で消せます"
        ]
      },
      en: {
        kicker: "INCIDENT BRIEFING · 2026-10",
        title: "One month, fifteen incidents.",
        lede: "Unrelated failures that kept landing on the same kind of weakness. Tap through them in order.",
        points: [
          "<b>8 of 15</b> are npm / pip / plugin / release-asset problems — the <em>distribution</em>, not the code",
          "14 are verified against <b>primary sources</b>; one (ConnectWise) is not",
          "Sound is on — toggle it top-right"
        ]
      }
    },
    {
      id: "php-silence", stamp: "08.11",
      metric: { val: "70", label: { ja: "days from report to public", en: "days from report to public" } },
      visual: { type: "timeline", marks: ["08.01", "08.11", "10.20", "10.21"] }, cue: "whoosh",
      sources: [
        { name: "docs/00 timeline", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/00-timeline.md",
          note: { ja: "UTC / JST", en: "UTC / JST" } },
        { name: "php.net", url: "https://www.php.net/archive/2026.php",
          note: { ja: "8.5.12 ほか", en: "8.5.12 and siblings" } }
      ],
      ja: {
        kicker: "PHP CORE · COORDINATED DISCLOSURE",
        title: "70日間、静かだった。",
        lede: "発見から公開まで70日。危険だったのは公開後の24時間ではなく、公開の直前。",
        points: [
          "08-01 Calif が複数の RCE 経路を発見 / 08-11 PHP へ報告",
          "10-20 詳細が漏えい、watchTowr が RCE を確認",
          "10-21 <b>07:43 UTC</b> 修正公開の前に攻撃試行を観測（Cloudflare）",
          "10-21 14:00 修正版 — 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35"
        ]
      },
      en: {
        kicker: "PHP CORE · COORDINATED DISCLOSURE",
        title: "Seventy quiet days.",
        lede: "Seventy days from report to release. The dangerous window was not after publication — it was just before it.",
        points: [
          "08-01 Calif finds several RCE paths / 08-11 reported to PHP",
          "10-20 details leak; watchTowr confirms RCE",
          "10-21 <b>07:43 UTC</b> attack attempts observed before the fix (Cloudflare)",
          "10-21 14:00 fixed releases — 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35"
        ]
      }
    },
    {
      id: "zeabur", stamp: "10.14",
      metric: { val: "865", label: { ja: "database services touched", en: "database services touched" } },
      visual: { type: "grid", cols: 9, rows: 5, hot: [3, 7, 11, 16, 22, 28, 31, 37, 41] }, cue: "alarm",
      sources: [{ name: "Zeabur report (2026-10-19)", url: "https://zeabur.com/blogs/october-2026-security-incident",
        note: { ja: "confirmed / assessed を使い分けた一次報告", en: "the vendor's own vocabulary for evidence quality" } }],
      ja: {
        kicker: "ZEABUR · INFRASTRUCTURE",
        title: "平文の管理者鍵が、9リージョンを開けた。",
        lede: "8月に続いて2回目。ローテーションは「今回使われた鍵」をカバーしていなかった。",
        points: [
          "10-14 01:36 内部 AWS キーで侵入 / 01:51 にシステム秘密",
          "12:39 から全サービスの環境変数へ拡大、<b>865</b> の DB サービスでコマンド実行",
          "原因は平文・無期限の管理者資格情報と、公開されていた管理画面",
          "利用者は全環境変数をローテート（8月に実施済みでも、もう一度）"
        ]
      },
      en: {
        kicker: "ZEABUR · INFRASTRUCTURE",
        title: "A plaintext admin key opened nine regions.",
        lede: "The second incident since August. The August rotation did not cover the credentials used this time.",
        points: [
          "10-14 01:36 entry via internal AWS keys / 01:51 system secrets",
          "from 12:39 all service environment variables; commands ran in <b>865</b> database services",
          "root cause: plaintext, non-expiring admin credentials and a publicly reachable admin plane",
          "customers: rotate every environment variable again, even if you did in August"
        ]
      }
    },
    {
      id: "rankmath", stamp: "10.15",
      metric: { val: "9.8", label: { ja: "CVSS · CVE-2026-111862", en: "CVSS · CVE-2026-111862" } },
      visual: { type: "grid", cols: 12, rows: 6, hot: [34] }, cue: "glitch",
      sources: [{ name: "Wordfence PSA", url: "https://www.wordfence.com/blog/2026/10/rank-math-seo-pro-3-0-123-malware/",
        note: { ja: "2026-10-17", en: "2026-10-17" } }],
      ja: {
        kicker: "RANK MATH SEO PRO · PLUGIN CHANNEL",
        title: "11時間だけ、公式配布物が汚染された。",
        lede: "プラグインの更新経路は、そのまま攻撃経路になる。CVSS は 9.8。",
        points: [
          "10-15 20:02 → 10-16 07:12 UTC に取得した <b>3.0.123</b>",
          "<b>CVE-2026-111862</b> / CVSS 9.8 / 修正は 3.0.124",
          "更新は対策にならない — 管理者アカウント・追加ファイル・定期タスクを探す",
          "Wordfence は緊急ファイアウォールルールを前倒しで配布"
        ]
      },
      en: {
        kicker: "RANK MATH SEO PRO · PLUGIN CHANNEL",
        title: "For eleven hours, the official download was poison.",
        lede: "A plugin's update channel is an attack path. CVSS 9.8.",
        points: [
          "3.0.123 downloaded between 10-15 20:02 and 10-16 07:12 UTC",
          "<b>CVE-2026-111862</b> / CVSS 9.8 / fixed in 3.0.124",
          "updating is not remediation — hunt for admin accounts, extra files, scheduled tasks",
          "Wordfence shipped an emergency firewall rule early"
        ]
      }
    },
    {
      id: "teamupdraft", stamp: "10.17",
      metric: { val: "3", label: { ja: "key types abused", en: "key types abused" } },
      visual: { type: "fanout", nodes: 14 }, cue: "crack",
      sources: [
        { name: "TeamUpdraft notice", url: "https://teamupdraft.com/blog/security-incident-october-2026/",
          note: { ja: "10-19 公開 / 10-21 更新", en: "published 10-19, updated 10-21" } },
        { name: "Wordfence PSA", url: "https://www.wordfence.com/blog/2026/10/updraftcentral-connection-key-compromise/",
          note: { ja: "署名付きコマンドの分析", en: "analysis of the signed commands" } }
      ],
      ja: {
        kicker: "TEAMUPDRAFT · CONNECTION KEYS",
        title: "DBにあった鍵が、数千サイトの入口だった。",
        lede: "接続キーは「署名付きの正規コマンド」として使える。だから既存の修正では止まらない。",
        points: [
          "顧客DBが読まれた: 連絡先、ハッシュ化パスワード、2FA設定、<b>接続キー3種</b>",
          "UpdraftCentral / UpdraftVault / UpdraftClone のキーで悪性プラグインを投入",
          "署名が本物なので、CVE-2026-10795 適用済みでも受理された",
          "UpdraftPlus 1.26.13 / 2.26.13 が 10-18 22:00 BST 以前の接続を自動切断"
        ]
      },
      en: {
        kicker: "TEAMUPDRAFT · CONNECTION KEYS",
        title: "Keys in a database were the door to thousands of sites.",
        lede: "Connection keys work as validly signed commands, so the previous security fix did not stop them.",
        points: [
          "customer DB read: contact data, hashed passwords, 2FA settings, <b>three kinds of connection key</b>",
          "UpdraftCentral / UpdraftVault / UpdraftClone keys used to upload, activate and delete plugins",
          "the signatures were real, so sites with CVE-2026-10795 patched still accepted them",
          "UpdraftPlus 1.26.13 / 2.26.13 auto-disconnect anything connected before 10-18 22:00 BST"
        ]
      }
    },
    {
      id: "emudhra", stamp: "10.17",
      metric: { val: "4", label: { ja: "one private key, literally", en: "one private key, literally" } },
      visual: { type: "keys", count: 8, weakIndex: 3 }, cue: "crack",
      sources: [
        { name: "Google (Chrome Root Program)", url: "https://blog.google/security/protecting-chrome-and-android-users-from-compromised-emudhra-intermediate-ca-certificates/",
          note: { ja: "SPKI 遮断 / ルート削除", en: "SPKI block, root removal" } },
        { name: "Scott Helme", url: "https://scotthelme.co.uk/eight-bits-of-trust-emudhras-ca-keys-cracked-in-milliseconds/",
          note: { ja: "鍵の復元", en: "recovering the keys" } },
        { name: "Cisco Talos", url: "https://blog.talosintelligence.com/compromised-intermediate-certificates/",
          note: { ja: "8本の一覧・原因・Go の CVE（2026-10-21）", en: "the eight certs, the cause, Go's CVE (2026-10-21)" } },
        { name: "Ars Technica", url: "https://arstechnica.com/security/2026/10/the-internet-goes-on-high-alert-after-discovery-of-8-compromised-tls-certs/",
          note: { ja: "二次: 鍵の値と Heartbleed 比較", en: "secondary: the key values and the Heartbleed comparison" } },
        { name: "Mozilla bug 2083449", url: "https://bugzilla.mozilla.org/show_bug.cgi?id=2083449",
          note: { ja: "証明書一覧の原典", en: "source of the certificate table" } },
        { name: "Tailscale TS-2026-013", url: "https://tailscale.com/security-bulletins",
          note: { ja: "2026-10-21", en: "2026-10-21" } }
      ],
      ja: {
        kicker: "EMUDHRA · CERTIFICATE AUTHORITY",
        title: "鍵は盗まれていない。弱すぎた。",
        lede: "P-384 の秘密鍵が、小さい整数だった。当てられたのは「4, 56, 66, 115, 155, 156, 230, 237」。3〜8ビットしかない。",
        points: [
          "中間CA <b>8本</b>（TLS 6＋コード署名 2）。2025-04-30 の鍵生成で <b>24本</b>の下位CAを作る際、wrap/unwrap の不具合が「弱い鍵の2セット目」を生んだ",
          "10-17 18:05 UTC 報告 → 19:45 Chrome が SPKI で遮断 → 22:59 Firefox 全台。**Apple は TLS 6本、Microsoft はコード署名2本**を遮断",
          "ブラウザは自分の分を片付けただけ。残るのは Docker・Kubernetes・IoT・Python 同梱ルート——Go は <b>CVE-2026-111943</b> として 1.27.3 / 1.26.10 で拒否",
          "直近で鋭いのは <b>VPN クライアント</b>（Talos / Ars）。「Heartbleed より大きい後片付け」と Go の暗号担当"
        ]
      },
      en: {
        kicker: "EMUDHRA · CERTIFICATE AUTHORITY",
        title: "The keys were not stolen. They were too weak to be secret.",
        lede: "P-384 private keys that were small integers — 4, 56, 66, 115, 155, 156, 230, 237. Between 3 and 8 bits of entropy.",
        points: [
          "<b>eight</b> intermediate CAs (six TLS, two code signing). A 2025-04-30 ceremony for <b>24 subordinates</b> produced a second, weak key set through a wrap/unwrap flaw",
          "10-17 18:05 UTC report → 19:45 Chrome blocks by SPKI → 22:59 all Firefox. <b>Apple blocked the six TLS, Microsoft the two code-signing</b>",
          "Browsers only cleaned up their own copy: Docker, Kubernetes, IoT and Python bundles remain. Go shipped <b>CVE-2026-111943</b> in 1.27.3 / 1.26.10",
          "The sharpest near-term risk is <b>VPN clients</b> (Talos, Ars): \u201cbigger cleanup than Heartbleed\u201d, per Go's crypto maintainer"
        ]
      }
    },
    {
      id: "ovh", stamp: "10.19",
      metric: { val: "94", label: { ja: "minutes of exposure", en: "minutes of exposure" } },
      visual: { type: "ladder", steps: ["v0.11", "v0.12", "v0.13", "v0.14", "v0.15"], hot: 2 }, cue: "whoosh",
      sources: [{ name: "GHSA-862f-55f5-vmvw", url: "https://github.com/ovh/ovhcloud-cli/security/advisories/GHSA-862f-55f5-vmvw",
        note: { ja: "2026-10-20 公開", en: "published 2026-10-20" } }],
      ja: {
        kicker: "OVHCLOUD CLI · RELEASE ASSETS",
        title: "94分間、公式バイナリは別物だった。",
        lede: "ソースもビルドも無事。壊れたのは「リリース資産を差し替えられない」という前提。",
        points: [
          "10-19 14:47〜16:21（UTC+2）に資産が差し替え",
          "対象は <b>v0.11.0〜v0.15.0</b>、影響はその時間帯の取得のみ",
          "原因: リポジトリがリリースの不変性（immutability）を保証していなかった",
          "対策は設定ひとつ: 不変リリース＋署名検証"
        ]
      },
      en: {
        kicker: "OVHCLOUD CLI · RELEASE ASSETS",
        title: "For 94 minutes, the official binary was something else.",
        lede: "Source and build chain were fine. What broke was the assumption that release assets cannot be replaced.",
        points: [
          "assets replaced 10-19 between 14:47 and 16:21 UTC+2",
          "releases <b>v0.11.0–v0.15.0</b>; only downloads inside that window are affected",
          "root cause: the repository was not configured for release immutability",
          "the fix is a setting plus verification: immutable releases and signature checks"
        ]
      }
    },
    {
      id: "oracle", stamp: "10.20",
      metric: { val: "55", label: { ja: "CVEs · 49 remote, no auth", en: "CVEs · 49 remote, no auth" } },
      visual: { type: "matrix", cols: 11, rows: 5, swap: true }, cue: "confirm",
      sources: [
        { name: "Oracle CPU 2026-10", url: "https://www.oracle.com/security-alerts/cpuoct2026.html",
          note: { ja: "Java SE Risk Matrix", en: "Java SE risk matrix" } },
        { name: "IPA alert", url: "https://www.ipa.go.jp/security/security-alert/2026/1021-jre.html",
          note: { ja: "2026-10-21", en: "2026-10-21" } }
      ],
      ja: {
        kicker: "ORACLE · JAVA SE CRITICAL PATCH UPDATE",
        title: "55件。最大は 7.5。厄介なのは版。",
        lede: "「影響を受ける版」と「修正版」は別の列。21.0.12.1 は影響版で、修正は 21.0.13。",
        points: [
          "55件 / 認証不要でリモート 49件 / 最大 CVSS 7.5 / KEV 0件",
          "影響: 8u503, 11.0.32.1, 17.0.20.1, 21.0.12.1, 25.0.4.1, 26.0.2, 27",
          "修正（10-20）: <b>8u511 / 11.0.33 / 17.0.21 / 21.0.13 / 25.0.5 / 27.0.1</b>",
          "JDK 26 に修正は無い（26.0.3 は存在しない）→ 27 へ"
        ]
      },
      en: {
        kicker: "ORACLE · JAVA SE CRITICAL PATCH UPDATE",
        title: "55 fixes, highest 7.5 — and the version column is the trap.",
        lede: "\u201cAffected\u201d and \u201cfixed\u201d are different columns. 21.0.12.1 is affected; the fix is 21.0.13.",
        points: [
          "55 CVEs / 49 exploitable remotely without auth / highest CVSS 7.5 / zero in KEV",
          "affected: 8u503, 11.0.32.1, 17.0.20.1, 21.0.12.1, 25.0.4.1, 26.0.2, 27",
          "fixed on 10-20: <b>8u511 / 11.0.33 / 17.0.21 / 21.0.13 / 25.0.5 / 27.0.1</b>",
          "JDK 26 gets no fix (there is no 26.0.3) — move to 27"
        ]
      }
    },
    {
      id: "plex", stamp: "10.20",
      metric: { val: "4/5", label: { ja: "CVEs in KEV · due 10-23", en: "CVEs in KEV · due 10-23" } },
      visual: { type: "chain", nodes: ["TOKEN", "SSRF", "PLUGIN", "ADMIN", "EXEC"], deadline: true }, cue: "alarm",
      sources: [
        { name: "CISA CSAF VA-26-266-01", url: "https://github.com/cisagov/CSAF/blob/develop/csaf_files/IT/white/2026/va-26-266-01.json",
          note: { ja: "5件と修正版", en: "five CVEs and the fixed build" } },
        { name: "CISA KEV", url: "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
          note: { ja: "期限と連鎖の注記", en: "due dates and the chain note" } }
      ],
      ja: {
        kicker: "PLEX MEDIA SERVER · KEV",
        title: "4.3 の SSRF が、コード実行への入口になる。",
        lede: "個々のスコアは平凡。CISA の KEV は、その4件が連鎖すると明記している。",
        points: [
          "KEV 追加 10-20 / 期限 <b>10-23</b>（96656 と 96654）",
          "連鎖: 任意の X-Plex-Token → SSRF → プラグイン呼び出し → 管理書き込み → 起動時に .so 実行",
          "96651 は KEV 外だが <b>PlexOnlineToken</b> を読む＝アカウント掌握",
          "修正 <b>1.43.3.10861</b>、最新は <b>1.43.5.11029</b>（2026-10-23 10:36 JST 時点）。NAS のパッケージは遅れる"
        ]
      },
      en: {
        kicker: "PLEX MEDIA SERVER · KEV",
        title: "A 4.3 SSRF is the front door to code execution.",
        lede: "No individual score is remarkable. CISA's KEV entry says the four chain together.",
        points: [
          "added to KEV 10-20 / due <b>10-23</b> for 96656 and 96654",
          "chain: any X-Plex-Token → SSRF → plugin call → admin file write → .so executed at startup",
          "96651 is not in KEV, yet it reads <b>PlexOnlineToken</b> — account takeover",
          "fixed in <b>1.43.3.10861</b>, but the current release is <b>1.43.5.11029</b>; NAS stores lag"
        ]
      }
    },
    {
      id: "apache", stamp: "10.20",
      metric: { val: "9.1", label: { ja: "Tomcat · auth bypass (CVSS 4.0)", en: "Tomcat auth bypass · CVSS 4.0" } },
      visual: { type: "ladder", steps: ["11.0.27", "10.1.61", "9.0.123"], hot: 0, wide: true }, cue: "confirm",
      sources: [
        { name: "Apache Tomcat security", url: "https://tomcat.apache.org/security-11.html",
          note: { ja: "ラベル・影響範囲・修正版", en: "labels, affected ranges, fixed versions" } },
        { name: "Apache httpd 2.4", url: "https://httpd.apache.org/security/vulnerabilities_24.html",
          note: { ja: "2.4.69", en: "2.4.69" } },
        { name: "NVD (CVE-2026-101356)", url: "https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-101356",
          note: { ja: "security@apache.org 起票", en: "filed by security@apache.org" } }
      ],
      ja: {
        kicker: "ADDENDUM · APACHE TOMCAT / HTTPD / TRAFFIC SERVER",
        title: "「Important」の中身は、利用者間の混線だった。",
        lede: "Tomcat の3件は仕組みが違って結末が同じ。httpd の「low」は 7.5。深刻度は1つの数字ではない。",
        points: [
          "Tomcat: 認証バイパス（JNDIRealm 非GSSAPI SASL）＋ HTTP/2 / AJP の応答混線 — <b>11.0.27 / 10.1.61 / 9.0.123</b>",
          "httpd <b>2.4.69</b>: mod_rewrite の UAF と mod_proxy_html の範囲外書き込み。Apache は low、NVD は 7.5",
          "Traffic Server: リクエストスマグリング2件（8.9 / 8.7）",
          "KEV は0件。ただし「未公開」＝安全ではない"
        ]
      },
      en: {
        kicker: "ADDENDUM · APACHE TOMCAT / HTTPD / TRAFFIC SERVER",
        title: "Three \u201cImportant\u201d bugs, one outcome: another user's data.",
        lede: "Tomcat's three differ in mechanism and share a result. httpd's \u201clow\u201d is scored 7.5. Severity is not one number.",
        points: [
          "Tomcat: auth bypass in JNDIRealm (non-GSSAPI SASL) plus HTTP/2 and AJP response mix-ups — <b>11.0.27 / 10.1.61 / 9.0.123</b>",
          "httpd <b>2.4.69</b>: mod_rewrite UAF and a mod_proxy_html out-of-bounds write. Apache says low; NVD says 7.5",
          "Traffic Server: two request-smuggling CVEs (8.9 / 8.7)",
          "Nothing in KEV — no published exploitation is not the same as safe"
        ]
      }
    },
    {
      id: "php-race", stamp: "10.21",
      metric: { val: "6h17m", label: { ja: "probes before the fix", en: "probes before the fix" } },
      visual: { type: "clock", marks: [["07:43", 0.32], ["14:00", 0.58], ["14:17", 0.61]] }, cue: "alarm",
      sources: [
        { name: "docs/00 timeline", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/00-timeline.md",
          note: { ja: "07:43 / 14:00 / 14:17", en: "07:43 / 14:00 / 14:17" } },
        { name: "CISA alert", url: "https://www.cisa.gov/news-events/alerts/2026/10/21/critical-vulnerabilities-php-require-immediate-patching",
          note: { ja: "2026-10-21", en: "2026-10-21" } }
      ],
      ja: {
        kicker: "PHP · THE SIX-HOUR GAP",
        title: "修正の6時間前に、試行は来ていた。",
        lede: "「PoC が出てから慌てる」では間に合わない種類の脆弱性。同じ日に Node.js も動いた。",
        points: [
          "<b>07:43 UTC</b> Cloudflare が修正公開前の攻撃試行を観測",
          "<b>14:00</b> PHP が修正版を公開 / <b>14:17</b> NVD が CVE を公開",
          "同じ日: Node.js 22.23.4 / 24.22.1 / 26.12.1（CAバンドル更新も同梱）",
          "公開の24時間、露出していた構成は侵害有無を別途確認する"
        ]
      },
      en: {
        kicker: "PHP · THE SIX-HOUR GAP",
        title: "The probes arrived six hours before the fix.",
        lede: "The kind of bug where waiting for a public PoC is already too late. Node.js moved the same day.",
        points: [
          "<b>07:43 UTC</b> Cloudflare observes attempts before the fix ships",
          "<b>14:00</b> PHP releases / <b>14:17</b> NVD publishes the CVE",
          "same day: Node.js 22.23.4 / 24.22.1 / 26.12.1, including the CA bundle",
          "anything exposed during those 24 hours needs a separate compromise check"
        ]
      }
    },
    {
      id: "gitlab", stamp: "10.21",
      metric: { val: "10.0", label: { ja: "CVSS · unauthenticated", en: "CVSS · unauthenticated" } },
      visual: { type: "ladder", steps: ["19.5.1", "19.4.3", "19.3.6", "19.2.9", "19.1.9", "19.0.10", "18.11.13"], hot: 3, wide: true }, cue: "confirm",
      sources: [{ name: "GitLab patch release", url: "https://docs.gitlab.com/releases/patches/patch-release-gitlab-19-5-1-released/",
        note: { ja: "影響範囲・検知2つ", en: "affected ranges and two detections" } }],
      ja: {
        kicker: "GITLAB · CVSS 10.0",
        title: "先週パッチを当てていても、該当する。",
        lede: "10月12日の更新は 19.2 以降のみ。今回の修正版は、その1つ上。",
        points: [
          "<b>CVE-2026-110264</b> / Onigmo の整数オーバーフロー / 未認証 RCE / 7.0（2014）以降すべて",
          "修正: 19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13",
          "10月12日にパッチを当てた環境も、19.2.9 未満なら再び該当（修正版はその1つ上）",
          "公開された回避策は無い。下げるなら到達性を消す"
        ]
      },
      en: {
        kicker: "GITLAB · CVSS 10.0",
        title: "Patching last week does not put you on the fix.",
        lede: "The 12 October update covered 19.2 and later. This fix sits one release above it.",
        points: [
          "<b>CVE-2026-110264</b> / integer overflow in Onigmo / unauthenticated RCE / every release since 7.0 (2014)",
          "fixed: 19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13",
          "an instance updated on 12 October is affected again below 19.2.9",
          "no published workaround — if you cannot upgrade, remove internet reachability"
        ]
      }
    },
    {
      id: "npm", stamp: "10.21",
      metric: { val: "345", label: { ja: "repos swept · 16 minutes", en: "repos swept · 16 minutes" } },
      visual: { type: "packages", items: ["litellm", "tensorlake", "subql", "ghostaction", "railway", "zeabur", "opencode"] }, cue: "glitch",
      sources: [
        { name: "StepSecurity (tensorlake)", url: "https://www.stepsecurity.io/blog/tensorlake-npm-compromised-hostage-token-worm",
          note: { ja: "2026-10-08", en: "2026-10-08" } },
        { name: "StepSecurity (SubQuery)", url: "https://www.stepsecurity.io/blog/subql-ecosystem-compromised",
          note: { ja: "2026-10-05", en: "2026-10-05" } },
        { name: "StepSecurity (GhostAction)", url: "https://www.stepsecurity.io/blog/ghostaction-returns",
          note: { ja: "2026-10-09", en: "2026-10-09" } }
      ],
      ja: {
        kicker: "PACKAGE CHANNELS · FOUR INCIDENTS",
        title: "配布物そのものが、攻撃面になった。",
        lede: "10月の8件はコード配布の問題。provenance は「どこで作られたか」しか言わない。",
        points: [
          "LiteLLM 1.107.0: 起動時に窃取。そっくりリポジトリ <b>Berri-AI</b> からビルド",
          "tensorlake@0.5.144: 失効させると <b>$HOME</b> を消す「人質トークン」",
          "@subql/common@5.8.3: インストール時と import 時の両方で起動",
          "GhostAction: 偽 security-audit.yml が <b>345</b> リポジトリの秘密と履歴を送出"
        ]
      },
      en: {
        kicker: "PACKAGE CHANNELS · FOUR INCIDENTS",
        title: "The distribution itself became the attack surface.",
        lede: "Eight of October's incidents are about how code is delivered. Provenance only says where it was built.",
        points: [
          "LiteLLM 1.107.0: runs a stealer on any Python start, built from the lookalike <b>Berri-AI</b>",
          "tensorlake@0.5.144: a hostage token that wipes <b>$HOME</b> if you revoke it",
          "@subql/common@5.8.3: executes at install and again on import",
          "GhostAction: a fake security-audit.yml shipped secrets and git history out of <b>345</b> repos"
        ]
      }
    },
    {
      id: "railway", stamp: "10.21",
      metric: { val: "ALL", label: { ja: "env vars to rotate", en: "env vars to rotate" } },
      visual: { type: "pillars" }, cue: "whoosh",
      sources: [{ name: "Railway disclosure", url: "https://blog.railway.com/p/security-disclosure-wednesday-october-21st",
        note: { ja: "2026-10-21", en: "2026-10-21" } }],
      ja: {
        kicker: "RAILWAY · ENVIRONMENT VARIABLES",
        title: "環境変数は、秘密の置き場所だった。",
        lede: "「AI推論プロバイダを狙う一連の攻撃の一部」——ベンダ自身がそう書いた。",
        points: [
          "顧客の環境変数が暗号化のまま読まれ、一部は復号された可能性",
          "調査中は全デプロイを停止、上流プロバイダへ鍵の先制失効を依頼",
          "必要なのは「漏れたかもしれない鍵」ではなく<b>全部</b>のローテート",
          "SMTP パスワード、webhook 署名秘密、JWT_SECRET も環境変数の中にある"
        ]
      },
      en: {
        kicker: "RAILWAY · ENVIRONMENT VARIABLES",
        title: "Environment variables were the secret store.",
        lede: "\u201cPart of a series of attacks on platform companies aimed at AI inference providers\u201d — the vendor's own words.",
        points: [
          "customer environment variables read encrypted, some possibly decrypted",
          "all deployments paused; upstream providers asked to revoke keys proactively",
          "the job is <b>every</b> variable, not the one you think leaked",
          "SMTP passwords, webhook signing secrets and JWT_SECRET live in there too"
        ]
      }
    },
    {
      id: "bind", stamp: "10.21",
      metric: { val: "8.1", label: { ja: "CVSS · 回避策なし", en: "CVSS · no workaround" } },
      visual: { type: "dns", clients: 7 }, cue: "alarm",
      sources: [
        { name: "ISC advisory", url: "https://kb.isc.org/docs/cve-2026-94300",
          note: { ja: "深刻度・影響版・修正版・「回避策なし」の正", en: "severity, versions, \"no workarounds\"" } },
        { name: "CVE.org", url: "https://www.cve.org/CVERecord?id=CVE-2026-94300",
          note: { ja: "CNA（ISC）の原文", en: "the CNA (ISC) text" } },
        { name: "NVD", url: "https://nvd.nist.gov/vuln/detail/CVE-2026-94300",
          note: { ja: "CVSS 8.1 / AV:N/AC:H", en: "CVSS 8.1 / AV:N/AC:H" } },
        { name: "docs/18", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/18-bind-cve-2026-94300.md",
          note: { ja: "設定の確認方法", en: "how to check your config" } }
      ],
      ja: {
        kicker: "ADDENDUM · ISC BIND 9 / DNS",
        title: "再送された1パケットが、メモリを壊す。",
        lede: "GSS-TSIG で署名された UDP を再生されると named が壊れる。ISC は「回避策なし」と明記。",
        points: [
          "<b>CVE-2026-94300</b> / CVSS 8.1（AV:N・AC:H）/ 深刻度 <b>High</b> / リモートから",
          "影響: 9.11.0–9.18.50、9.20.0–9.20.29、9.21.0–9.21.26（S1 系も）→ 修正 <b>9.20.30 / 9.21.27</b>",
          "入口は GSS-TSIG ハンドラ。`named-checkconf -p | grep -i gssapi` で設定の有無を確認",
          "回避策は無い。EOL ブランチ（9.11〜9.18）は 9.20 / 9.21 へ移すしかない"
        ]
      },
      en: {
        kicker: "ADDENDUM · ISC BIND 9 / DNS",
        title: "One replayed packet corrupts memory.",
        lede: "Replaying a GSS-TSIG-signed UDP message breaks `named`. ISC states there is no workaround.",
        points: [
          "<b>CVE-2026-94300</b> / CVSS 8.1 (AV:N, AC:H) / ISC severity <b>High</b> / remotely exploitable",
          "Affected 9.11.0–9.18.50, 9.20.0–9.20.29, 9.21.0–9.21.26 (and S1) → fixed in <b>9.20.30 / 9.21.27</b>",
          "The path is the GSS-TSIG handler: `named-checkconf -p | grep -i gssapi` tells you if it is configured",
          "No workaround. EOL branches (9.11–9.18) have to move to 9.20 / 9.21"
        ]
      }
    },
    {
      id: "lkml", stamp: "10.22",
      metric: { val: "6", label: { ja: "reports sent public", en: "reports sent public" } },
      visual: { type: "leak", ids: ["33549", "33774", "33367", "34068", "34076", "32005"] }, cue: "glitch",
      sources: [
        { name: "Phoronix (2026-10-22)", url: "https://www.phoronix.com/news/LKML-New-Trend-Vulnerabilities",
          note: { ja: "二次。全件の LKML リンク付き", en: "secondary, but links every report" } },
        { name: "lore.kernel.org", url: "https://lore.kernel.org/lkml/",
          note: { ja: "一次メッセージ。Anubis が自動取得をブロック", en: "the primary messages — Anubis blocks automated fetch" } },
        { name: "torvalds/linux", url: "https://github.com/torvalds/linux/commits/master",
          note: { ja: "ZDI ID を参照するコミットは無い（10-22）", en: "no commit references the ZDI ids (10-22)" } },
        { name: "docs/17", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/17-lkml-oct2026.md",
          note: { ja: "何を検証できた/できなかったか", en: "what was and was not verifiable" } }
      ],
      ja: {
        kicker: "ADDENDUM · LINUX KERNEL / LKML",
        title: "公開リストに、0day が6件流れた。",
        lede: "ZDI が非公開の security リストではなく公開の LKML に投稿。Greg Kroah-Hartman が各件に返信している。",
        points: [
          "SMB Direct の整数アンダーフロー（<b>9.0</b>）と ksmbd の競合（<b>9.0</b>）——どちらもリモート RCE",
          "skb_zerocopy の LPE、vmwgfx の範囲外書き込み、nvmet の未初期化、TCP クエリのスタック溢れ",
          "mainline は<b>未修正</b>。v7.5 向けブランチと -next にパッチ（10-22 時点）。ZDI ID を参照する mainline コミットは無い",
          "露出削減: 使っていない <b>ksmbd</b> を止める / SMB Direct を untrusted に晒さない"
        ]
      },
      en: {
        kicker: "ADDENDUM · LINUX KERNEL / LKML",
        title: "Six 0-days went to the public list.",
        lede: "ZDI sent the reports to the public LKML instead of the private security list, and Greg Kroah-Hartman replied to each one asking why.",
        points: [
          "SMB Direct integer underflow (<b>9.0</b>) and a ksmbd race (<b>9.0</b>) — both remote code execution",
          "skb_zerocopy LPE, a vmwgfx out-of-bounds write, an nvmet uninitialised resource, a TCP search-domain overflow",
          "Mainline is <b>unpatched</b>: fixes sit in a v7.5 branch and -next (10-22), and no mainline commit references the ZDI ids",
          "Reduce exposure: stop <b>ksmbd</b> if unused, never expose SMB Direct to untrusted networks"
        ]
      }
    },
    {
      id: "sweep", stamp: "10.23",
      metric: { val: "104 : 1", label: { ja: "critical CVEs : known exploited", en: "critical CVEs : known exploited" } },
      visual: { type: "bars", values: [104, 1], labels: ["CRITICAL", "KEV"] }, cue: "confirm",
      sources: [
        { name: "NVD API 2.0", url: "https://services.nvd.nist.gov/rest/json/cves/2.0?cvssV3Severity=CRITICAL",
          note: { ja: "2026-10-08〜10-22", en: "2026-10-08 to 10-22" } },
        { name: "EPSS API", url: "https://api.first.org/data/v1/epss",
          note: { ja: "確率は遅れる", en: "the probability lags" } },
        { name: "docs/13", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/13-recent-criticals.md",
          note: { ja: "生き残った12件", en: "the twelve that survived" } }
      ],
      ja: {
        kicker: "THE SWEEP · NVD, 14 DAYS",
        title: "同じコマンドで 125 → 104。世界は変わっていない。",
        lede: "窓は「今日」で終わる。だから数字は時計と一緒に動く。件数はリスクではなく、開示と解析のまとめ方を測っている。",
        points: [
          "9時間前は125件、いまは104件。内訳は <b>−17（窓の端）−4（CRITICAL から離脱）＋0（新規）</b>",
          "NVD の CPE 紐付けは <b>26%</b>。直近24時間に公開された381件は <b>0%</b>（解析がまだ）",
          "EPSS 最高は <b>5.76%</b> — php2shell の 109619。ただし 8.1 に下がって CRITICAL の外",
          "CNA と NVD でスコアが割れる: MOVEit / TeamCity は 8.1（AC:H）と 9.8（AC:L）"
        ]
      },
      en: {
        kicker: "THE SWEEP · NVD, 14 DAYS",
        title: "Same command: 125, then 104. Nothing was fixed.",
        lede: "The window ends \'today\', so the number moves with the clock. A count measures disclosure and analysis batching, not risk.",
        points: [
          "125 nine hours ago, 104 now: <b>-17</b> at the window edge, <b>-4</b> left the CRITICAL band, <b>+0</b> new",
          "only <b>26%</b> have an NVD CPE mapping — and of the 381 CVEs published in the last 24 h, <b>0%</b> do",
          "highest EPSS: <b>5.76%</b> (php2shell 109619) — which has since dropped to 8.1, outside the band",
          "CNA and NVD disagree: MOVEit and TeamCity are 8.1 (AC:H) from the vendor, 9.8 (AC:L) from NVD"
        ]
      }
    },
    {
      id: "infinity-core", stamp: "10.16",
      metric: { val: "6 : 5", label: { ja: "CVE : root 取得 PoC", en: "CVEs : root PoCs" } },
      visual: { type: "core", parts: ["TIMER", "SIGNAL", "MM", "FUTEX", "SCHED", "SLAB"],
        fixed: "FIXED: 6.6.158 / 6.12.112 / 6.18.54 / 7.2.8" }, cue: "crack",
      sources: [
        { name: "V4bel/InfinityCore", url: "https://github.com/V4bel/InfinityCore",
          note: { ja: "研究者本人による一次文書。PoC と修正コミット", en: "the researcher's own document, PoCs and fix commits" } },
        { name: "oss-security 2026-10-16", url: "https://openwall.com/lists/oss-security/2026/10/16/36",
          note: { ja: "エンバーゴ終了後の公開", en: "published after the linux-distros embargo" } },
        { name: "linux-cve-announce (98260)", url: "https://lists.openwall.net/linux-cve-announce/2026/10/06/118",
          note: { ja: "Fixed in 6.6.158 / 6.12.112 / 6.18.54 / 7.2.8 / 7.3-rc4", en: "the per-branch fixed-in lines" } },
        { name: "docs/20", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/20-infinity-core.md",
          note: { ja: "docs/17 の6件との違いもここ", en: "including why this is not the six in docs/17" } }
      ],
      ja: {
        kicker: "POSTSCRIPT · LINUX KERNEL",
        title: "カーネルの中核に、root への近道が6本。",
        lede: "Hyunwoo Kim が oss-security に公開した「Infinity Core」。5件で非特権から root、同じ5件でコンテナからホストへ抜ける。",
        points: [
          "timer / signal / mm / futex / scheduler / SLAB。ネットワークも BPF も user namespace も使わない",
          "NVD は4件に <b>7.8</b>、2件はスコア無し。6件とも解析前（<code>Received</code>）で KEV には無い",
          "<b>修正は既に出ている</b>。6.6.158 / 6.12.112 / 6.18.54 / 7.2.8、スケジューラは 7.2.9。現行 stable はすべて超えている",
          "効くのは<b>再起動</b>。入れただけで古いカーネルで動いていれば、開いたまま"
        ]
      },
      en: {
        kicker: "POSTSCRIPT · LINUX KERNEL",
        title: "Six shortcuts to root, in the kernel\'s own core.",
        lede: "Hyunwoo Kim published \'Infinity Core\' on oss-security: five of the six take an unprivileged user to root, and the same five escape a container to the host.",
        points: [
          "timer, signal, mm, futex, scheduler, SLAB — no networking, no BPF, no user namespaces needed",
          "NVD scores four at <b>7.8</b> and two not at all; all six sit at <code>Received</code> and none is in KEV",
          "<b>The fix already shipped</b>: 6.6.158 / 6.12.112 / 6.18.54 / 7.2.8, scheduler in 7.2.9 — every current stable line is above it",
          "What works is the <b>reboot</b>. A patched package next to a running old kernel leaves it open"
        ]
      }
    },
    {
      id: "blindspot", stamp: "10.23",
      metric: { val: "0", label: { ja: "この6件を報じたフィード", en: "feeds that carried this" } },
      visual: { type: "channels" }, cue: "glitch",
      sources: [
        { name: "seclists / oss-sec", url: "https://seclists.org/rss/oss-sec.rss",
          note: { ja: "13本目として追加した開示チャネル", en: "the thirteenth feed, added for this" } },
        { name: "NVD API 2.0 (pubStartDate)", url: "https://services.nvd.nist.gov/rest/json/cves/2.0",
          note: { ja: "公開日で引くと 9/4〜10/12 の CVE は出ない", en: "a publication-date sweep cannot see 9/4-10/12 CVEs" } },
        { name: "docs/21 §3", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/21-snapshot-1036jst.md",
          note: { ja: "広域スイープで分かった盲点", en: "the blind spot the broad sweep found" } }
      ],
      ja: {
        kicker: "POSTSCRIPT · THE BLIND SPOT",
        title: "スイープは、データベースの仕事しか見ていない。",
        lede: "公開日で引いても、更新日で引いても、12本のフィードを読んでも、Infinity Core は出てこなかった。",
        points: [
          "CVE の公開日は <b>9/4〜10/12</b>。PoC が出たのは <b>10/16</b> — 6週間のずれ",
          "NVD レコードは6時間の更新スイープで動いていない。6件とも <code>Received</code>",
          "フィード13本のタイトルに <code>infinity</code> は <b>0件</b>。RSS もまた窓で、記録はアーカイブ側",
          "足した軸は<b>開示チャネル</b>。<code>oss-sec</code> を足した回で、他12本が落とした4件が拾えた"
        ]
      },
      en: {
        kicker: "POSTSCRIPT · THE BLIND SPOT",
        title: "A sweep only sees what the database did.",
        lede: "Not by publication date, not by modification date, and not in any of twelve feeds — Infinity Core appeared in none of them.",
        points: [
          "the CVEs were published <b>9/4-10/12</b>; the PoCs landed <b>10/16</b> — a six-week gap",
          "their NVD records did not move in the 6-hour modification sweep; all six sit at <code>Received</code>",
          "<code>infinity</code> appears in <b>0</b> of the 13 feeds\' titles — an RSS head is a window too; the archive is the record",
          "the missing axis is the <b>disclosure channel</b>: adding <code>oss-sec</code> picked up four items the other twelve missed"
        ]
      }
    },
    {
      id: "ecosystem", stamp: "10.23",
      metric: { val: "58", label: { ja: "24時間のパッケージ勧告", en: "package advisories in 24 h" } },
      visual: { type: "stack",
        cards: [
          { name: "NEXT.JS use cache", sev: "crit", fix: "16.4.1", cve: null },
          { name: "NEXT.JS /_next/image", sev: "crit", fix: "15.5.28", cve: null },
          { name: "DOMPURIFY", sev: "crit", fix: "3.4.17", cve: null },
          { name: "PILLOW", sev: "crit", fix: "13.0.0", cve: "CVE-2026-96639" },
          { name: "GITPYTHON", sev: "high", fix: "3.2.1", cve: "CVE-2026-114145" },
          { name: "STORYBOOK", sev: "high", fix: "8.6.19", cve: "CVE-2026-114126" }
        ] }, cue: "blip",
      sources: [
        { name: "GitHub Advisory DB", url: "https://api.github.com/advisories",
          note: { ja: "エコシステム側の見え方。修正版つき", en: "the ecosystem view, with patched versions" } },
        { name: "certifi / pip / uv / sigstore", url: "https://pypi.org/pypi/certifi/json",
          note: { ja: "CA バンドルの下限（2026-10-22 公表）", en: "the CA bundle floors published 2026-10-22" } },
        { name: "docs/21 §2.3", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/21-snapshot-1036jst.md",
          note: { ja: "24時間のエコシステム一覧", en: "the 24-hour ecosystem list" } }
      ],
      ja: {
        kicker: "POSTSCRIPT · THE ECOSYSTEM",
        title: "CVE になっていない critical が、2件あった。",
        lede: "GitHub Advisory Database の24時間。Next.js の未認証 RCE 2件には、まだ CVE が付いていない。",
        points: [
          "Next.js の <code>use cache</code> と画像最適化（SVG）の未認証 RCE。修正は <b>16.4.1</b> / <b>15.5.28</b>",
          "DOMPurify 3.4.17、Pillow 13.0.0、GitPython 3.2.1、<code>toml</code> 5.0.1、Storybook 8.6.19",
          "CVE で絞るプロセスには、この2件は最後まで見えない。判断はパッケージ名と修正版で",
          "同じ日に Python の CA バンドルも版番号が出た: <code>certifi</code> 2026.10.19 / <code>pip</code> 26.2.2"
        ]
      },
      en: {
        kicker: "POSTSCRIPT · THE ECOSYSTEM",
        title: "Two criticals that are not CVEs.",
        lede: "24 hours of the GitHub Advisory Database. Both Next.js unauthenticated RCE advisories still have no CVE id.",
        points: [
          "Next.js <code>use cache</code> and image-optimisation (SVG) RCE: fixed in <b>16.4.1</b> / <b>15.5.28</b>",
          "DOMPurify 3.4.17, Pillow 13.0.0, GitPython 3.2.1, <code>toml</code> 5.0.1, Storybook 8.6.19",
          "a process that filters on CVE ids never sees these; decide on package name and patched version",
          "the same day named the Python CA floors: <code>certifi</code> 2026.10.19, <code>pip</code> 26.2.2"
        ]
      }
    },
    {
      id: "closing", stamp: "NOW",
      metric: null,
      visual: { type: "storm" }, cue: "whoosh",
      sources: [
        { name: "docs/14 supply chain", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/14-supply-chain-oct2026.md",
          note: { ja: "14件確認 / 1件未確認", en: "14 verified, one not" } },
        { name: "docs/15 Apache", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/15-apache-oct2026.md",
          note: { ja: "深刻度ラベルの食い違い", en: "labels versus CVSS" } },
        { name: "docs/16 snapshot 21:20 JST", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/16-snapshot-2120jst.md",
          note: { ja: "当日2回目の取得と差分", en: "second read of the day, with the diff" } },
        { name: "docs/19 snapshot 07:25 JST", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/19-snapshot-0730jst.md",
          note: { ja: "夜間の再取得。NVD の再評価とエージェントの許可ゲート", en: "overnight re-read: NVD rescore, agent approval gates" } },
        { name: "docs/20 Infinity Core", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/20-infinity-core.md",
          note: { ja: "カーネル中核の LPE 6件。5件で PoC、修正は既出", en: "six kernel core LPEs, five with PoCs, fix already shipped" } },
        { name: "docs/21 broad sweep 10:36 JST", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/21-snapshot-1036jst.md",
          note: { ja: "全深刻度・パッケージ・開示チャネルまで", en: "every severity, the packages, and the disclosure channel" } },
        { name: "docs/20 Infinity Core", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/20-infinity-core.md",
          note: { ja: "カーネル中核の LPE 6件。5件で PoC、修正は既出", en: "six kernel core LPEs, five with PoCs, fix already shipped" } },
        { name: "docs/21 broad sweep 10:36 JST", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/21-snapshot-1036jst.md",
          note: { ja: "全深刻度・パッケージ・開示チャネルまで", en: "every severity, the packages, and the disclosure channel" } },
        { name: "Repository", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident",
          note: { ja: "一次ソースと検証コマンド", en: "primary sources and re-fetch commands" } }
      ],
      ja: {
        kicker: "WHAT IT MEANS",
        title: "リスクは、書いたコードではない。",
        lede: "10月に壊れたのは「何のコードが動くかを決める信頼」の側。効く統制は地味で、ほとんどが設定です。",
        points: [
          "リリースの不変性と、インストール時の署名検証",
          "ハッシュ付きの版固定。`latest` を使わない。git タグとの差分を見る",
          "平文・長期の管理者資格情報を置かない。管理系は公開しない",
          "ベンダのDBは自分の鍵を保持していると考える（TeamUpdraft / Railway / Zeabur）",
          "カーネルは「アプリごとに直せない境界」。コンテナ内のコード実行は、ホストでは root の入口"
        ]
      },
      en: {
        kicker: "WHAT IT MEANS",
        title: "The risk is not the code you write.",
        lede: "What broke in October was the trust layer that decides which code runs. The controls that help are dull, and mostly configuration.",
        points: [
          "release immutability, plus signature verification at install time",
          "pin versions with hashes; no `latest`; read the diff against the git tag",
          "no plaintext, long-lived admin credentials; keep the admin plane private",
          "assume a vendor's database holds your keys (TeamUpdraft / Railway / Zeabur)",
          "the kernel is the boundary you cannot patch per app: code in a container is a step to host root"
        ]
      }
    }
  ]
};
