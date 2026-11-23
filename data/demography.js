// ==========================================================================
// HISTORICKÁ DEMOGRAFIE, HOSPODÁŘSTVÍ & KRIZE ÚMRTNOSTI (1654–2026)
// Podle docs/demografie_a_scitani_1654_2026.md, docs/stabilni_katastr_1840.md,
// docs/rody_demografie_a_civilni_matriky.md, data/archival_sources.json
// a pracovni/ruian_parcels_summary_622702.json
// ==========================================================================

const demographyData = {
  municipality: "České Petrovice (Böhmisch Petersdorf)",
  zuj: "580066",
  kuCode: "622702",

  // Dlouhodobá řada 1654–2026 přesně dle data/archival_sources.json (Sommer, ČSÚ, ARON PO/PZ & 1921)
  populationSeries: [
    { year: 1654, numYear: 1654, houses: null, pop: null, est: true, era: "pre1869", housesText: "cca 56–57 usedlostí", source: "Berní rula (kraj Hradecký, panství Kyšperk)", note: "18 větších sedláků, 9 malorolníků, cca 29–30 chalupníků (počet osob v prameni neuveden) [lit]." },
    { year: 1836, numYear: 1836, houses: 153, pop: 842, est: false, era: "pre1869", source: "J. G. Sommer: Das Königreich Böhmen, Bd. 4 (1836)", note: "Předkatastrální topografie panství Kyšperk: 153 domů a 842 obyvatel [ed]." },
    { year: 1869, numYear: 1869, houses: null, pop: 869, est: false, era: "csu", source: "ČSÚ Historický lexikon / OÚ Žamberk 1869", note: "První moderní sčítání lidu (2 sv., 437 snímků v ARON; 17domovní vzorek přepsán) [doc][ed]." },
    { year: 1880, numYear: 1880, houses: null, pop: 882, est: false, era: "csu", source: "ČSÚ Historický lexikon obcí ČR", note: "Absolutní historické maximum zalidnění Českých Petrovic (882 obyvatel) [ed]." },
    { year: 1890, numYear: 1890, houses: 157, pop: 876, est: false, era: "csu", source: "Seznam míst 1893 / ČSÚ Historický lexikon", note: "157 domů a 876 obyvatel (v téže farnosti sousední Čihák: 27 domů, 123 obyv.) [ed]." },
    { year: 1900, numYear: 1900, houses: 151, pop: 657, est: false, era: "csu", source: "Seznam míst 1907 / ČSÚ Historický lexikon", note: "Prudký pokles o 219 obyvatel v důsledku krize domáckého tkalcovství [ed]." },
    { year: 1910, numYear: 1910, houses: 148, pop: 531, est: false, era: "csu", source: "SOkA ÚO, OÚ Žamberk inv. č. 529 PO / 607 PZ (100% přepis)", note: "531 přítomných (238 M / 293 Ž; 487 DE / 41 CS / 3 ciz.) + 92 nepřítomných; 137 obydlených a 11 neobydlených domů [doc]." },
    { year: 1921, numYear: 1921, houses: 143, pop: 467, est: false, era: "csu", source: "OÚ Žamberk inv. č. 970 (143 archů) & Lexikon 1924", note: "467 přítomných (221 M / 246 Ž; 145 domácností): v arších 392 DE / 70 CS / 5 ciz. (Lexikon 1924: 391 DE, 70 CS, 1 jiná, 5 ciz.) [doc][ed]." },
    { year: 1930, numYear: 1930, houses: null, pop: 443, est: false, era: "csu", source: "Mapa VZÚ 1938 [doc] & ČSÚ Historický lexikon [ed]", note: "Poslední předválečné sčítání: 443 obyv., z toho 67 čs. a 373 něm. občanů (+ 3 cizozemci/jiní) [doc][ed]." },
    { year: 1949, numYear: 1949, houses: null, pop: 196, est: false, era: "csu", source: "Seznam obcí v RČS (1949, s. 80)", note: "První publikovaný poválečný stav po vysídlení německého obyvatelstva [ed]." },
    { year: 1950, numYear: 1950, houses: null, pop: 179, est: false, era: "csu", source: "ČSÚ Historický lexikon obcí ČR", note: "Pokles na 40 % předválečného stavu (179 obyvatel) [ed]." },
    { year: 1961, numYear: 1961, houses: null, pop: 208, est: false, era: "csu", source: "ČSÚ Historický lexikon obcí ČR", note: "Poválečné maximum osídlení obce (208 obyvatel) [ed]." },
    { year: 1970, numYear: 1970, houses: null, pop: 174, est: false, era: "csu", source: "ČSÚ Historický lexikon obcí ČR", note: "Pozvolný pokles trvale bydlících a rozvoj chalupářské rekreace [ed]." },
    { year: 1980, numYear: 1980, houses: null, pop: 172, est: false, era: "csu", source: "ČSÚ Historický lexikon obcí ČR", note: "172 trvale žijících obyvatel [ed]." },
    { year: 1991, numYear: 1991, houses: null, pop: 159, est: false, era: "csu", source: "ČSÚ Historický lexikon obcí ČR", note: "Po obnovení samostatnosti obce k 1. 3. 1990 (159 obyv.) [ed]." },
    { year: 2001, numYear: 2001, houses: null, pop: 148, est: false, era: "csu", source: "ČSÚ Historický lexikon obcí ČR", note: "148 obyvatel [ed]." },
    { year: 2011, numYear: 2011, houses: null, pop: 145, est: false, era: "csu", source: "ČSÚ Sčítání lidu 2011", note: "Moderní demografické minimum (145 trvale bydlících osob) [ed]." },
    { year: 2021, numYear: 2021, houses: null, pop: 152, est: false, era: "csu", source: "ČSÚ SLDB 2021", note: "152 obyvatel; v RÚIAN 2026 celkem 114 budov (108 čp. + 6 č.ev.) [ed][inv]." },
    { year: 2026, numYear: 2026, houses: null, pop: 157, est: false, era: "csu", source: "ČSÚ Počet obyvatel v obcích ČR k 1. 1. 2026", note: "Aktuální stav k 1. 1. 2026 (stav k 31. 12. 2025): 157 obyvatel [ed]." }
  ],

  // Třívrstvá revize sčítání 1910 (tužka / černý inkoust / fialový inkoust)
  revision1910: {
    totalPresent: 531,
    totalAbsent: 92,
    permanentAbsent: 74,
    temporaryAbsent: 18,
    inhabitedHouses: 137,
    uninhabitedHouses: 11,
    households: 161,
    layers: [
      { step: "1. Původní náčrt sčítacího komisaře", de: 491, cs: 37, foreign: 3, note: "Prvotní zápis v sumáři PO před korekcemi čp. 114 a 160." },
      { step: "2. Mezi-revize (přeškrtnuté součty)", de: 492, cs: 36, foreign: 3, note: "Dočasný posun 1 osoby na přehledových řádcích." },
      { step: "3. Finální revize (uzavřeno v Žamberku/Praze)", de: 487, cs: 41, foreign: 3, note: "Konečný součet schváleného operátu 1910 (PO sn. 10): 487 DE / 41 CS / 3 ciz." }
    ],
    absentsNote: "Součet nepřítomných revidován z 94 (75 trvale + 19 dočasně) na konečných 92 (74 trvale + 18 dočasně) – viz úprava u čp. 62 a čp. 86."
  },

  // Srovnání národnosti 1910 vs. 1921 vs. 1930
  nationalityShift: [
    { year: "1910", de: 487, cs: 41, other: 3, labelDe: "91,7 %", labelCs: "7,7 %", labelOther: "0,6 %" },
    { year: "1921", de: 392, cs: 70, other: 5, labelDe: "83,9 %", labelCs: "15,0 %", labelOther: "1,1 %" },
    { year: "1930", de: 373, cs: 67, other: 3, labelDe: "84,2 %", labelCs: "15,1 %", labelOther: "0,7 % (ciz./jiní)" }
  ],

  // Přehled zvířectva 1910 (PZ - oficiální součty sn. 8 vs. součet jednotlivých položek)
  livestock1910: {
    horses: { total: 25, young: 3, mares: 5, geldings: 17 },
    cattle: { total: 272, cows: 153, heifers: 41, calves: 58, bulls: 10, oxen: 10 },
    goats: { total: 127 },
    pigs: { total: 167, actualTotal: 170, piglets3m: 68, runners1y: 87, sows: 9, other: 3 },
    beehives: { total: 3 },
    poultry: { total: 797, actualTotal: 803, hens: 701, geese: 5, other: 91 },
    note: "Úřední součet písaře na sn. 8 (167 prasat, 797 drůbeže) vs. skutečný součet jednotlivých domů v přepisu (170 prasat, 803 drůbeže) [doc]."
  },

  // Přesné využití půdy k. ú. 622702 dle RÚIAN 2026 (pracovni/ruian_parcels_summary_622702.json)
  landUseRuian2026: [
    { key: "ttp", label: "Trvalý travní porost (kód 7)", ha: 237.48, pct: 37.71, parcels: 645, color: "#65a30d" },
    { key: "les", label: "Lesní pozemek (kód 10)", ha: 175.87, pct: 27.92, parcels: 200, color: "#15803d" },
    { key: "orna", label: "Orná půda (kód 2)", ha: 154.69, pct: 24.56, parcels: 175, color: "#d97706" },
    { key: "ostatni", label: "Ostatní plocha (kód 14)", ha: 42.71, pct: 6.78, parcels: 424, color: "#64748b" },
    { key: "zahrady", label: "Zahrada (kód 5)", ha: 13.22, pct: 2.10, parcels: 123, color: "#0d9488" },
    { key: "zastavena", label: "Zastavěná plocha a nádvoří (kód 13)", ha: 5.67, pct: 0.90, parcels: 204, color: "#991b1b" },
    { key: "vodni", label: "Vodní plocha (kód 11)", ha: 0.19, pct: 0.03, parcels: 6, color: "#0284c7" }
  ],
  landUseNote: "Přesná struktura ze souhrnu RÚIAN 2026 (629,83 ha, 1 777 parcel) [inv]. V roce 1921/1949 činila výměra 627 ha; barevné císařské otisky Stabilního katastru 1840 v ÚAZK dosud nebyly zpřístupněny.",

  // Krize úmrtnosti 1806–1945 dle přímého čtení matrik 23-5 a 23-8990 (docs/rody_demografie_a_civilni_matriky.md)
  mortalityCrises: [
    { period: "1806 & 1810", event: "Epidemické vrcholy napoleonské éry (matrika 23-5)", detail: "1806: 46 zápisů / 47 osob (Hitziges Fieber, úplavice, hromadné dětské pohřby); 1810: vlna pravých neštovic (Blattern) [doc]." },
    { period: "1832 & 1837", event: "Tyfus (Nervenfieber) a černý kašel (matrika 23-5)", detail: "Místní ohniska břišního tyfu (Nervenfieber, 24 zápisů / 25 osob r. 1832) a černého kašle (Schwarzer Husten r. 1837) bez masové epidemie cholery [doc]." },
    { period: "1847–1848", event: "Hladová krize a pravé neštovice (matrika 23-8990)", detail: "Zimní vlna podvýživy a neštovic: 1847 přes 35 úmrtí, 1848 zapsáno 30 úmrtí (vysoká dětská i dospělá úmrtnost) [doc]." },
    { period: "1866 (negativní nález!)", event: "Prusko-rakouská válka – NULOVÁ cholera i padlí (matrika 23-8990)", detail: "Přímé čtení matriky 23-8990 vyvrací domněnku o válečné epidemii: v celém r. 1866 jen 13 úmrtí, mezi 4. 7. a 10. 11. 1866 žádný zápis, 0 obětí cholery i bojů [doc]." },
    { period: "1918", event: "Španělská chřipka na sklonku 1. sv. války (matrika 23-8990)", detail: "Podzimní vlna španělské chřipky (19 úmrtí za rok, mj. mlynář Pius Scholz na čp. 152) [doc]." },
    { period: "1939–1945", event: "2. světová válka & oběti mimo obec", detail: "Civilní a válečné ztráty mimo farní matriku (končí r. 1942), včetně politického vězně Františka Bařinky († 3. 5. 1945 na SS Thielbek) [doc]." }
  ]
};
