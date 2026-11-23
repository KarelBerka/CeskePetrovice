/**
 * build_clusters.js
 * Sestaví heterogenní datový model pro laboratoř propojování osob (cluster.html)
 * a propojené obyvatele v rejstříku (obyvatele.html) výhradně pro obec
 * České Petrovice (Böhmisch Petersdorf):
 *   - 1771–1784 matrika sign. 23-1 (data/domy_1771_1921.json)
 *   - 1869 výběrový vzorek sčítání lidu (17 domů)
 *   - 1921 kompletní sčítání lidu (143 archů, 467 obyvatel)
 *
 * Výstupy:
 *   - data/cluster_dataset.js  (const clusterDataset = {...})
 *   - data/census_links.js     (const censusLinksData = {...})
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

function normRaw(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

const GIVEN_MAP = {
  johann: 'jan', johannes: 'jan', joannes: 'jan', johan: 'jan', hans: 'jan',
  franz: 'frantisek', franciscus: 'frantisek',
  joseph: 'josef', josephus: 'josef',
  anton: 'antonin', antonius: 'antonin',
  karl: 'karel', carolus: 'karel',
  georg: 'jiri', georgius: 'jiri',
  wenzel: 'vaclav', wenceslaus: 'vaclav',
  paul: 'pavel', paulus: 'pavel',
  peter: 'petr', petrus: 'petr',
  heinrich: 'jindrich',
  stephan: 'stepan',
  wilhelm: 'vilem',
  ferdinand: 'ferdinand',
  adolf: 'adolf',
  theresia: 'terezie', therese: 'terezie',
  anna: 'anna', maria: 'marie', marie: 'marie',
  johanna: 'jana', johana: 'jana',
  elisabeth: 'alzbeta', elisabetha: 'alzbeta',
  rosalia: 'rozalie', rosalie: 'rozalie', rosina: 'ruzina', ruzena: 'ruzina',
  wilhelmina: 'vilemina', vilemina: 'vilemina',
  ludmilla: 'ludmila',
  christina: 'kristina', kristina: 'kristina',
  emilie: 'emilie', emilia: 'emilie',
  hedwig: 'hedvika', hedwika: 'hedvika',
  mathilde: 'matylda', matilda: 'matylda', matylda: 'matylda',
  philomena: 'filomena'
};

function canonicalGiven(tok) {
  const n = normRaw(tok).replace(/[^a-z]/g, '');
  return GIVEN_MAP[n] || n;
}

function canonicalSurname(tok) {
  let s = normRaw(tok).replace(/[^a-z]/g, '');
  s = s.replace(/ova$/, '').replace(/owa$/, '').replace(/sch/g, 's').replace(/tz/g, 'c').replace(/paha$/, 'pacha');
  return s;
}

function extractNameTokens(fullName) {
  const cleaned = (fullName || '')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\b(?:mudr|judr|dr|p)\.\s*/gi, ' ')
    .trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { surname: '', given: '', parts: [] };
  const s1 = canonicalSurname(parts[0]);
  const g1 = canonicalGiven(parts[parts.length - 1]);
  return { parts, surname: s1, given: g1 };
}

function cleanPlace(raw) {
  if (!raw || raw === '-' || raw === '"') return '';
  return raw.split(',')[0].replace(/\[[^\]]*\]/g, '').trim();
}

function classifyArchetype(categoryKey, birthPlace, recordsCount) {
  if (categoryKey === 'vzdelanec') {
    return { key: 'inteligence', label: 'Duchovní, učitelé & pohraniční stráž', color: '#4338ca' };
  }
  if (categoryKey === 'grunt') {
    return { key: 'usedlici', label: 'Starousedlíci & držitelé gruntů', color: '#047857' };
  }
  if (categoryKey === 'celed') {
    return { key: 'sluzba', label: 'Čeleď, služebnictvo & učedníci', color: '#b45309' };
  }
  if (categoryKey === 'vymenek') {
    return { key: 'vymenek', label: 'Výměnkáři & senioři obce', color: '#78716c' };
  }
  if (birthPlace && !/^č\.?s\.?\s*petrovice|^čes\.\s*petrovice|^petersdorf/i.test(cleanPlace(birthPlace))) {
    return { key: 'imigranti', label: 'Přistěhovalí z Kladska & vnitrozemí', color: '#0e7490' };
  }
  if (recordsCount >= 2) {
    return { key: 'kontinuita', label: 'Vícegenerační kontinuita v obci', color: '#9a3412' };
  }
  return { key: 'tkalci_rodiny', label: 'Tkalcovské a domkářské rodiny', color: '#0369a1' };
}

function main() {
  const houses = loadGlobalVar('data/houses.js', 'housesData') || [];
  const people = loadGlobalVar('data/people.js', 'peopleData') || [];
  const registry = loadGlobalVar('data/census_registry.js', 'censusRegistryData') || [];
  const domy = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/domy_1771_1921.json'), 'utf-8'));

  const records = [];
  const recById = new Map();

  // 1. Záznamy ze sčítání lidu (1869 vzorek & 1921 komplet)
  for (const r of registry) {
    const isPlaceholder = /^(hlava domu|další členové|služebná|pasák|i\.\s*strana|ii\.\s*strana|unbewohnt|bewohner)/i.test(r.fullName);
    if (isPlaceholder) continue;

    const tk = extractNameTokens(r.fullName);
    const rec = {
      id: r.id,
      recordKind: 'census',
      sourceGroup: r.censusYear === 1921 ? 'census_1921' : 'census_1869',
      sourceType: `Sčítání ${r.censusYear}`,
      sourceTypeLabel: `Sčítání lidu ${r.censusYear}`,
      year: r.censusYear,
      fullName: r.fullName,
      canonicalSurname: tk.surname,
      canonicalGiven: tk.given,
      sex: r.sex || '',
      birthDate: r.birthDate || '-',
      birthYear: r.birthYear || null,
      birthPlace: r.birthPlace || '',
      domovska: r.domovska || '',
      houseId: r.houseId,
      houseNumber: r.houseNumber,
      locality: 'České Petrovice',
      sector: r.sector || '',
      relation: r.relation || '-',
      occupation: r.occupation || '-',
      employer: r.employer || '',
      nationality: r.nationality || '',
      scanFile: r.scanFile || '',
      scanTitle: r.scanTitle || '',
      notes: r.notes || '',
      categoryKey: r.categoryKey || 'ostatni',
      categoryLabel: r.categoryLabel || '',
      categoryIcon: r.categoryIcon || '👤',
      categoryBadgeClass: r.categoryBadgeClass || 'bg-slate-100 text-slate-800 border-slate-300'
    };
    records.push(rec);
    recById.set(rec.id, rec);
  }

  // 2. Matriční záznamy 1771–1784 z data/domy_1771_1921.json
  let matCounter = 0;
  for (const dh of domy.houses || []) {
    const entries = (dh.earliest_1771_1784 && dh.earliest_1771_1784.as_alte_entries) || [];
    for (const e of entries) {
      if (!e.father) continue;
      matCounter++;
      const yr = Number((e.date || '1771').slice(0, 4)) || 1775;
      const neueCp = e.repertorium_neue || dh.cp;
      const tk = extractNameTokens(e.father);
      const id = `mat23_1_${matCounter}`;
      const isGrunt = /rust|bauer|colon/i.test(e.status || '');
      const rec = {
        id,
        recordKind: 'parish',
        sourceGroup: 'matriky',
        sourceType: 'Matrika 23-1 (1771–1784)',
        sourceTypeLabel: 'Matrika N 23-1 (křest dítěte)',
        year: yr,
        fullName: `${e.father} (otec – dítě ${e.child || ''})`,
        canonicalSurname: tk.surname,
        canonicalGiven: tk.given,
        sex: 'M',
        birthDate: e.date || String(yr),
        birthYear: null,
        birthPlace: 'České Petrovice',
        domovska: 'České Petrovice',
        houseId: `cp${neueCp}`,
        houseNumber: String(neueCp),
        locality: 'České Petrovice',
        sector: '',
        relation: `Otec / ${e.status || 'usedlík'} (st. čp. ${dh.cp})`,
        occupation: e.status || 'usedlík',
        employer: '',
        nationality: '',
        scanFile: 'assets/archives/matrika_23_1_1771_cp.jpg',
        scanTitle: `Matrika 23-1 (${e.date}) – st. čp. ${dh.cp} -> n. čp. ${neueCp}`,
        notes: `Křest dítěte ${e.child || '-'} (st. čp. ${dh.cp} -> nové čp. ${neueCp})`,
        categoryKey: isGrunt ? 'grunt' : 'ostatni',
        categoryLabel: isGrunt ? 'Držitel gruntu / Sedlák' : 'Obyvatel z matriky 1771–1784',
        categoryIcon: isGrunt ? '🏡' : '📜',
        categoryBadgeClass: isGrunt ? 'bg-emerald-100 text-emerald-950 border-emerald-300' : 'bg-amber-100 text-amber-950 border-amber-300'
      };
      records.push(rec);
      recById.set(id, rec);
    }
  }

  // 3. Union-Find propojování identit
  const parent = new Map(records.map(r => [r.id, r.id]));
  function find(x) {
    while (parent.get(x) !== x) {
      parent.set(x, parent.get(parent.get(x)));
      x = parent.get(x);
    }
    return x;
  }
  function union(a, b) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent.set(rb, ra);
  }

  for (const p of people) {
    const validIds = (p.linkedCensusIds || []).filter(id => recById.has(id));
    for (let i = 1; i < validIds.length; i++) {
      const ra = recById.get(validIds[0]);
      const rb = recById.get(validIds[i]);
      if (!ra || !rb) continue;
      // Pojistka: nikdy neslučovat různé osoby ze stejného sčítacího roku a stejného domu (např. manžele/děti)
      if (ra.year === rb.year && ra.houseId === rb.houseId && ra.canonicalGiven !== rb.canonicalGiven) {
        continue;
      }
      union(validIds[0], validIds[i]);
    }
  }

  const rawCandidates = [];
  for (let i = 0; i < records.length; i++) {
    const a = records[i];
    if (!a.canonicalSurname || !a.canonicalGiven) continue;
    for (let j = i + 1; j < records.length; j++) {
      const b = records[j];
      if (a.year === b.year && a.houseId === b.houseId) continue;
      if (a.canonicalSurname !== b.canonicalSurname || a.canonicalGiven !== b.canonicalGiven) continue;

      const sameHouse = a.houseId && b.houseId && a.houseId === b.houseId;
      const bothBirthYears = a.birthYear && b.birthYear;
      const yearDiff = bothBirthYears ? Math.abs(a.birthYear - b.birthYear) : null;

      if (bothBirthYears && yearDiff <= 2 && sameHouse && a.year !== b.year) {
        union(a.id, b.id);
      } else if ((bothBirthYears && yearDiff <= 3) || sameHouse) {
        const reasons = [];
        if (sameHouse) reasons.push(`shodné čp. ${a.houseNumber}`);
        if (bothBirthYears) reasons.push(`věkový posun ±${yearDiff} r.`);
        if (!sameHouse && a.houseId && b.houseId) reasons.push(`přechod čp. ${a.houseNumber} ↔ čp. ${b.houseNumber}`);
        const isHomonym = sameHouse && bothBirthYears && yearDiff >= 15;
        rawCandidates.push({
          id: `pair_${a.id}_${b.id}`,
          recordIdA: a.id,
          recordIdB: b.id,
          score: sameHouse && !isHomonym ? 0.86 : 0.72,
          certainty: 'prob',
          relationType: isHomonym ? 'father_son_homonym' : (sameHouse ? 'possible_identity' : 'cross_house_candidate'),
          badgeLabel: isHomonym ? 'Možný otec / syn (jmenovci v domě)' : 'Kandidát na shodu identity (prob)',
          reasons
        });
      }
    }
  }

  // Sestavení clusterů
  const groups = new Map();
  for (const r of records) {
    const root = find(r.id);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(r);
  }

  const recordToCluster = new Map();
  const identityClusters = [];
  let clIdx = 0;

  for (const [, grp] of groups) {
    grp.sort((x, y) => x.year - y.year);
    clIdx++;
    const main = grp[grp.length - 1];
    const birthYears = grp.map(x => x.birthYear).filter(Boolean);
    const minY = Math.min(...grp.map(x => x.year));
    const maxY = Math.max(...grp.map(x => x.year));
    const yearsObserved = [...new Set(grp.map(x => x.year))].sort((a, b) => a - b);
    const housesVisited = [...new Set(grp.map(x => x.houseId).filter(Boolean))];
    const matchedCurated = people.find(p => (p.linkedCensusIds || []).some(cid => grp.some(g => g.id === cid)));

    const clusterId = matchedCurated ? matchedCurated.id : `cl_cp_${clIdx}`;
    grp.forEach(r => recordToCluster.set(r.id, clusterId));

    const catKey = matchedCurated ? matchedCurated.categoryKey : main.categoryKey;
    const arch = classifyArchetype(catKey, main.birthPlace, grp.length);
    const censusRecs = grp.filter(x => x.recordKind === 'census');
    const parishRecs = grp.filter(x => x.recordKind === 'parish');

    identityClusters.push({
      id: clusterId,
      isVerifiedProfile: Boolean(matchedCurated),
      curatedPersonId: matchedCurated ? matchedCurated.id : null,
      canonicalName: matchedCurated ? matchedCurated.name : main.fullName,
      displayName: matchedCurated ? matchedCurated.name : main.fullName,
      variantNames: [...new Set(grp.map(x => x.fullName))],
      canonicalKey: `${main.canonicalSurname}:${main.canonicalGiven}`,
      canonicalSurname: main.canonicalSurname,
      primaryLocality: 'České Petrovice',
      primaryHouseId: main.houseId,
      primaryHouseNumber: main.houseNumber,
      localitiesVisited: ['České Petrovice'],
      housesVisited,
      yearsObserved,
      birthYear: matchedCurated && matchedCurated.birthYear ? matchedCurated.birthYear : (birthYears[0] || null),
      birthDate: main.birthDate || '-',
      birthPlaceNorm: cleanPlace(main.birthPlace),
      lifeSpan: matchedCurated ? matchedCurated.lifeSpan : (birthYears[0] ? `*${birthYears[0]} (${minY === maxY ? minY : minY + '–' + maxY})` : `${minY === maxY ? minY : minY + '–' + maxY}`),
      minYear: minY,
      maxYear: maxY,
      spanYears: maxY - minY,
      recordIds: grp.map(x => x.id),
      recordCount: grp.length,
      recordsCount: grp.length,
      censusCount: censusRecs.length,
      parishCount: parishRecs.length,
      categoryKey: catKey,
      categoryLabel: matchedCurated ? matchedCurated.categoryLabel : main.categoryLabel,
      categoryIcon: matchedCurated ? matchedCurated.categoryIcon : main.categoryIcon,
      categoryBadgeClass: matchedCurated ? matchedCurated.categoryBadgeClass : main.categoryBadgeClass,
      archetypeKey: arch.key,
      archetypeLabel: arch.label,
      archetypeColor: arch.color,
      role: matchedCurated ? matchedCurated.role : main.occupation,
      primaryOccupation: main.occupation || '-',
      nationality: main.nationality || '',
      certainty: 'doc',
      matchReasons: matchedCurated ? ['Ručně ověřený životopisný profil'] : (grp.length > 1 ? [`Shoda jména + roku narození + čp. (${yearsObserved.join(', ')})`] : [])
    });
  }

  // Doplníme clusterIdA a clusterIdB na candidatePairs
  const candidatePairs = rawCandidates
    .map(c => ({
      ...c,
      clusterIdA: recordToCluster.get(c.recordIdA),
      clusterIdB: recordToCluster.get(c.recordIdB)
    }))
    .filter(c => c.clusterIdA && c.clusterIdB && c.clusterIdA !== c.clusterIdB);

  // 4. Graf vzájemných závislostí
  const hhByHouse = new Map();
  for (const cl of identityClusters) {
    const r = recById.get(cl.recordIds[cl.recordIds.length - 1]);
    if (r && (r.year === 1921 || r.year === 1869)) {
      if (!hhByHouse.has(r.houseId)) hhByHouse.set(r.houseId, []);
      hhByHouse.get(r.houseId).push({ cl, rec: r });
    }
  }

  const graphNodes = [];
  const graphEdges = [];
  const seenNodes = new Set();
  const seenEdges = new Set();

  function addGraphNode(node) {
    if (seenNodes.has(node.id)) return;
    seenNodes.add(node.id);
    graphNodes.push(node);
  }
  function addGraphEdge(source, target, edgeType, label, extra = {}) {
    const k = `${source}|${target}|${edgeType}`;
    if (seenEdges.has(k)) return;
    seenEdges.add(k);
    graphEdges.push({ id: `e_${graphEdges.length + 1}`, source, target, edgeType, label, ...extra });
  }

  for (const h of houses) {
    addGraphNode({
      id: `house_${h.id}`,
      nodeType: 'house',
      label: h.isHeritage && h.id === 'kostel_sv_petra_a_pavla' ? 'Kostel sv. Petra a Pavla' : `Čp. ${h.number}`,
      subtitle: h.sector || 'České Petrovice',
      houseId: h.id,
      houseNumber: h.number,
      sector: h.sector || ''
    });
  }

  const clanMap = new Map();
  for (const cl of identityClusters) {
    addGraphNode({
      id: cl.id,
      nodeType: 'person',
      label: cl.canonicalName,
      subtitle: `${cl.lifeSpan} • ${cl.role || cl.categoryLabel}`,
      birthYear: cl.birthYear,
      lifeSpan: cl.lifeSpan,
      categoryKey: cl.categoryKey,
      archetypeKey: cl.archetypeKey,
      archetypeColor: cl.archetypeColor,
      isVerified: cl.isVerifiedProfile,
      recordCount: cl.recordCount,
      primaryLocality: 'České Petrovice',
      primaryHouseId: cl.primaryHouseId,
      primaryHouseNumber: cl.primaryHouseNumber
    });

    if (cl.primaryHouseId) {
      addGraphEdge(cl.id, `house_${cl.primaryHouseId}`, 'RESIDES_AT', `bydlí čp. ${cl.primaryHouseNumber} (${cl.yearsObserved.join(', ')})`);
    }

    if (cl.canonicalSurname && cl.canonicalSurname.length >= 3) {
      const clanId = `clan_${cl.canonicalSurname}`;
      if (!clanMap.has(clanId)) {
        clanMap.set(clanId, true);
        addGraphNode({
          id: clanId,
          nodeType: 'clan',
          clanStem: cl.canonicalSurname,
          label: `Rod ${cl.canonicalSurname.charAt(0).toUpperCase() + cl.canonicalSurname.slice(1)}`,
          subtitle: 'Místní rodová větev'
        });
      }
      addGraphEdge(cl.id, clanId, 'BELONGS_TO_CLAN', 'rodová větev');
    }

    const lastRec = recById.get(cl.recordIds[cl.recordIds.length - 1]);
    if (lastRec && lastRec.birthPlace) {
      const origCity = cleanPlace(lastRec.birthPlace);
      if (origCity && !/^č\.?s\.?\s*petrovice|^čes\.\s*petrovice|^petersdorf|^"$/i.test(origCity)) {
        const origId = `orig_${normRaw(origCity).replace(/\s+/g, '_')}`;
        addGraphNode({ id: origId, nodeType: 'origin', label: origCity, subtitle: 'Obec původu / rodiště' });
        addGraphEdge(origId, cl.id, 'MIGRATED_BETWEEN', `původ: ${origCity}`);
      }
    }
    if (lastRec && lastRec.employer) {
      const empId = `emp_${normRaw(lastRec.employer).replace(/\s+/g, '_').slice(0, 40)}`;
      addGraphNode({ id: empId, nodeType: 'employer', label: lastRec.employer, subtitle: 'Zaměstnavatel / instituce' });
      addGraphEdge(cl.id, empId, 'WORKS_AT', lastRec.occupation || 'zaměstnání');
    }
  }

  const kinshipEdges = [];
  for (const [hid, members] of hhByHouse) {
    const head = members.find(m => /majitel|přednosta|hospodář/i.test(m.rec.relation)) || members[0];
    if (!head) continue;
    for (const m of members) {
      if (m.cl.id === head.cl.id) continue;
      const rl = (m.rec.relation || '').toLowerCase();
      let etype = 'HOUSEHOLD_DEPENDENCY';
      if (/manžel/.test(rl)) etype = 'SPOUSE_OF';
      else if (/syn|dcera|matka|otec|vnuč|vnuk/.test(rl)) etype = 'PARENT_OF';
      else if (/bratr|sestra/.test(rl)) etype = 'SIBLING_OF';
      addGraphEdge(head.cl.id, m.cl.id, etype, m.rec.relation || etype, { houseId: hid });
      kinshipEdges.push({ source: head.cl.id, target: m.cl.id, type: etype.toLowerCase(), edgeType: etype, label: m.rec.relation || etype });
    }
  }

  // Migrační toky
  const migrationFlows = [];
  const originMap = new Map();
  for (const r of records) {
    if (r.year === 1921 && r.birthPlace) {
      const pl = cleanPlace(r.birthPlace);
      if (pl && !/^č\.?s\.?\s*petrovice|^čes\.\s*petrovice|^petersdorf|^"$/i.test(pl)) {
        const key = `${pl} -> ${r.houseId}`;
        if (!originMap.has(key)) {
          originMap.set(key, { fromLabel: pl, toLabel: `České Petrovice čp. ${r.houseNumber}`, fromHouseId: null, toHouseId: r.houseId, fromYear: 1850, toYear: 1921, flowType: 'immigration', count: 0 });
        }
        originMap.get(key).count += 1;
      }
    }
  }
  originMap.forEach(v => migrationFlows.push(v));

  const clusterDataset = {
    generatedAt: new Date().toISOString(),
    municipality: 'České Petrovice (Böhmisch Petersdorf)',
    stats: {
      totalRecords: records.length,
      totalIdentityClusters: identityClusters.length,
      multiRecordClusters: identityClusters.filter(c => c.recordCount >= 2).length,
      verifiedProfilesCount: identityClusters.filter(c => c.isVerifiedProfile).length,
      candidatePairsCount: candidatePairs.length,
      probCandidatesCount: candidatePairs.length,
      migrationFlowsCount: migrationFlows.length,
      graphNodesCount: graphNodes.length,
      graphEdgesCount: graphEdges.length,
      kinshipAndHouseholdEdgesCount: kinshipEdges.length
    },
    records,
    identityClusters,
    candidatePairs,
    migrationFlows,
    migrationTransitions: migrationFlows,
    kinshipEdges,
    knowledgeGraph: {
      nodes: graphNodes,
      edges: graphEdges
    }
  };

  const linkedPeople = identityClusters
    .filter(cl => cl.isVerifiedProfile || cl.censusCount >= 2 || cl.recordCount >= 2)
    .map(cl => {
      const linkedCensusIds = cl.recordIds.filter(id => id.startsWith('cen_'));
      const parishEvents = cl.recordIds.filter(id => id.startsWith('mat')).map(id => {
        const mr = recById.get(id);
        return { year: mr.year, type: mr.sourceTypeLabel, date: mr.birthDate, place: `České Petrovice čp. ${mr.houseNumber}`, description: mr.fullName, scanFile: mr.scanFile, scanTitle: mr.scanTitle };
      });
      return {
        id: cl.id,
        isVerifiedProfile: cl.isVerifiedProfile,
        name: cl.canonicalName,
        canonicalName: cl.canonicalName,
        variantNames: cl.variantNames,
        birthYear: cl.birthYear,
        lifeSpan: cl.lifeSpan,
        locality: 'České Petrovice',
        houseNumber: cl.primaryHouseNumber,
        houseId: cl.primaryHouseId,
        housesVisited: cl.housesVisited,
        yearsObserved: cl.yearsObserved,
        censusCount: linkedCensusIds.length,
        parishCount: parishEvents.length,
        categoryKey: cl.categoryKey,
        categoryLabel: cl.categoryLabel,
        categoryIcon: cl.categoryIcon,
        categoryBadgeClass: cl.categoryBadgeClass,
        role: cl.role,
        certainty: 'doc',
        matchReasons: cl.matchReasons,
        linkedCensusIds,
        parishEvents
      };
    });

  const censusLinksData = {
    version: 'v2',
    generatedAt: new Date().toISOString(),
    stats: {
      linkedPeopleCount: linkedPeople.length,
      linkedRecordsCount: linkedPeople.reduce((s, p) => s + p.linkedCensusIds.length, 0),
      threePlusCount: linkedPeople.filter(p => p.linkedCensusIds.length >= 3).length,
      movedHousesCount: linkedPeople.filter(p => p.housesVisited.length > 1).length,
      probSuggestionsCount: candidatePairs.length
    },
    linkedPeople,
    candidateSuggestions: candidatePairs.slice(0, 200)
  };

  fs.writeFileSync(
    path.join(__dirname, 'data/cluster_dataset.js'),
    '// Automaticky generováno skriptem build_clusters.js – Laboratoř propojování osob České Petrovice\n' +
    `const clusterDataset = ${JSON.stringify(clusterDataset, null, 2)};\n`,
    'utf-8'
  );
  fs.writeFileSync(
    path.join(__dirname, 'data/census_links.js'),
    '// Automaticky generováno skriptem build_clusters.js – Sjednocené osoby České Petrovice\n' +
    `const censusLinksData = ${JSON.stringify(censusLinksData, null, 2)};\n`,
    'utf-8'
  );

  console.log(
    `Generated cluster_dataset.js & census_links.js: ${records.length} records, ` +
    `${identityClusters.length} clusters (${clusterDataset.stats.multiRecordClusters} multi-record), ` +
    `${candidatePairs.length} candidate pairs, ${graphNodes.length} graph nodes, ${graphEdges.length} graph edges.`
  );
}

main();
