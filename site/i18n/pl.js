/* Stored translations; missing scenes filled by Google Cloud Translation. */
window.registerLocale("pl",{
  "ui": {
    "chapter": "BRIEFING",
    "sound": "dźwięk",
    "on": "ON",
    "off": "OFF",
    "sources": "źródło",
    "close": "zamknąć",
    "tap": "Następny",
    "replay": "Od początku",
    "hint": "Dotknij / Kliknij / Spacja",
    "hintEnd": "To już ostatnia opcja. Kliknij, aby wrócić do początku.",
    "coverKicker": "INCIDENT BRIEFING · 2026-10",
    "coverTitleA": "Za miesiąc,",
    "coverTitleB": "15 elementów.",
    "coverSub": "Poniżej przedstawiono wystąpienia 15 , które nakładały się na siebie w miesiącu 10 w 2026 , przedstawione w kolejności chronologicznej.<br>Oprócz jądra Apache i dodatków do 10 - 23 , dostępne są szeroko zakrojone badania 10 - 24 , dodatki do 10 - 25 , funkcja specjalna na ekranie Tailworm 6 oraz poranny ekran 10 - 26 4 . Wszystkie ekrany 65 są ułożone chronologicznie. Dodano nocną weryfikację konta i status odzyskiwania/przybycie Brotli dla 00:18 . Dodano środki zaradcze dla 07:47 w trybie konsularnym/sandbox oraz środki zaradcze dla 18:47 w trybie weryfikacji/wysyłki/MPC/paczek. Aby zapoznać się z badaniem rozległego obszaru, przejdź do raportu. Dotknij, aby kontynuować. Odtworzy się dźwięk.",
    "coverStart": "TAP TO BEGIN",
    "coverFoot": "Dołączone źródła. ConnectWise został pierwotnie zweryfikowany w ramach śledztwa 10/25 . Starsze sceny oparte są na zapisach z tamtego okresu.",
    "drawerTitle": "Źródła",
    "drawerFoot": "Najnowszy raport jest oparty na standardach 10/27 07:47 . Ekran wyświetla rekordy dla każdej daty, z suplementami wymienionymi w kolejności daty ich zatwierdzenia. Faktyczne pozyskiwanie danych następuje po ustanowieniu standardu.",
    "asof": "2026 - 10 - 27 07:47 Standard JST",
    "lang": "JA"
  },
  "scenes": {
    "intro": {
      "kicker": "INCIDENT BRIEFING · 2026-10",
      "title": "Chronologia wydarzeń z miesiąca 10 .",
      "lede": "W tym miesiącu pozornie niepowiązane ze sobą incydenty zbiegły się w jednym punkcie, wskazując na ten sam rodzaj słabości. Stuknij, aby przejść do kolejnego etapu chronologicznie.",
      "points": [
        "Wstępne dochodzenie (liczba przypadków 15 ), a następnie obserwacja na szerszym obszarze. Liczba przypadków nie odzwierciedla całkowitej liczby ofiar na całym świecie.",
        "<a href=\"./update-20261027-0747.html\">10 / 27 07:47 Najnowsze badanie →</a> · <a href=\"./timeline.html\">Przeczytaj według daty →</a>",
        "Dźwięk będzie odtwarzany. Możesz go wyłączyć przyciskiem DŹWIĘK w prawym górnym rogu."
      ],
      "metric": "incidents · 1 month"
    },
    "php-silence": {
      "kicker": "PHP CORE · COORDINATED DISCLOSURE",
      "title": "Przez 70 dni panowała cisza.",
      "lede": "Od odkrycia do publikacji minęło 70 dni. Niebezpieczny okres nie dotyczył 24 godzin po publikacji, ale okresu bezpośrednio poprzedzającego publikację.",
      "points": [
        "08 - 01 Kalifornia odkrywa wiele ścieżek RCE / 08 - 11 Raporty do PHP",
        "Wyciekły szczegóły dotyczące 10 - 20 , watchTowr potwierdza RCE",
        "10-21 <b>07:43 UTC</b> Cloudflare odnotowało próby ataków jeszcze przed udostępnieniem poprawki.",
        "10 - 21 14:00 Wersja poprawiona — 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35"
      ],
      "metric": "days from report to public"
    },
    "zeabur": {
      "kicker": "ZEABUR · INFRASTRUCTURE",
      "title": "Klucz administratora w postaci zwykłego tekstu otworzył region 9 .",
      "lede": "To jest czas 2 , następujący po miesiącu 8 . Rotacja nie obejmowała „klucza użytego tym razem”.",
      "points": [
        "10 - 14 01:36 Wewnętrzne włamanie do klucza AWS / 01:51 Tajny klucz systemowy",
        "Rozszerzono z 12:39 do zmiennych środowiskowych dla wszystkich usług.<b>865</b> Wykonywanie poleceń w usłudze DB",
        "Przyczyną było użycie zwykłego tekstu, nieokreślonych danych uwierzytelniających administratora i publicznie dostępnego ekranu administracyjnego.",
        "Użytkownicy muszą dokonać rotacji wszystkich zmiennych środowiskowych (nawet jeśli zostało to wykonane w 8 miesiącu, należy to zrobić ponownie)."
      ],
      "metric": "database services touched"
    },
    "rankmath": {
      "kicker": "RANK MATH SEO PRO · PLUGIN CHANNEL",
      "title": "Oficjalna dystrybucja była zanieczyszczona przez 11 godzin.",
      "lede": "Ścieżka aktualizacji wtyczki staje się bezpośrednio ścieżką ataku. Wynik CVSS wynosi 9.8 .",
      "points": [
        "10 - 15 20:02 → 10 - 16 07:12 pobrano w UTC <b>3.0.123</b>",
        "<b>CVE-2026-111862</b> / CVSS 9.8 / Poprawka to 3.0.124",
        "Aktualizacja nie jest rozwiązaniem — poszukaj kont administratorów, dodatkowych plików i zaplanowanych zadań.",
        "Wordfence rozsyła reguły zapory awaryjnej z wyprzedzeniem."
      ],
      "metric": "CVSS · CVE-2026-111862"
    },
    "teamupdraft": {
      "kicker": "TEAMUPDRAFT · CONNECTION KEYS",
      "title": "Klucz w bazie danych stanowił punkt wejścia do tysięcy stron internetowych.",
      "lede": "Klucz połączenia można wykorzystać jako „podpisane, legalne polecenie”. W związku z tym istniejące poprawki nie zatrzymają tego działania.",
      "points": [
        "Odczyt bazy danych klientów: dane kontaktowe, zaszyfrowane hasło, ustawienia 2 FA,<b>Połączenie 3</b>",
        "Złośliwe wtyczki są wdrażane przy użyciu kluczy UpdraftCentral / UpdraftVault / UpdraftClone.",
        "Ponieważ podpis jest autentyczny, został zaakceptowany, mimo że zastosowano CVE-2026-10795 .",
        "UpdraftPlus 1.26.13 / 2.26.13 automatycznie rozłączy poprzednie połączenia z 10 - 18 22:00 BST"
      ],
      "metric": "key types abused"
    },
    "emudhra": {
      "kicker": "EMUDHRA · CERTIFICATE AUTHORITY",
      "title": "Klucze nie zostały skradzione. Byłem za słaby.",
      "lede": "Klucz prywatny dla P-__ 384 był małą liczbą całkowitą. Odgadnięte bity to „ 4 , 56 , 66 , 115 , 155 , 156 , 230 , 237 ”. Istnieją tylko bity od 3 do 8 .",
      "points": [
        "pośredni CA <b>8 książkę</b>(TLS 6 + podpisywanie kodu 2 ). Generowanie klucza dla 2025 - 04 - 30 <b>24 książkę</b>Podczas tworzenia urzędu certyfikacji niższego poziomu błąd w procedurze wrap/unwrap spowodował utworzenie „zestawu słabych kluczy 2 ”.",
        "10 - 17 18:05 Raport UTC → 19:45 Chrome blokuje przez SPKI → 22:59 Firefox na wszystkich urządzeniach. **Apple blokuje 6 certyfikaty TLS, Microsoft blokuje 2 certyfikaty podpisu kodu****",
        "Przeglądarka właśnie zakończyła swoją część. Pozostaje ścieżka Dockera, Kubernetesa, IoT i pakietów Pythona – Go jest <b>CVE-2026-111943</b> Odrzucono jako 1.27.3 / 1.26.10",
        "Najnowszy ostry to <b>Klient VPN</b>(Talos / Ars). „Większe porządki niż Heartbleed” – mówi kryptograf Go."
      ],
      "metric": "one private key, literally"
    },
    "ovh": {
      "kicker": "OVHCLOUD CLI · RELEASE ASSETS",
      "title": "Przez 94 minut oficjalny plik binarny był czymś zupełnie innym.",
      "lede": "Kod źródłowy i kompilacja są w porządku. Problem wynikał z założenia, że „zasobów wydania nie da się zastąpić”.",
      "points": [
        "Zasoby są zastępowane w 10 - 19 14:47 ~ 16:21 (UTC+ 2 ).",
        "Zakres jest <b>v0.11.0〜v0.15.0</b>Wpływ ten ogranicza się wyłącznie do przejęć dokonanych w tym okresie.",
        "Przyczyna: Repozytorium nie gwarantowało niezmienności wersji.",
        "Rozwiązaniem jest pojedyncze ustawienie: wydanie niezmienne + weryfikacja podpisu."
      ],
      "metric": "minutes of exposure"
    },
    "oracle": {
      "kicker": "ORACLE · JAVA SE CRITICAL PATCH UPDATE",
      "title": "55 elementów. Maksymalnie 7.5 . Problemem jest wersja.",
      "lede": "„Wersja problematyczna” i „wersja poprawiona” znajdują się w osobnych kolumnach. 21.0.12.1 to wersja problematyczna, a 21.0.13 to wersja poprawiona.",
      "points": [
        "55 elementów / Zdalny dostęp bez uwierzytelniania 49 elementów / Maksymalna liczba CVSS 7.5 / KEV 0 elementów",
        "Wpływ: 8 u 503 , 11.0.32.1 , 17.0.20.1 , 21.0.12.1 , 25.0.4.1 , 26.0.2 , 27",
        "Poprawka ( 10 - 20 ): <b>8u511 / 11.0.33 / 17.0.21 / 21.0.13 / 25.0.5 / 27.0.1</b>",
        "Nie wprowadzono żadnych zmian w JDK 26 ( 26.0.3 nie istnieje) → Zmieniono na 27"
      ],
      "metric": "CVEs · 49 remote, no auth"
    },
    "plex": {
      "kicker": "PLEX MEDIA SERVER · KEV",
      "title": "SSRF z 4.3 służy jako punkt wejścia do wykonania kodu.",
      "lede": "Poszczególne wyniki są uśrednione. CISA KEV wyraźnie stwierdza, że te 4 przypadki będą się kumulować.",
      "points": [
        "Dodatek KEV 10 - 20 / Data ważności <b>10-23</b>( 96656 i 96654 )",
        "Łańcuch: Dowolny token X-Plex → SSRF → Wywołanie wtyczki → Zapis administracyjny → Wykonanie .so przy uruchomieniu",
        "96651 jest poza KEV, <b>PlexOnlineToken</b> Czytanie = Przejęcie kontroli nad kontem",
        "Korekta <b>1.43.3.10861</b>Najnowsze jest <b>1.43.5.11029</b>(Od 2026 - 10 - 23 10:36 JST). Pakiety NAS będą opóźnione."
      ],
      "metric": "CVEs in KEV · due 10-23"
    },
    "apache": {
      "kicker": "ADDENDUM · APACHE TOMCAT / HTTPD / TRAFFIC SERVER",
      "title": "„Ważnym” problemem okazały się zakłócenia komunikacji między użytkownikami.",
      "lede": "Elementy 3 w Tomcat mają inny mechanizm, ale wynik jest taki sam. „Niski” poziom błędu w httpd to 7.5 . Poziom ważności nie jest reprezentowany przez wartości 1 .",
      "points": [
        "Tomcat: ominięcie uwierzytelniania (JNDIRealm non-GSSAPI SASL) + zakłócanie odpowiedzi HTTP/ 2 /AJP — <b>11.0.27 / 10.1.61 / 9.0.123</b>",
        "httpd <b>2.4.69</b>: mod_rewrite UAF i mod_proxy_html poza zakresem zapisu. Apache jest ustawiony na niski, NVD jest ustawiony na 7.5",
        "Serwer ruchu: Żądanie przemytu 2 ( 8.9 / 8.7 )",
        "KEV ma 0 elementów. Jednak „nieopublikowany” nie oznacza, że jest bezpieczny."
      ],
      "metric": "Tomcat · auth bypass (CVSS 4.0)"
    },
    "php-race": {
      "kicker": "PHP · THE SIX-HOUR GAP",
      "title": "Próba miała miejsce 6 godzin przed poprawką.",
      "lede": "To jest ten rodzaj podatności, w przypadku którego „panika po opublikowaniu proof-of-concept (PoC)” nie wystarczy. Tego samego dnia zadziałał również Node.js.",
      "points": [
        "<b>07:43 UTC</b> Cloudflare monitoruje próby ataków przed udostępnieniem poprawki.",
        "<b>14:00</b> PHP wydaje poprawioną wersję / <b>14:17</b> NVD publikuje CVE",
        "Tego samego dnia: Node.js 22.23.4 / 24.22.1 / 26.12.1 (dołączono również aktualizację pakietu CA)",
        "Publicznie dostępne 24 godziny i ujawniona konfiguracja zostaną osobno sprawdzone pod kątem naruszenia."
      ],
      "metric": "probes before the fix"
    },
    "gitlab": {
      "kicker": "GITLAB · CVSS 10.0",
      "title": "Dotyczy to również sytuacji, gdy łatkę zastosowałeś w zeszłym tygodniu.",
      "lede": "Aktualizacja z 10 miesiąca 12 dnia jest dostępna dopiero od 19.2 . Ta poprawiona wersja znajduje się 1 powyżej.",
      "points": [
        "<b>CVE-2026-110264</b> / Przepełnienie całkowite w Onigmo / Nieuwierzytelniony RCE / Wszystko od 7.0 ( 2014 ) w górę",
        "Modyfikacja: 19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13",
        "Środowiska, które zostały załatane w dniu 10 miesiącu 12 dniu, podlegają tej samej zasadzie ponownie, jeśli są młodsze niż 19.2.9 (wersja poprawiona jest starsza o 1 ).",
        "Nie ma publicznie dostępnych rozwiązań. Obniżenie ceny wyeliminowałoby możliwość dotarcia do klienta."
      ],
      "metric": "CVSS · unauthenticated"
    },
    "npm": {
      "kicker": "PACKAGE CHANNELS · FOUR INCIDENTS",
      "title": "Rozpowszechniane materiały same w sobie stały się narzędziem ofensywnym.",
      "lede": "Przedmiot 10 w miesiącu 8 to problem z dystrybucją kodu. Pochodzenie wskazuje jedynie „gdzie został wyprodukowany”.",
      "points": [
        "LiteLLM 1.107.0 : Skradziony podczas uruchamiania. Repozytorium podobne do oryginału. <b>Berri-AI</b> Zbuduj z",
        "tensorlake@__ 0.5.144 : Jeśli to odwołasz <b>$HOME</b> „Żeton zakładnika”, który usuwa",
        "@subql/common@ 5.8.3 : Uruchamia się zarówno podczas instalacji, jak i importu.",
        "GhostAction: Fałszywy plik security-audit.yml <b>345</b> Wyślij sekrety i historię repozytorium."
      ],
      "metric": "repos swept · 16 minutes"
    },
    "railway": {
      "kicker": "RAILWAY · ENVIRONMENT VARIABLES",
      "title": "Zmienne środowiskowe były tajnym miejscem przechowywania.",
      "lede": "„To część serii ataków wymierzonych w dostawców wnioskowania AI” – napisał dostawca.",
      "points": [
        "Zmienne środowiskowe klienta mogły zostać odczytane podczas szyfrowania, a niektóre mogły zostać odszyfrowane.",
        "Podczas dochodzenia wstrzymano wszystkie wdrożenia i poproszono dostawców usług internetowych o prewencyjne unieważnienie kluczy.",
        "Potrzebny jest nie „klucz, który mógł zostać wykradziony”,<b>Wszystko</b>Obrót",
        "Hasło SMTP, tajny klucz podpisu webhooka i JWT_SECRET są również zawarte w zmiennych środowiskowych."
      ],
      "metric": "env vars to rotate"
    },
    "bind": {
      "kicker": "ADDENDUM · ISC BIND 9 / DNS",
      "title": "Ponownie przesłany pakiet 1 uszkadza pamięć.",
      "lede": "Po odtworzeniu protokołu UDP podpisanego za pomocą GSS-TSIG, wskazany katalog ulega uszkodzeniu. ISC wyraźnie stwierdza, że „nie ma obejścia”.",
      "points": [
        "<b>CVE-2026-94300</b> / CVSS 8.1 (AV:N・AC:H)/Poważność <b>High</b> / Zdalnie",
        "Wpływ: 9.11.0 – 9.18.50 , 9.20.0 – 9.20.29 , 9.21.0 – 9.21.26 (i seria S 1 ) → Korekta <b>9.20.30 / 9.21.27</b>",
        "Punktem wejścia jest obsługa GSS-TSIG. Użyj polecenia `named-checkconf -p | grep -i gssapi`, aby sprawdzić, czy jest skonfigurowana.",
        "Nie ma obejścia. Jedynym rozwiązaniem jest przeniesienie gałęzi EOL ( 9.11 do 9.18 ) do 9.20 / 9.21"
      ],
      "metric": "CVSS · Brak dostępnego obejścia"
    },
    "lkml": {
      "kicker": "ADDENDUM · LINUX KERNEL / LKML",
      "title": "Lista publiczna ma 0 dni i 6 wpisów.",
      "lede": "ZDI opublikowało post na publicznej liście LKML zamiast na prywatnej liście bezpieczeństwa. Greg Kroah-Hartman odpowiada na każdy post.",
      "points": [
        "SMB Bezpośredni niedomiar całkowity (<b>9.0</b>) i konflikt ksmbd (<b>9.0</b>) — Oba są zdalnymi RCE",
        "LPE w skb_zerocopy, zapis poza zakresem do vmwgfx, niezainicjowany nvmet, przepełnienie stosu zapytań TCP.",
        "linia główna to<b>nieocenzurowane</b>Poprawki zastosowano do gałęzi v7.5 i -next (od 10 do 22 ). Brak zatwierdzeń w głównej linii odwołujących się do identyfikatorów ZDI.",
        "Redukcja ekspozycji: Nieużywana <b>ksmbd</b> Zatrzymaj to / Nie narażaj SMB Direct na kontakt z niezaufanymi osobami"
      ],
      "metric": "reports sent public"
    },
    "sweep": {
      "kicker": "THE SWEEP · NVD, 14 DAYS",
      "title": "To samo polecenie zmienia 125 na 104 . Świat się nie zmienił.",
      "lede": "Okno kończy się „dzisiaj”. Dlatego liczby zmieniają się wraz z czasem. Liczba przypadków nie jest miarą ryzyka, ale raczej sposobem podsumowania ujawnień i analiz.",
      "points": [
        "9 godzin temu było 125 elementów, a teraz jest ich 104 . Podział jest następujący: <b>− 17 (Krawędź okna) − 4 (Usuń z CRITICAL) + 0 (Nowy)</b>",
        "Łączenie NVD CPE jest <b>26%</b>Najnowsze 381 elementy opublikowane w ciągu ostatnich 24 godzin to <b>0%</b>(Analiza jest nadal w toku)",
        "Najwyższy EPSS to <b>5.76%</b> — php 2 shell 109619 . Jednak przejdź do 8.1 i wyjdź poza CRITICAL.",
        "Wyniki CNA i NVD są podzielone: MOVEit/TeamCity to 8.1 (AC:H) i 9.8 (AC:L)"
      ],
      "metric": "critical CVEs : known exploited"
    },
    "infinity-core": {
      "kicker": "POSTSCRIPT · LINUX KERNEL",
      "title": "Podstawą jądra są skróty 6 do roota.",
      "lede": "Hyunwoo Kim opublikował „Infinity Core” na oss-security. 5 umożliwia nieuprawnionym użytkownikom wyjście do roota, a 5 umożliwia użytkownikom wyjście z kontenera do hosta.",
      "points": [
        "Timer / Sygnał / MM / Futex / Harmonogram / SLAB. Nie jest używana żadna sieć, BPF ani przestrzeń nazw użytkownika.",
        "NVD to 4 elementów <b>7.8</b>2 elementów nie ma żadnego wyniku. 6 elementów również znajduje się przed analizą.<code>Received</code>) KEV nie ma",
        "<b>Poprawka została już wydana.</b>6.6.158 / 6.12.112 / 6.18.54 / 7.2.8 , harmonogram to 7.2.9 . Bieżąca wartość stabilna jest przekraczana we wszystkich przypadkach.",
        "Co działa to<b>ponownie uruchomić</b>Jeśli działa na starszym jądrze, wystarczy je zainstalować, a ono pozostanie otwarte."
      ],
      "metric": "CVE: PoC przejęcia roota"
    },
    "blindspot": {
      "kicker": "POSTSCRIPT · THE BLIND SPOT",
      "title": "Sweep koncentruje się wyłącznie na pracy z bazami danych.",
      "lede": "Niezależnie od tego, czy szukałem według daty publikacji, daty aktualizacji, czy też czytałem kanał 12 książek, Infinity Core nigdy się nie pojawiał.",
      "points": [
        "Data wydania CVE <b>9/4〜10/12</b>PoC został wydany. <b>10/16</b> — 6 Różnica tygodniowa",
        "Rekordy NVD nie są aktualizowane podczas odświeżania trwającego 6 godzin. Rekordy 6 również nie są aktualizowane. <code>Received</code>",
        "13 Tytuł książki <code>infinity</code> zęby <b>0 elementów</b>RSS jest również oknem, a rekordy znajdują się po stronie archiwum.",
        "Dodana oś to<b>Kanały ujawniania informacji</b>。<code>oss-sec</code> W rundzie, w której to dodano, udało nam się odzyskać przedmiot 4 , który upuściła inna książka 12 ."
      ],
      "metric": "Kanał, który zgłosił ten incydent 6"
    },
    "ecosystem": {
      "kicker": "POSTSCRIPT · THE ECOSYSTEM",
      "title": "Istniało 2 krytycznych luk, które nie były jeszcze CVE.",
      "lede": "Baza danych GitHub Advisory 24 godzin. Nieuwierzytelnione żądania RCE w pliku Next.js 2 nie mają jeszcze CVE.",
      "points": [
        "Następny.js <code>use cache</code> Nieautoryzowane RCE do optymalizacji obrazu (SVG). Rozwiązanie: <b>16.4.1</b> / <b>15.5.28</b>",
        "DOMPurify 3.4.17、Pillow 13.0.0、GitPython 3.2.1、<code>toml</code> 5.0.1、Storybook 8.6.19",
        "Proces filtrowania CVE nie wykryje problemu 2 aż do samego końca. Decyzja jest podejmowana na podstawie nazwy pakietu i wersji z poprawkami.",
        "Tego samego dnia opublikowano także numer wersji pakietu Python CA: <code>certifi</code> 2026.10.19 / <code>pip</code> 26.2.2"
      ],
      "metric": "24 Rekomendacja pakietu na czas"
    },
    "node2shell": {
      "kicker": "POSTSCRIPT · NODE.JS",
      "title": "Działało z oficjalną wersją.",
      "lede": "Imperva pomyślnie wykonała kod ze zmodyfikowanych danych Brotli na rozproszonym obrazie Node.js 24.22.0 . Nie było potrzeby debugowania ani kompilacji instrumentalnej.",
      "points": [
        "Liczba wejść: 2 .<code>fetch()</code> Ścieżka, która pochłania niepewną odpowiedź Brotliego i ścieżka, w której Express 5 / body-parser 2 rozpakowuje treść żądania. <code>http.createServer()</code> Nie rozszerzy się automatycznie.",
        "Weryfikację przeprowadzono na kompilacjach 24.22.0 Linux arm 64 i 1 . 22 __.x / 26 __.x i innych architektur nie zostały zweryfikowane i wymagały wielu prób, aby się powieść.",
        "To samo wejście <b>24.22.1</b> Odmówili. Jak dotąd nie odnotowano żadnych przypadków niewłaściwego użycia w rzeczywistych warunkach.",
        "Rekordy NVD mają numer CVSS 4.0 <b>9.2</b> Brakuje jednak 3.1 . Nie pojawia się on na liście KRYTYCZNEJ filtrowanej według ważności."
      ],
      "metric": "Wersja, która zadziałała: Odrzucona wersja to 24.22.1"
    },
    "prepatch": {
      "kicker": "POSTSCRIPT · PHP2SHELL",
      "title": "Proces rozpoczął się 4 dni przed wydaniem zalecenia.",
      "lede": "W honeypot AWS wciąż występują próby wykorzystania luk 2026 - 10 - 17 , a publiczny PoC został opublikowany 12 godzin przed zniesieniem embarga. Data ujawnienia nie jest datą pierwszego ataku.",
      "points": [
        "Z czasem 24 przed korektą <b>482,342</b> Żądanie / 122 , 311 Sesja / 21 , 998 Miejsce / 103 Kraj (obserwacja Imperva)",
        "Jednakże<b>test</b>Nie jest to naruszenie. Sophos nie zainstalował oprogramowania pochodnego Mirai, a Dataminr nie ma żadnych znanych naruszeń.",
        "KEV nadal nie jest uwzględniony. EPSS wynosi 5.31 % / 5.76 %",
        "Punkt wyjścia śledztwa <b>10-17</b>Od daty ujawnienia pomija się pierwszy dzień 4 ."
      ],
      "metric": "Pierwsza próba → Zalecenie"
    },
    "filters": {
      "kicker": "POSTSCRIPT · THE FILTER",
      "title": "Nawet jeśli użyjesz 9.9 , nie pojawi się na liście.",
      "lede": "Filtr ważności NVD bierze pod uwagę tylko własne (podstawowe) odpowiedzi CVSS 3 __.x. Odpowiedzi 9.9 pielęgniarki pielęgniarskiej będą liczone jako odpowiedzi 0 , nawet jeśli występują w tym samym rekordzie.",
      "points": [
        "<code>?cveId=CVE-2026-91637&amp;cvssV3Severity=CRITICAL</code> zęby <b>0 elementów</b>Rekord zawiera 9.9 (Drugorzędny).",
        "Z tego samego powodu, <code>CVE-2026-111497</code>(CVSS 4.0 tylko 9.2 ) i <code>CVE-2026-114625</code>(CNA 9.9 ) również nie pojawia się na liście.",
        "10 godzin <b>104 → 98</b>Pojawiło się 6 elementów i dodano 0 elementów, ale żaden z nich nie został naprawiony.",
        "Publiczne kontrole o wszystkich poziomach zagrożenia i źródła danych dostawców wychwytują oba te elementy. Przefiltrowana lista nie odpowiada na pytanie, „co jest wykorzystywane”."
      ],
      "metric": "Odpowiedź CNA na 9.9"
    },
    "wide": {
      "kicker": "POSTSCRIPT · THE WIDE SWEEP",
      "title": "Lista CVE nie wymienia żadnego z elementów 4 .",
      "lede": "Tym razem również wzięliśmy pod uwagę wiadomości i X. 4 elementów, które zostały znalezione jako pierwsze i zweryfikowane ze źródłami pierwotnymi. Liczby są zgodne z danymi opublikowanymi przez dostawcę.",
      "points": [
        "Arista VeloCloud Orchestrator <code>CVE-2026-114625</code>: 0 - dzień, obecnie niewłaściwie używany,<b>9.9</b>Jeśli jesteś zalogowany, użyj superużytkownika. W przypadku instalacji lokalnych użyj 5.2.3.18 / 6.1.3.10 / 6.4.2.12",
        "Linux KSMBD: <code>ZDI-CAN-33774</code> To jest 9.0 , który nie wymaga uwierzytelniania. Nie ma jeszcze żadnych CVE ani poprawek głównych.",
        "Identyfikator Capcom <b>11,774,247</b> Liczba elementów. Onamae.com Desktop Cloud to największa chmura <b>26,739</b> Zatrzymaj maszynę",
        "Doniesienia prasowe były punktem wyjścia, ale dowody pochodziły ze strony dostawcy. Arista uzyskała bezpośrednio pierwotne powiadomienie od 10 / 24 . Ponownie przeanalizowałem faktyczne nadużycia, warunki uwierzytelniania i zmienione wersje."
      ],
      "metric": "Przypadki nie wymienione na liście CVE"
    },
    "php-next": {
      "kicker": "POSTSCRIPT · PHP, TWO DAYS LATER",
      "title": "Nie podjęto żadnych działań naprawczych w sytuacjach awaryjnych.",
      "lede": "10 PHP, po CVE-2026-115560 - 23 , to inna ścieżka RCE (Remote Control Engagement). Nie podano żadnych wersji, ocen ani poprawek, których dotyczy problem, a jedynie zapowiedziano wydanie pełnej rekomendacji w kolejnej planowanej wersji.",
      "points": [
        "Warunek to 4 wszystkie. W ustawieniach... <code>php_binary</code> / <code>php_serialize</code>, podczas wykonywania <code>ini_set</code> W <code>php</code> pierdnięcie,<code>session_start()</code> Przed i z włączonym postępem przesyłania.",
        "Aplikacje, które nie zmieniają procedur obsługi podczas wykonywania, mogą pozostawić tę funkcję włączoną — tak stanowi samo PHP.",
        "Środkiem zaradczym jest linia 1 : <b><code>session.upload_progress.enabled=0</code></b>10 - Podobnie jak w przypadku złagodzenia 109619 dla 21 , nie jest wymagana żadna dodatkowa praca, jeśli została już zastosowana.",
        "W poprzednim pobieraniu 10 / 23 nie było żadnych rekordów NVD. Powiadomienie PHP pozostaje niezmienione i nawet po dodaniu KEV 17 nie ma 115560 . Brak wpisu na liście nie gwarantuje bezpieczeństwa."
      ],
      "metric": "Relaks w oczekiwaniu na kolejną planowaną premierę."
    },
    "update-scope": {
      "kicker": "10-24 UPDATE · UPDATE-SCOPE",
      "title": "Wyjdźmy jeszcze raz poza CVE.",
      "lede": "Kompleksowe dochodzenie w sprawie 10 - 24 . Przeanalizowaliśmy nowe i zaktualizowane informacje, kanały ujawniania informacji oraz produkty krajowe, a także sporządziliśmy listę kluczowych przypadków 24 wraz ze źródłami.",
      "points": [
        "Najnowszy NVD dla 30 godzin to<b>Nowy 526 / Zaktualizowany 3 , 531</b>Są to duplikaty i nie będą sumowane.",
        "GitHub znajduje się w systemie Windows<b>82 Rekomendacja</b>Krytyczny 6 jest uwzględniony. Dotyczy to również tych bez przypisanego CVE.",
        "KEV jest dodatkiem od 10 / 10 wzwyż.<b>17 elementów</b>Naukowcy uzyskują również oficjalne 14 i JVN.",
        "24 oznacza liczbę produktów lub incydentów zgrupowanych razem. Nie oznacza to, że jest 24 nowych przypadków naruszenia."
      ],
      "metric": "reviewed groups"
    },
    "update-exploited": {
      "kicker": "10-24 UPDATE · UPDATE-EXPLOITED",
      "title": "Po pierwsze, istnieje 2 przypadków, w których dochodzi do niewłaściwego wykorzystania.",
      "lede": "Arista VCO i Nextcloud Built-in CODE dodały KEV do 10 - 23 . CISA zażądała przeprowadzenia dochodzeń kryminalistycznych w obu przypadkach.",
      "points": [
        "VCO to jest<b>Konto z włączonymi niskimi uprawnieniami</b>Ale awansowałem. Na poziomie lokalnym 5.2.3.18 / 6.1.3.10 / 6.4.2.12 i wyższym.",
        "Wbudowany KOD to<b>Zaktualizuj lub usuń od 26.4.303 .</b>Samo wyłączenie aplikacji nie wystarczy, aby temu zapobiec.",
        "Warunkiem jest zatrzymanie pliku proxy.php w trybie CODE. Samodzielna wersja Collabora Online nie jest dołączona.",
        "Termin CISA to<b>10/26</b>(Dla rządu federalnego USA). Zachowanie dowodów przed zmianą i zbadanie naruszeń po zmianie."
      ],
      "metric": "KEV additions · 10.23"
    },
    "update-packages": {
      "kicker": "10-24 UPDATE · UPDATE-PACKAGES",
      "title": "Obrazy, Wasm, uwierzytelnianie, proxy.",
      "lede": "Przeanalizujemy dwie różne granice 4 w różnych warunkach. W każdym przypadku sam wynik nie ujawnia narażenia.",
      "points": [
        "<b>Pillow 13.0.0</b>Do. Po zainstalowaniu FPX obrazy są wysyłane do centrum przetwarzania obrazu niezależnie od rozszerzenia pliku. Publiczny PoC to demonstracja wykorzystująca stałą konfigurację.",
        "<b>Wasmtime -115889</b>Seria 36 to 36.0.19 , 37 do 42 to 43.0.0 i nowsze. Granice obsługi niezaufanych Wasm w Cranelift.",
        "<b>Laravel 12.68.0 / 13.29.0</b>Aby ominąć uwierzytelnianie przy użyciu TokenGuard + określonej konfiguracji MySQL/MariaDB.",
        "<b>Echo 4.16.1 / 5.4.1</b>Połączenie po odrzuceniu protokołu WebSocket omija autoryzację trasy. Niezależna autoryzacja po stronie upstream jest osobna."
      ],
      "metric": "package boundaries"
    },
    "update-runtime": {
      "kicker": "10-24 UPDATE · UPDATE-RUNTIME",
      "title": "Sama aplikacja i dołączone do niej akcesoria.",
      "lede": "Mimo że CVE jest wymienione pod nazwą GitLab, dotyczy ono użytkowników Ruby, a aktualizacja pakietu Brotli systemu operacyjnego nadal nie spowoduje usunięcia dołączonej kopii Perla.",
      "points": [
        "<b>Ruby 4.0.9 / 3.4.12 / 3.3.13</b>Celem jest aplikacja kompilująca wyrażenia regularne atakującego.",
        "<code>Regexp.timeout</code>Limity długości są niewystarczające. 4.0.8 nie zapewnia kompletnego rozwiązania.",
        "<b>IO::Compress::Brotli 0.023</b>Cel mieści się pomiędzy 0.004001 a 0.023 . Sama aktualizacja biblioteki systemu operacyjnego nie rozwiąże problemu.",
        "<b>NGINX 1.30.6 / 1.31.7</b>Elementy 5 zależą od konfiguracji, a niektóre RCE wymagają pominięcia ASLR itp."
      ],
      "metric": "runtime checks"
    },
    "update-agents": {
      "kicker": "10-24 UPDATE · UPDATE-AGENTS",
      "title": "Kto może korzystać z upoważnienia agenta?",
      "lede": "Uwierzytelnianie, TLS, izolacja notatek, ładowanie modeli — granice, które istniały na długo przed wymyśleniem nazwy „sztuczna inteligencja” — chronią sekrety i narzędzia.",
      "points": [
        "<b>PraisonAI 4.6.59</b>Hej. AgentOS nadal miał nieautoryzowany czat nawet po zainstalowaniu starej, poprawionej wersji 4.5.128",
        "<b>req_llm 1.29.0</b>. Brak weryfikacji TLS w trasie WebSocket od 1.9.0 wzwyż. Trasa HTTP jest inna.",
        "<b>obsidian-tc 1.3.1</b>Dobrze. Potwierdziłem również rozdzielenie ponownego wiązania Origin/DNS i skarbca w pętli zwrotnej.",
        "<b>Serwer AWS Multi Model jest wycofany z eksploatacji</b>Brak dostępnej wersji poprawionej, wymagana migracja. x 402 wymaga oddzielnej weryfikacji limitów wydatków i pochodzenia podpisu."
      ],
      "metric": "agent boundaries"
    },
    "update-japan": {
      "kicker": "10-24 UPDATE · UPDATE-JAPAN",
      "title": "Również krajowe systemy biznesowe.",
      "lede": "Nie chodzi tu tylko o platformę programistyczną, która zostanie udostępniona na zewnątrz. Przyjrzymy się również granicom między aplikacjami biznesowymi, integracją LINE i interfejsami API do zarządzania.",
      "points": [
        "<b>1.5.9.1</b>Do: W przypadku systemów Linux/Docker itp. + określonej konfiguracji LDAP logowanie jest możliwe wyłącznie przy użyciu prawidłowych identyfikatorów.",
        "<b>LIFF SDK 2.31.1</b>2.20.0 ~ 2.31.0 DOM XSS",
        "<b>Aktualizacja JPCERT 10 / 23</b>Dodano próbę nadużycia platformy penetracji sztucznej inteligencji jako przypadek E.",
        "Autoryzacja na poziomie API, minimalne uprawnienia/wygaśnięcie tokena, limit przepustowości i zawieszenie zbędnego ujawnienia administracyjnego. Nie należy wnioskować o naruszeniu wyłącznie na podstawie adresów IP lub JA 4"
      ],
      "metric": "domestic checks"
    },
    "update-devices": {
      "kicker": "10-24 UPDATE · UPDATE-DEVICES",
      "title": "Sprzęt jest klasyfikowany ze względu na linię produktów.",
      "lede": "Oficjalny system CSAF (Computer Security Analysis) firmy HPE obejmuje 72 pozycji, z czego 8 pozycji ma 10.0 CVSS (Computer Security Analysis). W przypadku produktów i terminali przemysłowych, niektóre modele nie będą miały poprawionych wersji.",
      "points": [
        "<b>HPE AOS</b>: 10.8.1.2 / 10.7.2.7 / 10.4.1.14 / 8.13.3.1 / 8.10.0.24 . Dopasuj CVE do linii produktów.",
        "<b>Mitsubishi Electric GENESIS / ICONICS i produkty pokrewne</b>Naprawiono problem z odpowiedzią na wyzwanie, DCOM, libwebp itp. Zobacz poprawki/obejścia specyficzne dla produktu.",
        "<b>Lenovo AVB</b>Wiele urządzeń korzysta z publicznego klucza testowego. Wymagany jest dostęp fizyczny. Koniec cyklu życia (EOL) nie jest stały.",
        "Nie należy mylić idealnych wyników ani liczby kompatybilnych modeli z faktyczną weryfikacją niewłaściwego użytkowania. W przypadku produktów, których nie można obsłużyć, należy rozważyć migrację."
      ],
      "metric": "HPE AOS CVEs"
    },
    "update-trust": {
      "kicker": "10-24 UPDATE · UPDATE-TRUST",
      "title": "Sprawdź następne kroki po aktualizacji.",
      "lede": "Listy bloków, trusty startupów i wycieki danych uwierzytelniających. Udokumentowaliśmy również aspekty wykraczające poza samo stosowanie poprawek.",
      "points": [
        "<b>Firefox 158.0.1 / Android 158.0.2</b>Obejmują one włączenie blokowania pośrednich urzędów certyfikacji eMudhra. Thunderbird 153.5.1 rozwiązuje również problemy związane z uwierzytelnianiem poczty e-mail.",
        "<b>BlackX</b>To jest bootkit po uzyskaniu uprawnień administratora. Łatanie systemu operacyjnego i odzwierciedlenie wygaśnięcia Secure Boot DBX to oddzielne procesy.",
        "<b>k 0 t Ankieta 70 , 000 ponad</b>Dotyczy to danych uwierzytelniających itp., a nie liczby firm, których dotyczy problem. Klucze i pozostałe uprawnienia będą sprawdzane równolegle z aktualizacją.",
        "JPEG XR<b>jxrlib</b>Istnieją również raporty badawcze na ten temat. CVE niepotwierdzone, brak dowodów na wykonanie kodu. Sprawdź status poprawki u dystrybutora."
      ],
      "metric": "trust checks"
    },
    "oct25-priorities": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "Aktualizacje będą do Ciebie docierać.",
      "lede": "16:34 w dniu 10 , ankieta z dnia 25 jest uzupełniana. Dane pochodzą z okresu po dacie odniesienia i nie wszystkie są nowymi zdarzeniami na dziś.",
      "points": [
        "<b>Patch the Planet</b> Zalecane. Jest to inicjatywa mająca na celu wspieranie usuwania luk w zabezpieczeniach oprogramowania typu open source.",
        "Publicznie dostępne zasoby, które zostały już wykorzystane niezgodnie z przeznaczeniem → Aktualizacja awaryjna → Badanie kluczy i uprawnień → Weryfikacja dołączonych kopii.",
        "Nowe okno NVD jest stałe<b>99</b>elementy/aktualizacje<b>5,432</b>Elementy. Nie dodawaj ich, ponieważ są duplikatami.",
        "Wartość KEV pozostaje taka sama jak w wersji 10 / 23 . Żadne nowe wpisy nie będą wykorzystywane jako deklaracja bezpieczeństwa."
      ]
    },
    "oct25-fortinet": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "Nie czekaj, aż CVE zostanie publicznie opublikowane.",
      "lede": "Fortinet ogłasza awaryjną aktualizację wzmacniającą zabezpieczenia swoich produktów 5 . Więcej szczegółów będzie dostępnych na temat 11 i 10 .",
      "points": [
        "<b>FortiOS</b>: 8.0.2 / 7.6.8 / 7.4.13 / 7.2.14",
        "<b>Manager / Analyzer</b>: 8.0.2 / 7.6.8 / 7.4.12 / 7.2.13",
        "<b>Mail</b>: 8.0.2 / 7.6.7 / 7.4.9。<b>Authenticator</b>: 8.0.4 / 6.6.11",
        "Model, seria i trasa aktualizacji zostaną zweryfikowane. Ograniczenia w zakresie zarządzania i dostępu publicznego mają charakter tymczasowy. Na podstawie powiadomienia nie można domniemywać, że doszło do rzeczywistego nadużycia."
      ]
    },
    "oct25-runtime-trust": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "Zaufanie, które pozostaje poza przeglądarką.",
      "lede": "Java wymaga awaryjnych aktualizacji dla 10 / 24 , a Python SSL wymaga listy zablokowanych kluczy. Same regularne aktualizacje nie wystarczą.",
      "points": [
        "<b>Java CVE-2026-114820</b>Aktualizacja awaryjna lub oficjalna procedura sprawdzania magazynu kluczy/unieważnienia. Uruchom ponownie każde środowisko JRE.",
        "Tabele Oracle, takie jak 8 u 511 -b 32 itd.<b>Wersja wpływu</b>Nie przepisuj tego jako wersji poprawionej.",
        "<b>Python CVE-2026-115557</b>Główne scalanie i implementacja w wersji dystrybucyjnej to oddzielne procesy. Sprawdź u źródła dystrybucji.",
        "Inwentaryzacja systemu operacyjnego, certyfikatów, dołączonego środowiska JRE, kontenera i zastrzeżonego magazynu."
      ]
    },
    "oct25-dns": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "Usługa DNS powinna być oferowana jako osobne produkty.",
      "lede": "Aktualizacje są wymagane nie tylko dla BIND, ale także dla resolvera i autorytatywnego DNS. Nawet produkty o podobnych nazwach mogą wymagać różnych aktualizacji.",
      "points": [
        "<b>BIND</b>: 9.20.30 / 9.21.27 . Dopasuj warunki retransmisji GSS-TSIG i zależne od konfiguracji.",
        "<b>Unbound</b>: 1.26.2 . 5 pozycji do DoQ, weryfikacji i załadunku.",
        "<b>PowerDNS Recursor</b>: 5.3.12 / 5.4.8。<b>Authoritative</b>: 4.9.18 / 5.0.8 / 5.1.5",
        "<b>Knot DNS</b>: 3.6.2 . To jest niezależne od Knot Resolver. Nie należy mylić liczby luk CVE z liczbą faktycznych exploitów."
      ]
    },
    "oct25-cloud-access": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "Autoryzacja pozostaje ważna po dokonaniu naprawy.",
      "lede": "Ta aktualizacja odzwierciedla wstępną weryfikację przeprowadzoną przez ConnectWise i potwierdzoną przyczynę przez LiteLLM. Samo odzyskanie danych przez dostawcę nie powoduje usunięcia pozostałych uprawnień dostępu klienta.",
      "points": [
        "<b>ConnectWise</b>: Pozostań wyłączony do momentu wydania oficjalnych instrukcji dotyczących przywrócenia. 10 / 26 są celami stopniowego wznawiania.",
        "Nie spiesz się z usuwaniem; zachowaj dowody. Zbadaj uwierzytelnianie podmiotu usługi, operacje na grafach oraz dodatkowe klucze, właścicieli i uprawnienia.",
        "<b>LiteLLM</b>: Nieodwołany klucz główny → token GitHub OAuth → sekret CI. Zaktualizuj początkowe przypuszczenie",
        "Nie uruchamiaj najpierw pip w środowisku, w którym występuje problem. Izolacja, odbudowa i unieważnienie dostępnych kluczy."
      ]
    },
    "oct25-bundles": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "Sprawdź adres wysyłki i ewentualne wyjątki.",
      "lede": "Przetwarzanie kompresji, proxy, integracja SNS, klienci przemysłowi. Nawet w przypadku tego samego zadania aktualizacji warunki ukończenia różnią się.",
      "points": [
        "<b>Brotli</b>: Bun 1.4.4 , brotli 1.2.1 / brotlicffi 1.2.1.0 . Ponownie skompiluj również skompilowany plik wykonywalny Bun.",
        "<b>Postiz</b>: 2.25.3 . Sprawdź warunki dla zarejestrowanych użytkowników i funkcję linkowania.",
        "<b>ATS</b>: 9.2.16 / 10.1.5 / 10.2.1 . Jednak CVE-2026-111817 jest<b>Niepoprawiono z 9.2.16</b>",
        "<b>open62541</b>: 1.5.7 . Celem ataków są również klienci otrzymujący definicje typów ze złośliwych serwerów OPC UA."
      ]
    },
    "http2shell": {
      "kicker": "POST FOLLOW-UP · CVE-2026-111497",
      "title": "HTTP 2 Shell. Ta sama wada, nawet w dołączonych pakietach.",
      "lede": "Wskazany wpis zostanie porównany z głównym źródłem. Ścieżki wdrożeniowe Brotli zostaną również sprawdzone poza Node.js. Nie jest to nowa luka w zabezpieczeniach, ograniczona do HTTP/ 2 .",
      "points": [
        "Google CNA to<b>CVSS v4.0 9.2</b>Węzeł 2 to ten sam CVE co Shell. Jest to niezależne od weryfikacji faktycznego wykorzystania.",
        "<b>Envoy</b>: 1.40.0 / 1.39.3 / 1.38.6 / 1.37.8 . Wymagane są ustawienia wdrażania Brotli.",
        "<b>Istio</b>1.31.2 / 1.30.6 / 1.29.9 . 1.29 jest EOL. Sprawdzono również bramkę i sidecar.",
        "<b>curl, żądania, httpx</b>: Sprawdź rzeczywiste zależne dekodery i automatyczną dekompresję. Zmiana samego kodu Accept-Encoding jest niewystarczająca."
      ],
      "metric": "Google CNA · CVSS v4.0"
    },
    "tailworm-overview": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "Ogoniasty. Ponowne zbadanie wewnętrznych granic.",
      "lede": "Raport badawczy dotyczący Tailscale/headscale. Koncentruje się na zakresie dostępu z autoryzowanych urządzeń oraz uprawnieniach przyznawanych po połączeniu.",
      "points": [
        "Przedmiotem badań jest<b>Tailscale 1.104.2 / headscale 0.29.5</b>Wersja ta nie jest nazywana wersją poprawioną.",
        "badacze<b>11 element</b>Obejmuje to notatki dotyczące konfiguracji. 11 CVE/nie są to rzeczywiste uszkodzenia.",
        "Sprzedawca bada sprawę i wprowadza poprawki.<b>Nie zalecamy wszystkim użytkownikom wyłączania protokołu SSH.</b>",
        "Najpierw sprawdź:<b>Terminale Tailscale z włączonym SSH i uprawnienia do połączenia</b>Jest to coś odrębnego od standardowego OpenSSH."
      ]
    },
    "tailworm-ssh": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "Możesz się połączyć. Wtedy uzyskasz uprawnienia roota.",
      "lede": "Badacze zgłosili problem, w którym operacje na gnieździe Unix dla przekierowania SSH są wykonywane z uprawnieniami użytkownika root, a także konflikt w sprawdzaniu ścieżki. Dostawca bada również uprawnienia po nawiązaniu połączenia.",
      "points": [
        "Założenie jest takie<b>Zezwól na połączenie SSH i odpowiednie uprawnienia do przekierowywania.</b>Nie oznacza to nieautoryzowanej ingerencji we wszystkie urządzenia.",
        "Interfejsy API Dockera i zarządzania są połączone za pomocą gniazd i zamienników. Naukowcy zgłaszają eskalację uprawnień w laboratorium.",
        "<b>Ograniczone do konkretnych nadawców → konkretnych odbiorców</b>i ograniczyć zbędne transfery.",
        "<b>Tryb kontroli wymaga dodatkowego uwierzytelnienia przy wejściu.</b>Nie rozwiąże to problemu z eskalacją uprawnień po nawiązaniu połączenia."
      ]
    },
    "tailworm-headscale": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "Headscale wymaga innego rozwiązania.",
      "lede": "Rozróżnimy sterowanie hostowane samodzielnie i Tailscale SaaS. Badacze zgłaszali wyczerpanie pamięci i wydajność pamięci podręcznej w publicznych ścieżkach rejestracji.",
      "points": [
        "<b>headscale 0.29.5</b>Potwierdzenie powyższych informacji. Raporty wskazują, że niektóre ataki DoS przeprowadzane poprzez rejestrację nie wymagają posiadania konta.",
        "Badacze<b>Nie można wyłączyć przekazywania SSH</b>Podkreślili, że nie powinni ponownie wykorzystywać ustawień SaaS i powinni rozważyć ograniczenie lub wyłączenie uprawnień.",
        "Sprawdź zakres dostępu, limit szybkości, limit pamięci i monitorowanie ponownego uruchamiania.<b>Relaksacja nie jest korektą.</b>",
        "Atak DoS na klienta wykorzystujący złośliwą odpowiedź DERP to:<b>Połączony ze złośliwym przekaźnikiem</b>Inna przesłanka"
      ]
    },
    "tailworm-connector": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "Uprawnienia aplikacji zostały wysłane do innej lokalizacji.",
      "lede": "Celem jest eksperymentalne połączenie 25 . Naukowcy donoszą, że terminal z prawami dostępu może wymusić na łączniku wybór dowolnego, rzeczywistego miejsca docelowego.",
      "points": [
        "<b>połączenie 25 i możliwości użyteczności</b>Opiera się to na założeniu, że nie można tego uogólnić na wszystkie konfiguracje złączy.",
        "Zweryfikuj sieć LAN, metadane chmury i usługi klastra po stronie łącznika, używając rzeczywistego miejsca docelowego.",
        "Usuń niepotrzebne uprawnienia użytkownika.<b>Ogranicz miejsca docelowe po stronie wyjazdowej.</b>Sprawdź także IPv 4 / IPv 6 .",
        "Limity wyjścia Kubernetes wynoszą<b>CNI, hostNetwork, ścieżka przekierowania</b>Zmierzymy to w praktyce. Nie wchodź po prostu w ustawienia i nie traktuj tego jako gotowego."
      ]
    },
    "tailworm-serve": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "Sprawdź port zarządzania w ustawieniach serwera.",
      "lede": "Przekierowanie TCP do gniazd Unix, powiązanie ze wszystkimi interfejsami oraz autoryzacja międzymontowania HTTP/ 2 . Konfigurację i routing zinwentaryzujemy osobno.",
      "points": [
        "<b>Transfer TCP do uprzywilejowanego gniazda serwera</b>Wyszukaj odpowiednie ustawienia dla operatora.",
        "<b>TS_SERVE_ALLOW_ALL_INTERFACES</b>To uwaga dotycząca konfiguracji. Nie jest to domyślne zachowanie dla wszystkich usług.",
        "Potwierdzono zależną od nagłówka autoryzację zaplecza i wielokrotne montowanie. Odkrycia Funnel pozwoliły również na zróżnicowanie modeli zagrożeń.",
        "Zapora sieciowa IP<b>Nie sprawdzaj lokalnych operacji gniazd Unix.</b>Usuń niepotrzebne ustawienia."
      ]
    },
    "tailworm-response": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "Sprawdź, zawęż i wprowadź poprawki.",
      "lede": "To odróżnia automatyczną propagację w laboratoriach badawczych od rzeczywistych epidemii robaków. Na podstawie przedstawionych tu źródeł pierwotnych, rzeczywiste inwazje ogoniastego pasożyta pozostają niepotwierdzone.",
      "points": [
        "Inwentaryzacja SSH, headscale, conn 25 i Serve.<b>Warunki dla każdej funkcji, które mają zostać ustalone</b>Zredukowane pozwolenie zgodnie z",
        "<b>Wersje zmienione i dedykowane CVE/CVSS nie zostały jeszcze potwierdzone.</b>Nie należy mylić tego z modyfikacją certyfikatu 1.104.2 .",
        "W przypadku podejrzenia naruszenia, po zabezpieczeniu i wyodrębnieniu dowodów,<b>Wyłącz terminal pod względem kontroli</b>Zaktualizuj dostępne klucze",
        "Sama ponowna instalacja nie unieważni skopiowanej tożsamości. Kontynuuj sprawdzanie oficjalnych rekomendacji i aktualizacji."
      ]
    },
    "night-delta": {
      "kicker": "NIGHT UPDATE · 23:18 JST",
      "title": "Badanie na szeroką skalę. Skup się na warunkach sukcesu, a nie na liczbie przypadków.",
      "lede": "16:34 → 23:18 Pobrano dodatkowe dane dotyczące stałego okna dla JST. Aktualizacje, które pokrywają się z poprzednimi danymi, nie będą uwzględniane w liczbie przypadków objętych problemem.",
      "points": [
        "<b>NVD 87 / 87</b>Oba zestawy w tym przypadku zawierają te same elementy 87 . Zebrano je na wszystkich poziomach ważności.",
        "<b>GitHub 16</b>To nie zostało sprawdzone. Puste pole pakietu nie oznacza, że nie ma ono żadnego efektu.",
        "<b>KEV obejmuje wersje 10 / 23 , 1 , 756</b>Brak nowych dodatków nie dowodzi, że nie ma ataków.",
        "Sprawdziłem, czy Firecrawl, Dokploy, Rotki i inne są publikowane w źródłach pierwotnych.<b>Nie należy uzupełniać ich niepotwierdzonymi, poprawionymi wersjami.</b>"
      ]
    },
    "night-restoration": {
      "kicker": "NIGHT UPDATE · 23:18 JST",
      "title": "Celem odzyskiwania nie jest umożliwienie ponownego połączenia.",
      "lede": "Usługa ConnectWise została dziś zaktualizowana do wersji 23:00 JST. Cloud Backup ma na celu stopniowe wdrażanie do 10 / 26 .",
      "points": [
        "<b>Najpierw przywróć dostęp do istniejących kopii zapasowych.</b>Plan zakłada przeprowadzenie użytkowników przez proces ponownej rejestracji.",
        "<b>Pozostaw połączenie wyłączone do momentu wykonania określonej formalnej procedury.</b>Przywrócenie infrastruktury nie oznacza przywrócenia wszystkich funkcji.",
        "Utrzymywanie kopii zapasowych i badanie uwierzytelniania, uprawnień i operacji e-mail klienta M 365 __ to odrębne sprawy.",
        "Prace nad PHP, GitLab i Brotli, a także nad KEV (Key Energy Vault), który już został wykorzystany, oraz nad wzmacnianiem zabezpieczeń Fortinet, trwają.<b>Zaznacz według roli w szczegółowym raporcie.</b>"
      ]
    },
    "morning-cutoff": {
      "kicker": "MORNING UPDATE · 2026-10-26",
      "title": "10:27 . Co się zmieniło?",
      "lede": "To chronologiczny przegląd wersji PHP i kolejnych aktualizacji, śledzący postęp prac aż do dzisiejszego poranka. Dodanie do bazy danych i wystąpienie incydentu to odrębne zdarzenia.",
      "points": [
        "NVD jest nowe<b>28 elementów</b>,aktualizacja<b>4 , 276 elementów</b>Zestaw aktualizacji zawiera wszystkie nowe elementy.",
        "GHSA <b>93 elementów</b>Wszystkie wpisy są nieprzeglądane. Dotyczy to wielu wpisów, które pojawiły się po poprzednim wpisie NVD (Non-Virtual Data).",
        "<b>Początkowe włamanie do agencji rządowych = PHP 2 Shell</b>Wyjaśnienie dotyczące jednostki 42 zostało wycofane. Jest to niezależne od obserwacji z próby AWS."
      ]
    },
    "morning-dotnet": {
      "kicker": "MORNING UPDATE · 2026-10-26",
      "title": "Zaktualizowałem. Ale nadal nie znalazłem żadnych poprawek.",
      "lede": "CVE-2026-70197 dla systemu Windows .NET. Microsoft wyjaśnił, że aktualizacje 10 / 13 nie zawierają poprawki i wydał tymczasową aktualizację.",
      "points": [
        "Ogłoszenie publiczne <b>10/26 03:50 JST</b>Warunkiem jest ponowne użycie SocketAsyncEventArgs pomiędzy datagramami IPv 4 i IPv 6 .",
        "Seria docelowa to <b>8.0.33 / 9.0.22 / 10.0.14</b>Porównaj z wersjami poprawionymi itp.",
        "Aplikacje autonomiczne to<b>Odbudować i redystrybuować</b>Sprawdź także uruchomione środowisko wykonawcze."
      ]
    },
    "morning-ot": {
      "kicker": "MORNING UPDATE · 2026-10-26",
      "title": "PHP jest również obecny w sprzęcie.",
      "lede": "Poranna aktualizacja JVN obejmuje propagację powłoki PHP 2 do PAN-OS w systemie RUGGEDCOM. Nie oznacza to, że wszystkie produkty Siemensa mają tę samą wadę.",
      "points": [
        "<b>09:00 JST</b>Aktualizacja kanału. Jest ona niezależna od daty publikacji 566512 .",
        "PAN-OS jest<b>W niektórych seriach dostępne są wersje poprawione.</b>. Oddzielne od innych serii ETA.",
        "Dodano również Starmana/Placka. Nie tylko PHP.<b>Granice przetwarzania HTTP</b>Sprawdzać"
      ]
    },
    "morning-dates": {
      "kicker": "MORNING UPDATE · 2026-10-26",
      "title": "Przeczytaj według daty. Wróć do bieżącego statusu.",
      "lede": "Ta strona zawiera osobne wpisy dla każdej z następujących dat: 10 miesiąc 17 do 26 oraz 10 dni. Data obserwacji, data publikacji, data rewizji i wszelkie informacje odkryte później są oddzielone.",
      "points": [
        "<a href=\"./timeline.html\">Rekordy według daty →</a> / <a href=\"./update-20261026.html\">Podsumowanie 10 / 26 10:27 →</a>",
        "Aktualizacje usług publicznych, dochodzenia w sprawie naruszeń i dalsze cofanie uprawnień.",
        "Minimalne poprawki Tailworm i ponowne uruchomienie ConnectWise zostały ukończone.<b>Na razie niepotwierdzone</b>Nie zastępuj rzeczywistych wyników zaplanowanymi wydarzeniami."
      ]
    },
    "closing": {
      "kicker": "WHAT IT MEANS",
      "title": "Ryzyko nie tkwi w kodzie, który napisałeś.",
      "lede": "W miesiącu 10 doszło do zerwania „zaufania, które decyduje o tym, który kod zostanie uruchomiony”. Kontrole, które działają, są subtelne i składają się głównie z ustawień.",
      "points": [
        "Zwolnij niezmienność i weryfikację podpisu podczas instalacji.",
        "Poprawianie wersji za pomocą hasha. Nie używaj `latest`. Wyświetl różnice za pomocą tagów git.",
        "Nie przechowuj danych uwierzytelniających administratora w postaci zwykłego tekstu ani w formacie długoterminowym. Nie upubliczniaj informacji administracyjnych.",
        "Baza danych dostawcy zakłada, że posiada własne klucze (TeamUpdraft / Railway / Zeabur).",
        "Jądro stanowi „granicę, której nie można ustalić dla każdej aplikacji z osobna”. Wykonywanie kodu w kontenerze wymaga dostępu z uprawnieniami roota na hoście."
      ]
    },
    "afternoon-deployment": {
      "kicker": "14:56 AKTUALIZACJA · Sprawdź metodę rozmieszczenia",
      "title": "Zaktualizowano. Czy ten plik binarny został zastąpiony?",
      "lede": "Uzupełnia to zalecenia .NET Brotli. Procedura dostarczania poprawek do działających aplikacji różni się w zależności od tego, czy używasz współdzielonego środowiska uruchomieniowego, samodzielnego środowiska, czy NativeAOT. Diagram przedstawia schemat ścieżki wdrożenia.",
      "points": [
        "Dekompresja Brotli dla ASP.NET Core/HttpClient to<b>Domyślnie wyłączone</b>Jawna aktywacja lub bezpośrednia weryfikacja danych wejściowych API",
        "Zaznacz 8.0.33 / 9.0.22 / 10.0.14 itd. Samodzielne elementy zostaną przeorganizowane.<b>NativeAOT zaktualizuje swój pakiet SDK i inne komponenty, a następnie ponownie je opublikuje i wdroży.</b>",
        "To uzupełnienie wcześniej opublikowanej rekomendacji 04:06 JST. Nie jest to nowe naruszenie, które miało miejsce dziś po południu."
      ],
      "metric": "Ścieżki wdrożenia · schematyczny diagram"
    },
    "afternoon-release": {
      "kicker": "14:56 AKTUALIZACJA · Oddzielne udostępnianie, wdrażanie i odzyskiwanie",
      "title": "Opublikowano. Aktualnie transmitowane. Planowane wznowienie.",
      "lede": "Chociaż wszystkie nazywają się „aktualizacjami”, ich statusy są różne. Rozróżnimy już dostarczone poprawki, dystrybucję etapową dla każdego urządzenia oraz cele odzyskiwania, a także sprawdzimy wersję, której faktycznie będziesz używać, oraz poszczególne instrukcje. Diagram przedstawia schematyczne przedstawienie statusów.",
      "points": [
        "PAN-OS: Zaktualizowano status dostępności poprawki 11.1 serii 4 . Kod JSON CNA jest<b>14:45 JST</b>Rejestrowana jest również różnica czasu w stosunku do historii CSAF.",
        "Schludny system operacyjny 26.5.4 jest<b>Dystrybucja fazowa</b>To, że minęło 26 dni, nie oznacza, że wszystkie urządzenia są naprawione.",
        "Następne ogłoszenie dotyczące ConnectWise planowane jest na [data].<b>23:00 JST</b>Nie zastępuj celu ponownego uruchomienia uprawnieniem do ponownego połączenia.",
        "<a href=\"./update-20261026-1456.html\">Raport z szerokiego obszaru, środki zaradcze i źródła podstawowe dla 14:56 →</a>"
      ]
    },
    "night-account-controls": {
      "kicker": "21:35 AKTUALIZACJA · Weryfikacja konta",
      "title": "Zmień hasło i sprawdź pozostałe połączenia.",
      "lede": "Aktualizacja GMO 21 zawiera wskazówki dotyczące ochrony nie tylko kont walutowych, ale także rachunków papierów wartościowych, poczty e-mail, kont Google i innych. Diagram przedstawia schematyczny zakres kontroli.",
      "points": [
        "Zmień hasło na innym zaufanym urządzeniu.<b>Wyloguj się ze wszystkich urządzeń</b>• Zweryfikuj uwierzytelnianie wieloskładnikowe",
        "Sprawdź nieznane powiązane aplikacje, przekierowania poczty e-mail, rozszerzenia i podłączone urządzenia. Synchronizacja przeglądarki zostanie wstrzymana do czasu zakończenia weryfikacji.",
        "Jest to powiadomienie mające na celu przeprowadzenie kontroli zapobiegawczej i nie stanowi potwierdzenia, że wszystkie urządzenia użytkowników są zainfekowane.",
        "<a href=\"./update-20261026-2135.html#gmo-sixth\">Przeczytaj oficjalne ogłoszenie i szczegóły dotyczące relacji →</a>"
      ]
    },
    "night-package-response": {
      "kicker": "21:35 UPDATE · Środowisko dystrybucji i wykonania",
      "title": "Jak daleko powinniśmy się posunąć w sprawdzaniu, czy zainstalowana jest złośliwa wersja?",
      "lede": "Zebraliśmy dodatkowe ostrzeżenia dotyczące złośliwego oprogramowania z npm i PyPI. Są one niezależne od istniejących luk w zabezpieczeniach i analizują działania podjęte podczas instalacji i importu. Diagram przedstawia schemat ścieżki odpowiedzi.",
      "points": [
        "Obejmuje to docelową wersję RC @worca/app, eksplorację danych npm i przetwarzanie trwałości, a także pobieranie kodu zewnętrznego z PyPI netweavex.<b>Dopasuj nazwę do wersji docelowej</b>",
        "Jeśli wersja, której dotyczy problem, zostanie uruchomiona, odizoluj środowisko i cofnij wszelkie dostępne dane uwierzytelniające z bezpiecznego urządzenia. Rozważ odbudowę zgodnie z zaleceniami.",
        "Inne przypadki 2 uwzględniające klasyfikację PROBABLY_PENTEST w analizie nie będą traktowane jako przypadki z potwierdzonymi uszkodzeniami.",
        "<a href=\"./update-20261026-2135.html#npm-worca\">Warunki i działania specyficzne dla pakietu →</a>"
      ]
    },
    "night-restore-status": {
      "kicker": "00:18 AKTUALIZACJA · Odzyskiwanie i powiadamianie",
      "title": "Dalsze przygotowania, ogłaszanie wydarzeń i wznawianie transmisji strumieniowej to różne stany rzeczy.",
      "lede": "Aktualizacja ConnectWise 23:00 wskazuje na kontynuację przygotowań do wdrożenia. Raport GMO 7 12:00 to ostrzeżenie o ataku. SoftBank wznowił udostępnianie informacji o katastrofie i ewakuacji na dzień 23:17 . Diagram przedstawia schematyczną reprezentację sytuacji.",
      "points": [
        "ConnectWise: Nie jest to raport informujący o rozpoczęciu przywracania istniejącej kopii zapasowej.<b>Połączenie zostanie przerwane do momentu zakończenia danej procedury.</b>",
        "GMO: Nie spełnimy prośby. Kontynuowana będzie kontrola konta w celu uzyskania raportu 6 . Korekty 00:20 zostaną wprowadzone po wprowadzeniu standardu.",
        "Usługa SoftBank została wznowiona, ale tylko dla wspomnianej trasy e-mail. Cały proces PHP nie został jeszcze ukończony.",
        "<a href=\"./update-20261027-0018.html#connectwise-1400\">Przejdź do raportu do przeczytania przez 00:18 →</a>"
      ]
    },
    "brotli-reach": {
      "kicker": "00:18 UPDATE · BROTLI REACH",
      "title": "Nawet przy nazwie takiej jak HTTP/ 2 usterka leży w dekoderze.",
      "lede": "HTTP 2 Shell / Node 2 Shell / Brotli 2 Shell jest taki sam CVE-2026-111497 . Ścieżka docelowa różni się w zależności od odpowiedzi HTTP, API .NET, JPEG XL, ClickHouse i Parquet. Diagram przedstawia schematyczny obraz miejsca docelowego.",
      "points": [
        "Platforma .NET zostanie zaktualizowana do środowiska uruchomieniowego.<b>NativeAOT jest ponownie wydany</b>Rozszerzenie br w ASP.NET/HttpClient jest domyślnie wyłączone.",
        "Biblioteki FFmpeg/libjxl, ClickHouse i Arrow nie zostały zweryfikowane pod kątem RCE (efektu zdalnego przetwarzania). Elementy, dla których nie potwierdzono wydania poprawki, będą traktowane jako niepoprawione.",
        "Awaryjny WAF Cloudflare korzysta z domyślnego logowania. Sekwencja HTTP/ 2 Bandit znajduje się w osobnym klastrze.",
        "<a href=\"./update-20261027-0018.html#brotli-jfrog-reach\">Zasięg i reakcja w dół rzeki →</a>"
      ]
    },
    "morning-consul-identity": {
      "kicker": "07:47 UPDATE · SERVICE IDENTITY",
      "title": "Naruszenia autoryzacji API można powiązać z certyfikatami i kluczami prywatnymi.",
      "lede": "CVE-2026-105765 to obejście autoryzacji dla buforowanej odpowiedzi certyfikatu liścia w interfejsie API HTTP agenta Consul. Diagram przedstawia schematyczne przedstawienie warunków, w których ta luka jest ważna, oraz odpowiednich działań, i nie przedstawia obserwacji rzeczywistych szkód.",
      "points": [
        "Zakres jest<b>1.17.0〜2.0.4</b>Konfiguracja z włączoną listą kontroli dostępu (ACL). Interfejs API HTTP korzysta z domyślnej pętli zwrotnej. Warunkiem powodzenia jest dostępność interfejsu API oraz buforowanie certyfikatu docelowego i klucza prywatnego.",
        "Community <b>2.1.0</b>、Enterprise <b>2.1.0 / 1.21.19</b>Sprawdź przewodnik po konkretnej serii.",
        "Dostęp do API będzie ograniczony. Aktualizacje i analizy wszelkich ujawnionych tożsamości usług będą przeprowadzane osobno.",
        "<a href=\"./update-20261027-0747.html#consul-leaf\">Przeczytaj warunki i źródła →</a>"
      ]
    },
    "morning-sandbox-auth": {
      "kicker": "07:47 UPDATE · SANDBOX AUTH",
      "title": "Nawet w środowisku testowym uwierzytelnianie jest wymagane w celu uzyskania dostępu do publicznych interfejsów API.",
      "lede": "CVE-2026-112346 zestawu SDK OpenHands jest mniejsza niż 1.52.0 . Gdy program uruchamiający powiąże się z 0.0.0.0 , a klucze session_api_keys są puste, możliwe jest wykonywanie poleceń z portu publicznego bez uwierzytelniania.",
      "points": [
        "Wykonanie roota to<b>Wewnątrz piaskownicy</b>Może to również mieć wpływ na zamontowane obszary robocze i przekazywane przez Ciebie sekrety.",
        "<b>1.52.0</b>Porównaj kolejne modyfikacje i sprawdź porty publiczne oraz ustawienia uwierzytelniania.",
        "W przypadku środowisk, do których dostęp był możliwy z zewnątrz, sprawdzanie dzienników oraz unieważnianie/ponowne wydawanie sekretów będzie wykonywane osobno.",
        "<a href=\"./update-20261027-0747.html#openhands-sdk\">Przeczytaj warunki i źródła →</a>"
      ]
    },
    "evening-disclosure": {
      "kicker": "18:47 UPDATE · EVIDENCE STATES",
      "title": "Potwierdzenie publikacji i potwierdzenie treści to dwie różne rzeczy.",
      "lede": "Firma GMO potwierdziła ujawnienie rzekomych informacji o firmie i klientach w pliku 12:30 . Treść jest badana i do dnia 13:55 nie potwierdzono żadnych ataków ransomware. Diagram przedstawia schematyczny obraz potwierdzonego statusu.",
      "points": [
        "Podano wyjaśnienie, że po zakończeniu analizy nie znaleziono na terminalach żadnego złośliwego oprogramowania.<b>Kontrola bezpieczeństwa wszystkich urządzeń</b>Nie rozprzestrzeniaj tego dalej.",
        "Potwierdzono oficjalną izolację urządzenia i ochronę konta przed innym zaufanym urządzeniem.",
        "Powstrzymaj się od uzyskiwania dostępu, udostępniania lub rozpowszechniania linków do publicznie dostępnych informacji i zachowaj ostrożność w przypadku prób phishingu.",
        "<a href=\"./update-20261027-1847.html#gmo-publication\">Przeczytaj raporty i odpowiedzi od 8 do 11 →</a>"
      ]
    },
    "evening-release": {
      "kicker": "18:47 UPDATE · RELEASE GATES",
      "title": "Wersja zaplanowana i wersja, która została już wysłana.",
      "lede": "Środki zaradcze PAN-OS PHP są wdrażane seriami. Sprawdziliśmy również różnice w oryginalnym dokumencie KEV między CVE-2026-109618 a CVE-2026-109619 . Diagram przedstawia schemat oddzielania wysyłki od aplikacji i dochodzenia.",
      "points": [
        "<b>10.2.13-h27 / 10.2.16-h12</b>Potwierdzono, że wysłano go do 09:10 JST.",
        "<b>12.1.7-h11 / 12.2.4-h1</b>Potwierdzono, że przesyłka została wysłana do 13:03 JST. Pozostałe przewidywane czasy dostawy (ETA) są sprawdzane osobno.",
        "Wprowadzanie korekt, stosowanie ich do sprzętu i badanie oznak włamania to oddzielne zadania.",
        "<a href=\"./update-20261027-1847.html#pan-hotfix\">Status wysyłki według serii i rezerw KEV →</a>"
      ]
    },
    "evening-threshold": {
      "kicker": "18:47 UPDATE · MPC BOUNDARY",
      "title": "Udział 1 nie jest kompletnym kluczem prywatnym.",
      "lede": "Fireblocks z biblioteki mpc-lib CVE-2026-90975 . Możliwość dotarcia do udziału przodków drużyny z udziału potomków i kodu łańcucha. Warstwa progowa pozostaje. Diagram przedstawia schematycznie warunki.",
      "points": [
        "BIP 32 utwardzone pochodzenie,<b>Całkowita izolacja hierarchii udziałów</b>Nie ufam im.",
        "Kod łańcucha będzie utrzymywany w tajemnicy i nie będzie rozpowszechniany w postaci informacji dostępnych wyłącznie do oglądania.",
        "Dokument CERT nie zawiera żadnych korekt. W przypadku naruszenia praw do udziału w systemie, badana jest hierarchia tej samej strony.",
        "<a href=\"./update-20261027-1847.html#fireblocks-share-boundary\">Przeczytaj warunki uchwalenia i tymczasowego złagodzenia →</a>"
      ]
    },
    "evening-package": {
      "kicker": "18:47 UPDATE · PACKAGE RESPONSE",
      "title": "Przed usunięciem sprawdź środowisko, w którym zostało ono wykonane.",
      "lede": "Raporty o złośliwych pakietach dla konkretnych wersji zostały przesłane do npm i PyPI. Diagram przedstawia historię instalacji, izolację i ścieżki odpowiedzi dotyczące wygaśnięcia tajnych danych i nie przedstawia obserwacji rzeczywistych uszkodzeń.",
      "points": [
        "npm <b>@camera.ui/camera-ui-nvr-windows-amd64 1.6.1</b>：GHSA-2w7v-jwxh-w7wc",
        "PyPI <b>h13t0ry-hello-demo 0.1.0</b>: GHSA-5crq-52j9-fc74 . Odwróć raport powłoki podczas importowania",
        "Porównywane są pliki blokady, CI i historia wykonywania. Zagrożone środowisko jest izolowane, a klucz tajny jest unieważniany i ponownie wydawany z innego bezpiecznego terminala.",
        "<a href=\"./update-20261027-1847.html#malware-camera-ui\">Przeczytaj pakiet docelowy i jego korespondencję →</a>"
      ]
    }
  }
});
