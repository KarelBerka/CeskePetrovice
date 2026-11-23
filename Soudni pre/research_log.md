# Badatelský protokol (Research Log) — Soudní pře o hranice v 16. století (MZA Brno)

- **Projekt:** České Petrovice – hraniční a majetkové spory 16. století na pomezí Kladska, Čech a severní Moravy
- **Pracovní složka:** [Soudni pre](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre)
- **Datum běhu:** 2026-11-19 a 2026-11-20 (plánovaný navazující sběr ARON)
- **Epistemické značení:** `doc` = přímé čtení z digitalizátu (`read_file`); `ed` = tištěná edice pramenů; `inv` = archivní katalog / inventář ARON MZA; `lit` = historiografie a topografie.

---

## 1. Lokální databáze Archivní Paměť (`ArchivniPamet\pamet.py`)

- **Cíl:** Ověřit předchozí přepisy a poznámky z projektu Dlouhomilov.
- **Dotazy & výsledky:**
  - `pamet.py search "Kladsko"` → **0 záznamů**.
  - `pamet.py search "Tschirnhaus"` → **0 záznamů**.
  - `pamet.py search "Boskovic"` → **3 záznamy** v MZA `A 3 Stavovské rukopisy` (`Kniha XVII` a `Kniha XXX`).
- **Navazující podklady projektu Dlouhomilov (využity UUID desk a bookid CMS):**
  - `badatelsky_pruvodce.md`, `zemske_desky_a_puhony_1466_1622.md`, `kvalifikacni_prace_a_literatura.md` → převzaty ověřené identifikátory pro kořen `NKP Moravské zemské desky` (`56721cb4-2dd1-41cd-9e31-b4416c2037ca`), `Kniha XVII` (`d6c753db-2245-43bb-8311-59e640135577`), `Kniha XXX` (`a1c55c94-a46d-471e-8c14-58a8a3ac4390`), `Kniha XXXI` (`3b2b73b2-658b-494b-a25e-cc9265f72cf3`) a knihy CMS.

---

## 2. Portál ARON Moravského zemského archivu v Brně (`https://www.mza.cz/aron/api/aron`)

### 2.1 Úspěšné živé dotazy (provedeny do cca 12:15 SEČ)

#### A) Průzkum fondů (`type=FUND`, filtr `"MZA v Brně"`)
Identifikováno celkem **21 klíčových fondů** dosahujících do 16.–17. století nebo relevantních pro hranice pomezí (včetně `A 1`, `A 2`, `A 3`, `B 1`, `B 10`, `Acta finita`, `D 22`, `Finanční prokuratura Brno`, `G 1`, `G 10`, `G 11`, `G 12`, `G 154`, `Archiv Laudonů`, `Velkostatek Moravská Třebová`, `RA Vrbnů Holešov`, `Popisy hranic` — přesná UUID viz [mza_nalezy.json](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre/data/mza_nalezy.json)).

#### B) Jednoslovné a kombinované dotazy `ARCH_DESC` (počty nálezů v ARON)
| Dotaz / filtr | Pole (`field`) | Počet v ARON | Hlavní relevance / zjištěná homonyma |
|---|---|---:|---|
| `Kladsk` | `name` / `description` | 165 / 164 | Směs kladských bohemik/moravik (14.–20. stol.); v průniku s `hranic` 5 hlavních položek. |
| `Kladsko` | `name+desc` | 37 | Listiny z lucemburské éry, spory 17.–19. stol. |
| `Mittelwald` | `name` / `description` | 16 / 16 | **Past homonyma:** většina týká vsi *Středolesí* u Hranic na Moravě (`Gemeinde Mittelwald Mhr`, spolek `Mittelwald`, okres Přerov). Skutečně kladský záznam: `226598ce` (*G 154*). |
| `Mittelwalde` | `name+desc` | 7 | Včetně `6853bd38` (hold radních Mittelwalde markraběti Joštovi) a `226598ce` (1624–1626). |
| `Meziles` | `name` / `description` | 99 / 85 | **Past homonyma:** Mezilesí na Pelhřimovsku (Pacovsko). S `Kladsk`: 2 novější položky. |
| `Tschirnhaus` | `name` / `description` | 2 / 2 | `226598ce` (`G 154`, kart. 4, inv. č. 76, 1623–1628) a `93be8366` (`B 10`, kart. 79, orig. sign. 25). |
| `Tschirnhauss` | `name+desc` | 1 | `226598ce` (pravopis *z Tschirnhaussu*). |
| `Grulich` | `name` / `description` | 46 / 46 | **Past homonyma:** příjmení *Grulich/Grulichová* (19.–20. stol.), nikoliv město Králíky v 16. stol. |
| `Krulich` | `name` / `description` | 3 / 3 | Pouze příjmení *Krulich* (20. stol.). |
| `Králík` | `name` / `description` | 459 / 456 | Včetně průniku `['Králík', 'hranic']` = 4 záznamy (vesměs spolky chovatelů králíků na Hranicku!). |
| `Goldenstein` | `name` / `description` | 40 / 40 | Branná / Kolštejn, převážně 19.–20. stol. a šlechtický predikát *Goldenmiller z Goldensteina*. |
| `Kolštejn` | `name` / `description` | 171 / 168 | S `hranic`: 3 záznamy (`074826fc` topografie, `f855f499` Kunovice 1548 — u Uherského Hradiště!, `7cd69768`). |
| `Branná` | `name` / `description` | 467 / 463 | Převážně novodobé spisy („branná výchova“, obec Branná). |
| `Schildberg` | `name` / `description` | 42 / 42 | Štíty a příjmení *Schildberger*. |
| `Šilperk` | `name` / `description` | 135 / 134 | V průniku s `hranic`: 4 záznamy (`75ee42de` pobělohorské regesty vč. Šilperku, ostatní 19.–20. stol.). |
| `Štíty` | `name` / `description` | 117 / 114 | Architektura, spolky, novější obecní spisy. |
| `Schönberg` | `name` / `description` | 191 / 191 | Šumperk převážně spolky 19.–20. stol. |
| `Šumperk` | `name` / `description` | 5163 / 5042 | V průniku `['Šumperk', 'hranic']` = **43 záznamů**, vč. klíčového `58b61474` (*Acta finita*, 1638) a `074826fc`. |
| `Sněžník` / `Schneeberg` | `name+desc` | 50 / 14 | Místní zprávy ze Starého Města pod Sněžníkem, dolnorakouský Schneeberg, trať Sněžník u Sokolnic (homonymum). |
| `Glatz` | `name+desc` | 254 | **Past homonyma:** příjmení lesmistra *H. Glatze / J. Glatze* na mapách 19. stol. |
| `hranic` | `name` / `description` | 8188 / 8163 | Obecné vyhledávání; dále zúženo na `Zemské hranice` (20), `Hraniční spory` (93), `Hranice země` (4). |
| `Grenz` / `Grenzsachen` | `name+desc` | 271 / 0 | Většinou výstřižky *Mährischer Grenzbote* (19.–20. stol.). |
| `půhon` / `nález` | `name+desc` | 359 / 2617 | Zejm. `0724aed0` (výpisy z brněnských půhonů S–W 1562–1579), `02f8321f` (1512–1516), `06062ce8` (1616–1628). |

#### C) Detailní výpisy (`detail`) získané z ARON před výpadkem
Podrobné archivní metadatové záznamy (fond, `inv. č.`, `sign.`, `karton`, `UNIT~DATE`, `DIGITAL`) byly staženy a ověřeny pro UUID: `c057de9b`, `226598ce`, `93be8366`, `58b61474`, `1072ea95`, `9440dd2c`, `097e7b7f`, `0c01eb63`.

---

### 2.2 Omezení dostupnosti `www.mza.cz` od 12:15 SEČ (blokace / výpadek)

- **12:15–12:35 SEČ:** Po sérii dotazů začalo API `https://www.mza.cz/aron/api/aron` vracet `TimeoutError` (`URLError: <urlopen error timed out>`).
- **12:40 SEČ (`task-190`):** Kontrolní jednorázový `GET` na `/apu/56721cb4-2dd1-41cd-9e31-b4416c2037ca` (timeout 15 s) skončil `URLError: <urlopen error timed out>`.
- **12:41–12:47 SEČ (`task-218`, `task-222`):** Dodržen 5minutový (`300 s`) vyčkávací interval, následný test vrátil opět `URLError: <urlopen error timed out>`.
- **12:49 SEČ (`task-244`):** Diagnostika DNS/TCP potvrdila překlad `www.mza.cz` na IPv4 `194.228.117.162:443` a pád spojení přímo při TCP handshake (`sock.connect` → `TimeoutError: timed out`), nikoliv chybu IPv6 ani TLS. Zásada nezkoušet obcházení omezení respektována: po 12:49 SEČ nebyl proti `mza.cz` vyslán žádný další dotaz.
- **Důsledky a transparentní mezery:** V ARON MZA zatím zůstalo nedohledáno:
  1. jednotlivá `apu_id` pro *ZDO Kniha XXIX* (`inv. č. 110`), *Knihy půhonné a nálezové olomoucké cúdy* okolo r. 1576 (`inv. č. 680–696`), *Památky sněmovní I–IV*, *Kopiář přípisů 1579–1601* (fond `A 3`) a *Kopiář Žalkovského* (`G 10, sign. 893`);
  2. stažení a vizuální čtení DZI dlaždic ze `ZDO XXIX fol. 21, 45, 53`, `ZDO XXXI fol. 25` a mapy `D 22 inv. č. 304` (`c057de9b`). Kompletní příkazy pro dodatečné spuštění doma obsahuje [archivni_dotazy_MZA_Brno.md](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre/archivni_dotazy_MZA_Brno.md).

---

## 3. Czech Medieval Sources online (`sources.cms.flu.cas.cz`)

- **Kniha:** *Moravské zemské desky. II. řada olomoucká (1480–1566)*, ed. František Matějek, Brno 1948 (`bookid=990`).
- **Vyhledávání (`s=k&bookid=990&fulltext=...`):**
  - `Koldštejn`: 0 nálezů; `Kolstein`: 0; `Tschirnhaus`: 0; `Schildberg`: 0.
  - `Mittelwald`: 1 nález (`s. 541` — index `Frývald [= Freiwalde ... u Mittelwalde]`).
  - `Goldštejn`: 5 nálezů (`s. 251, 542, 552, 589, 601`).
  - `Šilperk`: 25+ nálezů (mj. `s. 40, 52, 99, 101, 127, 346, 402, 535, 536, 543, 548, 549, 572, 575, 585, 587, 588, 600, 612, 613, 615, 622, 630, 642, 644`).
- **Stažené a vizuálně přečtené stránky (`pracovni/cms_mzd2/`):**
  - `mzd2_p251.jpg` (Kniha XVII, 1511, č. 79: Jan a Bohuše ze Zvole a z Goldštejna),
  - `mzd2_p346.jpg` (Kniha XXIII, 1531, č. 40: Beneš Krčma → Hynek Berka ze Dubé, Šilperk s mezemi a hranicemi; č. 41: Hynek Žampach z Potštejna!),
  - `mzd2_p402.jpg` (Kniha XXV, 1542, č. 84–85: spolek Hynka Berky a Bohunky z Lomnice na Šilperku),
  - `mzd2_p503.jpg` & `mzd2_p522.jpg` (Kniha XXVII, 1562/1566: Matyáš Žalkovský ze Žalkovic na Dobromilicích — prokázání moravského zemského vzestupu rodu před koupí Šilperku),
  - Rejstříky: `mzd2_p535.jpg` (Březná, Bukovice, Bušín), `mzd2_p536.jpg` (Cotkytle, Crhov), `mzd2_p541.jpg` (Frývald / Mittelwalde, Frankštát), `mzd2_p542.jpg` (Goldštejn, Hardek), `mzd2_p551.jpg` (Kladsko, Klášterec), `mzd2_p552.jpg` (Kolštejn / Goldštejn), `mzd2_p589.jpg` (Švábenice – vazba na Petra ze Zvole a z Goldštejna), `mzd2_p601.jpg` (Zvole).
  - Z těchto skenů pořízeny 4 čisté výřezy do [vyrezy/](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre/vyrezy), všechny přečteny nástrojem `read_file`.

---

## 4. Kramerius MZK Brno (`api.kramerius.mzk.cz`) & NK ČR (`kramerius5.nkp.cz`)

- **NK ČR Kramerius (`kramerius5.nkp.cz`):** Nepřístupný z pracovního prostředí (`TimeoutError [WinError 10060]`).
- **MZK Kramerius v7 (`api.kramerius.mzk.cz`):** Plně funkční (pouze u několika novějších svazků označených `public`, např. *Staromoravští rodové 1972* nebo *MZD 1999*, vrací endpoint `/ocr/text` HTTP 403).
- **Vytěžené texty OCR (`ed` / `lit`):**
  1. **KAMENÍČEK, F., *Archivní rozhled*, `ČMM` 1891, s. 44–53 a 242–254:** Přesné citace a obsah rukopisů `MZA A 3` — *Památky sněmovní I (1518–1546)* (`fol. 153`), *Liber copiarum (1526–1546)*, *Památky sněmovní IV (1584–1599)* (`fol. 51, 197, 301`), *Kopiář přípisů (1579–1601)* Jana z Horky (`ff. 1–22` listy o upravení mezí a hranic ze 70. let 16. stol.; `ff. 26+` spor Matěje Žalkovského 1579–1581 a stížnost 20 vsí Jana ml. ze Žerotína na Velkých Losinách).
  2. **`ČMM` 1954 (`s. 271–279`), 1984 (`s. 96`), 1994 (`s. 253`):** Doložen *Kopiář Žalkovského (1594–1611)* v `MZA G 10, rkp. sign. 893` (st. č. 165) a doplněny signatury sněmovních kopiářů.
  3. **WOLNY, G., *Die Markgrafschaft Mähren*, Bd. 5 (Olmützer Kreis), Brünn 1839:** Excerpovány pasáže pro *Eisenberg & Schildberg* (`s. 271–285`, cit. `ZDO XXIX, 21` a `XXXI, 25`), *Schönberg & Frankstadt* (`s. 292–301`, 1562, 1567–1568, 1569), *Goldenstein* (`s. 324–341`, cit. `ZDO XXIX, 45 a 53`), *Hohenstadt* (`s. 367–369`), *Ullersdorf* (`s. 820–839`).
  4. **CHLUMECKÝ, P. / `Notizenblatt` 1865 (`s. 96–97`) a 1878/6 (`s. 42–46`):** Přehled map 16.–17. stol. a majetkových přesunů Žampachů a Tschirnhausů na Mittelwalde (1538, 1549, 1564).
  5. **ŠIMÁK, J. V., *Rukopisy majorátní knihovny hrabat z Nostitz a Rhienecka v Praze*, Praha 1910, s. 192 (`f. 330–331`):** Originální dopis Davida Heinricha z Tschirnhausu z 4. 8. 1626 Otto z Nostitz stěžující si na ztrátu Mittelwalde ve prospěch Lichtenštejnů.
  6. **ROTHWASSER / SCHÖNAU v *Der politische Bezirk Hohenstadt*, 1883 (`s. 14, 50–51`)** a ověření ročenek *Mährisch-Schönberg* 1871/1874.
- **Stažené a vizuálně přečtené historické mapy přes MZK IIIF (`tools/mzk_kramerius.py iiif-fetch`, `doc`):**
  - *Martin Helwig 1561 / [1579]* (`zdroje/mapa_helwig_1561_1579_celek.jpg` + detail a enhanced v `vyrezy/`),
  - *Pavel Fabricius 1569 / 1931* (`zdroje/mapa_fabricius_1569_celek.jpg` + detail a enhanced v `vyrezy/`),
  - *Pavel Fabricius / Ortelius [1573]* (`zdroje/mapa_fabricius_1573_celek.jpg` + detail v `vyrezy/`),
  - *Jan Amos Komenský [1633]* (`zdroje/mapa_komensky_1633_celek.jpg` + detail a enhanced v `vyrezy/`).

---

## 5. Vytvořené nástroje a výstupní soubory

- [tools/mza_aron_search.py](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre/tools/mza_aron_search.py) — šetrné vyhledávání v ARON MZA (výchozí prodleva zpřísněna na `>= 2,5 s`, varování před HTTP 400/404).
- [tools/mza_aron_img.py](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre/tools/mza_aron_img.py) — stahování dlaždic DZI/IIIF/PUBLISHED z MZA čistě přes Pillow (využívá lokální keš `pracovni/.cache_aron/`).
- [tools/mzk_kramerius.py](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre/tools/mzk_kramerius.py) — klient Kramerius MZK v7 včetně podpořených mapových výřezů `iiif-fetch`.
- [data/mza_nalezy.json](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre/data/mza_nalezy.json) — strukturovaný katalog nálezů (aktualizován 20. 11. 2026).
- [archivni_dotazy_MZA_Brno.md](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre/archivni_dotazy_MZA_Brno.md) — pokyny pro online dohledání i badatelnu MZA (aktualizováno 20. 11. 2026).
- [README_Soudni_pre_o_hranice_16_stoleti_MZA.md](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre/README_Soudni_pre_o_hranice_16_stoleti_MZA.md) — závěrečná souborná studie (aktualizováno 20. 11. 2026).

---

## 6. Navazující sběr MZA ARON dne 2026-11-20 (15:01–15:08 SEČ)

- **Okno dostupnosti (`15:01–15:07 SEČ`):** Při plánovaném opakování (`task-350`) byl server `www.mza.cz` dočasně dostupný (`HTTP 200`). Během 6minutového okna proběhla šetrná dávka dotazů (`search` i `detail`).
- **Uložených 16 plných JSON detailů (`/api/aron/apu/<uuid>`, celkem `3,38 MB` v [pracovni/.cache_aron](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre/pracovni/.cache_aron)):**
  1. `6ffd8baa-1d6c-4274-a0d0-14968fab873b` — `A 3 > Půhony > cúdy olomoucké`, `inv. č. 709` (`709 kniha`, *Rejstra holomaucký 1575 – W*, `1575/1579`): **klíčové zjištění — `DIGI: 0`**, v badatelně MZA je přístupná pouze studijní kopie na **černobílém mikrofilmu č. 709** (online skeny neexistují).
  2. `d90f1f16-3d0c-46e3-b2e1-fa1910f0abce` — `A 3 > Půhony > cúdy brněnské`, `inv. č. 754` (*Brněnski – W*, `1575–1579`), **`DIGI: 1` (580 DZI skenů)**.
  3. `02f8321f-0411-40ae-bab7-712619040a72` — `A 3 > cúdy brněnské`, `inv. č. 737` (`E`, `1512–1516`), **`DIGI: 1` (253 DZI skenů)**.
  4. `06062ce8-6ebd-4f68-9aaf-f786bc041cba` — `A 3 > cúdy brněnské`, `inv. č. 763` (`BRNIEN NUMERO 5`, `1616–1628`), **`DIGI: 1` (660 DZI skenů)**.
  5. `158ba9d0-b969-4db0-83df-b3c159b8b565` — `A 3 > Sněmovní památky a kopiáře`, `inv. č. 4`, `orig. sign. N. 4`, **Sněmovní památky IV (`1584–1599`)**: **`DIGI: 1` (435 DZI skenů)**!
  6. `16077658-bb29-4e8c-8c94-81884b8be8c3` — `A 3 > Sněmovní památky a kopiáře`, `inv. č. 10`, `orig. sign. N. 1`, **Sněmovní kopiář I (`1526–1546`, 285 fol.)**: **`DIGI: 1` (291 DZI skenů)**!
  7. `c057de9b-0dbf-441c-988d-e9a55d641fd4` — `D 22`, `inv. č. 304`, `orig. sign. 394` (*Hraniční mapa mezi Moravou a Kladskem*, `[1781]`), potvrzeno **`DIGI: 1` (5 DZI skenů, `order 1–5`)**.
  8. `6853bd38-931b-43a2-8da4-785052d9a85a` — `A 1 Stavovské listiny`, `inv. č. 196` (`196 krabice`, *Radní města Mittelwalde holdují markraběti Joštovi*, `1388-08-04`), **`DIGI: 1` (3 DZI skeny, `order 1–3`)**.
  9. `dcce1f8a-e89b-4a97-b5f0-8e4aebae219d` — `A 3 > Zemské desky` (`parent: 77d0cc2c-cec6-48e7-b64c-093b033507aa`), uzel **Zemské desky cúdy olomoucké** (`childCnt: 38`, 31 rozsahů `1348–1642`, vč. `1573–1587` = XXIX, `1588–1595` = XXX, `1596–1598` = XXXI, `1599–1608` = XXXII).
  10. `0724aed0-53e2-470c-b940-94dc0472deed` — `G 12 Cerroniho sbírka`, `397 karton`, `Cerr II, č. 325` (*Půhonové... S, T, V, W 1562–1579*), `DIGI: 0`.
  11. `074826fc-8758-4cba-9c8b-c841df9b9652` — `G 11 Sbírka rukopisů Františkova muzea`, `57 karton`, `sign. 133` (`Schr. 672`), `DIGI: 0`.
  12. `75ee42de-0883-4838-b1fc-c4edafd06c28` — `G 140 Rodinný archiv Ditrichštejnů Mikulov`, `168 karton`, `inv. č. 520`, `sign. 236/b` (`1631-08`, 172 fol., Žerotínové vs. Šumperk a Šilperk), `DIGI: 0`.
  13. `24ea5eef-ab05-48af-a11d-f2ebe03f5747` — `G 11`, `415 karton`, `sign. 769` (`Schr. 697`, *Fragment kopiáře ... pro potřebu Jana Žalkovského z Žalkovic*, `1600–1620`, 137 fol.), `DIGI: 0`.
  14. `084388a1-3792-4b53-91ff-3f0755c57c3a` — `G 10`, `173 kniha`, *Kodex Žalkovských ze Žalkovic* (Část 5: *Opisy písemností pro Hynka Žalkovského*, fol. 267v–277v), `DIGI: 0`.
  15. `1ea4b6a6-fd07-4c13-ac75-ab3371e53262` — `G 10`, `inv. č. 1309` (`1309 kniha`, 1840, 144 fol.), *Josef Chytil: Abecední věcný index ke knihám sněmovních památek z let 1526–1642*, `DIGI: 0`.
  16. `22a155b1-d375-4c94-8bf1-272f49f2408b` — `Přiznávací berní listy` (Olomoucký kraj 1587), `8 karton`, `sign. 189` (*Matyáš Žálkovský z Žálkovic a na Dobromilicích* — Brodek, Jevíčko, Pivín), `DIGI: 0`.
- **Další vyhledaná `apu_id` (výsledky v [aron_step222.txt](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre/pracovni/aron_step222.txt) aj.):**
  - *Sněmovní památky & kopiáře:* `b91b6466` (I, `1518–1546`), `7bbac0fc` (II, `1547–1570`), `6e260fed` (III, `1571–1583`), `def0690b` (*Sněmovní kopiář 1601–1610*), `066e446f` (*Sněmovní kopiář č. 1 1526–1546*), `b9336dec` (uzel), `2407fc11` (*Výtah 1492–1571*).
  - *Půhony & sborníky 1567–1597:* `c8aa7560` (*Registra nálezů půhonův...*, 724 s., půhony brněnské i olomoucké `1567–1579`), `1cc39311` (*Rejstřík půhonů a nálezů olomouckého soudu podle jednotlivých věcných hesel 1494–1593*), `207b3c51` (*Sborník 1463–1584*), `13f8a72b` (*Nálezové... 1406–1585*), `215444a4` (Cyprián Korecký, do `1576`), plus dílčí knihy `bffda3ff` (`1567–1569`), `d7f21b6f` (`1570–1574`), `e2c097ce` (`1573/1575`), `b8869852` / `de5b162c` (`1580–1585`), `fce5e55c` (`1586–1588`), `3424e568` (`1586–1592`), `8fc62465` (`1589–1593`), `60f52cfd` (`1592–1597`).
  - *Listiny Matyáše Žalkovského jako král. prokurátora:* `0674375f` (rozhodčí listina Hradiště vs. Velehrad) a `2083a991` (porovnání Hradiště vs. Staré Město, kolem r. 1581).
- **Příčina obnovení blokace kolem `15:08 SEČ`:** Dotaz na starší UUID `3b2b73b2-658b-494b-a25e-cc9265f72cf3` (z dřívějších poznámek *Dlouhomilov*) vrátil `HTTP 404` a následné testování nepodporovaných názvů filtrů rodiče (`parent` / `parentId` / `PARENT~REF`) na `/api/aron/apu/listview` vrátilo `HTTP 400`, což okamžitě aktivovalo firewall/fail2ban na `194.228.117.162:443` (`TimeoutError`, včetně výpadku dlaždic `iipsrv.fcgi`). Nástroj `tools/mza_aron_search.py` proto zpřísněn na výchozí pauzu `2,5 s` a doporučuje se nikdy nezkoušet neověřené parametry ARON.
