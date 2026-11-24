// ==========================================================================
// PŘÍBĚH OBCE ČESKÉ PETROVICE (BÖHMISCH PETERSDORF)
// Kapitoly I.–X., archivní zajímavosti a hloubkové badatelské sondy
// Epistemické zakotvení dle docs/*.md, data/archival_sources.json a Soudni pre/
// ==========================================================================

const storyData = {
  title: "Příběh Českých Petrovic (1511–2026)",
  subtitle: "Hraniční ves na česko-moravsko-kladském pomezí od nejstarších zemských sporů a bartošovických matrik přes éru tkalců a meziválečných menšin až po osudy roku 1945.",
  stats: [
    { label: "První matriční doklad", value: "1594 / 1597", detail: "Bartošovice 2-8336 (153 + 37 zápisů; sporné 1591 Pitzßdorff)" },
    { label: "Kostel & samostatná lokálie", value: "1734 / 1784", detail: "Kostel sv. Petra a Pavla (lokálie 5/1784, fara 1857)" },
    { label: "Maximum obyvatel (1880)", value: "882 obyv.", detail: "1869: 869 • 1880: 882 • 1890: 876 (157 domů)" },
    { label: "Rekordní sběr 1910 (PO/PZ)", value: "531 obyv.", detail: "487 něm., 41 čes., 3 ciz. • 272 skotu" },
    { label: "Plně přepsané sčítání 1921", value: "467 obyv.", detail: "143 archů (čp. 1–160), 392 DE / 70 CS / 5 ciz." },
    { label: "Katastrální výměra & RÚIAN", value: "629,83 ha", detail: "105 stávajících + 55 zaniklých čp. ≤ 160 (1 777 parcel)" }
  ],
  chapters: [
    {
      id: "kap1_trojmezi",
      number: "I.",
      era: "1511–1633",
      category: "Hranice & prameny",
      badge: "Trojmezí Čech, Moravy a Kladska",
      title: "Horské pomezí na mapách 16. století a zemské desky",
      image: "assets/maps/mapa_1561_helwig.jpg",
      imageCaption: "Helwigova mapa Slezska (1561, vyd. Ortelius [1579]) v Mollově sbírce MZK zachycující pomezí Kladska, Čech a Moravy.",
      secondaryImage: "assets/archives/mzd2_1531_silperk_prodej_p346.jpg",
      secondaryImageCaption: "Zemské desky olomoucké II (prodej Šilperka r. 1531, ZDO XXIII fol. 7; ed. MZD II, s. 268 č. 40).",
      summary: "Nejstarší kontext území tvoří vrchnostenské a hraniční spory na pomezí Kladska (Mittelwalde), východních Čech (Králíky) a severní Moravy v 16. století [doc][ed].",
      paragraphs: [
        "Území budoucích Českých Petrovic leží na rozvodní a pohraniční ose mezi Orlickými horami, údolím Divoké Orlice (Zemská brána) a Kladskem (Kamieńczyk / Mittelwalde). Právě poloha na styku Kladského hrabství (Mittelwalde – rod von Tschirnhaus), východočeského králického výběžku (páni ze Žampachu, od r. 1577 Zdeněk z Valdštejna) a severomoravských panství Šilperk, Šumperk, Kolštejn a Ruda nad Moravou vyvolala v 16. století řadu hraničních a poddanských sporů.",
        "Kritické edice Moravských zemských desek olomouckých (MZD II: r. 1511 č. 79 Jan ze Zvole a z Goldštejna; r. 1531 ZDO XXIII fol. 7, ed. s. 268 č. 40 prodej Šilperka) i fondy MZA Brno (A 3 Stavovské rukopisy, B 10 kt. 79 Tschirnhaus, G 154 inv. č. 76 Mittelwalde) dokládají správu a spory v pohraničí [ed][inv]. Kartografický obraz horského sedla pak postupně zpřesnily tisky Martina Helwiga (1561 / [1579]), Pavla Fabricia (1569/1573) a Jana Amose Komenského ([1633]) [doc]."
      ],
      links: [
        { label: "Mapa 1561–1633 v Atlasu", action: "openMapSection" },
        { label: "Studie trojmezí (.md)", action: "openReferencesSection" }
      ]
    },
    {
      id: "kap2_bartosovice_1591",
      number: "II.",
      era: "1591–1705",
      category: "Nejstarší rody",
      badge: "Bartošovice & Lukavice",
      title: "Nejstarší matriční doklady Petersdorfu (1591–1624) a Berní rula 1654",
      image: "assets/archives/matrika_2_8336_1596.jpg",
      imageCaption: "Matrika farnosti Bartošovice v Orlických horách, sign. 2-8336 (1591–1624): 153 ověřených zápisů 'p./P.' (od r. 1594) + 37 sporných vč. r. 1591 'Pitzßdorff'.",
      secondaryImage: "assets/archives/matrika_2_8336_behm_petersdorff.jpg",
      secondaryImageCaption: "Křest dcery faráře Tobie Egenhoffera 'Pfarhern zum Behmisch Pettersdorff' ze dne 12. 4. 1621 za účasti rychtáře v Petrovicích (sign. 2-8336, sn. 89).",
      summary: "Kompletní přepis bartošovické matriky 2-8336 (190 záznamů) a lukavické 83-1 (334 záznamů) přináší celkem 524 předfarních zápisů a posouvá doklad místního kostela i školy do let 1653–1655 [doc][lit].",
      paragraphs: [
        "Nejstarší dochované matriční zápisy pocházejí z bartošovické matriky sign. 2-8336 (1591–1624): kompletní přepis všech 97 snímků přinesl 153 ověřených zápisů [doc] (86 Z, 58 N, 9 O) a 37 sporných (vč. 27 úmrtí 1591–1593 pod hlavičkou 'Pitzßdorff'). Již roku 1594 v pohřbech (sn. 7) a roku 1597 ve křtech (sn. 28 hned před zápisem B. 1. Batzdorf) se spolehlivě odděluje značka p./P. (Petersdorf), později výslovně psaná 'Vom Behmischen Pittersdorff' (1616, 1620) a 'zum Behmisch Pettersdorff' (1621) s předbělohorským ženatým farářem Tobiasem Egenhofferem (1621–1622) [doc].",
        "Navazující lukavická matrika sign. 83-1 (1646–1671, komplet 114 snímků) přidala 334 ověřených česky psaných zápisů ('Zpetrowicz': 216 N od r. 1653, 71 O od r. 1652, 47 Z od r. 1662) a přinesla zásadní objev: již od 5. 4. 1655 (18 sňatků 'w kosteli petrowskym') a 12. 1. 1663 (34 pohřbů 'prži Chramie Pani petrowskim') v obci stál starší chrám — téměř 80 let před dostavbou nynějšího barokního kostela r. 1734! Současně potvrzuje první kantory a rektory (Johannes Preceptor 1653, rektor Matěj/Matis Langer 1657–†1669), rychtáře Adama Wagnera (1655–1668) i výrazné rody Esler (41×), Wagner (31×), Lux (24×), Adler (22×), Langer (21×) a vlnu úmrtí 1669–1671 (37 osob) v době popisované Berní rulou (1654, cca 56–57 usedlíků [lit])."
      ],
      links: [
        { label: "Matriční rejstřík 1591–1784", action: "openParishTab" },
        { label: "Katalog 18 matrik", action: "openGuideTab" }
      ]
    },
    {
      id: "kap3_kostel_lokalie",
      number: "III.",
      era: "1705–1857",
      category: "Sakrální správa",
      badge: "Kostel sv. Petra a Pavla",
      title: "Barokní kostel (1734), samostatná lokálie (5/1784) a Repertorium 23-1",
      image: "assets/archives/matrika_109_1_1734_petersdorf.jpg",
      imageCaption: "Matrika Nekoř sign. 109-1 (1705–1753), kde je petrovický filiální kostel sv. Petra a Pavla uveden již na titulním listu r. 1705 [doc].",
      secondaryImage: "assets/archives/matrika_23_1_repertorium_s35.jpg",
      secondaryImageCaption: "Repertorium křtů a konkordance starých a nových čísel popisných v matrice 23-1 (F. L. Kožischek?, sn. 35).",
      summary: "V letech 1705–1784 byla ves přifařena pod Nekoř; nynější kostel sv. Petra a Pavla dostavěli obyvatelé r. 1734 a od května 1784 vznikla samostatná lokálie [doc][ed].",
      paragraphs: [
        "Od října 1705 do dubna 1784 patřily České Petrovice pod farnost Nekoř (sign. 109-1 až 109-15); již titulní list matriky 109-1 z roku 1705 výslovně uvádí filiální chrám ‚Sanctorum Aplorum Petri, & Pauli Petersdorffii‘ [doc]. Nynější barokní kostel sv. Petra a Pavla (ÚSKP rejstř. č. 34598/6-4044, kat. č. 1000146326_0001) byl podle Sommerovy topografie (1836) vystavěn místními obyvateli roku 1734 [ed]. Vlastní křestní matrika sign. 23-1 se vedla již od roku 1770.",
        "V rámci josefínských reforem byla v květnu 1784 zřízena samostatná lokálie České Petrovice pod patronátem velkostatku Kyšperk (povýšená roku 1857 na samostatnou farnost). Zdejší duchovní správce P. Franz Leo Kožischek(?) doplnil v matrice 23-1 klíčové abecední Repertorium převádějící stará domovní čísla na nová po přečíslování 1805/1806, které na sn. 28 matriky zemřelých 23-5 přesně datoval lokalista P. Joseph Ullrich [doc]."
      ],
      links: [
        { label: "Kostel na mapě (st. p. 57)", action: "openHouse_kostel_sv_petra_a_pavla" },
        { label: "Profily duchovních", action: "openPeopleSection" }
      ]
    },
    {
      id: "kap4_precislovani_1805",
      number: "IV.",
      era: "1805–2026",
      category: "Domovní čísla & Katastr",
      badge: "Konkordance čp. & Katastr",
      title: "Přečíslování domů (1805/1806) a půdní fond k. ú. 622702 (629,83 ha)",
      image: "assets/archives/matrika_23_5_1806_umrti.jpg",
      imageCaption: "Matrika zemřelých sign. 23-5 (sn. 28, r. 1806) – explicitní poznámka lokalisty Josepha Ullricha o přechodu ze staré na novou konskripci.",
      secondaryImage: "assets/archives/matrika_23_1_1771_cp.jpg",
      secondaryImageCaption: "Matrika sign. 23-1 (1771) – zavedení nejstarších popisných čísel v údolí Petrovic.",
      summary: "Pozdně osvícenské přečíslování 1805/1806 změnilo adresy většiny stavení; dnešní katastr 622702 v RÚIAN 2026 zahrnuje 629,83 ha a 1 777 parcel [doc][inv].",
      paragraphs: [
        "Kritické srovnání matriky 23-1 (1771–1784) a úmrtní knihy 23-5 (sn. 28, r. 1806) dokazuje, že zatímco jádrový statek čp. 1 (Schroller/Umlauf) si číslo ponechal, desítky domů ve středu a východní části změnily číslo — například staré čp. 25 přešlo na nové čp. 40 [doc]. Bez této konkordance by badatelé zaměnili odlišné usedlosti.",
        "Podle přesných vektorových dat ČÚZK RÚIAN 2026 zaujímá k. ú. České Petrovice (622702) rozlohu 629,83 ha v 1 777 parcelách [inv] (v letech 1921 a 1949 činila úřední výměra 627 ha; barevné císařské otisky Stabilního katastru z r. 1840 v ÚAZK čekají na badatelské stažení). Dnešní půdní skladbě vévodí trvalé travní porosty (237,48 ha, 37,71 %), lesy (175,87 ha, 27,92 %) a orná půda (154,69 ha, 24,56 %)."
      ],
      links: [
        { label: "Konkordance čp. 1–160", action: "openMapSection" },
        { label: "Graf struktury půdy RÚIAN", action: "openDemographySection" }
      ]
    },
    {
      id: "kap5_tkalci_1869_1900",
      number: "V.",
      era: "1836–1900",
      category: "Hospodářský rozkvět",
      badge: "Sčítání 1869–1900",
      title: "Éra domáckých tkalců a demografický vrchol (882 obyvatel v r. 1880)",
      image: "assets/archives/scitani_1869_cp152_mlyn.jpg",
      imageCaption: "Sčítání lidu 1869 – čp. 152 (mlýn Alexander Lux, sn. 342): prázdný v okamžiku sčítání.",
      secondaryImage: "assets/archives/scitani_1869_cp27_skola.jpg",
      secondaryImageCaption: "Obecná škola čp. 27 ve sčítání 1869 (sn. 75–76) – učitel Andreas Faltus a česká chovanka Marie Chaloupková.",
      summary: "V 2. polovině 19. století dosáhly České Petrovice vrcholu zalidnění (882 osob r. 1880); téměř každá chalupa žila domáckým tkalcovstvím [doc][ed].",
      paragraphs: [
        "Od Sommerova stavu 153 domů a 842 obyvatel (1836) stoupalo zalidnění přes 869 obyvatel (1869) až k historickému maximu 882 obyvatel roku 1880 a 876 obyvatel ve 157 domech roku 1890 [ed]. Výběrová sonda do operátu 1869 (17 domů vč. čp. 1, 7, 25 fary, 27 školy a 152 mlýna) odhaluje výraznou převahu povolání Lohnweber (námezdní tkadlec) [doc].",
        "Na přelomu století však nastal v důsledku krize ručního tkalcovství a odchodu mladých sil za prací do vnitrozemí či Pruska prudký úbytek: roku 1900 měla obec 657 obyvatel v 151 domech (-219 osob za desetiletí), roku 1910 už jen 531 přítomných [doc][ed]."
      ],
      links: [
        { label: "Dlouhodobý graf 1654–2026", action: "openDemographySection" }
      ]
    },
    {
      id: "kap6_revize_1910",
      number: "VI.",
      era: "1910",
      category: "Jazyková politika",
      badge: "3 vrstvy inkoustu 1910",
      title: "Sčítání lidu 1910 (PO/PZ): třívrstvá korekce jazyka a hospodářská zvířata",
      image: "assets/archives/scitani_1910_po_s10.jpg",
      imageCaption: "Sumární arch PO 1910 (snímek 10, čp. 142–160 a součty) se zřetelným přepisem jazykových rubrik černým a fialovým inkoustem.",
      secondaryImage: "assets/archives/scitani_1910_pz_s02.jpg",
      secondaryImageCaption: "Přehled zvířectva 1910 (PZ, sn. 2) – podrobná evidence skotu (272 ks), koz (127), prasat (167 úř. / 170 skut.) a drůbeže (797 úř. / 803 skut.).",
      summary: "Kompletní přepis archů PO/PZ 1910 odhalil 531 přítomných obyvatel, 92 nepřítomných a 3 barevné revizní vrstvy obcovací řeči [doc].",
      paragraphs: [
        "Zvláštností dochovaného sumáře Přehledu obyvatelstva z 31. 12. 1910 jsou dochované tři vrstvy revizního zápisu obcovací řeči (Umgangssprache): původní náčrt vykazoval 491 německé a 37 české řeči, mezikorekce 492 DE / 36 CS a finální inkoustová revize stvrdila poměr 487 německé, 41 české a 3 cizozemci (celkem 531 přítomných + 92 nepřítomných) [doc].",
        "Vedle demografie podává Přehled zvířectva (PZ, vč. podčísel 1a–74a) přesný obraz horského samozásobitelského hospodářství: chovalo se zde 272 kusů skotu (z toho 153 krav), 25 koní pro potah a polní práce, 127 koz (‚kráva chudých‘ v tkalcovských chalupách), 167 úředně vykázaných (skutečně sečteno 170) prasat a 797 úředně vykázaných (skutečně 803) kusů drůbeže [doc]."
      ],
      links: [
        { label: "Analýza 3 vrstev 1910", action: "openDemographySection" },
        { label: "Přehled dobytka podle čp.", action: "openMapSection" }
      ]
    },
    {
      id: "kap7_tisk_turistika",
      number: "VII.",
      era: "1898–1937",
      category: "Tisk & Turistika",
      badge: "MUDr. Moravec & Kašparova chata",
      title: "Horský spolek, pašeráci, MUDr. Moravec (85 let) a Kašparova chata na Adamu",
      image: "assets/archives/tisk_1935_nase_mensiny_moravec_p114.jpg",
      imageCaption: "Rozhovor k 85. narozeninám českopetrovického rodáka MUDr. Josefa Moravce (*15. 8. 1850) v Našich menšinách (červenec 1935, s. 114).",
      secondaryImage: "assets/archives/tisk_1936_turisticky_hradecek_kasparova_chata.jpg",
      secondaryImageCaption: "Turistický Hrádeček (červen 1936) – otevření Kašparovy chaty KČST na Adamově vrchu.",
      summary: "Turistický průvodce z r. 1898 uvádí spolek B. D. O. a tři hostince; v červenci 1935 vzpomínal 85letý rodák MUDr. Josef Moravec a 21. 6. 1936 byla na Adamu otevřena Kašparova chata KČST [ed].",
      paragraphs: [
        "Německý průvodce Führer durch das Adler-Gebirge (1898, s. 21) popisuje ‚B.-Petersdorf‘ (876 obyv., 632 m n. m.) se sekcí horského spolku B. D. O. (předseda kameník Josef Pischel) a třemi hostinci: Josef Kroboth, J. Henseli (čp. 67) a K. Kalous (předchůdce u čp. 160), odkud cesta pokračovala ke kladskému Steinscholze [ed]. Dobové Národní listy (1890–1905) zároveň zachycují pašerácké přepady a srážky finanční stráže na hranici. Vzpomínkový rozhovor k 85. narozeninám slavného místního rodáka, lékaře a zemského poslance MUDr. Josefa Moravce (*15. 8. 1850) v Našich menšinách (1935) osvětluje česko-německou školu za učitele Ondřeje Faltuse [ed].",
        "Ve 30. letech se hřeben nad obcí stal významným turistickým i obranným cílem. Dne 21. června 1936 byla na svahu vrchu Adam (762 m n. m.) otevřena klubová Kašparova chata hradeckého odboru KČST (nákladem 91 211,20 Kč), zatímco od srpna 1936 v bezprostředním sousedství vyrůstala dělostřelecká tvrz Adam [ed][lit]."
      ],
      links: [
        { label: "Profil MUDr. J. Moravce", action: "openPeopleSection" },
        { label: "Dobový tisk v Referencích", action: "openReferencesSection" }
      ]
    },
    {
      id: "kap8_scitani_1921",
      number: "VIII.",
      era: "1921–1938",
      category: "První republika",
      badge: "143 archů & Menšinová škola",
      title: "První republika, pohraniční stráž a česká menšina (sčítání 1921)",
      image: "assets/archives/scitani_1921_cp160_straz.jpg",
      imageCaption: "Sčítací arch čp. 160 z 15. 2. 1921 (sn. 285): vrchní strážmistr František Šlesinger, tři podřízení strážci, Marie Pavlová a učitel Josef Gruber.",
      secondaryImage: "assets/archives/tisk_1923_nase_mensiny_p84.jpg",
      secondaryImageCaption: "Naše menšiny (30. 5. 1923, s. 84) – reportáž o přeložení strážmistra Šlesingra a sporu o českou menšinovou školu.",
      summary: "V únoru 1921 napočítal učitel a komisař Josef Gruber na 143 arších 467 obyvatel (392 DE, 70 CS, 5 ciz.), z nichž 6 Čechů bydlelo společně v čp. 160 [doc].",
      paragraphs: [
        "První československé sčítání lidu z 15. února 1921 (plně přepsaných všech 286 snímků / 143 archů pro čp. 1–160) zachycuje 467 přítomných obyvatel ve 130 obydlených a 13 neobydlených domech [doc]. Národnostní složení tvořilo 392 osob německé (83,9 %), 70 osob československé (15,0 %) a 5 osob cizí státní příslušnosti (Lexikon 1924 potvrzuje úhrn 467 obyvatel: 70 čs., 391 něm., 1 jiná, 5 ciz.) [doc][ed].",
        "Významným ohniskem nové státní správy se stal dům čp. 160 (u Kalousových): vedle majitelky Emilie Kalousové zde bydleli 4 příslušníci Pohraniční finanční stráže v čele s vrchním strážmistrem Františkem Šlesingerem (legionářem od Bachmače), Marie Pavlová a učitel I. třídy Josef Gruber, jenž celé petrovické sčítání v terénu zapsal. Tisk Naše menšiny (30. 5. 1923) i civilní matriky OÚ Žamberk (sign. 6376, 8272) zachycují každodenní život i spory pohraniční obce [doc][ed]."
      ],
      links: [
        { label: "Rejstřík všech 467 obyvatel", action: "openPeopleSection" },
        { label: "Laboratoř clusterů", action: "openClusterLink" }
      ]
    },
    {
      id: "kap9_barinka_1938_1945",
      number: "IX.",
      era: "1938–1945",
      category: "Okupace & Odboj",
      badge: "Mnichov & Osud Františka Bařinky",
      title: "Zábor pohraničí (1938) a osud Františka Bařinky († 3. 5. 1945 na lodi Thielbek)",
      image: "assets/maps/mapa_1938_pomezi_detail.jpg",
      imageCaption: "Výřez z vojenské speciální mapy Žamberk (reambulace VZÚ 1938) s průběhem hranice a opevněného pásma u Českých Petrovic.",
      secondaryImage: "assets/archives/scitani_1921_cp7_koth.jpg",
      secondaryImageCaption: "Sčítací arch čp. 7 (1921, sn. 13) – usedlost Josefa a Emilie Kothových, k níž se v l. 1938–1939 vázal osud F. Bařinky.",
      summary: "V říjnu 1938 připadly České Petrovice k Německé říši; s čp. 7 byl v l. 1938–1939 spjat osud Františka Bařinky (*1911 Valašské Klobouky – †3. 5. 1945 loď Thielbek) [doc].",
      paragraphs: [
        "Po Mnichovské dohodě v říjnu 1938 byla obec připojena k Německé říši (Landkreis Grulich / Reichsgau Sudetenland) a čerstvě budovaná dělostřelecká tvrz Adam na jižním hřebeni padla bez boje do rukou wehrmachtu [ed][lit]. České pohraniční obyvatelstvo a státní zaměstnanci obec opustili.",
        "Hlubokým lidským dokladem válečné tragédie je archivně ověřený osud Františka Bařinky (*5. 1. 1911 ve Valašských Kloboukách čp. 476), obchodního příručího a vojína v záloze pěšího pluku 5 (SOkA Zlín, inv. č. 63) [doc]. Po pobytu u staveb opevnění (trasa Vrchlabí → Mladkov 10/1936, Dobrošov → Zlín 10/1937 [doc][lit]) žil a pracoval v letech 1938–1939 v Českých Petrovicích, kde měl vztah s Marthou Kothovou z čp. 7. Později při práci u firmy MIAG v Braunschweigu byl 25. 3. 1940 zatčen gestapem za protinacistické výroky (Heimtückegesetz), prošel koncentračními tábory Dachau (č. 21743) a Neuengamme (č. 4230) a 3. května 1945 zahynul při náletu na vězeňskou loď Thielbek v Lübecké zátoce (dosvědčeno třemi spoluvězni v soudním spisu M 2/45). Je pohřben v dánském Sandby na ostrově Lolland; r. 1946 obdržel Československý válečný kříž 1939 in memoriam [doc][ed]."
      ],
      links: [
        { label: "Profil Františka Bařinky", action: "openPeopleSection" },
        { label: "Dům čp. 7 na mapě", action: "openHouse_cp7" }
      ]
    },
    {
      id: "kap10_dosidleni_2026",
      number: "X.",
      era: "1945–2026",
      category: "Poválečný vývoj",
      badge: "Dosídlení & Současnost",
      title: "Poválečné dosídlení, zánik třetiny chalup a horské středisko Orlických hor",
      image: "assets/archives/tisk_1946_sokol_zpravy_p4.jpg",
      imageCaption: "Sokolské zprávy (4. 5. 1946, s. 4) – založení 104. jednoty Sokola dne 31. 3. 1946 na návrh předsedy správní komise J. Voksy, J. Kadiče a V. Flanderky.",
      secondaryImage: "assets/maps/mapa_2026_katastr_celek.jpg",
      secondaryImageCaption: "Katastrální celek k.ú. 622702 České Petrovice v r. 2026 se srovnáním původní osídlené osy a moderní rekreace.",
      summary: "Po odsunu klesl počet obyvatel ze 443 (1930) na 196 (1949) a 179 (1950); dnes má obec 157 stálých obyvatel (2026) a na mapě uchovává paměť 170 objektů [ed][inv].",
      paragraphs: [
        "Po květnu 1945 a následném vysídlení německého obyvatelstva klesl počet stálých obyvatel ze 443 osob (1930) na 196 v roce 1949 a 179 při sčítání roku 1950 (poválečné maximum 208 obyv. v r. 1961; moderní minimum 145 v r. 2011; k 1. 1. 2026 pak 157 obyvatel) [ed]. Nově příchozí osídlenci spolu se starousedlíkem Josefem Voksou z čp. 145 založili 31. 3. 1946 sokolskou jednotu [ed].",
        "Demografická proměna 2. poloviny 20. století se zřetelně otiskla do domovního fondu: z historické řady čp. 1–160 dnes v RÚIAN fyzicky stojí 105 stavení, zatímco 55 domů (zejména v okrajových a hřebenových polohách) zaniklo [inv]. Doplněna o 3 novější čp. (161–163), 6 rekreačních objektů č. ev. a kostel sv. Petra a Pavla tak mapa webu dokumentuje plných 170 objektů."
      ],
      links: [
        { label: "Interaktivní mapa 170 objektů", action: "openMapSection" },
        { label: "Ortofoto 1953–2022 na mapě", action: "openMapSection" }
      ]
    }
  ],
  funFacts: [
    {
      id: "fact_1591_2_8336",
      icon: "📜",
      tag: "Matrika 2-8336 (1591–1624)",
      title: "Předbělohorský farář v Petrovicích a rozlišení p. vs. B. již od r. 1594/1597",
      text: "Kompletní přepis všech 97 snímků bartošovické matriky 2-8336 přinesl 153 ověřených a 37 sporných petrovických zápisů: od r. 1594 (Z) a 1597 (N, hned před B. 1. Batzdorf) jsou důsledně odlišovány České Petrovice ('p./P.') i výslovným 'Vom Behmischen Pittersdorff' (1616, 1620), a v letech 1621–1622 zde působil ženatý farář Tobias Egenhoffer ('Pfarher zum Behmisch Pettersdorff').",
      action: "openParishTab",
      actionLabel: "Otevřít matriční rejstřík"
    },
    {
      id: "fact_1655_83_1_kostel",
      icon: "⛪",
      tag: "Matrika 83-1 (1646–1671)",
      title: "Kostel i rektor v Petrovicích doloženi již 79 let před stavbou r. 1734",
      text: "Lukavická matrika 83-1 (334 vytěžených zápisů 'Zpetrowicz') odhalila 18 sňatků 'w kosteli petrowskym' již od 5. 4. 1655 (vč. 5 párů najednou v lednu 1658) a 34 pohřbů 'prži Chramie Pani petrowskim' od 12. 1. 1663, jakož i kantory a rektory (Johannes Preceptor 1653, Matěj/Matis Langer 1657–†4. 4. 1669).",
      action: "openParishTab",
      actionLabel: "Prohlédnout zápisy 83-1"
    },
    {
      id: "fact_1805_renum",
      icon: "🔢",
      tag: "Přečíslování 1805/1806",
      title: "Matriční dvojčíslí v úmrtní knize 23-5 odhaluje záměnu adres",
      text: "V matrice zemřelých sign. 23-5 (sn. 28, r. 1806) lokalista Joseph Ullrich výslovně poznamenal přechod ze starých na nová čísla popisná (např. staré čp. 25 přešlo na nové čp. 40), čímž umožnil zpětně rozlišit rodiny před rokem 1805.",
      action: "openHouse_cp40",
      actionLabel: "Otevřít čp. 40"
    },
    {
      id: "fact_1910_ink",
      icon: "🖋️",
      tag: "3 vrstvy inkoustu 1910",
      title: "Jak úřední tužka a fialový inkoust změnily jazykovou statistiku r. 1910",
      text: "Na součtovém listu PO z r. 1910 lze pod lupou vyčíst tři po sobě jdoucí korekce: původní náčrt 491 DE / 37 CS byl přepsán na 492 / 36 a definitivně korigován na 487 německých, 41 českých a 3 cizince.",
      action: "openDemographySection",
      actionLabel: "Graf revize 1910"
    },
    {
      id: "fact_1910_kozy",
      icon: "🐐",
      tag: "Hospodářství 1910",
      title: "127 koz v chalupách tkalců oproti 25 koňům na statcích",
      text: "Přehled zvířectva z 31. 12. 1910 dokládá ostrý sociální rozdíl: zatímco koně (25 ks) chovaly velké grunty, v chalupách drobných tkalců se soustředilo 127 koz (‚kráva chudých‘), 167 úředně vykázaných (skutečně 170) prasat a 797 úř. / 803 skut. kusů drůbeže.",
      action: "openDemographySection",
      actionLabel: "Ekonomika 1910"
    },
    {
      id: "fact_1924_ocr",
      icon: "📖",
      tag: "Opravená chyba OCR Lexikonu",
      title: "Přímý archivní součet 1921 (467 osob) ladí s Lexikonem 1924 a opravuje OCR",
      text: "Statistický lexikon obcí 1924 (s. 92) správně tiskne 467 obyvatel ve 143 domech (70 čs., 391 něm., 1 jiná, 5 ciz.), avšak automatické OCR v digitální knihovně jej zkreslilo na 142 domů a 10 Čechoslováků. Kompletní přepis 143 archů (392 DE / 70 CS / 5 ciz.) tento údaj do osoby potvrzuje.",
      action: "openPeopleSection",
      actionLabel: "Prohlédnout rejstřík"
    },
    {
      id: "fact_cp160_gruber",
      icon: "🏫",
      tag: "Čp. 160 & Finanční stráž",
      title: "Jeden dům, 6 Čechů, 4 finanční strážníci i český sčítací komisař (1921)",
      text: "V domě čp. 160 bydlelo r. 1921 vedle majitelky Emilie Kalousové 6 Čechů: 4 příslušníci Pohraniční finanční stráže v čele s vrchním strážmistrem Františkem Šlesingerem, manželka Marie Pavlová a učitel I. tř. Josef Gruber z Luže, který současně sčítal celou vesnici.",
      action: "openHouse_cp160",
      actionLabel: "Detail čp. 160"
    },
    {
      id: "fact_1921_rub",
      icon: "👶",
      tag: "Novorozeně na rubu archu 61",
      title: "Jediná popsaná rubová strana v úseku 73–144 (čp. 61, Marie Elsnerová)",
      text: "Celý archivní blok 72 snímků sčítání 1921 má prázdné rubové strany s jedinou výjimkou snímku 114 u čp. 61, kde musela být na řádek 9 připsána novorozená Marie Elsnerová (*11. 2. 1921, pouhé 4 dny před sčítáním!).",
      action: "openHouse_cp61",
      actionLabel: "Otevřít čp. 61"
    },
    {
      id: "fact_barinka_sandby",
      icon: "⚓",
      tag: "Lübecká zátoka 1945",
      title: "František Bařinka (*1911 Valašské Klobouky, vazba k čp. 7) pohřben v Dánsku",
      text: "Po zatčení v Braunschweigu a věznění v Dachau a Neuengamme zahynul F. Bařinka 3. 5. 1945 na lodi Thielbek. Moře vyplavilo těla k ostrovu Lolland v Dánsku, kde je společně pohřben na hřbitově v Sandby.",
      action: "openHouse_cp7",
      actionLabel: "Otevřít čp. 7"
    },
    {
      id: "fact_homonyma_7",
      icon: "⚠️",
      tag: "Pojistka proti homonymům",
      title: "Pozor na 7 různých Petrovic! Není Petrovice jako Petrovice",
      text: "V archivech se neustále pletou České Petrovice (okr. Ústí n. O., dříve Žamberk/Králíky) se sousedními Petrovičkami (Německé Petrovice u Mladkova), Vernéřovicemi, Petrovicemi u Dolní Čermné či Petříkovicemi u Trutnova.",
      action: "openGuideTab",
      actionLabel: "Tabulka homonym"
    }
  ],
  deepDives: [
    {
      id: "probe_trojmezi",
      title: "Trojmezí Čech, Moravy a Kladska v 16. století (MZA Brno)",
      era: "1511–1633",
      summary: "Proč o lese a hranicích rozhodovaly olomoucké Zemské desky, Mittelwalde (Tschirnhaus), Králíky, Šilperk (Žalkovský), Kolštejn a kartografové Helwig, Fabricius a Komenský.",
      href: "Soudni pre/README_Soudni_pre_o_hranice_16_stoleti_MZA.md"
    },
    {
      id: "probe_demografie_1910_1921",
      title: "Demografická mikroskopie přelomu říší: 1910 PO/PZ vs. 1921",
      era: "1910–1921",
      summary: "Detailní rozbor úbytku 64 obyvatel mezi roky 1910 a 1921, třívrstvé revize jazyka r. 1910 a nárůstu české menšiny z 7,7 % na 15,0 %.",
      href: "docs/demografie_a_scitani_1654_2026.md"
    },
    {
      id: "probe_barinka",
      title: "Životní dráha Františka Bařinky (1911–1945) a vazba na čp. 7",
      era: "1911–1945",
      summary: "Z Valašských Klobouk přes Prahu a stavby čs. opevnění (Adam, Dobrošov) do Českých Petrovic a přes Braunschweig po vězeňská čísla Dachau 21743 a Neuengamme 4230.",
      href: "obyvatele.html#person=p_frantisek_barinka_1911"
    }
  ]
};
