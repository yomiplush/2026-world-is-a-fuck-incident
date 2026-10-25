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
      coverSub: "2026年10月に重なった15件を、時系列で。<br>Apache・カーネルと10-23追記に加え、10-24の広域調査8画面と10-25追補とTailworm大特集6画面。全49画面。タップで進みます。音が出ます。",
      coverStart: "TAP TO BEGIN",
      coverFoot: "出典付き。ConnectWiseは10/25調査で一次確認。古い場面は当時の記録です。",
      drawerTitle: "出典 / SOURCES",
      drawerFoot: "10/25追補は個別出典付き。ConnectWiseの旧「未確認」は今回更新。実取得は基準時刻後です。",
      asof: "2026-10-25 23:18 JST 基準",
      lang: "JA"
    },
    en: {
      chapter: "BRIEFING", sound: "SOUND", on: "ON", off: "OFF",
      sources: "SOURCES", close: "CLOSE", tap: "NEXT", replay: "REPLAY",
      hint: "tap / click / space",
      hintEnd: "end of briefing — tap to restart",
      coverKicker: "INCIDENT BRIEFING · 2026-10",
      coverTitleA: "ONE MONTH,", coverTitleB: "15 INCIDENTS.",
      coverSub: "The fifteen October incidents, in order.<br>Plus the broad updates and a six-scene Tailworm special. 49 scenes total. Tap to advance.",
      coverStart: "TAP TO BEGIN",
      coverFoot: "Sources included. ConnectWise now has primary confirmation; earlier scenes retain historical context.",
      drawerTitle: "SOURCES",
      drawerFoot: "October 25 sources supersede the old ConnectWise uncertainty. Sources were retrieved after the cutoff.",
      asof: "cutoff 2026-10-25 23:18 JST",
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
          "当初の14件に加え、<b>ConnectWiseも一次確認</b>。10/25追補に現在の対応を掲載",
          "音が出ます。右上の SOUND で消せます"
        ]
      },
      en: {
        kicker: "INCIDENT BRIEFING · 2026-10",
        title: "One month, fifteen incidents.",
        lede: "Unrelated failures that kept landing on the same kind of weakness. Tap through them in order.",
        points: [
          "<b>8 of 15</b> are npm / pip / plugin / release-asset problems — the <em>distribution</em>, not the code",
          "ConnectWise now also has <b>primary confirmation</b>; see the October 25 addendum",
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
      id: "node2shell", stamp: "10.22",
      metric: { val: "24.22.0", label: { ja: "動いた版 : 拒否した版は 24.22.1", en: "exploited build : 24.22.1 rejects it" } },
      visual: { type: "decode" }, cue: "crack",
      sources: [
        { name: "Imperva · Node2Shell", url: "https://www.imperva.com/blog/node2shell-from-brotli-data-to-remote-code-execution/",
          note: { ja: "公式 24.22.0 arm64 イメージでの実証。両経路と固定したミドルウェア版", en: "the demonstration on the stock 24.22.0 arm64 image, both paths, pinned middleware" } },
        { name: "The Hacker News on X", url: "https://x.com/TheHackersNews/status/2113538808126038500",
          note: { ja: "この回の出発点になった投稿（07:51 UTC）", en: "the post that started this read (07:51 UTC)" } },
        { name: "Node.js advisory", url: "https://nodejs.org/en/blog/vulnerability/october-2026-security-releases",
          note: { ja: "CVE-2026-111497 と修正版 22.23.4 / 24.22.1 / 26.12.1", en: "CVE-2026-111497 and the fixed 22.23.4 / 24.22.1 / 26.12.1" } },
        { name: "docs/22 §2", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/22-snapshot-2015jst.md",
          note: { ja: "到達経路の訂正と、検証していない範囲", en: "the reachability correction and what was not tested" } }
      ],
      ja: {
        kicker: "POSTSCRIPT · NODE.JS",
        title: "公式ビルドで、動いてしまった。",
        lede: "Imperva が、配布されている Node.js 24.22.0 のイメージ上で、細工した Brotli データからコード実行に成功しました。デバッガも、計測ビルドも要りません。",
        points: [
          "入口は2つ。<code>fetch()</code> が信頼できない Brotli 応答を消費する経路と、Express 5 / body-parser 2 がリクエストボディを展開する経路。素の <code>http.createServer()</code> は自動では展開しない",
          "検証は 24.22.0 Linux arm64 の1ビルド。22.x / 26.x と他のアーキテクチャは未検証で、成功まで複数回の試行を要した",
          "同じ入力は <b>24.22.1</b> が拒否する。実環境の悪用報告はまだ無い",
          "NVD のレコードは CVSS 4.0 の <b>9.2</b> だけで、3.1 が無い。深刻度で絞った CRITICAL 一覧には出てこない"
        ]
      },
      en: {
        kicker: "POSTSCRIPT · NODE.JS",
        title: "On an official build, it worked.",
        lede: "Imperva ran code on the stock Node.js 24.22.0 image from crafted Brotli data — no debugger, no instrumented build.",
        points: [
          "Two entry paths: <code>fetch()</code> consuming an untrusted Brotli response, and Express 5 / body-parser 2 inflating a request body. A bare <code>http.createServer()</code> inflates neither",
          "One build was tested (24.22.0, Linux arm64); 22.x, 26.x and other architectures were not, and it took several attempts",
          "<b>24.22.1</b> rejects the same bytes. No in-the-wild exploitation is reported",
          "The NVD record carries CVSS 4.0 <b>9.2</b> and no 3.1 score, so a severity-filtered CRITICAL list never shows it"
        ]
      }
    },
    {
      id: "prepatch", stamp: "10.17",
      metric: { val: "4 days", label: { ja: "最初の試行 → 勧告", en: "first attempt → advisory" } },
      visual: { type: "before" }, cue: "alarm",
      sources: [
        { name: "AWS · MadPot telemetry", url: "https://aws.amazon.com/blogs/security/amazon-threat-intelligence-identifies-php2shell-exploitation-prior-to-public-disclosure-in-madpot/",
          note: { ja: "2026-10-17 の悪用試行、10-21 02:00 UTC の PoC、IOC", en: "the 2026-10-17 attempt, PoCs from 10-21 02:00 UTC, IOCs" } },
        { name: "Imperva · first 24 hours", url: "https://www.imperva.com/blog/php2shell-early-attack-activity-through-impervas-lens/",
          note: { ja: "482,342 リクエスト / 21,998 サイト / 103 か国。試行であって侵害ではない", en: "482,342 requests / 21,998 sites / 103 countries — attempts, not compromises" } },
        { name: "docs/01", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/01-php2shell.md",
          note: { ja: "修正版と検知の手順", en: "the fixed versions and the hunt" } },
        { name: "docs/22 §3", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/22-snapshot-2015jst.md",
          note: { ja: "「試行」と「侵害」を混ぜない整理", en: "why attempts and compromises are kept apart" } }
      ],
      ja: {
        kicker: "POSTSCRIPT · PHP2SHELL",
        title: "勧告の4日前に、試行は始まっていた。",
        lede: "AWS のハニーポットには 2026-10-17 の悪用試行が残り、公開 PoC はエンバーゴ解除の12時間前から出ていました。開示日は、最初の攻撃日ではありません。",
        points: [
          "修正前の24時間で <b>482,342</b> リクエスト / 122,311 セッション / 21,998 サイト / 103 か国（Imperva の観測）",
          "ただし<b>試行</b>であって侵害ではない。Sophos は Mirai 派生の設置に失敗したとし、Dataminr は既知の侵害ゼロ",
          "KEV は依然として未収載。EPSS は 5.31% / 5.76%",
          "調査の起点は <b>10-17</b>。開示日から始めると、最初の4日が抜ける"
        ]
      },
      en: {
        kicker: "POSTSCRIPT · PHP2SHELL",
        title: "The attempts began four days before the advisory.",
        lede: "AWS honeypot telemetry holds an exploitation attempt dated 2026-10-17, and working PoCs were seen twelve hours before the embargo lifted. Disclosure day was not day one.",
        points: [
          "<b>482,342</b> requests / 122,311 sessions / 21,998 sites / 103 countries in the first 24 hours (Imperva)",
          "Those are <b>attempts</b>, not compromises: Sophos saw the Mirai install fail, and Dataminr reports no known compromises",
          "Still not in KEV. EPSS 5.31% / 5.76%",
          "Hunt from <b>10-17</b>. Starting at the disclosure date loses the first four days"
        ]
      }
    },
    {
      id: "filters", stamp: "10.23",
      metric: { val: "0 rows", label: { ja: "CNA の 9.9 に対する返答", en: "the answer for a CNA 9.9" } },
      visual: { type: "funnel" }, cue: "glitch",
      sources: [
        { name: "NVD API · filtered", url: "https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-91637&cvssV3Severity=CRITICAL",
          note: { ja: "9.9 があるのに totalResults は 0", en: "totalResults 0, despite a 9.9 on the record" } },
        { name: "NVD · CVE-2026-111497", url: "https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-111497",
          note: { ja: "CVSS 4.0 のみ。3.1 は無い", en: "CVSS 4.0 only; no 3.1 metric" } },
        { name: "docs/22 §1.2", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/22-snapshot-2015jst.md",
          note: { ja: "6件が出て0件が入った、104 → 98 の内訳", en: "the 104 → 98 accounting: six out, zero in" } },
        { name: "docs/13 §5.4", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/13-recent-criticals.md",
          note: { ja: "件数はリスクではなく開示のまとめ方を測る", en: "a count measures disclosure batching, not risk" } }
      ],
      ja: {
        kicker: "POSTSCRIPT · THE FILTER",
        title: "9.9 でも、一覧には出ない。",
        lede: "NVD の深刻度フィルタは、自分（Primary）の CVSS 3.x だけを数えます。CNA が付けた 9.9 は、同じレコードに載っていても 0 件の答えになります。",
        points: [
          "<code>?cveId=CVE-2026-91637&amp;cvssV3Severity=CRITICAL</code> は <b>0件</b>。レコードには 9.9（Secondary）がある",
          "同じ理由で、悪用中の <code>CVE-2026-111497</code>（CVSS 4.0 のみ 9.2）と <code>CVE-2026-114625</code>（CNA 9.9）も一覧に出ない",
          "10時間で <b>104 → 98</b>。6件が出て0件が入り、直ったものは無い",
          "全深刻度の公開スイープとベンダフィードは、両方を拾っている。絞った一覧は「何が悪用されているか」に答えない"
        ]
      },
      en: {
        kicker: "POSTSCRIPT · THE FILTER",
        title: "A 9.9 that the list cannot show.",
        lede: "NVD's severity filter counts only its own (primary) CVSS 3.x score. A 9.9 attached by the CNA is a zero-row answer, even though the record carries it.",
        points: [
          "<code>?cveId=CVE-2026-91637&amp;cvssV3Severity=CRITICAL</code> returns <b>0 rows</b>; the record holds a 9.9, marked <code>Secondary</code>",
          "Same for the exploited <code>CVE-2026-111497</code> (CVSS 4.0 only, 9.2) and <code>CVE-2026-114625</code> (CNA 9.9)",
          "Ten hours: <b>104 → 98</b>. Six rows out, zero in, nothing fixed",
          "The all-severity sweep and the vendor feeds caught both. A filtered list does not answer \'what is being exploited\'"
        ]
      }
    },
    {
      id: "wide", stamp: "10.22–23",
      metric: { val: "4", label: { ja: "CVE 一覧が名指ししない事案", en: "incidents no CVE list named" } },
      visual: { type: "ledger" }, cue: "confirm",
      sources: [
        { name: "Arista advisory 0199", url: "https://www.arista.com/en/support/advisories-notices/security-advisory/24838-security-advisory-0199",
          note: { ja: "CVE-2026-114625。10/24は一次告知を直接取得、KEV追加も確認", en: "CVE-2026-114625; primary page retrieved and KEV addition confirmed on October 24" } },
        { name: "Capcom · 2026-10-22", url: "https://www.capcom.co.jp/ir/news/html/261022.html",
          note: { ja: "11,774,247件の内訳と経緯", en: "the 11,774,247 breakdown and timeline" } },
        { name: "Onamae.com · 2026-10-21", url: "https://www.onamae.com/news/article/11584",
          note: { ja: "最大 26,739 台を停止、資格情報の変更依頼", en: "up to 26,739 servers suspended, credential rotation" } },
        { name: "docs/22 §4", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/22-snapshot-2015jst.md",
          note: { ja: "確認できたこと / できていないことの表", en: "the verified / not-verified table" } }
      ],
      ja: {
        kicker: "POSTSCRIPT · THE WIDE SWEEP",
        title: "CVE 一覧が名指ししない4件。",
        lede: "この回はニュースと X も取りました。そこから先に見つかり、一次ソースで裏を取った4件。数字はベンダが公表したままです。",
        points: [
          "Arista VeloCloud Orchestrator <code>CVE-2026-114625</code>: 悪用中の 0-day、<b>9.9</b>。ログイン済みなら superuser。オンプレは 5.2.3.18 / 6.1.3.10 / 6.4.2.12",
          "Linux KSMBD: <code>ZDI-CAN-33774</code> は認証不要の 9.0。CVE も mainline 修正もまだ無い",
          "カプコン CAPCOM ID <b>11,774,247</b> 件。お名前.com デスクトップクラウドは最大 <b>26,739</b> 台を停止",
          "報道は導線、根拠はベンダのページ。Arista は10/24に一次告知を直接取得。実悪用・認証条件・修正版を再確認した"
        ]
      },
      en: {
        kicker: "POSTSCRIPT · THE WIDE SWEEP",
        title: "Four incidents no CVE list named.",
        lede: "This read also collected the news and X. Four incidents were found there first, then checked against the vendor's own page. Figures are the vendors'.",
        points: [
          "Arista VeloCloud Orchestrator <code>CVE-2026-114625</code>: an exploited 0-day at <b>9.9</b>; any logged-in user becomes a superuser. On-prem fix 5.2.3.18 / 6.1.3.10 / 6.4.2.12",
          "Linux KSMBD: <code>ZDI-CAN-33774</code> needs no authentication, scores 9.0, and has neither a CVE nor a mainline fix",
          "Capcom CAPCOM ID: <b>11,774,247</b> records. Onamae Desktop Cloud suspended up to <b>26,739</b> servers",
          "The press is the lead, the vendor page is the evidence. Arista’s primary page was retrieved on October 24; exploitation, authentication requirements and fixes were rechecked"
        ]
      }
    },
    {
      id: "php-next", stamp: "10.23",
      metric: { val: "1 line", label: { ja: "次の定期リリースまでの緩和", en: "the mitigation until the next release" } },
      visual: { type: "checklist" }, cue: "confirm",
      sources: [
        { name: "PHP · 2026-10-23-1", url: "https://www.php.net/archive/2026.php#2026-10-23-1",
          note: { ja: "情報提供アドバイザリの全文。4条件と1行の緩和", en: "the whole advisory: four conditions, one mitigation" } },
        { name: "NVD · CVE-2026-115560", url: "https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-115560",
          note: { ja: "2026-10-23 時点で 0件（スコアも影響版も無い）", en: "0 results on 2026-10-23 — no score, no versions" } },
        { name: "GHSA-6wmf-4rv5-p3rp", url: "https://github.com/php/php-src/security/advisories/GHSA-6wmf-4rv5-p3rp",
          note: { ja: "緩和策の参照先は 10-21 の php2shell 勧告（115560 のものではない）", en: "the mitigation reference: the 10-21 php2shell advisory, not one for 115560" } },
        { name: "docs/23", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/23-php-cve-2026-115560.md",
          note: { ja: "確認コマンドと、PHP が言っていないことの一覧", en: "the check commands, and what PHP has not said" } }
      ],
      ja: {
        kicker: "POSTSCRIPT · PHP, TWO DAYS LATER",
        title: "緊急修正は、出ていません。",
        lede: "PHP が 10-23 に公表した CVE-2026-115560 は、別の RCE 経路。影響版もスコアも修正版も示さず、次の定期リリースで完全な勧告を出すとしています。",
        points: [
          "条件は4つすべて。設定で <code>php_binary</code> / <code>php_serialize</code>、実行中に <code>ini_set</code> で <code>php</code> へ、<code>session_start()</code> より前、そして upload progress が有効",
          "実行中に handler を変えないアプリは、機能を有効のままで構わない — PHP 自身がそう書いています",
          "対策は1行: <b><code>session.upload_progress.enabled=0</code></b>。10-21 の 109619 の緩和と同じで、適用済みなら追加作業は無い",
          "前回10/23取得ではNVDレコード無し。今回のPHP告知は変わらず、KEV追加17件にも115560は無し。未掲載は安全の証明ではない"
        ]
      },
      en: {
        kicker: "POSTSCRIPT · PHP, TWO DAYS LATER",
        title: "No emergency patch this time.",
        lede: "CVE-2026-115560, published on 10-23, is a different RCE path. PHP gives no affected versions, no score and no fix, and promises a full advisory with the next routine release.",
        points: [
          "All four conditions: set <code>php_binary</code> / <code>php_serialize</code>, switch to <code>php</code> at runtime with <code>ini_set</code>, before <code>session_start()</code>, with upload progress on",
          "Applications that never change the handler at runtime can leave the feature enabled — PHP says so itself",
          "The mitigation is one line: <b><code>session.upload_progress.enabled=0</code></b> — the same one from 10-21, so if it is already in place, nothing more to do",
          "No NVD record at the October 23 check. PHP’s advisory is unchanged; the 17 recent KEV additions do not include 115560. Absence is not proof of safety"
        ]
      }
    },
    {
      "id": "update-scope",
      "stamp": "10.24",
      "metric": {
        "val": "24",
        "label": {
          "ja": "reviewed groups",
          "en": "reviewed groups"
        }
      },
      "visual": { "type": "intelConfluence" },
      "cue": "blip",
      "sources": [
        {
          "name": "10-24 detailed snapshot / register",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/24-snapshot-20261024.ja.md",
          "note": {
            "ja": "取得窓・全24事案群・KEV17件・保存データ",
            "en": "Collection windows, 24 reviewed groups, 17 KEV rows and evidence"
          }
        }
      ],
      "ja": {
        "kicker": "10-24 UPDATE · UPDATE-SCOPE",
        "title": "CVEの外まで、もう一度。",
        "lede": "10-24の広域調査。新着と更新、開示チャネルと国内製品まで見直し、重点24事案群を出典付きで整理しました。",
        "points": [
          "直近30時間のNVDは<b>新規526 / 更新3,531</b>。重複するため合算しません",
          "GitHubは窓内<b>82勧告</b>、うちCritical 6。CVE未付与も対象",
          "KEVは10/10以降の追加<b>17件</b>。研究者・公式14フィードとJVNも取得",
          "24は製品・事案をまとめた群の数。新規侵害24件という意味ではありません"
        ]
      },
      "en": {
        "kicker": "10-24 UPDATE · UPDATE-SCOPE",
        "title": "Beyond the CVE list, again.",
        "lede": "The October 24 sweep checks new and modified records, disclosure channels and domestic products. Twenty-four priority groups now have conditions, actions and sources.",
        "points": [
          "NVD, last 30 hours: <b>526 published / 3,531 modified</b>. The sets overlap; do not add them",
          "<b>82 GitHub advisories</b> in-window, six critical. Items without CVEs count too",
          "All <b>17 KEV additions</b> since October 10, plus 14 research/official feeds and JVN",
          "24 counts reviewed product/incident groups, not 24 newly confirmed breaches"
        ]
      }
    },
    {
      "id": "update-exploited",
      "stamp": "10.24",
      "metric": {
        "val": "2",
        "label": {
          "ja": "KEV additions · 10.23",
          "en": "KEV additions · 10.23"
        }
      },
      "visual": { "type": "exploitIsolation" },
      "cue": "blip",
      "sources": [
        {
          "name": "Arista VeloCloud Orchestrator",
          "url": "https://www.arista.com/en/support/advisories-notices/security-advisory/24838-security-advisory-0199",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "Nextcloud Built-in CODE Server",
          "url": "https://github.com/CollaboraOnline/online/security/advisories/GHSA-g3vx-3m76-fghh",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "10-24 detailed snapshot / register",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/24-snapshot-20261024.ja.md",
          "note": {
            "ja": "取得窓・全24事案群・KEV17件・保存データ",
            "en": "Collection windows, 24 reviewed groups, 17 KEV rows and evidence"
          }
        }
      ],
      "ja": {
        "kicker": "10-24 UPDATE · UPDATE-EXPLOITED",
        "title": "まず、悪用されている2件。",
        "lede": "Arista VCOとNextcloud Built-in CODEが10-23にKEV追加。CISAは両方にフォレンジック調査を要求しています。",
        "points": [
          "VCOは<b>低権限の有効アカウント</b>でも昇格。オンプレ5.2.3.18 / 6.1.3.10 / 6.4.2.12以降へ",
          "Built-in CODEは<b>26.4.303以降へ更新、または削除</b>。アプリ無効化だけでは防げない",
          "CODE停止中のproxy.phpが条件。Standalone Collabora Onlineは対象外",
          "CISA期限は<b>10/26</b>（米連邦向け）。修正前の証拠保全、修正後も侵害調査"
        ]
      },
      "en": {
        "kicker": "10-24 UPDATE · UPDATE-EXPLOITED",
        "title": "Start with the two being exploited.",
        "lede": "Arista VCO and Nextcloud Built-in CODE entered KEV on October 23. Both entries require forensic triage.",
        "points": [
          "VCO: a <b>valid low-privilege account</b> can escalate. On-prem fixes: 5.2.3.18 / 6.1.3.10 / 6.4.2.12",
          "Built-in CODE: <b>update to 26.4.303 or remove it</b>. Disabling the app is insufficient",
          "The vulnerable proxy.php path requires the CODE process to be stopped. Standalone Collabora is unaffected",
          "CISA federal due date: <b>October 26</b>. Preserve evidence and investigate compromise alongside patching"
        ]
      }
    },
    {
      "id": "update-packages",
      "stamp": "10.24",
      "metric": {
        "val": "4",
        "label": {
          "ja": "package boundaries",
          "en": "package boundaries"
        }
      },
      "visual": { "type": "packageBoundaries" },
      "cue": "blip",
      "sources": [
        {
          "name": "Pillow",
          "url": "https://github.com/python-pillow/Pillow/security/advisories/GHSA-5x8w-8jj5-q52h",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "Pillow",
          "url": "https://pillow.readthedocs.io/en/stable/releasenotes/13.0.0.html",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "Wasmtime / Cranelift",
          "url": "https://github.com/bytecodealliance/wasmtime/security/advisories/GHSA-897f-g5gm-fmxm",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "Laravel TokenGuard",
          "url": "https://github.com/laravel/framework/security/advisories/GHSA-f9x3-7vq9-cph6",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "Echo Proxy middleware",
          "url": "https://github.com/labstack/echo/security/advisories/GHSA-cxf3-9h37-7rr8",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "10-24 detailed snapshot / register",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/24-snapshot-20261024.ja.md",
          "note": {
            "ja": "取得窓・全24事案群・KEV17件・保存データ",
            "en": "Collection windows, 24 reviewed groups, 17 KEV rows and evidence"
          }
        }
      ],
      "ja": {
        "kicker": "10-24 UPDATE · UPDATE-PACKAGES",
        "title": "画像、Wasm、認証、プロキシ。",
        "lede": "名前の違う4つの境界を、別々の条件で確認します。どれも点数だけでは自分の露出が分かりません。",
        "points": [
          "<b>Pillow 13.0.0</b>へ。FPXはolefile導入時、拡張子に関係なく画像処理へ届く。公開PoCは固定構成での実証",
          "<b>Wasmtime -115889</b>: 36系列は36.0.19、37〜42は43.0.0以降。Craneliftで非信頼Wasmを処理する境界",
          "<b>Laravel 12.68.0 / 13.29.0</b>へ。TokenGuard + 特定MySQL/MariaDB構成で認証回避",
          "<b>Echo 4.16.1 / 5.4.1</b>へ。WebSocket拒否後の接続がroute認可を迂回。upstream側の独立認可は別"
        ]
      },
      "en": {
        "kicker": "10-24 UPDATE · UPDATE-PACKAGES",
        "title": "Images, Wasm, auth, proxies.",
        "lede": "Four boundaries, four sets of conditions. A severity label alone cannot establish whether your deployment is exposed.",
        "points": [
          "<b>Pillow 13.0.0</b>: FPX reaches image processing when olefile is installed, regardless of extension. The PoC uses a pinned setup",
          "<b>Wasmtime -115889</b>: 36.0.19 on the 36 line; 43.0.0+ for lines 37–42. Check untrusted Wasm compiled by Cranelift",
          "<b>Laravel 12.68.0 / 13.29.0</b>: TokenGuard bypass with particular MySQL/MariaDB configurations",
          "<b>Echo 4.16.1 / 5.4.1</b>: rejected WebSocket upgrades can bypass route-level checks, not independent upstream authorization"
        ]
      }
    },
    {
      "id": "update-runtime",
      "stamp": "10.24",
      "metric": {
        "val": "3",
        "label": {
          "ja": "runtime checks",
          "en": "runtime checks"
        }
      },
      "visual": { "type": "bundledLayers" },
      "cue": "blip",
      "sources": [
        {
          "name": "Ruby Onigmo",
          "url": "https://www.ruby-lang.org/en/news/2026/10/23/regexp-fixes-for-gitlab-cves/",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "IO::Compress::Brotli",
          "url": "https://seclists.org/oss-sec/2026/q4/367",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "NGINX Open Source / Plus",
          "url": "https://nginx.org/en/security_advisories.html",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "NGINX Open Source / Plus",
          "url": "https://seclists.org/oss-sec/2026/q4/362",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "10-24 detailed snapshot / register",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/24-snapshot-20261024.ja.md",
          "note": {
            "ja": "取得窓・全24事案群・KEV17件・保存データ",
            "en": "Collection windows, 24 reviewed groups, 17 KEV rows and evidence"
          }
        }
      ],
      "ja": {
        "kicker": "10-24 UPDATE · UPDATE-RUNTIME",
        "title": "アプリの下も、同梱物も。",
        "lede": "GitLab名義のCVEでもRuby利用者に関係し、OSのBrotliを更新してもPerlの同梱コピーは残ります。",
        "points": [
          "<b>Ruby 4.0.9 / 3.4.12 / 3.3.13</b>へ。攻撃者の正規表現をコンパイルするアプリが対象",
          "<code>Regexp.timeout</code>や長さ制限では不十分。4.0.8は全修正ではない",
          "<b>IO::Compress::Brotli 0.023</b>へ。対象は0.004001以上0.023未満。OSライブラリ更新だけでは直らない",
          "<b>NGINX 1.30.6 / 1.31.7</b>へ。5件は構成依存で、一部のRCEにはASLR回避等も必要"
        ]
      },
      "en": {
        "kicker": "10-24 UPDATE · UPDATE-RUNTIME",
        "title": "Below the app, inside the bundle.",
        "lede": "GitLab-named CVEs can affect Ruby users, and an OS Brotli update leaves Perl’s bundled copy unchanged.",
        "points": [
          "<b>Ruby 4.0.9 / 3.4.12 / 3.3.13</b>: applications compiling attacker-controlled regexp patterns are affected",
          "<code>Regexp.timeout</code> and length limits are insufficient. 4.0.8 lacks the complete fix",
          "<b>IO::Compress::Brotli 0.023</b>: affected range starts at 0.004001. Updating system Brotli alone does not fix it",
          "<b>NGINX 1.30.6 / 1.31.7</b>: five configuration-dependent issues; some execution paths also need ASLR bypass"
        ]
      }
    },
    {
      "id": "update-agents",
      "stamp": "10.24",
      "metric": {
        "val": "4",
        "label": {
          "ja": "agent boundaries",
          "en": "agent boundaries"
        }
      },
      "visual": { "type": "agentPermissions" },
      "cue": "blip",
      "sources": [
        {
          "name": "PraisonAI AgentOS",
          "url": "https://github.com/MervinPraison/PraisonAI/security/advisories/GHSA-892r-p3jq-jp24",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "ReqLLM WebSocket",
          "url": "https://github.com/agentjido/req_llm/security/advisories/GHSA-6vww-5m28-f26v",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "obsidian-tc MCP HTTP transport",
          "url": "https://github.com/The-40-Thieves/obsidian-tc/security/advisories/GHSA-pqh8-4pj7-32xx",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "obsidian-tc MCP HTTP transport",
          "url": "https://github.com/The-40-Thieves/obsidian-tc/security/advisories/GHSA-84c9-qqpq-2pq5",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "AWS Multi Model Server",
          "url": "https://aws.amazon.com/security/security-bulletins/2026-148-aws/",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "x402 SDK",
          "url": "https://v12.sh/blog/x402",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "x402 SDK",
          "url": "https://github.com/x402-foundation/x402/pull/3124",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "x402 SDK",
          "url": "https://github.com/x402-foundation/x402/pull/3132",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "x402 SDK",
          "url": "https://github.com/x402-foundation/x402/pull/3133",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "10-24 detailed snapshot / register",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/24-snapshot-20261024.ja.md",
          "note": {
            "ja": "取得窓・全24事案群・KEV17件・保存データ",
            "en": "Collection windows, 24 reviewed groups, 17 KEV rows and evidence"
          }
        }
      ],
      "ja": {
        "kicker": "10-24 UPDATE · UPDATE-AGENTS",
        "title": "エージェントの権限を、誰が使えるか。",
        "lede": "認証、TLS、ノートの分離、モデル読込。AIの名前がつく前からある境界が、秘密とツールを守っています。",
        "points": [
          "<b>PraisonAI 4.6.59</b>へ。AgentOSは旧修正版4.5.128でも無認証chatが残った",
          "<b>req_llm 1.29.0</b>へ。1.9.0以降のWebSocket経路でTLS検証欠如。HTTP経路は別",
          "<b>obsidian-tc 1.3.1</b>へ。loopbackでもOrigin/DNS rebindingとvault分離を確認",
          "<b>AWS Multi Model ServerはEOL</b>。修正版なし、移行が必要。x402は支出上限と署名originを別途確認"
        ]
      },
      "en": {
        "kicker": "10-24 UPDATE · UPDATE-AGENTS",
        "title": "Who can use the agent’s authority?",
        "lede": "Authentication, TLS, vault isolation and model loading guard the tools and secrets an agent can reach.",
        "points": [
          "<b>PraisonAI 4.6.59</b>: AgentOS chat remained unauthenticated even after the older 4.5.128 fix claim",
          "<b>req_llm 1.29.0</b>: WebSocket TLS verification missing since 1.9.0. HTTP paths differ",
          "<b>obsidian-tc 1.3.1</b>: loopback still needs Origin/DNS-rebinding checks and vault isolation",
          "<b>AWS Multi Model Server is EOL</b>: no fixed release; migrate. Separately review x402 spending limits and signing origins"
        ]
      }
    },
    {
      "id": "update-japan",
      "stamp": "10.24",
      "metric": {
        "val": "3",
        "label": {
          "ja": "domestic checks",
          "en": "domestic checks"
        }
      },
      "visual": { "type": "domesticRoutes" },
      "cue": "blip",
      "sources": [
        {
          "name": "プリザンター LDAP",
          "url": "https://jvn.jp/jp/JVN82312317/",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "LINE LIFF SDK",
          "url": "https://jvn.jp/vu/JVNVU91023667/",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "国内Web/API連続不正アクセス",
          "url": "https://www.jpcert.or.jp/at/2026/at260030.html",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "10-24 detailed snapshot / register",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/24-snapshot-20261024.ja.md",
          "note": {
            "ja": "取得窓・全24事案群・KEV17件・保存データ",
            "en": "Collection windows, 24 reviewed groups, 17 KEV rows and evidence"
          }
        }
      ],
      "ja": {
        "kicker": "10-24 UPDATE · UPDATE-JAPAN",
        "title": "国内の業務システムも。",
        "lede": "外部公開する開発基盤だけではありません。業務アプリ、LINE連携、管理APIの境界を確認します。",
        "points": [
          "<b>プリザンター1.5.9.1</b>へ。Linux/Docker等 + LDAPの特定構成で、有効IDだけのログインが可能",
          "<b>LIFF SDK 2.31.1</b>へ。2.20.0〜2.31.0にDOM XSS",
          "<b>JPCERT 10/23更新</b>: AIペネトレーション基盤の悪用試行をcase Eとして追加",
          "API単位の認可、token最小権限/期限、rate limit、不要な管理公開停止。IPやJA4だけで侵害を断定しない"
        ]
      },
      "en": {
        "kicker": "10-24 UPDATE · UPDATE-JAPAN",
        "title": "Include domestic business systems.",
        "lede": "The review also covers business apps, LINE integrations and management APIs.",
        "points": [
          "<b>Pleasanter 1.5.9.1</b>: particular LDAP deployments on Linux/Docker and other affected configurations allow passwordless login with a valid ID",
          "<b>LIFF SDK 2.31.1</b>: DOM XSS affects 2.20.0 through 2.31.0",
          "<b>JPCERT October 23 update</b>: case E adds abuse of AI penetration-testing platforms",
          "Check authorization per API, token scope/expiry, rate limits and exposed admin services. IP or JA4 alone is not proof of compromise"
        ]
      }
    },
    {
      "id": "update-devices",
      "stamp": "10.24",
      "metric": {
        "val": "72",
        "label": {
          "ja": "HPE AOS CVEs",
          "en": "HPE AOS CVEs"
        }
      },
      "visual": { "type": "firmwareFleet" },
      "cue": "blip",
      "sources": [
        {
          "name": "HPE Aruba AOS",
          "url": "https://csaf.arubanetworking.hpe.com/2026/hpe_networking_-_hpesbnw05162.json",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "三菱電機 GENESIS / ICONICS等",
          "url": "https://jvn.jp/vu/JVNVU93251594/",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "Lenovo Tablet AVB",
          "url": "https://jvn.jp/jp/JVN33436631/",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "10-24 detailed snapshot / register",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/24-snapshot-20261024.ja.md",
          "note": {
            "ja": "取得窓・全24事案群・KEV17件・保存データ",
            "en": "Collection windows, 24 reviewed groups, 17 KEV rows and evidence"
          }
        }
      ],
      "ja": {
        "kicker": "10-24 UPDATE · UPDATE-DEVICES",
        "title": "機器は、製品系列まで。",
        "lede": "HPEの公式CSAFは72件、うち8件がCVSS10.0。産業製品や端末では、修正版が出ない機種もあります。",
        "points": [
          "<b>HPE AOS</b>: 10.8.1.2 / 10.7.2.7 / 10.4.1.14 / 8.13.3.1 / 8.10.0.24。CVEと製品系列を照合",
          "<b>三菱電機 GENESIS / ICONICS等</b>: 固定challenge response、DCOM、libwebpなど。製品別修正/回避策へ",
          "<b>Lenovo AVB</b>: 公開テスト鍵を使用した複数端末。物理アクセスが条件。EOLは修正なし",
          "満点や機種数を、実悪用確認と混同しない。対応不能の製品は移行も判断"
        ]
      },
      "en": {
        "kicker": "10-24 UPDATE · UPDATE-DEVICES",
        "title": "Match devices to their release line.",
        "lede": "HPE’s official CSAF contains 72 CVEs, eight at 10.0. Industrial products and devices can also lack a fixed release.",
        "points": [
          "<b>HPE AOS</b>: 10.8.1.2 / 10.7.2.7 / 10.4.1.14 / 8.13.3.1 / 8.10.0.24. Match each CVE to its product line",
          "<b>Mitsubishi GENESIS / ICONICS and others</b>: fixed challenge responses, DCOM and libwebp. Follow product-specific fixes or mitigations",
          "<b>Lenovo AVB</b>: public test keys in multiple tablets; physical access required. EOL models receive no fix",
          "Maximum severity is not confirmed exploitation. Consider migration where a product cannot be repaired"
        ]
      }
    },
    {
      "id": "update-trust",
      "stamp": "10.24",
      "metric": {
        "val": "3",
        "label": {
          "ja": "trust checks",
          "en": "trust checks"
        }
      },
      "visual": { "type": "trustRenewal" },
      "cue": "blip",
      "sources": [
        {
          "name": "Firefox / Thunderbird",
          "url": "https://www.mozilla.org/en-US/security/advisories/mfsa2026-111/",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "Firefox / Thunderbird",
          "url": "https://www.mozilla.org/en-US/security/advisories/mfsa2026-116/",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "Firefox / Thunderbird",
          "url": "https://www.mozilla.org/en-US/security/advisories/mfsa2026-115/",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "BlackX UEFI bootkit",
          "url": "https://securelist.com/uefi-bootkit-blackx/121539/",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "k0t network-edge intrusion",
          "url": "https://www.group-ib.com/blog/stray-cat-network-edge/",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "jxrlib JPEG XR",
          "url": "https://seclists.org/oss-sec/2026/q4/368",
          "note": {
            "ja": "影響条件・対応の一次根拠",
            "en": "Primary evidence for conditions and response"
          }
        },
        {
          "name": "10-24 detailed snapshot / register",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/24-snapshot-20261024.ja.md",
          "note": {
            "ja": "取得窓・全24事案群・KEV17件・保存データ",
            "en": "Collection windows, 24 reviewed groups, 17 KEV rows and evidence"
          }
        }
      ],
      "ja": {
        "kicker": "10-24 UPDATE · UPDATE-TRUST",
        "title": "更新した、その先の確認。",
        "lede": "ブロックリスト、起動の信頼、流出した資格情報。パッチの適用だけでは終わらない部分も記録しました。",
        "points": [
          "<b>Firefox 158.0.1 / Android 158.0.2</b>等はeMudhra中間CA遮断を組込。Thunderbird 153.5.1はメール認証関連も修正",
          "<b>BlackX</b>は管理者権限取得後のbootkit。OSパッチとSecure BootのDBX失効反映は別",
          "<b>k0t調査の70,000超</b>は資格情報等。被害企業数ではない。更新と並行して鍵・残存アクセスを調査",
          "JPEG XRの<b>jxrlib</b>も研究報告あり。CVE未確認、コード実行の証拠なし。配布元の修正状態を確認"
        ]
      },
      "en": {
        "kicker": "10-24 UPDATE · UPDATE-TRUST",
        "title": "Verify what follows the update.",
        "lede": "Block lists, boot trust and stolen credentials need checks beyond installing a patch.",
        "points": [
          "<b>Firefox 158.0.1 / Android 158.0.2</b> and other patched lines embed eMudhra blocks. Thunderbird 153.5.1 also fixes mail-auth issues",
          "<b>BlackX</b> follows administrator access. OS patching and Secure Boot DBX revocations are separate checks",
          "<b>70,000+ in the k0t report</b> counts credentials and related data, not companies. Investigate keys and persistent access",
          "<b>jxrlib</b> JPEG XR memory bugs were reported without known CVEs or evidence of code execution. Check distributor fixes"
        ]
      }
    },
    {
      "id": "oct25-priorities",
      "stamp": "10.25",
      "metric": null,
      "visual": {
        "type": "ledger",
        "rows": [{"name":"PUBLISHED CVEs","figure":"99","tone":"cyan"},{"name":"MODIFIED CVEs","figure":"5,432","tone":"amber"},{"name":"KEV VERSION","figure":"10.23","tone":"green"},{"name":"CUTOFF / JST","figure":"16:34","tone":"cyan"}]
      },
      "cue": "blip",
      "sources": [
        {
          "name": "Patch the Planet",
          "url": "https://patchtheplanet.org/",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "CISA KEV",
          "url": "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "10-25 snapshot",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/25-snapshot-20261025.ja.md",
          "note": {
            "ja": "基準時刻・取得時刻・留保事項",
            "en": "Cutoff, retrieval and limitations"
          }
        }
      ],
      "ja": {
        "kicker": "10-25 UPDATE · 16:34 JST",
        "title": "更新を、届くところまで。",
        "lede": "10月25日16:34 JSTを基準に、前日の調査を補完。取得は基準時刻後で、すべてが今日の新規発生ではありません。",
        "points": [
          "<b>Patch the Planet</b> を推奨。オープンソースの脆弱性修正を支える取り組みです",
          "実悪用済みの公開資産 → 緊急更新 → 鍵と権限の調査 → 同梱コピーまで検証",
          "NVD固定窓は新規<b>99</b>件・更新<b>5,432</b>件。重複するため足さない",
          "KEVは10/23版のまま。新規掲載なしを安全宣言にしない"
        ]
      },
      "en": {
        "kicker": "10-25 UPDATE · 16:34 JST",
        "title": "Take the update all the way through.",
        "lede": "Review cutoff: October 25, 16:34 JST. Retrieved afterward; newly covered information is not necessarily a new incident.",
        "points": [
          "Support open-source remediation through <b>Patch the Planet</b>",
          "Exploited exposure → urgent releases → keys and permissions → bundled copies",
          "Fixed-window NVD: <b>99</b> published / <b>5,432</b> modified. The sets overlap",
          "KEV remains October 23. No new catalog entries does not establish safety"
        ]
      }
    },
    {
      "id": "oct25-fortinet",
      "stamp": "10.25",
      "metric": null,
      "visual": {
        "type": "ladder",
        "steps": [
          "FortiOS",
          "Manager",
          "Analyzer",
          "Mail",
          "Authenticator"
        ]
      },
      "cue": "blip",
      "sources": [
        {
          "name": "Fortinet",
          "url": "https://www.fortinet.com/blog/ciso-collective/fortinet-releases-security-hardening-release-for-multiple-products",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "10-25 snapshot",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/25-snapshot-20261025.ja.md",
          "note": {
            "ja": "基準時刻・取得時刻・留保事項",
            "en": "Cutoff, retrieval and limitations"
          }
        }
      ],
      "ja": {
        "kicker": "10-25 UPDATE · 16:34 JST",
        "title": "CVEの公開を、待たない。",
        "lede": "Fortinetは5製品の緊急hardening更新を案内。詳細PSIRTは11月10日予定です。",
        "points": [
          "<b>FortiOS</b>: 8.0.2 / 7.6.8 / 7.4.13 / 7.2.14",
          "<b>Manager / Analyzer</b>: 8.0.2 / 7.6.8 / 7.4.12 / 7.2.13",
          "<b>Mail</b>: 8.0.2 / 7.6.7 / 7.4.9。<b>Authenticator</b>: 8.0.4 / 6.6.11",
          "機種・系列・更新経路を照合。管理公開制限は暫定策。告知から実悪用を推定しない"
        ]
      },
      "en": {
        "kicker": "10-25 UPDATE · 16:34 JST",
        "title": "Do not wait for the CVE list.",
        "lede": "Fortinet urges priority hardening updates across five products. Detailed PSIRT notices are planned for November 10.",
        "points": [
          "<b>FortiOS</b>: 8.0.2 / 7.6.8 / 7.4.13 / 7.2.14",
          "<b>Manager / Analyzer</b>: 8.0.2 / 7.6.8 / 7.4.12 / 7.2.13",
          "<b>Mail</b>: 8.0.2 / 7.6.7 / 7.4.9. <b>Authenticator</b>: 8.0.4 / 6.6.11",
          "Match model, branch and upgrade path. Exposure controls are interim; this notice alone does not confirm exploitation"
        ]
      }
    },
    {
      "id": "oct25-runtime-trust",
      "stamp": "10.25",
      "metric": null,
      "visual": {
        "type": "chain",
        "nodes": ["CA KEY", "JAVA", "PYTHON", "TLS"]
      },
      "cue": "blip",
      "sources": [
        {
          "name": "Oracle",
          "url": "https://www.oracle.com/security-alerts/alert-cve-2026-114820.html",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "Oracle operations",
          "url": "https://ops.java/emudhra",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "Python",
          "url": "https://mail.python.org/archives/list/security-announce%40python.org/message/FNAJMZV6XQYLVPABNINDMF3VF66AYLW4/",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "10-25 snapshot",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/25-snapshot-20261025.ja.md",
          "note": {
            "ja": "基準時刻・取得時刻・留保事項",
            "en": "Cutoff, retrieval and limitations"
          }
        }
      ],
      "ja": {
        "kicker": "10-25 UPDATE · 16:34 JST",
        "title": "ブラウザーの外に残る、信頼。",
        "lede": "Javaには10/24の緊急更新、Python sslには侵害済み鍵のdenylist。定例更新だけで完了とは言えません。",
        "points": [
          "<b>Java CVE-2026-114820</b>: 緊急更新または公式keystore/失効確認手順。各JREを再起動",
          "Oracle表の8u511-b32等は<b>影響版</b>。修正版として転記しない",
          "<b>Python CVE-2026-115557</b>: mainマージと配布版への反映は別。配布元で確認",
          "OS、certifi、同梱JRE、コンテナ、独自ストアを棚卸し"
        ]
      },
      "en": {
        "kicker": "10-25 UPDATE · 16:34 JST",
        "title": "Trust remains outside the browser.",
        "lede": "Java has an October 24 emergency alert; Python ssl adds a compromised-key denylist. Routine updates alone do not prove completion.",
        "points": [
          "<b>Java CVE-2026-114820</b>: emergency update or official keystore/revocation mitigation; restart each runtime",
          "Oracle’s table lists <b>affected</b> versions, not the builds to install",
          "<b>Python CVE-2026-115557</b>: main merged; confirm delivery in each installed distribution",
          "Inventory OS stores, certifi, bundled JREs, containers and custom trust stores"
        ]
      }
    },
    {
      "id": "oct25-dns",
      "stamp": "10.25",
      "metric": null,
      "visual": {
        "type": "ladder",
        "steps": [
          "BIND",
          "Unbound",
          "Recursor",
          "Auth DNS",
          "Knot DNS"
        ]
      },
      "cue": "blip",
      "sources": [
        {
          "name": "ISC",
          "url": "https://kb.isc.org/docs/cve-2026-94300",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "NLnet Labs",
          "url": "https://nlnetlabs.nl/projects/unbound/security-advisories/",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "PowerDNS Recursor",
          "url": "https://docs.powerdns.com/recursor/security-advisories/powerdns-advisory-2026-12.html",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "PowerDNS Authoritative",
          "url": "https://doc.powerdns.com/authoritative/security-advisories/powerdns-advisory-2026-13.html",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "Knot",
          "url": "https://www.knot-dns.cz/2026-10-21-version-362.html",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "10-25 snapshot",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/25-snapshot-20261025.ja.md",
          "note": {
            "ja": "基準時刻・取得時刻・留保事項",
            "en": "Cutoff, retrieval and limitations"
          }
        }
      ],
      "ja": {
        "kicker": "10-25 UPDATE · 16:34 JST",
        "title": "DNSは、製品を分けて。",
        "lede": "BINDだけでなく、resolverと権威DNSにも更新。似た名前の製品でも更新先は異なります。",
        "points": [
          "<b>BIND</b>: 9.20.30 / 9.21.27。GSS-TSIG再送と構成依存の条件を照合",
          "<b>Unbound</b>: 1.26.2。DoQ・検証・負荷の5件",
          "<b>PowerDNS Recursor</b>: 5.3.12 / 5.4.8。<b>Authoritative</b>: 4.9.18 / 5.0.8 / 5.1.5",
          "<b>Knot DNS</b>: 3.6.2。Knot Resolverとは別。CVE数と実悪用数を混同しない"
        ]
      },
      "en": {
        "kicker": "10-25 UPDATE · 16:34 JST",
        "title": "Separate the DNS products.",
        "lede": "Resolvers and authoritative servers also need review. Similar product names do not share update versions.",
        "points": [
          "<b>BIND</b>: 9.20.30 / 9.21.27; check GSS-TSIG replay and configuration prerequisites",
          "<b>Unbound</b>: 1.26.2 covers five DoQ, validation and load issues",
          "<b>PowerDNS Recursor</b>: 5.3.12 / 5.4.8. <b>Authoritative</b>: 4.9.18 / 5.0.8 / 5.1.5",
          "<b>Knot DNS</b>: 3.6.2; distinct from Knot Resolver. CVE counts do not count observed attacks"
        ]
      }
    },
    {
      "id": "oct25-cloud-access",
      "stamp": "10.25",
      "metric": null,
      "visual": {
        "type": "chain",
        "nodes": [
          "OAUTH",
          "GRAPH",
          "KEYS",
          "ROLES"
        ]
      },
      "cue": "blip",
      "sources": [
        {
          "name": "ConnectWise",
          "url": "https://www.connectwise.com/company/trust/advisories",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "Microsoft",
          "url": "https://www.microsoft.com/en-us/security/blog/2026/10/21/storm-0940-uses-artex-agentic-ai-connectwise-supply-chain-compromise/",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "LiteLLM",
          "url": "https://docs.litellm.ai/blog/security-incident-oct-21-2026-attack-chain",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "10-25 snapshot",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/25-snapshot-20261025.ja.md",
          "note": {
            "ja": "基準時刻・取得時刻・留保事項",
            "en": "Cutoff, retrieval and limitations"
          }
        }
      ],
      "ja": {
        "kicker": "10-25 UPDATE · 16:34 JST",
        "title": "直した後に、権限が残る。",
        "lede": "ConnectWiseの一次確認とLiteLLMの確定原因を反映。ベンダーの復旧だけで、顧客側の残存アクセスは消えません。",
        "points": [
          "<b>ConnectWise</b>: 正式な復旧指示まで無効維持。10/26は段階再開の目標",
          "削除を急がず証拠を保存。service principal認証、Graph操作、追加鍵・所有者・権限を調査",
          "<b>LiteLLM</b>: 未失効master key → GitHub OAuth token → CI秘密。初期推測を更新",
          "影響環境で先にpipを起動しない。隔離・再構築と到達可能な鍵の失効"
        ]
      },
      "en": {
        "kicker": "10-25 UPDATE · 16:34 JST",
        "title": "Permissions can survive the repair.",
        "lede": "Primary ConnectWise evidence and final LiteLLM findings supersede earlier uncertainty. Provider recovery does not clear customer-side persistence.",
        "points": [
          "<b>ConnectWise</b>: keep connections disabled pending formal instructions; October 26 is a target",
          "Preserve evidence before deletion. Review service-principal sign-ins, Graph activity, new keys, owners and grants",
          "<b>LiteLLM</b>: unrevoked master key → GitHub OAuth token → CI secrets; replace early speculation",
          "Do not launch pip on suspect hosts first. Isolate, rebuild cleanly and revoke reachable credentials"
        ]
      }
    },
    {
      "id": "oct25-bundles",
      "stamp": "10.25",
      "metric": null,
      "visual": {
        "type": "ledger",
        "rows": [
          {
            "name": "BUN / BROTLI",
            "figure": "REBUILD",
            "tone": "cyan"
          },
          {
            "name": "POSTIZ",
            "figure": "2.25.3",
            "tone": "green"
          },
          {
            "name": "ATS 9.2.16",
            "figure": "EXCEPTION",
            "tone": "amber"
          },
          {
            "name": "OPC UA CLIENT",
            "figure": "1.5.7",
            "tone": "green"
          }
        ]
      },
      "cue": "blip",
      "sources": [
        {
          "name": "Bun",
          "url": "https://github.com/oven-sh/bun/security/advisories/GHSA-663w-cv8g-jj2p",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "Python packages",
          "url": "https://github.com/advisories/GHSA-9v8h-qqgm-4m35",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "Postiz release",
          "url": "https://github.com/gitroomhq/postiz-app/releases/tag/v2.25.3",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "Apache",
          "url": "https://seclists.org/oss-sec/2026/q4/374",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "open62541",
          "url": "https://github.com/open62541/open62541/releases/tag/v1.5.7",
          "note": {
            "ja": "一次資料・影響条件と対応",
            "en": "Primary evidence, conditions and response"
          }
        },
        {
          "name": "10-25 snapshot",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/25-snapshot-20261025.ja.md",
          "note": {
            "ja": "基準時刻・取得時刻・留保事項",
            "en": "Cutoff, retrieval and limitations"
          }
        }
      ],
      "ja": {
        "kicker": "10-25 UPDATE · 16:34 JST",
        "title": "同梱先と、例外を確認。",
        "lede": "圧縮処理、プロキシ、SNS連携、産業クライアント。同じ更新作業でも完了条件が違います。",
        "points": [
          "<b>Brotli</b>: Bun 1.4.4、brotli 1.2.1 / brotlicffi 1.2.1.0。コンパイル済みBun実行物も再ビルド",
          "<b>Postiz</b>: 2.25.3。登録ユーザーと連携機能の条件を確認",
          "<b>ATS</b>: 9.2.16 / 10.1.5 / 10.2.1。ただしCVE-2026-111817は<b>9.2.16で未修正</b>",
          "<b>open62541</b>: 1.5.7。悪性OPC UAサーバーから型定義を受けるクライアントも対象"
        ]
      },
      "en": {
        "kicker": "10-25 UPDATE · 16:34 JST",
        "title": "Check bundled copies and exceptions.",
        "lede": "Compression, proxies, social integrations and industrial clients have different completion criteria.",
        "points": [
          "<b>Brotli</b>: Bun 1.4.4, brotli 1.2.1 / brotlicffi 1.2.1.0; rebuild compiled Bun executables",
          "<b>Postiz</b>: 2.25.3; registered users and integration prerequisites matter",
          "<b>ATS</b>: 9.2.16 / 10.1.5 / 10.2.1, but CVE-2026-111817 is <b>not fixed in 9.2.16</b>",
          "<b>open62541</b>: 1.5.7; clients importing remote OPC UA type definitions also need review"
        ]
      }
    },
    {
      "id": "http2shell",
      "stamp": "10.24",
      "metric": {
        "val": "9.2",
        "label": {
          "ja": "Google CNA · CVSS v4.0",
          "en": "Google CNA · CVSS v4.0"
        }
      },
      "visual": {
        "type": "ledger",
        "rows": [
          {
            "name": "SHARED BROTLI DECODER",
            "figure": "1 CVE",
            "tone": "amber"
          },
          {
            "name": "ENVOY DECOMPRESSION",
            "figure": "PATCH",
            "tone": "green"
          },
          {
            "name": "ISTIO DECOMPRESSION",
            "figure": "PATCH",
            "tone": "green"
          },
          {
            "name": "FETCHED RESPONSES",
            "figure": "CHECK",
            "tone": "cyan"
          }
        ]
      },
      "cue": "blip",
      "sources": [
        {
          "name": "Requested post",
          "url": "https://x.com/EdwardTWinz/status/2113965463931666585",
          "note": {
            "ja": "発見の入口。技術的根拠は下記一次資料",
            "en": "Discovery lead; primary technical evidence follows"
          }
        },
        {
          "name": "Patch the Planet · Brotli",
          "url": "https://patchtheplanet.org/brotli",
          "note": {
            "ja": "同梱先・系列別修正・展開前の緩和",
            "en": "Bundled consumers, fixes and pre-decode mitigation"
          }
        },
        {
          "name": "Envoy",
          "url": "https://github.com/envoyproxy/envoy/security/advisories/GHSA-3wvj-j6qm-62mr",
          "note": {
            "ja": "Brotli decompressorを設定した配置",
            "en": "Deployments configured for Brotli decompression"
          }
        },
        {
          "name": "Istio",
          "url": "https://istio.io/latest/news/security/istio-security-2026-007/",
          "note": {
            "ja": "系列別修正。1.29はEOL",
            "en": "Branch fixes; 1.29 is EOL"
          }
        },
        {
          "name": "Verified follow-up",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/26-brotli-http2shell.ja.md",
          "note": {
            "ja": "投稿時刻・確認したこと・留保事項",
            "en": "Post time, verification and limits"
          }
        }
      ],
      "ja": {
        "kicker": "POST FOLLOW-UP · CVE-2026-111497",
        "title": "HTTP2Shell。同じ欠陥、同梱先まで。",
        "lede": "指定投稿を一次資料と照合。Node.js以外にもBrotliの展開経路を確認します。HTTP/2限定の新しい脆弱性ではありません。",
        "points": [
          "Google CNAは<b>CVSS v4.0 9.2</b>。Node2Shellと同じCVE。実悪用の確認とは別",
          "<b>Envoy</b>: 1.40.0 / 1.39.3 / 1.38.6 / 1.37.8。Brotli展開の設定が条件",
          "<b>Istio</b>: 1.31.2 / 1.30.6 / 1.29.9。1.29はEOL。gatewayとsidecarも確認",
          "<b>curl・requests・httpx</b>: 実際の依存デコーダと自動展開を確認。Accept-Encodingの変更だけでは不足"
        ]
      },
      "en": {
        "kicker": "POST FOLLOW-UP · CVE-2026-111497",
        "title": "HTTP2Shell. Check the bundled decoder.",
        "lede": "The requested post is checked against primary evidence. This is the same Brotli CVE beyond Node.js, not a new HTTP/2-specific vulnerability.",
        "points": [
          "Google CNA: <b>CVSS v4.0 9.2</b>; same CVE as Node2Shell. Severity does not confirm real-world exploitation",
          "<b>Envoy</b>: 1.40.0 / 1.39.3 / 1.38.6 / 1.37.8, when Brotli decompression is configured",
          "<b>Istio</b>: 1.31.2 / 1.30.6 / 1.29.9; 1.29 is EOL. Check gateways and sidecars",
          "<b>curl, requests, httpx</b>: inspect the loaded decoder and automatic responses. Changing Accept-Encoding alone is insufficient"
        ]
      }
    },
    {
      "id": "tailworm-overview",
      "stamp": "10.25 · 23:18 JST",
      "metric": null,
      "visual": {
        "type": "tailwormMesh"
      },
      "cue": "blip",
      "sources": [
        {
          "name": "Tailworm · researcher report",
          "url": "https://tailworm.com/",
          "note": {
            "ja": "研究者の実験室報告。独立再現・実悪用確認ではない",
            "en": "Researcher lab claims; not our reproduction or field exploitation"
          }
        },
        {
          "name": "Tailscale engineering response",
          "url": "https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/",
          "note": {
            "ja": "10/25当事者応答。影響構成は調査中、全員一律停止の勧告なし",
            "en": "October 25 first-party response; scope under review, no blanket shutdown recommendation"
          }
        },
        {
          "name": "Tailworm special report",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/27-tailworm.ja.md",
          "note": {
            "ja": "基準23:18 JST、実取得は基準後",
            "en": "23:18 JST cutoff; retrieved afterwards"
          }
        }
      ],
      "ja": {
        "kicker": "TAILWORM · SPECIAL REPORT",
        "title": "Tailworm。内側の境界を、見直す。",
        "lede": "Tailscale / headscaleの研究報告。許可済みの端末から先へ進める範囲と、接続後の権限が焦点です。",
        "points": [
          "研究対象は<b>Tailscale 1.104.2 / headscale 0.29.5</b>。この版を修正版とは呼ばない",
          "研究者の<b>11項目</b>には設定上の注意も含む。11件のCVE・実被害ではない",
          "ベンダーは調査・修正中。<b>全利用者にSSH停止を勧めてはいない</b>",
          "最初に確認：<b>Tailscale SSH有効端末と接続許可</b>。通常のOpenSSHとは分ける"
        ]
      },
      "en": {
        "kicker": "TAILWORM · SPECIAL REPORT",
        "title": "Tailworm. Recheck the internal boundary.",
        "lede": "A report on Tailscale and headscale: which peers may connect, and which privileges a permitted session receives.",
        "points": [
          "Tested: <b>Tailscale 1.104.2 / headscale 0.29.5</b>. These are not confirmed fixed versions",
          "The researcher’s <b>11 headings</b> include configuration observations; not 11 CVEs or confirmed breaches",
          "Tailscale is investigating and fixing issues; <b>no blanket SSH shutdown recommendation</b>",
          "Start with <b>enabled Tailscale SSH hosts and access rules</b>; distinguish ordinary OpenSSH"
        ]
      }
    },
    {
      "id": "tailworm-ssh",
      "stamp": "10.25 · 23:18 JST",
      "metric": null,
      "visual": {
        "type": "tailwormPrivilege"
      },
      "cue": "blip",
      "sources": [
        {
          "name": "Tailworm · researcher report",
          "url": "https://tailworm.com/",
          "note": {
            "ja": "研究者の実験室報告。独立再現・実悪用確認ではない",
            "en": "Researcher lab claims; not our reproduction or field exploitation"
          }
        },
        {
          "name": "Tailscale engineering response",
          "url": "https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/",
          "note": {
            "ja": "10/25当事者応答。影響構成は調査中、全員一律停止の勧告なし",
            "en": "October 25 first-party response; scope under review, no blanket shutdown recommendation"
          }
        },
        {
          "name": "Tailworm special report",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/27-tailworm.ja.md",
          "note": {
            "ja": "基準23:18 JST、実取得は基準後",
            "en": "23:18 JST cutoff; retrieved afterwards"
          }
        }
      ],
      "ja": {
        "kicker": "TAILWORM · SPECIAL REPORT",
        "title": "接続できる。その先で、rootになる。",
        "lede": "研究者はSSH転送のUnix socket操作がrootで行われる問題と、パス検査の競合を報告。ベンダーも接続後の権限を調査中です。",
        "points": [
          "前提は<b>SSH接続の許可と該当する転送許可</b>。全端末への無認証侵入とはしない",
          "socket接続・置換の先にDockerや管理API。研究者は実験室で権限昇格を報告",
          "<b>必要な送信元→必要な宛先へ限定</b>し、不要な転送を削減",
          "<b>check modeは入口の追加認証</b>。接続後の権限昇格の修正にはならない"
        ]
      },
      "en": {
        "kicker": "TAILWORM · SPECIAL REPORT",
        "title": "Allowed in. More privilege than intended.",
        "lede": "The researcher reports root-level Unix-socket forwarding and path races; the vendor is investigating post-authorization privilege handling.",
        "points": [
          "Requires <b>SSH access and the relevant forwarding permission</b>; not anonymous access to every node",
          "Privileged sockets can lead to Docker or management APIs; escalation is reported in the lab",
          "<b>Limit sources and destinations</b>, and remove unnecessary forwarding",
          "<b>Check mode adds entry authentication</b>; it does not fix escalation inside an allowed session"
        ]
      }
    },
    {
      "id": "tailworm-headscale",
      "stamp": "10.25 · 23:18 JST",
      "metric": null,
      "visual": {
        "type": "tailwormControl"
      },
      "cue": "blip",
      "sources": [
        {
          "name": "Tailworm · researcher report",
          "url": "https://tailworm.com/",
          "note": {
            "ja": "研究者の実験室報告。独立再現・実悪用確認ではない",
            "en": "Researcher lab claims; not our reproduction or field exploitation"
          }
        },
        {
          "name": "Tailscale engineering response",
          "url": "https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/",
          "note": {
            "ja": "10/25当事者応答。影響構成は調査中、全員一律停止の勧告なし",
            "en": "October 25 first-party response; scope under review, no blanket shutdown recommendation"
          }
        },
        {
          "name": "Tailworm special report",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/27-tailworm.ja.md",
          "note": {
            "ja": "基準23:18 JST、実取得は基準後",
            "en": "23:18 JST cutoff; retrieved afterwards"
          }
        }
      ],
      "ja": {
        "kicker": "TAILWORM · SPECIAL REPORT",
        "title": "headscaleは、別の対策が要る。",
        "lede": "自己ホストの制御面とTailscale SaaSを分けます。研究者は公開登録経路のメモリ枯渇やキャッシュ排出を報告しています。",
        "points": [
          "<b>headscale 0.29.5</b>の検証。登録経路の一部DoSはアカウント不要との報告",
          "研究者は<b>SSH転送を抑止できない</b>と指摘。SaaSの設定を流用せず、許可削減・停止を検討",
          "公開範囲・rate limit・メモリ上限・再起動監視を確認。<b>緩和は修正ではない</b>",
          "悪性DERP応答のclient DoSは、<b>悪性relayへ接続させられる</b>という別の前提"
        ]
      },
      "en": {
        "kicker": "TAILWORM · SPECIAL REPORT",
        "title": "Headscale needs its own response.",
        "lede": "Separate a self-hosted control plane from Tailscale SaaS. The report describes registration-path resource exhaustion and cache eviction.",
        "points": [
          "Tested: <b>headscale 0.29.5</b>; some registration DoS paths reportedly need no account",
          "The researcher reports <b>forwarding cannot be denied</b> there; reassess SSH grants separately from SaaS",
          "Review exposure, rate limits, memory limits and restart monitoring; <b>mitigation is not a patch</b>",
          "DERP client exhaustion separately requires <b>directing a client to a hostile relay</b>"
        ]
      }
    },
    {
      "id": "tailworm-connector",
      "stamp": "10.25 · 23:18 JST",
      "metric": null,
      "visual": {
        "type": "tailwormConnector"
      },
      "cue": "blip",
      "sources": [
        {
          "name": "Tailworm · researcher report",
          "url": "https://tailworm.com/",
          "note": {
            "ja": "研究者の実験室報告。独立再現・実悪用確認ではない",
            "en": "Researcher lab claims; not our reproduction or field exploitation"
          }
        },
        {
          "name": "Tailscale engineering response",
          "url": "https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/",
          "note": {
            "ja": "10/25当事者応答。影響構成は調査中、全員一律停止の勧告なし",
            "en": "October 25 first-party response; scope under review, no blanket shutdown recommendation"
          }
        },
        {
          "name": "Tailworm special report",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/27-tailworm.ja.md",
          "note": {
            "ja": "基準23:18 JST、実取得は基準後",
            "en": "23:18 JST cutoff; retrieved afterwards"
          }
        }
      ],
      "ja": {
        "kicker": "TAILWORM · SPECIAL REPORT",
        "title": "アプリの許可が、別の宛先へ。",
        "lede": "対象は実験的conn25。研究者は利用権限を持つ端末が、コネクタに任意の実宛先を選ばせられると報告しています。",
        "points": [
          "<b>conn25と利用capability</b>が前提。全コネクタ構成へ一般化しない",
          "コネクタの先のLAN・クラウドmetadata・clusterサービスを、実宛先で確認",
          "不要な利用権限を外し、<b>出口側で宛先を制限</b>。IPv4/IPv6も確認",
          "Kubernetesのegress制限は<b>CNI・hostNetwork・転送経路</b>を実測。設定投入だけで完了にしない"
        ]
      },
      "en": {
        "kicker": "TAILWORM · SPECIAL REPORT",
        "title": "One app entitlement. Other destinations.",
        "lede": "The experimental conn25 path reportedly lets an entitled client select destinations through its connector.",
        "points": [
          "Requires <b>conn25 and its client capability</b>; not every app-connector deployment",
          "Inspect real destinations: connector-side LAN, cloud metadata and cluster services",
          "Remove unneeded entitlement and <b>restrict destination egress</b>, including IPv4 and IPv6",
          "Verify Kubernetes controls against <b>CNI, host networking and forwarding paths</b>"
        ]
      }
    },
    {
      "id": "tailworm-serve",
      "stamp": "10.25 · 23:18 JST",
      "metric": null,
      "visual": {
        "type": "tailwormServe"
      },
      "cue": "blip",
      "sources": [
        {
          "name": "Tailworm · researcher report",
          "url": "https://tailworm.com/",
          "note": {
            "ja": "研究者の実験室報告。独立再現・実悪用確認ではない",
            "en": "Researcher lab claims; not our reproduction or field exploitation"
          }
        },
        {
          "name": "Tailscale engineering response",
          "url": "https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/",
          "note": {
            "ja": "10/25当事者応答。影響構成は調査中、全員一律停止の勧告なし",
            "en": "October 25 first-party response; scope under review, no blanket shutdown recommendation"
          }
        },
        {
          "name": "Tailworm special report",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/27-tailworm.ja.md",
          "note": {
            "ja": "基準23:18 JST、実取得は基準後",
            "en": "23:18 JST cutoff; retrieved afterwards"
          }
        }
      ],
      "ja": {
        "kicker": "TAILWORM · SPECIAL REPORT",
        "title": "Serveの設定から、管理口を確認。",
        "lede": "Unix socket宛のTCP転送、全interfaceへのbind、HTTP/2のmount間認可。設定と経路を分けて棚卸しします。",
        "points": [
          "<b>Serveの特権socket宛TCP転送</b>を探す。operatorの該当設定が必要な問題",
          "<b>TS_SERVE_ALLOW_ALL_INTERFACES</b>は設定上の注意。全Serveの既定動作ではない",
          "header依存のbackend認可・複数mountを確認。Funnelの指摘も脅威モデルを区別",
          "IP firewallは<b>ローカルUnix socket操作を検査しない</b>。不要な設定を除去する"
        ]
      },
      "en": {
        "kicker": "TAILWORM · SPECIAL REPORT",
        "title": "Inspect what Serve exposes.",
        "lede": "Review Unix-socket TCP forwards, external interface binding and HTTP/2 cross-mount authorization separately.",
        "points": [
          "Find <b>TCP forwards to privileged Unix sockets</b>; the operator’s configuration is a prerequisite",
          "<b>TS_SERVE_ALLOW_ALL_INTERFACES</b> is a configuration note, not every Serve default",
          "Inspect header-based backend authorization and mounts; distinguish Funnel threat-model observations",
          "IP firewalls <b>do not inspect local Unix-socket operations</b>; remove unnecessary exposure"
        ]
      }
    },
    {
      "id": "tailworm-response",
      "stamp": "10.25 · 23:18 JST",
      "metric": null,
      "visual": {
        "type": "tailwormResponse"
      },
      "cue": "blip",
      "sources": [
        {
          "name": "Tailworm · researcher report",
          "url": "https://tailworm.com/",
          "note": {
            "ja": "研究者の実験室報告。独立再現・実悪用確認ではない",
            "en": "Researcher lab claims; not our reproduction or field exploitation"
          }
        },
        {
          "name": "Tailscale engineering response",
          "url": "https://www.reddit.com/r/Tailscale/comments/1xeoj1l/recent_tailscale_vulnerability_reports/",
          "note": {
            "ja": "10/25当事者応答。影響構成は調査中、全員一律停止の勧告なし",
            "en": "October 25 first-party response; scope under review, no blanket shutdown recommendation"
          }
        },
        {
          "name": "Tailworm special report",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/27-tailworm.ja.md",
          "note": {
            "ja": "基準23:18 JST、実取得は基準後",
            "en": "23:18 JST cutoff; retrieved afterwards"
          }
        }
      ],
      "ja": {
        "kicker": "TAILWORM · SPECIAL REPORT",
        "title": "確認して、狭めて、修正を追う。",
        "lede": "研究者の実験室での自動伝播と、現実のワーム流行を分けます。今回の一次資料では実環境のTailworm侵害は未確認です。",
        "points": [
          "SSH・headscale・conn25・Serveを棚卸し。<b>機能ごとの成立条件</b>に沿って許可を縮小",
          "<b>修正版・専用CVE/CVSSは未確定</b>。1.104.2の証明書修正と混ぜない",
          "侵害を疑えば証跡保全・隔離後、<b>制御面で端末を失効</b>し到達可能な鍵を更新",
          "再インストールだけではコピーされたidentityは失効しない。公式勧告と更新を継続確認"
        ]
      },
      "en": {
        "kicker": "TAILWORM · SPECIAL REPORT",
        "title": "Inventory. Restrict. Track the fix.",
        "lede": "Lab propagation is not evidence of a worm outbreak. Real-world Tailworm exploitation is not established by the sources reviewed.",
        "points": [
          "Inventory SSH, headscale, conn25 and Serve; <b>reduce grants by feature prerequisites</b>",
          "<b>Confirmed fixes and dedicated CVEs/CVSS remain unresolved</b>; 1.104.2 fixes a separate certificate issue",
          "If compromise is suspected, preserve evidence, isolate, <b>revoke the device identity</b> and rotate exposed keys",
          "Reimaging alone does not revoke copied identity; keep tracking official advisories"
        ]
      }
    },
    {
      "id": "night-delta",
      "stamp": "10.25 · 23:18 JST",
      "metric": null,
      "visual": {
        "type": "nightDelta"
      },
      "cue": "blip",
      "sources": [
        {
          "name": "23:18 fixed-window collection",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/data/2026-10-25-2318/collection-summary.json",
          "note": {
            "ja": "07:34–14:18 UTC、取得は基準後",
            "en": "07:34–14:18 UTC; retrieved afterwards"
          }
        },
        {
          "name": "Nightly review",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/28-snapshot-20261025-2318.ja.md",
          "note": {
            "ja": "優先度・一次資料・未確定事項",
            "en": "Priorities, primary sources and unresolved points"
          }
        }
      ],
      "ja": {
        "kicker": "NIGHT UPDATE · 23:18 JST",
        "title": "広域調査。件数より、成立条件。",
        "lede": "16:34→23:18 JSTの固定窓を追加取得。前回分に重複する更新を、被害件数として合算しません。",
        "points": [
          "<b>NVD新規87 / 更新87</b>。今回の両集合は同じ87件。全深刻度で収集",
          "<b>GitHub勧告16件</b>はunreviewed。package欄が空でも無影響とはしない",
          "<b>KEVは10/23版・1,756件</b>。新規追加なしは、攻撃なしの証明ではない",
          "Firecrawl・Dokploy・rotki等を一次資料で照合。<b>未確定の修正版を補完しない</b>"
        ]
      },
      "en": {
        "kicker": "NIGHT UPDATE · 23:18 JST",
        "title": "Broad review. Conditions before counts.",
        "lede": "A fixed 16:34–23:18 JST delta complements the earlier review. Database updates are not breach counts.",
        "points": [
          "<b>NVD: 87 published / 87 modified</b>; the same 87 identifiers in both sets, across all severities",
          "<b>16 GitHub advisories</b>, unreviewed; empty package metadata does not mean unaffected",
          "<b>KEV: October 23, 1,756 entries</b>; no new listing does not prove no attacks",
          "Trace Firecrawl, Dokploy and rotki to primary evidence; <b>do not invent a fixed version</b>"
        ]
      }
    },
    {
      "id": "night-restoration",
      "stamp": "10.25 · 23:18 JST",
      "metric": null,
      "visual": {
        "type": "nightRestoration"
      },
      "cue": "blip",
      "sources": [
        {
          "name": "ConnectWise · Oct 25 14:00 UTC",
          "url": "https://www.connectwise.com/company/trust/advisories",
          "note": {
            "ja": "基準時刻前18分の公式更新",
            "en": "Official update 18 minutes before cutoff"
          }
        },
        {
          "name": "23:18 fixed-window collection",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/data/2026-10-25-2318/collection-summary.json",
          "note": {
            "ja": "07:34–14:18 UTC、取得は基準後",
            "en": "07:34–14:18 UTC; retrieved afterwards"
          }
        },
        {
          "name": "Nightly review",
          "url": "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/28-snapshot-20261025-2318.ja.md",
          "note": {
            "ja": "優先度・一次資料・未確定事項",
            "en": "Priorities, primary sources and unresolved points"
          }
        }
      ],
      "ja": {
        "kicker": "NIGHT UPDATE · 23:18 JST",
        "title": "復旧の目標は、再接続の許可ではない。",
        "lede": "ConnectWiseは本日23:00 JSTに更新。Cloud Backupは10/26の段階的onboardingを目標にしています。",
        "points": [
          "<b>まず既存バックアップの復元アクセス</b>、その後の再登録を案内する計画",
          "<b>個別の正式手順まで接続を無効維持</b>。基盤復旧は全機能復旧を意味しない",
          "バックアップの保全と、顧客M365側の認証・権限・メール操作の調査は別",
          "PHP・GitLab・Brotli、実悪用済みKEV、Fortinet hardeningも継続。<b>詳細レポートで役割別に確認</b>"
        ]
      },
      "en": {
        "kicker": "NIGHT UPDATE · 23:18 JST",
        "title": "A restoration target is not reconnect permission.",
        "lede": "ConnectWise updated at 23:00 JST. Phased Cloud Backup onboarding remains targeted for October 26.",
        "points": [
          "<b>Existing backup restoration access first</b>, followed by re-enrollment guidance",
          "<b>Keep connections disabled until individual instructions</b>; infrastructure recovery is not full service recovery",
          "Stored backup assurance and investigation of live M365 access remain separate",
          "Continue PHP, GitLab, Brotli, exploited KEV and Fortinet work; <b>use the role-based report</b>"
        ]
      }
    },
    {
      id: "closing", stamp: "NOW",
      metric: null,
      visual: { type: "storm" }, cue: "whoosh",
      sources: [
        { name: "docs/14 supply chain", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/14-supply-chain-oct2026.md",
          note: { ja: "10/22当時の記録。ConnectWiseは10/25に一次確認", en: "Historical October 22 assessment; ConnectWise confirmed in October 25 review" } },
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
        { name: "docs/22 wide read 20:15 JST", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/22-snapshot-2015jst.md",
          note: { ja: "Node2Shell、開示前の試行、フィルタの盲点、ニュース経由の4件", en: "Node2Shell, pre-disclosure attempts, the filter blind spot, four news-led incidents" } },
        { name: "docs/23 PHP follow-on", url: "https://github.com/yomiplush/2026-world-is-a-fuck-incident/blob/main/docs/23-php-cve-2026-115560.md",
          note: { ja: "CVE-2026-115560: 4条件と1行の緩和、そして未公表のこと", en: "CVE-2026-115560: four conditions, one line, and what is unstated" } },
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
