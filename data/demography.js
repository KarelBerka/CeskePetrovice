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
  ],

  // Hloubková demografická sonda ze sčítacích operátů 1869, 1910 (PO/Hilfsausweis/PZ) a 1921 (143 archů, 467 osob) [doc]
  censusProbe: {
    studyHref: "docs/sonda_demografie_scitani_1869_1921.md",
    kpis: [
      { label: "Propad porodnosti 1915–1918", value: "−49,4 %", detail: "4,25 dětí/rok (1916 jen 2) vs. 8,4/rok před válkou [doc]" },
      { label: "Bojová generace 30–44 let", value: "67,4 M / 100 Ž", detail: "31 M vs. 46 Ž celkem • Němci jen 24 M vs. 39 Ž (61,5) [doc]" },
      { label: "Věkový rozdíl CS vs. DE (1921)", value: "26 vs. 37 let", detail: "Medián Čechů o 11 let nižší (průměr 31,1 vs. 36,6 let) [doc]" },
      { label: "Odliv za hranice (1910)", value: "66,3 % (61 z 92)", detail: "Hilfsausweis: 61 nepřítomných mimo Předlitavsko [doc]" }
    ],
    wwiNatality: {
      preAvg: 8.4,
      warAvg: 4.25,
      postAvg: 8.5,
      years: [
        { year: 1910, count: 8, phase: "pre" },
        { year: 1911, count: 9, phase: "pre" },
        { year: 1912, count: 8, phase: "pre" },
        { year: 1913, count: 12, phase: "pre" },
        { year: 1914, count: 5, phase: "pre" },
        { year: 1915, count: 7, phase: "war" },
        { year: 1916, count: 2, phase: "war" },
        { year: 1917, count: 5, phase: "war" },
        { year: 1918, count: 3, phase: "war" },
        { year: 1919, count: 8, phase: "post" },
        { year: 1920, count: 9, phase: "post" }
      ],
      feb1921Note: "Do rozhodného dne 15. 2. 1921 se téhož dne 11. 2. 1921 narodily hned dvě dívky: Marie Elsnerová (čp. 61, jediný popsaný rub úseku s073–s144) a Bohumila Krümmelová (čp. 64) [doc]."
    },
    sexCohorts1921: [
      { label: "0–14 let (děti)", m: 58, f: 55, ratio: "105,5", note: "Silné ročníky 1907 (16) a 1913 (12) vyrovnaly válečný propad." },
      { label: "15–19 let (dorost)", m: 12, f: 15, ratio: "80,0", note: "Odchod chlapců na učení a práci mimo obec." },
      { label: "20–29 let (mladší dosp.)", m: 32, f: 29, ratio: "110,3", note: "Češi 6 M : 3 Ž (příliv finanční stráže a učitele), Němci vyrovnaně 26 : 26." },
      { label: "30–44 let (jádro 1. sv. v.)", m: 31, f: 46, ratio: "67,4", note: "Nejsilnější válečný kráter: Němci jen 24 M : 39 Ž (61,5), věk 30–34 přesně 1 : 2 (8 : 16)." },
      { label: "45–59 let (střední věk)", m: 49, f: 54, ratio: "90,7", note: "Páteř hospodářství na statcích a v chalupách." },
      { label: "60+ let (senioři)", m: 33, f: 44, ratio: "75,0", note: "Vyšší dožití žen a vdovy na výměncích (čp. 9, 11, 88, 103)." }
    ],
    widowhoodAndHeads: {
      widows: 41,
      widowers: 14,
      femaleHeadHouses: 36,
      widowHeadHouses: 29,
      inhabitedHouses: 130,
      oldest: [
        { name: "Josef Skroboč (?)", cp: "34", birth: "22. 6. 1833", age: 87, role: "výměnkář, ovdovělý (DE)" },
        { name: "Anna Svobodová", cp: "103", birth: "26. 6. 1833", age: 87, role: "výměnkářka, vdova (DE)" },
        { name: "František Urner", cp: "144", birth: "23. 6. 1834", age: 86, role: "ex-tkadlec 1914 → chudeník (DE)" },
        { name: "Marie Schreiberová", cp: "9", birth: "25. 10. 1834", age: 86, role: "vdova, polní pomocnice (DE)" }
      ],
      youngest: [
        { name: "Marie Elsnerová", cp: "61", birth: "11. 2. 1921", role: "4 dny před sčítáním (rub archu s114)" },
        { name: "Bohumila Krümmelová", cp: "64", birth: "11. 2. 1921", role: "4 dny před sčítáním (byt 1 v nájmu)" }
      ]
    },
    generationalGapAndFaith: {
      deMean: 36.6,
      deMedian: 37.0,
      csMean: 31.1,
      csMedian: 26.0,
      csHouses1910: 11,
      csPure1910: 5,
      csMixed1910: 6,
      csHouses1921: 26,
      csPure1921: 11,
      csMixed1921: 15,
      csMigrants1918_21: 16,
      deMigrants1918_21: 9,
      faith1910: "531 / 531 (100,0 %) římskokatolických",
      faith1921: "460 řím.-kat. (98,5 %) · 3 evang. (čp. 34, 118, 160) · 4 bez vyzn. (čp. 160)"
    },
    livestockTiers1910: [
      { tier: "1. Sedláci s koňským potahem", houses: 23, pct: 16.8, color: "#92400e", note: "Všech 25 koní (čp. 113 a 116 po 2); největší stáda skotu: čp. 88 (15), čp. 69 a 76 (12), čp. 112 (10)." },
      { tier: "2. Malorolníci se skotem (bez koní)", houses: 32, pct: 23.4, color: "#059669", note: "Celkem 55 chovatelů skotu (40,1 % domů, 272 ks); čp. 44 mělo 14 ks skotu bez koně." },
      { tier: "3. Domkáři & tkalci jen s kozami", houses: 55, pct: 40.1, color: "#d97706", note: "‚Kráva chudých‘ (127 koz v 68 domech) – přesně stejně domů jako všichni chovatelé skotu!" },
      { tier: "4. Jen drůbež, prasata či včely", houses: 15, pct: 10.9, color: "#64748b", note: "Drobný samozásobitelský chov; na čp. 77 zapsán jediný včelař v obci (3 úly)." },
      { tier: "5. Zcela bez zvířectva", houses: 12, pct: 8.8, color: "#cbd5e1", note: "Fara (čp. 25), škola (čp. 27), kasárna (čp. 36) a bezzemci / podnájemníci." }
    ],
    weavingShift1914_21: {
      with1914Data: 169,
      from1914: 20,
      stayed: 12,
      left: 8,
      examples: [
        "čp. 92 Antonín Prause: 1914 tovární tkadlec → 1921 nádeník v zemědělství",
        "čp. 135 Josef Vacek: 1914 tkalcovství po domácku → 1921 pomocník v zemědělství",
        "čp. 146 Julius Schroller: 1914 tkalcovství → 1921 lesní dělník",
        "čp. 160 Rudolf Štehover: 1914 textilní podmistr → 1921 strážmistr finanční stráže",
        "čp. 144 František Urner: 1914 samostatný tkadlec → 1921 chudeník (86 let)"
      ]
    },
    migration1910Hilfsausweis: [
      { label: "Okres Žamberk (jiné obce)", permanent: 9, temporary: 6, total: 15, pct: 16.3, color: "#64748b" },
      { label: "Jiné okresy Království českého", permanent: 5, temporary: 1, total: 6, pct: 6.5, color: "#0284c7" },
      { label: "Jiné země Předlitavska (Vídeň, Morava…)", permanent: 9, temporary: 1, total: 10, pct: 10.9, color: "#0d9488" },
      { label: "Mimo Předlitavsko / cizina (Kladsko, Německo)", permanent: 51, temporary: 10, total: 61, pct: 66.3, color: "#b91c1c" }
    ],
    birthplaces1921: [
      { label: "České Petrovice (rodáci)", total: 166, de: 147, cs: 19, pct: 62.4 },
      { label: "Okolní Orlicko, Žamberecko & Králicko", total: 70, de: 45, cs: 25, pct: 26.3 },
      { label: "Pruské Kladsko, Slezsko & Německo", total: 21, de: 17, cs: 4, pct: 7.9 },
      { label: "Vnitrozemí Čech a Moravy", total: 8, de: 3, cs: 5, pct: 3.0 },
      { label: "Rakousko (Vídeň)", total: 1, de: 1, cs: 0, pct: 0.4 }
    ],
    foreigners1921Note: "Všech 5 cizozemců (Německá republika): čp. 17 E. Kristenová, čp. 34 H. Oertelová, čp. 45 A. Schmied (Rothfloss) a 2 schovanci Wachsmannovi z Mezilesí v čp. 122 [doc].",
    houseTurnover: {
      density: [
        { year: "1890", avgPerHouse: "5,58", note: "876 obyv. / 157 domů [ed]" },
        { year: "1910", avgPerHouse: "3,88", note: "531 obyv. / 137 obydl. domů (3,30/dom.) [doc]" },
        { year: "1921", avgPerHouse: "3,59", note: "467 obyv. / 130 obydl. domů (3,22/dom.) [doc]" }
      ],
      singlePersonHouses1910: 7,
      singlePersonHouses1921: 19,
      emptied: ["13", "20", "30", "33", "36", "69", "82", "110", "116"],
      reoccupied: ["56", "103", "114", "119"],
      bothEmpty: ["8", "80", "150"],
      panel15: {
        houses: 15,
        pop1869: 77,
        pop1910: 64,
        pop1921: 65,
        cattle1869: 36,
        cattle1910: 63,
        note: "Na 15 souvisle sledovaných staveních ze vzorku 1869 se populace po r. 1910 ustálila (64 → 65), zatímco stavy skotu vzrostly o +75 % (36 → 63 ks; např. čp. 88: 3 → 15 ks, čp. 44: 10 → 14) [doc]."
      },
      highlights: [
        "čp. 69 → čp. 74: Statek Albína Luxe v čp. 69 (9 osob r. 1910) se do r. 1921 vyprázdnil (0) po přesunu rodiny do čp. 74 (3 → 8 osob).",
        "čp. 36 → čp. 160: Státní kasárna finanční stráže čp. 36 (4 Čechy r. 1910) r. 1921 prázdná (0); stráž i sčítací komisař J. Gruber nově v nájmu čp. 160 (4 → 7).",
        "čp. 119: Neobydlený dům z r. 1910 zaznamenal největší skok obce (0 → 8 osob, rodina Adolfa Jauše)."
      ]
    },
    topSurnames1921: [
      { surname: "Lux", people: 43, houses: 14, earliestYear: 1598, pre1784Count: 232, parishQuery: "Lux" },
      { surname: "Schroller", people: 20, houses: 6, earliestYear: 1597, pre1784Count: 127, parishQuery: "Schroller" },
      { surname: "Scholz", people: 14, houses: 5, earliestYear: 1601, pre1784Count: 117, parishQuery: "Scholtz" },
      { surname: "Schreiber", people: 13, houses: 4, earliestYear: null, pre1784Count: 0, parishQuery: null },
      { surname: "Pacha", people: 13, houses: 4, earliestYear: 1654, pre1784Count: 49, parishQuery: "Pacha" },
      { surname: "Adler", people: 11, houses: 4, earliestYear: 1591, pre1784Count: 141, parishQuery: "Adler" },
      { surname: "Wagner", people: 9, houses: 4, earliestYear: 1593, pre1784Count: 250, parishQuery: "Wagner" },
      { surname: "Baier", people: 9, houses: 4, earliestYear: 1660, pre1784Count: 41, parishQuery: "Beier" },
      { surname: "Urban", people: 9, houses: 4, earliestYear: 1653, pre1784Count: 88, parishQuery: "Urban" },
      { surname: "Šmok", people: 9, houses: 2, earliestYear: 1706, pre1784Count: 52, parishQuery: "Schmok" }
    ]
  }
};
