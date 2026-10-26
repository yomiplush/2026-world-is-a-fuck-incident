# 新ドメインとGoogle Search Consoleの運用

正規サイトは **https://www.infosec-briefing.net/** です。旧ドメイン、wwwなしの新ドメイン、Pagesの本番ドメインからは、パスとクエリーを保って301移転します。`.html`の既存リンクもCloudflareのクリーンURLへ到達します。

## サイト側で用意したもの

- 新ドメイン・最終200URLに統一したcanonical、サイトマップ、OG/Twitter情報。
- 全文が静的HTMLの読むレポート、調査データ一覧、編集方針と訂正窓口。ルートにも同じ訪問者全員が開ける読む入口を用意。
- 実在する静的Tailworm翻訳だけの相互hreflang。モーションの言語クエリーを、別の静的翻訳ページとして申告しない。
- 本文に対応したWebSite、Article、Breadcrumb、調査データのDataset情報。基準時刻を公開時刻と偽らず、未確認の公開日時・組織・受賞歴・ライセンスなどを追加しない。
- `/sitemap.xml`、`/feed.xml`、`/robots.txt`、実際の404応答。公開連絡先メールはCloudflareのアドレス単位の指定を用い、JavaScriptなしでも読めるようにしています。サイトマップにエラーURLやリダイレクトするURLを含めない。
- 現在の選定データを取得できる `/data/latest.json`。全収集原本・API全件索引はリポジトリに保持。

## アカウント内で残る操作

この実行環境では、既存のgcloud認証とApplication Default Credentialsの両方でSearch Consoleの一覧APIが **403 / ACCESS_TOKEN_SCOPE_INSUFFICIENT** になりました。したがって、サイトマップ送信、URL検査、アドレス変更をこの実行から完了したとは報告しません。トークン値は出力していません。サイト側の公開状態は別途検証します。

1. 登録済みの **`sc-domain:infosec-briefing.net`** プロパティを選び、[サイトマップ](https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Ainfosec-briefing.net) に **`https://www.infosec-briefing.net/sitemap.xml`** を送信します。すでに同じURLが送信済みなら追加は不要です。
2. URL検査でトップ、`/database`、`/about`、最新レポート、`/tailworm?lang=ja`、`/tailworm.en`を確認します。公開URLテストで取得・レンダリング・インデックス許可を確認し、必要な主要ページだけ登録をリクエストします。URL Inspection APIは公開URLテストの代替ではありません。
3. 旧サイトも同じアカウントで所有権確認できている場合は、旧プロパティの「設定 → アドレス変更」から新ドメインへの移転を申請します。旧プロパティの所有権確認や移転申請が不要・未実施なら、その状態を維持したまま新サイトマップと301で移転を通知します。旧ドメインのDNS・TLS・301を少なくとも1年間維持します。
4. 以後「ページのインデックス登録」「サイトマップ」「検索パフォーマンス」「ウェブに関する主な指標」を確認します。Google選択canonicalが新wwwホストになっているか、soft404、クロール失敗、重複URL、モバイルでの操作障害が増えていないかを見ます。新ドメインの処理と検索順位の安定には時間がかかることがあります。

Googleの順位・リッチリザルト・インデックス登録を保証する設定はありません。キーワードを詰め込んだページ、クローラーだけに見せる本文、一般記事に対するIndexing APIの使用は行っていません。

## 更新コマンド

```sh
python3 tools/build-site.py
python3 tests/seo_test.py
node tests/redirects.test.cjs
```

`content/site.json`をサイトの識別情報の唯一の設定元とし、各ページ生成の後に`tools/publish-site.py`を実行します。取得原本や過去の調査基準は書き換えません。サイトマップのlastmodにはビルド時刻を機械的に付けていません。実質的な本文更新を記録できるときに限って追加してください。

一次資料：[Googleのサイト移転](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)、[正規URL](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)、[サイトマップ](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)、[Article構造化データ](https://developers.google.com/search/docs/appearance/structured-data/article)、[Search Consoleのアドレス変更](https://support.google.com/webmasters/answer/9370220)、[Pagesの配信と404](https://developers.cloudflare.com/pages/configuration/serving-pages/)。事前監査の詳細は[SEO監査](seo-audit-2026-10-26.md)を参照してください。
