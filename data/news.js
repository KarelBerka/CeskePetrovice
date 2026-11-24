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
    id: "news_2026_11_24_matrika_2_8336",
    date: "2026-11-24",
    category: "census",
    badge: "Matriky 1591–1624",
    badgeEn: "Registers 1591–1624",
    badgeDe: "Matriken 1591–1624",
    title: "Kompletní přepis nejstarší matriky Bartošovice 2-8336 (1591–1624): 153 ověřených + 37 sporných zápisů a nová záložka Matriky",
    titleEn: "Complete Transcription of the Oldest Parish Register 2-8336 (1591–1624): 153 Verified & 37 Disputed Entries",
    titleDe: "Volltranskription der ältesten Matrik 2-8336 (1591–1624): 153 gesicherte & 37 fragliche Einträge",
    summary: "Byla dokončena T0 mapa všech 5 předfarních matrik (1591–1784, 910 snímků) a kompletně přečten nejstarší svazek sign. 2-8336 (97 snímků). Odhaleno přesné rozlišení p. (Petersdorf) vs. B. (Batzdorf) již od r. 1594/1597, rychtáři, horní i dolní mlynáři (1596–1621), výslovný název 'Behmisch Pettersdorff' (1616–1621) i předbělohorský farář Tobias Egenhoffer přímo v obci.",
    summaryEn: "Completed T0 structural mapping across all 5 pre-1784 registers (910 scans) and full paleographic transcription of Bartošovice sign. 2-8336 (1591–1624: 153 verified + 37 disputed records), establishing the 'p.' vs 'B.' boundary from 1594/1597, mayors, millers (1596–1621), and pastor Tobias Egenhoffer 'zum Behmisch Pettersdorff' (1621–1622).",
    summaryDe: "T0-Strukturkartierung aller 5 älteren Matriken (1591–1784, 910 Scans) abgeschlossen und ältestes Kirchenbuch Sign. 2-8336 (97 Scans) vollständig transkribiert: 153 gesicherte und 37 strittige Einträge inkl. Dorfschulzen, Müllern (1596–1621), 'Behmisch Pettersdorff' (1616–1621) sowie Pfarrer Tobias Egenhoffer (1621–1622).",
    links: [
      { label: "Matriky 1591–1784", labelEn: "Registers 1591–1784", labelDe: "Matriken 1591–1784", href: "obyvatele.html#parish" },
      { label: "Kronika: kap. II.", labelEn: "Chronicle Ch. II", labelDe: "Chronik Kap. II", href: "pribeh.html" },
      { label: "Stáhnout korpus JSON", labelEn: "Download JSON Corpus", labelDe: "JSON-Korpus", href: "reference.html#prace" }
    ]
  },
  {
    id: "news_2026_11_23_audit",
    date: "2026-11-23",
    category: "analysis",
    badge: "Revize pramenů",
    badgeEn: "Source Audit",
    badgeDe: "Quellenrevision",
    title: "Hloubková kontrola pramenů: oprava demografické řady (882 r. 1880), půdy RÚIAN a přímých odkazů ARON/MZK/NPÚ",
    titleEn: "Forensic Source Audit: Corrected Population Peak (882 in 1880), RÚIAN Land Use & Direct Archive Links",
    titleDe: "Tiefenprüfung der Quellen: Korrektur der Zeitreihe (Max. 882 im Jahr 1880), RÚIAN-Flächen & direkte Archivlinks",
    summary: "Provedena křížová kontrola všech údajů proti primárním studiím: sjednocena řada ČSÚ 1654–2026 (max. 882 obyv. r. 1880), doplněna přesná struktura půdy RÚIAN 2026 (629,83 ha), opravena biografie F. Bařinky (*1911 Valašské Klobouky), správní příslušnost k panství Kyšperk, vyvrácena cholera 1866 a opraveny všechny přímé UUID odkazy do ARON, MZK Kramerius a NPÚ.",
    summaryEn: "Cross-checked every portal claim against primary studies: unified the 1654–2026 demographic series (882 peak in 1880), applied exact RÚIAN 2026 land-use breakdown (629.83 ha), corrected František Bařinka's birthplace (*1911 Valašské Klobouky) and Kyšperk estate history, removed unverified 1866 cholera claims, and linked direct verified ARON, MZK and NPÚ URLs.",
    summaryDe: "Alle Portalangaben gegen die Primärstudien geprüft: korrigierte Bevölkerungsreihe 1654–2026 (Max. 882 im Jahr 1880), exakte RÚIAN-Flächenstatistik 2026 (629,83 ha), präzisierte Biografie von F. Bařinka (*1911 Valašské Klobouky) sowie direkte ARON-, MZK- und NPÚ-Permalinks.",
    links: [
      { label: "Demografie 1654–2026", labelEn: "Demography 1654–2026", labelDe: "Demografie 1654–2026", href: "demografie.html" },
      { label: "Katalog pramenů", labelEn: "Source Catalog", labelDe: "Quellenkatalog", href: "reference.html" }
    ]
  },
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
    summary: "Byly sjednoceny úseky snímků 1–286 včetně doplnění chybějících záznamů z čp. 122, 130, 133 a 156 a jediné popsané rubové strany (sn. 114 čp. 61). Přepis 143 archů se 100 % shoduje s tištěným součtem 467 v Lexikonu 1924 (a opravuje OCR zkreslení 142 domů a 10 Čechoslováků).",
    summaryEn: "Unified scans 1–286 including previously omitted entries in No. 122, 130, 133, 156 and back continuation scan 114 (No. 61), achieving 100% match with the 467 total printed in Lexikon 1924 (fixing OCR misreads).",
    summaryDe: "Scans 1–286 vollständig vereint inkl. Rückseite Scan 114 (Nr. 61) – 100 % Übereinstimmung mit den 467 im Ortslexikon 1924 gedruckten Einwohnern.",
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
    title: "Začleněny soudní pře 16. století (MZA Brno) a biografie Františka Bařinky (1911–1945, vazba na čp. 7)",
    titleEn: "Integrated 16th-century border lawsuits (MZA Brno) and biography of František Bařinka (1911–1945)",
    titleDe: "Grenzprozesse des 16. Jh. (MZA Brünn) & Biografie František Bařinka (1911–1945) integriert",
    summary: "Historie obce byla prohloubena o prameny z olomouckých zemských desek (1511, 1531) a o archivně ověřený životopis Františka Bařinky (*1911 Valašské Klobouky, v l. 1938–1939 spojeného s čp. 7), oběti potopení vězeňské lodi Thielbek.",
    summaryEn: "Expanded historical scope with 1511/1531 Moravian Land Table charters and the verified WWII biography of František Bařinka (*1911 Valašské Klobouky, 1938–1939 connection to House No. 7), who died aboard SS Thielbek.",
    summaryDe: "Erweiterung um Einträge der Landtafel Olmütz (1511, 1531) sowie die dokumentierte Biografie von František Bařinka (*1911 Valašské Klobouky, Verbindung zu Nr. 7 1938–1939).",
    links: [
      { label: "Příběh obce", labelEn: "Village Story", labelDe: "Ortsgeschichte", href: "pribeh.html" },
      { label: "Katalog pramenů", labelEn: "Source Catalog", labelDe: "Quellenkatalog", href: "reference.html" }
    ]
  }
];
