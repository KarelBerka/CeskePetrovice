---
name: scitani-ceske-petrovice
description: Metodika a workflow pro zpracování sčítacích operátů obce České Petrovice (1869, 1880, 1890, 1900, 1910 po/pz, 1921) z fondu Okresní úřad Žamberk v SOkA Ústí nad Orlicí (ARON SOA HK), paleografickou transkripci a přestavbu webových databází.
---

# Sčítání lidu – Metodika zpracování operátů (České Petrovice, `1869–1921`)

Tento skill standardizuje práci se sčítacími archy obce **České Petrovice** (*Böhmisch Petersdorf*, ZÚJ `580066`, k. ú. `622702`, s. o. Králíky, politický okres Žamberk) z fondu **Okresní úřad Žamberk** uloženého v **SOkA Ústí nad Orlicí** (portál ARON SOA Hradec Králové).

---

## 1. Katalog sčítacích operátů (ARON SOA HK)

| Rok | Inv. č. / sv. | Uložení | Skenů | Stav v projektu | Permalink ARON SOA HK |
|---|---|---|---:|---|---|
| **1869** (sv. 1) | sv. 1 | 1 karton AP 94 | `139` | Vzorek (`čp. 1, 7, 21, 25, 26, 27, 34, 44`) | [197cb94c](https://aron.vychodoceskearchivy.cz/apu/197cb94c-11c1-46db-958e-17538da057dc) |
| **1869** (sv. 2) | sv. 2 | 2 karton AP 94 | `298` | Vzorek (`čp. 67, 74, 88, 93, 94, 113, 145, 152, 156`) | [53fdd5ce](https://aron.vychodoceskearchivy.cz/apu/53fdd5ce-657b-4c09-a49d-4a5b17401057) |
| **1880** | `101` | 32 karton AP 94 | `424` | Připraveno ke zpracování (`882` obyv. dle ČSÚ) | [2160547c](https://aron.vychodoceskearchivy.cz/apu/2160547c-5880-4444-b4ea-66af44ece0b7) |
| **1890** | `209` | 69 karton AP 94 | `431` | Připraveno ke zpracování (`157` domů, `876` obyv.) | [d1817bb5](https://aron.vychodoceskearchivy.cz/apu/d1817bb5-927a-42ec-b38e-ca5b7509cc5b) |
| **1900** | `315` | 130 karton AP 94 | `353` | Připraveno ke zpracování (`151` domů, `657` obyv.) | [649d7dba](https://aron.vychodoceskearchivy.cz/apu/649d7dba-1d81-4216-8ba3-f6d8e298c8f9) |
| **1910 (`po`)** | `529` | 260 karton AP 94 | `11` | **100 % přepsáno** (`531` přít.: `487 DE / 41 CS + 3` ciz., `92` nepřít.) | [01a84c3a](https://aron.vychodoceskearchivy.cz/apu/01a84c3a-5bb8-407e-965f-59ab75ff1a6e) |
| **1910 (`pz`)** | `607` | 265 karton AP 94 | `8` | **100 % přepsáno** (`162` řádků chovu zvířectva) | [0c1f8359](https://aron.vychodoceskearchivy.cz/apu/0c1f8359-afa0-4db0-aa04-6ce26478596c) |
| **1921** | `970` | 311 karton AP 75 | `286` | **100 % přepsáno** (`143` archů, `145` bytů, `467` obyv.) | [f60944b0](https://aron.vychodoceskearchivy.cz/apu/f60944b0-189c-4af2-a4c9-705055a84f4e) |

* **Nikdy nezaměňovat:** *Petrovičky / Německé Petrovice* (`inv. č. 219, 542, 619a, 983`) ani *Petrovice u Dolní Čermné* (`poř. č. 3432`).

---

## 2. Získávání a čtení skenů přes HTTP `Range` (`tools/vca_aron_img.py`)

```powershell
$py = "C:\Users\krapn\AppData\Local\Python\pythoncore-3.14-64\python.exe"
# Stažení snímku ze sčítání v plném rozlišení + automatické výřezy (_left, _right, _header, _bottom, _enhanced):
& $py -X utf8 tools/vca_aron_img.py fetch <apu_id> <scan_num> pracovni/scitani_<rok>/sn_<scan>.jpg --level-offset 0 --split --enhance
```

### Paleografická pravidla pro sčítací operáty:
1. Vždy čti z dělených výřezů (`_left` sl. 1–10, `_right` sl. 11–20, `_header` pro `čp.` a jméno majitele domu, `_enhanced` u vybledlých tužkových poznámek).
2. Ve sčítání **1869** dávej pozor na vlepené **křestní listy a domovské lístky** (např. `čp. 1`, `čp. 7`, `čp. 26`, `čp. 44`), které fyzicky zakrývají část řádků domácnosti – nikdy zakryté řádky nedomýšlej a explicitně uveď rozsah zakrytí.
3. Ve sčítání **1910 (`po`)** sleduj vícenásobné škrty a korekce komisaře *J. Schiela* v obcovací řeči (`491/37 -> 492/36 -> 487/41`), podčísla `1a, 15a, 33a, 44a, 74a` i seznam nepřítomných (*Hilfsausweis*).
4. Ve sčítání **1921** liché snímky (`1, 3, ..., 285`) obsahují rubriky `1–8` přední strany archu (údaje o bytě a osobách `1–8`), sudé snímky (`2, 4, ..., 286`) pokračování domácností (`9–16`) a podpis sčítacího komisaře (učitel *Josef Gruber* z `čp. 160`).
5. Nejisté čtení označ `(?)`, nečitelné `[…]`; striktně odděluj `doc` vs. `prob` a při ztotožnění napříč ročníky vyžaduj shodu alespoň **dvou nezávislých znaků**.

---

## 3. Datová aktualizace a přestavba webu

1. Nově přepsané ročníky (`1880`, `1890`, `1900`, zbytek `1869`) ukládej do `data/domy_1771_1921.json` (příp. doplňkových JSON v `pracovni/`).
2. Vygeneruj webové náhledy (`1400 px`, JPEG kvalita 70) do `assets/archives/` přes `tools/build_web_assets.py`.
3. Přestav všechny webové databáze a zkontroluj integritu:
   ```powershell
   & $py -X utf8 tools/build_web_data.py
   & "D:\AppData\Local\deno\node_compat_bin\node.exe" build_registry.js
   & "D:\AppData\Local\deno\node_compat_bin\node.exe" build_clusters.js
   ```
4. Při uzavření kompletního ročníku doplň trojjazyčnou aktualitu (`CZ / EN / DE`) do `data/news.js` a synchronizuj `ArchivniPamet`:
   ```powershell
   & $py -X utf8 e:\Dropbox\Antigravity\ArchivniPamet\pamet.py sync-all
   ```
