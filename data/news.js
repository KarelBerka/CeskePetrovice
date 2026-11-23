// ==========================================================================
// AKTUALITY PROJEKTU ČESKÉ PETROVICE (CZ / EN / DE)
// ==========================================================================

const newsCategories = [
  { key: "all", label: "Vše", labelEn: "All", labelDe: "Alle", icon: "📰" },
  { key: "feature", label: "Web & Funkce", labelEn: "Portal & Features", labelDe: "Portal & Funktionen", icon: "✨" },
  { key: "census", label: "Sčítání & Matriky", labelEn: "Census & Registers", labelDe: "Zählungen & Matriken", icon: "📋" },
  { key: "analysis", label: "Analýzy & Mapování", labelEn: "Studies & Mapping", labelDe: "Studien & Kartografie", icon: "🔬" }
];

const newsData = [
  {
    id: "news_2026_11_23_launch",
    date: "2026-11-23",
    category: "feature",
    badge: "Spuštění portálu",
    badgeEn: "Portal Launch",
    badgeDe: "Portal-Start",
    title: "Otevření historického webu Českých Petrovic (170 objektů, 467 obyv. 1921 & grafové propojování)",
    titleEn: "Launch of the České Petrovice Historical Portal (170 mapped objects & 467 residents from 1921)",
    titleDe: "Veröffentlichung des Geschichtsportals Böhmisch Petersdorf (170 Objekte & 467 Einwohner 1921)",
    summary: "Byl spuštěn 7stránkový badatelský portál s interaktivní mapou ČÚZK/CENIA 1953, stránkovaným rejstříkem všech 467 obyvatel roku 1921, demografickými grafy (1654–2026) a clustrovací laboratoří osob.",
    summaryEn: "Launched the 7-page research portal featuring Leaflet maps with live CENIA 1953 & ČÚZK orthophotos, all 467 residents from the 1921 census, demographic charts (1654–2026), and entity-linking lab.",
    summaryDe: "Start des 7-seitigen Forschungsportals mit interaktiver Karte (inkl. CENIA 1953 & ČÚZK-Orthofotos), allen 467 Einwohnern 1921, Demografie-Diagrammen (1654–2026) und Verknüpfungslabor.",
    links: [
      { label: "Otevřít interaktivní mapu", labelEn: "Open Interactive Map", labelDe: "Karte öffnen", href: "mapa.html" },
      { label: "Rejstřík obyvatel", labelEn: "Inhabitant Registry", labelDe: "Einwohnerregister", href: "obyvatele.html" }
    ]
  },
  {
    id: "news_2026_11_22_census_467",
    date: "2026-11-22",
    category: "census",
    badge: "100% přepis 1921",
    badgeEn: "100% 1921 Census",
    badgeDe: "100% Zählung 1921",
    title: "Sloučeny všechny 4 úseky sčítání 1921 (143 archů, všech 467 přítomných obyvatel #1–#467)",
    titleEn: "Merged all 4 slices of the 1921 census (143 house sheets, all 467 present inhabitants #1–#467)",
    titleDe: "Alle 4 Teile der Volkszählung 1921 zusammengeführt (143 Bögen, alle 467 Einwohner #1–#467)",
    summary: "Byly sjednoceny úseky snímků 1–286 včetně doplnění chybějících záznamů z čp. 122, 130, 133 a 156 a jediné popsané rubové strany (sn. 114 čp. 61). Výsledek překonává chybně tištěný součet 462 v Lexikonu 1924.",
    summaryEn: "Unified scans 1–286 including previously omitted entries in No. 122, 130, 133, 156 and back continuation scan 114 (No. 61), achieving 100% match with the 467 original sheets.",
    summaryDe: "Scans 1–286 vollständig vereint inkl. Rückseite Scan 114 (Nr. 61) – 100 % Übereinstimmung aller 467 Originaleinträge.",
    links: [
      { label: "Vyhledat v sčítání 1921", labelEn: "Search 1921 Census", labelDe: "Zählung 1921 durchsuchen", href: "obyvatele.html" },
      { label: "Clustery & vazby", labelEn: "Clusters & Links", labelDe: "Cluster & Beziehungen", href: "cluster.html" }
    ]
  },
  {
    id: "news_2026_11_21_1910_revize",
    date: "2026-11-21",
    category: "analysis",
    badge: "Revize 1910 PO/PZ",
    badgeEn: "1910 PO/PZ Audit",
    badgeDe: "Revision 1910 PO/PZ",
    title: "Rekonstrukce třívrstvé revize sčítání 1910 (531 obyvatel) a Přehledu zvířectva (272 skotu, 127 koz)",
    titleEn: "Reconstructed 3-layer ink revision of 1910 census (531 inhabitants) & Livestock summary",
    titleDe: "Dreischichtige Tinte-Revision 1910 (531 Einw.) & Viehstand (272 Rinder, 127 Ziegen)",
    summary: "Analýza původních sumářů ze sčítání 1910 prokázala posun obcovací řeči ze 491/37 přes 492/36 na finálních 487 německých, 41 českých a 3 cizozemce a detailně zmapovala dobytek podle popisných čísel vč. podčísel 1a–74a.",
    summaryEn: "Analysis of the 1910 summary sheets reveals the shift from 491/37 through 492/36 to the final 487 German / 41 Czech / 3 foreign citizens, plus complete livestock by house.",
    summaryDe: "Analyse der drei Tintenschichten 1910 (491/37 -> 492/36 -> 487 DE / 41 CS / 3 Ausl.) inkl. komplettem Viehbestand.",
    links: [
      { label: "Demografie 1910–1921", labelEn: "Demography 1910–1921", labelDe: "Demografie 1910–1921", href: "demografie.html" }
    ]
  },
  {
    id: "news_2026_11_20_barinka_mza",
    date: "2026-11-20",
    category: "analysis",
    badge: "Trojmezí & F. Bařinka",
    badgeEn: "Tri-Border & WW2 Memory",
    badgeDe: "Dreiländereck & Zeitgeschichte",
    title: "Začleněny soudní pře 16. století (MZA Brno) a biografie Františka Bařinky (1911–1945, čp. 7)",
    titleEn: "Integrated 16th-century border lawsuits (MZA Brno) and biography of František Bařinka (1911–1945)",
    titleDe: "Grenzprozesse des 16. Jh. (MZA Brünn) & Biografie František Bařinka (1911–1945) integriert",
    summary: "Historie obce byla prohloubena o prameny ze zemských desek olomouckých (1511, 1531) a o pečlivě ověřený životopis českopetrovického rodáka z čp. 7, oběti potopení vězeňské lodi SS Thielbek.",
    summaryEn: "Expanded the chronological scope with 1511/1531 Moravian Land Table charters and the verified WWII biography of native František Bařinka (House No. 7).",
    summaryDe: "Erweiterung um Einträge der Landtafel Olmütz (1511, 1531) sowie die dokumentierte Biografie von František Bařinka aus Nr. 7.",
    links: [
      { label: "Příběh obce", labelEn: "Village Story", labelDe: "Ortsgeschichte", href: "pribeh.html" },
      { label: "Katalog pramenů", labelEn: "Source Catalog", labelDe: "Quellenkatalog", href: "reference.html" }
    ]
  }
];
