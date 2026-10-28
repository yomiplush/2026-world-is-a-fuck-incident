/* Stored translations; missing scenes filled by Google Cloud Translation. */
window.registerLocale("fr",{
  "ui": {
    "chapter": "BRIEFING",
    "sound": "son",
    "on": "ON",
    "off": "OFF",
    "sources": "source",
    "close": "fermer",
    "tap": "Suivant",
    "replay": "Dès le début",
    "hint": "Appuyer / Cliquer / Espace",
    "hintEnd": "C'est le dernier. Appuyez pour revenir au début.",
    "coverKicker": "INCIDENT BRIEFING · 2026-10",
    "coverTitleA": "Dans un mois,",
    "coverTitleB": "15 articles.",
    "coverSub": "Voici les instances 15 qui se sont chevauchées au cours du mois de 10 dans 2026 , présentées dans l&#x27;ordre chronologique.<br>Outre le noyau Apache et les ajouts à 10 - 23 , une étude approfondie est disponible pour 10 - 24 , ainsi que des compléments pour 10 - 25 , une fonctionnalité spéciale pour l&#x27;écran Tailworm 6 et 10 - 26 (écran du matin 4 . Tous les écrans 65 sont présentés par ordre chronologique. La vérification nocturne du compte et l&#x27;état de récupération/l&#x27;arrivée de Brotli ont été ajoutés pour 00:18 . Des contre-mesures Consul/sandbox ont été ajoutées pour 07:47 et des contre-mesures liées à la vérification, à l&#x27;expédition, au MPC et aux colis pour 18:47 . Pour consulter l&#x27;étude approfondie, rendez-vous dans le rapport. Appuyez pour continuer. Le son sera diffusé.",
    "coverStart": "TAP TO BEGIN",
    "coverFoot": "Sources incluses. ConnectWise a été initialement vérifié dans le cadre de l'enquête 10/25 . Les scènes plus anciennes sont basées sur des documents de cette époque.",
    "drawerTitle": "Sources",
    "drawerFoot": "Le dernier rapport est basé sur les normes 10/27 07:47 . L'écran affiche les enregistrements pour chaque date, les suppléments étant classés par ordre de date de confirmation. L'acquisition effective a lieu après l'établissement de la norme.",
    "asof": "2026 - 10 - 27 07:47 Norme JST",
    "lang": "JA"
  },
  "scenes": {
    "intro": {
      "kicker": "INCIDENT BRIEFING · 2026-10",
      "title": "Chronologie des événements du mois 10 .",
      "lede": "Ce mois-ci, des incidents apparemment sans lien entre eux ont convergé vers une même faille. Appuyez pour avancer chronologiquement.",
      "points": [
        "Enquête initiale 15 ) suivie d&#x27;un suivi à plus grande échelle. Le nombre de cas ne représente pas le nombre total de victimes dans le monde.",
        "<a href=\"./update-20261027-0747.html\">10 / 27 07:47 Dernière enquête →</a> · <a href=\"./timeline.html\">Lu avant la date →</a>",
        "Le son sera diffusé. Vous pouvez le désactiver à l&#x27;aide du bouton SON situé en haut à droite."
      ],
      "metric": "incidents · 1 month"
    },
    "php-silence": {
      "kicker": "PHP CORE · COORDINATED DISCLOSURE",
      "title": "Le calme régnait pendant 70 jours.",
      "lede": "Il s'est écoulé 70 jours entre la découverte et la publication. La période dangereuse n'était pas les 24 heures suivant la publication, mais la période qui la précédait immédiatement.",
      "points": [
        "08 - 01 Calif découvre plusieurs chemins d&#x27;exécution de code à distance / 08 - 11 Signale à PHP",
        "Fuite des détails de 10 - 20 , watchTowr confirme l&#x27;exécution de code à distance",
        "10-21 <b>07:43 UTC</b> Cloudflare a observé des tentatives d&#x27;attaque avant la publication du correctif.",
        "10 - 21 14:00 Version révisée — 8.5.12 / 8.4.27 / 8.3.36 / 8.2.35"
      ],
      "metric": "days from report to public"
    },
    "zeabur": {
      "kicker": "ZEABUR · INFRASTRUCTURE",
      "title": "La clé d'administrateur en clair a ouvert la région 9 .",
      "lede": "Il s'agit de la 2 fois, après le mois 8 . La rotation n'a pas couvert « la clé utilisée cette fois-ci ».",
      "points": [
        "10 - 14 01:36 Intrusion de clé AWS interne / 01:51 Secret du système",
        "Étendu de 12:39 aux variables d&#x27;environnement pour tous les services.<b>865</b> Exécuter des commandes dans le service de base de données",
        "La cause était l&#x27;utilisation de texte brut, d&#x27;identifiants d&#x27;administrateur illimités et d&#x27;un écran d&#x27;administration accessible au public.",
        "Les utilisateurs doivent faire tourner toutes les variables d&#x27;environnement (même si cela a été fait au cours du mois 8 , refaites-le)."
      ],
      "metric": "database services touched"
    },
    "rankmath": {
      "kicker": "RANK MATH SEO PRO · PLUGIN CHANNEL",
      "title": "La distribution officielle a été contaminée pendant 11 heures.",
      "lede": "Le chemin de mise à jour du plugin devient directement le chemin d'attaque. Le score CVSS est 9.8 .",
      "points": [
        "10 - 15 20:02 → 10 - 16 07:12 récupéré en UTC <b>3.0.123</b>",
        "<b>CVE-2026-111862</b> / CVSS 9.8 / Correction : 3.0.124",
        "La mise à jour n&#x27;est pas la solution — recherchez les comptes d&#x27;administrateur, les fichiers supplémentaires et les tâches planifiées.",
        "Wordfence distribue les règles de pare-feu d&#x27;urgence en avance sur le calendrier prévu."
      ],
      "metric": "CVSS · CVE-2026-111862"
    },
    "teamupdraft": {
      "kicker": "TEAMUPDRAFT · CONNECTION KEYS",
      "title": "La clé dans la base de données était le point d'entrée vers des milliers de sites web.",
      "lede": "La clé de connexion peut être utilisée comme une « commande signée et légitime ». Par conséquent, les correctifs existants ne l'empêcheront pas.",
      "points": [
        "Lecture de la base de données clients : informations de contact, mot de passe haché, paramètres FA 2 ,<b>Connexion 3</b>",
        "Les plugins malveillants sont déployés à l&#x27;aide des clés UpdraftCentral / UpdraftVault / UpdraftClone.",
        "La signature étant authentique, elle a été acceptée même si CVE-2026-10795 a été appliquée.",
        "UpdraftPlus 1.26.13 / 2.26.13 déconnectera automatiquement les connexions précédentes de 10 à 18 22:00 BST"
      ],
      "metric": "key types abused"
    },
    "emudhra": {
      "kicker": "EMUDHRA · CERTIFICATE AUTHORITY",
      "title": "Les clés n'ont pas été volées. J'étais trop faible.",
      "lede": "La clé privée de P-__ 384 était un petit entier. Les bits devinés étaient « 4 , 56 , 66 , 115 , 155 , 156 , 230 , 237 ». Seuls les bits 3 à 8 sont présents.",
      "points": [
        "CA intermédiaire <b>8 livre</b>(TLS 6 + signature de code 2 ). Génération de clés pour 2025 - 04 - 30 <b>24 livre</b>Lors de la création d&#x27;une autorité de certification de niveau inférieur, un bug dans l&#x27;encapsulation/désencapsulation a entraîné la création de l&#x27;ensemble de clés faibles « 2 ».",
        "10 - 17 18:05 Rapport UTC → 19:45 Chrome bloque via SPKI → 22:59 Firefox sur tous les appareils. **Apple bloque 6 les certificats TLS, Microsoft bloque 2 les certificats de signature de code****",
        "Le navigateur vient de terminer sa partie. Il reste à aborder la question de Docker, Kubernetes, l&#x27;IoT et le bundle Python ; Go est… <b>CVE-2026-111943</b> Rejeté comme 1.27.3 / 1.26.10",
        "Le plus récent et le plus pointu est <b>Client VPN</b>(Talos / Ars). « Un nettoyage plus important que pour Heartbleed », déclare le cryptographe de Go."
      ],
      "metric": "one private key, literally"
    },
    "ovh": {
      "kicker": "OVHCLOUD CLI · RELEASE ASSETS",
      "title": "Pendant 94 minutes, le binaire officiel était tout autre chose.",
      "lede": "Le code source et la compilation sont corrects. Le problème provenait de l'hypothèse que « les ressources de la version finale ne peuvent pas être remplacées ».",
      "points": [
        "Les actifs sont remplacés dans 10 - 19 14:47 ~ 16:21 (UTC+ 2 ).",
        "La cible est <b>v0.11.0〜v0.15.0</b>L&#x27;impact se limite aux acquisitions réalisées durant cette période.",
        "Cause : Le dépôt ne garantissait pas l&#x27;immuabilité de la version.",
        "La solution tient en un seul paramètre : version immuable + vérification de signature."
      ],
      "metric": "minutes of exposure"
    },
    "oracle": {
      "kicker": "ORACLE · JAVA SE CRITICAL PATCH UPDATE",
      "title": "55 éléments. Le maximum est 7.5 . La difficulté réside dans la version.",
      "lede": "La « version affectée » et la « version corrigée » figurent dans des colonnes distinctes. 21.0.12.1 correspond à la version affectée et 21.0.13 à la version corrigée.",
      "points": [
        "55 éléments / Accès distant sans authentification 49 éléments / CVSS maximum 7.5 / KEV 0 éléments",
        "Impact : 8 u 503 , 11.0.32.1 , 17.0.20.1 , 21.0.12.1 , 25.0.4.1 , 26.0.2 , 27",
        "Correction ( 10 - 20 ): <b>8u511 / 11.0.33 / 17.0.21 / 21.0.13 / 25.0.5 / 27.0.1</b>",
        "Aucune modification n&#x27;a été apportée à JDK 26 ( 26.0.3 n&#x27;existe pas) → Modifié en 27"
      ],
      "metric": "CVEs · 49 remote, no auth"
    },
    "plex": {
      "kicker": "PLEX MEDIA SERVER · KEV",
      "title": "Le SSRF avec 4.3 sert de point d'entrée pour l'exécution du code.",
      "lede": "Les scores individuels sont des moyennes. La norme KEV de la CISA stipule explicitement que ces cas 4 seront répercutés en cascade.",
      "points": [
        "Ajout KEV 10 - 20 / Date d&#x27;expiration <b>10-23</b>( 96656 et 96654 )",
        "Chaîne : Tout jeton X-Plex → SSRF → Appel de plugin → Écriture administrative → Exécution du fichier .so au démarrage",
        "96651 se trouve en dehors de KEV, <b>PlexOnlineToken</b> Lire = Prendre le contrôle du compte",
        "Correction <b>1.43.3.10861</b>Le dernier en date est <b>1.43.5.11029</b>(À compter du 2026 - 10 - 23 10:36 JST). La livraison des paquets NAS sera retardée."
      ],
      "metric": "CVEs in KEV · due 10-23"
    },
    "apache": {
      "kicker": "ADDENDUM · APACHE TOMCAT / HTTPD / TRAFFIC SERVER",
      "title": "Le problème « important » s'est avéré être une interférence entre les utilisateurs.",
      "lede": "Les éléments 3 de Tomcat fonctionnent selon un mécanisme différent, mais le résultat est identique. Le niveau « faible » de httpd est représenté par 7.5 . La gravité n'est pas indiquée par les numéros 1 .",
      "points": [
        "Tomcat : Contournement de l’authentification (JNDIRealm SASL non-GSSAPI) + Interférence de réponse HTTP/ 2 /AJP — <b>11.0.27 / 10.1.61 / 9.0.123</b>",
        "httpd <b>2.4.69</b>: écriture hors limites pour mod_rewrite UAF et mod_proxy_html. Apache est configuré sur faible, NVD est configuré sur 7.5",
        "Serveur de trafic : Contrebande de requêtes 2 ( 8.9 / 8.7 )",
        "KEV contient des éléments 0 . Cependant, le fait qu&#x27;ils soient « non publiés » ne signifie pas qu&#x27;ils sont sûrs."
      ],
      "metric": "Tomcat · auth bypass (CVSS 4.0)"
    },
    "php-race": {
      "kicker": "PHP · THE SIX-HOUR GAP",
      "title": "L'essai avait eu lieu 6 heures avant la correction.",
      "lede": "C'est le genre de vulnérabilité pour laquelle « paniquer après la publication d'une preuve de concept (PoC) » ne suffira pas. Node.js fonctionnait également le même jour.",
      "points": [
        "<b>07:43 UTC</b> Cloudflare surveille les tentatives d&#x27;attaque avant la publication du correctif.",
        "<b>14:00</b> PHP publie une version corrigée / <b>14:17</b> NVD publie les CVE",
        "Même jour : Node.js 22.23.4 / 24.22.1 / 26.12.1 (mise à jour du bundle CA également incluse)",
        "Les heures 24 accessibles au public et la configuration exposée seront vérifiées séparément pour toute infraction."
      ],
      "metric": "probes before the fix"
    },
    "gitlab": {
      "kicker": "GITLAB · CVSS 10.0",
      "title": "Cela s'applique même si vous avez appliqué le patch la semaine dernière.",
      "lede": "La mise à jour du mois 10 du jour 12 n'est disponible qu'à partir du 19.2 . Cette version 1 se trouve au-delà de cette date.",
      "points": [
        "<b>CVE-2026-110264</b> Dépassement d&#x27;entier dans Onigmo / Exécution de code à distance non authentifiée / Tout à partir de 7.0 ( 2014 )",
        "Modification : 19.5.1 / 19.4.3 / 19.3.6 / 19.2.9 / 19.1.9 / 19.0.10 / 18.11.13",
        "Les environnements qui ont été corrigés le 10 mois 12 jour sont également soumis à la même règle s&#x27;ils sont inférieurs à 19.2.9 (la version corrigée est 1 au-dessus).",
        "Il n&#x27;existe aucune solution de contournement publique. Baisser le prix rendrait le service inaccessible."
      ],
      "metric": "CVSS · unauthenticated"
    },
    "npm": {
      "kicker": "PACKAGE CHANNELS · FOUR INCIDENTS",
      "title": "Les documents distribués sont eux-mêmes devenus l'arme offensive.",
      "lede": "L'élément 10 du mois 8 présente un problème de distribution de code. La provenance indique uniquement le lieu de fabrication.",
      "points": [
        "LiteLLM 1.107.0 : Volé au démarrage. Dépôt similaire. <b>Berri-AI</b> Construire à partir de",
        "tensorlake@__ 0.5.144 : Si vous le révoquez <b>$HOME</b> « Jeton d&#x27;otage » qui efface",
        "@subql/common@ 5.8.3 : Démarre à la fois lors de l&#x27;installation et de l&#x27;importation.",
        "GhostAction : faux security-audit.yml <b>345</b> Diffuser les secrets et l&#x27;historique du dépôt."
      ],
      "metric": "repos swept · 16 minutes"
    },
    "railway": {
      "kicker": "RAILWAY · ENVIRONMENT VARIABLES",
      "title": "Les variables d'environnement étaient stockées dans un emplacement secret.",
      "lede": "« Cette attaque s'inscrit dans une série de cyberattaques visant les fournisseurs de services d'inférence IA », a écrit le fournisseur.",
      "points": [
        "Il est possible que des variables d&#x27;environnement client aient été lues alors qu&#x27;elles étaient chiffrées, et certaines ont pu être déchiffrées.",
        "Durant l&#x27;enquête, tous les déploiements ont été suspendus et les fournisseurs en amont ont été priés de révoquer préventivement les clés.",
        "Ce dont on a besoin, ce n&#x27;est pas d&#x27;une « clé qui aurait pu fuiter »,<b>Tous</b>Rotation",
        "Le mot de passe SMTP, le secret de signature du webhook et JWT_SECRET sont également inclus dans les variables d&#x27;environnement."
      ],
      "metric": "env vars to rotate"
    },
    "bind": {
      "kicker": "ADDENDUM · ISC BIND 9 / DNS",
      "title": "Un paquet 1 retransmis corrompt la mémoire.",
      "lede": "Lorsqu'un paquet UDP signé avec GSS-TSIG est rejoué, le répertoire spécifié est corrompu. L'ISC indique explicitement qu'il n'existe « aucune solution de contournement ».",
      "points": [
        "<b>CVE-2026-94300</b> / CVSS 8.1 (AV:N・AC:H)/Gravité <b>High</b> / À distance",
        "Impact : 9.11.0 – 9.18.50 , 9.20.0 – 9.20.29 , 9.21.0 – 9.21.26 (et la série S 1 ) → Correction <b>9.20.30 / 9.21.27</b>",
        "Le point d&#x27;entrée est le gestionnaire GSS-TSIG. Utilisez `named-checkconf -p | grep -i gssapi` pour vérifier s&#x27;il est configuré.",
        "Il n&#x27;existe aucune solution de contournement. La seule option est de déplacer les branches EOL ( 9.11 à 9.18 ) vers 9.20 / 9.21"
      ],
      "metric": "CVSS · Aucune solution de contournement disponible"
    },
    "lkml": {
      "kicker": "ADDENDUM · LINUX KERNEL / LKML",
      "title": "La liste publique comporte 0 jours, avec 6 entrées.",
      "lede": "ZDI a publié son message sur la liste de diffusion publique LKML plutôt que sur une liste de sécurité privée. Greg Kroah-Hartman répond à chaque message.",
      "points": [
        "SMB Direct sous-dépassement d&#x27;entier (<b>9.0</b>) et ksmbd est en conflit (<b>9.0</b>) — Les deux sont des RCE distants",
        "LPE dans skb_zerocopy, écriture hors limites dans vmwgfx, nvmet non initialisé, dépassement de capacité de la pile de requêtes TCP.",
        "la ligne principale est<b>non censuré</b>Correctifs appliqués à la branche v7.5 et à la branche suivante (à partir de 10 - 22 ). Aucun commit de la branche principale ne fait référence aux identifiants ZDI.",
        "Réduction de l&#x27;exposition : Non utilisée <b>ksmbd</b> Arrêtez cela / N&#x27;exposez pas SMB Direct à des personnes non fiables"
      ],
      "metric": "reports sent public"
    },
    "sweep": {
      "kicker": "THE SWEEP · NVD, 14 DAYS",
      "title": "La même commande transforme 125 en 104 . Le monde n'a pas changé.",
      "lede": "La période de validité se termine aujourd'hui. Par conséquent, les chiffres évoluent avec le temps. Le nombre de cas ne mesure pas le risque, mais plutôt la manière dont les informations et les analyses sont synthétisées.",
      "points": [
        "Il y a 9 heures, il y avait 125 éléments, et il y en a maintenant 104 . Voici le détail : <b>− 17 (Bord de la fenêtre) − 4 (Retirer de CRITIQUE) + 0 (Nouveau)</b>",
        "La liaison NVD CPE est <b>26%</b>Les éléments 381 les plus récents publiés au cours des 24 dernières heures sont <b>0%</b>(L&#x27;analyse est toujours en cours)",
        "EPSS le plus élevé est <b>5.76%</b> — php 2 shell 109619 . Cependant, descendez jusqu&#x27;à 8.1 et sortez de CRITICAL.",
        "Les scores CNA et NVD sont séparés : MOVEit / TeamCity est 8.1 (AC:H) et 9.8 (AC:L)"
      ],
      "metric": "critical CVEs : known exploited"
    },
    "closing": {
      "kicker": "WHAT IT MEANS",
      "title": "Le risque ne réside pas dans le code que vous avez écrit.",
      "lede": "Ce qui a dysfonctionné au cours du mois de 10 c'est le « système de confiance qui détermine quel code s'exécute ». Les contrôles qui fonctionnent sont subtils et consistent principalement en des paramètres.",
      "points": [
        "L&#x27;immuabilité et la vérification de la signature sont activées lors de l&#x27;installation.",
        "Correction de version par hachage. N&#x27;utilisez pas `latest`. Consultez les différences avec les étiquettes Git.",
        "Ne stockez pas les identifiants d&#x27;administrateur en clair ni dans un format permanent. Ne divulguez pas les informations d&#x27;administration.",
        "La base de données du fournisseur suppose qu&#x27;elle détient ses propres clés (TeamUpdraft / Railway / Zeabur).",
        "Le noyau est une « limite qui ne peut être fixée application par application ». L&#x27;exécution de code au sein d&#x27;un conteneur équivaut à un accès root sur l&#x27;hôte."
      ]
    },
    "infinity-core": {
      "kicker": "POSTSCRIPT · LINUX KERNEL",
      "title": "Au cœur du noyau se trouvent des raccourcis 6 vers la racine.",
      "lede": "Hyunwoo Kim a publié « Infinity Core » sur oss-security. La 5 permet aux utilisateurs non privilégiés d'accéder aux privilèges root, et la 5 permet aux utilisateurs de quitter un conteneur pour revenir à l'hôte.",
      "points": [
        "Minuteur / Signal / MM / Futex / Planificateur / SLAB. Aucun réseau, BPF ou espace de noms utilisateur n&#x27;est utilisé.",
        "NVD est 4 éléments <b>7.8</b>Les éléments 2 n&#x27;ont pas de score. Les éléments 6 sont également avant analyse.<code>Received</code>KEV n&#x27;a pas",
        "<b>Le correctif a déjà été publié.</b>6.6.158 / 6.12.112 / 6.18.54 / 7.2.8 , le planificateur est 7.2.9 . La stabilité actuelle est dépassée dans tous les cas.",
        "Ce qui fonctionne, c&#x27;est<b>redémarrage</b>Si le programme s&#x27;exécute sur un noyau plus ancien, le simple fait de l&#x27;installer le laissera ouvert."
      ],
      "metric": "CVE : preuve de concept d’acquisition de la racine"
    },
    "blindspot": {
      "kicker": "POSTSCRIPT · THE BLIND SPOT",
      "title": "Sweep se concentre uniquement sur le travail de base de données.",
      "lede": "Que je recherche par date de publication, par date de mise à jour ou que je parcours le flux des livres 12 , Infinity Core n'est jamais apparu.",
      "points": [
        "La date de publication du CVE <b>9/4〜10/12</b>La preuve de concept a été publiée. <b>10/16</b> — 6 Différence hebdomadaire",
        "Les enregistrements NVD ne sont pas mis à jour lors de l&#x27;actualisation horaire 6 . Les enregistrements 6 ne sont pas mis à jour non plus. <code>Received</code>",
        "13 Titre du livre <code>infinity</code> dents <b>0 articles</b>RSS est aussi une fenêtre, et les enregistrements se trouvent du côté des archives.",
        "L&#x27;axe ajouté est<b>Canaux de divulgation</b>。<code>oss-sec</code> Au cours du tour où cela a été ajouté, nous avons pu récupérer 4 qu&#x27;un autre livre 12 avait laissé tomber."
      ],
      "metric": "Le flux qui a signalé cet incident 6"
    },
    "ecosystem": {
      "kicker": "POSTSCRIPT · THE ECOSYSTEM",
      "title": "Il existait des vulnérabilités critiques 2 qui n'étaient pas encore des CVE.",
      "lede": "Base de données des avis de sécurité GitHub 24 heures. Les exécutions de code à distance non authentifiées dans Next.js 2 ne possèdent pas encore de CVE.",
      "points": [
        "Next.js <code>use cache</code> Exécution de code à distance non autorisée pour l&#x27;optimisation d&#x27;image (SVG). La solution est : <b>16.4.1</b> / <b>15.5.28</b>",
        "DOMPurify 3.4.17、Pillow 13.0.0、GitPython 3.2.1、<code>toml</code> 5.0.1、Storybook 8.6.19",
        "Le processus de filtrage CVE ne révélera ce problème 2 qu&#x27;à la toute fin. La décision repose sur le nom du paquet et la version corrigée.",
        "Le même jour, le numéro de version du bundle Python CA a également été publié : <code>certifi</code> 2026.10.19 / <code>pip</code> 26.2.2"
      ],
      "metric": "Recommandation d'emballage pour le temps 24"
    },
    "node2shell": {
      "kicker": "POSTSCRIPT · NODE.JS",
      "title": "Cela fonctionnait avec la version officielle.",
      "lede": "Imperva a exécuté avec succès le code à partir de données Brotli spécialement conçues sur l'image Node.js distribuée 24.22.0 . Aucun débogueur ni aucune compilation instrumentale n'ont été nécessaires.",
      "points": [
        "Il y a des entrées 2 .<code>fetch()</code> Le chemin qui consomme la réponse Brotli non fiable, et le chemin où Express 5 / body-parser 2 décompresse le corps de la requête. <code>http.createServer()</code> Il ne s&#x27;étendra pas automatiquement.",
        "La vérification a été effectuée sur les versions Linux arm 24.22.0 64 et 1 . Les versions 22 __.x / 26 __.x et les autres architectures n&#x27;ont pas été vérifiées et ont nécessité plusieurs tentatives.",
        "La même entrée <b>24.22.1</b> Ils ont refusé. Aucun cas d&#x27;utilisation abusive en situation réelle n&#x27;a été signalé à ce jour.",
        "Les enregistrements NVD sont CVSS 4.0 <b>9.2</b> Cependant, 3.1 est manquant. Il n&#x27;apparaît pas dans la liste CRITIQUE filtrée par niveau de gravité."
      ],
      "metric": "La version qui a fonctionné : La version rejetée est 24.22.1"
    },
    "prepatch": {
      "kicker": "POSTSCRIPT · PHP2SHELL",
      "title": "L'essai avait commencé 4 jours avant que la recommandation ne soit émise.",
      "lede": "Le honeypot AWS présente encore des tentatives d'exploitation 2026 , 10 et 17 , et la preuve de concept publique a été publiée 12 quelques heures avant la levée de l'embargo. La date de divulgation ne correspond pas à la date de la première attaque.",
      "points": [
        "Avec le temps 24 avant correction <b>482,342</b> Requête / 122 , 311 Session / 21 , 998 Site / 103 Pays (observation Imperva)",
        "cependant<b>procès</b>Il ne s&#x27;agit pas d&#x27;une infraction. Sophos n&#x27;a pas installé de dérivé de Mirai, et Dataminr n&#x27;a commis aucune infraction connue.",
        "KEV n&#x27;est toujours pas inclus. EPSS est 5.31 % / 5.76 %",
        "Le point de départ de l&#x27;enquête <b>10-17</b>À compter de la date de divulgation, le premier jour 4 est omis."
      ],
      "metric": "Premier essai → Recommandation"
    },
    "filters": {
      "kicker": "POSTSCRIPT · THE FILTER",
      "title": "Même avec 9.9 , il n'apparaîtra pas dans la liste.",
      "lede": "Le filtre de gravité de NVD ne compte que ses propres CVSS (primaires) 3 __.x. Les réponses 9.9 d'un CNA seront comptabilisées comme des réponses 0 , même si elles apparaissent sur le même enregistrement.",
      "points": [
        "<code>?cveId=CVE-2026-91637&amp;cvssV3Severity=CRITICAL</code> dents <b>0 articles</b>L&#x27;enregistrement contient 9.9 (Secondaire).",
        "Pour la même raison, <code>CVE-2026-111497</code>(CVSS 4.0 uniquement 9.2 ) et <code>CVE-2026-114625</code>(CNA 9.9 ) n&#x27;apparaît pas non plus dans la liste.",
        "10 heures <b>104 → 98</b>Des éléments 6 sont apparus et des éléments 0 ont été ajoutés, mais aucun n&#x27;a été corrigé.",
        "Les analyses publiques, quel que soit leur niveau de gravité, et les flux des fournisseurs détectent les deux. Une liste filtrée ne répond pas à la question : « Quelles failles sont exploitées ? »"
      ],
      "metric": "Réponse de CNA à 9.9"
    },
    "wide": {
      "kicker": "POSTSCRIPT · THE WIDE SWEEP",
      "title": "La liste CVE ne mentionne aucun des éléments 4 .",
      "lede": "Cette fois-ci, nous avons également pris en compte les actualités et les éléments X. 4 ont été trouvés en premier et vérifiés auprès de sources primaires. Les chiffres sont ceux publiés par le fournisseur.",
      "points": [
        "Arista VeloCloud Orchestrator <code>CVE-2026-114625</code>: 0 -jour, actuellement utilisé à mauvais escient,<b>9.9</b>Si vous êtes connecté, utilisez le compte superutilisateur. Pour une infrastructure sur site, utilisez 5.2.3.18 / 6.1.3.10 / 6.4.2.12",
        "Linux KSMBD: <code>ZDI-CAN-33774</code> Il s&#x27;agit 9.0 qui ne nécessite pas d&#x27;authentification. Aucun correctif CVE ni correctif principal n&#x27;est disponible pour le moment.",
        "Identifiant Capcom <b>11,774,247</b> Le nombre d&#x27;articles. Onamae.com Desktop Cloud est le plus grand <b>26,739</b> Arrêtez la machine",
        "Les articles de presse ont servi de point de départ, mais les preuves provenaient du site du fournisseur. Arista a obtenu directement la notification initiale de 10 / 24 . J&#x27;ai réexaminé l&#x27;utilisation abusive, les conditions d&#x27;authentification et les versions modifiées."
      ],
      "metric": "Cas non mentionnés dans la liste CVE"
    },
    "php-next": {
      "kicker": "POSTSCRIPT · PHP, TWO DAYS LATER",
      "title": "Aucun correctif d'urgence n'a été publié.",
      "lede": "10 de PHP, faisant suite à CVE-2026-115560 et 23 , représente une autre voie d'exécution de code à distance (RCE). Aucune version affectée, aucun score ni aucun correctif n'ont été communiqués ; les développeurs indiquent qu'une recommandation complète sera publiée dans la prochaine version.",
      "points": [
        "La condition est de tous les 4 . Dans les paramètres... <code>php_binary</code> / <code>php_serialize</code>, pendant l&#x27;exécution <code>ini_set</code> dans <code>php</code> péter,<code>session_start()</code> Avant, et avec la progression du téléchargement activée.",
        "Les applications qui ne modifient pas les gestionnaires pendant leur exécution peuvent laisser cette fonctionnalité activée — PHP lui-même le précise.",
        "La contre-mesure est la ligne 1 : <b><code>session.upload_progress.enabled=0</code></b>10 - Similaire à l&#x27;assouplissement de 109619 pour 21 , aucun travail supplémentaire n&#x27;est requis s&#x27;il a déjà été appliqué.",
        "Lors de la précédente récupération 10 / 23 , aucun enregistrement NVD n&#x27;a été trouvé. La notification PHP reste inchangée et, malgré l&#x27;ajout de KEV 17 , aucun 115560 n&#x27;est présent. L&#x27;absence de liste ne garantit pas la sécurité."
      ],
      "metric": "Détente jusqu'à la prochaine publication prévue."
    },
    "update-scope": {
      "kicker": "10-24 UPDATE · UPDATE-SCOPE",
      "title": "Sortons à nouveau de la zone CVE.",
      "lede": "Une enquête approfondie sur 10 - 24 . Nous avons examiné les informations nouvelles et mises à jour, les canaux de divulgation et les produits nationaux, et compilé une liste des principaux cas 24 avec leurs sources.",
      "points": [
        "Le NVD le plus récent pour 30 heures est<b>Nouveau 526 / Mis à jour 3 , 531</b>Ce sont des doublons et ils ne seront pas additionnés.",
        "GitHub se trouve dans Windows.<b>Recommandation 82</b>Les vulnérabilités critiques 6 sont incluses. Même celles sans CVE attribué sont incluses.",
        "KEV est un ajout à partir de 10 / 10 .<b>17 articles</b>Les chercheurs obtiennent également 14 officiels et des JVN.",
        "24 représente le nombre de produits ou d&#x27;incidents regroupés. Cela ne signifie pas qu&#x27;il y a 24 nouveaux cas d&#x27;infraction."
      ],
      "metric": "reviewed groups"
    },
    "update-exploited": {
      "kicker": "10-24 UPDATE · UPDATE-EXPLOITED",
      "title": "Premièrement, il existe des cas 2 qui sont mal utilisés.",
      "lede": "Arista VCO et Nextcloud Built-in CODE ont ajouté des KEV à 10 - 23 . La CISA a demandé des enquêtes numériques sur les deux.",
      "points": [
        "VCO est<b>Compte à privilèges limités</b>Mais j&#x27;ai été promu. Sur site 5.2.3.18 / 6.1.3.10 / 6.4.2.12 et au-delà.",
        "Le code intégré est<b>Mettre à jour ou supprimer à partir de 26.4.303 .</b>La simple désactivation de l&#x27;application ne suffit pas à empêcher cela.",
        "La condition est que proxy.php soit arrêté en mode CODE. Collabora Online autonome n&#x27;est pas inclus.",
        "La date limite de CISA est<b>10/26</b>(Pour le gouvernement fédéral américain). Préservation des preuves avant modification et enquête sur les infractions après modification."
      ],
      "metric": "KEV additions · 10.23"
    },
    "update-packages": {
      "kicker": "10-24 UPDATE · UPDATE-PACKAGES",
      "title": "Images, Wasm, authentification, proxy.",
      "lede": "Nous examinerons deux limites 4 différemment dans des conditions distinctes. Dans les deux cas, le score seul ne révèle pas votre exposition.",
      "points": [
        "<b>Pillow 13.0.0</b>Lors de l&#x27;installation de FPX, les images sont envoyées au centre de traitement d&#x27;images, quelle que soit leur extension. La preuve de concept publique est une démonstration utilisant une configuration fixe.",
        "<b>Wasmtime -115889</b>La série 36 est 36.0.19 , 37 à 42 sont 43.0.0 et suivantes. Limites de la gestion du WebAssembly non fiable dans Cranelift.",
        "<b>Laravel 12.68.0 / 13.29.0</b>Pour contourner l&#x27;authentification à l&#x27;aide de TokenGuard + une configuration spécifique MySQL/MariaDB.",
        "<b>Echo 4.16.1 / 5.4.1</b>La connexion établie après le rejet de la requête WebSocket contourne l&#x27;autorisation de routage. L&#x27;autorisation indépendante côté amont est distincte."
      ],
      "metric": "package boundaries"
    },
    "update-runtime": {
      "kicker": "10-24 UPDATE · UPDATE-RUNTIME",
      "title": "L'application elle-même, ainsi que les accessoires inclus.",
      "lede": "Même si la CVE est répertoriée sous le nom GitLab, elle affecte les utilisateurs de Ruby, et la mise à jour du paquet Brotli du système d'exploitation laissera toujours la copie Perl intégrée.",
      "points": [
        "<b>Ruby 4.0.9 / 3.4.12 / 3.3.13</b>La cible est une application qui compile les expressions régulières de l&#x27;attaquant.",
        "<code>Regexp.timeout</code>Les limites de longueur sont insuffisantes. 4.0.8 ne constitue pas une solution complète.",
        "<b>IO::Compress::Brotli 0.023</b>La cible se situe entre 0.004001 et 0.023 . La mise à jour de la bibliothèque du système d&#x27;exploitation seule ne résoudra pas le problème.",
        "<b>NGINX 1.30.6 / 1.31.7</b>Les éléments 5 dépendent de la configuration, et certaines RCE nécessitent un contournement ASLR, etc."
      ],
      "metric": "runtime checks"
    },
    "update-agents": {
      "kicker": "10-24 UPDATE · UPDATE-AGENTS",
      "title": "Qui peut utiliser l'autorité de l'agent ?",
      "lede": "L’authentification, le protocole TLS, l’isolation des notes, le chargement des modèles – des barrières qui existaient bien avant que le terme « IA » ne soit inventé – protègent les secrets et les outils.",
      "points": [
        "<b>PraisonAI 4.6.59</b>Salut. AgentOS avait toujours des conversations non authentifiées même avec l&#x27;ancienne version patchée 4.5.128",
        "<b>req_llm 1.29.0</b>La vérification TLS est absente de la route WebSocket à partir de 1.9.0 . La route HTTP est différente.",
        "<b>obsidian-tc 1.3.1</b>D&#x27;accord. J&#x27;ai également confirmé la séparation de la liaison Origin/DNS et du coffre-fort dans la boucle locale.",
        "<b>AWS Multi Model Server est en fin de vie.</b>Aucune version révisée disponible, migration requise. x 402 nécessite une vérification séparée des limites de dépenses et de l&#x27;origine de la signature."
      ],
      "metric": "agent boundaries"
    },
    "update-japan": {
      "kicker": "10-24 UPDATE · UPDATE-JAPAN",
      "title": "Les systèmes d'entreprises nationales également.",
      "lede": "Il ne s'agit pas uniquement de la plateforme de développement qui sera exposée en externe. Nous examinerons également les limites entre les applications métier, l'intégration LINE et les API de gestion.",
      "points": [
        "<b>1.5.9.1</b>À : Avec Linux/Docker, etc. + une configuration LDAP spécifique, la connexion est possible en utilisant uniquement des identifiants valides.",
        "<b>LIFF SDK 2.31.1</b>2.20.0 ~ 2.31.0 DOM XSS",
        "<b>Mise à jour JPCERT 10 / 23</b>Ajout d&#x27;une tentative d&#x27;abus de la plateforme de pénétration de l&#x27;IA comme cas E.",
        "Autorisation au niveau de l&#x27;API, privilèges et expiration des jetons, limitation du débit et suspension en cas de divulgation administrative inutile. Ne concluez pas à une infraction sur la seule base d&#x27;adresses IP ou de JA 4"
      ],
      "metric": "domestic checks"
    },
    "update-devices": {
      "kicker": "10-24 UPDATE · UPDATE-DEVICES",
      "title": "Les équipements sont classés par gamme de produits.",
      "lede": "L'analyse de sécurité informatique (CSAF) officielle de HPE comporte des éléments 72 , dont certains sont soumis 8 l'analyse de sécurité informatique (CVSS) 10.0 . Pour certains produits et terminaux industriels, aucune version corrigée ne sera publiée.",
      "points": [
        "<b>HPE AOS</b>: 10.8.1.2 / 10.7.2.7 / 10.4.1.14 / 8.13.3.1 / 8.10.0.24 . Associez les CVE aux gammes de produits.",
        "<b>Mitsubishi Electric GENESIS / ICONICS etc.</b>Correction des réponses aux défis, DCOM, libwebp, etc. Voir les correctifs/solutions de contournement spécifiques au produit.",
        "<b>Lenovo AVB</b>Plusieurs appareils utilisent une clé de test publique. Un accès physique est requis. La fin de vie (EOL) n&#x27;est pas définie.",
        "Ne confondez pas les scores parfaits ou le nombre de modèles compatibles avec la vérification réelle des utilisations abusives. Pour les produits non pris en charge, envisagez une migration."
      ],
      "metric": "HPE AOS CVEs"
    },
    "update-trust": {
      "kicker": "10-24 UPDATE · UPDATE-TRUST",
      "title": "Consultez les prochaines étapes après la mise à jour.",
      "lede": "Listes de blocage, confiances de startups et identifiants divulgués : nous avons également documenté des aspects qui vont au-delà de la simple application de correctifs.",
      "points": [
        "<b>Firefox 158.0.1 / Android 158.0.2</b>Ces modifications incluent l&#x27;intégration du blocage des autorités de certification intermédiaires eMudhra. Thunderbird 153.5.1 corrige également les problèmes liés à l&#x27;authentification des e-mails.",
        "<b>BlackX</b>Voici le kit de démarrage après l&#x27;obtention des privilèges d&#x27;administrateur. L&#x27;application des correctifs au système d&#x27;exploitation et la prise en compte de l&#x27;expiration du certificat DBX de démarrage sécurisé sont des processus distincts.",
        "<b>k 0 t Enquête 70 , 000 sur</b>Cela concerne les identifiants, etc., et non le nombre d&#x27;entreprises concernées. Les clés et les accès restants seront examinés en parallèle de la mise à jour.",
        "JPEG XR<b>jxrlib</b>Des rapports de recherche existent également à ce sujet. La vulnérabilité CVE n&#x27;est pas confirmée et aucune preuve d&#x27;exécution de code n&#x27;a été trouvée. Vérifiez l&#x27;état des correctifs auprès du distributeur."
      ],
      "metric": "trust checks"
    },
    "oct25-priorities": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "Vous recevrez des mises à jour.",
      "lede": "16:34 l' 10 , les données de l'enquête de la 25 sont complétées. Elles sont acquises après l'heure de référence et ne correspondent pas toutes à des événements nouveaux pour aujourd'hui.",
      "points": [
        "<b>Patch the Planet</b> Ceci est recommandé. Il s&#x27;agit d&#x27;une initiative visant à soutenir la correction des vulnérabilités dans les logiciels libres.",
        "Ressources publiques ayant déjà fait l&#x27;objet d&#x27;un usage abusif → Mise à jour d&#x27;urgence → Investigation des clés et des permissions → Vérification des copies groupées.",
        "La fenêtre fixe NVD est nouvelle<b>99</b>articles/mises à jour<b>5,432</b>Articles. Ne les ajoutez pas car ce sont des doublons.",
        "KEV reste identique à 10 / 23 . Aucune nouvelle inscription ne sera utilisée comme déclaration de sécurité."
      ]
    },
    "oct25-fortinet": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "N’attendez pas la publication publique du CVE.",
      "lede": "Fortinet annonce une mise à jour de sécurité d'urgence pour ses produits 5 . Plus de détails seront disponibles sur 11 et 10 .",
      "points": [
        "<b>FortiOS</b>: 8.0.2 / 7.6.8 / 7.4.13 / 7.2.14",
        "<b>Manager / Analyzer</b>: 8.0.2 / 7.6.8 / 7.4.12 / 7.2.13",
        "<b>Mail</b>: 8.0.2 / 7.6.7 / 7.4.9。<b>Authenticator</b>: 8.0.4 / 6.6.11",
        "Le modèle, la série et la procédure de mise à jour seront vérifiés. Les restrictions d&#x27;accès et de gestion sont temporaires. La notification ne présume pas d&#x27;une utilisation abusive."
      ]
    },
    "oct25-runtime-trust": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "Une confiance qui demeure en dehors du navigateur.",
      "lede": "Java nécessite des mises à jour d'urgence pour 10 / 24 , et Python SSL requiert une liste noire des clés compromises. Les mises à jour régulières ne suffisent pas.",
      "points": [
        "<b>Java CVE-2026-114820</b>Procédure de mise à jour d&#x27;urgence ou de vérification officielle du magasin de clés/révocation. Redémarrez chaque JRE.",
        "Tables Oracle telles que 8 u 511 -b 32 etc.<b>Version Influence</b>Ne transcrivez pas ceci comme une version révisée.",
        "<b>Python CVE-2026-115557</b>La fusion principale et l&#x27;implémentation dans la version de distribution sont des processus distincts. Veuillez consulter le code source de la distribution.",
        "Inventaire du système d&#x27;exploitation, de certifi, du JRE intégré, du conteneur et du magasin propriétaire."
      ]
    },
    "oct25-dns": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "Le DNS devrait être proposé comme un produit distinct.",
      "lede": "Des mises à jour sont nécessaires non seulement pour BIND, mais aussi pour le résolveur et le DNS faisant autorité. Même des produits aux noms similaires peuvent nécessiter des mises à jour différentes.",
      "points": [
        "<b>BIND</b>: 9.20.30 / 9.21.27 . Correspond aux conditions de retransmission GSS-TSIG et aux conditions dépendantes de la configuration.",
        "<b>Unbound</b>: 1.26.2 . 5 éléments pour la déclaration de qualité, la vérification et le chargement.",
        "<b>PowerDNS Recursor</b>: 5.3.12 / 5.4.8。<b>Authoritative</b>: 4.9.18 / 5.0.8 / 5.1.5",
        "<b>Knot DNS</b>: 3.6.2 . Ceci est distinct de Knot Resolver. Ne confondez pas le nombre de CVE avec le nombre d&#x27;exploits réels."
      ]
    },
    "oct25-cloud-access": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "L'autorité demeure après la réparation.",
      "lede": "Cette mise à jour fait suite à la vérification initiale effectuée par ConnectWise et à la confirmation de la cause par LiteLLM. La récupération par le fournisseur ne supprime pas à elle seule l'accès client restant.",
      "points": [
        "<b>ConnectWise</b>Rester désactivé jusqu&#x27;à la publication des instructions officielles de restauration. 10 / 26 sont des cibles pour une reprise progressive.",
        "Ne supprimez pas précipitamment ; conservez les preuves. Examinez l’authentification du principal de service, les opérations sur le graphe, ainsi que les clés, les propriétaires et les autorisations supplémentaires.",
        "<b>LiteLLM</b>Clé principale non révoquée → Jeton OAuth GitHub → Secret CI. Mise à jour de la première estimation",
        "Ne lancez pas pip dans l&#x27;environnement concerné. Isolation, reconstruction et révocation des clés accessibles."
      ]
    },
    "oct25-bundles": {
      "kicker": "10-25 UPDATE · 16:34 JST",
      "title": "Vérifiez l'adresse de livraison et les éventuelles exceptions.",
      "lede": "Traitement de la compression, proxy, intégration aux réseaux sociaux, clients industriels : même pour une même tâche de mise à jour, les conditions d’exécution diffèrent.",
      "points": [
        "<b>Brotli</b>: Bun 1.4.4 , brotli 1.2.1 / brotlicffi 1.2.1.0 . Recompilez également l&#x27;exécutable Bun compilé.",
        "<b>Postiz</b>: 2.25.3 . Vérifiez les conditions pour les utilisateurs enregistrés et la fonction de liaison.",
        "<b>ATS</b>: 9.2.16 / 10.1.5 / 10.2.1 . Cependant, CVE-2026-111817 est<b>Non corrigé avec 9.2.16</b>",
        "<b>open62541</b>: 1.5.7 . Les clients recevant des définitions de type provenant de serveurs OPC UA malveillants sont également ciblés."
      ]
    },
    "http2shell": {
      "kicker": "POST FOLLOW-UP · CVE-2026-111497",
      "title": "HTTP 2 Shell. Le même défaut, même dans les packages fournis.",
      "lede": "Le message spécifié sera comparé à la source principale. Les chemins de déploiement de Brotli seront également vérifiés au-delà de Node.js. Il ne s'agit pas d'une nouvelle vulnérabilité limitée à HTTP/ 2 .",
      "points": [
        "Google CNA est<b>CVSS v4.0 9.2</b>Le nœud 2 correspond à la même CVE que Shell. Ceci est indépendant de la vérification de l&#x27;exploitation effective.",
        "<b>Envoy</b>: 1.40.0 / 1.39.3 / 1.38.6 / 1.37.8 . Les paramètres de déploiement de Brotli sont requis.",
        "<b>Istio</b>1.31.2 / 1.30.6 / 1.29.9 . 1.29 est en fin de vie. La passerelle et le sidecar ont également été vérifiés.",
        "<b>curl, requests, httpx</b>Vérifiez les décodeurs dépendants et la décompression automatique. Modifier uniquement l&#x27;encodage Accept ne suffit pas."
      ],
      "metric": "Google CNA · CVSS v4.0"
    },
    "tailworm-overview": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "Ver de queue. Réexamen des limites internes.",
      "lede": "Rapport de recherche sur Tailscale/headscale. Ce rapport porte sur l'étendue de l'accès depuis les appareils autorisés et les permissions accordées après la connexion.",
      "points": [
        "Le sujet de recherche est<b>Tailscale 1.104.2 / headscale 0.29.5</b>Cette version n&#x27;est pas qualifiée de version révisée.",
        "chercheurs<b>11 article</b>Cela inclut les notes de configuration. 11 CVE/dommages réels.",
        "Le fournisseur mène l&#x27;enquête et apporte les corrections nécessaires.<b>Nous ne recommandons pas à tous les utilisateurs de désactiver SSH.</b>",
        "Tout d&#x27;abord, vérifiez :<b>Autorisation de connexion et terminaux compatibles SSH de Tailscale</b>Ceci est distinct de la version standard d&#x27;OpenSSH."
      ]
    },
    "tailworm-ssh": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "Vous pouvez vous connecter. Vous obtiendrez alors les droits d'administrateur.",
      "lede": "Des chercheurs ont signalé un problème où les opérations sur les sockets Unix pour le transfert SSH sont effectuées en tant que superutilisateur (root), ainsi qu'un conflit dans la vérification des chemins d'accès. Le fournisseur examine également les permissions après connexion.",
      "points": [
        "Le postulat est<b>Autoriser la connexion SSH et les permissions de transfert correspondantes.</b>Cela ne constitue pas une intrusion non autorisée dans tous les appareils.",
        "Docker et ses API de gestion sont connectés via des sockets et des remplacements. Des chercheurs signalent une élévation de privilèges en laboratoire.",
        "<b>Limité à certains expéditeurs → certains destinataires</b>et réduire les transferts inutiles.",
        "<b>Le mode de contrôle requiert une authentification supplémentaire à l&#x27;entrée.</b>Cela ne résoudra pas le problème d&#x27;élévation de privilèges après la connexion."
      ]
    },
    "tailworm-headscale": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "Headscale nécessite une solution différente.",
      "lede": "Nous ferons la distinction entre le contrôle auto-hébergé et Tailscale SaaS. Des chercheurs ont signalé des problèmes de saturation de la mémoire et d'efficacité du cache dans les systèmes d'enregistrement publics.",
      "points": [
        "<b>headscale 0.29.5</b>Vérification des informations ci-dessus. Des rapports indiquent que certaines attaques par déni de service (DoS) via l&#x27;inscription ne nécessitent pas de compte.",
        "Chercheurs<b>Impossible de supprimer le transfert SSH</b>Ils ont souligné qu&#x27;ils ne devaient pas réutiliser les paramètres SaaS et qu&#x27;ils devaient envisager de réduire ou de désactiver les autorisations.",
        "Vérifiez le périmètre d&#x27;accès, la limite de débit, la limite de mémoire et la surveillance du redémarrage.<b>La relaxation n&#x27;est pas une correction.</b>",
        "Une attaque DoS côté client utilisant une réponse DERP malveillante est,<b>Connecté à un relais malveillant</b>Une autre prémisse"
      ]
    },
    "tailworm-connector": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "L'autorisation de l'application a été envoyée à une autre destination.",
      "lede": "La cible est le connecteur expérimental 25 . Les chercheurs indiquent qu'un terminal disposant des droits d'accès peut forcer le connecteur à sélectionner une destination réelle arbitraire.",
      "points": [
        "<b>conn 25 et fonctionnalités d&#x27;utilisation</b>Cela repose sur le principe qu&#x27;il ne peut être généralisé à toutes les configurations de connecteurs.",
        "Vérifiez les services LAN, les métadonnées cloud et les services de cluster à l&#x27;extrémité du connecteur en utilisant la destination réelle.",
        "Supprimez les autorisations utilisateur inutiles.<b>Limiter les destinations du côté de la sortie.</b>Vérifiez également IPv 4 / IPv 6 .",
        "Les limites de sortie de Kubernetes sont<b>CNI, réseau hôte, chemin de transfert</b>Nous le vérifierons concrètement. Ne vous contentez pas de paramétrer le travail et de le considérer comme terminé."
      ]
    },
    "tailworm-serve": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "Vérifiez le port de gestion dans les paramètres du serveur.",
      "lede": "Transfert TCP vers les sockets Unix, liaison à toutes les interfaces et autorisation inter-montage HTTP/ 2 . Nous inventorierons la configuration et le routage séparément.",
      "points": [
        "<b>Transfert TCP vers un socket privilégié Serveur</b>Recherchez les paramètres pertinents pour l&#x27;opérateur.",
        "<b>TS_SERVE_ALLOW_ALL_INTERFACES</b>Ceci est une note de configuration. Ce comportement n&#x27;est pas celui par défaut pour tous les services.",
        "L&#x27;autorisation du serveur dorsal dépendante de l&#x27;en-tête et la présence de plusieurs points de montage ont été confirmées. Les résultats de Funnel ont également permis de différencier les modèles de menace.",
        "Pare-feu IP<b>N&#x27;inspectez pas les opérations de socket Unix locales.</b>Supprimez les paramètres inutiles."
      ]
    },
    "tailworm-response": {
      "kicker": "TAILWORM · SPECIAL REPORT",
      "title": "Vérifiez, réduisez les possibilités et apportez les corrections nécessaires.",
      "lede": "Cela permet de faire la distinction entre la propagation automatisée en laboratoire et les infestations de vers dans le monde réel. D'après les sources primaires présentées ici, les infestations de vers à queue dans le monde réel restent à confirmer.",
      "points": [
        "Inventaire de SSH, headscale, conn 25 et Serve.<b>Conditions à établir pour chaque fonction</b>Autorisation réduite conformément à",
        "<b>Les versions révisées et les CVE/CVSS dédiés ne sont pas encore confirmés.</b>Ne mélangez pas cela avec la modification du certificat 1.104.2 .",
        "En cas de suspicion d&#x27;infraction, après préservation et isolement des preuves,<b>Désactiver le terminal en termes de contrôle</b>Mettre à jour les clés accessibles",
        "La simple réinstallation ne supprimera pas votre identité copiée. Continuez de consulter les recommandations et mises à jour officielles."
      ]
    },
    "night-delta": {
      "kicker": "NIGHT UPDATE · 23:18 JST",
      "title": "Enquête à grande échelle. Privilégier les conditions de réussite plutôt que le nombre de cas.",
      "lede": "16:34 → 23:18 Des données supplémentaires pour la fenêtre fixe JST ont été récupérées. Les mises à jour qui chevauchent les données précédentes ne seront pas incluses dans le décompte des cas affectés.",
      "points": [
        "<b>NVD 87 / 87</b>Dans ce cas précis, les deux ensembles contiennent les mêmes éléments 87 . Collectés pour tous les niveaux de gravité.",
        "<b>GitHub 16</b>Ce document n&#x27;a pas encore été examiné. Un champ « package » vide ne signifie pas qu&#x27;il est sans effet.",
        "<b>KEV comprend les versions 10 / 23 , 1 , 756</b>L&#x27;absence de nouveaux ajouts ne prouve pas qu&#x27;il n&#x27;y a pas d&#x27;attaques.",
        "J&#x27;ai recoupé les données de Firecrawl, Dokploy, Rotki, etc. avec des sources primaires.<b>Ne pas compléter avec des versions révisées non confirmées.</b>"
      ]
    },
    "night-restoration": {
      "kicker": "NIGHT UPDATE · 23:18 JST",
      "title": "L'objectif du rétablissement n'est pas de permettre la reconnexion.",
      "lede": "ConnectWise a été mis à jour vers la version 23:00 JST aujourd'hui. Cloud Backup vise une intégration progressive vers les 10 / 26 .",
      "points": [
        "<b>Commencez par rétablir l&#x27;accès aux sauvegardes existantes.</b>L&#x27;objectif est de guider les utilisateurs tout au long du processus de réinscription ultérieur.",
        "<b>Maintenez la connexion désactivée jusqu&#x27;à ce que la procédure officielle spécifique soit suivie.</b>Restaurer l&#x27;infrastructure ne signifie pas restaurer toutes les fonctions.",
        "La gestion des sauvegardes et l&#x27;étude de l&#x27;authentification, des autorisations et des opérations de messagerie du client M 365 __ sont des questions distinctes.",
        "PHP, GitLab et Brotli, ainsi que KEV (Key Energy Vault) qui a déjà été exploité, et le renforcement de la sécurité de Fortinet, continuent.<b>Vérifiez par rôle dans le rapport détaillé.</b>"
      ]
    },
    "morning-cutoff": {
      "kicker": "MORNING UPDATE · 2026-10-26",
      "title": "10:27 . Qu'est-ce qui a changé ?",
      "lede": "Voici un récapitulatif chronologique de la version PHP et des mises à jour successives, retraçant l'évolution jusqu'à ce matin. L'intégration à la base de données et la survenue d'un incident sont des événements distincts.",
      "points": [
        "NVD est nouveau<b>28 articles</b>,mise à jour<b>4 , 276 articles</b>Tous les nouveaux éléments sont inclus dans la mise à jour.",
        "GHSA <b>93 articles</b>Toutes les entrées n&#x27;ont pas été vérifiées. Cela inclut de nombreuses entrées qui ont suivi la précédente liste NVD (Données non virtuelles).",
        "<b>Intrusion initiale dans les agences gouvernementales = PHP 2 Shell</b>L&#x27;explication concernant l&#x27;unité 42 est retirée. Ceci est indépendant des observations de l&#x27;essai AWS."
      ]
    },
    "morning-dotnet": {
      "kicker": "MORNING UPDATE · 2026-10-26",
      "title": "Je l'ai mis à jour. Mais il n'y a toujours pas eu de correctifs.",
      "lede": "CVE-2026-70197 pour Windows .NET. Microsoft a expliqué que les mises à jour 10 / 13 ne contenaient pas le correctif et a publié une mise à jour temporaire.",
      "points": [
        "Annonce publique <b>10/26 03:50 JST</b>La condition est que SocketAsyncEventArgs doit être réutilisé entre les datagrammes IPv 4 et IPv 6 .",
        "La série cible est <b>8.0.33 / 9.0.22 / 10.0.14</b>Comparer avec les versions révisées, etc.",
        "Les applications autonomes sont<b>Reconstruire et redistribuer</b>Vérifiez également l&#x27;environnement d&#x27;exécution en cours."
      ]
    },
    "morning-ot": {
      "kicker": "MORNING UPDATE · 2026-10-26",
      "title": "PHP est également présent dans le matériel.",
      "lede": "La mise à jour JVN de ce matin inclut la propagation du shell PHP 2 vers PAN-OS sur RUGGEDCOM. Cela ne signifie pas que tous les produits Siemens présentent le même défaut.",
      "points": [
        "<b>09:00 JST</b>Mise à jour du flux. Ceci est distinct de la date de publication de 566512 elle-même.",
        "PAN-OS est<b>Des versions révisées sont disponibles dans certaines séries.</b>. Indépendant des autres séries ETA.",
        "Starman/Plack a également été ajouté. Pas seulement PHP.<b>limites de traitement HTTP</b>Vérifier"
      ]
    },
    "morning-dates": {
      "kicker": "MORNING UPDATE · 2026-10-26",
      "title": "À lire avant la date limite. Retour à l'état actuel.",
      "lede": "Cette page contient des entrées distinctes pour chacune des dates suivantes : mois 10 période de 17 à 26 et jours 10 . La date d’observation, la date de publication, la date de révision et toute information découverte ultérieurement sont indiquées séparément.",
      "points": [
        "<a href=\"./timeline.html\">Enregistrements par date →</a> / <a href=\"./update-20261026.html\">Résumé de 10 / 26 10:27 →</a>",
        "Mises à jour des services publics, enquêtes pour infractions et poursuite des révocations de titres professionnels.",
        "La correction minimale de Tailworm et le redémarrage de ConnectWise sont terminés.<b>Non confirmé pour le moment</b>Ne substituez pas les événements planifiés aux résultats réels."
      ]
    },
    "afternoon-deployment": {
      "kicker": "14:56 MISE À JOUR · Vérifier la méthode de placement",
      "title": "Mise à jour. Ce fichier binaire a-t-il été remplacé ?",
      "lede": "Ceci complète la recommandation .NET de Brotli. La procédure de déploiement des correctifs pour les applications en cours d'exécution diffère selon que vous utilisez un environnement d'exécution partagé, autonome ou NativeAOT. Le diagramme illustre schématiquement le chemin de déploiement.",
      "points": [
        "La décompression Brotli pour ASP.NET Core / HttpClient est<b>Désactivé par défaut</b>Activation explicite ou vérification directe des entrées API",
        "Vérifiez 8.0.33 / 9.0.22 / 10.0.14 etc. Les éléments autonomes sont réorganisés.<b>NativeAOT mettra à jour son SDK et ses autres composants, puis les republiera et les redéployera.</b>",
        "Ceci complète la recommandation précédemment publiée 04:06 JST. Il ne s&#x27;agit pas d&#x27;une nouvelle infraction survenue cet après-midi."
      ],
      "metric": "Voies de déploiement · schéma"
    },
    "afternoon-release": {
      "kicker": "14:56 MISE À JOUR · Provisionnement, déploiement et récupération séparés",
      "title": "Publié. Diffusion en cours. Reprise prévue.",
      "lede": "Bien qu'elles soient toutes appelées « mises à jour », leur statut diffère. Nous distinguerons les correctifs déjà déployés, le déploiement progressif pour chaque appareil et les cibles de récupération. Vérifiez la version que vous utiliserez et les instructions spécifiques. Le diagramme illustre ces différents statuts.",
      "points": [
        "PAN-OS : Mise à jour de l’état de disponibilité du correctif 11.1 série 4 . Le fichier JSON CNA est disponible.<b>14:45 JST</b>L&#x27;écart temporel avec l&#x27;historique du CSAF est également enregistré.",
        "Système d&#x27;exploitation soigné 26.5.4 est<b>Distribution par phases</b>Ce n&#x27;est pas parce que 26 jours se sont écoulés que tous les appareils sont réparés.",
        "La prochaine annonce concernant ConnectWise est prévue pour le [date].<b>23:00 JST</b>Ne remplacez pas l&#x27;objectif de redémarrage par l&#x27;autorisation de reconnexion.",
        "<a href=\"./update-20261026-1456.html\">Rapport d&#x27;ensemble, contre-mesures et sources primaires pour 14:56 →</a>"
      ]
    },
    "night-account-controls": {
      "kicker": "21:35 MISE À JOUR · Vérification du compte",
      "title": "Changez votre mot de passe et vérifiez les connexions restantes.",
      "lede": "La mise à jour 21 de GMO fournit des conseils pour protéger non seulement les comptes de change, mais aussi les comptes titres, les courriels, les comptes Google, etc. Le schéma illustre l'étendue des éléments à vérifier.",
      "points": [
        "Changez votre mot de passe depuis un autre appareil de confiance.<b>Déconnectez-vous de tous les appareils</b>• Vérifier l&#x27;authentification multifactorielle",
        "Vérifiez la présence d&#x27;applications associées, de redirections d&#x27;e-mails, d&#x27;extensions et d&#x27;appareils connectés inconnus. La synchronisation du navigateur sera suspendue jusqu&#x27;à la fin de la vérification.",
        "Il s&#x27;agit d&#x27;un avis de contrôle préventif et il ne confirme pas que tous les appareils des utilisateurs sont infectés.",
        "<a href=\"./update-20261026-2135.html#gmo-sixth\">Lire l&#x27;annonce officielle et les détails de la couverture →</a>"
      ]
    },
    "night-package-response": {
      "kicker": "21:35 MISE À JOUR · Environnement de distribution et d'exécution",
      "title": "Jusqu'où devons-nous aller dans la vérification de l'installation d'une version malveillante ?",
      "lede": "Nous avons recueilli des avis de sécurité supplémentaires concernant des logiciels malveillants sur npm et PyPI. Ces avis sont distincts des vulnérabilités existantes et analysent les actions effectuées lors de l'installation et de l'importation. Le diagramme illustre schématiquement le processus de réponse.",
      "points": [
        "Cela inclut la version RC cible de @worca/app, le traitement de minage et de persistance npm, et la récupération de code externe depuis PyPI netweavex.<b>Faire correspondre le nom à la version cible</b>",
        "Si la version affectée est exécutée, isolez l&#x27;environnement et révoquez tous les identifiants accessibles depuis un appareil sécurisé. Envisagez une reconstruction conformément aux recommandations.",
        "Les autres cas 2 qui incluent la classification PROBABLY_PENTEST dans l&#x27;analyse ne seront pas traités comme ayant les mêmes dommages confirmés.",
        "<a href=\"./update-20261026-2135.html#npm-worca\">Conditions et contre-mesures pour chaque colis →</a>"
      ]
    },
    "night-restore-status": {
      "kicker": "00:18 MISE À JOUR · Récupération et notification",
      "title": "Poursuivre les préparatifs, faire des annonces et reprendre la diffusion en continu sont autant d'étapes différentes.",
      "lede": "La mise à jour 23:00 de ConnectWise indique que la préparation de l'intégration se poursuit. Le rapport 7 de GMO contient une alerte 12:00 concernant une attaque. SoftBank a repris la diffusion d'informations sur les situations de catastrophe et les évacuations à compter de la date 23:17 . Le diagramme illustre la situation.",
      "points": [
        "ConnectWise : Ceci n’indique pas qu’une restauration à partir d’une sauvegarde existante a commencé.<b>La connexion est désactivée jusqu&#x27;à ce que la procédure individuelle soit terminée.</b>",
        "OGM : Nous ne donnerons pas suite à cette demande. L’examen du compte relatif au rapport 6 se poursuit. Les corrections concernant le rapport 00:20 seront apportées conformément à la norme.",
        "Le service de SoftBank a repris, mais uniquement pour la messagerie électronique concernée. Le processus PHP n&#x27;est pas encore terminé dans son intégralité.",
        "<a href=\"./update-20261027-0018.html#connectwise-1400\">Consultez le rapport à lire par 00:18 →</a>"
      ]
    },
    "brotli-reach": {
      "kicker": "00:18 UPDATE · BROTLI REACH",
      "title": "Même avec un nom comme HTTP/ 2 , le défaut réside dans le décodeur.",
      "lede": "HTTP 2 Shell / Node 2 Shell / Brotli 2 Le shell est identique CVE-2026-111497 . Le chemin de destination diffère selon le format de la réponse : HTTP, API .NET, JPEG XL, ClickHouse ou Parquet. Le diagramme illustre schématiquement la destination.",
      "points": [
        ".NET sera mis à jour au niveau de l&#x27;exécution.<b>NativeAOT est réédité</b>L&#x27;expansion br d&#x27;ASP.NET/HttpClient est désactivée par défaut.",
        "FFmpeg/libjxl, ClickHouse et Arrow n&#x27;ont pas été vérifiés concernant les vulnérabilités d&#x27;exécution de code à distance (RCE). Les éléments pour lesquels aucune version corrective n&#x27;a été confirmée seront considérés comme non corrigés.",
        "Le pare-feu applicatif web d&#x27;urgence de Cloudflare utilise la journalisation par défaut. La séquence HTTP Bandit/ 2 se trouve sur un cluster distinct.",
        "<a href=\"./update-20261027-0018.html#brotli-jfrog-reach\">Arrivée en aval et contre-mesures →</a>"
      ]
    },
    "morning-consul-identity": {
      "kicker": "07:47 UPDATE · SERVICE IDENTITY",
      "title": "Les failles d'autorisation des API peuvent être attribuées aux certificats et aux clés privées.",
      "lede": "CVE-2026-105765 est une faille d'autorisation permettant de contourner la réponse du certificat de feuille mis en cache dans l'API HTTP de l'agent Consul. Le diagramme illustre schématiquement les conditions de validité de cette vulnérabilité et les actions correspondantes ; il ne représente pas un dommage réel.",
      "points": [
        "La cible est<b>1.17.0〜2.0.4</b>Configuration avec ACL activée. L&#x27;API HTTP utilise l&#x27;adresse de bouclage par défaut. Pour que l&#x27;opération réussisse, l&#x27;API doit être accessible et le certificat cible ainsi que la clé privée doivent être mis en cache.",
        "Community <b>2.1.0</b>、Enterprise <b>2.1.0 / 1.21.19</b>Consultez le guide spécifique à la série.",
        "L&#x27;exposition des API sera restreinte. Les mises à jour et les investigations concernant toute identité de service exposée seront menées séparément.",
        "<a href=\"./update-20261027-0747.html#consul-leaf\">Consultez les conditions et les sources →</a>"
      ]
    },
    "morning-sandbox-auth": {
      "kicker": "07:47 UPDATE · SANDBOX AUTH",
      "title": "Même dans un environnement de test, l'authentification est requise pour accéder aux API publiques.",
      "lede": "CVE-2026-112346 du SDK OpenHands est inférieur au 1.52.0 . Lorsque le lanceur se lie au 0.0.0.0 et que session_api_keys est vide, il est possible d'exécuter des commandes depuis le port public sans authentification.",
      "points": [
        "L&#x27;exécution root est<b>À l&#x27;intérieur du bac à sable</b>Cela peut également affecter les espaces de travail montés et les secrets que vous transmettez.",
        "<b>1.52.0</b>Comparez les modifications ultérieures et vérifiez les ports publics et les paramètres d&#x27;authentification.",
        "Pour les environnements accessibles de l&#x27;extérieur, les vérifications des journaux et la révocation/réémission des secrets seront effectuées séparément.",
        "<a href=\"./update-20261027-0747.html#openhands-sdk\">Consultez les conditions et les sources →</a>"
      ]
    },
    "evening-disclosure": {
      "kicker": "18:47 UPDATE · EVIDENCE STATES",
      "title": "Confirmer la publication et confirmer le contenu sont deux choses différentes.",
      "lede": "GMO a confirmé la divulgation d'informations qu'elle affirme être des données relatives à l'entreprise et à ses clients dans le 12:30 . Le contenu fait l'objet d'une enquête et aucune attaque de ransomware n'a été confirmée à ce jour 13:55 ). Le diagramme ci-joint illustre schématiquement la situation.",
      "points": [
        "L&#x27;explication fournie était qu&#x27;aucun logiciel malveillant n&#x27;avait été trouvé sur les terminaux une fois l&#x27;analyse terminée.<b>Contrôle de sécurité de tous les appareils</b>Ne le propagez pas davantage.",
        "L&#x27;isolation officielle de l&#x27;appareil et la protection du compte contre les attaques d&#x27;un autre appareil de confiance ont été confirmées.",
        "Abstenez-vous d&#x27;accéder à des informations publiques, de les republier ou de les diffuser, et méfiez-vous des tentatives d&#x27;hameçonnage opportunistes.",
        "<a href=\"./update-20261027-1847.html#gmo-publication\">Consultez les rapports et les réponses de 8 à 11 →</a>"
      ]
    },
    "evening-release": {
      "kicker": "18:47 UPDATE · RELEASE GATES",
      "title": "La version prévue et la version déjà expédiée.",
      "lede": "Les contre-mesures PAN-OS PHP progressent par étapes. Nous avons également vérifié les différences entre les documents originaux KEV CVE-2026-109618 et CVE-2026-109619 . Le diagramme illustre schématiquement la séparation de l'expédition, de l'application et de l'investigation.",
      "points": [
        "<b>10.2.13-h27 / 10.2.16-h12</b>Confirmé que l&#x27;envoi a été effectué à 09:10 JST.",
        "<b>12.1.7-h11 / 12.2.4-h1</b>Il est confirmé que la commande a été expédiée à 13:03 JST. Les autres délais de livraison sont vérifiés séparément.",
        "Fournir des corrections, les appliquer à votre équipement et enquêter sur les signes d&#x27;intrusion sont des tâches distinctes.",
        "<a href=\"./update-20261027-1847.html#pan-hotfix\">État des expéditions par série et réserves KEV →</a>"
      ]
    },
    "evening-threshold": {
      "kicker": "18:47 UPDATE · MPC BOUNDARY",
      "title": "La partie 1 n'est pas une clé privée complète.",
      "lede": "Bloque la fonction CVE-2026-90975 de mpc-lib. Il est possible d'accéder à la part ancestrale de la partie à partir de la part descendante et du code de chaîne. La couche de seuil est maintenue. Le diagramme illustre schématiquement ces conditions.",
      "points": [
        "Dérivation durcie BIP 32 ,<b>Isolation complète de la hiérarchie des actions</b>Je ne leur fais pas confiance.",
        "Le code de la chaîne restera secret et ne sera pas diffusé dans les informations réservées aux lecteurs.",
        "Le document du CERT ne fournit aucune correction. En cas de violation de partage de feuille, la hiérarchie de la partie concernée fait l&#x27;objet d&#x27;une enquête.",
        "<a href=\"./update-20261027-1847.html#fireblocks-share-boundary\">Consultez les conditions d&#x27;adoption et l&#x27;allègement provisoire →</a>"
      ]
    },
    "evening-package": {
      "kicker": "18:47 UPDATE · PACKAGE RESPONSE",
      "title": "Avant de supprimer un fichier, vérifiez l'environnement dans lequel il a été exécuté.",
      "lede": "Des signalements de paquets malveillants concernant certaines versions ont été soumis à npm et PyPI. Le diagramme illustre l'historique d'installation, l'isolation et les procédures de réponse en cas d'expiration de la clé secrète ; il ne constitue pas une observation de dommages réels.",
      "points": [
        "npm <b>@camera.ui/camera-ui-nvr-windows-amd64 1.6.1</b>：GHSA-2w7v-jwxh-w7wc",
        "PyPI <b>h13t0ry-hello-demo 0.1.0</b>: GHSA-5crq-52j9-fc74 . Rapport de shell inversé lors de l&#x27;importation",
        "Le fichier de verrouillage, l&#x27;élément de configuration et l&#x27;historique d&#x27;exécution sont comparés. L&#x27;environnement affecté est isolé, et le secret est révoqué puis réémis depuis un autre terminal sécurisé.",
        "<a href=\"./update-20261027-1847.html#malware-camera-ui\">Lire le paquet cible et sa correspondance →</a>"
      ]
    }
  }
});
