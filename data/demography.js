// ==========================================================================
// HISTORICKÁ DEMOGRAFIE, HOSPODÁŘSTVÍ & KRIZE ÚMRTNOSTI (1654–2026)
// Podle docs/demografie_a_scitani_1654_2026.md, docs/stabilni_katastr_1840.md,
// docs/rody_demografie_a_civilni_matriky.md a data/archival_sources.json
// ==========================================================================

const demographyData = {
  municipality: "České Petrovice (Böhmisch Petersdorf)",
  zuj: "580066",
  kuCode: "622702",

  // Dlouhodobá řada 1654–2026 (odhad usedlých před 1869 + oficiální ČSÚ / archy sčítání)
  populationSeries: [
    { year: 1654, numYear: 1654, houses: null, pop: 180, est: true, era: "pre1869", source: "Berní rula / odhad z počtu usedlostí", note: "Orientační demografický odhad na základě předkatastrálního stavu [ed]." },
    { year: 1785, numYear: 1785, houses: 80, pop: 420, est: true, era: "pre1869", source: "Schaller / Josefský katastr & lokálie 1785", note: "Vznik samostatné lokálie České Petrovice a vlastních matrik (23-1..23-5) [doc]." },
    { year: 1843, numYear: 1843, houses: 118, pop: 580, est: true, era: "pre1869", source: "Sommerova topografie & Stabilní katastr 1840", note: "Rozvoj horské tkalcovské a zemědělské vsi na 629,83 ha [lit]." },
    { year: 1869, numYear: 1869, houses: 129, pop: 583, est: false, era: "csu", source: "ČSÚ Historický lexikon / OÚ Žamberk 1869", note: "První moderní sčítání lidu (364 archů v ARON, 17domovní vzorek přepsán) [doc]." },
    { year: 1880, numYear: 1880, houses: 141, pop: 648, est: false, era: "csu", source: "ČSÚ Historický lexikon", note: "Prudký nárůst obyvatelstva v období rozkvětu domáckého tkalcovství [lit]." },
    { year: 1890, numYear: 1890, houses: 147, pop: 666, est: false, era: "csu", source: "ČSÚ Historický lexikon", note: "Absolutní historické maximum zalidnění Českých Petrovic (666 obyvatel) [lit]." },
    { year: 1900, numYear: 1900, houses: 148, pop: 616, est: false, era: "csu", source: "ČSÚ Historický lexikon", note: "Maximum obydlených stavení před nástupem krize ručního tkalcovství [lit]." },
    { year: 1910, numYear: 1910, houses: 148, pop: 531, est: false, era: "csu", source: "ARON 1910 PO/PZ (100% přepis)", note: "531 přítomných (487 DE / 41 CS / 3 ciz.) + 92 nepřítomných; 137 obydlených a 11 neobydlených domů [doc]." },
    { year: 1921, numYear: 1921, houses: 143, pop: 467, est: false, era: "csu", source: "ARON 1921 (100% přepis 143 archů)", note: "Přímý archivní součet 467 osob (392 DE / 70 CS / 5 ciz.); Lexikon 1924 uvádí 462 [doc]." },
    { year: 1930, numYear: 1930, houses: 142, pop: 430, est: false, era: "csu", source: "ČSÚ Historický lexikon", note: "Poslední předválečné československé sčítání před Mnichovem 1938 [lit]." },
    { year: 1950, numYear: 1950, houses: 120, pop: 136, est: false, era: "csu", source: "ČSÚ Historický lexikon", note: "Pokles téměř o 70 % po vysídlení německého obyvatelstva a první etapě dosídlení [lit]." },
    { year: 1961, numYear: 1961, houses: 60, pop: 162, est: false, era: "csu", source: "ČSÚ Historický lexikon", note: "Počet trvale obydlených domů klesl pod polovinu předválečného stavu [lit]." },
    { year: 1970, numYear: 1970, houses: 51, pop: 135, est: false, era: "csu", source: "ČSÚ Historický lexikon", note: "Stabilizace zemědělství a rostoucí podíl chalupářské rekreace [lit]." },
    { year: 1980, numYear: 1980, houses: 42, pop: 120, est: false, era: "csu", source: "ČSÚ Historický lexikon", note: "Nejnižší počet trvale obydlených domů (42) a obyvatel (120) [lit]." },
    { year: 1991, numYear: 1991, houses: 48, pop: 118, est: false, era: "csu", source: "ČSÚ Historický lexikon", note: "Demografické dno po r. 1989 (118 trvale bydlících osob) [lit]." },
    { year: 2001, numYear: 2001, houses: 60, pop: 151, est: false, era: "csu", source: "ČSÚ Sčítání lidu 2001", note: "Postupný návrat stálého osídlení a rozvoj cestovního ruchu [lit]." },
    { year: 2011, numYear: 2011, houses: 65, pop: 163, est: false, era: "csu", source: "ČSÚ SLDB 2011", note: "Oživení zástavby v oblasti rekreačního a horského střediska [lit]." },
    { year: 2021, numYear: 2021, houses: 76, pop: 155, est: false, era: "csu", source: "ČSÚ SLDB 2021", note: "155 trvale žijících obyvatel; v RÚIAN 2026 celkem 114 budov (108 čp. + 6 č.ev.) [doc]." }
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
      { step: "1. Původní náčrt sčítacího komisaře", de: 491, cs: 37, foreign: 3, note: "Prvotní zápis v sumáři PO przed korekcemi čp. 114 a 160." },
      { step: "2. Mezi-revize (přeškrtnuté součty)", de: 492, cs: 36, foreign: 3, note: "Dočasný posun 1 osoby na přehledových řádcích." },
      { step: "3. Finální revize (uzavřeno v Žamberku/Praze)", de: 487, cs: 41, foreign: 3, note: "Konečný součet schváleného operátu 1910 (PO sn. 10): 487 DE / 41 CS / 3 ciz." }
    ],
    absentsNote: "Součet nepřítomných revidován z 94 (75 trvale + 19 dočasně) na konečných 92 (74 trvale + 18 dočasně) – viz úprava u čp. 62 a čp. 86."
  },

  // Srovnání národnosti 1910 vs. 1921 vs. 1930
  nationalityShift: [
    { year: "1910", de: 487, cs: 41, other: 3, labelDe: "91,7 %", labelCs: "7,7 %", labelOther: "0,6 %" },
    { year: "1921", de: 392, cs: 70, other: 5, labelDe: "83,9 %", labelCs: "15,0 %", labelOther: "1,1 %" },
    { year: "1930", de: 365, cs: 62, other: 3, labelDe: "84,9 %", labelCs: "14,4 %", labelOther: "0,7 % (odhad dle lexikonu)" }
  ],

  // Přehled zvířectva 1910 (PZ - oficiální součty z aron sn. 8)
  livestock1910: {
    horses: { total: 25, young: 3, mares: 5, geldings: 17 },
    cattle: { total: 272, cows: 153, heifers: 41, calves: 58, bulls: 10, oxen: 10 },
    goats: { total: 127 },
    pigs: { total: 167, piglets3m: 68, runners1y: 87, sows: 9, other: 3 },
    beehives: { total: 3 },
    poultry: { total: 797, hens: 701, geese: 5, other: 91 }
  },

  // Využití půdy 1840 vs. 2026 (Stabilní katastr 629,83 ha / 1 777 parcel)
  landUse1840: [
    { key: "orna", label: "Orná půda", ha: 266.01, pct: 42.2, color: "#d97706" },
    { key: "les", label: "Lesy", ha: 202.42, pct: 32.1, color: "#15803d" },
    { key: "louky", label: "Louky & pastviny", ha: 135.14, pct: 21.5, color: "#65a30d" },
    { key: "zahrady", label: "Zahrady & sady", ha: 11.45, pct: 1.8, color: "#0d9488" },
    { key: "zastavena", label: "Zastavěná plocha & ostatní", ha: 14.81, pct: 2.4, color: "#64748b" }
  ],

  // Krize úmrtnosti 1806–1942 dle matrik 23-5 a 23-8990 (docs/rody_demografie_a_civilni_matriky.md)
  mortalityCrises: [
    { period: "1806–1817", event: "Napoleonské války, bída a tyfus / červenka", detail: "Opakované roční nárůsty úmrtí v matrice 23-5; v r. 1806 zavedeno souběžné uvádění nových a starých čp." },
    { period: "1831–1832 / 1847–1848", event: "Hladomor, bramborová nákaza & infekce", detail: "Horské hladové zimy zintenzivnily úmrtnost dětí a přestárlých výměnkářů v tkalcovských chalupách." },
    { period: "1866", event: "Prusko-rakouská válka & epidemie cholery", detail: "Průchody vojsk přes kladskou hranici (Kamieńczyk / Králíky) vyvolaly v létě 1866 vlnu infekcí." },
    { period: "1879–1880", event: "Záškrt a dětské epidemie", detail: "Vysoká kojenecká a dětská úmrtnost zaznamenaná v matrice 23-8990." },
    { period: "1914–1918", event: "1. světová válka & španělská chřipka (1918)", detail: "Nedostatek mužské pracovní síly a říjnová vlna španělské chřipky na sklonku války zachycená v 23-8990." },
    { period: "1939–1945", event: "2. světová válka & ztráty mimo obec", detail: "Civilní i bojové oběti mimo katastrální území (vč. F. Bařinky †3. 5. 1945 na lodi Thielbek)." }
  ]
};
