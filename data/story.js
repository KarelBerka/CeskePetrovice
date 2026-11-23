// ==========================================================================
// PŘÍBĚH OBCE ČESKÉ PETROVICE (BÖHMISCH PETERSDORF)
// Kapitoly I.–X., archivní zajímavosti a hloubkové badatelské sondy
// Epistemické zakotvení dle docs/*.md, data/archival_sources.json a Soudni pre/
// ==========================================================================

const storyData = {
  title: "Příběh Českých Petrovic (1511–2026)",
  subtitle: "Hraniční ves na česko-moravsko-kladském pomezí od nejstarších zemských sporů a bartošovických matrik přes éru tkalců a meziválečných menšin až po osudy roku 1945.",
  stats: [
    { label: "První matriční doklad", value: "1591", detail: "Bartošovice 2-8336 s04 (Petersdorf)" },
    { label: "Samostatná lokálie & farnost", value: "1734 / 1785", detail: "Kostel sv. Petra a Pavla & P. Kožíšek" },
    { label: "Maximum obyvatel (1890/1900)", value: "666 / 616", detail: "Historický demografický vrchol obce" },
    { label: "Rekordní sběr 1910 (PO/PZ)", value: "531 obyv.", detail: "487 něm., 41 čes., 3 ciz. · 272 skotu" },
    { label: "Plně přepsané sčítání 1921", value: "467 obyv.", detail: "143 archů (čp. 1–160), 392 DE / 70 CS / 5 ciz." },
    { label: "Katastrální výměra & RÚIAN", value: "629,83 ha", detail: "105 stávajících + 55 zaniklých čp. ≤ 160" }
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
      imageCaption: "Helwigova mapa Slezska (1561) v Mollově sbírce MZK zachycující pomezí Kladska, Čech a Moravy.",
      secondaryImage: "assets/archives/mzd2_1531_silperk_prodej_p346.jpg",
      secondaryImageCaption: "Zemské desky olomoucké II (1531, fol. 346) – majetková převodní listina z příhraničního regionu.",
      summary: "Nejstarší kontext území tvoří královské a vrchnostenské spory na trojmezí Čech, Moravy a Kladského hrabství v 16. století [doc].",
      paragraphs: [
        "Území budoucích Českých Petrovic leží na strategické rozvodní a pohraniční ose mezi Orlickými horami, údolím Divoké Orlice (Zemská brána) a Kladskem (Kamieńczyk / Mittelwalde). Právě poloha na styku tří historických zemí vyvolala v 16. století řadu vleklých hraničních a poddanských pří mezi držiteli panství Žamberk, Kolštejn (Branná), Šilperk a Zábřeh.",
        "Sondy do Moravských zemských desek olomouckých (MZD II, r. 1511 fol. 251 a r. 1531 fol. 346) a archivních fondů MZA Brno (A 3, F 186) dokládají přesnou správu horských lesních tratí a rybničních soustav v předbělohorském období [doc]. Kartografický obraz horského sedla pak postupně zpřesnily tisky Martina Helwiga (1561), Johanna Crigingerova okruhu, Pavla Fabricia (1569/1573) a Jana Amose Komenského (1633)."
      ],
      links: [
        { label: "Mapa 1561–1633 v Atlasu", action: "openMapSection" },
        { label: "Studie trojmezí (.md)", action: "openReferencesSection" }
      ]
    },
    {
      id: "kap2_bartosovice_1591",
      number: "II.",
      era: "1591–1718",
      category: "Nejstarší rody",
      badge: "Bartošovice & Lukavice",
      title: "Nejstarší matriční doklad Petersdorfu (1591) a berní rula 1654",
      image: "assets/archives/matrika_2_8336_1591_s04.jpg",
      imageCaption: "Matrika farnosti Bartošovice v Orlických horách, sign. 2-8336 (snímek 4, rok 1591) – nejstarší doložený zápis vsi Petersdorf.",
      secondaryImage: "assets/archives/matrika_2_8336_1601.jpg",
      secondaryImageCaption: "Křestní a oddací záznamy vsi Petersdorf na přelomu 16. a 17. století (sign. 2-8336).",
      summary: "Od roku 1591 jsou obyvatelé Petersdorfu zachyceni v matrice Bartošovic a po třicetileté válce v Berní rule (1654) [doc].",
      paragraphs: [
        "První přímý matriční zápis lokality Petersdorf pochází z bartošovické matriky sign. 2-8336 (sn. 4, 1591) [doc]. V tomto období ještě obec neměla vlastní kostel a duchovní správu sdílela s okolními horskými farnostmi na panství Žamberk (Bartošovice 1591–1647, následně Lukavice sign. 83-1 a 83-2 v letech 1659–1718).",
        "Daňové prameny po třicetileté válce (Berní rula 1654, Tereziánský katastr 1713–1757 a Josefský katastr 1785) umožňují kvantifikovat usedlé hospodáře. Z původní sítě selských gruntů a chalup postupně vykrystalizovaly dlouhověké místní rody jako Schroller, Umlauf, Exner, Pácha, Lux, Langer, Šmok či Scholz."
      ],
      links: [
        { label: "Katalog 18 matrik", action: "openGuideTab" }
      ]
    },
    {
      id: "kap3_kostel_lokalie",
      number: "III.",
      era: "1732–1785",
      category: "Sakrální správa",
      badge: "Kostel sv. Petra a Pavla",
      title: "Barokní kostel (1734), samostatná lokálie (1785) a Kožíškovo Repertorium",
      image: "assets/archives/matrika_109_1_1734_petersdorf.jpg",
      imageCaption: "Matrika Nekoř sign. 109-1 (1734) – záznam 'in Novo Exstructo Sacello Petersdorf'.",
      secondaryImage: "assets/archives/matrika_23_1_repertorium_s35.jpg",
      secondaryImageCaption: "P. Josef Kožíšek: Repertorium křtů a konkordance starých a nových čísel popisných (sign. 23-1, sn. 35).",
      summary: "Mezi lety 1732–1734 vyrostl v jádru vsi barokní kostel sv. Petra a Pavla; od roku 1785 obec vedla vlastní matriky [doc].",
      paragraphs: [
        "Po přechodném přifaření pod Nekoř (1674–1785, sign. 109-1 až 109-15) vyrostla přímo v centru Českých Petrovic barokní svatyně sv. Petra a Pavla (ÚSKP 1000146326_0001), poprvé výslovně zmíněná v matrice Nekoř 109-1 roku 1734 jako nově postavená kaple [doc].",
        "V rámci josefínských reforem byla v roce 1785 zřízena samostatná lokálie České Petrovice a prvním lokalistou se stal P. Josef Kožischek (Kožíšek). Ten nejen zavedl řadu vlastních matrik (sign. 23-1 až 23-5), ale po přečíslování domů kolem let 1805–1806 sestavil cenné Repertorium (sign. 23-1, sn. 35+), které převádí předchozí stará domovní čísla na novou číslovací řadu [doc]."
      ],
      links: [
        { label: "Kostel na mapě (st. p. 57)", action: "openHouse_kostel_sv_petra_a_pavla" },
        { label: "Profil P. J. Kožíška", action: "openPeopleSection" }
      ]
    },
    {
      id: "kap4_precislovani_1805",
      number: "IV.",
      era: "1805–1840",
      category: "Domovní čísla & Katastr",
      badge: "Konkordance čp. & Stabilní katastr",
      title: "Přečíslování domů (1805/1806) a Stabilní katastr (1840)",
      image: "assets/archives/matrika_23_5_1806_umrti.jpg",
      imageCaption: "Matrika zemřelých sign. 23-5 (sn. 28, r. 1806) – souběh zápisu starého a nového čísla popisného.",
      secondaryImage: "assets/archives/matrika_23_1_1771_cp.jpg",
      secondaryImageCaption: "Matrika sign. 23-1 (1771) – zavedení nejstarších popisných čísel v údolí Petrovic.",
      summary: "Pozdně osvícenské přečíslování 1805/1806 změnilo čísla většiny usedlostí; v r. 1840 stabilní katastr zaměřil 629,83 ha a 1 777 parcel [doc].",
      paragraphs: [
        "Kritické srovnání matriky 23-1 (1771–1784) a úmrtní knihy 23-5 (sn. 28, 1806) dokazuje, že zatímco jádrové grunty u západního konce (čp. 1 Schroller/Umlauf) si číslo ponechaly, desítky domů ve středu a východní části změnily číslo — například staré čp. 25 přešlo na nové čp. 40 [doc]. Bez této konkordance by genealogové zaměnili rozdílné usedlosti.",
        "Roku 1840 vznikl Stabilní katastr k. ú. České Petrovice (622702) o výměře 629,83 ha rozdělené do 1 777 pozemkových a stavebních parcel [doc]. Půdní bilanci tehdy tvořila převážně orná půda (266,01 ha, 42,2 %), lesy (202,42 ha, 32,1 %) a horské louky s pastvinami (135,14 ha, 21,5 %). Tato základní sídelní a pozemková kostra přetrvala až do současnosti."
      ],
      links: [
        { label: "Konkordance čp. 1–160", action: "openMapSection" },
        { label: "Graf výměry 629,83 ha", action: "openDemographySection" }
      ]
    },
    {
      id: "kap5_tkalci_1869_1900",
      number: "V.",
      era: "1848–1900",
      category: "Hospodářský rozkvět",
      badge: "Sčítání 1869–1900",
      title: "Éra domáckých tkalců, dřevařů a demografický vrchol (666 obyvatel)",
      image: "assets/archives/scitani_1869_cp152_mlyn.jpg",
      imageCaption: "Sčítání lidu 1869 – čp. 152 (Scholzův mlýn, sn. 342): prázdný po úmrtí či stěhování před sčítacím termínem.",
      secondaryImage: "assets/archives/scitani_1869_cp27_skola.jpg",
      secondaryImageCaption: "Obecná škola čp. 27 ve sčítání 1869 (sn. 75–76) – první moderní školský soupis obce.",
      summary: "V 2. polovině 19. století dosáhly České Petrovice vrcholu zalidnění (666 osob r. 1890); téměř každá chalupa žila domáckým tkalcovstvím [doc].",
      paragraphs: [
        "Zrušením poddanství (1848) a rozvojem přilehlých textilních továren na kladském (Mezilesí / Mittelwalde) i českém pomezí se horská zemědělská ves proměnila v rušnou tkalcovskou obec. Výběrová sonda do operátu 1869 (17 domů vč. čp. 1, 7, 25 fary, 27 školy a 152 mlýna) odhaluje převahu povolání Lohnweber (námezdní tkadlec) [doc].",
        "Současně s vysokou natalitou kulminoval počet obyvatel mezi lety 1880 (648 obyv.), 1890 (historické maximum 666 obyv. v 147 domech) a 1900 (616 obyv.). Následný pokles souvisel s krizí ručního tkalcovství a odchodem mladých sil za prací do Pruska, Vídně a českého vnitrozemí."
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
      secondaryImageCaption: "Přehled zvířectva 1910 (PZ, sn. 2) – podrobná evidence skotu (272 ks), koz (127), prasat (167) a drůbeže (797).",
      summary: "Kompletní přepis archů PO/PZ 1910 odhalil 531 přítomných obyvatel, 92 nepřítomných a 3 barevné revizní vrstvy obcovací řeči [doc].",
      paragraphs: [
        "Zvláštností dochovaného sumáře Přehledu obyvatelstva z 31. 12. 1910 jsou dochované tři vrstvy revizního zápisu obcovací řeči (Umgangssprache): původní náčrt vykazoval 491 německé a 37 české řeči, mezikorekce 492 DE / 36 CS a finální inkoustová revize zemským úřadem stvrdila poměr 487 německé, 41 české a 3 cizozemci (celkem 531 přítomných + 92 nepřítomných) [doc].",
        "Vedle demografie podává Přehled zvířectva (PZ, 162 řádků vč. podčísel 1a, 15a, 33a, 44a, 74a) vysoce přesný obraz horského samozásobitelského hospodářství: chovalo se zde 272 kusů hovězího dobytka (z toho 153 krav), 25 koní pro potah a polní práce, 127 koz ('kráva chudých' v tkalcovských chalupách), 167 prasat a 797 kusů drůbeže."
      ],
      links: [
        { label: "Analýza 3 vrstev 1910", action: "openDemographySection" },
        { label: "Přehled dobytka podle čp.", action: "openMapSection" }
      ]
    },
    {
      id: "kap7_tisk_turistika",
      number: "VII.",
      era: "1898–1936",
      category: "Tisk & Turistika",
      badge: "MUDr. Moravec & Kašparova chata",
      title: "Lázně, pašerácké střety, MUDr. Moravec a Kašparova chata na Adamu (1936)",
      image: "assets/archives/tisk_1935_nase_mensiny_moravec_p114.jpg",
      imageCaption: "Článek v Našich menšinách (1935, s. 114) – vzpomínka na českopetrovického rodáka MUDr. Josefa Moravce (*1850).",
      secondaryImage: "assets/archives/tisk_1936_turisticky_hradecek_kasparova_chata.jpg",
      secondaryImageCaption: "Turistický Hrádeček (1936) – otevření Kašparovy chaty na Adamu jako československé turistické základny.",
      summary: "České Petrovice proslavilo letovisko s dřevěnými lázněmi, rodák MUDr. Josef Moravec (*1850) i stavba Kašparovy chaty KČST (1936) [doc].",
      paragraphs: [
        "Už průvodce Führer durch das Adlergebirge (1898) vychvaluje svěží horské klima Českých Petrovic a vyzdvihuje místní klimatické lázně a pohostinství pro letní hosty z pruského i českého vnitrozemí. Zdejším slavným rodákem byl český lékař a národní buditel MUDr. Josef Moravec (*1850), připomenutý nekrologem a studií v tisku Naše menšiny (1935) [doc].",
        "Po vzniku Československa se hřeben nad obcí stal významným turistickým i obranným cílem. Roku 1936 byla na vrchu Adam (766 m n. m.) otevřena chata Klubu československých turistů (Kašparova chata), zatímco bezprostředně vedle ní vyrůstala linie těžkého pohraničního opevnění včetně dělostřelecké tvrze Adam."
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
      imageCaption: "Sčítací arch čp. 160 z 15. 2. 1921 (sn. 285): vrchní strážmistr František Šlesinger, pohraniční finanční stráž a učitel Josef Gruber.",
      secondaryImage: "assets/archives/tisk_1923_nase_mensiny_p84.jpg",
      secondaryImageCaption: "Naše menšiny (1923, s. 84) – dramatická reportáž o umístění české menšinové školy na hranici.",
      summary: "V únoru 1921 napočítal učitel a komisař Josef Gruber na 143 arších 467 obyvatel (392 DE, 70 CS, 5 ciz.), z nichž 6 Čechů tvořilo posádku finanční stráže a školy na čp. 160 [doc].",
      paragraphs: [
        "První československé sčítání lidu z 15. února 1921 (plně přepsaných všech 286 snímků / 143 archů pro čp. 1–160) zachycuje 467 přítomných obyvatel ve 130 obydlených a 13 neobydlených domech [doc]. Národnostní složení se posunulo na 392 osob německé (83,9 %), 70 osob československé (15,0 %) a 5 osob cizí státní příslušnosti (především němečtí občané z Kladska a Vratislavi).",
        "Specifickým ohniskem nového československého státního zřízení se stal dům čp. 160 (u Kalousových): vedle majitelky zde bydlelo pět příslušníků Pohraniční finanční stráže v čele s vrchním strážmistrem Františkem Šlesingerem a učitel I. třídy Josef Gruber, jenž celé petrovické sčítání v terénu zapsal. Dobový tisk Naše menšiny (1923) i civilní matriky OÚ Žamberk (sign. 6376, 8272) ilustrují napjaté i každodenní soužití obou jazykových skupin."
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
      badge: "Mnichov & Příběh Františka Bařinky",
      title: "Zábor pohraničí (1938) a tragický osud Františka Bařinky († 3. 5. 1945 na lodi Thielbek)",
      image: "assets/maps/mapa_1938_pomezi_detail.jpg",
      imageCaption: "Výřez z vojenské speciální mapy Žamberk (reambulace VZÚ 1938) s průběhem hranice a opevněného pásma u Českých Petrovic.",
      secondaryImage: "assets/archives/scitani_1921_cp7_koth.jpg",
      secondaryImageCaption: "Sčítací arch čp. 7 (1921, sn. 13) – rodinné zázemí rodu Kothových a rodiště Františka Bařinky.",
      summary: "V říjnu 1938 připadly České Petrovice k Německé říši; z čp. 7 pocházející František Bařinka (*1911) zahynul jako politický vězeň v Lübecké zátoce 3. 5. 1945 [doc].",
      paragraphs: [
        "Po Mnichovské dohodě v říjnu 1938 byla obec připojena k Německé říši (Landkreis Grulich / Reichsgau Sudetenland) a čerstvě dokončená dělostřelecká tvrz Adam na jižním hřebeni padla bez boje do rukou wehrmachtu [doc]. České pohraniční obyvatelstvo a zaměstnanci státních institucí obec opustili.",
        "Hlubokým lidským symbolem válečného utrpení je doložený osud Františka Bařinky (*5. 1. 1911, České Petrovice čp. 7, z rodinného okruhu Kothových) [doc]. Jako bývalý četař čs. armády u hraničního pluku (Vrchlabí, Mladkov na výstavbě opevnění tvrze Adam a Dobrošov, Zlín) a finanční stráže byl 25. 3. 1940 v Braunschweigu zatčen gestapem za protinacistické výroky (Heimtückegesetz), prošel koncentračními tábory Dachau (č. 21743) a Neuengamme (č. 4230) a zahynul 3. května 1945 při náletu na vězeňskou loď SS Thielbek v Lübecké zátoce. Jeho ostatky jsou uloženy v hromadném hrobě na hřbitově v dánském Sandby na ostrově Lolland; in memoriam obdržel Československý válečný kříž 1939."
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
      imageCaption: "Věstník Sokolské župy Orlické (1946, s. 4) – obnova českých spolků a tělovýchovy v poválečných Českých Petrovicích.",
      secondaryImage: "assets/maps/mapa_2026_katastr_celek.jpg",
      secondaryImageCaption: "Katastrální celek k.ú. 622702 České Petrovice v r. 2026 se srovnáním původní osídlené osy a moderní rekreace.",
      summary: "Odsun r. 1945–1946 snížil počet stálých obyvatel ze 430 na méně než třetinu (cca 120–160 obyv.); dnes obec žije šetrnou turistikou a uchovává paměť 170 míst [doc].",
      paragraphs: [
        "Po květnu 1945 a následném vysídlení německého obyvatelstva (1945–1946) klesl počet stálých obyvatel Českých Petrovic ze zhruba 430 osob (1930) na pouhých 136 obyvatel při sčítání v roce 1950 [doc]. Nově příchozí čeští osídlenci postupně obnovili školu, obecní správu i sokolskou jednotu (1946).",
        "Demografická proměna 2. poloviny 20. století se zřetelně otiskla i do domovního fondu: z historické řady čp. 1–160 dnes v RÚIAN fyzicky stojí 105 stavení, zatímco 55 domů (zejména v okrajových a hřebenových polohách) zaniklo nebo bylo zbořeno [doc]. Doplněny o novostavby (čp. 161–163), 6 evidovaných rekreačních chat (č. ev.) a barokní kostel tak mapa webu dokumentuje plných 170 objektů — paměť celé pohraniční vsi."
      ],
      links: [
        { label: "Interaktivní mapa 170 objektů", action: "openMapSection" },
        { label: "Ortofoto 1953–2022 na mapě", action: "openMapSection" }
      ]
    }
  ],
  funFacts: [
    {
      id: "fact_1805_renum",
      icon: "🔢",
      tag: "Přečíslování 1805/1806",
      title: "Matriční dvojčíslí v úmrtní knize 23-5 odhaluje záměnu adres",
      text: "V matrice zemřelých sign. 23-5 (sn. 28, r. 1806) farář Kožíšek souběžně zapsal stará i nová čísla popisná (např. staré čp. 25 přešlo na čp. 40), čímž umožnil zpětně rozlišit rodiny před rokem 1805.",
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
      text: "Přehled zvířectva z 31. 12. 1910 dokládá ostrý sociální rozdíl: zatímco těžké koně (25 ks) chovaly velké grunty, v chalupách drobných tkalců se soustředilo 127 koz ('kráva chudých') a 797 kusů drůbeže.",
      action: "openDemographySection",
      actionLabel: "Ekonomika 1910"
    },
    {
      id: "fact_1924_ocr",
      icon: "📖",
      tag: "Opravená chyba Lexikonu 1924",
      text: "Zatímco Statistický lexikon obcí z r. 1924 chybně uvádí 462 osob (či v OCR přepisech kolují varianty), přímý součet ze všech 143 původních archivních archů sčítání z 15. 2. 1921 dává přesně 467 přítomných obyvatel.",
      title: "Přímý archivní součet 1921 (467 osob) vyvrací zkreslení z tištěného Lexikonu",
      action: "openPeopleSection",
      actionLabel: "Prohlédnout rejstřík"
    },
    {
      id: "fact_cp160_gruber",
      icon: "🏫",
      tag: "Čp. 160 & Finanční stráž",
      title: "Jeden dům, 6 Čechů, finanční stráž i český sčítací komisař (1921)",
      text: "V domě čp. 160 sídlilo r. 1921 v šesti podnájmech 5 příslušníků Pohraniční finanční stráže v čele s Františkem Šlesingerem a mladý český učitel I. tř. Josef Gruber z Luže, který současně sčítal celou vesnici.",
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
      title: "Rodák z čp. 7 František Bařinka (*1911) odpočívá u dánského pobřeží",
      text: "Po zatčení v Braunschweigu a letech v Dachau a Neuengamme zemřel F. Bařinka 3. 5. 1945 na lodi Thielbek. Moře vyplavilo těla vězňů k ostrovu Lolland v Dánsku, kde je společně pohřben na hřbitově v Sandby.",
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
      summary: "Proč o lese a potocích u Petrovic rozhodovaly olomoucké Zemské desky, páni ze Zvole, z Kolštejna a kartografové Helwig, Fabricius a Komenský.",
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
      title: "Životní dráha Františka Bařinky (1911–1945) z čp. 7",
      era: "1911–1945",
      summary: "Od saského a kladského pomezí přes stavbu čs. pohraničního opevnění (tvrz Adam, Dobrošov) po vězeňská čísla Dachau 21743 a Neuengamme 4230.",
      href: "obyvatele.html#person=p_frantisek_barinka_1911"
    }
  ]
};
