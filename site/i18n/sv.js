window.registerLocale('sv', {
  "ui": {
    "chapter": "ÖVERSIKT",
    "sound": "LJUD",
    "on": "PÅ",
    "off": "AV",
    "sources": "KÄLLOR",
    "close": "STÄNG",
    "tap": "NÄSTA",
    "replay": "SPELA IGEN",
    "hint": "tryck / klicka / mellanslag",
    "hintEnd": "slut på översikten — tryck för att börja om",
    "coverKicker": "INCIDENTÖVERSIKT · 2026-10",
    "coverTitleA": "EN MÅNAD,",
    "coverTitleB": "15 INCIDENTER.",
    "coverSub": "De 15 incidenterna i oktober, i ordning.<br>Breda uppdateringar och 65 bilder i tidsordning, inklusive morgonens scheman om Consul och OpenHands. Se rapporten för uppdateringen den 27 oktober, 07:47 JST. Tryck för att gå vidare.",
    "coverStart": "TRYCK FÖR ATT BÖRJA",
    "coverFoot": "Källor ingår. ConnectWise har nu bekräftats genom förstahandskällor; tidigare bilder behåller sitt historiska sammanhang.",
    "drawerTitle": "KÄLLOR",
    "drawerFoot": "Senaste läsrapport: 27 oktober, 07:47 JST. Bilderna behåller sammanhanget för sina datum; tillägg följer granskningsdatumen. Källorna hämtades efter bryttiden.",
    "asof": "läget 2026-10-27 07:47 JST",
    "lang": "SV"
  },
  "scenes": {
    "intro": {
      "kicker": "INCIDENTÖVERSIKT · 2026-10",
      "title": "Oktobers incidenter, i datumordning.",
      "lede": "Oberoende fel som gång på gång träffade samma slags svaghet. Tryck för att gå igenom dem i ordning.",
      "points": [
        "De första 15 fallen och senare breda granskningar; detta är inte ett globalt antal drabbade",
        "<a href=\"./update-20261027-0747.html\">Rapport 07:47 JST (japanska) →</a> · <a href=\"./timeline.html\">Läs efter datum →</a>",
        "Ljudet är på — slå av eller på uppe till höger"
      ],
      "metric": "incidenter · 1 månad"
    },
    "php-silence": {
      "kicker": "PHP-KÄRNAN · SAMORDNAT OFFENTLIGGÖRANDE",
      "title": "70 tysta dagar.",
      "lede": "70 dagar från rapport till utgåva. Det farliga fönstret låg inte efter publiceringen, utan strax före.",
      "points": [
        "08-01 Calif hittar flera RCE-vägar / 08-11 rapporteras de till PHP",
        "10-20 detaljer läcker; watchTowr bekräftar RCE",
        "10-21 <b>07:43 UTC</b> angreppsförsök observeras före rättningen (Cloudflare)",
        "10-21 14:00 rättade utgåvor — 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35"
      ],
      "metric": "dagar från rapport till publicering"
    },
    "zeabur": {
      "kicker": "ZEABUR · INFRASTRUKTUR",
      "title": "En administratörsnyckel i klartext öppnade 9 regioner.",
      "lede": "Den andra incidenten sedan augusti. Nyckelbytet i augusti omfattade inte de inloggningsuppgifter som användes denna gång.",
      "points": [
        "10-14 01:36 intrång via interna AWS-nycklar / 01:51 systemhemligheter",
        "från 12:39 alla tjänsters miljövariabler; kommandon kördes i <b>865</b> databastjänster",
        "grundorsak: administratörsuppgifter i klartext utan giltighetstid och ett offentligt åtkomligt administrationsplan",
        "kunder: byt alla miljövariabler igen, även om det gjordes i augusti"
      ],
      "metric": "berörda databastjänster"
    },
    "rankmath": {
      "kicker": "RANK MATH SEO PRO · TILLÄGGSKANAL",
      "title": "I 11 timmar var den officiella nedladdningen skadlig.",
      "lede": "Ett tilläggs uppdateringskanal är en angreppsväg. CVSS 9.8.",
      "points": [
        "3.0.123 nedladdad mellan 10-15 20:02 och 10-16 07:12 UTC",
        "<b>CVE-2026-111862</b> / CVSS 9.8 / rättad i 3.0.124",
        "en uppdatering slutför inte saneringen — sök efter administratörskonton, extra filer och schemalagda uppgifter",
        "Wordfence levererade tidigt en akut brandväggsregel"
      ],
      "metric": "CVSS · CVE-2026-111862"
    },
    "teamupdraft": {
      "kicker": "TEAMUPDRAFT · ANSLUTNINGSNYCKLAR",
      "title": "Nycklar i en databas öppnade tusentals webbplatser.",
      "lede": "Anslutningsnycklar ger giltigt signerade kommandon, så den tidigare säkerhetsrättningen stoppade dem inte.",
      "points": [
        "kunddatabasen lästes: kontaktuppgifter, lösenordshashar, 2FA-inställningar och <b>3 sorters anslutningsnycklar</b>",
        "UpdraftCentral / UpdraftVault / UpdraftClone-nycklar användes för att ladda upp, aktivera och radera tillägg",
        "signaturerna var äkta, så även webbplatser med rättad CVE-2026-10795 godtog dem",
        "UpdraftPlus 1.26.13 / 2.26.13 kopplar automatiskt från anslutningar skapade före 10-18 22:00 BST"
      ],
      "metric": "missbrukade nyckeltyper"
    },
    "emudhra": {
      "kicker": "EMUDHRA · CERTIFIKATUTFÄRDARE",
      "title": "Nycklarna stals inte. De var för svaga för att vara hemliga.",
      "lede": "Privata P-384-nycklar som var små heltal — 4, 56, 66, 115, 155, 156, 230, 237. Mellan 3 och 8 bitars entropi.",
      "points": [
        "<b>8</b> mellanliggande CA:er (6 TLS, 2 kodsignering). En ceremoni 2025-04-30 för <b>24 underordnade</b> gav en andra, svag nyckeluppsättning genom ett wrap/unwrap-fel",
        "10-17 18:05 UTC rapport → 19:45 Chrome blockerar via SPKI → 22:59 alla Firefox. <b>Apple blockerade de 6 TLS-nycklarna, Microsoft de 2 för kodsignering</b>",
        "Webbläsarna rättade bara sin egen kopia: Docker, Kubernetes, IoT och Python-paket återstår. Go levererade <b>CVE-2026-111943</b> i 1.27.3 / 1.26.10",
        "Den mest akuta risken gäller <b>VPN-klienter</b> (Talos, Ars): enligt Gos kryptografiunderhållare krävs ”större sanering än efter Heartbleed”"
      ],
      "metric": "en privat nyckel, bokstavligen"
    },
    "ovh": {
      "kicker": "OVHCLOUD CLI · UTGÅVEFILER",
      "title": "I 94 minuter var den officiella binärfilen något annat.",
      "lede": "Källkoden och byggkedjan var intakta. Det som brast var antagandet att utgåvefiler inte kan bytas ut.",
      "points": [
        "filer ersattes 10-19 mellan 14:47 och 16:21 UTC+2",
        "utgåvor <b>v0.11.0–v0.15.0</b>; endast nedladdningar under detta tidsfönster berörs",
        "grundorsak: arkivet var inte inställt för oföränderliga utgåvor",
        "åtgärden är en inställning plus kontroll: oföränderliga utgåvor och signaturverifiering"
      ],
      "metric": "minuters exponering"
    },
    "oracle": {
      "kicker": "ORACLE · JAVA SE:S KRITISKA SÄKERHETSUPPDATERING",
      "title": "55 rättningar, högst 7.5 — versionskolumnen är fällan.",
      "lede": "”Berörd” och ”rättad” är olika kolumner. 21.0.12.1 är berörd; rättningen finns i 21.0.13.",
      "points": [
        "55 CVE:er / 49 kan utnyttjas på distans utan autentisering / högst CVSS 7.5 / 0 i KEV",
        "berörda: 8u503, 11.0.32.1, 17.0.20.1, 21.0.12.1, 25.0.4.1, 26.0.2, 27",
        "rättade 10-20: <b>8u511 / 11.0.33 / 17.0.21 / 21.0.13 / 25.0.5 / 27.0.1</b>",
        "JDK 26 får ingen rättning (26.0.3 finns inte) — byt till 27"
      ],
      "metric": "CVE:er · 49 på distans utan autentisering"
    },
    "plex": {
      "kicker": "PLEX MEDIA SERVER · KEV",
      "title": "En SSRF med 4.3 öppnar vägen till kodkörning.",
      "lede": "Ingen enskild poäng sticker ut. CISA:s KEV-post beskriver hur de 4 bildar en kedja.",
      "points": [
        "tillagda i KEV 10-20 / tidsfrist <b>10-23</b> för 96656 och 96654",
        "kedja: valfri X-Plex-Token → SSRF → tilläggsanrop → filskrivning som administratör → .so körs vid start",
        "96651 finns inte i KEV men läser <b>PlexOnlineToken</b> — kontoövertagande",
        "rättad i <b>1.43.3.10861</b>, men aktuell utgåva är <b>1.43.5.11029</b>; NAS-butiker ligger efter"
      ],
      "metric": "CVE:er i KEV · tidsfrist 10-23"
    },
    "apache": {
      "kicker": "TILLÄGG · APACHE TOMCAT / HTTPD / TRAFFIC SERVER",
      "title": "3 ”Important”-fel, samma utfall: en annan användares data.",
      "lede": "Tomcats 3 fel har olika mekanismer men samma resultat. httpd:s ”low” får poängen 7.5. Allvarlighetsgrad är mer än ett tal.",
      "points": [
        "Tomcat: förbigång av autentisering i JNDIRealm (SASL utan GSSAPI) samt sammanblandade HTTP/2- och AJP-svar — <b>11.0.27 / 10.1.61 / 9.0.123</b>",
        "httpd <b>2.4.69</b>: UAF i mod_rewrite och skrivning utanför gränserna i mod_proxy_html. Apache anger låg, NVD anger 7.5",
        "Traffic Server: 2 CVE:er för request smuggling (8.9 / 8.7)",
        "Ingen finns i KEV — avsaknad av publicerat utnyttjande betyder inte säkert"
      ],
      "metric": "Tomcat: förbigång av autentisering · CVSS 4.0"
    },
    "php-race": {
      "kicker": "PHP · GLAPPET PÅ 6 TIMMAR",
      "title": "Sonderingarna kom 6 timmar före rättningen.",
      "lede": "En sorts fel där det redan är för sent att vänta på en offentlig PoC. Node.js agerade samma dag.",
      "points": [
        "<b>07:43 UTC</b> Cloudflare observerar försök innan rättningen släpps",
        "<b>14:00</b> PHP-utgåvor / <b>14:17</b> NVD publicerar CVE:n",
        "samma dag: Node.js 22.23.4 / 24.22.1 / 26.12.1, inklusive CA-paketet",
        "allt som var exponerat under dessa 24 timmar behöver en separat intrångskontroll"
      ],
      "metric": "sonderingar före rättningen"
    },
    "gitlab": {
      "kicker": "GITLAB · CVSS 10.0",
      "title": "Förra veckans uppdatering ger inte den här rättningen.",
      "lede": "Uppdateringen 12 oktober gällde 19.2 och senare. Denna rättning ligger en utgåva högre.",
      "points": [
        "<b>CVE-2026-110264</b> / heltalsöverspill i Onigmo / RCE utan autentisering / alla utgåvor sedan 7.0 (2014)",
        "rättade: 19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13",
        "en instans uppdaterad 12 oktober är berörd igen om versionen är lägre än 19.2.9",
        "ingen publicerad kringåtgärd — ta bort internetåtkomsten om uppgradering inte är möjlig"
      ],
      "metric": "CVSS · utan autentisering"
    },
    "npm": {
      "kicker": "PAKETKANALER · 4 INCIDENTER",
      "title": "Själva distributionen blev angreppsytan.",
      "lede": "8 av oktobers incidenter handlar om hur kod levereras. Proveniens visar bara var den byggdes.",
      "points": [
        "LiteLLM 1.107.0: kör informationsstöld vid varje Python-start, byggd från den snarlika <b>Berri-AI</b>",
        "tensorlake@0.5.144: en token som hålls som gisslan och raderar <b>$HOME</b> om den återkallas",
        "@subql/common@5.8.3: körs vid installation och igen vid import",
        "GhostAction: en falsk security-audit.yml skickade ut hemligheter och git-historik från <b>345</b> arkiv"
      ],
      "metric": "genomsökta arkiv · 16 minuter"
    },
    "railway": {
      "kicker": "RAILWAY · MILJÖVARIABLER",
      "title": "Miljövariablerna var lagret för hemligheter.",
      "lede": "”Del av en serie angrepp mot plattformsföretag riktade mot leverantörer av AI-inferens” — leverantörens egna ord.",
      "points": [
        "kunders miljövariabler lästes i krypterad form; vissa kan ha dekrypterats",
        "alla driftsättningar pausades; uppströmsleverantörer ombads återkalla nycklar i förebyggande syfte",
        "uppgiften gäller <b>varje</b> variabel, inte bara den som misstänks ha läckt",
        "där finns även SMTP-lösenord, signeringshemligheter för webhooks och JWT_SECRET"
      ],
      "metric": "miljövariabler att byta"
    },
    "bind": {
      "kicker": "TILLÄGG · ISC BIND 9 / DNS",
      "title": "Ett återuppspelat paket skadar minnet.",
      "lede": "Återuppspelning av ett GSS-TSIG-signerat UDP-meddelande slår ut `named`. ISC anger att ingen kringåtgärd finns.",
      "points": [
        "<b>CVE-2026-94300</b> / CVSS 8.1 (AV:N, AC:H) / ISC:s allvarlighetsgrad <b>High</b> / kan utnyttjas på distans",
        "berörda 9.11.0–9.18.50, 9.20.0–9.20.29, 9.21.0–9.21.26 (samt S1) → rättade i <b>9.20.30 / 9.21.27</b>",
        "vägen är GSS-TSIG-hanteraren: `named-checkconf -p | grep -i gssapi` visar om den är konfigurerad",
        "ingen kringåtgärd. Utgångna grenar (9.11–9.18) måste flyttas till 9.20 / 9.21"
      ],
      "metric": "CVSS · ingen kringåtgärd"
    },
    "lkml": {
      "kicker": "TILLÄGG · LINUXKÄRNAN / LKML",
      "title": "6 nolldagarsfel skickades till den offentliga listan.",
      "lede": "ZDI skickade rapporterna till offentliga LKML i stället för den privata säkerhetslistan. Greg Kroah-Hartman svarade på var och en och frågade varför.",
      "points": [
        "heltalsunderspill i SMB Direct (<b>9.0</b>) och en kapplöpning i ksmbd (<b>9.0</b>) — båda ger fjärrkörning av kod",
        "LPE i skb_zerocopy, skrivning utanför gränser i vmwgfx, en oinitierad nvmet-resurs och överspill i TCP:s sökdomän",
        "huvudgrenen är <b>orättad</b>: rättningar ligger i en v7.5-gren och -next (10-22); ingen commit i huvudgrenen hänvisar till ZDI-id:na",
        "minska exponeringen: stoppa <b>ksmbd</b> om den inte används och exponera aldrig SMB Direct mot opålitliga nät"
      ],
      "metric": "offentliggjorda rapporter"
    },
    "sweep": {
      "kicker": "GENOMGÅNGEN · NVD, 14 DAGAR",
      "title": "Samma kommando: 125, sedan 104. Inget rättades.",
      "lede": "Fönstret slutar ”i dag”, så antalet ändras med klockan. Antalet mäter publicering och analysomgångar, inte risk.",
      "points": [
        "125 för 9 timmar sedan, 104 nu: <b>-17</b> vid fönstrets kant, <b>-4</b> lämnade CRITICAL, <b>+0</b> nya",
        "endast <b>26%</b> har NVD:s CPE-koppling — bland 381 CVE:er publicerade under de senaste 24 timmarna har <b>0%</b> det",
        "högst EPSS: <b>5.76%</b> (php2shell 109619) — som sedan sänkts till 8.1, utanför intervallet",
        "CNA och NVD skiljer sig: MOVEit och TeamCity har 8.1 (AC:H) hos leverantören, 9.8 (AC:L) hos NVD"
      ],
      "metric": "kritiska CVE:er : kända som utnyttjade"
    },
    "infinity-core": {
      "kicker": "EFTERORD · LINUXKÄRNAN",
      "title": "6 genvägar till root i själva kärnans centrum.",
      "lede": "Hyunwoo Kim publicerade ”Infinity Core” på oss-security: 5 av 6 tar en opriviligierad användare till root, och samma 5 tar sig ur en container till värden.",
      "points": [
        "timer, signal, mm, futex, schemaläggare, SLAB — inget nätverk, ingen BPF och inga användarnamnrymder krävs",
        "NVD ger 4 poängen <b>7.8</b> och 2 ingen poäng alls; alla 6 står som <code>Received</code> och ingen finns i KEV",
        "<b>Rättningen har redan släppts</b>: 6.6.158 / 6.12.112 / 6.18.54 / 7.2.8, schemaläggaren i 7.2.9 — alla aktuella stabila grenar ligger högre",
        "det som behövs är en <b>omstart</b>. Ett rättat paket bredvid en gammal körande kärna lämnar felet öppet"
      ],
      "metric": "CVE:er : root-PoC:er"
    },
    "blindspot": {
      "kicker": "EFTERORD · DEN BLINDA FLÄCKEN",
      "title": "En genomgång ser bara vad databasen gjorde.",
      "lede": "Varken efter publiceringsdatum, ändringsdatum eller i någon av 12 flöden — Infinity Core dök inte upp i något av dem.",
      "points": [
        "CVE:erna publicerades <b>9/4-10/12</b>; PoC:erna kom <b>10/16</b> — ett glapp på 6 veckor",
        "deras NVD-poster ändrades inte i genomgången av 6 timmars ändringar; alla 6 står som <code>Received</code>",
        "<code>infinity</code> finns i <b>0</b> av de 13 flödenas rubriker — även RSS-toppen är ett fönster; arkivet är dokumentationen",
        "den saknade axeln är <b>offentliggörandekanalen</b>: med <code>oss-sec</code> hittades 4 poster som de andra 12 missade"
      ],
      "metric": "flöden som tog upp detta"
    },
    "ecosystem": {
      "kicker": "EFTERORD · EKOSYSTEMET",
      "title": "2 kritiska fel som inte är CVE:er.",
      "lede": "24 timmar i GitHub Advisory Database. Båda Next.js-råden om RCE utan autentisering saknar fortfarande CVE-id.",
      "points": [
        "Next.js <code>use cache</code> och bildoptimering (SVG), RCE: rättade i <b>16.4.1</b> / <b>15.5.28</b>",
        "DOMPurify 3.4.17, Pillow 13.0.0, GitPython 3.2.1, <code>toml</code> 5.0.1, Storybook 8.6.19",
        "en process som filtrerar på CVE-id ser aldrig dessa; utgå från paketnamn och rättad version",
        "samma dag angavs lägsta versioner för Python-CA: <code>certifi</code> 2026.10.19, <code>pip</code> 26.2.2"
      ],
      "metric": "paketråd under 24 timmar"
    },
    "node2shell": {
      "kicker": "EFTERORD · NODE.JS",
      "title": "På en officiell version fungerade det.",
      "lede": "Imperva körde kod i den vanliga Node.js 24.22.0-avbildningen med manipulerade Brotli-data — utan felsökare eller instrumenterat bygge.",
      "points": [
        "2 ingångar: <code>fetch()</code> läser ett opålitligt Brotli-svar, och Express 5 / body-parser 2 packar upp en begärans kropp. Enbart <code>http.createServer()</code> gör ingetdera",
        "1 bygge testades (24.22.0, Linux arm64); 22.x, 26.x och andra arkitekturer testades inte, och flera försök krävdes",
        "<b>24.22.1</b> avvisar samma byteföljd. Inget utnyttjande i verkliga angrepp rapporteras",
        "NVD-posten har CVSS 4.0 <b>9.2</b> och ingen 3.1-poäng, så den syns aldrig i en allvarlighetsfiltrerad CRITICAL-lista"
      ],
      "metric": "utnyttjat bygge : 24.22.1 avvisar det"
    },
    "prepatch": {
      "kicker": "EFTERORD · PHP2SHELL",
      "title": "Försöken började 4 dagar före säkerhetsrådet.",
      "lede": "AWS honeypot-telemetri innehåller ett exploateringsförsök daterat 2026-10-17, och fungerande PoC:er sågs 12 timmar före embargots slut. Publiceringsdagen var inte den första dagen.",
      "points": [
        "<b>482,342</b> begäranden / 122,311 sessioner / 21,998 webbplatser / 103 länder under de första 24 timmarna (Imperva)",
        "det är <b>försök</b>, inte intrång: Sophos såg att Mirai-installationen misslyckades och Dataminr rapporterar inga kända intrång",
        "fortfarande inte i KEV. EPSS 5.31% / 5.76%",
        "sök från <b>10-17</b>. Börjar man vid publiceringen försvinner de första 4 dagarna"
      ],
      "metric": "första försök → säkerhetsråd"
    },
    "filters": {
      "kicker": "EFTERORD · FILTRET",
      "title": "En 9.9 som listan inte kan visa.",
      "lede": "NVD:s allvarlighetsfilter räknar bara dess egen primära CVSS 3.x-poäng. En 9.9 från CNA ger 0 rader, även om posten innehåller poängen.",
      "points": [
        "<code>?cveId=CVE-2026-91637&amp;cvssV3Severity=CRITICAL</code> ger <b>0 rader</b>; posten har 9.9 märkt <code>Secondary</code>",
        "samma gäller utnyttjade <code>CVE-2026-111497</code> (endast CVSS 4.0, 9.2) och <code>CVE-2026-114625</code> (CNA 9.9)",
        "10 timmar: <b>104 → 98</b>. 6 rader bort, 0 till, inget rättat",
        "genomgången av alla allvarlighetsgrader och leverantörsflödena fångade båda. En filtrerad lista svarar inte på vad som utnyttjas"
      ],
      "metric": "svaret för CNA:s 9.9"
    },
    "wide": {
      "kicker": "EFTERORD · DEN BREDA GENOMGÅNGEN",
      "title": "4 incidenter som ingen CVE-lista nämnde.",
      "lede": "Denna genomgång samlade även nyheter och X. Där hittades 4 incidenter först; sedan kontrollerades leverantörernas egna sidor. Siffrorna kommer från leverantörerna.",
      "points": [
        "Arista VeloCloud Orchestrator <code>CVE-2026-114625</code>: ett utnyttjat nolldagarsfel med <b>9.9</b>; varje inloggad användare kan bli superanvändare. Lokal rättning 5.2.3.18 / 6.1.3.10 / 6.4.2.12",
        "Linux KSMBD: <code>ZDI-CAN-33774</code> kräver ingen autentisering, får 9.0 och saknar både CVE och rättning i huvudgrenen",
        "Capcom CAPCOM ID: <b>11,774,247</b> poster. Onamae Desktop Cloud stoppade upp till <b>26,739</b> servrar",
        "pressen ger uppslaget, leverantörssidan ger beläggen. Aristas primärsida hämtades 24 oktober; utnyttjande, autentiseringskrav och rättningar kontrollerades igen"
      ],
      "metric": "incidenter som ingen CVE-lista nämnde"
    },
    "php-next": {
      "kicker": "EFTERORD · PHP, 2 DAGAR SENARE",
      "title": "Ingen akut rättning denna gång.",
      "lede": "CVE-2026-115560, publicerad 10-23, är en annan RCE-väg. PHP anger inga berörda versioner, ingen poäng och ingen rättning, men lovar ett fullständigt råd vid nästa ordinarie utgåva.",
      "points": [
        "alla 4 villkor: ställ in <code>php_binary</code> / <code>php_serialize</code>, byt till <code>php</code> under körning med <code>ini_set</code>, före <code>session_start()</code>, med uppladdningsförlopp aktiverat",
        "applikationer som aldrig byter hanterare under körning kan behålla funktionen på — det anger PHP självt",
        "begränsningen är 1 rad: <b><code>session.upload_progress.enabled=0</code></b> — samma som 10-21; finns den redan på plats behövs inget mer",
        "ingen NVD-post vid kontrollen 23 oktober. PHP:s råd är oförändrat; de 17 senaste KEV-tilläggen innehåller inte 115560. Frånvaro bevisar inte säkerhet"
      ],
      "metric": "begränsningsåtgärden till nästa utgåva"
    },
    "update-scope": {
      "kicker": "UPPDATERING 10-24 · OMFATTNING",
      "title": "Bortom CVE-listan, igen.",
      "lede": "Genomgången 24 oktober granskar nya och ändrade poster, offentliggörandekanaler och inhemska produkter. 24 prioriterade grupper har nu villkor, åtgärder och källor.",
      "points": [
        "NVD, senaste 30 timmarna: <b>526 publicerade / 3,531 ändrade</b>. Mängderna överlappar; summera dem inte",
        "<b>82 GitHub-råd</b> i tidsfönstret, 6 kritiska. Även poster utan CVE räknas",
        "alla <b>17 KEV-tillägg</b> sedan 10 oktober, plus 14 forsknings-/officiella flöden och JVN",
        "24 är granskade produkt-/incidentgrupper, inte 24 nya bekräftade intrång"
      ],
      "metric": "granskade grupper"
    },
    "update-exploited": {
      "kicker": "UPPDATERING 10-24 · UTNYTTJANDE",
      "title": "Börja med de 2 som utnyttjas.",
      "lede": "Arista VCO och Nextcloud Built-in CODE lades till i KEV 23 oktober. Båda kräver forensisk bedömning.",
      "points": [
        "VCO: ett <b>giltigt konto med låg behörighet</b> kan höja privilegier. Lokala rättningar: 5.2.3.18 / 6.1.3.10 / 6.4.2.12",
        "Built-in CODE: <b>uppdatera till 26.4.303 eller ta bort det</b>. Att inaktivera appen räcker inte",
        "den sårbara proxy.php-vägen kräver att CODE-processen stoppas. Fristående Collabora berörs inte",
        "CISA:s federala tidsfrist: <b>26 oktober</b>. Bevara bevis och utred intrång samtidigt som rättningar installeras"
      ],
      "metric": "KEV-tillägg · 10.23"
    },
    "update-packages": {
      "kicker": "UPPDATERING 10-24 · PAKET",
      "title": "Bilder, Wasm, autentisering, proxyer.",
      "lede": "4 gränser, 4 uppsättningar villkor. En allvarlighetsetikett visar inte ensam om din driftsättning är exponerad.",
      "points": [
        "<b>Pillow 13.0.0</b>: FPX når bildbehandlingen när olefile är installerat, oavsett filändelse. PoC:n använder en fastlåst konfiguration",
        "<b>Wasmtime -115889</b>: 36.0.19 på 36-grenen; 43.0.0+ för grenarna 37–42. Kontrollera opålitlig Wasm som kompileras av Cranelift",
        "<b>Laravel 12.68.0 / 13.29.0</b>: TokenGuard kan kringgås med vissa MySQL/MariaDB-konfigurationer",
        "<b>Echo 4.16.1 / 5.4.1</b>: nekade WebSocket-uppgraderingar kan kringgå ruttkontroller men inte oberoende uppströmsauktorisering"
      ],
      "metric": "paketgränser"
    },
    "update-runtime": {
      "kicker": "UPPDATERING 10-24 · KÖRMILJÖER",
      "title": "Under appen, inuti paketet.",
      "lede": "CVE:er med GitLab i namnet kan beröra Ruby-användare, och en Brotli-uppdatering i operativsystemet ändrar inte Perls medföljande kopia.",
      "points": [
        "<b>Ruby 4.0.9 / 3.4.12 / 3.3.13</b>: berör applikationer som kompilerar reguljära uttryck styrda av angriparen",
        "<code>Regexp.timeout</code> och längdgränser räcker inte. 4.0.8 saknar hela rättningen",
        "<b>IO::Compress::Brotli 0.023</b>: det berörda intervallet börjar vid 0.004001. Enbart uppdatering av systemets Brotli rättar inte detta",
        "<b>NGINX 1.30.6 / 1.31.7</b>: 5 konfigurationsberoende problem; vissa kodkörningsvägar kräver också förbigång av ASLR"
      ],
      "metric": "kontroller av körmiljöer"
    },
    "update-agents": {
      "kicker": "UPPDATERING 10-24 · AGENTER",
      "title": "Vem kan använda agentens befogenheter?",
      "lede": "Autentisering, TLS, valvisolering och modellinläsning skyddar verktygen och hemligheterna som agenten når.",
      "points": [
        "<b>PraisonAI 4.6.59</b>: AgentOS-chatten saknade fortfarande autentisering efter det äldre rättningspåståendet för 4.5.128",
        "<b>req_llm 1.29.0</b>: TLS-verifiering för WebSocket saknades sedan 1.9.0. HTTP-vägar skiljer sig",
        "<b>obsidian-tc 1.3.1</b>: loopback behöver fortfarande Origin-/DNS-rebinding-kontroller och isolering av valv",
        "<b>AWS Multi Model Server har nått slutet av sin livscykel</b>: ingen rättad utgåva; migrera. Granska separat x402-utgiftsgränser och signeringens ursprung"
      ],
      "metric": "agentgränser"
    },
    "update-japan": {
      "kicker": "UPPDATERING 10-24 · JAPAN",
      "title": "Ta med inhemska verksamhetssystem.",
      "lede": "Granskningen omfattar även verksamhetsappar, LINE-integrationer och administrations-API:er.",
      "points": [
        "<b>Pleasanter 1.5.9.1</b>: vissa LDAP-installationer på Linux/Docker och andra berörda konfigurationer tillåter inloggning utan lösenord med ett giltigt id",
        "<b>LIFF SDK 2.31.1</b>: DOM XSS berör 2.20.0 till 2.31.0",
        "<b>JPCERT:s uppdatering 23 oktober</b>: fall E lägger till missbruk av AI-plattformar för penetrationstestning",
        "kontrollera auktorisering per API, tokenomfattning/giltighet, anropsgränser och exponerad administration. Enbart IP eller JA4 bevisar inte intrång"
      ],
      "metric": "inhemska kontroller"
    },
    "update-devices": {
      "kicker": "UPPDATERING 10-24 · ENHETER",
      "title": "Matcha enheter mot rätt utgåvegren.",
      "lede": "HPE:s officiella CSAF har 72 CVE:er, varav 8 med 10.0. Även industriprodukter och enheter kan sakna en rättad utgåva.",
      "points": [
        "<b>HPE AOS</b>: 10.8.1.2 / 10.7.2.7 / 10.4.1.14 / 8.13.3.1 / 8.10.0.24. Matcha varje CVE mot produktgrenen",
        "<b>Mitsubishi GENESIS / ICONICS med flera</b>: fasta challenge-svar, DCOM och libwebp. Följ produktspecifika rättningar eller begränsningsåtgärder",
        "<b>Lenovo AVB</b>: offentliga testnycklar i flera surfplattor; fysisk åtkomst krävs. Modeller vars stöd upphört får ingen rättning",
        "högsta allvarlighetsgrad är inte bekräftat utnyttjande. Överväg migrering när en produkt inte kan rättas"
      ],
      "metric": "CVE:er i HPE AOS"
    },
    "update-trust": {
      "kicker": "UPPDATERING 10-24 · TILLIT",
      "title": "Kontrollera vad som följer efter uppdateringen.",
      "lede": "Blockeringslistor, uppstartstillit och stulna inloggningsuppgifter kräver mer än att installera en rättning.",
      "points": [
        "<b>Firefox 158.0.1 / Android 158.0.2</b> och andra rättade grenar innehåller eMudhra-blockering. Thunderbird 153.5.1 rättar också e-postautentisering",
        "<b>BlackX</b> följer på administratörsåtkomst. OS-rättningar och återkallelser i Secure Boot DBX är separata kontroller",
        "<b>70,000+ i k0t-rapporten</b> räknar inloggningsuppgifter och relaterade data, inte företag. Utred nycklar och kvarstående åtkomst",
        "<b>jxrlib</b>: minnesfel i JPEG XR rapporterades utan kända CVE:er eller belägg för kodkörning. Kontrollera distributörernas rättningar"
      ],
      "metric": "tillitskontroller"
    },
    "oct25-priorities": {
      "kicker": "UPPDATERING 10-25 · 16:34 JST",
      "title": "Följ uppdateringen hela vägen.",
      "lede": "Granskningens bryttid: 25 oktober, 16:34 JST. Hämtat efteråt; ny information i översikten är inte nödvändigtvis en ny incident.",
      "points": [
        "Stöd säkerhetsarbete i öppen källkod genom <b>Patch the Planet</b>",
        "exponering som utnyttjas → akuta utgåvor → nycklar och behörigheter → medföljande kopior",
        "NVD med fast tidsfönster: <b>99</b> publicerade / <b>5,432</b> ändrade. Mängderna överlappar",
        "KEV står kvar på 23 oktober. Inga nya katalogposter bevisar inte säkerhet"
      ]
    },
    "oct25-fortinet": {
      "kicker": "UPPDATERING 10-25 · 16:34 JST",
      "title": "Vänta inte på CVE-listan.",
      "lede": "Fortinet uppmanar till prioriterade säkerhetsförstärkande uppdateringar av 5 produkter. Detaljerade PSIRT-råd planeras till 10 november.",
      "points": [
        "<b>FortiOS</b>: 8.0.2 / 7.6.8 / 7.4.13 / 7.2.14",
        "<b>Manager / Analyzer</b>: 8.0.2 / 7.6.8 / 7.4.12 / 7.2.13",
        "<b>Mail</b>: 8.0.2 / 7.6.7 / 7.4.9. <b>Authenticator</b>: 8.0.4 / 6.6.11",
        "matcha modell, gren och uppgraderingsväg. Begränsad exponering är tillfällig; detta meddelande bekräftar inte i sig utnyttjande"
      ]
    },
    "oct25-runtime-trust": {
      "kicker": "UPPDATERING 10-25 · 16:34 JST",
      "title": "Tillit finns även utanför webbläsaren.",
      "lede": "Java har ett akut säkerhetsråd från 24 oktober; Python ssl lägger till en spärrlista för komprometterade nycklar. Ordinarie uppdateringar bevisar inte att arbetet är klart.",
      "points": [
        "<b>Java CVE-2026-114820</b>: akut uppdatering eller officiella åtgärder för nyckellager/återkallelse; starta om varje körmiljö",
        "Oracles tabell anger <b>berörda</b> versioner, inte byggen att installera",
        "<b>Python CVE-2026-115557</b>: införd i huvudgrenen; bekräfta leverans i varje installerad distribution",
        "inventera OS-lager, certifi, medföljande JRE:er, containrar och egna tillitslager"
      ]
    },
    "oct25-dns": {
      "kicker": "UPPDATERING 10-25 · 16:34 JST",
      "title": "Skilj på DNS-produkterna.",
      "lede": "Rekursiva och auktoritativa servrar behöver också granskas. Liknande produktnamn innebär inte samma uppdateringsversioner.",
      "points": [
        "<b>BIND</b>: 9.20.30 / 9.21.27; kontrollera återuppspelning av GSS-TSIG och konfigurationsvillkor",
        "<b>Unbound</b>: 1.26.2 rättar 5 problem med DoQ, validering och belastning",
        "<b>PowerDNS Recursor</b>: 5.3.12 / 5.4.8. <b>Authoritative</b>: 4.9.18 / 5.0.8 / 5.1.5",
        "<b>Knot DNS</b>: 3.6.2; en annan produkt än Knot Resolver. Antalet CVE:er är inte antalet observerade angrepp"
      ]
    },
    "oct25-cloud-access": {
      "kicker": "UPPDATERING 10-25 · 16:34 JST",
      "title": "Behörigheter kan överleva återställningen.",
      "lede": "Primärkällor för ConnectWise och slutresultaten för LiteLLM ersätter tidigare osäkerhet. Leverantörens återställning tar inte bort kvarstående åtkomst hos kunden.",
      "points": [
        "<b>ConnectWise</b>: behåll anslutningar avstängda i väntan på formella instruktioner; 26 oktober är ett mål",
        "bevara bevis före radering. Granska tjänstidentiteters inloggningar, Graph-aktivitet, nya nycklar, ägare och behörigheter",
        "<b>LiteLLM</b>: ej återkallad huvudnyckel → GitHub OAuth-token → CI-hemligheter; ersätt tidiga spekulationer",
        "kör inte pip först på misstänkta värdar. Isolera, bygg om från ren miljö och återkalla åtkomliga inloggningsuppgifter"
      ]
    },
    "oct25-bundles": {
      "kicker": "UPPDATERING 10-25 · 16:34 JST",
      "title": "Kontrollera medföljande kopior och undantag.",
      "lede": "Komprimering, proxyer, sociala integrationer och industriklienter har olika kriterier för när arbetet är klart.",
      "points": [
        "<b>Brotli</b>: Bun 1.4.4, brotli 1.2.1 / brotlicffi 1.2.1.0; bygg om kompilerade Bun-program",
        "<b>Postiz</b>: 2.25.3; registrerade användare och integrationsvillkor spelar roll",
        "<b>ATS</b>: 9.2.16 / 10.1.5 / 10.2.1, men CVE-2026-111817 är <b>inte rättad i 9.2.16</b>",
        "<b>open62541</b>: 1.5.7; även klienter som importerar fjärrdefinitioner av OPC UA-typer behöver granskas"
      ]
    },
    "http2shell": {
      "kicker": "UPPFÖLJNING AV INLÄGG · CVE-2026-111497",
      "title": "HTTP2Shell. Kontrollera den medföljande avkodaren.",
      "lede": "Det efterfrågade inlägget har kontrollerats mot primärkällor. Det gäller samma Brotli-CVE utanför Node.js, inte en ny HTTP/2-specifik sårbarhet.",
      "points": [
        "Google CNA: <b>CVSS v4.0 9.2</b>; samma CVE som Node2Shell. Allvarlighetsgrad bekräftar inte verkligt utnyttjande",
        "<b>Envoy</b>: 1.40.0 / 1.39.3 / 1.38.6 / 1.37.8, när Brotli-uppackning är konfigurerad",
        "<b>Istio</b>: 1.31.2 / 1.30.6 / 1.29.9; 1.29 har nått slutet av sin livscykel. Kontrollera gateways och sidocontainrar",
        "<b>curl, requests, httpx</b>: granska inläst avkodare och automatisk svarshantering. Det räcker inte att ändra Accept-Encoding"
      ],
      "metric": "Google CNA · CVSS v4.0"
    },
    "tailworm-overview": {
      "kicker": "TAILWORM · SPECIALRAPPORT",
      "title": "Tailworm. Granska den inre gränsen igen.",
      "lede": "En rapport om Tailscale och headscale: vilka parter som får ansluta och vilka privilegier en tillåten session får.",
      "points": [
        "Testade: <b>Tailscale 1.104.2 / headscale 0.29.5</b>. Dessa är inte bekräftat rättade versioner",
        "forskarens <b>11 rubriker</b> omfattar konfigurationsiakttagelser; inte 11 CVE:er eller bekräftade intrång",
        "Tailscale utreder och rättar problem; <b>ingen generell rekommendation att stänga av SSH</b>",
        "börja med <b>värdar med Tailscale SSH aktiverat och åtkomstregler</b>; skilj på vanlig OpenSSH"
      ]
    },
    "tailworm-ssh": {
      "kicker": "TAILWORM · SPECIALRAPPORT",
      "title": "Tillåten anslutning. Större privilegier än avsett.",
      "lede": "Forskaren rapporterar Unix-socketvidarebefordran som root och kapplöpningar i sökvägar; leverantören utreder privilegiehantering efter auktorisering.",
      "points": [
        "kräver <b>SSH-åtkomst och motsvarande rätt att vidarebefordra</b>; inte anonym åtkomst till varje nod",
        "privilegierade socketar kan leda till Docker eller administrations-API:er; eskalering rapporteras i laboratoriet",
        "<b>begränsa källor och mål</b> och ta bort onödig vidarebefordran",
        "<b>check mode lägger till autentisering vid ingången</b>; det rättar inte eskalering inom en tillåten session"
      ]
    },
    "tailworm-headscale": {
      "kicker": "TAILWORM · SPECIALRAPPORT",
      "title": "Headscale behöver egna åtgärder.",
      "lede": "Skilj på ett eget kontrollplan och Tailscale SaaS. Rapporten beskriver resursuttömning och cacheutträngning via registreringsvägen.",
      "points": [
        "Testad: <b>headscale 0.29.5</b>; vissa registreringsvägar för DoS uppges inte kräva konto",
        "forskaren rapporterar att <b>vidarebefordran inte kan nekas</b> där; ompröva SSH-behörigheter separat från SaaS",
        "granska exponering, anropsgränser, minnesgränser och omstartsövervakning; <b>begränsning är ingen rättning</b>",
        "DERP-klientens uttömning kräver separat att <b>klienten styrs till en fientlig relänod</b>"
      ]
    },
    "tailworm-connector": {
      "kicker": "TAILWORM · SPECIALRAPPORT",
      "title": "Behörighet till 1 app. Andra destinationer.",
      "lede": "Den experimentella conn25-vägen uppges låta en behörig klient välja destinationer genom sin anslutningsnod.",
      "points": [
        "kräver <b>conn25 och dess klient-capability</b>; gäller inte varje app-connector-installation",
        "granska verkliga destinationer: anslutningsnodens LAN, molnmetadata och klustertjänster",
        "ta bort onödig behörighet och <b>begränsa utgående destinationer</b>, inklusive IPv4 och IPv6",
        "kontrollera Kubernetes-regler mot <b>CNI, värdnätverk och vidarebefordringsvägar</b>"
      ]
    },
    "tailworm-serve": {
      "kicker": "TAILWORM · SPECIALRAPPORT",
      "title": "Granska vad Serve exponerar.",
      "lede": "Granska separat TCP-vidarebefordran till Unix-socketar, bindning till externa gränssnitt och HTTP/2-auktorisering över monteringspunkter.",
      "points": [
        "hitta <b>TCP-vidarebefordran till privilegierade Unix-socketar</b>; operatörens konfiguration är en förutsättning",
        "<b>TS_SERVE_ALLOW_ALL_INTERFACES</b> är en konfigurationsnotering, inte standard för varje Serve",
        "granska huvudbaserad backend-auktorisering och monteringspunkter; skilj på iakttagelser om Funnels hotmodell",
        "IP-brandväggar <b>granskar inte lokala Unix-socketoperationer</b>; ta bort onödig exponering"
      ]
    },
    "tailworm-response": {
      "kicker": "TAILWORM · SPECIALRAPPORT",
      "title": "Inventera. Begränsa. Följ rättningen.",
      "lede": "Spridning i laboratorium bevisar inte ett maskutbrott. Granskade källor fastställer inte verkligt Tailworm-utnyttjande.",
      "points": [
        "inventera SSH, headscale, conn25 och Serve; <b>minska behörigheter utifrån funktionernas förutsättningar</b>",
        "<b>bekräftade rättningar och särskilda CVE:er/CVSS återstår att fastställa</b>; 1.104.2 rättar ett separat certifikatproblem",
        "vid misstänkt intrång: bevara bevis, isolera, <b>återkalla enhetens identitet</b> och byt exponerade nycklar",
        "ominstallation återkallar inte i sig en kopierad identitet; följ fortsatt officiella meddelanden"
      ]
    },
    "night-delta": {
      "kicker": "KVÄLLSUPPDATERING · 23:18 JST",
      "title": "Bred granskning. Villkor före antal.",
      "lede": "Ett fast fönster 16:34–23:18 JST kompletterar den tidigare granskningen. Databasändringar är inte antal intrång.",
      "points": [
        "<b>NVD: 87 publicerade / 87 ändrade</b>; samma 87 id:n i båda mängderna, alla allvarlighetsgrader",
        "<b>16 GitHub-råd</b>, ogranskade; tomma paketmetadata betyder inte opåverkad",
        "<b>KEV: 23 oktober, 1,756 poster</b>; ingen ny listning bevisar inte frånvaro av angrepp",
        "följ Firecrawl, Dokploy och rotki till primärkällorna; <b>hitta inte på en rättad version</b>"
      ]
    },
    "night-restoration": {
      "kicker": "KVÄLLSUPPDATERING · 23:18 JST",
      "title": "Ett återställningsmål är inte tillstånd att återansluta.",
      "lede": "ConnectWise uppdaterade 23:00 JST. Stegvis anslutning till Cloud Backup har fortfarande 26 oktober som mål.",
      "points": [
        "<b>först åtkomst för återställning av befintliga säkerhetskopior</b>, sedan instruktioner för nyregistrering",
        "<b>behåll anslutningarna avstängda tills individuella instruktioner ges</b>; återställd infrastruktur är inte en helt återställd tjänst",
        "försäkran om lagrade säkerhetskopior och utredning av aktiv M365-åtkomst är separata frågor",
        "fortsätt arbetet med PHP, GitLab, Brotli, utnyttjade KEV-poster och Fortinet; <b>använd den rollbaserade rapporten</b>"
      ]
    },
    "morning-cutoff": {
      "kicker": "MORGONUPPDATERING · 2026-10-26",
      "title": "10:27. Vad har ändrats?",
      "lede": "En daterad genomgång från PHP och framåt, plus nattens ändringar. En databaspost är ingen incident.",
      "points": [
        "NVD: <b>28 publicerade / 4,276 ändrade</b>; den första mängden ingår i den andra",
        "<b>93 GHSA:er</b>, alla ogranskade; många följer tidigare NVD-poster",
        "Unit 42 <b>drog tillbaka kopplingen till PHP2Shell som första intrångsväg</b> i en myndighetsincident. AWS observationer av försök är separata"
      ]
    },
    "morning-dotnet": {
      "kicker": "MORGONUPPDATERING · 2026-10-26",
      "title": "Uppdaterat. Rättningen saknades.",
      "lede": "Windows .NET CVE-2026-70197: Microsoft säger att uppdateringarna 13 oktober saknade denna rättning. En extra uppdatering tillhandahåller den.",
      "points": [
        "publicerad <b>03:50 JST, 26 oktober</b>; kräver återanvändning mellan IPv4-/IPv6-datagramsocketar",
        "kontrollera motsvarande rättade gren: <b>8.0.33 / 9.0.22 / 10.0.14</b> eller dokumenterad förhandsversion",
        "<b>bygg om och distribuera fristående appar på nytt</b>; kontrollera den körande körmiljön"
      ]
    },
    "morning-ot": {
      "kicker": "MORGONUPPDATERING · 2026-10-26",
      "title": "PHP finns också i apparater.",
      "lede": "Morgonens JVN-uppdatering omfattar PHP2Shell i PAN-OS på RUGGEDCOM. Det betyder inte att alla Siemens-produkter berörs.",
      "points": [
        "JVN-flödet uppdaterades <b>09:00 JST</b>; Siemens säkerhetsråd har ett eget publiceringsdatum",
        "PAN-OS: <b>vissa utgåvegrenar har nu rättningar</b>; andra tidsplaner är separata",
        "Starman och Plack behöver också kontroller vid <b>HTTP-behandlingens gräns</b>"
      ]
    },
    "morning-dates": {
      "kicker": "MORGONUPPDATERING · 2026-10-26",
      "title": "Läs efter datum. Återgå till dagens åtgärder.",
      "lede": "10 fristående sidor, 17–26 oktober. Observation, publicering, rättningar och senare upptäckter märks separat.",
      "points": [
        "<a href=\"./timeline.html\">Daglig dokumentation (japanska) →</a> / <a href=\"./update-20261026.html\">Granskning 10:27 (japanska) →</a>",
        "fortsätt rätta publika tjänster, utreda exponering och återkalla inloggningsuppgifter",
        "en lägsta rättad Tailworm-version och slutförd ConnectWise-återställning är <b>inte bekräftade här</b>; ett mål är inte ett slutförande"
      ]
    },
    "closing": {
      "kicker": "VAD DET BETYDER",
      "title": "Risken ligger inte i koden du skriver.",
      "lede": "Det som brast i oktober var tillitslagret som avgör vilken kod som körs. Kontrollerna som hjälper är vardagliga och gäller främst konfiguration.",
      "points": [
        "oföränderliga utgåvor och signaturverifiering vid installation",
        "lås versioner med hashvärden; inget `latest`; läs skillnaden mot git-taggen",
        "inga långlivade administratörsuppgifter i klartext; håll administrationsplanet privat",
        "utgå från att en leverantörs databas innehåller dina nycklar (TeamUpdraft / Railway / Zeabur)",
        "kärnan är gränsen som inte kan rättas per app: kod i en container är ett steg mot root på värden"
      ]
    },
    "afternoon-deployment": {
      "kicker": "UPPDATERING 14:56 · DRIFTSÄTTNINGSVÄGAR",
      "title": "Du uppdaterade. Ändrades den körande binärfilen?",
      "lede": "Säkerhetsrådet för .NET Brotli skiljer mellan delad körmiljö, fristående och NativeAOT-driftsättningar. Diagrammet visar driftsättningsvägar schematiskt.",
      "points": [
        "Brotli-uppackning i ASP.NET Core /HttpClient är <b>av som standard</b>; kontrollera uttrycklig aktivering och direkt API-indata",
        "kontrollera 8.0.33 / 9.0.22 / 10.0.14. Driftsätt fristående appar igen; <b>uppdatera SDK/paket och publicera NativeAOT på nytt</b>",
        "detta kompletterar ett råd publicerat 04:06 JST. Det är inget nytt intrång under eftermiddagen"
      ],
      "metric": "driftsättningsvägar · schema"
    },
    "afternoon-release": {
      "kicker": "UPPDATERING 14:56 · UTGÅVA ÄR INTE ÅTERSTÄLLNING",
      "title": "Släppt. Rullas ut. Planerat.",
      "lede": "En publicerad rättning, stegvis enhetsutrullning och ett återställningsmål är olika tillstånd. Schemat förklarar skillnaden; kontrollera faktiskt bygge och individuella instruktioner.",
      "points": [
        "PAN-OS: status för 4 snabbfixar i 11.1 uppdaterad; CNA JSON anger <b>14:45 JST</b>, och en avvikande tid i CSAF-historiken är dokumenterad",
        "Neat OS26.5.4 är en <b>stegvis utrullning</b>; kalenderdatumet bevisar inte att alla enheter är rättade",
        "ConnectWise planerar nästa meddelande till <b>23:00 JST</b>. Ett mål ger inte tillstånd att återansluta",
        "<a href=\"./update-20261026-1456.html\">Granskning 14:56, åtgärder och primärkällor (japanska) →</a>"
      ]
    },
    "night-account-controls": {
      "kicker": "UPPDATERING 21:35 · KONTOKONTROLLER",
      "title": "Byt inloggningsuppgifter. Granska kvarvarande anslutningar.",
      "lede": "GMO:s meddelande 21:00 utökar skyddskontrollerna från valutahandel till värdepappers-, e-post- och Google-konton. Detta visar kontrollerna schematiskt, inte direkttillståndet.",
      "points": [
        "använd en separat betrodd enhet för att byta lösenord, <b>logga ut alla enheter</b> och kontrollera MFA",
        "granska anslutna appar, e-postvidarebefordran, tillägg och enheter. Behåll webbläsarsynkronisering pausad tills kontrollen är klar",
        "förebyggande råd fastställer inte att varje kunds enhet är infekterad",
        "<a href=\"./update-20261026-2135.html#gmo-sixth\">Officiella råd och villkor (japanska) →</a>"
      ]
    },
    "night-package-response": {
      "kicker": "UPPDATERING 21:35 · PAKETÅTGÄRDER",
      "title": "En skadlig utgåva kräver kontroll av körmiljön.",
      "lede": "Nya skadlig-kod-poster för npm och PyPI beskriver körning vid installation eller import. Åtgärdsschemat är skilt från antalet utnyttjade sårbarheter.",
      "points": [
        "matcha <b>paketnamn och berörda versioner</b>: @worca/app RC-versioner, npm-brytning/persistens och PyPI:s netweavex-laddare",
        "om en berörd utgåva kördes: isolera miljön och återkalla åtkomliga inloggningsuppgifter från en säker enhet; bedöm ominstallation enligt säkerhetsrådet",
        "2 separata PROBABLY_PENTEST-klassningar fastställer inte samma observerade skada",
        "<a href=\"./update-20261026-2135.html#npm-worca\">Paketvillkor och åtgärder (japanska) →</a>"
      ]
    },
    "night-restore-status": {"kicker": "UPPDATERING 00:18 · ÅTERSTÄLLNING OCH ÅTERUPPTAGEN DRIFT", "title": "Förberedelser, en hotfrist och en återupptagen varningskanal.", "lede": "ConnectWises inlägg klockan 14:00 UTC beskriver fortsatta förberedelser för anslutning. GMO:s tid 12:00 är angriparens tidsfrist. SoftBank återupptog katastrofvarningar klockan 23:17 JST. Endast en schematisk bild.", "points": ["ConnectWise: detta är inget besked om att partner har börjat återställa. <b>Behåll anslutningarna avstängda</b> tills tjänstespecifika instruktioner ges", "GMO: företaget kommer inte att betala. Fortsätt med kontokontrollerna i det sjätte meddelandet. Rättelsen klockan 00:20 kom efter bryttiden", "SoftBanks återupptagande gäller denna operatörskanal, inte att hela PHP-ekosystemet är färdigåtgärdat", "<a href=\"./update-20261027-0018.html#connectwise-1400\">Läsrapport för 00:18 (på japanska) →</a>"]},
    "brotli-reach": {"kicker": "UPPDATERING 00:18 · VÄGAR TILL BROTLI", "title": "Namnet säger HTTP/2. Felet finns i avkodaren.", "lede": "HTTP2Shell, Node2Shell och Brotli2Shell är CVE-2026-111497. Vägarna skiljer sig mellan HTTP-svar, .NET-API:er, JPEG XL, ClickHouse och Parquet. Endast en schematisk bild.", "points": ["Uppdatera .NET-körmiljöerna; <b>publicera NativeAOT på nytt</b>. Brotli-dekomprimering i ASP.NET / HttpClient är avstängd som standard", "Ingen RCE hade demonstrerats för FFmpeg/libjxl, ClickHouse eller Arrow; behandla ej utgivna rättningar som ej åtgärdade", "Cloudflares akuta WAF använder fortfarande Log som standard. Bandits HTTP/2-kluster är separat", "<a href=\"./update-20261027-0018.html#brotli-jfrog-reach\">Nåbarhet och åtgärder (på japanska) →</a>"]},
    "morning-consul-identity": {"kicker": "UPPDATERING 07:47 · TJÄNSTEIDENTITET", "title": "En saknad API-kontroll kan röja ett certifikat och dess privata nyckel.", "lede": "CVE-2026-105765 kringgår behörighetskontroll för cachade slutcertifikatsvar i Consul-agentens HTTP API. Schemat visar villkor och åtgärder, inte observerat utnyttjande.", "points": ["Berörda versioner: <b>1.17.0–2.0.4</b> med ACL aktiverat. HTTP API lyssnar som standard på loopback; API:t måste vara nåbart och målcertifikatet och dess privata nyckel redan cachade", "Kontrollera rätt utgivningsgren: Community <b>2.1.0</b>; Enterprise <b>2.1.0 / 1.21.19</b>", "Begränsa API:ts nåbarhet. Uppdatering och utredning av potentiellt röjda tjänsteidentiteter är separata uppgifter", "<a href=\"./update-20261027-0747.html#consul-leaf\">Villkor och primärkällor (på japanska) →</a>"]},
    "morning-sandbox-auth": {"kicker": "UPPDATERING 07:47 · AUTENTISERING I SANDBOX", "title": "Även en sandbox behöver autentisering på sitt publika API.", "lede": "OpenHands SDK CVE-2026-112346 berör versioner före 1.52.0. En launcher bunden till 0.0.0.0 med tomma session_api_keys kan tillåta kommandon utan autentisering genom en nåbar publicerad port.", "points": ["Root-körning sker <b>inne i sandboxen</b>; monterade arbetsytor och tillförda hemligheter kan också exponeras", "Verifiera rättningen i <b>1.52.0</b> eller senare och granska publicerade portar och autentiseringsinställningar", "För tidigare nåbara miljöer: granska loggar och återkalla samt utfärda röjda hemligheter på nytt som en separat åtgärd", "<a href=\"./update-20261027-0747.html#openhands-sdk\">Villkor och primärkällor (på japanska) →</a>"]},
    "evening-disclosure": {"kicker": "18:47 UPDATE · EVIDENCE STATES", "title": "Publicering bekräftad. Innehållet granskas fortfarande.", "lede": "GMO bekräftade publicering av påstådda företags- och kunduppgifter kl12:30. Innehållet granskas; ransomware var obekräftat kl13:55. Detta är ett schema över bevisläget.", "points": ["Ingen skadlig kod i färdiganalyserade enheter <b>friskförklarar inte alla enheter</b>", "Följ officiella isoleringsanvisningar och skydda konton från en separat betrodd enhet", "Öppna eller sprid inte påstådda uppgifter och länkar; se upp för opportunistisk nätfiske", "<a href=\"./update-20261027-1847.html#gmo-publication\">Villkor, åtgärder och primärkällor (japanska) →</a>"]},
    "evening-release": {"kicker": "18:47 UPDATE · RELEASE GATES", "title": "Planerade versioner och levererade rättningar är olika lägen.", "lede": "PAN-OS-rättningar för PHP är versionsgrensspecifika. Den sparade KEV-katalogen ändrades också för CVE-2026-109618 / CVE-2026-109619. Schemat skiljer utgivning, driftsättning och utredning.", "points": ["<b>10.2.13-h27 / 10.2.16-h12</b>: utgivning bekräftad kl09:10 JST", "<b>12.1.7-h11 / 12.2.4-h1</b>: utgivning bekräftad kl13:03 JST; kontrollera övriga grenars planer separat", "En utgiven rättning, installation på enheten och utredning av tidigare intrång är skilda uppgifter", "<a href=\"./update-20261027-1847.html#pan-hotfix\">Villkor, åtgärder och primärkällor (japanska) →</a>"]},
    "evening-threshold": {"kicker": "18:47 UPDATE · MPC BOUNDARY", "title": "En parts andel är inte hela den privata nyckeln.", "lede": "Fireblocks mpc-lib CVE-2026-90975 kan avslöja samma parts överordnade andel från en underordnad andel och chain code. Tröskellagret kvarstår. Detta är ett villkorsschema.", "points": ["Betrakta inte BIP32 hardened derivation som <b>fullständig isolering av andelshierarkin</b>", "Skydda chain code som en hemlighet; distribuera den inte genom watch-only-information", "CERT anger att leverantörsrättning saknas. Utred samma parts hierarki efter att en lövandel komprometterats", "<a href=\"./update-20261027-1847.html#fireblocks-share-boundary\">Villkor, åtgärder och primärkällor (japanska) →</a>"]},
    "evening-package": {"kicker": "18:47 UPDATE · PACKAGE RESPONSE", "title": "Kontrollera körmiljön innan saneringen avslutas.", "lede": "Specifika npm- och PyPI-versioner har rapporterats som skadliga. Schemat visar inventering, isolering och återkallande av hemligheter, inte observerad offertelemetri.", "points": ["npm <b>@camera.ui/camera-ui-nvr-windows-amd64 1.6.1</b>: GHSA-2w7v-jwxh-w7wc", "PyPI <b>h13t0ry-hello-demo 0.1.0</b>: GHSA-5crq-52j9-fc74; reverse shell vid import rapporteras", "Kontrollera lockfiler, CI och körhistorik. Isolera berörda miljöer; återkalla och utfärda hemligheter från en separat säker enhet", "<a href=\"./update-20261027-1847.html#malware-camera-ui\">Villkor, åtgärder och primärkällor (japanska) →</a>"]}
  }
});
