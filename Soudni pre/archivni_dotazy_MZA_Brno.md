# Archivní dotazy a badatelský průvodce pro MZA v Brně (i navazující archivy)

Tento dokument slouží jako přímý akční plán pro pokračování výzkumu **soudních pří o hranice v 16. století** mezi kladsko-českým pohraničím (**Mittelwalde / Tschirnhaus**, **Králíky / Grulich**) a severomoravskými panstvími (**Šilperk / Schildberg**, **Šumperk / Mährisch Schönberg**, **Kolštejn / Goldenstein**). Využívá jak výsledky první fáze (`19. 11. 2026`), tak úspěšnou sklizeň **16 plných JSON záznamů** do lokální keše [pracovni/.cache_aron](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre/pracovni/.cache_aron) ze dne **`20. 11. 2026` (`15:01–15:07 SEČ`)**; je rozdělen na část pro **online stažení DZI skenů a zbývajících detailů z domova** (po pominutí dočasné firewall blokace `194.228.117.162:443`) a na **badatelskou objednávku do studovny MZA Brno** (kde se nachází nedigitalizovaný mikrofilm č. 709 a originály/kopie v kartonech).

---

## Část A — Digitalizované archiválie MZA Brno v portálu ARON (online z domova)

### A.1 Přímé odkazy ARON a cílová folia k prohlédnutí (`DIGI: 1` i klíčové uzly)

| Archiválie (fond `A 1`, `A 3`, `D 22`) | Ověřené `inv. č.` / signatura | ARON Permalink (`apu_id`) | Stav digitalizace & cílová folia / skeny | Epist. stav |
|---|---|---|---|---|
| **`A 3` Památky sněmovní IV (`1584–1599`)** | `inv. č. 4`, `orig. sign. N. 4`, `4 kniha` | [ARON Památky sněmovní IV (`158ba9d0`)](https://www.mza.cz/aron/apu/158ba9d0-b969-4db0-83df-b3c159b8b565) | **`DIGI: 1` (`435` DZI skenů)!** Dle Kameníčka (`ČMM` 1891, s. 246): **`fol. 51` a `197`** (*„o rozepře na hranicích moravských, českých a rakouských“*), **`fol. 301`** (*o myslivosti na cizích gruntech*). JSON v `.cache_aron`. | `inv` / `ed` |
| **`A 3` Sněmovní kopiář I (`1526–1546`)** | `inv. č. 10`, `orig. sign. N. 1`, `10 kniha`, `285 fol.` | [ARON Sněmovní kopiář I (`16077658`)](https://www.mza.cz/aron/apu/16077658-bb29-4e8c-8c94-81884b8be8c3) | **`DIGI: 1` (`291` DZI skenů)!** Korespondence moravských stavů do Čech a k panovníkům (doplněk k *Památkám sněmovním I*). JSON v `.cache_aron`. | `inv` / `ed` |
| **`D 22` Hraniční mapa mezi Moravou a Kladskem** | `inv. č. 304`, `orig. sign. 394`, `304 mapa` | [ARON Mapa 304 (`c057de9b`)](https://www.mza.cz/aron/apu/c057de9b-0dbf-441c-988d-e9a55d641fd4) | **`DIGI: 1` (`5` DZI skenů, `order 1–5`)!** Kolorovaná mapa *Grenzkarte zwischen Mähren und Grafschaft Glatz* (Freyherr von Elmpt, 685×235 mm, dat. `[1781]`). JSON v `.cache_aron`. | `inv` |
| **`A 3` Kniha půhonná a nálezová brněnské cúdy (`1575–1579`)** | `inv. č. 754`, *Brněnski – W*, `754 kniha` | [ARON Brněnská půhonná W (`d90f1f16`)](https://www.mza.cz/aron/apu/d90f1f16-3d0c-46e3-b2e1-fa1910f0abce) | **`DIGI: 1` (`580` DZI skenů)!** Srovnávací brněnský protějšek k olomouckému svazku r. 1575–1579 (`inv. č. 709`). JSON v `.cache_aron`. | `inv` |
| **`A 1` Stavovské listiny – hold města Mittelwalde (`1388-08-04`)** | `inv. č. 196`, `196 krabice` | [ARON Listina Mittelwalde (`6853bd38`)](https://www.mza.cz/aron/apu/6853bd38-931b-43a2-8da4-785052d9a85a) | **`DIGI: 1` (`3` DZI skeny, `order 1–3`)!** Originál pergamenu (*Radní města Mittelwalde holdují markraběti Joštovi...*). JSON v `.cache_aron`. | `inv` |
| **`A 3` Zemské desky cúdy olomoucké (uzel řady)** | `ZDO` (`childCnt: 38`, vč. `1573–1587` = XXIX a `1596–1598` = XXXI) | [ARON ZDO olomoucké (`dcce1f8a`)](https://www.mza.cz/aron/apu/dcce1f8a-e89b-4a97-b5f0-8e4aebae219d) | Jednotlivé podřízené díly ZDO XXIX–XXXI nutno po obnově ARON otevřít přímo ve stromu uzlu `dcce1f8a` v prohlížeči (`fol. 21, 45, 53` v XXIX; `fol. 25` Šilperk + Červená Voda 1596 v XXXI). Viz též již ověřené `Kniha XVII` (`d6c753db`, 32 skenů) a `Kniha XXX` (`a1c55c94`, 149 skenů). | `inv` / `lit` |
| **`A 3` Památky sněmovní I–III & Kopiář `1601–1610`** | *Památky* I (`1518–1546`), II (`1547–1570`), III (`1571–1583`); *Kopiář* (`1601–1610`) | [`b91b6466`](https://www.mza.cz/aron/apu/b91b6466-836b-4590-8f34-8547e1e15b38) (I), [`7bbac0fc`](https://www.mza.cz/aron/apu/7bbac0fc-c25d-4bc1-adc5-77e0bd4fe9ba) (II), [`6e260fed`](https://www.mza.cz/aron/apu/6e260fed-f9f2-4bd9-a7d6-520c07b08c59) (III), [`def0690b`](https://www.mza.cz/aron/apu/def0690b-dba1-42ba-ab4e-46ad60416f71) | `apu_id` dohledána 20. 11. 2026; stav `DIGI` nutno ověřit jednorázovým `detail`. Pro **I** uvádí Kameníček `fol. 153` (*o hranicích zemských*); **III (`1571–1583`)** kryje přímo sedmdesátá léta! | `inv` / `ed` |
| **Souborné půhonné sborníky a věcné rejstříky** | *Registra nálezů půhonův* (`1567–1579`, 724 s.), *Věcný rejstřík olom. soudu* (`1494–1593`), *Sborník* (`1463–1584`) | [`c8aa7560`](https://www.mza.cz/aron/apu/c8aa7560-c883-46c4-bb7b-6b1b865b3bd2), [`1cc39311`](https://www.mza.cz/aron/apu/1cc39311-3811-46c2-b996-d7c289d28dfb), [`207b3c51`](https://www.mza.cz/aron/apu/207b3c51-f398-4411-9de4-d3f985077308) | Dohledáno 20. 11. 2026. Zjistit dotazem `detail`, zda jsou digitalizovány — pakliže ne, patří do badatelské objednávky v Části B vedle mikrofilmu č. 709! | `inv` |

> [!WARNING]
> **Bezpečnostní upozornění pro ARON (zjištěno 20. 11. 2026 v 15:08 SEČ):** Nikdy do ARON neposílejte neověřené názvy filtrů (`parent`, `parentId`, `PARENT~REF` → `HTTP 400`) ani zastaralá neexistující UUID z jiných projektů (`HTTP 404`) — opakované chyby `400/404` aktivují na MZA (`194.228.117.162:443`) dočasnou firewall/`fail2ban` blokaci celé IP! Všech 16 již stažených jednotek má JSON v `pracovni\.cache_aron`, takže `mza_aron_img.py fetch` pro ně **neposílá žádné API `/apu/` dotazy**, stahuje jen samotné dlaždice DZI.

### A.2 Hotové příkazy PowerShell pro dodatečné stažení z ARON MZA (po obnově dostupnosti `www.mza.cz`)

Spouštějte ze složky [Soudni pre](file:///e:/Dropbox/Antigravity/Ceske_Petrovice/Soudni%20pre) pomocí Pythonu 3.14 (`tools\mza_aron_search.py` nyní čeká min. `2,5 s`, `mza_aron_img.py` pak `0,12 s` mezi dlaždicemi):

```powershell
$py = "C:\Users\krapn\AppData\Local\Python\pythoncore-3.14-64\python.exe"

# 1. Ověřit detaily a stav digitalizace pro nově nalezené svazky A 3 a půhonné indexy (1 požadavek s pauzou 2,5 s)
& $py -X utf8 tools\mza_aron_search.py --delay 2.5 detail `
  b91b6466-836b-4590-8f34-8547e1e15b38 `
  7bbac0fc-c25d-4bc1-adc5-77e0bd4fe9ba `
  6e260fed-f9f2-4bd9-a7d6-520c07b08c59 `
  def0690b-dba1-42ba-ab4e-46ad60416f71 `
  c8aa7560-c883-46c4-bb7b-6b1b865b3bd2 `
  1cc39311-3811-46c2-b996-d7c289d28dfb `
  207b3c51-f398-4411-9de4-d3f985077308 `
  bffda3ff-8f5d-4938-803f-a278d6b1696d `
  d7f21b6f-5698-4a9b-afef-d1dc3c0f2b37 `
  e2c097ce-bd1f-4267-83d1-bb68e64660e1

# 2. Stáhnout DZI sněmy a mapy (čte již přímo z pracovni\.cache_aron\*.json bez dotazu na /api/aron/apu/!)
# 2a) Hraniční mapa D 22 inv. č. 304 (5 skenů, order 1..5): nejprve přehled, pak plné půlené výřezy
& $py -X utf8 tools\mza_aron_img.py fetch c057de9b-0dbf-441c-988d-e9a55d641fd4 1 2 zdroje\mza_d22_304_s1_celek.jpg
1..5 | ForEach-Object {
  & $py -X utf8 tools\mza_aron_img.py fetch c057de9b-0dbf-441c-988d-e9a55d641fd4 $_ 0 "vyrezy\mza_d22_304_s${_}_plne.jpg" --split --enhance
}

# 2b) Památky sněmovní IV (1584–1599, 158ba9d0, 435 skenů): cílová okna kolem Kameníčkových folií 51, 197, 301
# (předsádky/titulní listy mohou mírně posunout číslo DZI oproti foliaci, stahujeme proto vždy navazující rozsah)
@((51..54) + (197..200) + (301..304)) | ForEach-Object {
  & $py -X utf8 tools\mza_aron_img.py fetch 158ba9d0-b969-4db0-83df-b3c159b8b565 $_ 1 "pracovni\snemy4_s${_}.jpg" --enhance
}

# 2c) Sněmovní kopiář I (1526–1546, 16077658, 291 skenů) — úvodní regest / obsah (order 1..6)
1..6 | ForEach-Object {
  & $py -X utf8 tools\mza_aron_img.py fetch 16077658-bb29-4e8c-8c94-81884b8be8c3 $_ 1 "pracovni\snemy_kopiar1_s${_}.jpg" --enhance
}

# 2d) Listina Mittelwalde 1388 (A 1 inv. č. 196, 6853bd38, 3 skeny) a úvod Brněnské půhonné W (d90f1f16, 580 skenů)
1..3 | ForEach-Object {
  & $py -X utf8 tools\mza_aron_img.py fetch 6853bd38-931b-43a2-8da4-785052d9a85a $_ 0 "vyrezy\mza_a1_196_mittelwalde_s${_}.jpg"
}
1..5 | ForEach-Object {
  & $py -X utf8 tools\mza_aron_img.py fetch d90f1f16-3d0c-46e3-b2e1-fa1910f0abce $_ 1 "pracovni\brno_puhon_w_s${_}.jpg" --enhance
}
```

---

## Část B — Nedigitalizované fondy, mikrofilmy a kartony k objednání do badatelny MZA Brno

**Adresa badatelny:** Moravský zemský archiv v Brně, Palachovo náměstí 723/1, 625 00 Brno ([archiv@mza.cz](mailto:archiv@mza.cz)). U jednotek s omezením přístupnosti originálu (*studijní kopie / mikrofilm*) žádejte při objednávce předem příslušné studijní médium!

| Priorita | Fond MZA | Signatura / Inv. č. / Uložení (`apu_id`) | Datace | Předmět bádání v badatelně |
| :---: | :--- | :--- | :--- | :--- |
| **1** | **`A 3` Stavovské rukopisy** (`cúdy olomoucké`) | **`inv. č. 709`** (`709 kniha`, titul *Rejstra holomaucký 1575 – W*, [`6ffd8baa`](https://www.mza.cz/aron/apu/6ffd8baa-1d6c-4274-a0d0-14968fab873b)) — **černobílý mikrofilm č. 709!** | **1575–1579** | **Nejvyšší priorita pro r. 1576:** kniha **NENÍ online (`DIGI: 0`)**, ale má hotový **mikrofilm č. 709** v badatelně! Ověřit půhony a nálezy ve sporu **Matyáš Žalkovský (Šilperk) vs. Zdeněk z Valdštejna (Králíky)** i sousední spory kolem Kolštejna/Rudy. |
| **2** | **`A 3` Stavovské rukopisy** (`Kopiář` & půhonné indexy) | **Kopiář přípisů (`1579–1601`)** + (pokud nejsou `DIGI: 1`) **`1cc39311`** (*Věcný rejstřík olom. půhonů 1494–1593*) a **`c8aa7560`** (*Registra 1567–1579*, 724 s.) + *Památky sněmovní I / III* (`b91b6466`, `6e260fed`) | **1494–1601** | *Kopiář přípisů*: **`fol. 1–22`** (listy ze 70. let o *„upravení mezí a hranic… na hranicích českomoravských“*), **`fol. 26+`** (Matěj Žalkovský 1579–1581). *Věcný rejstřík `1cc39311`*: přímý abecední klíč k heslům *hranice, meze, lesy, Šilperk, Králíky*. |
| **3** | **`G 10` Sbírka rukopisů MZA** | **`inv. č. 1309`** (`1309 kniha`, 144 fol., [`1ea4b6a6`](https://www.mza.cz/aron/apu/1ea4b6a6-fd07-4c13-ac75-ab3371e53262)) | **1840** (`1526–1642`) | **Josef Chytil: *Abecední věcný index ke knihám sněmovních památek z let 1526–1642***. Nepostradatelná pomůcka hned na začátek studia v badatelně — ušetří desítky hodin při hledání *hranice, Kladsko, Mittelwalde, Šilperk, Žalkovský*. |
| **4** | **`B 10` Akta šlechtická** & **`G 154` Lichtensteinové-Kastelkornové** | **`B 10`: `karton 79, orig. sign. 25`** (`93be8366`); **`G 154`: `karton 4, inv. č. 76, orig. sign. 33`** (`226598ce`) | **[1501–1800]** a **1623–1628** | Složka ***„Z Tschirnhausu“*** + konvolut **Mittelwalde** (116 fol., obsahující též *písemnosti o jiných kladských záležitostech* — ověřit starší hraniční důkazy 16. stol. pánů z Tschirnhausu). |
| **5** | **Blok Žalkovských ze Žalkovic (`G 10`, `G 11`, `Berní listy`)** | **`G 10` `sign. 893`** (kopiář 1594–1611, *ČMM* 1994); **`G 11` `karton 415, sign. 769`** (`24ea5eef`, 137 fol., kopiář Jana Žalkovského); **`G 10` `kniha 173`** (`084388a1`, Kodex Žalkovských, fol. 267v–277v); **`Přiznávací berní listy` `karton 8, sign. 189`** (`22a155b1`, r. 1587) | **1500–1620** | Komplexní fondové zázemí držitelů Šilperku: rodové kopiáře (vč. *Schr. 697* pro nejvyššího písaře Jana Žalkovského), opisy Hynka Ž. a berní přiznání Matyáše Žalkovského k r. 1587 (ověřit přesnou majetkovou strukturu v době po vkladu Šilperku). Pozor: u `knihy 173` a berního přiznání se nahlíží do studijní kopie. |
| **6** | **`Acta finita`** & **`G 140` RD Ditrichštejnů Mikulov** | **`Acta finita`: `karton 27, inv. č. 200, sign. S-6`** (`58b61474`, r. 1638); **`G 140`: `karton 168, inv. č. 520, sign. 236/b`** (`75ee42de`, r. 1631-08, 172 fol.) | **1631** a **1638** | ***Hraniční nesváry mezi městem Šumperkem a bratřími ze Žerotína*** (`S-6`) a ditrichštejnské zemské regesty (`236/b` — stížnost Žerotínů z Velkých Losin na město Šumperk + zadlužení na Šilperku), pro zachycení starších předloh z r. 1567–1568. |
| **7** | **`G 12` Cerroniho sbírka**, **`G 11`**, **`G 1` Bočkova sbírka** | **`G 12`: `karton 397, sign. Cerr II, č. 325`** (`0724aed0`, 112 fol.); **`G 11`: `karton 57, sign. 133`** (`074826fc`, *Schr. 672*, 69 fol.); **`G 1`** *Landtage* (`2265–2346`) | **1562–19. stol.** | Brněnské půhonné výpisy `S–W` (*Cerr II, 325*, vč. `W 1575–1579`), topografie Moravy (Šumperk, Kolštejn, hranice) a Bočkovy opisy stavovských jednání. |
| **8** | **Velkostatek Moravská Třebová** & **RA Vrbnů Holešov** | vyžádat v inventářích fondů (`28f767ea`, `9c78004a`) | **1482–1620** | Písemnosti Boskoviců (Šilperk před r. 1574) a Bruntálských z Vrbna (Kolštejn od přelomu 16. a 17. stol.). |

---

## Část C — Nezbytné komplementární archivy mimo MZA Brno

Vzhledem k historicko-správní dělbě kompetencí v 16. století nejsou spory z **Kladského hrabství (*Grafschaft Glatz*)** a z **české strany (Králíky / *Grulich*)** uloženy jako uzavřený celek v Brně. Pro úplné dokumentární doložení všech stran sporu je třeba navazovat v těchto archivech:

1. **Národní archiv v Praze (NA Praha):**
   - Fondy **Česká komora (`ČK`)**, **Česká dvorská kancelář (`ČDK`)** a **Staré manipulace (`SM`)** (oddíl *Hranice / Grenzsachen*, *Kladsko / Glatz*): zde jsou uloženy královské hraniční komise vrchního lesmistra **Leonharda z Veldhammeru** (1573–1583), zakládací spory kolem lesních vsí *Marienthal*, *Freiwalde*, *Grenzendorf* (1587) a nález českého zemského soudu z roku **1586** proti bratřím **Davidovi a Michaelovi z Tschirnhausu**, stejně jako zprávy o pohraničních sporech z královského panství **Králíky** (1576–1577).
2. **Archiwum Państwowe we Wrocławiu (AP Wrocław):**
   - Fond **Hrabstwo Kłodzkie (`Grafschaft Glatz`)** — oddíl *Akta graniczne* a lenní/úřední knihy kladského zemského hejtmanství (*Amtshauptmannschaft Glatz*): originály a kopie kladsko-českých i kladsko-moravských hraničních rekognoscencí ze sklonku 16. století za účasti pánů z Tschirnhausu na Mittelwalde.
3. **Zemský archiv v Opavě – pobočka Olomouc & SOkA Šumperk / SOA Hradec Králové (Zámrsk):**
   - Dominiální fondy **Velkostatek Kolštejn (Branná)**, **Velkostatek Ruda nad Moravou (vč. Šilperku)** a **Velkostatek Velké Losiny** (pobočka Olomouc / Janovice) — urbáře, hraniční protokoly a lesní regesty pod Králickým Sněžníkem.
   - **Archiv města Šumperka** (SOkA Šumperk): originální smlouvy o výkupu města (1562), rozhodčí nálezy ve sporech s Janem ze Žerotína (1567–1568) a kupní listina na Frankštát a Hrabenov/Rabenseifen (1569).
   - **Velkostatek Králíky** a **Velkostatek Žamberk** (SOA v Hradci Králové / pobočka Zámrsk): pozemkové a lesní akty pánů ze Žampachu a Zdeňka z Valdštejna (vklad r. 1577: Králíky, Dolní/Prostřední/Horní Lipka, Boříkovice).
4. **Knihovna Národního muzea / Knihovna hrabat z Nostitz v Praze:**
   - Sign. v tištěném katalogu J. V. Šimáka (1910, s. 192, `f. 330–331`): originální dopis **Davida Heinricha z Tschirnhausu** z 4. 8. 1626 Otto z Nostitz ke ztrátě dědictví Mittelwalde (přímý protějšek k spisu `MZA G 154, inv. č. 76`).
