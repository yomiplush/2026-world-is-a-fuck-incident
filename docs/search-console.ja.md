# Search Console：英語ページの発見と効果測定

対象：`https://www.infosec-briefing.net/`。英語は `/en/` と末尾 `.en` の両方にある。
`/en/` だけのURLプレフィックスプロパティでは既存の英語記事を集計できない。

## サイト側で用意するもの

- `/sitemap.xml`：既存の全体サイトマップ。既存の提出や外部参照を維持する。
- `/sitemap-index.xml`：下記2ファイルを参照するインデックス。
- `/sitemap-en.xml`：公開HTMLの `lang=en` を確認して抽出した英語ページ。
- `/sitemap-ja.xml`：公開HTMLの `lang=ja` を確認して抽出した日本語ページ。

生成元はすべて `tools/publish-site.py`。英語入口・記事・運営方針を含め、公開済みの正規URLを収録する。
404とHTMLのrobots/googlebotにnoindexまたはnoneがあるページは除外する。
言語別サイトマップは件数と登録状況を切り分けるためで、分割自体が順位向上を保証するものではない。
`lastmod` は実際の公開・実質的更新が確認された値だけを使う。
全言語版の関係は既存のHTML hreflangで伝える。監視のために新たな言語URLは作らない。

## Search Consoleで行う最小操作

1. [対象ドメインのサイトマップ画面](https://search.google.com/search-console/sitemaps?resource_id=sc-domain%3Ainfosec-briefing.net) を開く。
   Domainプロパティが実際に登録・確認されている場合は `sc-domain:infosec-briefing.net` を使う。
   URLプレフィックスのプロパティを使う場合は `https://www.infosec-briefing.net/` を選ぶ。
   この作業ではプロパティの所有権や管理画面へのアクセスは確認できていない。
2. `https://www.infosec-briefing.net/sitemap-index.xml` を追加送信する。
   既存の `sitemap.xml` を削除する必要はない。処理後に英語用子サイトマップの取得状態とページ数を確認する。
   robots.txtにも両方を記載しているため、直接送信の前でもクローラーが発見できる構成。
3. [検索パフォーマンス](https://search.google.com/search-console/performance/search-analytics?resource_id=sc-domain%3Ainfosec-briefing.net) で、検索タイプをウェブ、ページをカスタム正規表現（一致）にし、下記を入力する。

```text
^https://www[.]infosec-briefing[.]net/(en/|[^?#]*[.]en($|[?#]))
```

これは検索語のフィルターではなく**ページURLのフィルター**。まず全世界で集計し、国・端末別に内訳を見る。
英語だから米国だけに限定すると、英国・インド・その他の英語読者を見落とす。

## 重点URLの確認

最初に `/en/`、最新の英語レポート、`/database.en`、`/timeline.en`、`/tailworm.en` をURL検査する。
管理画面の登録済み結果で、Googleが選択したcanonicalと申告したcanonicalを比較する。
最新版を調べる場合はライブテストを使う。必要な主要URLのみインデックス登録をリクエストする。
全記事への連続した再リクエストを日々の運用にしない。

URL Inspection APIはGoogleのインデックス版を読み取るAPIで、ライブテストや登録リクエストには使えない。
APIにはSearch ConsoleのOAuthスコープが必要で、通常のGoogle Cloud権限だけでは足りない。
一般記事にIndexing APIは使わない。

## 最初の計測

- 初回：英語ページフィルターの過去28日分をCSVエクスポートして基準を残す。
- 7日後：サイトマップ処理状況と主要URLのクロール・登録状況を確認する。
- 28日後：直前28日との比較で、英語ページのクリック・表示回数・CTR・平均掲載順位を確認する。
- ページ＋検索語＋国を見て、表示され始めた具体的な製品・脆弱性の検索に、独自調査を追加する。
- 56〜90日：ニュース需要の変動と更新頻度を考慮して継続傾向を見る。

Search Consoleの日付はPT（太平洋時間）。新しいデータには遅れがあり、速報値は変わるため、当日のゼロを障害と断定しない。
CTRや平均順位の単独変動ではなく、ページごとの検索意図・表示回数・クリックを合わせて判断する。

## 今回確認できたこと／未実施

2026-10-31 JSTの公開監査では既存の正規URL62件すべてがHTTP200、自己canonical一致、HTML noindexなしだった。
英語31件、日本語31件。これは公開HTMLの確認であり、Googleの登録済み件数ではない。
監査後に記事を追加すれば件数は変わる。

本変更はサイト側の発見・監視準備を行うもので、Search Console内の操作を自動実行するものではない。
サイトマップの直接送信、Googleが選択したcanonical、実際の登録状態、検索実績は、
当該プロパティにアクセスできる認証または所有者の管理画面で別途確認する。

## 検証

```sh
npm run build
python3 -m unittest discover -s tests -p '*_test.py'
node --test tests/*.test.cjs
npm run check:assets
```

`tests/search_console_test.py` は言語別ファイルに重複・欠落がないこと、英語入口とネストした英語ページが収録されること、
拡張子の命名でなく実際のHTML言語を使うこと、noindex除外、インデックスの参照先を確認する。

## Google公式資料

- [サイトマップの作成・提出](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Sitemapsレポート](https://support.google.com/webmasters/answer/7451001?hl=en)
- [プロパティの対象範囲](https://support.google.com/webmasters/answer/34592?hl=en)
- [URL Inspection APIの範囲とOAuthスコープ](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect)
- [再クロールの依頼](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [Search Analyticsの正規表現フィルター](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
