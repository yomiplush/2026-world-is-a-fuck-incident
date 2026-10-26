# 主要言語の表示と保存翻訳

200言語以上への拡張は取りやめました。モーションとTailwormは、既存12言語にウクライナ語・ポーランド語・スウェーデン語を加えた15言語を、通常のプルダウンで選べます。検索ダイアログや自動公開の常駐処理は使いません。

言語の定義は `content/site-languages.json` に集約しています。日本語・英語・簡体字中国語・韓国語・スペイン語・フランス語・ドイツ語・ポルトガル語・ロシア語・アラビア語・ヒンディー語・インドネシア語・ウクライナ語・ポーランド語・スウェーデン語が対象です。

ウクライナ語・ポーランド語・スウェーデン語はモーション既存画面（新規00:18画面は日本語・英語）とUI、Tailworm本文、最新37論点の調査データを翻訳しています。既存の他言語では、モーションの一部の追加画面に英語の補完があります。調査データのプルダウンには、本文の翻訳が完成した言語だけを表示します。

翻訳はCodexで作成し、母語話者による校閲は未実施です。原文・公式資料に戻って、製品名・版・設定・対策を確認できる形で提供します。Google翻訳のサービスやAPIへ送信しません。

## 追加2言語の選定

ポーランド語はゲーム開発産業との相性を重視しました。[PARPの2025年版産業報告](https://www.parp.gov.pl/component/publications/publication/the-game-industry-of-poland---report-2025)を参照しています。スウェーデン語はICT分野の専門職比率を参考に選びました。[Eurostatの2026年5月公表値](https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/ddn-20260527-2)では、2025年のスウェーデンの比率は8.9%でEU最高でした。どちらも[Steamの公式対応言語](https://partner.steamgames.com/doc/store/localization/languages?l=english)に含まれます。

## 更新

```sh
python3 tools/build-site.py
python3 tests/stored_translations_test.py
python3 tests/seo_test.py
node --test tests/languages.test.cjs
```

データベースの翻訳を追加・更新するときは、`data/translations/<snapshot>/<locale>.json` に201項目の翻訳文字列と自己完結した `database` を保存します。原文ハッシュに加えて、出典URL・基準時刻・分類も含む台帳全体のハッシュが一致する完成データだけを公開します。`memory/<locale>.json` は同じ原文の再利用に使います。

必要な言語を明示して公式Codex CLIで生成する場合は、認証済み環境で次のように実行できます。標準の対象は上記の主要言語に限定されています。

```sh
python3 tools/translations/manage.py run --locales uk --workers 1
python3 tools/build-site.py
```

認証情報は保存・公開しません。数値、CVE/GHSA、版、設定値、URLを保護して検査しますが、意味の正確さを保証する検査ではありません。過去の生成記録や取りやめ前に保存した翻訳は監査用に残し、現在の公開言語とは区別します。
