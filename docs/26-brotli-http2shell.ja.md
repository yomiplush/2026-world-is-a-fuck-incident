# 投稿追補：HTTP2Shell / Brotli を同梱先まで確認

[English](26-brotli-http2shell.md) | **日本語**

[指定されたEdwardTWinzの投稿](https://x.com/EdwardTWinz/status/2113965463931666585)を、一次資料と照合して組み込みました。投稿時刻は **2026-10-24 12:06:56 UTC / 21:06:56 JST**。前回の16:34 JST基準以前の情報で、10月25日に新しいCVEが発生したという意味ではありません。本追補の実取得時刻は[記録](../data/2026-10-25/brotli-followup.json)を参照してください。投稿の長文は公式配信で省略されるため、全文確認には補助ビューアーも使い、技術的事実は以下の一次資料で確認しました。

## 投稿から取り込む要点

「HTTP2Shell」「Node2Shell」はここでは **同じ `CVE-2026-111497`** の通称として扱います。欠陥はGoogle BrotliのCデコーダで、攻撃者が制御するデータを脆弱な実装で**展開**した場合にメモリ破壊、情報漏えい、停止、潜在的なコード実行が起こります。HTTP/2のフレーム処理に限定された欠陥ではなく、圧縮ファイル等も確認範囲です。HTTPを使うだけ、または送信データを圧縮するだけで影響を確定しません。[Google CNA原本](https://raw.githubusercontent.com/CVEProject/cvelistV5/main/cves/2026/111xxx/CVE-2026-111497.json)、[Patch the Planet専用勧告](https://patchtheplanet.org/brotli)

Google CNAの **CVSS v4.0 9.2 / Critical** は確認できました。ベクトルは `AT:P` を含みます。Node.jsはHigh、Red Hatはv3.1 8.1 / Importantと評価しており、全製品一律に「Criticalへ格上げ」とはしません。[Node.js](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases)、[Red Hat](https://access.redhat.com/security/cve/cve-2026-111497)

## 追加で棚卸しする製品と修正版

| 対象 | 確認した影響条件 | 対応・修正先 | 一次資料 |
|---|---|---|---|
| Google Brotli C | `1.0.3 <= v < 1.0.10`、`1.1.0 <= v < 1.1.1`、`1.2.0 <= v < 1.2.1` | **1.0.10 / 1.1.1 / 1.2.1**。修正済み分岐を単純な連続範囲で誤検出しない | [Google CNA](https://raw.githubusercontent.com/CVEProject/cvelistV5/main/cves/2026/111xxx/CVE-2026-111497.json)、[リリース](https://github.com/google/brotli/releases/tag/v1.2.1) |
| Node.js | 非信頼のBrotli入力を `node:zlib`、応答展開、設定済みbody parser等へ渡す経路 | **22.23.4 / 24.22.1 / 26.12.1**。アプリ・コンテナ内の実ランタイムも確認 | [Node.js](https://nodejs.org/en/blog/vulnerability/october-2026-security-releases) |
| Bun | 1.0.21以上1.4.4未満。fetchの自動展開等 | **1.4.4**。`bun build --compile`成果物も再ビルド | [Bun](https://github.com/oven-sh/bun/security/advisories/GHSA-663w-cv8g-jj2p) |
| Pythonの追加パッケージ | 脆弱なBrotli/brotlicffiを使うデコード経路 | **brotli 1.2.1 / brotlicffi 1.2.1.0**。OSバックポートとwheel・仮想環境を区別 | [パッケージ勧告](https://github.com/advisories/GHSA-9v8h-qqgm-4m35) |
| Envoy Proxy | 公式勧告は1.39.2 / 1.38.5 / 1.37.7 / 1.36.11を列挙。**Brotli decompressorを設定した配置** | **1.40.0 / 1.39.3 / 1.38.6 / 1.37.8**。**1.36.12**にも修正はあるが、1.36はサポート外 | [Envoy GHSA](https://github.com/envoyproxy/envoy/security/advisories/GHSA-3wvj-j6qm-62mr)、[対応表とサポート注意](https://patchtheplanet.org/brotli) |
| Istio | 1.31.0–1.31.1 / 1.30.0–1.30.5 / 1.29.0–1.29.8。`EnvoyFilter`等でBrotli展開を有効化 | **1.31.2 / 1.30.6 / 1.29.9**。1.29はEOL、サポート系列へ移行 | [Istio](https://istio.io/latest/news/security/istio-security-2026-007/) |
| curl / libcurl | Brotli対応のビルド・依存ライブラリで展開を使う場合。CLIの `--compressed` 等 | 実際にリンクするBrotliと配布元の修正状況を確認。**curl固有の最低修正版は今回確定していない** | [curl公式](https://curl.se/docs/manpage.html#--compressed)、[確認範囲](https://patchtheplanet.org/brotli) |
| requests / httpx | Brotliサポートを追加した構成で、外部応答を自動展開する経路 | HTTPクライアント名だけでなく、ロードするデコーダと仮想環境を更新。Python本体の更新だけで完了にしない | [Requests](https://docs.python-requests.org/en/latest/user/quickstart/#binary-response-content)、[HTTPX](https://www.python-httpx.org/quickstart/#binary-response-content) |

Istioの同じ告知にあるHTTP/2の `AuthorizationPolicy` バイパスは**別問題**です。Brotliの成立条件へ混ぜないでください。今回の表は同梱・利用先の確認であり、件数を別々のCVEや侵害件数として合算しません。

## 修正までの緩和と確認

Patch the Planetは、非信頼の入力をBrotli展開へ渡さない暫定対応を説明しています。受信リクエストは**展開前**に拒否し、外部応答は自動展開を止めるかraw-response経路で検査します。**Accept-Encodingからbrを外すだけでは、相手が送るbr応答を防げません**。Envoy/Istioは要求・応答の両方向を確認し、無効化したfilterから圧縮データが後段へ渡る場合も確認します。更新、再起動、再ビルド後に実際の稼働版を検証してください。[公式の緩和・経路別手順](https://patchtheplanet.org/brotli)

Impervaは **公式Node.js 24.22.0 / Linux arm64** でRCEを実証し、24.22.1が同じ入力を拒否したと報告しています。これは全製品・全構成での再現や実環境での悪用確認を意味しません。Bunは自製品への攻撃を未検証と明記しています。[Imperva一次実証](https://www.imperva.com/blog/node2shell-from-brotli-data-to-remote-code-execution/)、[Bun](https://github.com/oven-sh/bun/security/advisories/GHSA-663w-cv8g-jj2p)

10/25取得時に確認したCloudflareの緊急WAF告知には受信brと `/_next/image` のルールがありますが、**既定はLog**であり自動遮断の証明にはなりません。この告知の厳密な公開時刻は今回未確定のため、16:34時点の確定情報に遡及させず追加確認として掲載します。受信ルールは外部応答の展開を修復しません。[Cloudflare公式](https://developers.cloudflare.com/changelog/post/2026-10-25-emergency-waf-release/)

[調査ノート](research-http2shell-2026-10-25.md) / [前回の広域調査](25-snapshot-20261025.ja.md) / [専用画面 #40](https://infosec-briefing.yomiplush.dev/?lang=ja#40)
