/**
 * cluster_app.js
 * Interaktivní laboratoř propojování osob pro České Petrovice (cluster.html):
 *   1) Identita osob (Clustery + Inspector + Ruční sloučení)
 *   2) Revize kandidátů & jmenovců
 *   3) Typologický 2D Scatter Plot životních drah (Canvas)
 *   4) Heterogenní graf vzájemných závislostí (Canvas + JSON export)
 *   5) Časová osa přechodů domů (1771–1921, Canvas)
 */
const STORAGE_KEY_CLUSTER_STATE = 'ceske_petrovice_clustering_app_state_v1';
const STORAGE_KEY_PERSON_LINKS = 'ceske_petrovice_person_links_v1';

const clState = {
  recordsById: new Map(),
  clusters: [],
  candidatePairs: [],
  migrationFlows: [],
  kinshipEdges: [],
  graphNodes: [],
  graphEdges: [],
  graphNodesById: new Map(),
  confirmedPairIds: new Set(),
  dismissedPairIds: new Set(),
  selectedClusterId: null,
  selectedGraphNodeId: null,
  focusHouseId: null,
  activeTab: 'identity',
  searchQuery: '',
  filterMode: 'all',
  typologyPoints: [],
  networkRenderNodes: []
};

function esc(val) {
  return String(val ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normStr(s) {
  return (s || '').toString().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function saveLocalState() {
  try {
    localStorage.setItem(STORAGE_KEY_CLUSTER_STATE, JSON.stringify({
      confirmedPairIds: [...clState.confirmedPairIds],
      dismissedPairIds: [...clState.dismissedPairIds]
    }));
  } catch (e) {}
}

function loadLocalState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLUSTER_STATE);
    if (!raw) return;
    const obj = JSON.parse(raw);
    clState.confirmedPairIds = new Set(obj.confirmedPairIds || []);
    clState.dismissedPairIds = new Set(obj.dismissedPairIds || []);
  } catch (e) {}
}

function resetClusteringState() {
  try { localStorage.removeItem(STORAGE_KEY_CLUSTER_STATE); } catch (e) {}
  clState.confirmedPairIds.clear();
  clState.dismissedPairIds.clear();
  initClusterApp();
}

function initClusterApp() {
  if (typeof clusterDataset === 'undefined') return;
  loadLocalState();

  clState.recordsById = new Map((clusterDataset.records || []).map(r => [r.id, r]));
  clState.clusters = (clusterDataset.identityClusters || []).map(c => ({ ...c, recordIds: [...(c.recordIds || [])] }));
  clState.candidatePairs = [...(clusterDataset.candidatePairs || [])];
  clState.migrationFlows = [...(clusterDataset.migrationFlows || [])];
  clState.kinshipEdges = [...(clusterDataset.kinshipEdges || [])];
  clState.graphNodes = [...((clusterDataset.knowledgeGraph && clusterDataset.knowledgeGraph.nodes) || [])];
  clState.graphEdges = [...((clusterDataset.knowledgeGraph && clusterDataset.knowledgeGraph.edges) || [])];
  clState.graphNodesById = new Map(clState.graphNodes.map(n => [n.id, n]));

  if (!clState.selectedClusterId && clState.clusters.length) {
    const multi = clState.clusters.find(c => c.recordCount >= 2 || c.isVerifiedProfile);
    clState.selectedClusterId = multi ? multi.id : clState.clusters[0].id;
  }

  updateClusterKpis();
  renderIdentityTab();
  renderReviewTab();
  handleHashNavigation();
}

function updateClusterKpis() {
  const s = (typeof clusterDataset !== 'undefined' && clusterDataset.stats) || {};
  const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  setTxt('kpi-records', s.totalRecords ?? clState.recordsById.size);
  setTxt('kpi-clusters', clState.clusters.length);
  setTxt('kpi-multi', clState.clusters.filter(c => c.recordCount >= 2).length);
  const pendingPairs = clState.candidatePairs.filter(p => !clState.confirmedPairIds.has(p.id) && !clState.dismissedPairIds.has(p.id)).length;
  setTxt('kpi-candidates', pendingPairs);
  setTxt('nav-badge-review', pendingPairs);
  setTxt('kpi-graph', `${clState.graphNodes.length} / ${clState.graphEdges.length}`);
}

function switchMainTab(tab) {
  clState.activeTab = tab;
  ['identity', 'review', 'typology', 'network', 'timeline'].forEach(t => {
    const btn = document.getElementById(`tab-btn-${t}`);
    const panel = document.getElementById(`panel-${t}`);
    const act = t === tab;
    if (btn) {
      btn.classList.toggle('cluster-tab-active', act);
      btn.classList.toggle('bg-amber-800', act);
      btn.classList.toggle('text-white', act);
      btn.classList.toggle('text-slate-700', !act);
      btn.classList.toggle('hover:bg-amber-50', !act);
    }
    if (panel) panel.classList.toggle('hidden', !act);
  });

  if (tab === 'typology') drawTypologyCanvas();
  else if (tab === 'network') drawNetworkCanvas();
  else if (tab === 'timeline') drawTimelineCanvas();
}

function handleHashNavigation() {
  const raw = window.location.hash.replace(/^#/, '');
  if (!raw) return;
  const params = new URLSearchParams(raw.includes('=') ? raw : '');
  const tab = params.get('tab');
  const house = params.get('house');
  const cluster = params.get('cluster');

  if (house) clState.focusHouseId = house;
  if (cluster && clState.clusters.some(c => c.id === cluster)) {
    clState.selectedClusterId = cluster;
    switchMainTab('identity');
    renderIdentityTab();
    return;
  }
  if (tab && ['identity', 'review', 'typology', 'network', 'timeline'].includes(tab)) {
    switchMainTab(tab);
  }
}

// ---------------------------------------------------------------------------
// 1. Záložka Identita osob & Inspector
// ---------------------------------------------------------------------------
function setClusterFilter(mode) {
  clState.filterMode = mode || 'all';
  renderIdentityTab();
}

function setClusterSearch(q) {
  clState.searchQuery = q || '';
  renderIdentityTab();
}

function selectCluster(id) {
  clState.selectedClusterId = id;
  renderIdentityTab();
}

function renderIdentityTab() {
  const listEl = document.getElementById('cluster-list-container');
  const inspEl = document.getElementById('cluster-inspector-container');
  if (!listEl || !inspEl) return;

  const q = normStr(clState.searchQuery);
  const filtered = clState.clusters.filter(c => {
    if (clState.filterMode === 'verified' && !c.isVerifiedProfile) return false;
    if (clState.filterMode === 'multi' && c.recordCount < 2) return false;
    if (clState.filterMode === 'parish' && c.parishCount < 1) return false;
    if (!q) return true;
    return normStr(`${c.canonicalName} ${c.primaryHouseNumber} ${c.role} ${(c.variantNames || []).join(' ')}`).includes(q);
  });

  const shown = filtered.slice(0, 120);
  listEl.innerHTML = shown.map(c => {
    const act = c.id === clState.selectedClusterId;
    return `
      <button type="button" onclick="selectCluster('${esc(c.id)}')"
        class="w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${act ? 'bg-amber-800 text-white border-amber-950 shadow-xs' : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-200'}">
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            ${c.isVerifiedProfile ? '<span title="Ověřený biografický profil">⭐</span>' : ''}
            <span class="text-xs font-extrabold truncate">${esc(c.canonicalName)}</span>
          </div>
          <div class="text-[11px] truncate ${act ? 'text-amber-200' : 'text-slate-500'}">čp. ${esc(c.primaryHouseNumber || '-')} • ${esc(c.lifeSpan)}</div>
        </div>
        <span class="px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${act ? 'bg-amber-950 text-amber-100' : 'bg-amber-100 text-amber-950'}">${c.recordCount}×</span>
      </button>
    `;
  }).join('') || '<div class="p-6 text-center text-xs text-slate-500">Žádný cluster nevyhovuje filtru.</div>';

  const sel = clState.clusters.find(c => c.id === clState.selectedClusterId) || shown[0];
  if (!sel) {
    inspEl.innerHTML = '<div class="p-8 text-center text-sm text-slate-500">Vyberte osobu ze seznamu vlevo.</div>';
    return;
  }

  const recs = sel.recordIds.map(id => clState.recordsById.get(id)).filter(Boolean);
  inspEl.innerHTML = `
    <div class="space-y-4">
      <div class="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-amber-200">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${sel.categoryBadgeClass || 'bg-amber-100 text-amber-950 border-amber-300'}">${sel.categoryIcon || '🧬'} ${esc(sel.categoryLabel)}</span>
            <span class="px-2 py-0.5 rounded bg-stone-100 font-mono text-[11px] font-bold">${esc(sel.lifeSpan)}</span>
          </div>
          <h3 class="text-xl font-extrabold font-heading text-slate-900">${esc(sel.canonicalName)}</h3>
          <p class="text-xs text-amber-900 font-semibold">${esc(sel.role || '-')}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          ${sel.primaryHouseId ? `<a href="mapa.html#house=${esc(sel.primaryHouseId)}" class="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold">🗺️ Čp. ${esc(sel.primaryHouseNumber)} na mapě</a>` : ''}
          <button type="button" onclick="focusClusterInNetwork('${esc(sel.id)}')" class="px-3 py-1.5 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold cursor-pointer">🕸️ V grafu závislostí</button>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div class="p-2.5 rounded-xl bg-amber-50 border border-amber-200"><span class="text-slate-500 block">Záznamů celkem</span><strong class="text-base">${sel.recordCount}</strong></div>
        <div class="p-2.5 rounded-xl bg-sky-50 border border-sky-200"><span class="text-slate-500 block">Sčítání / Matrika</span><strong class="text-base">${sel.censusCount} / ${sel.parishCount}</strong></div>
        <div class="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200"><span class="text-slate-500 block">Domovská čp.</span><strong class="text-base">${esc((sel.housesVisited || []).map(x => x.replace('cp', '')).join(', ') || '-')}</strong></div>
        <div class="p-2.5 rounded-xl bg-stone-100 border border-stone-200"><span class="text-slate-500 block">Archetyp</span><strong class="text-[11px]">${esc(sel.archetypeLabel)}</strong></div>
      </div>

      <div class="space-y-2.5">
        <h4 class="text-xs font-extrabold uppercase tracking-wider text-amber-950">📜 Připojené archivní záznamy (${recs.length})</h4>
        ${recs.map(r => `
          <div class="p-3 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-950 font-mono font-bold">${r.year}</span>
                <strong class="text-slate-900">${esc(r.sourceTypeLabel)}</strong>
                <span class="text-slate-500">čp. ${esc(r.houseNumber)}</span>
              </div>
              <p class="mt-1 text-slate-700"><strong>${esc(r.fullName)}</strong> • ${esc(r.relation)} • ${esc(r.occupation)}${r.birthPlace ? ` • Nar.: ${esc(r.birthDate)} (${esc(r.birthPlace)})` : ''}</p>
            </div>
            ${r.scanFile ? `<span class="px-2 py-1 rounded bg-amber-50 border border-amber-200 text-[10px] font-mono text-amber-900 shrink-0">${esc(r.scanFile.split('/').pop())}</span>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ---------------------------------------------------------------------------
// 2. Záložka Revize kandidátů & jmenovců
// ---------------------------------------------------------------------------
function resolveCandidatePair(pairId, action) {
  if (action === 'confirm') clState.confirmedPairIds.add(pairId);
  else clState.dismissedPairIds.add(pairId);
  saveLocalState();
  updateClusterKpis();
  renderReviewTab();
}

function renderReviewTab() {
  const container = document.getElementById('review-pairs-container');
  if (!container) return;

  const visible = clState.candidatePairs.filter(p => !clState.confirmedPairIds.has(p.id) && !clState.dismissedPairIds.has(p.id)).slice(0, 60);
  if (!visible.length) {
    container.innerHTML = '<div class="p-8 text-center bg-white rounded-2xl border border-amber-200 text-sm text-emerald-800 font-bold">✅ Všichni navržení kandidátní jmenovci jsou vyřešeni.</div>';
    return;
  }

  container.innerHTML = visible.map(p => {
    const a = clState.recordsById.get(p.recordIdA);
    const b = clState.recordsById.get(p.recordIdB);
    if (!a || !b) return '';
    return `
      <div class="p-4 bg-white rounded-2xl border border-amber-200 shadow-2xs space-y-3 text-xs">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold border border-amber-300">${esc(p.badgeLabel)} • Skóre ${Math.round(p.score * 100)} %</span>
          <span class="text-slate-500">${(p.reasons || []).map(esc).join(' • ')}</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="p-3 rounded-xl bg-amber-50/60 border border-amber-200">
            <span class="font-mono font-bold text-amber-900">${a.year} • ${esc(a.sourceTypeLabel)} • čp. ${esc(a.houseNumber)}</span>
            <div class="font-bold text-sm text-slate-900 mt-0.5">${esc(a.fullName)}</div>
            <div class="text-slate-600">${esc(a.relation)} • ${esc(a.occupation)}</div>
          </div>
          <div class="p-3 rounded-xl bg-sky-50/60 border border-sky-200">
            <span class="font-mono font-bold text-sky-900">${b.year} • ${esc(b.sourceTypeLabel)} • čp. ${esc(b.houseNumber)}</span>
            <div class="font-bold text-sm text-slate-900 mt-0.5">${esc(b.fullName)}</div>
            <div class="text-slate-600">${esc(b.relation)} • ${esc(b.occupation)}</div>
          </div>
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" onclick="resolveCandidatePair('${esc(p.id)}', 'dismiss')" class="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 font-bold cursor-pointer">✕ Odlišné osoby (Otec/Syn)</button>
          <button type="button" onclick="resolveCandidatePair('${esc(p.id)}', 'confirm')" class="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold cursor-pointer">✓ Potvrdit shodu</button>
        </div>
      </div>
    `;
  }).join('');
}

// ---------------------------------------------------------------------------
// 3. Typologický 2D Canvas Clustering
// ---------------------------------------------------------------------------
function drawTypologyCanvas() {
  const canvas = document.getElementById('typology-canvas');
  const legendEl = document.getElementById('typology-legend');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#fdfbf7';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#e7dfcc';
  ctx.lineWidth = 1;
  for (let gx = 80; gx < W - 40; gx += 110) {
    ctx.beginPath(); ctx.moveTo(gx, 40); ctx.lineTo(gx, H - 50); ctx.stroke();
  }
  for (let gy = 60; gy < H - 50; gy += 80) {
    ctx.beginPath(); ctx.moveTo(60, gy); ctx.lineTo(W - 40, gy); ctx.stroke();
  }

  ctx.fillStyle = '#57534e';
  ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
  ctx.fillText('Historická éra prvního zachycení (1771 → 1921)', W / 2 - 140, H - 18);
  ctx.fillText('Počet záznamů / životní rozpětí', 16, 24);

  const legendMap = new Map();
  clState.typologyPoints = [];
  clState.clusters.forEach((c, idx) => {
    const xRatio = Math.max(0, Math.min(1, (c.minYear - 1770) / 155));
    const jitterX = ((idx * 37) % 19 - 9) * 1.4;
    const jitterY = ((idx * 53) % 23 - 11) * 2.1;
    const x = 70 + xRatio * (W - 140) + jitterX;
    const yBase = c.recordCount >= 2 ? 120 : 320;
    const y = Math.max(48, Math.min(H - 65, yBase - (c.spanYears || 0) * 1.1 + jitterY));
    const color = c.archetypeColor || '#78350f';

    if (!legendMap.has(c.archetypeKey)) {
      legendMap.set(c.archetypeKey, { label: c.archetypeLabel, color, count: 0 });
    }
    legendMap.get(c.archetypeKey).count++;

    ctx.beginPath();
    ctx.arc(x, y, c.isVerifiedProfile ? 7 : (c.recordCount >= 2 ? 5.5 : 4), 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    if (c.isVerifiedProfile) {
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    clState.typologyPoints.push({ x, y, cluster: c });
  });

  canvas.onclick = (ev) => {
    const rect = canvas.getBoundingClientRect();
    const cx = ((ev.clientX - rect.left) / rect.width) * W;
    const cy = ((ev.clientY - rect.top) / rect.height) * H;
    let best = null, bestD = 18;
    for (const pt of clState.typologyPoints) {
      const d = Math.hypot(pt.x - cx, pt.y - cy);
      if (d < bestD) { bestD = d; best = pt.cluster; }
    }
    if (best) {
      clState.selectedClusterId = best.id;
      const box = document.getElementById('typology-selected-box');
      if (box) {
        box.innerHTML = `<strong>${esc(best.canonicalName)}</strong> (čp. ${esc(best.primaryHouseNumber)}) • ${esc(best.archetypeLabel)} • ${best.recordCount}× záznam (<button type="button" onclick="selectCluster('${esc(best.id)}'); switchMainTab('identity');" class="underline font-bold text-amber-800 cursor-pointer">Otevřít v Inspektoru →</button>)`;
      }
    }
  };

  if (legendEl) {
    legendEl.innerHTML = [...legendMap.values()].map(lg => `
      <span class="px-2.5 py-1 rounded-full bg-white border border-amber-200 text-xs font-bold flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full inline-block" style="background:${lg.color}"></span>
        ${esc(lg.label)} (${lg.count})
      </span>
    `).join('');
  }
}

// ---------------------------------------------------------------------------
// 4. Graf vzájemných závislostí (Canvas + fokus)
// ---------------------------------------------------------------------------
function focusClusterInNetwork(nodeId) {
  clState.selectedGraphNodeId = nodeId;
  switchMainTab('network');
}

function drawNetworkCanvas() {
  const canvas = document.getElementById('network-canvas');
  const sideEl = document.getElementById('network-inspector-box');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, W, H);

  // Vybereme ohniskový podgraf (aby byl graf dokonale čitelný a rychlý)
  let centerId = clState.selectedGraphNodeId || 'house_cp7';
  if (!clState.graphNodesById.has(centerId) && clState.graphNodes.length) {
    centerId = clState.graphNodes[0].id;
  }

  const adjEdges = clState.graphEdges.filter(e => e.source === centerId || e.target === centerId);
  const subNodeIds = new Set([centerId]);
  adjEdges.forEach(e => { subNodeIds.add(e.source); subNodeIds.add(e.target); });

  // Přidáme 2. krok sousedů (až 55 uzlů pro přehlednost)
  const hop2Ids = new Set(subNodeIds);
  for (const e of clState.graphEdges) {
    if (hop2Ids.size >= 55) break;
    if (subNodeIds.has(e.source) || subNodeIds.has(e.target)) {
      hop2Ids.add(e.source);
      hop2Ids.add(e.target);
    }
  }

  const subNodes = [...hop2Ids].map(id => clState.graphNodesById.get(id)).filter(Boolean);
  const subEdges = clState.graphEdges.filter(e => hop2Ids.has(e.source) && hop2Ids.has(e.target));

  const pos = new Map();
  const centerNode = clState.graphNodesById.get(centerId);
  pos.set(centerId, { x: W / 2, y: H / 2 });

  const others = subNodes.filter(n => n.id !== centerId);
  others.forEach((n, i) => {
    const isDirect = subNodeIds.has(n.id);
    const radius = isDirect ? 145 : 235;
    const ang = (i / Math.max(1, others.length)) * Math.PI * 2;
    pos.set(n.id, { x: W / 2 + radius * Math.cos(ang), y: H / 2 + radius * 0.78 * Math.sin(ang) });
  });

  subEdges.forEach(e => {
    const p1 = pos.get(e.source), p2 = pos.get(e.target);
    if (!p1 || !p2) return;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = e.edgeType === 'RESIDES_AT' ? 'rgba(245, 158, 11, 0.45)' : (e.edgeType === 'MIGRATED_BETWEEN' ? 'rgba(56, 189, 248, 0.45)' : 'rgba(148, 163, 184, 0.35)');
    ctx.lineWidth = e.source === centerId || e.target === centerId ? 1.8 : 1;
    ctx.stroke();
  });

  const colors = { person: '#f59e0b', house: '#10b981', clan: '#a855f7', origin: '#38bdf8', employer: '#f43f5e' };
  clState.networkRenderNodes = [];

  subNodes.forEach(n => {
    const p = pos.get(n.id);
    if (!p) return;
    const isCtr = n.id === centerId;
    const r = isCtr ? 14 : (n.nodeType === 'house' ? 9 : 7);
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = colors[n.nodeType] || '#cbd5e1';
    ctx.fill();
    ctx.strokeStyle = isCtr ? '#ffffff' : '#0f172a';
    ctx.lineWidth = isCtr ? 3 : 1.5;
    ctx.stroke();

    ctx.fillStyle = isCtr ? '#fef3c7' : '#e2e8f0';
    ctx.font = isCtr ? 'bold 12px Plus Jakarta Sans, sans-serif' : '10px Plus Jakarta Sans, sans-serif';
    ctx.fillText(n.label.slice(0, 26), p.x + r + 4, p.y + 4);
    clState.networkRenderNodes.push({ ...p, r, node: n });
  });

  canvas.onclick = (ev) => {
    const rect = canvas.getBoundingClientRect();
    const cx = ((ev.clientX - rect.left) / rect.width) * W;
    const cy = ((ev.clientY - rect.top) / rect.height) * H;
    const hit = clState.networkRenderNodes.find(item => Math.hypot(item.x - cx, item.y - cy) <= item.r + 8);
    if (hit) {
      clState.selectedGraphNodeId = hit.node.id;
      drawNetworkCanvas();
    }
  };

  if (sideEl && centerNode) {
    sideEl.innerHTML = `
      <div class="space-y-3 text-xs">
        <div>
          <span class="px-2 py-0.5 rounded bg-amber-900 text-amber-100 uppercase text-[10px] font-bold">${esc(centerNode.nodeType)}</span>
          <h4 class="text-base font-extrabold text-slate-900 mt-1">${esc(centerNode.label)}</h4>
          <p class="text-slate-600">${esc(centerNode.subtitle || '')}</p>
        </div>
        <div class="space-y-1.5 max-h-80 overflow-y-auto pr-1">
          <strong class="text-amber-950 block">Přímé vazby (${adjEdges.length}):</strong>
          ${adjEdges.map(e => {
            const otherId = e.source === centerId ? e.target : e.source;
            const other = clState.graphNodesById.get(otherId);
            return other ? `
              <button type="button" onclick="clState.selectedGraphNodeId='${esc(other.id)}'; drawNetworkCanvas();" class="w-full text-left p-2 rounded-lg bg-amber-50/70 hover:bg-amber-100 border border-amber-200 flex justify-between gap-2 cursor-pointer">
                <span><strong>${esc(other.label)}</strong><br><span class="text-[10px] text-slate-500">${esc(e.edgeType)}: ${esc(e.label)}</span></span>
                <span class="text-amber-800 font-bold">→</span>
              </button>
            ` : '';
          }).join('')}
        </div>
      </div>
    `;
  }
}

// ---------------------------------------------------------------------------
// 5. Časová osa domů 1771–1921 (Canvas)
// ---------------------------------------------------------------------------
function drawTimelineCanvas() {
  const canvas = document.getElementById('timeline-canvas');
  if (!canvas || typeof housesData === 'undefined') return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#fdfbf7';
  ctx.fillRect(0, 0, W, H);

  const years = [1775, 1806, 1869, 1910, 1921];
  const xOf = y => 140 + ((y - 1770) / 160) * (W - 200);
  years.forEach(y => {
    const x = xOf(y);
    ctx.strokeStyle = '#e7dfcc';
    ctx.beginPath(); ctx.moveTo(x, 32); ctx.lineTo(x, H - 20); ctx.stroke();
    ctx.fillStyle = '#78350f';
    ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
    ctx.fillText(String(y), x - 14, 22);
  });

  // Vybereme 16 klíčových či fokusovaných domů
  const targetIds = clState.focusHouseId
    ? [clState.focusHouseId, 'cp1', 'cp7', 'cp21', 'cp25', 'cp27', 'cp40', 'cp83', 'cp121', 'cp130', 'cp152', 'cp156', 'cp158', 'cp160']
    : ['cp1', 'cp7', 'cp21', 'cp25', 'cp27', 'cp40', 'cp61', 'cp83', 'cp121', 'cp130', 'cp152', 'cp156', 'cp158', 'cp160'];
  const uniqueIds = [...new Set(targetIds)].slice(0, 14);

  uniqueIds.forEach((hid, idx) => {
    const h = housesData.find(x => x.id === hid);
    if (!h) return;
    const y = 52 + idx * 32;
    ctx.fillStyle = hid === clState.focusHouseId ? '#b45309' : '#1c1917';
    ctx.font = hid === clState.focusHouseId ? 'bold 12px Plus Jakarta Sans, sans-serif' : '11px Plus Jakarta Sans, sans-serif';
    ctx.fillText(`Čp. ${h.number}`, 20, y + 4);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(130, y); ctx.lineTo(W - 50, y); ctx.stroke();

    if (h.earliest1771 && ((h.earliest1771.alteEntries || []).length || (h.earliest1771.fromAlte || []).length)) {
      ctx.fillStyle = '#92400e';
      ctx.beginPath(); ctx.arc(xOf(1775), y, 6, 0, Math.PI * 2); ctx.fill();
    }
    if ((h.census || []).some(c => c.year === 1869)) {
      ctx.fillStyle = '#0f766e';
      ctx.beginPath(); ctx.arc(xOf(1869), y, 6, 0, Math.PI * 2); ctx.fill();
    }
    if (h.census1910Meta) {
      ctx.fillStyle = '#4338ca';
      ctx.beginPath(); ctx.arc(xOf(1910), y, 6, 0, Math.PI * 2); ctx.fill();
    }
    const c21 = (h.census || []).find(c => c.year === 1921);
    if (c21 && c21.inhabitants) {
      ctx.fillStyle = '#047857';
      ctx.beginPath(); ctx.arc(xOf(1921), y, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#065f46';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`${c21.inhabitants.length} os.`, xOf(1921) + 12, y + 4);
    }
  });
}

function exportClustersJson(kind = 'clusters') {
  const data = kind === 'graph'
    ? { title: 'České Petrovice – Graf vzájemných závislostí', nodes: clState.graphNodes, edges: clState.graphEdges }
    : { appName: 'České Petrovice Clustering Lab', generatedAt: new Date().toISOString(), clusters: clState.clusters, candidatePairs: clState.candidatePairs };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = kind === 'graph' ? 'ceske_petrovice_dependency_graph.json' : 'ceske_petrovice_person_clusters.json';
  a.click();
}

document.addEventListener('DOMContentLoaded', initClusterApp);
window.addEventListener('hashchange', handleHashNavigation);
