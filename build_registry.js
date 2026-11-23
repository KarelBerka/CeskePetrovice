/**
 * Sestaví sjednocený rejstřík všech obyvatel ze sčítání lidu (1869 vzorek & 1921 komplet)
 * přímo z data/houses.js -> data/census_registry.js, a ověří integritu linkedCensusIds
 * v data/people.js.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function loadGlobalVar(relPath, varName) {
  const fullPath = path.join(__dirname, relPath);
  if (!fs.existsSync(fullPath)) return undefined;
  const code = fs.readFileSync(fullPath, 'utf-8');
  const ctx = {};
  vm.runInNewContext(`${code}\nthis.__EXPORT__ = typeof ${varName} !== 'undefined' ? ${varName} : undefined;`, ctx);
  return ctx.__EXPORT__;
}

function getPersonCategory(relation = '', occupation = '', notes = '') {
  const text = `${relation} ${occupation} ${notes}`.toLowerCase();

  if (/výměnk|ausgeding/.test(text)) {
    return { key: 'vymenek', label: 'Výměnkář / Výměnkářka', icon: '👴', badgeClass: 'bg-stone-100 text-stone-900 border-stone-300' };
  }
  if (/farář|kněz|učitel|finanč|strážmistr|dozorce|pfarrer|lehrer|komisař/.test(text)) {
    return { key: 'vzdelanec', label: 'Duchovní / Učitel / Finanční stráž', icon: '🎓', badgeClass: 'bg-indigo-100 text-indigo-950 border-indigo-300' };
  }
  if (/čeled|pohůnek|děvečk|slouž|služeb|kočí|knecht|magd|köchin|schovan|učedník/.test(text)) {
    return { key: 'celed', label: 'Čeleď, služebnictvo & učedníci', icon: '🐎', badgeClass: 'bg-amber-100 text-amber-950 border-amber-300' };
  }
  if (/majitel|hospodář|wirthschaftsbesitzer|samostatn|hostinský|hostinství|mlynář/.test(text) && !/pomocník|dělník/.test(text)) {
    return { key: 'grunt', label: 'Držitel gruntu / Živnostník', icon: '🏡', badgeClass: 'bg-emerald-100 text-emerald-950 border-emerald-300' };
  }
  if (/tkadl|tkalcov|weber|lohnweber|zedn|tesař|obuvn|krejč|truhlář|dřevař|dělník|nádeník|knofl/.test(text)) {
    return { key: 'remeslo', label: 'Tkadlec / Řemeslník / Dělník', icon: '🧵', badgeClass: 'bg-sky-100 text-sky-950 border-sky-300' };
  }
  return { key: 'ostatni', label: 'Rodinný příslušník / Podruh', icon: '👥', badgeClass: 'bg-slate-100 text-slate-800 border-slate-300' };
}

function main() {
  const houses = loadGlobalVar('data/houses.js', 'housesData') || [];
  const people = loadGlobalVar('data/people.js', 'peopleData') || [];

  const registry = [];
  let seqCounter = 0;

  for (const h of houses) {
    const censuses = Array.isArray(h.census) ? h.census : [];
    for (const c of censuses) {
      const year = Number(c.year);
      const inhList = Array.isArray(c.inhabitants) ? c.inhabitants : [];
      for (const inh of inhList) {
        if (!inh || !inh.name) continue;
        seqCounter++;
        const id = `cen_${seqCounter}`;
        const cat = getPersonCategory(inh.relation, inh.occupation, inh.notes);
        registry.push({
          id,
          seqId: seqCounter,
          censusSeq: inh.seq || null,
          fullName: inh.name,
          censusYear: year,
          isSample: Boolean(c.isSample),
          houseId: h.id,
          houseNumber: h.number,
          sector: h.sector || '',
          locality: 'České Petrovice',
          relation: inh.relation || '-',
          sex: inh.sex || '',
          maritalStatus: inh.maritalStatus || '',
          birthDate: inh.birthDate || (inh.birthYear ? String(inh.birthYear) : '-'),
          birthYear: inh.birthYear || null,
          birthPlace: inh.birthPlace || '-',
          inVillageSince: inh.inVillageSince || '',
          domovska: inh.domovska || '-',
          nationality: inh.nationality || '',
          religion: inh.religion || '',
          literacy: inh.literacy || '',
          occupation: inh.occupation || '-',
          employer: inh.employer || '',
          occupation1914: inh.occupation1914 || '',
          notes: inh.notes || c.source || '',
          scanFile: c.scanFile || '',
          scanTitle: c.scanTitle || '',
          originalUrl: c.originalUrl || '',
          categoryKey: cat.key,
          categoryLabel: cat.label,
          categoryIcon: cat.icon,
          categoryBadgeClass: cat.badgeClass
        });
      }
    }
  }

  const count1921 = registry.filter(r => r.censusYear === 1921).length;
  const count1869 = registry.filter(r => r.censusYear === 1869).length;
  const byId = new Map(registry.map(r => [r.id, r]));

  const outCode =
    '// Automaticky generováno skriptem build_registry.js z data/houses.js\n\n' +
    `const censusRegistryData = ${JSON.stringify(registry, null, 2)};\n`;
  fs.writeFileSync(path.join(__dirname, 'data/census_registry.js'), outCode, 'utf-8');

  console.log(`Generated data/census_registry.js: ${registry.length} records (1921: ${count1921}, 1869 sample: ${count1869})`);

  if (count1921 !== 467) {
    console.error(`ERROR: Expected 467 1921 census records, got ${count1921}`);
    process.exit(1);
  }

  let broken = 0;
  for (const p of people) {
    for (const cid of (p.linkedCensusIds || [])) {
      if (!byId.has(cid)) {
        console.error(`BROKEN linkedCensusId in ${p.id}: ${cid}`);
        broken++;
      }
    }
  }

  if (broken > 0) {
    console.error(`FAILED Integrity check: ${broken} broken linkedCensusIds!`);
    process.exit(1);
  }

  console.log(`Integrity check OK: 0 broken linkedCensusIds across ${people.length} curated profiles.`);
}

main();
