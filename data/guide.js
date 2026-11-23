// ==========================================================================
// BADATELSKÝ PRŮVODCE, HERALDIKA, FARNOSTI & POJISTKA PROTI HOMONYMŮM
// Dle docs/badatelsky_pruvodce_ceske_petrovice.md & REKOS č. 5727
// ==========================================================================

const guideData = {
  jurisdiction: {
    municipality: "České Petrovice (něm. Böhmisch Petersdorf)",
    zuj: "580066",
    ku: "622702 (České Petrovice)",
    regionToday: "Okres Ústí nad Orlicí, Pardubický kraj, ORP Žamberk",
    historicDomain: "Panství Žamberk (do 1848)",
    historicDistrict: "Soudní okres Králíky (Grulich) • Politický okres Žamberk (Senftenberg) • SOkA Ústí nad Orlicí / SOA Hradec Králové",
    coatOfArms: {
      rekosId: "5727",
      decision: "Rozhodnutí předsedy PS PČR č. 52 ze dne 25. března 2005",
      blazon: "V modro-červeně polceném štítě postavený stříbrný meč se zlatým jílcem převýšený zlatou korunou a provázený dvěma vztyčenými odvrácenými gotickými klíči, pravým zlatým a levým stříbrným.",
      symbolism: "Meč (atribut sv. Pavla) a dva klíče (atribut sv. Petra) přímo odkazují na barokní farní kostel sv. Petra a Pavla z let 1732–1734; koruna upomíná na pohraniční strážní tradici a postavení na trojmezí.",
      rekosUrl: "https://rekos.psp.cz/detail-symbolu/id/5727",
      svgPath: "assets/icons/ceske_petrovice_erb.svg",
      pngPath: "assets/icons/favicon-64.png"
    }
  },
  parishSuccession: [
    {
      period: "1591–1647",
      parish: "Bartošovice v Orlických horách (Batdorf)",
      registers: "sign. 2-8336 (N 1591–1647)",
      note: "Obsahuje nejstarší známý matriční doklad lokality Petersdorf (1591, sn. 4).",
      url: "https://aron.vychodoceskearchivy.cz/"
    },
    {
      period: "1659–1718",
      parish: "Lukavice (Lukawitz)",
      registers: "sign. 83-1, 83-2",
      note: "Zápisy obcí panství Žamberk po třicetileté válce.",
      url: "https://aron.vychodoceskearchivy.cz/"
    },
    {
      period: "1674–1785",
      parish: "Nekoř (Nekorz)",
      registers: "sign. 109-1 až 109-15 (vč. 1734 'Novo Sacello Petersdorf')",
      note: "Překlenovací období včetně výstavby petrovického kostela (1732–1734).",
      url: "https://aron.vychodoceskearchivy.cz/"
    },
    {
      period: "1770–1942",
      parish: "České Petrovice (lokálie 1785, poté farnost)",
      registers: "sign. 23-1 až 23-8990 + index 23-3317 (12 svazků v ARON)",
      note: "Vlastní farní knihy založené lokálním správcem P. Josefem Kožíškem vč. Repertoria 1805/1806.",
      url: "https://aron.vychodoceskearchivy.cz/apu/f276e7f7-f682-47d6-b386-0ccdf304c92a"
    },
    {
      period: "1919–1949",
      parish: "Okresní úřad Žamberk – Civilní matriky",
      registers: "sign. 6376 (O 1919–1942) a sign. 8272 (Z 1919–1949)",
      note: "Pro obyvatele bez vyznání a smíšené civilní sňatky v meziválečném období.",
      url: "https://aron.vychodoceskearchivy.cz/apu/72d83ec6-aa33-4a91-b03a-d62f5a0ee62e"
    }
  ],
  landBooks: [
    { layer: "Berní rula 1654", archive: "Národní archiv Praha", note: "Soupis usedlých sedláků, chalupníků a zahradníků po 30leté válce (dosud nedigitalizováno pro tuto obec)." },
    { layer: "Tereziánský katastr (1713–1757) & Josefský katastr (1785)", archive: "Národní archiv Praha", note: "Výchozí rustikální a pozemková evidence z doby zavedení prvních čísel popisných (1770/1771)." },
    { layer: "Stabilní katastr 1840 (k. ú. 622702)", archive: "ÚAZK ČÚZK Praha", note: "629,83 ha a 1 777 parcel; otisky dosud vyžadují badatelskou objednávku." },
    { layer: "Pozemkové a gruntovní knihy", archive: "SOA Zámrsk / KP Ústí n. O.", note: "Velkostatek Žamberk a pozemkové vložky (agenda v docs/archivni_dotazy.md)." }
  ],
  dictionary: [
    { term: "Alte / Neue Hausnummer", cz: "Staré číslo popisné (1771–1805) vs. Nové číslo popisné po přečíslování 1805/1806 (často zapsané v Repertoriu 23-1)." },
    { term: "Rusticus / Bauer / Gärtler", cz: "Sedlák (velký grunt) / Chalupník-zahradník s menší výměrou polností." },
    { term: "Häusler / Inwohner", cz: "Domkář (vlastní chalupu bez polí) / Podruh (bydlí v nájmu)." },
    { term: "Lohnweber / Hausweber", cz: "Námezdní či domácký tkadlec pracující na ručním stavu pro faktory (např. Faber z Mezilesí)." },
    { term: "Ausgedinger / na výměnku", cz: "Výměnkář – bývalý hospodář po předání gruntu mladší generaci." },
    { term: "Umgangssprache (PO 1910)", cz: "Obcovací řeč (nikoli přímo národnost!) – sčítací kritérium v Rakousko-Uhersku." },
    { term: "Heimatrecht (domovské právo)", cz: "Obec příslušná k chudinské péči a vojenské evidenci (často odlišná od bydliště či rodiště)." },
    { term: "Viehstandsausweis (PZ 1910)", cz: "Úřední přehled hospodářského zvířectva podle popisných čísel." },
    { term: "Hilfsausweis (1910)", cz: "Pomocný výkaz osob pobývajících mimo domovskou obec či kraj." },
    { term: "Heimtückegesetz", cz: "Nacistický zákon o 'zákeřných útocích proti státu a straně', pod nějž byl r. 1940 zařazen F. Bařinka." },
    { term: "Lokálie (Localie)", cz: "Samostatná duchovní správa zřízená v obci r. 1785 při povýšení kostela sv. Petra a Pavla." }
  ],
  homonyms: [
    { name: "České Petrovice (Böhmisch Petersdorf)", ok: true, id: "ZÚJ 580066 • k.ú. 622702 • s.o. Králíky", note: "Správná cílová obec tohoto portálu (Ústí nad Orlicí)." },
    { name: "Petrovičky (Deutsch Petersdorf / Německé Petrovice)", ok: false, id: "Sousední osada u Mladkova (310 ha)", note: "Těsně sousedí, v minulosti uváděny vedle Českých Petrovic — nutné striktně oddělovat!" },
    { name: "Vernéřovice (Deutsch Wernersdorf)", ok: false, id: "ZÚJ 547743 (okr. Náchod / Broumov)", note: "Cizí obec na Broumovsku s podobnými německými názvy." },
    { name: "Petrovice u Dolní Čermné", ok: false, id: "Bývalý okr. Lanškroun", note: "Jiný soudní okres (Lanškroun) v jiném údolí." },
    { name: "Petříkovice (Petersdorf u Trutnova)", ok: false, id: "Okr. Trutnov (Chvaleč)", note: "V digitalizovaných indexech SOA HK se vrací pod heslem 'Petersdorf'." },
    { name: "Petrušov / Petrovice (Moravská Třebová)", ok: false, id: "Svitavsko", note: "Rozdílné krajské i farní zařazení." },
    { name: "Petrovice u Štoků", ok: false, id: "Vysočina (Havlíčkobrodsko)", note: "Někdejší německý název Petersdorf; mimo východní Čechy." }
  ],
  researchAgenda: [
    "Získání barevných skenů Stabilního katastru 1840 (ÚAZK Praha) pro propojení parcelních čísel z 19. století.",
    "Doplnění kompletní transkripce sčítacích operátů z let 1880, 1890 a 1900 (navázání na hotové roky 1910 a 1921).",
    "Vytěžení pozemkových knih velkostatku Žamberk (SOA Zámrsk) pro přesné posloupnosti držitelů čp. 1–160 před r. 1771.",
    "Archivní rešerše obecních protokolů MNV a školní kroniky v SOkA Ústí nad Orlicí (1920–1960)."
  ]
};
