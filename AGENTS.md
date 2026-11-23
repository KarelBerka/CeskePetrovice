# Pravidla projektu České Petrovice (*Böhmisch Petersdorf*)

## 1. Správa Gitu a ochrana surových archiválií (Dropbox)

- **Commit a push pouze na vyžádání / po ověření:** Před každým `git add` vždy zkontroluj `git status --short`, aby se do commitu nepřibalily rozpracované dočasné soubory, surové skeny ani soukromé dokumenty.
- **Zákaz verzování surových skenů a výřezů:** Složky `pracovni/`, `zdroje/`, `vyrezy/`, `Barinka/` a `Soudni pre/pracovni/`, `Soudni pre/zdroje/`, `Soudni pre/vyrezy/` musí zůstat v `.gitignore`. Do repozitáře patří výhradně webově optimalizované náhledy v `assets/archives/` a `assets/maps/`.
- **Kódování commit zpráv na Windows:** Víceřádkové zprávy commitů s českou diakritikou předávej přes dočasný UTF-8 soubor (`git commit -F <cesta>`) a soubor po commitu smaž, aby nedošlo k poškození diakritiky v PowerShellu.
- **Python a Node na Windows:** Python skripty spouštěj s `-X utf8` (`C:\Users\krapn\AppData\Local\Python\pythoncore-3.14-64\python.exe`) a zajisti `sys.stdout.reconfigure(encoding='utf-8')`. Node.js spouštěj přes `D:\AppData\Local\deno\node_compat_bin\node.exe` (pokud není v `PATH`).

## 2. Sekce Aktuality (`data/news.js`) při commitech

- **Aktualizace novinek u významných změn:** Kdykoli přidáváš novou etapu archivního výzkumu, novou kapitolu studie, další přepsané sčítání (např. `1880`, `1890`, `1900`) nebo novou funkci webu, doplň záznam na začátek pole `newsData` v `data/news.js`.
- **Povinná struktura položky v `data/news.js`:**
  - `id`: `news_YYYY_MM_DD_<slug>`
  - `date`: `YYYY-MM-DD`
  - `category`: `"feature"` | `"census"` | `"analysis"`
  - Plně trojjazyčné texty (**CZ / EN / DE**): `badge` / `badgeEn` / `badgeDe`, `title` / `titleEn` / `titleDe`, `summary` / `summaryDe` / `summaryEn` a pole `links` (`label`, `labelEn`, `labelDe`, `href`).

## 3. Architektura webu, epistemika a ochrana soukromí

- **Vícestránková struktura (7 HTML stran):**
  - `index.html` (Rozcestník, KPI přehled a Aktuality)
  - `pribeh.html` (Příběh obce, archivní zajímavosti a badatelské hloubkové sondy)
  - `mapa.html` (Interaktivní mapa Leaflet s vrstvami ČÚZK/CENIA, 170 objektů čp./č. ev. a Atlas map)
  - `obyvatele.html` (Stránkovaný rejstřík obyvatel, sjednocené osoby a biografické/rodové profily)
  - `demografie.html` (Historická demografie 1654–2026, ČSÚ, 1910–1921, hospodářství a krize)
  - `reference.html` (Katalog pramenů ČSN ISO 690, studie ke stažení a Badatelský průvodce)
  - `cluster.html` (Laboratoř propojování osob, kontinuitu rodů, síťový graf a migraci)
- **Epistemické značení (`[doc]`, `[ed]`, `[inv]`, `[lit]`):** Nikdy neuváděj nepřečtené údaje jako přímé archivní čtení; nejisté paleografické čtení označuj `(?)` nebo `[…]`.
- **Pojistka proti homonymům:** Obec **České Petrovice** (*Böhmisch Petersdorf*, ZÚJ `580066`, k. ú. `622702`, s. o. Králíky) striktně odlišuj od **Petroviček / Německých Petrovic** (*Deutsch Petersdorf*, `310 ha`), **Vernéřovic** (ZUJ `547743`), **Petrovic u Dolní Čermné / Lanškrouna**, **Petříkovic** (*Petersdorf* u Trutnova), **Petrušova** a **Petrovic u Štoků**.
- **Ochrana osobních údajů (GDPR):** Veřejný web obsahuje výhradně historická data již zesnulých osob (matriky v archivních lhůtách, sčítání nejpozději 1921, historický případ Františka Bařinky 1911–1945). Nikdy nezveřejňuj soukromou korespondenci ani osobní údaje žijících potomků ze složky `Barinka/`.
