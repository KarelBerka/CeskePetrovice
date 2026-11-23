# České Petrovice (*Böhmisch Petersdorf*) – Historický archivní portál

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-České%20Petrovice-8B4513?style=for-the-badge)](https://karelberka.github.io/CeskePetrovice/)

Digitalizovaná historická kronika, genealogická databáze a interaktivní mapový portál obce **České Petrovice** (ZÚJ `580066`, k. ú. `622702`, okres Ústí nad Orlicí, historicky panství Kyšperk a soudní okres Králíky).

---

## Hlavní funkce webu (7 provázaných stránek)

1. **`index.html` – Rozcestník & Aktuality:** Přehled klíčových metrik (170 objektů, 467 obyvatel r. 1921, 832 identit), obecní erb (REKOS č. `5727`) a trojjazyčně filtrované aktuality výzkumu (`CZ / EN / DE`).
2. **`pribeh.html` – Příběh obce (1511–2026):** 10 chronologických kapitol od hraničních pří 16. století na trojmezí Kladska, Čech a severní Moravy přes dostavbu kostela sv. Petra a Pavla (1734), lokálii (1784) a přečíslování domů (1805/1806) po éru tkalců, menšinovou školu (1923), osud Františka Bařinky († 1945) a současnost.
3. **`mapa.html` – Interaktivní mapa & Atlas (170 objektů):**
   - Přesná RÚIAN poloha **108 stávajících domů** (`čp. 1–160` bez zaniklých + `161–163`), **6 rekreačních objektů (`č. ev.`)**, **kostel sv. Petra a Pavla (st. p. 57, ÚSKP `34598/6-4044`)** a **55 zaniklých čp.** vč. konkordance přečíslování 1805/1806.
   - Živé vrstvy **ČÚZK Ortofoto / ZTM / KN**, **CENIA Historická ortofotomapa 1953–1954** (subdecimetrová polynomiální transformace ze 114 bodů RÚIAN s `RMSE = 0,037 m`), archivní ortofota ČÚZK `2000–2022` a režim **Vedle sebe**.
4. **`obyvatele.html` – Stránkovaný rejstřík obyvatel:** Všech **467 přítomných obyvatel ze 143 archů sčítání 1921** + 17domovní výběrový vzorek sčítání **1869**, propojené identity a 14 biografických profilů (František Bařinka, Josef Koth, Marie Umlaufová, Johan Schroller, Adolf Scholz, MUDr. Josef Moravec, P. F. L. Kožischek / P. J. Ullrich, P. Wenzl Sabata, P. František Chládek, učitelé A. Faltus a J. Gruber, vrchní strážmistr F. Šlesinger, hostinský F. Pacha, Filomena Adlerová).
5. **`demografie.html` – Historická demografie (1654–2026):** Dlouhodobý graf populace a domů (historické maximum **882 obyvatel v r. 1880**), věková pyramida a profese r. 1921, třívrstvá inkoustová revize obcovací řeči r. 1910 (`491/37 -> 492/36 -> 487/41 + 3`), Přehled zvířectva r. 1910 (`272 skotu`, `127 koz`, `167/170 prasat`), struktura půdy RÚIAN 2026 (`629,83 ha`, `1 777 parcel`) a krize úmrtnosti `1806–1945` (vč. vyvrácení cholery r. 1866).
6. **`reference.html` – Katalog pramenů & Badatelský průvodce:** Kompletní bibliografie **ČSN ISO 690**, soubory `.md` a `.json` ke stažení, heraldický popis REKOS `5727`, farní posloupnost matrik (`1591–1942` & civilní matriky `1894–1935`), slovníček a pojistka proti 7 homonymům (*Petrovičky*, *Petříkovice* aj.).
7. **`cluster.html` – Laboratoř propojování osob & Graf závislostí:** Interaktivní propojení matriky `23-1` (`1771–1784`) a sčítání `1869–1921` (`832` záznamů, `832` identit, `322` kandidátů k revizi, graf závislostí s `1 312` uzly a `2 554` hranami).

---

## Spuštění a obnova dat

- **Lokální náhled:** `node serve.js` (HTTP server na `http://127.0.0.1:8086/index.html`).
- **Generování dat:**
  1. `python -X utf8 tools/build_web_assets.py` (stáhne znak z Wikimedia Commons a zkomprimuje skeny/mapy do `assets/`).
  2. `python -X utf8 tools/build_web_data.py` (sestaví `data/houses.js`, `data/boundaries.js`, `data/references.js`).
  3. `node build_registry.js` (sestaví `data/census_registry.js` a ověří vazby).
  4. `node build_clusters.js` (sestaví `data/cluster_dataset.js` a `data/census_links.js`).

---

## Licence, ochrana dat (GDPR) & poděkování

- **Zdrojový kód portálu:** [MIT License](LICENSE).
- **Strukturované přepisy, metadata a autorské texty:** [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) s uvedením primárního archivu (`SOA HK`, `SOkA ÚO`, `MZA Brno`, `MZK`, `SVK HK`, `ČÚZK`, `CENIA`) a projektu.
- **GDPR:** Portál zveřejňuje výhradně historické údaje nežijících osob a respektuje zákonné archivační lhůty.
- **Poděkování:** Archivní rešerše, datová konsolidace a vývoj tohoto webového portálu vznikly s pomocí nástroje **Google Antigravity**.
