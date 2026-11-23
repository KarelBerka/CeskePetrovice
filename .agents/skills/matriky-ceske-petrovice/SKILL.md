---
name: matriky-ceske-petrovice
description: Metodika a workflow pro systematické zpracování farních matrik (Bartošovice 2-8336, Lukavice 83-1/2, Nekoř 109-1..15, České Petrovice 23-1..8990/3317) a civilních matrik OÚ Žamberk (6376, 8272) z portálu ARON SOA Hradec Králové. Zahrnuje šetrné stahování HTTP Range přes tools/vca_aron_img.py, konkordanci přečíslování domů 1805/1806, paleografický přepis a aktualizaci webové databáze.
---

# Matriky České Petrovice (*Böhmisch Petersdorf*) – Metodika zpracování (N / O / Z & Indexy)

Tento skill standardizuje archivní katalogizaci, šetrné stahování skenů, paleografický přepis a datovou integraci církevních a civilních matrik pro obec **České Petrovice** (*Böhmisch Petersdorf*, ZÚJ `580066`, k. ú. `622702`, včetně přifařené osady **Čihák** / *Tschihak*) ze sbírky **Státního oblastního archivu v Hradci Králové (ARON SOA HK)**.

---

## 1. Farní posloupnost a úplný přehled matrik (1591–1942)

1. **1591–1624: Farnost Bartošovice v Orlických horách (*Batzdorf*)**
   - `sign. 2-8336` (poř. č. `60`, N `1597–1622`, O `1611–1624`, Z `1591–1618`, `97` sk.): [ARON 8dcb1638](https://aron.vychodoceskearchivy.cz/apu/8dcb1638-0a4e-412c-a4de-64f58bdb7d1b)
   - *Kritická poznámka:* Zápis *Pitzßdorff* (`1591`, sn. `4`) může označovat Bartošovice (*Patzdorf*) i Petrovice; spolehlivě doloženou značkou Českých Petrovic je samostatné **`p.` / `P.`** (*Petersdorf*) od roku `1596/1597` vedle `B.` (*Batzdorf*), `M.` (*Marienthal*), `F.` (*Freiwalde*) a `E.` (*Erlitz*).
2. **1646–1702: Farnost Lukavice**
   - `sign. 83-1` (poř. č. `5983`, NOZ `1646–1671`, `114` sk.): [ARON 8892a7da](https://aron.vychodoceskearchivy.cz/apu/8892a7da-a31a-4a18-a59f-2df1b606c5be)
   - `sign. 83-2` (poř. č. `5984`, NOZ `1672–1702`, `281` sk.): [ARON 5cc6920c](https://aron.vychodoceskearchivy.cz/apu/5cc6920c-e18d-4dd6-80c2-4ff282d9eadc)
3. **10. 1705 – 4. 1784: Farnost Nekoř** (filiální kostel sv. Petra a Pavla v Českých Petrovicích dostavěn `1734`)
   - `sign. 109-1` (poř. č. `7735`, N `10.1705–9.1753`, `213` sk.): [ARON fd865aa0](https://aron.vychodoceskearchivy.cz/apu/fd865aa0-64b3-40ab-b855-2d914eb6e360)
   - `sign. 109-2` (poř. č. `7736`, N `1753–1784`, `205` sk.): [ARON 77b1c8ff](https://aron.vychodoceskearchivy.cz/apu/77b1c8ff-f67b-4d67-8a1a-0c175eeb84a2)
   - `sign. 109-8` (poř. č. `7750`, O `11.1705–2.1784`, `131` sk.): [ARON 502a213a](https://aron.vychodoceskearchivy.cz/apu/502a213a-c42d-4051-8ce1-bdefc605205d)
   - `sign. 109-13` (poř. č. `7763`, Z `10.1705–5.1754`, `74` sk.): [ARON 333292f4](https://aron.vychodoceskearchivy.cz/apu/333292f4-79b2-4792-8a92-7e2b7d9db54a)
   - `sign. 109-15` (poř. č. `7765`, Z `6.1772–4.1784`, `63` sk.): [ARON 00dbff1c](https://aron.vychodoceskearchivy.cz/apu/00dbff1c-4174-401d-bad3-06f4ca332fa5)
4. **1770 – 1942: Vlastní matrika (`1770`), Josefínská lokálie (`5. 1784`) a Samostatná fara (`od 1857`, FÚ České Petrovice)**

| Sign. | Poř. č. | Druh | Období | Skenů | Permalink ARON SOA HK |
|---|---:|---|---|---:|---|
| `23-1` | `1436` | **N, index N + Repertorium** | `1770–4.1784` | `40` | [1fe9c209](https://aron.vychodoceskearchivy.cz/apu/1fe9c209-25bf-47d8-99b3-22adea3d960c) |
| `23-2` | `1437` | **N** | `5.1784–1816` | `96` | [17cdcc87](https://aron.vychodoceskearchivy.cz/apu/17cdcc87-0319-4f6b-8b19-5000a5a3d0b3) |
| `23-3` | `1438` | **N** | `1817–1838` | `100` | [7c2f7160](https://aron.vychodoceskearchivy.cz/apu/7c2f7160-7464-414c-9122-2114fdebfb6a) |
| `23-3310` | `1439` | **N** | `1839–1871` | `243` | [6a165923](https://aron.vychodoceskearchivy.cz/apu/6a165923-1386-43be-961f-f11057d5ee3d) |
| `23-6333` | `1440` | **N** | `1872–1909` | `187` | [7e80add9](https://aron.vychodoceskearchivy.cz/apu/7e80add9-89ec-4014-ab66-eb594b7a3247) |
| `23-4` | `1442` | **O, index O** | `11.1783–1844` | `84` | [23efb07e](https://aron.vychodoceskearchivy.cz/apu/23efb07e-33ab-4ad8-b090-d8c4872caa94) |
| `23-6334` | `1443` | **O** | `1845–1919` | `140` | [1f59fa32](https://aron.vychodoceskearchivy.cz/apu/1f59fa32-e5b6-45ae-9230-e48356a6ed6f) |
| `23-5` | `1446` | **Z, index Z** | `11.1783–1844` | `108` | [cb9cbdda](https://aron.vychodoceskearchivy.cz/apu/cb9cbdda-5e69-49d4-a2db-62e9b3987aae) |
| `23-8990` | `1447` | **Z, index Z (`Band II`)** | `1845–1942` | `184` | [9cbebc69](https://aron.vychodoceskearchivy.cz/apu/9cbebc69-9e44-4482-8bbd-7e3d4cfe6a9c) |
| `23-3317` | `1450` | **index NOZ** | `1783–1909` | `149` | [a4a6c559](https://aron.vychodoceskearchivy.cz/apu/a4a6c559-fb20-4edb-b346-3fe3f250a44f) |

5. **Okresní civilní matriky (OÚ Žamberk, bez indexů):**
   - `sign. 6376` (poř. č. `2379`, NOZ `1894–1924`, `83` sk. – 100 % přečteno): [ARON a863ff07](https://aron.vychodoceskearchivy.cz/apu/a863ff07-39ab-4fa9-806d-3f803a35b72d)
   - `sign. 8272` (poř. č. `2381`, O `1923–1935`, ohlášky `1923–1929`, `273` sk.): [ARON 4ea680df](https://aron.vychodoceskearchivy.cz/apu/4ea680df-ad99-48b9-adbc-0a244f641f6d)

---

## 2. Šetrné získávání skenů z SOA Hradec Králové (`tools/vca_aron_img.py`)

Před každým otevřením archivu ověř v `archivni-pamet` (`lookup_volume`, `lookup_scan`, `search_archive_memory`).
SOA HK poskytuje ZIP archivy na `storage.vychodoceskearchivy.cz` s podporou HTTP `Range`:

```powershell
$py = "C:\Users\krapn\AppData\Local\Python\pythoncore-3.14-64\python.exe"
# Zjištění počtu skenů a rozměrů bez stažení celého ZIPu:
& $py -X utf8 tools/vca_aron_img.py info <apu_id>
# Náhled do pracovni/ (level-offset 2):
& $py -X utf8 tools/vca_aron_img.py fetch <apu_id> <scan_num> pracovni/nahled.jpg --level-offset 2
# Plné rozlišení + půlení (_left, _right, _header, _bottom) a kontrastní _enhanced do vyrezy/:
& $py -X utf8 tools/vca_aron_img.py fetch <apu_id> <scan_num> zdroje/<nazev>.jpg --level-offset 0 --split --enhance
```

* **Pravidlo šetrnosti:** Stahuj vždy jen konkrétně potřebné snímky (nejprve rejstříky `23-3317`, `23-1` s35, `23-5` s89–108, `23-8990` s154–184), s prodlevami; nikdy nespouštěj slepé smyčky přes stovky snímků.

---

## 3. Kritické pravidlo přečíslování domů (`1805 / 1806`) a homonyma

1. **Renumerace `1805/1806` (*Alte* → *Neue Conscription*):**
   - Od **dubna `1771`** (`23-1`, sn. 7) do konce roku **`1805`** se v matrikách psala **stará čísla popisná** (*alte Nummer*).
   - Na `skenu 28` (`pag. 45`) matriky `23-5` je výslovná poznámka, že **od roku `1806` byla přijata čísla nové konskripce z r. `1805`**.
   - **Nikdy neztotožňuj dům před r. 1806 jen podle čísla!** Vždy ověř konkordanci v Kožischkově repertoáru (`23-1` sn. 35–40 / `data/domy_1771_1921.json`, např. mlýn staré `čp. 119` → nové `čp. 152`, fara staré `21/40` → nové `25`).
2. **Osada Čihák (*Tschihak*):**
   - Politicky součást Klášterce nad Orlicí, církevně přifařena k Českým Petrovicím; od r. `1806` má samostatný úmrtní oddíl/svazek (*Sterbbuch für Tschihak*). Vždy zapisuj obec doslovně (`Böhm. Petersdorf` vs. `Tschihak`).
3. **Homonyma:** Striktně vylučuj *Petrovičky / Německé Petrovice* (`Deutsch Petersdorf`), *Petrovice u Dolní Čermné / Lanškrouna*, *Petříkovice* (*Petersdorf* u Trutnova), *Petrušov* a *Petrovice u Štoků*.

---

## 4. Paleografie, webové náhledy a datová integrace

1. **Čtení výlučně z výřezů:** Široké dvoustrany čti z `_left` / `_right` (případně `_enhanced`), nejisté čtení znač `(?)`, nečitelné `[…]`, rozlišuj `doc` vs. `prob` a dodržuj pravidlo dvou nezávislých znaků.
2. **Webové náhledy (`assets/archives/`):** Šířka max `1400 px`, JPEG kvalita `70`, bez ukládání surových skenů do Gitu (`tools/build_web_assets.py`).
3. **Aktualizace databáze a rebuild webu:**
   - Zápisy ukládej do `data/domy_1771_1921.json`, `data/people.js` nebo `pracovni/` přepisů.
   - Spusť kompletní přestavbu dat:
     ```powershell
     & $py -X utf8 tools/build_web_data.py
     & "D:\AppData\Local\deno\node_compat_bin\node.exe" build_registry.js
     & "D:\AppData\Local\deno\node_compat_bin\node.exe" build_clusters.js
     ```
   - Po ukončení bádání synchronizuj `ArchivniPamet`:
     ```powershell
     & $py -X utf8 e:\Dropbox\Antigravity\ArchivniPamet\pamet.py sync-all
     ```
