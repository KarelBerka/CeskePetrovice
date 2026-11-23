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
    historicDomain: "Panství Kyšperk (Herrschaft Geiersberg / Letohrad, do 1848)",
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
      period: "1591–1624",
      parish: "Bartošovice v Orlických horách (Batzdorf)",
      registers: "sign. 2-8336 (97 sn., Z 1591–1618, N 1597–1622, O 1611–1624)",
      note: "Nejstarší dochovaná pomezní matrika: z r. 1591 pochází paleograficky sporné ‚Pitzßdorff‘, nesporné ‚p./P.‘ (Petersdorf) od r. 1596/1597.",
      url: "https://aron.vychodoceskearchivy.cz/apu/8dcb1638-0a4e-412c-a4de-64f58bdb7d1b"
    },
    {
      period: "1646–1705 (knihy 1646–1702)",
      parish: "Lukavice (Lukawitz)",
      registers: "sign. 83-1 (1646–1671, 114 sn.) & 83-2 (1672–1702, 281 sn.)",
      note: "Zápisy poddaných vsi na panství Kyšperk po třicetileté válce až do října 1705.",
      url: "https://aron.vychodoceskearchivy.cz/apu/8892a7da-a31a-4a18-a59f-2df1b606c5be"
    },
    {
      period: "10. 1705 – 4. 1784",
      parish: "Nekoř (Nekorz)",
      registers: "sign. 109-1, 109-2, 109-8, 109-13, 109-15",
      note: "Titulní list 109-1 (r. 1705) uvádí filiální kostel sv. Petra a Pavla v Petrovicích; v r. 1734 dle Sommera dostavěn nynější kostel.",
      url: "https://aron.vychodoceskearchivy.cz/apu/fd865aa0-64b3-40ab-b855-2d914eb6e360"
    },
    {
      period: "1770–1942",
      parish: "České Petrovice (lokálie 5/1784, samostatná farnost 1857)",
      registers: "sign. 23-1 až 23-8990 + index 23-3317 (10 svazků v ARON)",
      note: "Křestní kniha 23-1 (od 1770) vč. Repertoria (F. L. Kožischek?); úmrtní 23-5 sn. 28 s poznámkou J. Ullricha k přečíslování 1805/1806.",
      url: "https://aron.vychodoceskearchivy.cz/apu/1fe9c209-25bf-47d8-99b3-22adea3d960c"
    },
    {
      period: "1894–1935",
      parish: "Okresní úřad Žamberk – Civilní matriky",
      registers: "sign. 6376 (N 1894–1924, O 1901–1922, Z 1902–1923, 83 sn.) a sign. 8272 (O 1923–1935, 273 sn.)",
      note: "Obsahují civilní sňatky občanů okresu (mj. J. Doleček 1922, J. Schroller 1923) a 7× zmínku porodní asistentky Filomeny Adlerové z čp. 83.",
      url: "https://aron.vychodoceskearchivy.cz/apu/a863ff07-39ab-4fa9-806d-3f803a35b72d"
    }
  ],
  landBooks: [
    { layer: "Berní rula 1654", archive: "Národní archiv Praha", note: "Panství Kyšperk: cca 56–57 usedlostí (18 sedláků, 9 malorolníků, 29–30 chalupníků) [lit]." },
    { layer: "Tereziánský katastr (1713–1757) & Josefský katastr (1785)", archive: "Národní archiv Praha", note: "Výchozí rustikální a pozemková evidence z doby zavedení prvních čísel popisných (duben 1771)." },
    { layer: "Stabilní katastr 1840 vs. RÚIAN 2026 (k. ú. 622702)", archive: "ÚAZK ČÚZK Praha", note: "V RÚIAN 2026 má katastr 629,83 ha a 1 777 parcel (v r. 1921/1949 výměra 627 ha); císařský otisk 1840 vyžaduje badatelské stažení." },
    { layer: "Pozemkové a gruntovní knihy", archive: "SOA Zámrsk / KP Ústí n. O.", note: "Velkostatek Kyšperk (Letohrad) a pozemkové vložky (agenda v docs/archivni_dotazy.md)." }
  ],
  dictionary: [
    { term: "Alte / Neue Hausnummer", cz: "Staré číslo popisné (1771–1805) vs. Nové číslo popisné po přečíslování 1805/1806 (zapsáno v Repertoriu 23-1 a v matrice 23-5 sn. 28)." },
    { term: "Rusticus / Bauer / Gärtler", cz: "Sedlák (velký grunt) / Chalupník-zahradník s menší výměrou polností." },
    { term: "Häusler / Inwohner", cz: "Domkář (vlastní chalupu bez polí) / Podruh (bydlí v nájmu)." },
    { term: "Lohnweber / Hausweber", cz: "Námezdní či domácký tkadlec pracující na ručním stavu pro faktory." },
    { term: "Ausgedinger / na výměnku", cz: "Výměnkář – bývalý hospodář po předání gruntu mladší generaci." },
    { term: "Umgangssprache (PO 1910)", cz: "Obcovací řeč (nikoli přímo národnost!) – sčítací kritérium v Rakousko-Uhersku." },
    { term: "Heimatrecht (domovské právo)", cz: "Obec příslušná k chudinské péči a vojenské evidenci (často odlišná od bydliště či rodiště)." },
    { term: "Viehstandsausweis (PZ 1910)", cz: "Úřední přehled hospodářského zvířectva podle popisných čísel." },
    { term: "Hilfsausweis (1910)", cz: "Pomocný výkaz osob pobývajících mimo domovskou obec či kraj." },
    { term: "Heimtückegesetz", cz: "Nacistický zákon o ‚zákeřných útocích proti státu a straně‘, pod nějž byl r. 1940 zařazen F. Bařinka." },
    { term: "Lokálie (Localie)", cz: "Samostatná duchovní správa zřízená v obci v květnu 1784 při povýšení kostela sv. Petra a Pavla (farnost od r. 1857)." }
  ],
  homonyms: [
    { name: "České Petrovice (Böhmisch Petersdorf)", ok: true, id: "ZÚJ 580066 • k.ú. 622702 • s.o. Králíky", note: "Správná cílová obec tohoto portálu (Ústí nad Orlicí)." },
    { name: "Petrovičky (Deutsch Petersdorf / Německé Petrovice)", ok: false, id: "Sousední osada u Mladkova (310 ha)", note: "Těsně sousedí, v minulosti uváděny vedle Českých Petrovic — nutné striktně oddělovat!" },
    { name: "Vernéřovice (Deutsch Wernersdorf)", ok: false, id: "ZÚJ 547743 (okr. Náchod / Broumov)", note: "Cizí obec na Broumovsku s podobnými německými názvy." },
    { name: "Petrovice u Dolní Čermné", ok: false, id: "Bývalý okr. Lanškroun", note: "Jiný soudní okres (Lanškroun) v jiném údolí." },
    { name: "Petříkovice (Petersdorf u Trutnova)", ok: false, id: "Okr. Trutnov (Chvaleč)", note: "V digitalizovaných indexech SOA HK se vrací pod heslem ‚Petersdorf‘." },
    { name: "Petrušov / Petrovice (Moravská Třebová)", ok: false, id: "Svitavsko", note: "Rozdílné krajské i farní zařazení." },
    { name: "Petrovice u Štoků", ok: false, id: "Vysočina (Havlíčkobrodsko)", note: "Někdejší německý název Petersdorf; mimo východní Čechy." }
  ],
  researchAgenda: [
    "Získání barevných skenů Stabilního katastru 1840 (ÚAZK Praha) pro propojení parcelních čísel z 19. století.",
    "Doplnění kompletní transkripce sčítacích operátů z let 1880, 1890 a 1900 (navázání na hotové roky 1910 a 1921).",
    "Vytěžení pozemkových knih velkostatku Kyšperk / Letohrad (SOA Zámrsk) pro přesné posloupnosti držitelů čp. 1–160 před r. 1771.",
    "Archivní rešerše obecních protokolů MNV a školní kroniky v SOkA Ústí nad Orlicí (1920–1960)."
  ]
};
