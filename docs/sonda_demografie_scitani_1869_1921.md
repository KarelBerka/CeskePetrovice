# Demografická sonda ze sčítání lidu Českých Petrovic (`1869–1921`)

Podrobná mikrodemografická a sociálně-ekonomická sonda založená na přímém čtení a kvantitativním vytěžení dochovaných sčítacích operátů fondu **Okresní úřad Žamberk** (`SOkA Ústí nad Orlicí / ARON SOA HK`) a jejich propojení s předfarními matrikami (`1591–1784`):
- **Sčítání `1869` (výběr `17` domů):** `15` obydlených + `2` prázdné domy, `82` přítomných osob + soupis dobytka (`[doc]`, [s1869_sampled.json](../pracovni/s1869_sampled.json)).
- **Sčítání `1910` (`100 %` přepis PO + *Hilfsausweis* + PZ):** `inv. č. 529` & `inv. č. 607` — všech `148` domů (`137` obydlených, `11` prázdných), `161` domácností, **`531` přítomných + `92` nepřítomných**, `162` řádků hospodářského zvířectva (`[doc]`).
- **Sčítání `1921` (`100 %` přepis všech `143` archů):** `inv. č. 970` — všech `143` domů (`130` obydlených, `13` prázdných), `145` domácností, **`467` přítomných obyvatel** (`221 M / 246 Ž`; `392 DE / 70 CS / 5 ciz.`) (`[doc]`, [census_registry.js](../data/census_registry.js)).
- **Epistemická poznámka a pojistka proti homonymům:** Veškeré údaje jsou označeny `[doc]` (přímé archivní čtení ze sčítacích operátů a matrik), `[ed]` (ČSÚ / publikované lexikony) nebo `[inv]` (RÚIAN 2026) a striktně se vztahují k obci **České Petrovice** (*Böhmisch Petersdorf*, ZÚJ `580066`, k. ú. `622702`), nikoli k sousedním **Petrovičkám** (*Deutsch Petersdorf*), **Petrovicím u Dolní Čermné** ani **Vernéřovicím**.

Interaktivní grafy a tabulky sondy na webu: [demografie.html#sonda](../demografie.html#sonda) • Mapa domů: [mapa.html](../mapa.html) • Rejstřík obyvatel: [obyvatele.html](../obyvatele.html)

---

## 1. Dvojí demografický šok: předválečný odliv mužů (`1910`) a jizvy 1. světové války (`1921`)

Porovnání mírového sčítání `1910` a prvního československého poválečného sčítání `1921` odhaluje, že vesnice neutrpěla jen jednorázovou válečnou ztrátu — její věková a pohlavní pyramida nese **dvě po sobě jdoucí rány** (`[doc]`):

- **Mírová asymetrie roku `1910` (`81,2` mužů na `100` žen):** V obci bylo přítomno pouze **`238` mužů proti `293` ženám** (`531` osob celkem, tedy převis `55` žen). Hlavní příčinou nebyla válka, ale **hospodářská pracovní migrace** po úpadku domáckého tkalcovství: vedle přítomných evidoval úřad **`92` nepřítomných domovských příslušníků** ve `49` domech (`74` trvale a `18` dočasně), z nichž dvě třetiny odešly až za hranice českých zemí (*Hilfsausweis*, viz kap. 4).
- **Válka v datech roku `1921` (`467` obyvatel = `221 M / 246 Ž`, index `89,8 M / 100 Ž`):** Celkový věkový průměr ze `458` osob se zjištěným datem narození činil **`35,8` let** (medián **`36,5` let**; muži průměr `34,7` / medián `32,0`; ženy průměr `36,8` / medián `37,0`). Samotný poměr pohlaví se zdánlivě mírně vyrovnal jen díky poválečnému návratu části migrantů a přílivu mladých českých státních zaměstnanců — detailní řez kohortami však ukazuje **dvě ostré válečné jizvy**:

### 1a) Věková struktura a kráter bojové generace (`1921`, `n = 458` se známým datem narození)

| Věková kohorta (k `15. 2. 1921`) | Muži (`M`) | Ženy (`Ž`) | Celkem (`%`) | Index `M / 100 Ž` | Demografický výklad `[doc]` |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **`0–14` let** (děti) | `58` | `55` | `113` (`24,7 %`) | `105,5` | Silné předválečné ročníky (`1907`: `16` dětí, `1913`: `12` dětí) vykompenzovaly hluboký válečný propad `1915–1918`. |
| **`15–19` let** (dorost) | `12` | `15` | `27` (`5,9 %`) | `80,0` | Mladí muži odcházeli na učení či za prací mimo obec (v obci učni `čp. 124`, `130`). |
| **`20–29` let** (mladší dospělí) | `32` | `29` | `61` (`13,3 %`) | **`110,3`** | Navzdory válce převažují muži díky mladé české finanční stráži a učiteli (`CS 6 M : 3 Ž`; u `DE` přesně `26 : 26`). |
| **`30–44` let** (**jádro 1. sv. války**) | **`31`** | **`46`** | `77` (`16,8 %`) | **`67,4`** | **Nejhůře postižená generace (ročníky cca 1876–1890):** ve skupině `30–34` let poměr přesně `1 : 2` (`8 M : 16 Ž`), ve `40–44` letech `10 M : 18 Ž`. U Němců klesá index až na **`61,5` (`24 M : 39 Ž`)**. |
| **`45–59` let** (střední věk) | `49` | `54` | `103` (`22,5 %`) | `90,7` | Nejsilnější dospělá kohorta; nosná hospodářská generace statků a chalup. |
| **`60+` let** (senioři) | `33` | `44` | `77` (`16,8 %`) | `75,0` | Vyšší dožití žen a vdovy na výměncích (`čp. 9, 11, 88, 103`). |

*(Pozn.: K `458` osobám s přesným věkem přistupuje `9` záznamů bez dochovaného či rozluštěného data narození — `5 M / 2 Ž` s nečitelným/chybějícím datem vč. roztrženého lístku `J. Tomana` v `čp. 1` + `2` osoby `#160 J. Vogel` `čp. 61` a `#177 B. Krümmelová` `čp. 64`, jejichž pohlaví a data narození `1. 4. 1911` a `11. 2. 1921` jsou doložena v souhrnech příslušných domů a dávají výsledných `221 M / 246 Ž = 467` osob.)*

### 1b) Propad porodnosti v letech `1915–1918` o téměř polovinu (`−49,4 %`)

Z pohledu ročníků narození dětí přežívajících do února `1921` zasáhla 1. světová válka reprodukci vesnice dramaticky (`[doc]`):

| Období narození | Ročníky jednotlivě (`1910–1920`) | Součet dětí | Průměr na rok | Index vůči `1910–1914` |
| :--- | :--- | :---: | :---: | :---: |
| **Předválečné (`1910–1914`)** | `1910`: `8`, `1911`: `9`, `1912`: `8`, `1913`: `12`, `1914`: `5` | **`42`** | **`8,40 / rok`** | `100 %` |
| **Válečné (`1915–1918`)** | `1915`: `7`, **`1916`: `2`**, `1917`: `5`, **`1918`: `3`** | **`17`** | **`4,25 / rok`** | **`50,6 %` (`−49,4 %`)** |
| **Poválečné (`1919–1920`)** | `1919`: `8`, `1920`: `9` | **`17`** | **`8,50 / rok`** | `101,2 %` *(okamžité zotavení)* |

Absolutním dnem byl **rok `1916`** (jen **`2`** žijící děti zapsané v `1921`) a **rok `1918`** (**`3`** děti). V lednu a první polovině února **`1921`** (do rozhodného dne `15. 2.`) se navíc v jediný den **`11. února 1921`** narodily hned **dvě nejmladší obyvatelky obce**: **Marie Elsnerová** (`čp. 61`, dopsaná na jediný popsaný rub celého úseku `s073–s144`) a **Bohumila Krümmelová** (`čp. 64`, nájemní byt 1).

### 1c) Vdovství (`41 : 14`), domy vedené ženami (`27,7 %`) a věkové extrémy

- **Vdovy vs. vdovci (`2,93 : 1`):** Ve sčítání `1921` je zapsáno **`41` vdov** (*ovdovělá / vdova*) oproti pouhým **`14` vdovcům**.
- **Ženy v čele domácností:** Z `130` obydlených domů měla na prvním řádku sčítacího archu zapsanou ženu jako majitelku bytu či hlavu domácnosti **`36` domů (`27,7 %`)**, z toho **`29`** výslovně ovdovělých (např. statky `čp. 1` Marie Umlaufová a `čp. 44` Anna Baierová či dům `čp. 160` Emilie Kalousová).
- **Nejstarší obyvatelé v únoru `1921` (`[doc]`):**
  1. **Josef Skroboč(?)** (`čp. 34`, `*22. 6. 1833`, `87` let) — ovdovělý výminkář, německé národnosti.
  2. **Anna Svobodová** (`čp. 103`, `*26. 6. 1833`, `87` let) — vdova na výměnku, německé národnosti.
  3. **František Urner** (`čp. 144`, `*23. 6. 1834`, `86` let) — ovdovělý, v r. `1914` ještě samostatný tkadlec, r. `1921` chudeník.
  4. **Marie Schreiberová** (`čp. 9`, `*25. 10. 1834`, `86` let) — vdova, v archu stále vedena jako *„polní práce u majitele bytu – pomocnice“*.
  5. **Johan Baier** (`čp. 158`, `*2. 9. 1840`, `80` let) — svobodný invalida (*„amputovány obě nohy u kolena“*).

---

## 2. Dvě generace v jedné vsi: věkový rozdíl `CS / DE`, šíření češtiny (`11 → 26` domů) a konec katolické jednolitosti

Mezi lety `1910` a `1921` klesl celkový počet přítomných obyvatel o `64` osob (`531 → 467`), avšak pod tímto úbytkem proběhla hluboká generační i národnostní proměna (`[doc]`):

- **O `11` let mladší česká menšina:** Němečtí obyvatelé roku `1921` (`n = 387` se známým věkem) vykazují výrazně stárnoucí věkový profil s **průměrem `36,6` let a mediánem `37,0` let**. Naproti tomu česká menšina (`n = 68` se známým věkem) měla **průměr `31,1` let a medián pouhých `26,0` let** — tedy o celých **11 let mladší mediánovou generaci**.
- **Prostorová expanze češtiny z `11` na `26` domů:** Zatímco v r. `1910` žilo `41` Čechů (`7,7 %`) jen v **`11` domech** (`5` čistě českých: `čp. 36, 112, 121, 145, 157`; `6` smíšených: `čp. 11, 25, 44, 85, 129, 160`), v r. `1921` již bylo `70` Čechů (`15,0 %`) zastoupeno ve **`26` domech** (téměř v každém pátém obydleném domě):
  - **`11` čistě českých domů:** `čp. 2, 5, 11, 25, 112, 121, 126, 129, 141, 145, 157`.
  - **`15` smíšených německo-českých domů:** `čp. 1, 6, 17, 28, 35, 63, 83, 84, 88, 111, 124, 130, 144, 156, 160` (často smíšené sňatky, čeští kočí/služební na německých statcích jako `B. Urban` v `čp. 88` či český sčítací komisař a finanční strážníci v podnájmu v `čp. 160`).
- **Poválečná přistěhovalecká vlna `1918–1921`:** Z rubriky *„v obci od“* (`inVillageSince`) lze přímo zachytit **`16` českých přistěhovalců let `1918–1921`** oproti `9` německým téže poválečné vlny. Jádro české vlny tvořili r. `1919` truhlář a hračkář **Josef Liebich** s rodinou z pruského Mezilesí (`čp. 141`, `6` osob) a r. `1920` pět státních zaměstnanců a rodinných příslušníků na `čp. 160` (finanční strážníci **František Šlesinger**, **Josef Pavel** s chotí **Marií**, **Rudolf Štehover**, **Bohuslav Prchlík** a učitel I. třídy **Josef Gruber** z Luže, autor samotného sčítání `1921`).
- **Konec `100%` římskokatolické jednolitosti (`1910 → 1921`):** V r. `1910` vykazovalo římskokatolické vyznání **`531 / 531` (`100,0 %`)** přítomných. Do února `1921` klesl tento podíl na `460 / 467` (`98,5 %`) a v archu se objevilo **prvních `7` nekatolíků**:
  - **`3` evangelíci:** `Fritz Adler` (`čp. 118`, augsb., chovanec nar. v Mezilesí), `Hildegarda Oertelová` (`čp. 34`, augsb., nar. v saském Auerbachu) a `Marie Pavlová` (`čp. 160`, evang. reform., manželka finančního strážníka z Černilova).
  - **`4` osoby bez vyznání:** všechny soustředěny v jediném domě **`čp. 160`** — finanční strážníci `Josef Pavel`, `Rudolf Štehover`, `Bohuslav Prchlík` a učitel `Josef Gruber`.

---

## 3. Mikroskopie domů (`1869 → 1910 → 1921`): drolení domácností a 15domovní longitudinální panel

Dlouhodobé vylidňování horských chalup se neprojevovalo jen poklesem počtu obyvatel z maxima `882` (`1880`) na `467` (`1921`), ale především **vyprazdňováním domácností a nárůstem samotářů**:

| Ukazatel bydlení `[doc][ed]` | `1869` *(vzorek 17 d.)* | `1890` *(celá obec)* | `1910` *(celá obec)* | `1921` *(celá obec)* |
| :--- | :---: | :---: | :---: | :---: |
| **Obydl. / prázdných domů** | `15` obydl. / `2` prázdné *(vzorek)* | `157` domů celkem | `137` obydl. / `11` prázdných (`148`) | `130` obydl. / `13` prázdných (`143`) |
| **Průměr osob na obydlený dům** | **`5,47`** *(82 / 15)* | **`5,58`** *(876 / 157)* | **`3,88`** *(531 / 137)* | **`3,59`** *(467 / 130)* |
| **Průměr osob na domácnost** | — | — | `3,30` *(531 / 161)* | `3,22` *(467 / 145)* |
| **Jednočlenné domy (samotáři)** | — | — | **`7`** (`5,1 %` obydl.) | **`19`** (`14,6 %` obydl. — **2,7× více!**) |
| **Vícedomácnostní domy (`2+` byty)** | `5` z `15` ve vzorku | — | `21` (`15,3 %` obydl.) | `15` (`11,5 %` obydl.) |

- **Bilance vyprázdněných vs. znovuobsazených domů (`1910 → 1921`):**
  - **Zcela opuštěno bylo `9` domů** (r. `1910` obydlené → r. `1921` neobydlené): **`čp. 13, 20, 30, 33, 36, 69, 82, 110, 116`** (u `čp. 116` výslovná poznámka *„Majitel občan v Bärnwaldě“*).
  - **Znovu osídleny byly `4` domy:** **`čp. 56, 103, 114, 119`** (z toho `čp. 119` Adolfa Jauše vyskočilo z `0` na `8` osob).
  - **Neobydleny zůstaly v obou sčítáních `3` domy:** **`čp. 8, 80, 150`**.
  - **Vnitřní přesuny v katastru:** Nejmarkantnější propad zaznamenalo **`čp. 69`** (`9 → 0` osob), jehož majitel *Albín Lux* se s celou rodinou přesunul na **`čp. 74`**, kde počet obyvatel naopak stoupl `3 → 8`. Obdobně státní **kasárna finanční stráže na `čp. 36`** (`4 → 0` osob) zanikla přesunem posádky do nájmu na **`čp. 160`** (`4 → 7` osob). *(Dále bylo `11` čísel z r. `1910` — zejm. podčísla `1a, 15a, 33a, 44a, 95, 127` a `75, 85, 96, 106, 109` — v sčítacích arších `1921` vynecháno, zatímco `6` čísel se v `1921` objevilo nově či obnovilo: `16, 34, 45, 84, 97, 108`.)*
- **Přesný `15`domovní longitudinální panel (`1869 → 1910 → 1921`):** Z `17` vybraných domů sčítání `1869` (`čp. 1, 7, 21, 25, 26, 27, 34, 44, 67, 88, 93, 94, 112, 130, 145, 152, 156` = celkem `82` přítomných + `12` nepřítomných) prošlo všemi třemi kompletně doloženými sčítáními **`15` souvislých stavení** (bez `čp. 26` a `čp. 34` chybějících v PO `1910`):
  - **Obyvatelstvo panelu:** **`77`** (`1869`, průměr `5,13`) → **`64`** (`1910`, `4,27`) → **`65`** (`1921`, `4,33`). Po prudkém pádu před rokem `1910` se na těchto usedlostech mezi lety `1910` a `1921` počet obyvatel fakticky stabilizoval.
  - **Chov skotu na spárovaných hospodářstvích téhož vzorku (`1869 → 1910`):** počet kusů skotu vzrostl z **`36` na `63` (+75 %!)** — např. půlláník na `čp. 88` ze `3` na `15` kusů, statek `čp. 44` z `10` na `14`, `čp. 94` z `1` na `7`, `čp. 112` ze `4` na `10` — zatímco počet úlů na týchž domech klesl z `10` na `0` (`čp. 156`: `8 → 0`, `čp. 145`: `2 → 0`). Usedlí rolníci tak nahrazovali kolabující domácí tkalcovství intenzivnějším pastevním chovem skotu.

---

## 4. Migrace, domovské právo a gravitace pruského Kladska (`1910` & `1921`)

Poloha Českých Petrovic na slezsko-kladské hranici vytvářela obousměrný migrační koridor, který jasně vyčleňoval jak **odliv petrovických rodáků ven (`1910`)**, tak **příliv nově usedlých (`1921`)**:

- **Domovské právo přítomných v r. `1910` (*Heimatsrecht*, `n = 531`, `[doc]`):**
  - **`437` (`82,3 %`)** s domovským právem přímo v Českých Petrovicích,
  - **`86` (`16,2 %`)** v jiných obcích okresu Žamberk,
  - **`1` (`0,2 %`)** v jiném okrese Čech (`čp. 36`), **`4` (`0,8 %`)** v jiných korunních zemích Předlitavska (`čp. 42`), **`3` (`0,6 %`)** cizí státní příslušníci (`čp. 87`).
- **Cíl cesty `92` nepřítomných domovských příslušníků (`1910` *Hilfsausweis*, `[doc]`):**

| Okruh pobytu nepřítomných (`1910` *Hilfsausweis*) | Trvale nepřítomní | Dočasně nepřítomní | Celkem | Podíl z `92` |
| :--- | :---: | :---: | :---: | :---: |
| **Jiné obce okresu Žamberk** | `9` | `6` | `15` | `16,3 %` |
| **Jiné okresy Království českého** | `5` | `1` | `6` | `6,5 %` |
| **Jiné země Předlitavska** *(Vídeň, Morava, Rakousy…)* | `9` | `1` | `10` | `10,9 %` |
| **Mimo Předlitavsko / cizina** *(zejm. Německo / pruské Slezsko a Kladsko)* | **`51`** | **`10`** | **`61`** | **`66,3 %`** |
| **Celkem nepřítomných (`49` domů)** | **`74`** | **`18`** | **`92`** | **`100,0 %`** |

Nejvíce nepřítomných měly domy `čp. 20` (`8` trvale — do r. `1921` zcela vylidněno!), `čp. 141` (`7` trvale — uvolněno pro rodinu Liebichovu), `čp. 160` (`7` dočasně) a `čp. 60` (`6` trvale).

- **Původ obyvatel podle rodiště v r. `1921` (`n = 266` určených rodišť po rozvinutí opakovacích uvozovek `"` v rámci archu):**
  - **`166` (`62,4 %`)** rodáků přímo z **Českých Petrovic** (`147` DE / `19` CS),
  - **`70` (`26,3 %`)** z **okolního Orlicka, Žamberecka a Králicka** (`45` DE / `25` CS — Klášterec n. O., Mladkov, Lichkov, Čihák, Nekoř, Říčky, Orlička, Celné, Žamberk, Bartošovice),
  - **`21` (`7,9 %`)** z **pruského Kladska, Slezska a Německa** (`17` DE / `4` CS — především bezprostřední sousedství přes hranici: *Mezilesí / Mittelwalde*, *Steinbach*, *Rosenthal*, *Rothfloss*, ale i *Vratislav / Breslau*, *Landeshut* a saský *Auerbach*),
  - **`8` (`3,0 %`)** z **vnitrozemí Čech a Moravy** (`3` DE ze severomoravského Šumperska a Mikulova / `5` CS zejména ze státní služby v `čp. 160`: Šestovice na Jaroměřsku, Černilov u Hradce Králové, Berounsko, Luže u Vysokého Mýta, Bystrá),
  - **`1` (`0,4 %`)** z **Rakouska (Vídeň)** (`Marie Hüttnerová`, `čp. 97`).
- **Zvláštní migrační fenomén — němečtí cizozemci a schovanci (`1921`):** Všech **`5`** evidovaných cizích státních příslušníků v obci mělo příslušnost k Německé republice (`čp. 17` *Elisabeta Kristenová*, `čp. 34` *Hildegarda Oertelová*, `čp. 45` *Arnošt Schmied* z Rothflossu a `2` děti `Valter` a `Aloisie Wachsmannovi` z Mezilesí jako schovanci v `čp. 122`). Celkově bylo v domě `čp. 122` u manželů Tíčových umístěno hned **`4` schovanců** (vč. *Ericha Luxe* `*1919` narozeného ve Vratislavi) a další schovanec *Fritz Adler* (`*1907` v Mezilesí) žil u tkalce A. Schmoka v `čp. 118`.

---

## 5. Sociálně-ekonomická pyramida (`1910`) a odchod od tkalcovského stavu (`1914 → 1921`)

Spojením soupisu obyvatelstva (`PO`) a hospodářského zvířectva (`PZ`, `162` řádků) z `31. 12. 1910` (po vyřešení přečíslovací shody `čp. 75` v PO = `čp. 74a` v PZ) získáváme **přesnou majetkovou stratifikaci všech `137` obydlených domů vesnice** (`[doc]`):

| Hospodářská vrstva (`31. 12. 1910`, `n = 137` obydl. domů) | Domy | Podíl | Klíčový majetek a reprezentativní příklady `[doc]` |
| :--- | :---: | :---: | :--- |
| **1. Sedláci s koňským potahem** | **`23`** | `16,8 %` | Drželi všech **`25` koní** (jen `čp. 113` a `116` měly po `2` koních); největší stáda skotu: `čp. 88` (`15` skotu / `7` krav), `čp. 69` (`12/5`), `čp. 76` (`12/7`), `čp. 112` český statek F. Veverky (`10/5`). |
| **2. Malorolníci se skotem (bez koní)** | **`32`** | `23,4 %` | Se sedláky tvořili `55` chovatelů skotu (`40,1 %`, `272` kusů); výjimečné stádo bez koně mělo `čp. 44` (`14` skotu, `6` krav, `7` prasat). |
| **3. Domkáři a tkalci pouze s kozami** *(„kráva chudých“)* | **`55`** | **`40,1 %`** | Nejpočetnější vrstva — přesně stejně domů jako všichni chovatelé skotu dohromady! Celkem kozy v `68` domech (`127` koz). |
| **4. Pouze prasata, drůbež nebo včely** | **`15`** | `10,9 %` | Drobná chalupnická samozásobitelská drůbežárna; na `čp. 77` zapsán **poslední a jediný včelař v obci** (`3` včelstva). |
| **5. Domy zcela bez zvířectva** | **`12`** | `8,8 %` | Veřejné budovy (fara `čp. 25`, škola `čp. 27`, kasárna `čp. 36`) a bezzemci / podnájemníci. |

- **Opouštění tkalcovství v letech `1914–1921` (`[doc]`):** Ve sčítání `1921` má vyplněnu rubriku předválečného povolání (`1914`) přesně **`169` osob**. Ze **`20` osob**, které byly před válkou zapsány v textilu a tkalcovství, jich **`8` (`40,0 %`) do roku `1921` z oboru odešlo**: např. tovární tkadlec *Antonín Prause* (`čp. 92`) i *Josef Herdler* (`čp. 154`) přešli k zemědělské nádeničině, domácký tkadlec *Josef Vacek* (`čp. 135`) k výpomoci v zemědělství, *Julius Schroller* (`čp. 146`) do lesnictví, textilní podmistr *Rudolf Štehover* (`čp. 160`) k Pohraniční finanční stráži a osmdesátiletý bývalý samostatný tkadlec *František Urner* (`čp. 144`) skončil jako obecní chudeník.
- **Národnostní dělba práce (`1921`):** Zatímco odvětví *tkalcovství, textilu a oděvů* zůstalo takřka výhradně doménou německých chalup (`44` DE oproti jen `3` CS osobám), ve *státní, obecní a veřejné službě* již dosáhli Češi úplné početní parity (`8` DE vs. `8` CS), přestože tvořili pouhých `15,0 %` obyvatelstva.

---

## 6. Koncentrace příjmení a `330` let kontinuity (`1591–1921`)

Ze zhruba **`125` rozlišitelných příjmení** zapsaných v roce `1921` tvořilo pouhých **deset nejčetnější rodů téměř třetinu celé vsi — `150` ze `467` obyvatel (`32,1 %`)**. Propojením se zpracovaným korpusem všech pěti předfarních matrik (`1591–1784`, `2 659` záznamů) se navíc ukazuje mimořádná historická stálost místní populace (`[doc]`):

| Poř. (`1921`) | Příjmení *(normaliz.)* | Osob `1921` | Domů `1921` | Doloženo v matrikách `1591–1784`? | Nejstarší rok & pramen | Počet zápisů před `1784` |
| :---: | :--- | :---: | :---: | :---: | :--- | :---: |
| `1.` | **Lux** | **`43`** | **`14`** | **Ano** | **`1598`** (`2-8336`) | `232×` |
| `2.` | **Schroller** | `20` | `6` | **Ano** | **`1597`** (`2-8336`) | `127×` |
| `3.` | **Scholz** (*Scholtz*) | `14` | `5` | **Ano** | **`1601`** (`2-8336`) | `117×` |
| `4.` | **Schreiber** | `13` | `4` | *Ne (až po 1784)* | — | `0` |
| `5.` | **Pacha** (*Pácha*) | `13` | `4` | **Ano** | **`1654`** (`83-1`) | `49×` |
| `6.` | **Adler** | `11` | `4` | **Ano** | **`1591`** (`2-8336`) | `141×` |
| `7.–11.` | **Wagner** | `9` | `4` | **Ano** | **`1593`** (`2-8336`) | **`250×`** |
| `7.–11.` | **Baier** (*Beier*) | `9` | `4` | **Ano** | **`1660`** (`83-1`) | `41×` |
| `7.–11.` | **Urban** | `9` | `4` | **Ano** | **`1653`** (`83-1`) | `88×` |
| `7.–11.` | **Šmok** (*Schmok*) | `9` | `2` | **Ano** | **`1706`** (`109-1`) | `52×` |

**Devět z deseti uvedených rodů čela tabulky roku `1921`** *(na dělené 7.–11. příčce s `9` osobami stojí rovněž poválečný či pozdější rod `Houdek` ve `2` domech, až po r. `1784`; jedinou další výjimkou v první desítce je rod `Schreiber`)* tak v Českých Petrovicích nepřetržitě sídlilo **215 až 330 let** před pádem habsburské monarchie; rody *Hensel* (`1671`), *Exler/Esler* (`1654`), *Svoboda* (`1752`) a *Hubálek* (`1758`) rovněž sahají před rok `1784`, zatímco další známé rody roku `1921` (*Houdek*, *Umlauf*, *Geisler*, *Urner*, *Toman*, *Veverka*, *Voksa*) vstoupily do vsi až v závěru 18., v 19. nebo na počátku 20. století.

---

*Poznámka k ochraně osobních údajů (GDPR): Veřejná studie zpracovává výhradně historická archivní data již nežijících osob nejpozději z roku 1921 a nezasahuje do soukromých ani poválečných osobních spisů.*
