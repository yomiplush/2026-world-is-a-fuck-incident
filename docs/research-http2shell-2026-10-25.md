# HTTP2Shell投稿の一次情報検証 — 2026-10-25

対象: [EdwardTWinzの投稿](https://x.com/EdwardTWinz/status/2113965463931666585)。投稿は問題を知る入口として扱い、影響範囲・修正版・実証状態は以下の一次情報を優先する。公式syndication取得結果の投稿日時は2026-10-24 12:06:56 UTC（21:06:56 JST）。公式取得本文は省略され、全文は補助的なFxTwitter取得結果で確認した。投稿はNode / Python / Bun / Envoy / Istio / curl / requests / httpxを列挙するが、HTTPを使う製品全体への無条件な影響宣言としては扱わない。

## 9.2 CriticalはGoogle CNAのCVSS v4.0

[Googleが発行したCVE原本](https://raw.githubusercontent.com/CVEProject/cvelistV5/main/cves/2026/111xxx/CVE-2026-111497.json)はCVE-2026-111497をBrotli Cデコーダの領域外書き込みとし、CVSS v4.0 **9.2 / Critical**を記録する。ベクトルには追加の攻撃成立条件を示す`AT:P`を含む。影響範囲は分岐別に **1.0.3以上1.0.10未満、1.1.0以上1.1.1未満、1.2.0以上1.2.1未満**。修正版は1.0.10 / 1.1.1 / 1.2.1。単純に「1.0.3～1.2.0の全バージョン」とすると修正済み1.0.10と1.1.1を誤って含める。

[上流1.2.1リリース](https://github.com/google/brotli/releases/tag/v1.2.1)も当該CVEの修正を明記する。一方、[Node.js公式](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)はHighと分類し、[Red Hat](https://access.redhat.com/security/cve/cve-2026-111497)はCVSS v3.1 8.1 / Importantと評価する。採点方式とベンダーが異なるため「全ベンダーがCriticalへ格上げ」とは書かない。

## HTTP/2限定ではなく、信頼できないBrotli入力のデコードが条件

Node.js公式は`node:zlib`で攻撃者提供のBrotli入力を展開する場合を説明する。HTTP/2のフレーム処理の脆弱性とは記載していない。[Bun公式勧告](https://github.com/oven-sh/bun/security/advisories/GHSA-663w-cv8g-jj2p)も`fetch`による`Content-Encoding: br`応答の自動展開、`node:zlib`、`DecompressionStream`を入力経路として挙げる。したがってHTTP2Shellは通称として扱い、HTTP/2を無効化することを一般的な対策としない。

サーバーの受信リクエストだけでなく、外部サーバーを呼ぶクライアント処理も対象となる。Bunは1.4.4で修正し、`bun build --compile`成果物には再ビルドが必要。同勧告はBunに対する攻撃を未検証と明記するため、他製品でのRCE実証をBunに転用しない。

Python追加パッケージについては[GitHub Reviewed勧告](https://github.com/advisories/GHSA-9v8h-qqgm-4m35)が`brotli` 1.0.3以上1.2.1未満→1.2.1、`brotlicffi` 1.0.3以上1.2.1.0未満→1.2.1.0を示す。これはPyPIパッケージの範囲で、上流Cライブラリ分岐別範囲と混同しない。

## 新たに確認したプロキシ・サービスメッシュ

| 製品 | 公式の影響版・範囲 | 修正先 | 成立条件・出典 |
|---|---|---|---|
| Envoy | 1.39.2 / 1.38.5 / 1.37.7 / 1.36.11を勧告が列挙 | 1.40.0 / 1.39.3 / 1.38.6 / 1.37.8 / 1.36.12 | Brotli decompressorを設定した配置。[Envoy公式GHSA](https://github.com/envoyproxy/envoy/security/advisories/GHSA-3wvj-j6qm-62mr) |
| Istio | 1.31.0–1.31.1 / 1.30.0–1.30.5 / 1.29.0–1.29.8 | 1.31.2 / 1.30.6 / 1.29.9 | `EnvoyFilter`等でBrotli展開を有効化した場合。[Istio公式勧告](https://istio.io/latest/news/security/istio-security-2026-007/) |

Envoyの公式表は列挙形式なので、未検証の過去版すべてへ範囲を拡張しない。Istio 1.29は2026-10-15でEOLとなり1.29.9が最終版。同じIstio勧告にあるHTTP/2の`AuthorizationPolicy`メソッド大文字小文字バイパスは別問題であり、Brotliに条件を転用しない。勧告先頭の集約スコア7.7もBrotli単独の評価として引用しない。

HAProxy / nginxについては今回の一次情報検索で当該CVEの製品別影響版・修正先を確認できなかった。「HTTPを扱う」「Brotliを圧縮する」だけを根拠に一律の脆弱製品へ追加しない。ディストリビューションのバックポートは製品ベンダーのパッケージ判定に従う。

## RCE実証は更新あり。実環境の悪用とは区別

[Imperva Red Teamの現在の一次報告](https://www.imperva.com/blog/node2shell-from-brotli-data-to-remote-code-execution/)は、**公式Node.js 24.22.0 Linux arm64イメージで、デバッガーや計測用バイナリなしのコード実行を再現した**と明記している。`fetch()`のBrotli応答と、設定済みExpress 5 / body-parser 2の受信展開経路で確認し、24.22.1では同じ入力を拒否した。毎回成功したわけではなく、全ビルド・全中間バージョンを検証したわけでもない。「RCEは改変ビルドだけ」の記述は現時点のこの報告と整合しない。

同報告は、素のNode.js HTTPサーバーは受信しただけでBrotli本文を展開しないとも説明する。したがってExpress/body-parserの版番号は入力経路の識別であり、それらがネイティブ欠陥の修正主体という意味ではない。

CVE原本内のCISA ADPには2026-10-23時点の`Exploitation: none`が残る。これは時点付きの評価であり、10月25日の「攻撃なし」を保証しない。研究環境のRCE実証を、実環境での悪用確認やKEV追加と同義に扱わない。

## Cloudflareの10月25日ルールは既定でLog

[Cloudflare公式緊急WAFリリース](https://developers.cloudflare.com/changelog/post/2026-10-25-emergency-waf-release/)は`Content-Encoding: br`の受信リクエストと`/_next/image`の2ルールを追加するが、両方とも既定動作は**Log**。自動遮断済みとは書かない。前者は`Accept-Encoding: br`やCloudflareの応答圧縮設定を対象とせず、後者は正常な画像最適化通信にも一致する。Blockへ変更すると正常通信へ影響し得る。受信側のルールだけで外部応答の展開経路まで解決するとは推論しない。
