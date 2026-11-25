/**
 * build_clusters.js
 * Sestaví heterogenní datový model pro laboratoř propojování osob (cluster.html)
 * a propojené obyvatele v rejstříku (obyvatele.html) výhradně pro obec
 * České Petrovice (Böhmisch Petersdorf):
 *   - 1591–1784 předfarní matriky 2-8336, 83-1, 83-2, 109-1, 109-2 (data/matriky_1591_1784.json, jen [doc])
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

function cleanObj(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null || v === '' || v === false) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    out[k] = v;
  }
  return out;
}

const GIVEN_MAP = {
  // Mužská jména
  johann: 'jan', johannes: 'jan', joannes: 'jan', ioannes: 'jan', ioan: 'jan', johan: 'jan', hans: 'jan', hanss: 'jan', hanns: 'jan', honz: 'jan', honza: 'jan', jan: 'jan', joan: 'jan', joh: 'jan',
  franz: 'frantisek', franciscus: 'frantisek', franc: 'frantisek', frantisek: 'frantisek', frantz: 'frantisek', frantissek: 'frantisek', fr: 'frantisek',
  joseph: 'josef', josephus: 'josef', josef: 'josef', jozef: 'josef', jos: 'josef',
  anton: 'antonin', antonius: 'antonin', antonin: 'antonin', antoni: 'antonin', ant: 'antonin',
  karl: 'karel', carolus: 'karel', carl: 'karel', karel: 'karel', car: 'karel',
  georg: 'jiri', georgius: 'jiri', gorg: 'jiri', gorge: 'jiri', girge: 'jiri', jurg: 'jiri', jurge: 'jiri', jirik: 'jiri', jiri: 'jiri', girzik: 'jiri', gyrzyk: 'jiri', girik: 'jiri', george: 'jiri', jorg: 'jiri', geor: 'jiri',
  wenzel: 'vaclav', wenceslaus: 'vaclav', wentzl: 'vaclav', wenzl: 'vaclav', vaclav: 'vaclav', waczlaw: 'vaclav', waclaw: 'vaclav', wenc: 'vaclav',
  paul: 'pavel', paulus: 'pavel', pavel: 'pavel', pawel: 'pavel',
  peter: 'petr', petrus: 'petr', petr: 'petr',
  heinrich: 'jindrich', henricus: 'jindrich', jindrich: 'jindrich', hinrich: 'jindrich', henr: 'jindrich',
  stephan: 'stepan', stephanus: 'stepan', stepan: 'stepan', steffan: 'stepan',
  wilhelm: 'vilem', guilielmus: 'vilem', vilem: 'vilem',
  christoph: 'krystof', christophorus: 'krystof', cristoff: 'krystof', christoff: 'krystof', krystof: 'krystof', krystoff: 'krystof', krystoph: 'krystof', krystop: 'krystof', krystow: 'krystof', christ: 'krystof',
  matthias: 'matej', matthaeus: 'matej', mathes: 'matej', mattes: 'matej', matthes: 'matej', matous: 'matej', matej: 'matej', mates: 'matej', matias: 'matej', matyas: 'matej', mathias: 'matej', mathe: 'matej', matys: 'matej', matis: 'matej', math: 'matej', matth: 'matej',
  michael: 'michal', michel: 'michal', michal: 'michal', michaell: 'michal', mich: 'michal',
  martin: 'martin', martinus: 'martin', merten: 'martin', mertin: 'martin', mertten: 'martin', mart: 'martin',
  caspar: 'kaspar', casparus: 'kaspar', kaspar: 'kaspar', gaspar: 'kaspar', kasparus: 'kaspar', casp: 'kaspar',
  melchior: 'melichar', melichar: 'melichar', melcher: 'melichar', melch: 'melichar',
  balthasar: 'baltazar', baltazar: 'baltazar', balzer: 'baltazar', baltzer: 'baltazar',
  andreas: 'ondrej', andres: 'ondrej', ondrej: 'ondrej', ondra: 'ondrej', andr: 'ondrej',
  jacob: 'jakub', jacobus: 'jakub', jakub: 'jakub', jakob: 'jakub', jac: 'jakub',
  thomas: 'tomas', tomas: 'tomas', thoma: 'tomas', toma: 'tomas', thom: 'tomas',
  simon: 'simon', symon: 'simon', szymon: 'simon',
  adam: 'adam', adamus: 'adam',
  elias: 'elias', eliass: 'elias',
  tobias: 'tobias', thobias: 'tobias',
  valentin: 'valentin', valentinus: 'valentin', walentin: 'valentin', valten: 'valentin', valtin: 'valentin', walten: 'valentin', val: 'valentin',
  laurentius: 'vavrinec', lorenz: 'vavrinec', lorentz: 'vavrinec', lorenc: 'vavrinec', vavrinec: 'vavrinec', wawrzinecz: 'vavrinec', laurenz: 'vavrinec', laur: 'vavrinec',
  christian: 'kristian', christianus: 'kristian', krystyan: 'kristian', krystian: 'kristian', kristian: 'kristian',
  ignatius: 'ignac', ignaz: 'ignac', ignac: 'ignac', ign: 'ignac',
  florianus: 'florian', florian: 'florian', florians: 'florian',
  jonas: 'jonas', jonass: 'jonas',
  daniel: 'daniel', danielis: 'daniel',
  david: 'david', dawid: 'david',
  zacharias: 'zacharias', zachariass: 'zacharias',
  gottfried: 'bohumir', godofredus: 'bohumir', gotfried: 'bohumir', gotfrid: 'bohumir',
  bartholomaeus: 'bartolomej', bartl: 'bartolomej', bartel: 'bartolomej', bartolomej: 'bartolomej',
  nicolaus: 'mikulas', nikolaus: 'mikulas', mikulas: 'mikulas', nickl: 'mikulas', nickel: 'mikulas', nic: 'mikulas',
  friedrich: 'bedrich', fridericus: 'bedrich', friederich: 'bedrich', bedrich: 'bedrich',
  gregor: 'rehor', gregorius: 'rehor', rehor: 'rehor',
  ferdinand: 'ferdinand', ferdinandus: 'ferdinand',
  dominicus: 'dominik', dominik: 'dominik',
  augustin: 'augustin', augustinus: 'augustin',
  sebastian: 'sebastian', sebastianus: 'sebastian', bastl: 'sebastian',
  urban: 'urban', urbanus: 'urban',
  philipp: 'filip', philippus: 'filip', filip: 'filip',
  bernard: 'bernard', bernardus: 'bernard', bernhard: 'bernard',
  abraham: 'abraham', abrahamus: 'abraham',
  gabriel: 'gabriel', gabrielis: 'gabriel',
  samuel: 'samuel', salomon: 'salomon', solomon: 'salomon',
  adolf: 'adolf', adolph: 'adolf',
  alois: 'alois', aloys: 'alois', aloisius: 'alois',
  emanuel: 'emanuel', emil: 'emil',
  ernst: 'arnost', arnost: 'arnost',
  leopold: 'leopold', leopoldus: 'leopold',
  // Ženská jména
  maria: 'marie', marie: 'marie', marye: 'marie', marya: 'marie', marige: 'marie', maryge: 'marie', maryja: 'marie', maryna: 'marie', marzena: 'marie', mar: 'marie',
  mariana: 'mariana', marianna: 'mariana', marjana: 'mariana', margana: 'mariana', maryana: 'mariana',
  anna: 'anna', ana: 'anna', hannah: 'anna', hanka: 'anna',
  theresia: 'terezie', therese: 'terezie', terezie: 'terezie', tereza: 'terezie', theres: 'terezie', ther: 'terezie', theresya: 'terezie',
  barbara: 'barbora', barbora: 'barbora', barba: 'barbora', barb: 'barbora', barborza: 'barbora',
  dorothea: 'dorota', dorota: 'dorota', dora: 'dorota', doroth: 'dorota', dor: 'dorota', dorotha: 'dorota', dorotka: 'dorota',
  catharina: 'katerina', katharina: 'katerina', katerina: 'katerina', katerzina: 'katerina', katarina: 'katerina', katerzyna: 'katerina', cath: 'katerina', kath: 'katerina', kathe: 'katerina',
  elisabeth: 'alzbeta', elisabetha: 'alzbeta', elizabeth: 'alzbeta', alzbeta: 'alzbeta', alsbeta: 'alzbeta', alzbetha: 'alzbeta', alzbietta: 'alzbeta', alssbeta: 'alzbeta', elisab: 'alzbeta', elis: 'alzbeta', eliska: 'alzbeta', liesel: 'alzbeta',
  susanna: 'zuzana', susana: 'zuzana', zuzana: 'zuzana', zuzanna: 'zuzana', zuzanka: 'zuzana', zuza: 'zuzana', susa: 'zuzana', sus: 'zuzana',
  rosina: 'rozina', rozina: 'rozina', ros: 'rozina', rozyna: 'rozina', rosyna: 'rozina',
  rosalia: 'rozalie', rosalie: 'rozalie', rozalie: 'rozalie', ruzena: 'ruzena',
  magdalena: 'magdalena', madlena: 'magdalena', magdalen: 'magdalena', mandalena: 'magdalena', magd: 'magdalena', madlenka: 'magdalena', magdlena: 'magdalena',
  margaretha: 'marketa', margareta: 'marketa', marketa: 'marketa', margaritha: 'marketa', margeta: 'marketa', markyta: 'marketa', marg: 'marketa',
  eva: 'eva', ewa: 'eva',
  helena: 'helena', alena: 'helena', hel: 'helena',
  johanna: 'jana', joanna: 'jana', johana: 'jana', jana: 'jana', janna: 'jana',
  juditha: 'judita', judita: 'judita', justina: 'justina',
  regina: 'regina', rezyna: 'regina', reg: 'regina',
  sabina: 'sabina',
  veronica: 'veronika', veronika: 'veronika', veron: 'veronika',
  ludmilla: 'ludmila', ludmila: 'ludmila', lidmila: 'ludmila', lidmilla: 'ludmila', ludm: 'ludmila',
  christina: 'kristina', kristina: 'kristina', krystyna: 'kristina',
  ursula: 'vorsila', vorsila: 'vorsila', worsila: 'vorsila', worsyla: 'vorsila', vorsyla: 'vorsila',
  martha: 'marta', marta: 'marta',
  clara: 'klara', klara: 'klara',
  apollonia: 'apolena', apolena: 'apolena', apolonia: 'apolena', apoll: 'apolena',
  sophia: 'zofie', zofie: 'zofie',
  cecilia: 'cecilie', caesilia: 'cecilie', cecilie: 'cecilie',
  agatha: 'agata', agata: 'agata',
  agnes: 'anezka', anezka: 'anezka',
  salomena: 'salomena', salome: 'salomena',
  brigitta: 'brigita', brigita: 'brigita', brig: 'brigita',
  emilie: 'emilie', emilia: 'emilie',
  hedwig: 'hedvika', hedvika: 'hedvika',
  mathilde: 'matylda', matilda: 'matylda', matylda: 'matylda',
  philomena: 'filomena', filomena: 'filomena',
  franziska: 'frantiska', francisca: 'frantiska', frantiska: 'frantiska',
  josepha: 'josefa', josefa: 'josefa', josefina: 'josefa',
  antonia: 'antonie', antonie: 'antonie',
  carolina: 'karolina', karolina: 'karolina',
  thecla: 'tekla', tekla: 'tekla',
  victoria: 'viktorie', viktorie: 'viktorie',
  walburga: 'valburga', valburga: 'valburga'
};

const GIVEN_VALUE_SET = new Set(Object.values(GIVEN_MAP));

const MALE_COMPOUND_SECOND = new Set([
  'jiri', 'krystof', 'josef', 'antonin', 'frantisek', 'karel', 'michal', 'jakub',
  'ondrej', 'kaspar', 'matej', 'vaclav', 'pavel', 'petr', 'ignac', 'bedrich',
  'tomas', 'vavrinec', 'jindrich', 'stepan', 'vilem', 'adam', 'martin', 'valentin', 'florian'
]);

const FEMALE_COMPOUND_SECOND = new Set([
  'anna', 'terezie', 'magdalena', 'rozalie', 'rozina', 'barbora', 'dorota',
  'katerina', 'alzbeta', 'zuzana', 'marketa', 'jana', 'ludmila', 'helena',
  'kristina', 'veronika', 'klara', 'frantiska', 'josefa', 'antonie', 'brigita', 'regina'
]);

const DISPLAY_GIVEN = {
  jan: 'Jan', frantisek: 'František', josef: 'Josef', antonin: 'Antonín', karel: 'Karel',
  jiri: 'Jiří', vaclav: 'Václav', pavel: 'Pavel', petr: 'Petr', jindrich: 'Jindřich',
  stepan: 'Štěpán', vilem: 'Vilém', krystof: 'Kryštof', matej: 'Matěj', michal: 'Michal',
  martin: 'Martin', kaspar: 'Kašpar', melichar: 'Melichar', baltazar: 'Baltazar',
  ondrej: 'Ondřej', jakub: 'Jakub', tomas: 'Tomáš', simon: 'Šimon', adam: 'Adam',
  elias: 'Eliáš', tobias: 'Tobiáš', valentin: 'Valentin', vavrinec: 'Vavřinec',
  kristian: 'Kristián', ignac: 'Ignác', florian: 'Florián', jonas: 'Jonáš',
  daniel: 'Daniel', david: 'David', zacharias: 'Zachariáš', bohumir: 'Bohumír',
  bartolomej: 'Bartoloměj', mikulas: 'Mikuláš', bedrich: 'Bedřich', rehor: 'Řehoř',
  ferdinand: 'Ferdinand', dominik: 'Dominik', augustin: 'Augustin', sebastian: 'Šebestián',
  urban: 'Urban', filip: 'Filip', bernard: 'Bernard', abraham: 'Abraham', gabriel: 'Gabriel',
  samuel: 'Samuel', salomon: 'Salomon', adolf: 'Adolf', alois: 'Alois', emanuel: 'Emanuel',
  emil: 'Emil', arnost: 'Arnošt', leopold: 'Leopold',
  marie: 'Marie', mariana: 'Mariana', anna: 'Anna', terezie: 'Terezie', barbora: 'Barbora',
  dorota: 'Dorota', katerina: 'Kateřina', alzbeta: 'Alžběta', zuzana: 'Zuzana',
  rozina: 'Rozina', rozalie: 'Rozálie', ruzena: 'Růžena', magdalena: 'Magdalena',
  marketa: 'Markéta', eva: 'Eva', helena: 'Helena', jana: 'Jana', judita: 'Judita',
  justina: 'Justina', regina: 'Regina', sabina: 'Sabina', veronika: 'Veronika',
  ludmila: 'Ludmila', kristina: 'Kristina', vorsila: 'Voršila', marta: 'Marta', klara: 'Klára',
  apolena: 'Apolena', zofie: 'Žofie', cecilie: 'Cecílie', agata: 'Agáta', anezka: 'Anežka',
  salomena: 'Salomena', brigita: 'Brigita', emilie: 'Emilie', hedvika: 'Hedvika',
  matylda: 'Matylda', filomena: 'Filomena', frantiska: 'Františka', josefa: 'Josefa',
  antonie: 'Antonie', karolina: 'Karolína', tekla: 'Tekla', viktorie: 'Viktorie', valburga: 'Valburga'
};

function formatGiven(g) {
  if (!g) return '';
  return g
    .split('_')
    .map(part => DISPLAY_GIVEN[part] || (part.charAt(0).toUpperCase() + part.slice(1)))
    .join(' ');
}

const SURNAME_CANON_MAP = {
  scholtz: 'scholz', scholz: 'scholz', ssolz: 'scholz', solc: 'scholz', ssolcz: 'scholz', scholcz: 'scholz',
  wagner: 'wagner', wognar: 'wagner', wogner: 'wagner', wagnar: 'wagner', wagnera: 'wagner',
  lux: 'lux', luks: 'lux', lucx: 'lux', luckx: 'lux', luxs: 'lux',
  esler: 'esler', essler: 'esler', eissler: 'esler', eysler: 'esler', exler: 'esler', eisner: 'esler', eissner: 'esler',
  adler: 'adler', adlar: 'adler', odler: 'adler',
  schroller: 'schroller', schroler: 'schroller', sroler: 'schroller', schrollerus: 'schroller', scholler: 'schroller',
  langer: 'langer', lang: 'langer', lange: 'langer',
  herman: 'herman', hermann: 'herman', herrmann: 'herman',
  urban: 'urban', wrban: 'urban',
  pacha: 'pacha', pache: 'pacha', pach: 'pacha',
  schmok: 'smok', smok: 'smok', schmuck: 'smok', smuk: 'smok',
  beier: 'baier', baier: 'baier', bayer: 'baier', peier: 'baier', peyer: 'baier', beyer: 'baier',
  kittner: 'kittner', kuttner: 'kittner', kytner: 'kittner', khitner: 'kittner', kitner: 'kittner', huttner: 'kittner',
  eppel: 'eppel', epl: 'eppel', eipel: 'eppel', eippel: 'eppel', eppl: 'eppel',
  vogel: 'vogel', wogl: 'vogel', fogl: 'vogel', fogel: 'vogel', vogl: 'vogel',
  weber: 'weber', waber: 'weber', wawr: 'weber', wabr: 'weber', webber: 'weber',
  steiner: 'steiner', steinar: 'steiner', steyner: 'steiner',
  hoffmann: 'hoffmann', hofmann: 'hoffmann', hofman: 'hoffmann', hoffman: 'hoffmann',
  reinelt: 'reinelt', reynelt: 'reinelt', rynelt: 'reinelt', reinel: 'reinelt',
  schon: 'schon', schoen: 'schon', ssen: 'schon',
  heinrich: 'heinrich', hinrich: 'heinrich', henrych: 'heinrich',
  schmidt: 'schmidt', schmid: 'schmidt', schmied: 'schmidt', smid: 'schmidt', smyt: 'schmidt',
  muller: 'muller', miller: 'muller', myler: 'muller',
  prause: 'prause', praus: 'prause', prauss: 'prause',
  seiffert: 'seifert', seifert: 'seifert', seyffert: 'seifert', seyfert: 'seifert',
  schubert: 'schubert', schuberth: 'schubert', subert: 'schubert',
  hensel: 'hensel', hansel: 'hensel', henseli: 'hensel',
  svoboda: 'svoboda', swoboda: 'svoboda',
  vogt: 'vogt', foit: 'vogt', fojt: 'vogt', voigt: 'vogt',
  krause: 'krause', kraus: 'krause', krauss: 'krause',
  elsner: 'elsner', elssner: 'elsner',
  geisler: 'geisler', geissler: 'geisler',
  nitsche: 'nitsche', nitsch: 'nitsche', nytsch: 'nitsche',
  zeisler: 'zeisler', zeissler: 'zeisler', ziesler: 'zeisler',
  alliger: 'aliger', aliger: 'aliger',
  walter: 'walter', valter: 'walter', walther: 'walter',
  hanig: 'hanig', hanich: 'hanig', haenig: 'hanig',
  hartmann: 'hartmann', hartman: 'hartmann',
  kluger: 'kluger', klugar: 'kluger',
  richter: 'richter', rychtar: 'richter',
  kristen: 'kristen', christen: 'kristen',
  weyman: 'weyman', wayman: 'weyman', weimann: 'weyman',
  rotter: 'rotter', roter: 'rotter',
  schreiber: 'schreiber', ssrayber: 'schreiber',
  katzer: 'katzer', kacer: 'katzer',
  ruprecht: 'ruprecht', rupprecht: 'ruprecht',
  klaper: 'klaper', klapper: 'klaper',
  franke: 'franke', frank: 'franke',
  jentschke: 'jentschke', jenschke: 'jentschke',
  titz: 'titz', tic: 'titz', tietz: 'titz'
};

const IN_ENDING_KEEP = new Set(['martin', 'valentin', 'augustin', 'severin', 'florian', 'kristian', 'konstantin', 'benjamin', 'justin']);

function canonicalGiven(tok) {
  const n = normRaw(tok).replace(/[^a-z]/g, '');
  if (!n) return '';
  return GIVEN_MAP[n] || n;
}

function isKnownGiven(tok) {
  const n = normRaw(tok).replace(/[^a-z]/g, '');
  return Boolean(n && (GIVEN_MAP[n] || GIVEN_VALUE_SET.has(n)));
}

function canonicalSurname(tok) {
  let s = normRaw(tok).replace(/[^a-z]/g, '');
  if (!s) return '';
  if (SURNAME_CANON_MAP[s]) return SURNAME_CANON_MAP[s];
  if (s.length > 4) s = s.replace(/(?:ova|owa)$/, '');
  if (s.length > 5 && !IN_ENDING_KEEP.has(s)) s = s.replace(/in$/, '');
  return SURNAME_CANON_MAP[s] || s;
}

function extractOccQualifier(rawText) {
  const blob = normRaw(rawText);
  if (!blob) return '';
  if (/teloniar|celnik|mautner/.test(blob)) return 'teloniarius';
  if (/pistor|pekar|becker/.test(blob)) return 'pistor';
  if (/molitor|mlynar|busenmuhl|busenmull|muhl|mull/.test(blob)) return 'molitor';
  if (/ludimag|cantor|kantor|rektor|preceptor|ucitel/.test(blob)) return 'cantor';
  if (/\bjudex\b|rychtar|richter|soltys/.test(blob)) return 'judex';
  return '';
}

function extractMotherGiven(motherStr) {
  const s = String(motherStr || '')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/^(?:nevěsta|matka|uxor|conjux|eheweib|manželka|žena)\s*:?\s*/i, '')
    .trim();
  const toks = s
    .split(/[\s,/&×+]+/)
    .map(t => t.trim())
    .filter(t => normRaw(t).replace(/[^a-z]/g, '').length >= 2);
  if (!toks.length) return '';
  const g1 = canonicalGiven(toks[0]);
  if ((g1 === 'marie' || g1 === 'anna') && toks.length >= 2) {
    const g2 = canonicalGiven(toks[1]);
    if (FEMALE_COMPOUND_SECOND.has(g2) && g2 !== g1) {
      return `${g1}_${g2}`;
    }
  }
  return g1;
}

function extractFatherGivenSurname(fatherStr, surnameNorm) {
  const s = String(fatherStr || '')
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\([^)]*\)/g, ' ')
    .replace(/^(?:ženich|otec|pater|nebožt\.?|neb\.?|def\.?|p\.\s*t\.?|d\.|dominus|pan|herr|meister|mistr)\s*:?\s*/i, '')
    .trim();
  const toks = s
    .split(/[\s,/]+/)
    .map(t => t.trim())
    .filter(t => normRaw(t).replace(/[^a-z]/g, '').length >= 1);

  let sn = String(surnameNorm || '').split('/')[0].trim();
  sn = sn.replace(/\([^)]*\)|\?/g, '').trim();
  let csur = sn ? canonicalSurname(sn) : '';
  let cgiven = '';

  if (toks.length > 0) {
    const t0g = canonicalGiven(toks[0]);
    const t0s = canonicalSurname(toks[0]);
    if (csur && t0s === csur && toks.length >= 2) {
      const g1 = canonicalGiven(toks[1]);
      if (g1 === 'jan' && toks.length >= 3 && MALE_COMPOUND_SECOND.has(canonicalGiven(toks[2]))) {
        cgiven = `jan_${canonicalGiven(toks[2])}`;
      } else {
        cgiven = g1;
      }
    } else if (isKnownGiven(toks[0])) {
      if (t0g === 'jan' && toks.length >= 3 && MALE_COMPOUND_SECOND.has(canonicalGiven(toks[1]))) {
        cgiven = `jan_${canonicalGiven(toks[1])}`;
      } else {
        cgiven = t0g;
      }
      if (!csur && toks.length >= 2) csur = canonicalSurname(toks[toks.length - 1]);
    } else if (toks.length >= 2) {
      const t1g = canonicalGiven(toks[1]);
      if (isKnownGiven(toks[1])) {
        if (t1g === 'jan' && toks.length >= 3 && MALE_COMPOUND_SECOND.has(canonicalGiven(toks[2]))) {
          cgiven = `jan_${canonicalGiven(toks[2])}`;
        } else {
          cgiven = t1g;
        }
        if (!csur) csur = canonicalSurname(toks[0]);
      } else {
        cgiven = t0g;
        if (!csur) csur = canonicalSurname(toks[toks.length - 1]);
      }
    }
  }
  return { given: cgiven, surname: csur };
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

const ARCHETYPES_META = {
  inteligence: { label: 'Duchovní, učitelé & pohraniční stráž', color: '#4338ca' },
  usedlici: { label: 'Starousedlíci & držitelé gruntů', color: '#047857' },
  sluzba: { label: 'Čeleď, služebnictvo & učedníci', color: '#b45309' },
  vymenek: { label: 'Výměnkáři & senioři obce', color: '#78716c' },
  imigranti: { label: 'Přistěhovalí z Kladska & vnitrozemí', color: '#0e7490' },
  predfarni_rodiny: { label: 'Předfarní rodiny (1591–1784)', color: '#9a3412' },
  kontinuita: { label: 'Vícegenerační kontinuita v obci', color: '#92400e' },
  tkalci_rodiny: { label: 'Tkalcovské a domkářské rodiny', color: '#0369a1' }
};

const BADGE_BY_KEY = {
  grunt: 'bg-emerald-100 text-emerald-950 border-emerald-300',
  vzdelanec: 'bg-indigo-100 text-indigo-950 border-indigo-300',
  celed: 'bg-amber-100 text-amber-950 border-amber-300',
  vymenek: 'bg-stone-100 text-stone-800 border-stone-300',
  ostatni: 'bg-slate-100 text-slate-800 border-slate-300',
  O: 'bg-amber-100 text-amber-950 border-amber-300',
  Z: 'bg-stone-200 text-stone-900 border-stone-300',
  N: 'bg-amber-50 text-amber-950 border-amber-200'
};

function classifyArchetypeKey(categoryKey, birthPlace, recordsCount, maxYear) {
  if (categoryKey === 'vzdelanec') return 'inteligence';
  if (categoryKey === 'grunt') return 'usedlici';
  if (categoryKey === 'celed') return 'sluzba';
  if (categoryKey === 'vymenek') return 'vymenek';
  if (birthPlace && !/^č\.?s\.?\s*petrovice|^čes\.\s*petrovice|^české petrovice|^petersdorf/i.test(cleanPlace(birthPlace))) {
    return 'imigranti';
  }
  if (recordsCount >= 2 && maxYear <= 1785) return 'predfarni_rodiny';
  if (recordsCount >= 2) return 'kontinuita';
  return 'tkalci_rodiny';
}

function main() {
  const houses = loadGlobalVar('data/houses.js', 'housesData') || [];
  const people = loadGlobalVar('data/people.js', 'peopleData') || [];
  const registry = loadGlobalVar('data/census_registry.js', 'censusRegistryData') || [];
  const domy = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/domy_1771_1921.json'), 'utf-8'));
  const matriky = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/matriky_1591_1784.json'), 'utf-8'));

  const ARON_23_1 = 'https://aron.vychodoceskearchivy.cz/apu/89941bc0-5008-4be2-8789-bb98a944a912';
  const aronUrlsBySign = { '23-1': ARON_23_1 };
  const volBySign = new Map();
  for (const v of matriky.volumes || []) {
    volBySign.set(v.sign, v);
    if (v.permalink) aronUrlsBySign[v.sign] = v.permalink;
  }

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
      sourceTypeLabel: `Sčítání ${r.censusYear}`,
      year: r.censusYear,
      fullName: r.fullName,
      canonicalSurname: tk.surname,
      canonicalGiven: tk.given,
      motherGiven: '',
      childName: '',
      occQualifier: '',
      parishSign: String(r.censusYear),
      scan: null,
      eventType: 'census',
      aronUrl: r.originalUrl || '',
      birthDate: r.birthDate || '-',
      birthYear: r.birthYear || null,
      birthPlace: r.birthPlace || '',
      houseId: r.houseId,
      houseNumber: r.houseNumber,
      relation: r.relation || '-',
      occupation: r.occupation || '-',
      employer: r.employer || '',
      nationality: r.nationality || '',
      scanFile: r.scanFile || '',
      categoryKey: r.categoryKey || 'ostatni',
      categoryLabel: r.categoryLabel || '',
      categoryIcon: r.categoryIcon || '👤'
    };
    records.push(rec);
    recById.set(rec.id, rec);
  }

  // 2. Matriční záznamy 23-1 (1771–1784) z data/domy_1771_1921.json
  let mat23Counter = 0;
  for (const dh of domy.houses || []) {
    const entries = (dh.earliest_1771_1784 && dh.earliest_1771_1784.as_alte_entries) || [];
    for (const e of entries) {
      if (!e.father) continue;
      mat23Counter++;
      const yr = Number((e.date || '1771').slice(0, 4)) || 1775;
      const neueCp = e.repertorium_neue || dh.cp;
      const fg = extractFatherGivenSurname(e.father, '');
      const mg = extractMotherGiven(e.mother);
      const occ = extractOccQualifier(`${e.father || ''} ${e.status || ''}`);
      const id = `mat23_1_${mat23Counter}`;
      const isGrunt = /rust|bauer|colon/i.test(e.status || '');
      const rec = {
        id,
        recordKind: 'parish',
        sourceTypeLabel: 'Matrika N 23-1',
        year: yr,
        fullName: `${e.father}${e.mother ? ` & ${e.mother}` : ''} (dítě ${e.child || '-'})`,
        canonicalSurname: fg.surname,
        canonicalGiven: fg.given,
        motherGiven: mg,
        childName: e.child || '',
        occQualifier: occ,
        parishSign: '23-1',
        scan: null,
        eventType: 'N',
        aronUrl: ARON_23_1,
        birthDate: e.date || String(yr),
        birthYear: null,
        birthPlace: '',
        houseId: `cp${neueCp}`,
        houseNumber: String(neueCp),
        relation: `Otec / ${e.status || 'usedlík'} (st. čp. ${dh.cp})`,
        occupation: e.status || 'usedlík',
        employer: '',
        nationality: '',
        scanFile: 'assets/archives/matrika_23_1_1771_cp.jpg',
        scanTitle: `Matrika 23-1 (${e.date}) – st. čp. ${dh.cp} -> n. čp. ${neueCp}`,
        categoryKey: isGrunt ? 'grunt' : 'ostatni',
        categoryLabel: isGrunt ? 'Držitel gruntu / Sedlák' : 'Rodina z matriky 23-1',
        categoryIcon: isGrunt ? '🏡' : '📜'
      };
      records.push(rec);
      recById.set(id, rec);
    }
  }

  // 3. Předfarní matriky 1591–1784 (2-8336, 83-1, 83-2, 109-1, 109-2) — přísně pouze [doc]!
  for (const e of matriky.entries || []) {
    if (e.epistemic !== 'doc') continue;
    const vol = volBySign.get(e.sign);
    const yr = Number(e.year) || 1700;
    const rt = e.record_type || 'N';
    const aronUrl = e.aron_url || (vol && vol.permalink) || '';
    const scanFile = e.scan_file || '';

    let cGiven = '';
    let cSurname = '';
    let mg = '';
    let eventType = rt;
    let occ = '';
    let fullName = '';
    let childName = '';
    let relation = '';

    if (rt === 'N') {
      const parsed = extractFatherGivenSurname(e.father, e.surname_norm);
      cGiven = parsed.given;
      cSurname = parsed.surname;
      mg = extractMotherGiven(e.mother);
      // occQualifier výhradně z e.father (chrání před záměnou povolání z kmotrů)
      occ = extractOccQualifier(e.father || '');
      childName = e.subject || '';
      const fDisp = e.father || e.surname_norm || '?';
      fullName = `${fDisp}${e.mother ? ` & ${e.mother}` : ''} (křest: ${childName || '-'})`;
      relation = `Rodiče křtěného (${e.sign})`;
    } else if (rt === 'O') {
      const subj = String(e.subject || '');
      let parsed = extractFatherGivenSurname(e.father, e.surname_norm);
      mg = extractMotherGiven(e.mother);
      if (subj.includes('×') || subj.includes('&')) {
        const parts = subj.split(/[×&]/);
        const gPart = parts[0].trim();
        const bPart = parts.slice(1).join(' ').trim();
        const p2 = extractFatherGivenSurname(gPart, e.surname_norm);
        const mg2 = extractMotherGiven(bPart);
        if (p2.given && p2.surname) parsed = p2;
        if (mg2) mg = mg2;
      }
      cGiven = parsed.given;
      cSurname = parsed.surname;
      occ = extractOccQualifier(e.father || '');
      fullName = `${subj || e.father || '?'} (sňatek)`;
      relation = `Snoubenci (${e.sign})`;
    } else if (rt === 'Z') {
      const fRaw = String(e.father || '').trim();
      const subj = String(e.subject || '');
      if (fRaw) {
        eventType = 'Z_rel';
        const parsed = extractFatherGivenSurname(fRaw, e.surname_norm);
        cGiven = parsed.given;
        cSurname = parsed.surname;
        occ = extractOccQualifier(fRaw);
        if (/manželka|žena|uxor|vdova/i.test(subj)) {
          mg = extractMotherGiven(subj.split(',')[0]);
        }
        fullName = `${fRaw} – úmrtí: ${subj}`;
        relation = `Pohřeb v rodině (${e.sign})`;
      } else {
        eventType = 'Z_self';
        const headSubj = subj.split(',')[0].trim();
        const parsed = extractFatherGivenSurname(headSubj, e.surname_norm);
        cGiven = parsed.given;
        cSurname = parsed.surname;
        occ = extractOccQualifier(subj);
        fullName = `${subj || e.surname_norm || '?'} (úmrtí)`;
        relation = `Pohřeb (${e.sign})`;
      }
    }

    const typeTitle = rt === 'N' ? 'křest' : (rt === 'O' ? 'sňatek' : 'pohřeb');
    const occLabelMap = {
      teloniarius: 'celník (Teloniarius)', pistor: 'pekař (Pistor)',
      molitor: 'mlynář (Molitor)', cantor: 'kantor / rektor', judex: 'rychtář / šoltys'
    };
    const isGrunt = /judex|molitor|teloniar/i.test(occ) || /rust|bauer|sedlák/i.test(e.transcription || '');

    const rec = {
      id: e.id,
      recordKind: 'parish',
      sourceTypeLabel: `Matrika ${rt} ${e.sign}`,
      year: yr,
      fullName,
      canonicalSurname: cSurname,
      canonicalGiven: cGiven,
      motherGiven: mg,
      childName,
      occQualifier: occ,
      parishSign: e.sign,
      scan: e.scan || null,
      eventType,
      aronUrl,
      birthDate: e.date_iso || e.date_raw || String(yr),
      birthYear: null,
      birthPlace: '',
      houseId: null,
      houseNumber: '',
      relation,
      occupation: occLabelMap[occ] || `${typeTitle} (${e.parish || e.sign})`,
      employer: '',
      nationality: '',
      scanFile,
      scanTitle: `${e.sign} sn. ${e.scan || '-'} (${e.date_raw || yr})`,
      categoryKey: isGrunt ? 'grunt' : (rt === 'O' || rt === 'Z' ? rt : 'N'),
      categoryLabel: `Matrika ${e.sign} (${typeTitle})`,
      categoryIcon: rt === 'O' ? '💍' : (rt === 'Z' ? '🕯️' : '📜')
    };
    records.push(rec);
    recById.set(rec.id, rec);
  }

  // 4. Union-Find sjednocování identit [doc]
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

  // 4a) Ručně ověřené biografické profily z people.js
  for (const p of people) {
    const validIds = (p.linkedCensusIds || []).filter(id => recById.has(id));
    for (let i = 1; i < validIds.length; i++) {
      const ra = recById.get(validIds[0]);
      const rb = recById.get(validIds[i]);
      if (!ra || !rb) continue;
      if (ra.year === rb.year && ra.houseId === rb.houseId && ra.canonicalGiven !== rb.canonicalGiven) continue;
      union(validIds[0], validIds[i]);
    }
  }

  // 4b) Přes-roční sčítání (1869 <-> 1921): jen odlišné roky, shodné čp. a věk ±2 r.
  const censusRecsAll = records.filter(r => r.recordKind === 'census');
  for (let i = 0; i < censusRecsAll.length; i++) {
    const a = censusRecsAll[i];
    if (!a.canonicalSurname || !a.canonicalGiven || !a.birthYear || !a.houseId) continue;
    for (let j = i + 1; j < censusRecsAll.length; j++) {
      const b = censusRecsAll[j];
      if (a.year === b.year) continue;
      if (a.houseId !== b.houseId) continue;
      if (a.canonicalSurname !== b.canonicalSurname || a.canonicalGiven !== b.canonicalGiven) continue;
      if (!b.birthYear || Math.abs(a.birthYear - b.birthYear) > 2) continue;
      union(a.id, b.id);
    }
  }

  // 4c) Matriční páry N + O napříč 1591–1784 (6 knih)
  const parishNO = records.filter(
    r => r.recordKind === 'parish' && (r.eventType === 'N' || r.eventType === 'O') && r.canonicalSurname && r.canonicalGiven && r.motherGiven
  );
  const byCoupleKey = new Map();
  for (const r of parishNO) {
    const k = `${r.canonicalSurname}|${r.canonicalGiven}|${r.motherGiven}`;
    if (!byCoupleKey.has(k)) byCoupleKey.set(k, []);
    byCoupleKey.get(k).push(r);
  }

  const coupleClusters = [];
  for (const [key, grp] of byCoupleKey) {
    grp.sort((a, b) => (a.year - b.year) || ((a.eventType === 'O' ? 0 : 1) - (b.eventType === 'O' ? 0 : 1)));
    const subs = [];
    for (const rec of grp) {
      let placed = false;
      for (const sub of subs) {
        const minY = Math.min(...sub.map(x => x.year));
        const maxY = Math.max(...sub.map(x => x.year));
        if (rec.year - maxY > 16 || rec.year - minY > 26) continue;
        if (rec.eventType === 'O') {
          if (sub.some(x => x.eventType === 'O')) continue;
          if (sub.some(x => x.eventType === 'N' && rec.year > x.year + 1)) continue;
        }
        const subOccs = new Set(sub.map(x => x.occQualifier).filter(Boolean));
        if (rec.occQualifier && subOccs.size && !subOccs.has(rec.occQualifier)) continue;
        const subCps = new Set(sub.map(x => x.houseNumber).filter(Boolean));
        if (rec.houseNumber && subCps.size && !subCps.has(rec.houseNumber)) continue;

        sub.push(rec);
        placed = true;
        break;
      }
      if (!placed) subs.push([rec]);
    }
    const [sur, giv, mg] = key.split('|');
    for (const sub of subs) {
      for (let i = 1; i < sub.length; i++) union(sub[0].id, sub[i].id);
      coupleClusters.push({ sur, giv, mg, recs: sub });
    }
  }

  // 4d) Bezpečné připojení rodinných pohřbů (Z_rel)
  const parishZRel = records.filter(r => r.recordKind === 'parish' && r.eventType === 'Z_rel' && r.canonicalSurname && r.canonicalGiven);
  for (const z of parishZRel) {
    const cands = coupleClusters.filter(cl => {
      if (cl.sur !== z.canonicalSurname || cl.giv !== z.canonicalGiven) return false;
      if (z.motherGiven && cl.mg !== z.motherGiven) return false;
      const minY = Math.min(...cl.recs.map(x => x.year));
      const maxY = Math.max(...cl.recs.map(x => x.year));
      if (z.year < minY - 2 || z.year > maxY + 10) return false;
      const occs = new Set(cl.recs.map(x => x.occQualifier).filter(Boolean));
      if (z.occQualifier && occs.size && !occs.has(z.occQualifier)) return false;
      return true;
    });
    if (cands.length === 1) {
      union(cands[0].recs[0].id, z.id);
      cands[0].recs.push(z);
    }
  }

  // 4e) Bezpečné připojení křtů bez zapsané matky (2-8336 aj.)
  const parishNoMgN = records.filter(r => r.recordKind === 'parish' && r.eventType === 'N' && r.canonicalSurname && r.canonicalGiven && !r.motherGiven);
  const leftoverNoMg = new Map();
  for (const r of parishNoMgN) {
    const cands = coupleClusters.filter(cl => {
      if (cl.sur !== r.canonicalSurname || cl.giv !== r.canonicalGiven) return false;
      const minY = Math.min(...cl.recs.map(x => x.year));
      const maxY = Math.max(...cl.recs.map(x => x.year));
      if (r.year < minY - 4 || r.year > maxY + 4) return false;
      const occs = new Set(cl.recs.map(x => x.occQualifier).filter(Boolean));
      if (r.occQualifier && occs.size && !occs.has(r.occQualifier)) return false;
      const cps = new Set(cl.recs.map(x => x.houseNumber).filter(Boolean));
      if (r.houseNumber && cps.size && !cps.has(r.houseNumber)) return false;
      return true;
    });
    if (cands.length === 1) {
      union(cands[0].recs[0].id, r.id);
      cands[0].recs.push(r);
    } else {
      const fk = `${r.canonicalSurname}|${r.canonicalGiven}`;
      if (!leftoverNoMg.has(fk)) leftoverNoMg.set(fk, []);
      leftoverNoMg.get(fk).push(r);
    }
  }
  for (const [, grp] of leftoverNoMg) {
    grp.sort((a, b) => a.year - b.year);
    const subs = [];
    for (const rec of grp) {
      let placed = false;
      for (const sub of subs) {
        const minY = Math.min(...sub.map(x => x.year));
        const maxY = Math.max(...sub.map(x => x.year));
        if (rec.year - maxY > 10 || rec.year - minY > 20) continue;
        const subOccs = new Set(sub.map(x => x.occQualifier).filter(Boolean));
        if (rec.occQualifier && subOccs.size && !subOccs.has(rec.occQualifier)) continue;
        const subCps = new Set(sub.map(x => x.houseNumber).filter(Boolean));
        if (rec.houseNumber && subCps.size && !subCps.has(rec.houseNumber)) continue;
        sub.push(rec);
        placed = true;
        break;
      }
      if (!placed) subs.push([rec]);
    }
    for (const sub of subs) {
      for (let i = 1; i < sub.length; i++) union(sub[0].id, sub[i].id);
    }
  }

  // 5. Sestavení clusterů
  const groups = new Map();
  for (const r of records) {
    const root = find(r.id);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root).push(r);
  }

  const fullClusters = [];
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
    const censusRecs = grp.filter(x => x.recordKind === 'census');
    const parishRecs = grp.filter(x => x.recordKind === 'parish');
    const sourcesUsed = [...new Set(grp.map(x => x.parishSign).filter(Boolean))];
    const volumesCount = sourcesUsed.length;
    const isCrossVolumeBridge = volumesCount >= 2;
    const marriageRec = grp.find(x => x.eventType === 'O');
    const marriageYear = marriageRec ? marriageRec.year : null;
    const motherGivens = [...new Set(grp.map(x => x.motherGiven).filter(Boolean))];
    const spouseGiven = motherGivens.length === 1 ? formatGiven(motherGivens[0]) : '';
    const childrenNames = [...new Set(parishRecs.filter(x => x.eventType === 'N' && x.childName).map(x => x.childName))];

    const primaryHouseRec = [...grp].reverse().find(x => x.houseId) || main;
    const primaryHouseId = primaryHouseRec.houseId || null;
    const primaryHouseNumber = primaryHouseRec.houseNumber || '';
    const catKey = matchedCurated ? matchedCurated.categoryKey : main.categoryKey;
    const archKey = classifyArchetypeKey(catKey, main.birthPlace, grp.length, maxY);

    let canonicalName = main.fullName;
    if (matchedCurated) {
      canonicalName = matchedCurated.name;
    } else if (parishRecs.length && censusRecs.length === 0) {
      const fSur = main.canonicalSurname
        ? main.canonicalSurname.charAt(0).toUpperCase() + main.canonicalSurname.slice(1)
        : '';
      const fGiv = formatGiven(main.canonicalGiven);
      if (fGiv && fSur && spouseGiven) canonicalName = `${fGiv} ${fSur} & ${spouseGiven}`;
      else if (fGiv && fSur && grp.length >= 2) canonicalName = `${fGiv} ${fSur}`;
    }

    const occSet = [...new Set(grp.map(x => x.occQualifier).filter(Boolean))];
    const reasons = [];
    if (matchedCurated) reasons.push('Ručně ověřený životopisný profil');
    else if (censusRecs.length >= 2) reasons.push(`Shoda napříč sčítáními (${yearsObserved.join(' ↔ ')})`);
    else if (grp.length >= 2) {
      const parts = [];
      if (spouseGiven) parts.push(`rodičovský pár (${spouseGiven})`);
      if (marriageYear) parts.push(`sňatek ${marriageYear} → křty`);
      if (parishRecs.some(x => x.eventType === 'Z_rel')) parts.push(`připojen rodinný pohřeb`);
      if (primaryHouseNumber && parishRecs.some(x => !x.houseNumber)) parts.push(`napojeno čp. ${primaryHouseNumber} z 23-1`);
      else if (isCrossVolumeBridge) parts.push(`přes ${volumesCount} matriky (${sourcesUsed.join(', ')})`);
      if (occSet.length) parts.push(`profese: ${occSet.join('/')}`);
      reasons.push(parts.length ? parts.join(' • ') : `Shoda jména (${minY}–${maxY})`);
    }

    const lifeSpan = matchedCurated
      ? matchedCurated.lifeSpan
      : (birthYears[0]
          ? `*${birthYears[0]} (${minY === maxY ? minY : minY + '–' + maxY})`
          : `${minY === maxY ? minY : minY + '–' + maxY}`);

    fullClusters.push({
      id: clusterId,
      isVerifiedProfile: Boolean(matchedCurated),
      canonicalName,
      variantNames: [...new Set(grp.map(x => x.fullName))].slice(0, 10),
      canonicalSurname: main.canonicalSurname,
      canonicalGiven: main.canonicalGiven,
      motherGiven: motherGivens.length === 1 ? motherGivens[0] : '',
      spouseGiven,
      childrenNames: childrenNames.slice(0, 12),
      marriageYear,
      occQualifiers: occSet,
      sourcesUsed,
      volumesCount,
      isCrossVolumeBridge,
      primaryHouseId,
      primaryHouseNumber,
      housesVisited,
      yearsObserved,
      birthYear: matchedCurated && matchedCurated.birthYear ? matchedCurated.birthYear : (birthYears[0] || null),
      lifeSpan,
      minYear: minY,
      maxYear: maxY,
      spanYears: maxY - minY,
      recordIds: grp.map(x => x.id),
      recordCount: grp.length,
      censusCount: censusRecs.length,
      parishCount: parishRecs.length,
      categoryKey: catKey,
      categoryLabel: matchedCurated ? matchedCurated.categoryLabel : (isCrossVolumeBridge ? `Most přes ${volumesCount} prameny` : main.categoryLabel),
      categoryIcon: matchedCurated ? matchedCurated.categoryIcon : (isCrossVolumeBridge ? '🌉' : main.categoryIcon),
      categoryBadgeClass: matchedCurated ? matchedCurated.categoryBadgeClass : (BADGE_BY_KEY[catKey] || BADGE_BY_KEY.ostatni),
      archetypeKey: archKey,
      role: matchedCurated ? matchedCurated.role : (spouseGiven ? `Rodina (${childrenNames.length} dětí v matrikách)` : main.occupation),
      matchReasons: reasons
    });
  }

  fullClusters.sort((a, b) =>
    (Number(b.isVerifiedProfile) - Number(a.isVerifiedProfile)) ||
    (Number(b.isCrossVolumeBridge) - Number(a.isCrossVolumeBridge)) ||
    (b.recordCount - a.recordCount) ||
    (a.minYear - b.minYear)
  );

  // 6. Kandidáti k ruční revizi (max 250)
  const rawCandPairs = [];
  const clByFather = new Map();
  for (const cl of fullClusters) {
    if (!cl.canonicalSurname || !cl.canonicalGiven) continue;
    const fk = `${cl.canonicalSurname}|${cl.canonicalGiven}`;
    if (!clByFather.has(fk)) clByFather.set(fk, []);
    clByFather.get(fk).push(cl);
  }

  for (const [, clist] of clByFather) {
    if (clist.length < 2) continue;
    clist.sort((a, b) => a.minYear - b.minYear);
    for (let i = 0; i < clist.length; i++) {
      const a = clist[i];
      for (let j = i + 1; j < clist.length; j++) {
        const b = clist[j];
        if (a.id === b.id) continue;

        if (a.censusCount > 0 && b.censusCount > 0) {
          if (a.yearsObserved.some(y => b.yearsObserved.includes(y))) continue;
          if (!a.birthYear || !b.birthYear) continue;
          const yd = Math.abs(a.birthYear - b.birthYear);
          if (yd <= 3) {
            const sameH = a.primaryHouseId && b.primaryHouseId && a.primaryHouseId === b.primaryHouseId;
            rawCandPairs.push({
              id: `pair_${a.id}_${b.id}`,
              clusterIdA: a.id,
              clusterIdB: b.id,
              recordIdA: a.recordIds[a.recordIds.length - 1],
              recordIdB: b.recordIds[b.recordIds.length - 1],
              score: sameH ? 0.90 : 0.78,
              certainty: 'prob',
              relationType: sameH ? 'possible_identity' : 'cross_house_candidate',
              badgeLabel: sameH ? 'Shoda napříč sčítáními (prob)' : 'Možný přesun mezi domy (sčítání)',
              reasons: [`rozdíl věku ±${yd} r.`, sameH ? `shodné čp. ${a.primaryHouseNumber}` : `čp. ${a.primaryHouseNumber || '-'} ↔ čp. ${b.primaryHouseNumber || '-'}`],
              weight: a.recordCount + b.recordCount
            });
          }
          continue;
        }

        if (a.parishCount === 0 || b.parishCount === 0) continue;
        if (a.recordCount === 1 && b.recordCount === 1) {
          const ra = recById.get(a.recordIds[0]);
          const rb = recById.get(b.recordIds[0]);
          if (ra && rb && ra.eventType === 'Z_self' && rb.eventType === 'Z_self') continue;
        }

        if (a.occQualifiers.length && b.occQualifiers.length) {
          const overlapOcc = a.occQualifiers.some(o => b.occQualifiers.includes(o));
          if (!overlapOcc) continue;
        }
        if (a.primaryHouseNumber && b.primaryHouseNumber && a.primaryHouseNumber !== b.primaryHouseNumber) continue;

        const gap = b.minYear - a.maxYear;
        const span = Math.max(a.maxYear, b.maxYear) - Math.min(a.minYear, b.minYear);
        if (gap < -3 || gap > 18 || span > 38) continue;

        const sameH = Boolean(a.primaryHouseNumber && b.primaryHouseNumber && a.primaryHouseNumber === b.primaryHouseNumber);
        let relationType = 'possible_remarriage';
        let badgeLabel = 'Možný 2. sňatek / varianta jména matky';
        let score = 0.74;
        if (a.motherGiven && b.motherGiven && a.motherGiven === b.motherGiven) {
          relationType = gap >= 16 ? 'father_son_homonym' : 'possible_identity';
          badgeLabel = gap >= 16 ? 'Možný otec / syn (jmenovci)' : 'Shodný pár s delší mezerou';
          score = gap >= 16 ? 0.68 : 0.84;
        } else if (!a.motherGiven || !b.motherGiven) {
          relationType = 'missing_mother_match';
          badgeLabel = 'Shoda otce (chybějící jméno matky)';
          score = 0.77;
        }
        if (sameH) score = Math.min(0.95, score + 0.08);
        if (gap >= 0 && gap <= 5) score = Math.min(0.95, score + 0.04);

        const reasons = [
          `období ${a.minYear}–${a.maxYear} vs. ${b.minYear}–${b.maxYear} (mezera ${gap} r.)`,
          a.spouseGiven || b.spouseGiven ? `matky: ${a.spouseGiven || '?'} vs. ${b.spouseGiven || '?'}` : 'bez jména matky'
        ];
        if (sameH) reasons.push(`shodné čp. ${a.primaryHouseNumber}`);

        rawCandPairs.push({
          id: `pair_${a.id}_${b.id}`,
          clusterIdA: a.id,
          clusterIdB: b.id,
          recordIdA: a.recordIds[a.recordIds.length - 1],
          recordIdB: b.recordIds[0],
          score: Number(score.toFixed(2)),
          certainty: 'prob',
          relationType,
          badgeLabel,
          reasons,
          weight: a.recordCount + b.recordCount
        });
      }
    }
  }

  rawCandPairs.sort((a, b) => (b.score - a.score) || (b.weight - a.weight));
  const candidatePairs = rawCandPairs.slice(0, 250).map(({ weight, ...rest }) => rest);

  // Interní audit kvality před zápisem
  let sameYearCensusPairs = 0;
  for (const p of candidatePairs) {
    const ra = recById.get(p.recordIdA);
    const rb = recById.get(p.recordIdB);
    if (ra && rb && ra.recordKind === 'census' && rb.recordKind === 'census' && ra.year === rb.year) sameYearCensusPairs++;
  }
  const occConflictClusters = fullClusters.filter(c => c.occQualifiers.length > 1).length;
  const multiCpParishClusters = fullClusters.filter(c => c.housesVisited.length > 1 && c.censusCount === 0).length;
  const longSpanNonVerified = fullClusters.filter(c => c.spanYears > 36 && !c.isVerifiedProfile).length;
  const verifiedProfilesCount = fullClusters.filter(c => c.isVerifiedProfile).length;

  if (sameYearCensusPairs !== 0 || occConflictClusters !== 0 || multiCpParishClusters !== 0 || longSpanNonVerified !== 0 || verifiedProfilesCount !== 11) {
    throw new Error(
      `Audit selhal: sameYearCensus=${sameYearCensusPairs}, occConflict=${occConflictClusters}, multiCpParish=${multiCpParishClusters}, longSpan=${longSpanNonVerified}, verified=${verifiedProfilesCount}`
    );
  }

  // 7. Graf vzájemných závislostí (kompaktní uzly a hrany)
  const hhByHouse = new Map();
  for (const cl of fullClusters) {
    const r = recById.get(cl.recordIds[cl.recordIds.length - 1]);
    if (r && (r.year === 1921 || r.year === 1869) && r.houseId) {
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
    graphNodes.push(cleanObj(node));
  }
  function addGraphEdge(source, target, edgeType, label) {
    const k = `${source}|${target}|${edgeType}`;
    if (seenEdges.has(k)) return;
    seenEdges.add(k);
    graphEdges.push({ source, target, edgeType, label });
  }

  for (const h of houses) {
    addGraphNode({
      id: `house_${h.id}`,
      nodeType: 'house',
      label: h.isHeritage && h.id === 'kostel_sv_petra_a_pavla' ? 'Kostel sv. Petra a Pavla' : `Čp. ${h.number}`,
      subtitle: h.sector || 'České Petrovice'
    });
  }

  const clanMap = new Map();
  for (const cl of fullClusters) {
    addGraphNode({
      id: cl.id,
      nodeType: 'person',
      label: cl.canonicalName,
      subtitle: `${cl.lifeSpan} • ${cl.role || cl.categoryLabel}`
    });

    if (cl.primaryHouseId) {
      addGraphEdge(cl.id, `house_${cl.primaryHouseId}`, 'RESIDES_AT', `bydlí čp. ${cl.primaryHouseNumber} (${cl.minYear}–${cl.maxYear})`);
    }

    if (cl.canonicalSurname && cl.canonicalSurname.length >= 3) {
      const clanId = `clan_${cl.canonicalSurname}`;
      if (!clanMap.has(clanId)) {
        clanMap.set(clanId, true);
        addGraphNode({
          id: clanId,
          nodeType: 'clan',
          label: `Rod ${cl.canonicalSurname.charAt(0).toUpperCase() + cl.canonicalSurname.slice(1)}`,
          subtitle: 'Místní rodová větev'
        });
      }
      addGraphEdge(cl.id, clanId, 'BELONGS_TO_CLAN', 'rodová větev');
    }

    const lastRec = recById.get(cl.recordIds[cl.recordIds.length - 1]);
    if (lastRec && lastRec.recordKind === 'census' && lastRec.birthPlace) {
      const origCity = cleanPlace(lastRec.birthPlace);
      if (origCity && !/^č\.?s\.?\s*petrovice|^čes\.\s*petrovice|^české petrovice|^petersdorf|^"$/i.test(origCity)) {
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
  for (const [, members] of hhByHouse) {
    const head = members.find(m => /majitel|přednosta|hospodář/i.test(m.rec.relation)) || members[0];
    if (!head) continue;
    for (const m of members) {
      if (m.cl.id === head.cl.id) continue;
      const rl = (m.rec.relation || '').toLowerCase();
      let etype = 'HOUSEHOLD_DEPENDENCY';
      if (/manžel/.test(rl)) etype = 'SPOUSE_OF';
      else if (/syn|dcera|matka|otec|vnuč|vnuk/.test(rl)) etype = 'PARENT_OF';
      else if (/bratr|sestra/.test(rl)) etype = 'SIBLING_OF';
      addGraphEdge(head.cl.id, m.cl.id, etype, m.rec.relation || etype);
      kinshipEdges.push({ source: head.cl.id, target: m.cl.id, edgeType: etype, label: m.rec.relation || etype });
    }
  }

  // Migrační toky
  const migrationFlows = [];
  const originMap = new Map();
  for (const r of records) {
    if (r.year === 1921 && r.birthPlace) {
      const pl = cleanPlace(r.birthPlace);
      if (pl && !/^č\.?s\.?\s*petrovice|^čes\.\s*petrovice|^české petrovice|^petersdorf|^"$/i.test(pl)) {
        const key = `${pl} -> ${r.houseId}`;
        if (!originMap.has(key)) {
          originMap.set(key, { fromLabel: pl, toLabel: `České Petrovice čp. ${r.houseNumber}`, toHouseId: r.houseId, fromYear: 1850, toYear: 1921, count: 0 });
        }
        originMap.get(key).count += 1;
      }
    }
  }
  originMap.forEach(v => migrationFlows.push(v));

  // 8. Kompaktní serializace records & identityClusters (bez duplicitních/prázdných klíčů)
  const compactRecords = records.map(r => {
    const defaultUrl = aronUrlsBySign[r.parishSign] || '';
    return cleanObj({
      id: r.id,
      recordKind: r.recordKind === 'parish' ? undefined : r.recordKind,
      year: r.year,
      fullName: r.fullName,
      sourceTypeLabel: r.sourceTypeLabel,
      parishSign: r.parishSign,
      eventType: r.eventType,
      scan: r.scan,
      houseNumber: r.houseNumber,
      relation: r.relation === '-' ? '' : r.relation,
      occupation: r.occupation === '-' ? '' : r.occupation,
      birthDate: r.birthDate === '-' ? '' : r.birthDate,
      birthPlace: r.birthPlace === '-' || r.birthPlace === '"' ? '' : r.birthPlace,
      scanFile: r.scanFile,
      aronUrl: r.aronUrl && r.aronUrl !== defaultUrl ? r.aronUrl : ''
    });
  });

  const compactClusters = fullClusters.map(c => cleanObj({
    id: c.id,
    isVerifiedProfile: c.isVerifiedProfile,
    isCrossVolumeBridge: c.isCrossVolumeBridge,
    canonicalName: c.canonicalName,
    canonicalSurname: c.canonicalSurname,
    variantNames: c.recordCount >= 2 && c.variantNames.length > 1 ? c.variantNames : undefined,
    spouseGiven: c.spouseGiven,
    childrenNames: c.childrenNames,
    marriageYear: c.marriageYear,
    primaryHouseId: c.primaryHouseId,
    primaryHouseNumber: c.primaryHouseNumber,
    housesVisited: c.housesVisited.length > 1 ? c.housesVisited : undefined,
    birthYear: c.birthYear,
    lifeSpan: c.lifeSpan,
    minYear: c.minYear,
    maxYear: c.maxYear,
    recordIds: c.recordIds,
    censusCount: c.censusCount || undefined,
    parishCount: c.parishCount || undefined,
    categoryKey: c.categoryKey,
    categoryLabel: c.categoryLabel,
    categoryIcon: c.categoryIcon,
    archetypeKey: c.archetypeKey,
    role: c.role === '-' ? '' : c.role,
    sourcesUsed: c.sourcesUsed,
    matchReasons: c.matchReasons
  }));

  const multiClusters = fullClusters.filter(c => c.recordCount >= 2);
  const crossVolumeBridges = multiClusters.filter(c => c.isCrossVolumeBridge);
  const houseBridges23_1 = crossVolumeBridges.filter(c => c.sourcesUsed.includes('23-1') && c.sourcesUsed.some(s => s !== '23-1' && !/^\d{4}$/.test(s)));
  const marriageToBaptism = multiClusters.filter(c => c.marriageYear !== null && c.parishCount >= 2);

  const clusterDataset = {
    generatedAt: new Date().toISOString(),
    municipality: 'České Petrovice (Böhmisch Petersdorf)',
    meta: {
      aronUrlsBySign,
      archetypes: ARCHETYPES_META,
      badgeByKey: BADGE_BY_KEY
    },
    stats: {
      totalRecords: records.length,
      parishRecordsCount: records.filter(r => r.recordKind === 'parish').length,
      censusRecordsCount: censusRecsAll.length,
      totalIdentityClusters: fullClusters.length,
      multiRecordClusters: multiClusters.length,
      crossVolumeBridgesCount: crossVolumeBridges.length,
      houseBridges23_1Count: houseBridges23_1.length,
      marriageToBaptismCount: marriageToBaptism.length,
      verifiedProfilesCount,
      candidatePairsCount: candidatePairs.length,
      probCandidatesCount: candidatePairs.length,
      migrationFlowsCount: migrationFlows.length,
      graphNodesCount: graphNodes.length,
      graphEdgesCount: graphEdges.length,
      kinshipAndHouseholdEdgesCount: kinshipEdges.length
    },
    records: compactRecords,
    identityClusters: compactClusters,
    candidatePairs,
    migrationFlows,
    kinshipEdges,
    knowledgeGraph: {
      nodes: graphNodes,
      edges: graphEdges
    }
  };

  const linkedPeople = fullClusters
    .filter(cl => cl.isVerifiedProfile || cl.censusCount >= 2 || cl.recordCount >= 2)
    .map(cl => {
      const linkedCensusIds = cl.recordIds.filter(id => id.startsWith('cen_'));
      const parishEvents = cl.recordIds
        .map(id => recById.get(id))
        .filter(r => r && r.recordKind === 'parish')
        .map(mr => ({
          id: mr.id,
          year: mr.year,
          sign: mr.parishSign || '',
          scan: mr.scan || null,
          recordType: mr.eventType || 'N',
          type: mr.sourceTypeLabel,
          date: mr.birthDate,
          place: mr.houseNumber ? `České Petrovice čp. ${mr.houseNumber}` : 'České Petrovice',
          description: mr.fullName,
          scanFile: mr.scanFile || '',
          scanTitle: mr.scanTitle || '',
          aronUrl: mr.aronUrl || ''
        }));
      return {
        id: cl.id,
        isVerifiedProfile: cl.isVerifiedProfile,
        isCrossVolumeBridge: cl.isCrossVolumeBridge,
        sourcesUsed: cl.sourcesUsed,
        volumesCount: cl.volumesCount,
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
        recordCount: cl.recordCount,
        spouse: cl.spouseGiven || '-',
        children: cl.childrenNames || [],
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
    version: 'v3',
    generatedAt: new Date().toISOString(),
    stats: {
      linkedPeopleCount: linkedPeople.length,
      multiRecordClusters: multiClusters.length,
      crossVolumeBridgesCount: crossVolumeBridges.length,
      houseBridges23_1Count: houseBridges23_1.length,
      marriageToBaptismCount: marriageToBaptism.length,
      linkedRecordsCount: linkedPeople.reduce((s, p) => s + p.censusCount + p.parishCount, 0),
      threePlusCount: linkedPeople.filter(p => p.recordCount >= 3).length,
      movedHousesCount: linkedPeople.filter(p => p.housesVisited.length > 1).length,
      probSuggestionsCount: candidatePairs.length
    },
    linkedPeople,
    candidateSuggestions: candidatePairs.slice(0, 120)
  };

  const cdPath = path.join(__dirname, 'data/cluster_dataset.js');
  const clPath = path.join(__dirname, 'data/census_links.js');

  fs.writeFileSync(
    cdPath,
    '// Automaticky generováno skriptem build_clusters.js – Laboratoř propojování osob České Petrovice (1591–1921)\n' +
    `const clusterDataset = ${JSON.stringify(clusterDataset)};\n`,
    'utf-8'
  );
  fs.writeFileSync(
    clPath,
    '// Automaticky generováno skriptem build_clusters.js – Sjednocené osoby České Petrovice (1591–1921)\n' +
    `const censusLinksData = ${JSON.stringify(censusLinksData)};\n`,
    'utf-8'
  );

  const cdMB = fs.statSync(cdPath).size / 1024 / 1024;
  const clKB = fs.statSync(clPath).size / 1024;
  console.log(
    `Generated cluster_dataset.js (${cdMB.toFixed(2)} MB) & census_links.js (${clKB.toFixed(1)} KB): ` +
    `${records.length} records (parish=${clusterDataset.stats.parishRecordsCount}, census=${clusterDataset.stats.censusRecordsCount}), ` +
    `${fullClusters.length} clusters (${multiClusters.length} multi-record, ` +
    `${crossVolumeBridges.length} cross-volume bridges, ${houseBridges23_1.length} house 23-1 bridges, ${marriageToBaptism.length} O->N chains), ` +
    `${candidatePairs.length} candidate pairs, ${graphNodes.length} graph nodes, ${graphEdges.length} graph edges.`
  );
  if (cdMB >= 4.0) {
    throw new Error(`cluster_dataset.js size ${cdMB.toFixed(2)} MB exceeded 4.0 MB limit!`);
  }
}

main();
