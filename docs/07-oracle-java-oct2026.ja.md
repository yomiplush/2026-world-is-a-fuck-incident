# Oracle Java SE — 2026年10月 クリティカルパッチアップデート

[English](07-oracle-java-oct2026.md) | [**日本語**](07-oracle-java-oct2026.ja.md)

Oracle の 2026年10月 CPU には **Java SE のセキュリティパッチが 55 件**入っています。この文書は、
その55件が何か、どのビルドに修正が入っているか、手元のホストが該当するかを判定する方法を、
すべて一次ソースに紐づけた形で記録したものです。数値の出所は
[`data/2026-10-22/oracle-java-oct2026.json`](../data/2026-10-22/oracle-java-oct2026.json)
（`tools/intel/fetch-intel` で再生成可能）。

先に結論: **この Java 分の最大 CVSS は 7.5 で、9.x はありません。** CISA KEV にも入っていません。
四半期の定型バッチです。注目すべきは深刻度ではなく、**「影響を受ける版」と「修正版」が違う**
という点です（§2）。ここが一番間違えられます。

## 1. 何が出たか

| 事実 | 値 | 出所 |
|---|---|---|
| Oracle CPU のパッチ総数（全製品） | **1,295** | Oracle CPU アドバイザリ（2026年10月） |
| うち Java SE | **55** | Oracle Java SE Risk Matrix |
| 認証なしでリモート攻撃可能なもの | 55 件中 **49 件** | 同上 |
| Java 分の最大 CVSS | **7.5**（2件） | 同上 |
| CISA KEV に入っている Java の CVE | **0 件** | KEV カタログ 2026.10.21 |
| IPA の注意喚起 | 2026-10-21 | <https://www.ipa.go.jp/security/security-alert/2026/1021-jre.html> |
| NVD の CVE 登録 | 2026-10-20 22:20 UTC | NVD API（`CVE-2026-91484`） |

CVE は `secalert_us@oracle.com` が起票し、NVD 上は `Awaiting Analysis` のままです。Oracle の
開示ではこれが普通で、**NVD の解析が付くまで待つと数日失います。** スコアと影響版は
Oracle の risk matrix を正とし、ミラーを根拠にしないでください。

時期の補足: 1つ前の CPU は 2026-08-18 に出ています。JDK 26.0.2 のリリースノートには
「Oracle はより高頻度のセキュリティ更新に移行しつつある」と書かれています。
**1月/4月/7月/10月という四半期の感覚は、もう Java のリリース間隔を説明しません。**
リリースノートで確認してください。

## 2. 「影響を受ける版」と「修正版」は別物

Oracle の表の列名は **"Supported Versions Affected"**、つまり「影響を受ける版」です。
そこに並ぶのは**あなたが今動かしている側**であって、動かすべき版ではありません。修正版は
別ビルドで、すべて **2026-10-20** に出ています。

| ライン | 影響を受ける版（Oracle の列＝IPA の「対象」） | 修正版 | 修正ビルド | リリース日 |
|---|---|---|---|---|
| 8 | `8u503`, `8u503-perf` | **8u511** | `1.8.0_511-b09` | 2026-10-20 |
| 11 | `11.0.32.1` | **11.0.33** | `11.0.33+9` | 2026-10-20 |
| 17 | `17.0.20.1` | **17.0.21** | `17.0.21+9` | 2026-10-20 |
| 21 | `21.0.12.1` | **21.0.13** | `21.0.13+10` | 2026-10-20 |
| 25 | `25.0.4.1` | **25.0.5** | `25.0.5+9` | 2026-10-20 |
| 26 | `26.0.2` | `26.0.3` は存在しない | — | 27 に移行 |
| 27 | `27` | **27.0.1** | `27.0.1+9` | 2026-10-20 |

ここから出る結論は3つで、どれも実際に事故になっています。

1. **「Oracle が挙げている 21.0.12.1 にしている」＝ 影響を受ける版にいる。** 修正は 21.0.13。
   末尾の `.1` はパッチセット更新であって、今回の CPU の修正ではありません。
2. **JDK 26 に修正は出ません。** `26.0.3` は存在せず（Oracle で 404）、26.0.2 のリリースノートは
   2026-08-18 の更新以降この版を使わないよう案内しています。26 は非LTSで 27 に引き継ぐライン
   なので、直す方法はライン移動だけです。
3. **OpenJDK 系ビルドは遅れます。** Oracle の2日後（2026-10-22 確認）でも、Eclipse Temurin の
   最新は8月のビルドのまま（`8u504-b01` / `11.0.32.1+1` / `17.0.20.1+1` / `21.0.12.1+1` /
   `25.0.4.1+1` / `27+35`）。Temurin・Corretto・Zulu・ディストリのパッケージを使っている場合、
   **修正は各ベンダのタイミングで来て、版番号も Oracle と一致しません。** 判断はベンダの
   リリースノートで行ってください。

   ```bash
   # 自分のベンダの修正版は出ているか（認証不要のJSON）
   curl -s 'https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=x64&image_type=jdk&os=linux' \
     | jq -r '.[0] | "\(.release_name)  \(.binary.updated_at)"'
   ```

## 3. 55件の CVE

`AV` は攻撃経路（N=ネットワーク / L=ローカル）。`Remote` は認証なしで攻撃可能か。
`Note` は Oracle の適用範囲ノート（§4）。`Lines` は影響する Java SE のライン。

| CVE | Component | CVSS | AV | Remote | Note | Lines |
|---|---|--:|---|---|---|---|
| `CVE-2026-91484` | Java plugin | 7.5 | L | no | N1 | 8 |
| `CVE-2026-43660` | JavaFX (WebKitGTK) | 7.5 | N | yes | N1 | 8 |
| `CVE-2026-91415` | 2D | 7.0 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-91398` | Networking (SOCKS5) | 6.8 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-91382` | 2D | 6.5 | N | yes | N2 | 8,11,17 |
| `CVE-2026-91411` | JGSS | 6.5 | N | yes | N2 | 8,11 |
| `CVE-2026-101516` | Libraries | 6.5 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-83395` | Networking | 6.5 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-87294` | Security | 6.5 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-91395` | Utility | 6.5 | N | yes | N2 | 8,11 |
| `CVE-2026-91396` | Utility | 6.5 | N | yes | N2 | 8,11 |
| `CVE-2026-101737` | Compiler | 5.9 | N | yes | N3 | 26 |
| `CVE-2026-91394` | Networking | 5.9 | N | yes | N2 | 11,17,21,25,27 |
| `CVE-2026-87290` | JAXP | 5.9 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-83387` | JDBC | 5.9 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-91462` | JGSS | 5.9 | N | yes | N3 | 8,11,17,21,25,27 |
| `CVE-2026-83374` | Security | 5.9 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-6732` | JavaFX (WebKitGTK) | 5.9 | N | yes | N1 | 8 |
| `CVE-2026-87293` | RMI | 5.4 | N | yes | N3 | 8 |
| `CVE-2026-91385` | JavaFX | 5.4 | N | yes | N1 | 8 |
| `CVE-2026-91410` | Libraries | 5.3 | N | yes | N2 | 8,11,17,21,25 |
| `CVE-2026-87291` | Networking | 5.3 | N | yes | N3 | 21,25,27 |
| `CVE-2026-91332` | Networking | 5.3 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-91451` | Networking | 5.3 | N | yes | N3 | 8,11,17,21,25 |
| `CVE-2026-91373` | JSSE (TLS) | 5.3 | N | yes | N2 | 8,11,17,21,25 |
| `CVE-2026-91417` | CORBA | 5.3 | N | yes | N3 | 8 |
| `CVE-2026-83380` | JAAS | 5.3 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-83400` | JAXP | 5.3 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-91463` | JGSS | 5.3 | N | yes | N1 | 8,11,17,21,25,27 |
| `CVE-2026-91464` | JGSS | 5.3 | N | yes | N1 | 8,11,17,21,25,27 |
| `CVE-2026-91453` | Lightweight HTTP Server | 5.3 | N | yes | N3 | 8,11,17,21,25,27 |
| `CVE-2026-91452` | Networking | 5.3 | N | yes | N3 | 8,11,17,21,25,27 |
| `CVE-2026-91418` | ImageIO | 5.3 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-83378` | Compiler | 4.8 | N | yes | N3 | 21,25,27 |
| `CVE-2026-91487` | Compiler | 4.8 | N | yes | N3 | 8,11,17,21,25,27 |
| `CVE-2026-83381` | Security | 4.8 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-91374` | Serviceability | 4.8 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-91375` | Libraries | 4.7 | L | no | N2 | 8,11,17,21,25,27 |
| `CVE-2026-91379` | JDK tools | 4.7 | L | no | N1 | 8,11,17,21,25,27 |
| `CVE-2026-46470` | JavaFX (gstreamer) | 4.2 | N | yes | N1 | 8 |
| `CVE-2026-91380` | Utility | 4.0 | L | no | N2 | 8,11,17,21,25,27 |
| `CVE-2026-87255` | Compiler | 3.7 | N | yes | N3 | 25,27 |
| `CVE-2026-91409` | Networking | 3.7 | N | yes | N2 | 27 |
| `CVE-2026-91333` | Security | 3.7 | N | yes | N2 | 21,25,27 |
| `CVE-2026-91381` | 2D | 3.7 | N | yes | N2 | 8 |
| `CVE-2026-91334` | ImageIO | 3.7 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-87367` | JAXP | 3.7 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-87292` | Networking | 3.7 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-83376` | JSSE (TLS) | 3.7 | N | yes | N2 | 8,11,17,21,25,27 |
| `CVE-2026-91461` | JSSE (TLS) | 3.7 | N | yes | N3 | 8,11,17,21,25,27 |
| `CVE-2026-91397` | Serviceability | 3.6 | L | no | N2 | 8,11,17,21,25,27 |
| `CVE-2026-91400` | Sound | 3.1 | N | yes | N1 | 8,11,17,21,25,27 |
| `CVE-2026-91402` | JavaFX | 3.1 | N | yes | N1 | 8 |
| `CVE-2026-91477` | JavaFX | 3.1 | N | yes | N1 | —（JavaFX のみ） |
| `CVE-2026-91335` | AWT | 2.6 | N | no | N1 | 8,11,17,21,25,27 |

内訳: Networking 9、JGSS 4、Security 4、Compiler 4、2D 3、JAXP 3、JSSE 3、Libraries 3、
Utility 3、JavaFX 3、残りは各1〜2。55件のうち18件は Java SE 単独、37件は GraalVM for JDK /
GraalVM Enterprise Edition にも及ぶ。7件は JavaFX に関係します。

**まとめて直る分に注意。** この表の2行は1件の脆弱性ではありません。

- `CVE-2026-43660`（JavaFX / WebKitGTK）のパッチは、**追加で55件の CVE も解決します**
  — `CVE-2024-4367` と `CVE-2026-2xxxx` / `CVE-2026-4xxxx` 帯の54件。
- `CVE-2026-46470`（JavaFX / gstreamer）のパッチは、追加で5件
  （`CVE-2024-47778`、`CVE-2026-1940`、`CVE-2026-2921`、`CVE-2026-39044`、`CVE-2026-46469`）も解決します。

つまり「55件」は JavaFX を含む配備では実態を過小に表現しています。この2行の裏には
55 + 60 件あります。

## 4. Note 1/2/3 の読み方 — クライアントかサーバか

Oracle は全 CVE に3種類の適用範囲ノートを付けます。ヘッドレスなサーバが気にするかどうかは
これで決まり、しかも最も誤読される列です。

| Note | Oracle の説明（要約） | 件数 | 実務的な意味 |
|---|---|--:|---|
| **N1** | サンドボックス化されたアプレット / Java Web Start で**信頼できないコード**を動かし、サンドボックスに依存する配備が対象。「信頼できるコードだけを動かすサーバには適用されない」 | 12 | デスクトップ／ブラウザの信頼境界。ヘッドレスサーバでは通常対象外。開発機や JNLP 利用端末では対象。 |
| **N2** | 当該コンポーネントの API に**データを供給される**ことで攻撃可能（例: Web サービス経由）。サンドボックスのクライアントにも適用 | 31 | **サーバにも効く。** 信頼できない入力が JDK の API（TLS、2D/ImageIO、JAXP、JDBC、JGSS、Networking）を通る箇所すべて。 |
| **N3** | 信頼できないアプレットを使わず、当該コンポーネントの API にデータを供給する形でのみ攻撃可能（Web サービス経由など） | 12 | サーバ向け。ただし「その API に攻撃者由来のデータが届く」ことが前提。 |

サーバ群の実務的な切り分けは、**N2 + N3 = 55件中43件**を「反証できるまで自分向け」と
扱うことです。N1 はワークステーション、ビルドエージェント、アプレットを動かす何か
（2026年にはほぼ無い）で意味を持ちます。N1 は「確認はする、慌てない」で足ります。

Oracle はスコアが「アプレット/JWS の利用者に管理者権限がある前提」だと明記しており、
権限がなければ影響度が下がります（Oracle 自身の例: 9.6 → 7.1）。つまりここの 7.5 は、
ネットワークサービスの 7.5 と同じ重さではありません。

## 5. Java はどこに潜んでいるか

Java が「アプリそのもの」であることは稀で、たいてい他の何かの中にいます。だから棚卸しから
漏れます。

| 場所 | 見るもの |
|---|---|
| ベースイメージ | `FROM eclipse-temurin:21`、`amazoncorretto:17`、`openjdk:8` — タグがパッチ水準を固定する |
| アプリサーバ | Tomcat、Jetty、WildFly、WebLogic、WebSphere、GlassFish |
| データ層 | Elasticsearch / OpenSearch、Kafka、Zookeeper、Solr、Cassandra、Neo4j |
| CI・ビルド | Jenkins（JRE 同梱）、Gradle/Maven ラッパー、Android SDK / `sdkmanager`、Sonar |
| デスクトップ・ツール | IDE 同梱 JDK、LibreOffice の JRE、DBeaver、Burp Suite、Neo4j Desktop |
| ベンダ同梱 | ネットワーク機器・監視カメラ・UPS・計測器が古い JRE を同梱したまま |
| 埋め込み | コンテナ内の `jlink` イメージ、インストーラ内の `jpackage` バンドル |

一覧より大事な原則は2つ。**タグは版ではない**（3月にビルドした `21-jdk` イメージも 21 と
名乗る）、**ホストの `java -version` はコンテナの版ではない**。

## 6. 検出（読み取りのみ）

```bash
# 実際に動いているランタイムを、ビルド番号まで含めて確認
for j in $(command -v java javac 2>/dev/null) /usr/lib/jvm/*/bin/java; do
  [ -x "$j" ] && printf '%s -> ' "$j" && "$j" -version 2>&1 | head -1
done

# パッケージ管理が把握している JVM（Debian/Ubuntu、RHEL/Fedora、Arch）
dpkg -l 2>/dev/null | awk '/jre|jdk|openjdk|temurin/ {print $2, $3}'
rpm -qa 2>/dev/null | grep -Ei 'jdk|jre|java-.*openjdk'
pacman -Q 2>/dev/null | grep -Ei 'jdk|jre|java'

# コンテナ: タグは嘘をつくが、バイナリは嘘をつかない
docker ps -q | xargs -r docker inspect --format '{{.Name}} {{.Config.Image}}'
docker ps -q | xargs -r -I{} sh -c 'docker exec {} java -version 2>&1 | head -1 | sed "s|^|{} |"'

# ベンダビルドの状況（認証不要のAPI）
curl -s 'https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=x64&image_type=jdk&os=linux' \
  | jq -r '.[0].release_name'
```

見るのは**ビルド文字列**（`21.0.13+10`）であって、通称ではありません。`21.0.12.1` と `21.0.13`
は1文字違いで、§3 の修正全体がその差です。

## 7. 直し方

| 使っているランタイム | やること |
|---|---|
| Oracle JDK（ライセンスあり） | ラインごとの 2026-10-20 の CPU ビルドを入れる: 8u511 / 11.0.33 / 17.0.21 / 21.0.13 / 25.0.5 / 27.0.1 |
| JDK 26 | 修正は存在しない。27.0.1 に移る（26 は非LTSで引き継ぎ済み） |
| Temurin / Corretto / Zulu / Liberica | 同じ上流修正を含む**そのベンダの**ビルドを待つ。判断はベンダのリリースノートで（Oracle のページではない） |
| ディストリのパッケージ | `apt install --only-upgrade openjdk-21-jre-headless` / `dnf upgrade java-21-openjdk` / `pacman -Syu jre-openjdk` |
| コンテナイメージ | 修正版タグで再ビルドして再デプロイ。起動中のコンテナに `docker cp` で JRE を差し込まない |
| CI ランナー・ビルドエージェント | ツールチェーンが使う JDK を更新し、成果物を作り直す。古い JRE で作り直した jar は露出したまま |

作業後は §6 のコマンドを**動いているプロセス**に対して実行し、ホストとコンテナの両方を確認します。
JVM 自身の認識も確認してください。

```bash
java -XshowSettings:properties -version 2>&1 | grep -E 'java.version|java.vendor'
```

## 8. やってはいけないこと

- **Oracle の "Supported Versions Affected" を修正版一覧として扱う。** 21.0.12.1 は影響を受け、
  21.0.13 が修正版です。Oracle Java の注意喚起で最も多い誤りです。
- **ベンダ間で版番号を比べる。** Temurin の `8u504` と Oracle の `8u503` は同じ上流ラインの
  別の採番で、どちらが「新しい＝修正済み」かを教えてはくれません。
- **イメージタグが変わったことをもって JRE 更新完了とする。** タグは同じ名前で作り直されます。
  動いているコンテナの `java -version` を読んでください。
- **共有の開発機で N1 を飛ばす。** サンドボックス脱出にはサンドボックスが要ります。信頼できない
  コードが動くのはビルドエージェントと IDE です。
- **確認せずに「Java は無い」と報告する。** `dpkg -l | grep java` より、Elasticsearch や Jenkins、
  ベンダ機器の中にいることの方が多いです。

## 9. 出所

- Oracle CPU アドバイザリ（Java SE risk matrix、ノート、一括修正の記載）:
  <https://www.oracle.com/security-alerts/cpuoct2026.html>
- 修正版のリリース日とビルド文字列: Oracle リリースノート
  `javase/{8u511,11-0-33,17-0-21,21-0-13,25-0-5,27-0-1}-relnotes.html`、
  `javase/26-0-2-relnotes.html`
- IPA の注意喚起（2026-10-21）: <https://www.ipa.go.jp/security/security-alert/2026/1021-jre.html>
- CISA KEV カタログ: <https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json>
- NVD の突き合わせ: <https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-2026-91484>
- サードパーティビルドの状況: <https://api.adoptium.net/v3/assets/latest/21/hotspot?architecture=x64&image_type=jdk&os=linux>
- この文書の機械可読版: [`data/2026-10-22/oracle-java-oct2026.json`](../data/2026-10-22/oracle-java-oct2026.json)

再取得は `tools/intel/fetch-intel`（[`SOURCES.ja.md`](../SOURCES.ja.md) 参照）。
