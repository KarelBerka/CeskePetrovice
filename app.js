// ==========================================================================
// ČESKÉ PETROVICE (BÖHMISCH PETERSDORF) – HLAVNÍ KLIENTSKÁ APLIKACE
// Podporuje stránky: home, story, map, inhabitants, demography, references
// ==========================================================================

const ARCHIVE_REPO_URL = "https://github.com/KarelBerka/CeskePetrovice";
const PAGES_BASE_URL = "https://karelberka.github.io/CeskePetrovice/";

let mainMap = null;
let sideHistMap = null;
let isSideBySideActive = false;
let isSyncingMapMove = false;
let houseMarkersLayer = null;
let boundariesOverlayLayer = null;
let activeHistoricalLayer = null;
let activeHistKey = "orto1953";
let activeHistOpacity = 0;
let knWmsLayer = null;

let currentHouseFilter = "all";
let currentHouseSearch = "";
let selectedHouseId = null;
let currentAtlasCategory = "all";

let currentStoryChapterIndex = 0;
let showAllStoryChapters = false;

let currentInhabTab = "registry";
let currentRegistryPage = 1;
let registryPageSize = 50;
let lastRegistryRecords = [];
let currentRegSearch = "";
let currentRegYear = "all";
let currentRegNat = "all";
let currentRegCat = "all";
let currentRegHouse = "";
let currentParishSearch = "";
let currentParishVol = "all";
let currentParishType = "all";
let showDisputedParish = true;
let currentParishPage = 1;
let parishPageSize = 50;

let currentDemographyTab = "dlouhodoby";
let selectedDemographyPointIdx = null;

let currentRefCategory = "all";
let currentRefSearch = "";
let currentReferenceTab = "prameny";
let currentNewsCategory = "all";

let currentScanZoom = 1.0;

// --------------------------------------------------------------------------
// 1. Pomocné funkce & bezpečné escapování
// --------------------------------------------------------------------------
function escHtml(val) {
  if (val === null || val === undefined) return "";
  return String(val)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normSearch(str) {
  return (str || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function toggleMobileNavMenu() {
  const menu = document.getElementById("mobile-nav-drawer");
  if (!menu) return;
  menu.classList.toggle("hidden");
}

// --------------------------------------------------------------------------
// 2. Globální modály (Archive Lightbox, Person Modal, Licence, Zpětná vazba)
// --------------------------------------------------------------------------
function resolveArchivePortalInfo(sourceInfo = "", url = "") {
  const low = `${sourceInfo} ${url}`.toLowerCase();
  if (url) {
    if (low.includes("vychodoceskearchivy.cz") || low.includes("aron")) {
      return { url, label: "🏛️ SOA Hradec Králové – ARON" };
    }
    if (low.includes("mza.cz")) {
      return { url, label: "🏛️ MZA Brno – ARON" };
    }
    if (low.includes("pamatkovykatalog.cz")) {
      return { url, label: "🏛️ Památkový katalog NPÚ" };
    }
    if (low.includes("cenia.cz")) {
      return { url, label: "🏛️ CENIA Ortofoto 1953 (CC BY 4.0)" };
    }
    if (low.includes("cuzk.gov.cz") || low.includes("cuzk.cz")) {
      return { url, label: "🏛️ Geoportál ČÚZK / ÚAZK" };
    }
    if (low.includes("kramerius")) {
      return { url, label: "📖 Digitální knihovna Kramerius" };
    }
    if (low.includes("mzk.cz")) {
      return { url, label: "🗺️ MZK Brno – Mollova sbírka" };
    }
    return { url, label: "🔗 Otevřít digitální pramen" };
  }
  if (low.includes("mza")) return { url: "https://www.mza.cz/aron/", label: "🏛️ MZA Brno – ARON" };
  if (low.includes("npú") || low.includes("úskp")) return { url: "https://www.pamatkovykatalog.cz/kostel-sv-petra-a-pavla-1000146326_0001", label: "🏛️ Památkový katalog NPÚ" };
  if (low.includes("kramerius") || low.includes("menšin") || low.includes("sokol")) return { url: "https://kramerius.svkhk.cz/", label: "📖 SVK HK Kramerius" };
  return { url: "https://aron.vychodoceskearchivy.cz/", label: "🏛️ SOA HK / SOkA ÚO (ARON)" };
}

function openArchiveViewer(scanUrl, title = "Archivní dokument", sourceInfo = "", localPath = "", directArchiveUrl = "") {
  const modal = document.getElementById("archive-viewer-modal");
  const img = document.getElementById("viewer-scan-img");
  if (!modal || !img) return;

  currentScanZoom = 1.0;
  img.style.transform = "scale(1)";
  img.src = scanUrl;
  img.alt = title;

  const titleEl = document.getElementById("viewer-doc-title");
  const sourceEl = document.getElementById("viewer-doc-source");
  const pathEl = document.getElementById("viewer-file-path");
  const dlBtn = document.getElementById("viewer-download-btn");
  const linkBtn = document.getElementById("viewer-archive-link");
  const linkNameEl = document.getElementById("viewer-archive-name");

  if (titleEl) titleEl.textContent = title || "Archivní dokument";
  if (sourceEl) sourceEl.textContent = sourceInfo || "SOA Hradec Králové / SOkA Ústí nad Orlicí";
  if (pathEl) pathEl.textContent = localPath || scanUrl;
  if (dlBtn) dlBtn.href = scanUrl;

  const portal = resolveArchivePortalInfo(sourceInfo, directArchiveUrl);
  if (linkBtn) linkBtn.href = portal.url;
  if (linkNameEl) linkNameEl.textContent = portal.label;

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeArchiveViewer() {
  const modal = document.getElementById("archive-viewer-modal");
  if (modal) modal.classList.add("hidden");
  document.body.style.overflow = "";
}

function zoomArchiveScan(delta) {
  const img = document.getElementById("viewer-scan-img");
  if (!img) return;
  if (delta === 0) currentScanZoom = 1.0;
  else currentScanZoom = Math.max(0.6, Math.min(3.0, +(currentScanZoom + delta).toFixed(2)));
  img.style.transform = `scale(${currentScanZoom})`;
  const lbl = document.getElementById("viewer-zoom-label");
  if (lbl) lbl.textContent = `${Math.round(currentScanZoom * 100)} %`;
}

function openLicenceModal() {
  const m = document.getElementById("licence-modal");
  if (m) m.classList.remove("hidden");
}

function closeLicenceModal() {
  const m = document.getElementById("licence-modal");
  if (m) m.classList.add("hidden");
}

function openFeedbackIssue(contextNote = "") {
  const page = document.body?.dataset?.page || "portal";
  const title = encodeURIComponent(`[Zpětná vazba – ${page}] ${contextNote || "Podnět nebo doplnění"}`);
  const body = encodeURIComponent(`**Stránka:** ${window.location.href}\n**Kontext:** ${contextNote || "-"}\n\n**Popis podnětu / opravy čtení:**\n`);
  window.open(`${ARCHIVE_REPO_URL}/issues/new?title=${title}&body=${body}`, "_blank", "noopener,noreferrer");
}

// --------------------------------------------------------------------------
// 3. Modální okno osoby (z peopleData, censusLinksData nebo censusRegistryData)
// --------------------------------------------------------------------------
function findPersonByAnyId(id) {
  if (typeof peopleData !== "undefined") {
    const p = peopleData.find(x => x.id === id);
    if (p) return p;
  }
  if (typeof censusLinksData !== "undefined" && Array.isArray(censusLinksData.linkedPeople)) {
    const lp = censusLinksData.linkedPeople.find(x => x.id === id);
    if (lp) return lp;
  }
  if (typeof censusRegistryData !== "undefined") {
    const rec = censusRegistryData.find(r => r.id === id);
    if (rec) {
      return {
        id: rec.id,
        name: rec.fullName,
        birthYear: rec.birthYear,
        lifeSpan: rec.birthDate && rec.birthDate !== "-" ? `*${rec.birthDate} (sčítání ${rec.censusYear})` : `Sčítání ${rec.censusYear}`,
        houseNumber: rec.houseNumber,
        houseId: rec.houseId,
        categoryLabel: rec.categoryLabel,
        categoryIcon: rec.categoryIcon,
        categoryBadgeClass: rec.categoryBadgeClass,
        role: `${rec.relation || "-"} • ${rec.occupation || "-"}`,
        linkedCensusIds: [rec.id],
        biography: `Obyvatel zapsaný v domě čp. ${rec.houseNumber} při sčítání lidu v roce ${rec.censusYear}. Rodiště: ${rec.birthPlace || "-"}, domovská příslušnost: ${rec.domovska || "-"}, národnost: ${rec.nationality || "-"}.`
      };
    }
  }
  return null;
}

function openPersonModal(personId) {
  const modal = document.getElementById("person-detail-modal");
  if (!modal) {
    window.location.href = `obyvatele.html#person=${encodeURIComponent(personId)}`;
    return;
  }
  const p = findPersonByAnyId(personId);
  if (!p) return;

  document.getElementById("modal-person-name").textContent = p.name || "-";
  document.getElementById("modal-person-lifespan").textContent = p.lifeSpan || "-";
  document.getElementById("modal-person-role").textContent = p.role || "-";

  const badgeEl = document.getElementById("modal-person-badge");
  if (badgeEl) {
    badgeEl.textContent = `${p.categoryIcon || "👤"} ${p.categoryLabel || "Obyvatel obce"}`;
    badgeEl.className = `px-2 py-0.5 text-[11px] font-bold rounded border ${p.categoryBadgeClass || "bg-amber-100 text-amber-950 border-amber-300"}`;
  }

  const houseBtn = document.getElementById("modal-person-house-link");
  if (houseBtn) {
    if (p.houseNumber && p.houseNumber !== "-") {
      houseBtn.textContent = `🏠 Čp. ${p.houseNumber} na mapě →`;
      houseBtn.href = `mapa.html#house=${encodeURIComponent(p.houseId || "cp" + p.houseNumber)}`;
      houseBtn.classList.remove("hidden");
    } else {
      houseBtn.classList.add("hidden");
    }
  }

  const bioEl = document.getElementById("modal-person-bio");
  if (bioEl) bioEl.textContent = p.biography || "Propojená historická identita z archivních pramenů Českých Petrovic.";

  const famEl = document.getElementById("modal-person-family");
  if (famEl) {
    const items = [];
    if (p.father && p.father !== "-") items.push(`<div><span class="text-slate-500">Otec:</span> <strong>${escHtml(p.father)}</strong></div>`);
    if (p.mother && p.mother !== "-") items.push(`<div><span class="text-slate-500">Matka:</span> <strong>${escHtml(p.mother)}</strong></div>`);
    if (p.spouse && p.spouse !== "-") items.push(`<div><span class="text-slate-500">Manžel/ka:</span> <strong>${escHtml(p.spouse)}</strong></div>`);
    if (Array.isArray(p.children) && p.children.length) items.push(`<div class="sm:col-span-2"><span class="text-slate-500">Děti:</span> <strong>${p.children.map(escHtml).join(", ")}</strong></div>`);
    famEl.innerHTML = items.join("") || `<div class="text-slate-500 italic">Rodinné vazby rekonstruovány dle sčítacího archu čp. ${escHtml(p.houseNumber || "-")}.</div>`;
  }

  const evContainer = document.getElementById("modal-person-events");
  if (evContainer) {
    const cards = [];
    (p.events || []).forEach(ev => {
      cards.push(`
        <div class="p-3 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-950 font-mono text-[11px] font-bold">${escHtml(ev.date || ev.year)}</span>
              <strong class="text-xs text-slate-900">${escHtml(ev.type || "Záznam")} ${ev.place ? "• " + escHtml(ev.place) : ""}</strong>
            </div>
            <p class="text-xs text-slate-700 mt-1">${escHtml(ev.description)}</p>
            <p class="text-[10px] text-slate-400 font-mono mt-0.5">${escHtml(ev.source || "")}</p>
          </div>
          ${ev.scanFile ? `<button type="button" onclick="openArchiveViewer('${escHtml(ev.scanFile)}', '${escHtml(ev.scanTitle || p.name)}', '${escHtml(ev.source || "Archiv")}')" class="px-2.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shrink-0 cursor-pointer">📜 Scan</button>` : ""}
        </div>
      `);
    });

    if (typeof censusRegistryData !== "undefined" && Array.isArray(p.linkedCensusIds)) {
      p.linkedCensusIds.forEach(cid => {
        const cr = censusRegistryData.find(r => r.id === cid);
        if (!cr) return;
        cards.push(`
          <div class="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-indigo-900 text-white font-mono text-[11px] font-bold">Sčítání ${cr.censusYear}</span>
                <strong class="text-xs text-slate-900">${escHtml(cr.fullName)} (čp. ${escHtml(cr.houseNumber)})</strong>
              </div>
              <p class="text-xs text-slate-700 mt-1">Postavení: <strong>${escHtml(cr.relation)}</strong> • Povolání: <strong>${escHtml(cr.occupation)}</strong> • Nar.: ${escHtml(cr.birthDate)} (${escHtml(cr.birthPlace)})</p>
              <p class="text-[10px] text-slate-500 mt-0.5">${escHtml(cr.notes)}</p>
            </div>
            ${cr.scanFile ? `<button type="button" onclick="openArchiveViewer('${escHtml(cr.scanFile)}', '${escHtml(cr.scanTitle || cr.fullName)}', '${escHtml(cr.notes)}', '', '${escHtml(cr.originalUrl)}')" class="px-2.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shrink-0 cursor-pointer">📜 Scan</button>` : ""}
          </div>
        `);
      });
    }
    evContainer.innerHTML = cards.join("") || `<p class="text-xs text-slate-500">Žádné připojené archivní záznamy.</p>`;
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closePersonModal() {
  const m = document.getElementById("person-detail-modal");
  if (m) m.classList.add("hidden");
  document.body.style.overflow = "";
}

// --------------------------------------------------------------------------
// 4. DOMOVÁ STRÁNKA (index.html) – Aktuality
// --------------------------------------------------------------------------
function filterNewsCategory(catKey) {
  currentNewsCategory = catKey || "all";
  renderNewsSection();
}

function renderNewsSection() {
  const filtersEl = document.getElementById("news-filters");
  const gridEl = document.getElementById("news-cards-grid");
  if (!gridEl || typeof newsData === "undefined") return;

  const lang = window.currentLang || "cs";
  const pick = (obj, base) => (lang === "en" && obj[base + "En"]) ? obj[base + "En"] : ((lang === "de" && obj[base + "De"]) ? obj[base + "De"] : obj[base]);

  if (filtersEl && typeof newsCategories !== "undefined") {
    filtersEl.innerHTML = newsCategories.map(c => {
      const active = currentNewsCategory === c.key;
      return `
        <button type="button" onclick="filterNewsCategory('${c.key}')"
          class="px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer ${active ? "bg-amber-800 text-white border-amber-900" : "bg-white hover:bg-amber-100 text-slate-700 border-amber-200"}">
          ${c.icon} ${escHtml(pick(c, "label"))}
        </button>
      `;
    }).join("");
  }

  const list = currentNewsCategory === "all" ? newsData : newsData.filter(n => n.category === currentNewsCategory);
  gridEl.innerHTML = list.map(n => `
    <article class="parchment-card p-5 rounded-2xl border border-amber-200 flex flex-col justify-between gap-3">
      <div class="space-y-2">
        <div class="flex items-center justify-between gap-2 text-[11px]">
          <span class="px-2.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-950 border border-amber-300">${escHtml(pick(n, "badge"))}</span>
          <span class="font-mono text-slate-500">${escHtml(n.date)}</span>
        </div>
        <h3 class="text-base font-extrabold font-heading text-slate-900 leading-snug">${escHtml(pick(n, "title"))}</h3>
        <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${escHtml(pick(n, "summary"))}</p>
      </div>
      <div class="flex flex-wrap gap-2 pt-2 border-t border-amber-100">
        ${(n.links || []).map(lk => `
          <a href="${escHtml(lk.href)}" class="px-3 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-colors">
            ${escHtml(pick(lk, "label"))} →
          </a>
        `).join("")}
      </div>
    </article>
  `).join("");
}

// --------------------------------------------------------------------------
// 5. PŘÍBĚH OBCE (pribeh.html)
// --------------------------------------------------------------------------
function selectStoryChapter(idx) {
  showAllStoryChapters = false;
  currentStoryChapterIndex = Math.max(0, Math.min(idx, (storyData.chapters || []).length - 1));
  renderStorySection();
}

function toggleAllStoryChapters() {
  showAllStoryChapters = !showAllStoryChapters;
  renderStorySection();
}

function handleStoryAction(act) {
  if (!act) return;
  if (act === "openMapSection") window.location.href = "mapa.html";
  else if (act === "openPeopleSection") window.location.href = "obyvatele.html";
  else if (act === "openDemographySection") window.location.href = "demografie.html";
  else if (act === "openReferencesSection") window.location.href = "reference.html";
  else if (act === "openGuideTab") window.location.href = "reference.html#pruvodce";
  else if (act === "openParishTab") window.location.href = "obyvatele.html#parish";
  else if (act === "openClusterLink") window.location.href = "cluster.html";
  else if (act.startsWith("openHouse_")) {
    const hid = act.replace("openHouse_", "");
    window.location.href = `mapa.html#house=${encodeURIComponent(hid)}`;
  }
}

function renderStorySection() {
  if (typeof storyData === "undefined") return;
  const statsGrid = document.getElementById("story-stats-grid");
  if (statsGrid) {
    statsGrid.innerHTML = storyData.stats.map(st => `
      <div class="p-3.5 bg-white rounded-xl border border-amber-200 shadow-2xs flex flex-col justify-between">
        <span class="text-[11px] font-bold uppercase tracking-wider text-amber-800">${escHtml(st.label)}</span>
        <span class="text-lg sm:text-xl font-extrabold font-heading text-slate-900 mt-0.5">${escHtml(st.value)}</span>
        <span class="text-[11px] text-slate-500 mt-0.5">${escHtml(st.detail)}</span>
      </div>
    `).join("");
  }

  const tocEl = document.getElementById("story-toc-container");
  if (tocEl) {
    tocEl.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-amber-100">
        <span class="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-950">🧭 Výběr kapitoly (I.–X.):</span>
        <div class="flex flex-wrap gap-2">
          <button type="button" onclick="toggleAllStoryChapters()" class="px-3 py-1.5 text-xs font-bold rounded-lg border cursor-pointer ${showAllStoryChapters ? "bg-amber-800 text-white border-amber-900" : "bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300"}">
            ${showAllStoryChapters ? "📑 Čtečka po 1 kapitole" : `📖 Zobrazit všech ${storyData.chapters.length} kapitol`}
          </button>
          <a href="docs/historie_ceskych_petrovic.md" target="_blank" class="px-2.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200">
            📄 Syntetická studie (.md) ↗
          </a>
        </div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        ${storyData.chapters.map((ch, idx) => {
          const isAct = !showAllStoryChapters && idx === currentStoryChapterIndex;
          return `
            <button type="button" onclick="selectStoryChapter(${idx})"
              class="text-left p-2.5 rounded-xl border transition-all cursor-pointer ${isAct ? "bg-amber-800 text-white border-amber-950 shadow-sm ring-2 ring-amber-400" : "bg-amber-50/70 hover:bg-amber-100 text-slate-800 border-amber-200"}">
              <div class="flex items-center justify-between text-[10px] font-mono font-bold ${isAct ? "text-amber-200" : "text-amber-800"}">
                <span>Kap. ${escHtml(ch.number)}</span>
                <span>${escHtml(ch.era)}</span>
              </div>
              <div class="text-xs font-bold mt-1 line-clamp-2">${escHtml(ch.title)}</div>
            </button>
          `;
        }).join("")}
      </div>
    `;
  }

  const chContainer = document.getElementById("story-chapters-container");
  if (chContainer) {
    const toShow = showAllStoryChapters ? storyData.chapters : [storyData.chapters[currentStoryChapterIndex]];
    chContainer.innerHTML = toShow.map(ch => `
      <article class="parchment-card p-5 sm:p-7 rounded-2xl border border-amber-200 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-amber-100">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-900 text-amber-50">Kapitola ${escHtml(ch.number)} (${escHtml(ch.era)})</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300">${escHtml(ch.badge)}</span>
          </div>
          ${!showAllStoryChapters ? `
            <div class="flex gap-1.5">
              <button type="button" onclick="selectStoryChapter(${currentStoryChapterIndex - 1})" ${currentStoryChapterIndex === 0 ? "disabled" : ""} class="px-2.5 py-1 rounded-lg border text-xs font-bold bg-white hover:bg-amber-100 disabled:opacity-40 cursor-pointer">← Předchozí</button>
              <button type="button" onclick="selectStoryChapter(${currentStoryChapterIndex + 1})" ${currentStoryChapterIndex >= storyData.chapters.length - 1 ? "disabled" : ""} class="px-2.5 py-1 rounded-lg border text-xs font-bold bg-white hover:bg-amber-100 disabled:opacity-40 cursor-pointer">Další →</button>
            </div>
          ` : ""}
        </div>

        <h3 class="text-xl sm:text-2xl font-extrabold font-heading text-slate-900">${escHtml(ch.title)}</h3>
        <p class="text-sm font-semibold text-amber-900 bg-amber-50/90 p-3 rounded-xl border border-amber-200">${escHtml(ch.summary)}</p>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div class="lg:col-span-7 space-y-3 text-sm sm:text-base text-slate-800 font-serif-body leading-relaxed">
            ${(ch.paragraphs || []).map(p => `<p>${escHtml(p)}</p>`).join("")}
          </div>
          <div class="lg:col-span-5 grid grid-cols-1 gap-3">
            ${ch.image ? `
              <figure class="bg-stone-50 rounded-xl border border-amber-200 overflow-hidden cursor-pointer group" onclick="openArchiveViewer('${escHtml(ch.image)}', '${escHtml(ch.title)}', '${escHtml(ch.imageCaption)}')">
                <img src="${escHtml(ch.image)}" alt="${escHtml(ch.title)}" class="w-full h-48 object-cover group-hover:scale-105 transition-transform" loading="lazy">
                <figcaption class="p-2.5 text-[11px] text-slate-600">${escHtml(ch.imageCaption)} <span class="text-amber-800 font-bold">[🔍 Zvětšit]</span></figcaption>
              </figure>
            ` : ""}
            ${ch.secondaryImage ? `
              <figure class="bg-stone-50 rounded-xl border border-amber-200 overflow-hidden cursor-pointer group" onclick="openArchiveViewer('${escHtml(ch.secondaryImage)}', '${escHtml(ch.title)}', '${escHtml(ch.secondaryImageCaption)}')">
                <img src="${escHtml(ch.secondaryImage)}" alt="${escHtml(ch.title)}" class="w-full h-44 object-cover group-hover:scale-105 transition-transform" loading="lazy">
                <figcaption class="p-2.5 text-[11px] text-slate-600">${escHtml(ch.secondaryImageCaption)} <span class="text-amber-800 font-bold">[🔍 Zvětšit]</span></figcaption>
              </figure>
            ` : ""}
          </div>
        </div>

        <div class="pt-3 border-t border-amber-100 flex flex-wrap gap-2">
          ${(ch.links || []).map(lk => `
            <button type="button" onclick="handleStoryAction('${escHtml(lk.action)}')" class="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold cursor-pointer">
              ${escHtml(lk.label)} →
            </button>
          `).join("")}
        </div>
      </article>
    `).join("");
  }

  const factsEl = document.getElementById("story-facts-container");
  if (factsEl && Array.isArray(storyData.funFacts)) {
    factsEl.innerHTML = storyData.funFacts.map((f, idx) => `
      <div class="p-5 bg-white rounded-2xl border border-amber-200 shadow-2xs flex flex-col justify-between gap-3 hover:border-amber-400">
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold border border-amber-300">${f.icon} ${escHtml(f.tag)}</span>
            <span class="font-mono text-slate-400">#${idx + 1}</span>
          </div>
          <h4 class="text-base font-bold font-heading text-slate-900">${escHtml(f.title)}</h4>
          <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${escHtml(f.text)}</p>
        </div>
        ${f.action ? `<div class="pt-2 border-t border-amber-100 flex justify-end"><button type="button" onclick="handleStoryAction('${escHtml(f.action)}')" class="px-3 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold cursor-pointer">${escHtml(f.actionLabel || "Detail")} →</button></div>` : ""}
      </div>
    `).join("");
  }

  const probesEl = document.getElementById("story-probes-container");
  if (probesEl && Array.isArray(storyData.deepDives)) {
    probesEl.innerHTML = storyData.deepDives.map(d => `
      <div class="p-5 bg-amber-50/60 rounded-2xl border border-amber-200 flex flex-col justify-between gap-3">
        <div>
          <span class="text-[11px] font-mono font-bold text-amber-900 bg-white px-2 py-0.5 rounded border border-amber-300">${escHtml(d.era)}</span>
          <h4 class="text-base font-extrabold font-heading text-slate-900 mt-2">${escHtml(d.title)}</h4>
          <p class="text-xs sm:text-sm text-slate-700 mt-1.5 leading-relaxed">${escHtml(d.summary)}</p>
        </div>
        <a href="${escHtml(d.href)}" class="self-end px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-amber-900 text-white text-xs font-bold">📄 Otevřít studii / složku →</a>
      </div>
    `).join("");
  }
}

// --------------------------------------------------------------------------
// 6. INTERAKTIVNÍ MAPA & 170 OBJEKTŮ (mapa.html)
// --------------------------------------------------------------------------
function project3857To5514(mx, my) {
  const p = (typeof villageBoundariesData !== "undefined" && villageBoundariesData.ceniaPoly2)
    ? villageBoundariesData.ceniaPoly2
    : null;
  if (!p) return [mx, my];
  const u = (mx - p.cx) / p.sx;
  const v = (my - p.cy) / p.sy;
  return [
    p.kx[0] + p.kx[1] * u + p.kx[2] * v + p.kx[3] * u * u + p.kx[4] * u * v + p.kx[5] * v * v,
    p.ky[0] + p.ky[1] * u + p.ky[2] * v + p.ky[3] * u * u + p.ky[4] * u * v + p.ky[5] * v * v
  ];
}

function createCenia1953LiveLayer(opts = {}) {
  const CENIA_WMS = "https://gis.cenia.cz/mapcache/ortofotomapa_historicka/wms";
  const cov = (typeof villageBoundariesData !== "undefined" && villageBoundariesData.coverageBounds)
    ? villageBoundariesData.coverageBounds
    : [[50.05, 16.50], [50.20, 16.72]];
  const coverageBounds = L.latLngBounds(cov);
  const R = 6378137.0;
  const WORLD = 2 * Math.PI * R;
  const HALF_WORLD = Math.PI * R;

  const LiveCeniaGrid = L.GridLayer.extend({
    options: { tileSize: 256, minZoom: 11, maxZoom: 20, bounds: coverageBounds, opacity: 0.85, attribution: "" },
    setOpacity: function (opacity) {
      this.options.opacity = opacity;
      return L.GridLayer.prototype.setOpacity.call(this, opacity);
    },
    createTile: function (coords, done) {
      const W = 512, H = 512;
      const tile = document.createElement("canvas");
      tile.width = W;
      tile.height = H;
      if (coords.z < 11) { done(null, tile); return tile; }

      const span = WORLD / Math.pow(2, coords.z);
      const mx0 = -HALF_WORLD + coords.x * span;
      const mx1 = mx0 + span;
      const my1 = HALF_WORLD - coords.y * span;
      const my0 = my1 - span;

      const nw = project3857To5514(mx0, my1);
      const ne = project3857To5514(mx1, my1);
      const sw = project3857To5514(mx0, my0);
      const se = project3857To5514(mx1, my0);

      const minX = Math.min(nw[0], ne[0], sw[0], se[0]);
      const maxX = Math.max(nw[0], ne[0], sw[0], se[0]);
      const minY = Math.min(nw[1], ne[1], sw[1], se[1]);
      const maxY = Math.max(nw[1], ne[1], sw[1], se[1]);

      const padX = (maxX - minX) * 0.04;
      const padY = (maxY - minY) * 0.04;
      const bx0 = minX - padX, bx1 = maxX + padX;
      const by0 = minY - padY, by1 = maxY + padY;
      const bw = bx1 - bx0, bh = by1 - by0;

      const reqMaxPx = Math.max(256, Math.min(640, Math.round(Math.max(bw, bh) / 0.35)));
      const reqW = bw >= bh ? reqMaxPx : Math.max(256, Math.round(reqMaxPx * (bw / bh)));
      const reqH = bw >= bh ? Math.max(256, Math.round(reqMaxPx * (bh / bw))) : reqMaxPx;
      const bboxStr = `${bx0.toFixed(3)},${by0.toFixed(3)},${bx1.toFixed(3)},${by1.toFixed(3)}`;
      const url = `${CENIA_WMS}?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS=orto&STYLES=&SRS=EPSG:5514&BBOX=${bboxStr}&WIDTH=${reqW}&HEIGHT=${reqH}&FORMAT=image/jpeg`;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const srcPx = pt => ({ x: ((pt[0] - bx0) / bw) * reqW, y: ((by1 - pt[1]) / bh) * reqH });
        const p0 = srcPx(nw), p1 = srcPx(ne), p2 = srcPx(sw);
        const u1 = p1.x - p0.x, v1 = p1.y - p0.y;
        const u2 = p2.x - p0.x, v2 = p2.y - p0.y;
        const det = u1 * v2 - u2 * v1;
        if (Math.abs(det) > 1e-6) {
          const a = (W * v2) / det, c = (-W * u2) / det;
          const b = (-H * v1) / det, d = (H * u1) / det;
          const e = -(a * p0.x + c * p0.y), f = -(b * p0.x + d * p0.y);
          const ctx = tile.getContext("2d");
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.setTransform(a, b, c, d, e, f);
            ctx.drawImage(img, 0, 0, reqW, reqH);
          }
        }
        done(null, tile);
      };
      img.onerror = () => done(null, tile);
      img.src = url;
      return tile;
    }
  });

  return new LiveCeniaGrid({
    opacity: opts.opacity !== undefined ? opts.opacity : 0.85,
    attribution: opts.attribution || "CENIA 1953"
  });
}

function createHistoricalLayer(key, opacity = 0.85) {
  if (key === "orto1953") {
    return createCenia1953LiveLayer({ opacity });
  }
  const archItem = (typeof cuzkArchivOrthoLayers !== "undefined") ? cuzkArchivOrthoLayers.find(x => x.key === key) : null;
  const wmsLayer = archItem ? archItem.wmsLayer : "2022";
  return L.tileLayer.wms("https://geoportal.cuzk.gov.cz/geoserver/wms_ortofoto_archiv/wms", {
    layers: wmsLayer,
    format: "image/jpeg",
    transparent: false,
    version: "1.3.0",
    opacity,
    maxZoom: 20,
    attribution: `ČÚZK WMS-ORTOARCHIV (${wmsLayer})`
  });
}

function initInteractiveMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl || typeof L === "undefined") return;

  mainMap = L.map("map", { center: [50.1210, 16.5975], zoom: 15, maxZoom: 20 });

  const osmLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  });
  const cuzkOrto = L.tileLayer("https://ags.cuzk.gov.cz/arcgis1/rest/services/ORTOFOTO_WM/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 20,
    attribution: "&copy; ČÚZK Ortofoto ČR"
  });
  const cuzkZm = L.tileLayer("https://ags.cuzk.gov.cz/arcgis1/rest/services/ZTM_WM/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 19,
    attribution: "&copy; ČÚZK ZTM 1:10 000"
  });
  knWmsLayer = L.tileLayer.wms("https://services.cuzk.cz/wms/wms.asp", {
    layers: "KN",
    format: "image/png",
    transparent: true,
    version: "1.3.0",
    maxZoom: 20,
    attribution: "&copy; ČÚZK Katastr nemovitostí"
  });

  cuzkOrto.addTo(mainMap);
  L.control.layers(
    { "🛰️ Letecké Ortofoto ČR (ČÚZK)": cuzkOrto, "🗺️ Základní mapa ČR (ČÚZK)": cuzkZm, "🌐 OpenStreetMap": osmLayer },
    { "📐 Katastrální mapa KN (ČÚZK WMS)": knWmsLayer },
    { collapsed: true }
  ).addTo(mainMap);

  boundariesOverlayLayer = L.layerGroup().addTo(mainMap);
  houseMarkersLayer = L.layerGroup().addTo(mainMap);

  renderBoundaryAndLandmarks();
  renderHouseMarkers();
  renderHouseSidebarList();

  // Zpřístupní i historický select z atlasu
  const sel = document.getElementById("historical-map-select");
  if (sel && typeof cuzkArchivOrthoLayers !== "undefined") {
    cuzkArchivOrthoLayers.forEach(item => {
      if (!sel.querySelector(`option[value="${item.key}"]`)) {
        const opt = document.createElement("option");
        opt.value = item.key;
        opt.textContent = item.label;
        sel.appendChild(opt);
      }
    });
  }

  // Deep link na #house=cp7 nebo ?house=cp7
  const params = new URLSearchParams(window.location.search);
  const hashStr = window.location.hash.replace(/^#/, "");
  const hParam = params.get("house") || (hashStr.startsWith("house=") ? hashStr.slice(6) : null);
  if (hParam) {
    selectHouse(hParam, true);
  } else {
    selectHouse("cp25", false);
  }

  renderMapAtlasCards();
}

function renderBoundaryAndLandmarks() {
  if (!boundariesOverlayLayer || typeof villageBoundariesData === "undefined") return;
  boundariesOverlayLayer.clearLayers();

  const poly = villageBoundariesData.cadastralPolygons?.ceske_petrovice;
  if (poly && Array.isArray(poly.rings)) {
    poly.rings.forEach(ring => {
      L.polygon(ring, {
        color: "#b45309",
        weight: 2.5,
        dashArray: poly.isApproximate ? "6 4" : null,
        fillColor: "#fef3c7",
        fillOpacity: 0.06
      }).addTo(boundariesOverlayLayer).bindTooltip(
        poly.isApproximate
          ? `k.ú. ${poly.code} ${poly.name} (orientační obálka z RÚIAN)`
          : `Hranice k.ú. ${poly.code} ${poly.name}`,
        { sticky: true }
      );
    });
  }

  const lmObj = villageBoundariesData.landmarks || {};
  Object.values(lmObj).forEach(lm => {
    L.circleMarker([lm.lat, lm.lng], {
      radius: 5,
      color: "#78350f",
      fillColor: "#f59e0b",
      fillOpacity: 0.85,
      weight: 1.5
    }).addTo(boundariesOverlayLayer).bindTooltip(`📍 ${lm.label}`);
  });
}

function toggleLocalityHighlights(checked) {
  if (!mainMap || !boundariesOverlayLayer) return;
  if (checked) boundariesOverlayLayer.addTo(mainMap);
  else mainMap.removeLayer(boundariesOverlayLayer);
}

function toggleHouseMarkers(checked) {
  if (!mainMap || !houseMarkersLayer) return;
  if (checked) houseMarkersLayer.addTo(mainMap);
  else mainMap.removeLayer(houseMarkersLayer);
}

function getFilteredHouses() {
  if (typeof housesData === "undefined") return [];
  const q = normSearch(currentHouseSearch);
  return housesData.filter(h => {
    if (currentHouseFilter === "existing" && (!h.exists2026 || h.isEvidencni)) return false;
    if (currentHouseFilter === "vanished" && h.exists2026) return false;
    if (currentHouseFilter === "heritage" && !h.isHeritage) return false;
    if (currentHouseFilter === "evidencni" && !h.isEvidencni && !h.isPost1921) return false;
    if (currentHouseFilter === "with1921") {
      const c21 = (h.census || []).find(c => c.year === 1921);
      if (!c21 || !(c21.inhabitants || []).length) return false;
    }
    if (!q) return true;
    const blob = normSearch([
      h.number, h.localName, h.type, h.sector,
      (h.census || []).map(c => (c.inhabitants || []).map(i => i.name).join(" ")).join(" ")
    ].join(" "));
    return blob.includes(q);
  });
}

function renderHouseMarkers() {
  if (!houseMarkersLayer) return;
  houseMarkersLayer.clearLayers();
  const list = getFilteredHouses();

  list.forEach(h => {
    if (!h.location || h.location.lat == null) return;
    let cls = "custom-house-marker";
    if (h.isHeritage && h.id === "kostel_sv_petra_a_pavla") cls += " heritage";
    else if (!h.exists2026) cls += " vanished";
    else if (h.isEvidencni) cls += " evidencni";
    else if (h.isPost1921) cls += " post1921";
    if (h.id === selectedHouseId) cls += " selected";

    const pillTxt = h.id === "kostel_sv_petra_a_pavla" ? "⛪" : (h.isEvidencni ? `E${h.number.replace("ev. ", "")}` : h.number);
    const icon = L.divIcon({
      className: cls,
      html: `<div class="house-marker-pill" title="${escHtml(h.localName)}">${escHtml(pillTxt)}</div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });
    const marker = L.marker([h.location.lat, h.location.lng], { icon });
    marker.on("click", () => selectHouse(h.id, false));
    marker.bindTooltip(`<strong>${escHtml(h.localName)}</strong><br><span class="text-xs">${escHtml(h.sector || "")}</span>`);
    marker.addTo(houseMarkersLayer);
  });
}

function renderHouseSidebarList() {
  const listEl = document.getElementById("houses-sidebar-list");
  const countEl = document.getElementById("houses-filter-count");
  if (!listEl) return;

  const list = getFilteredHouses();
  if (countEl) countEl.textContent = `${list.length} objektů`;

  listEl.innerHTML = list.slice(0, 170).map(h => {
    const active = h.id === selectedHouseId;
    const c21 = (h.census || []).find(c => c.year === 1921);
    const cnt21 = c21 && c21.inhabitants ? c21.inhabitants.length : 0;
    const badge = h.id === "kostel_sv_petra_a_pavla"
      ? `<span class="px-1.5 py-0.5 rounded bg-rose-100 text-rose-900 font-bold text-[10px]">ÚSKP</span>`
      : (!h.exists2026
        ? `<span class="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 font-bold text-[10px]">Zaniklé</span>`
        : (cnt21 ? `<span class="px-1.5 py-0.5 rounded bg-amber-100 text-amber-950 font-bold text-[10px]">1921: ${cnt21} os.</span>` : ""));
    return `
      <button type="button" onclick="selectHouse('${escHtml(h.id)}', true)"
        class="w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${active ? "bg-amber-800 text-white border-amber-950 shadow-xs" : "bg-white hover:bg-amber-50 text-slate-800 border-amber-200"}">
        <div class="min-w-0">
          <div class="text-xs font-extrabold truncate">${escHtml(h.localName)}</div>
          <div class="text-[10px] truncate ${active ? "text-amber-200" : "text-slate-500"}">${escHtml(h.sector || "")}</div>
        </div>
        <div class="shrink-0">${badge}</div>
      </button>
    `;
  }).join("") || `<div class="p-4 text-xs text-slate-500 text-center">Žádný objekt neodpovídá filtru.</div>`;
}

function filterHouses(type) {
  currentHouseFilter = type || "all";
  document.querySelectorAll("[data-house-filter]").forEach(btn => {
    const isAct = btn.dataset.houseFilter === currentHouseFilter;
    btn.classList.toggle("bg-amber-800", isAct);
    btn.classList.toggle("text-white", isAct);
    btn.classList.toggle("bg-white", !isAct);
    btn.classList.toggle("text-slate-700", !isAct);
  });
  renderHouseMarkers();
  renderHouseSidebarList();
}

function searchHouses(q) {
  currentHouseSearch = q || "";
  renderHouseMarkers();
  renderHouseSidebarList();
}

function selectHouse(houseId, panTo = true) {
  if (typeof housesData === "undefined") return;
  const h = housesData.find(x => x.id === houseId) || housesData[0];
  if (!h) return;
  selectedHouseId = h.id;

  if (panTo && mainMap && h.location) {
    mainMap.setView([h.location.lat, h.location.lng], Math.max(mainMap.getZoom(), 17));
  }
  renderHouseMarkers();
  renderHouseSidebarList();
  renderHouseDetailCard(h);
}

function switchHouseDetailTab(tabKey) {
  document.querySelectorAll("[data-house-tab-btn]").forEach(btn => {
    const act = btn.dataset.houseTabBtn === tabKey;
    btn.classList.toggle("bg-amber-800", act);
    btn.classList.toggle("text-white", act);
    btn.classList.toggle("bg-amber-50", !act);
    btn.classList.toggle("text-amber-950", !act);
  });
  document.querySelectorAll("[data-house-tab-panel]").forEach(panel => {
    panel.classList.toggle("hidden", panel.dataset.houseTabPanel !== tabKey);
  });
}

function renderHouseDetailCard(h) {
  const container = document.getElementById("house-detail-card");
  if (!container) return;

  const c69 = (h.census || []).find(c => c.year === 1869);
  const c21 = (h.census || []).find(c => c.year === 1921);
  const c10 = h.census1910Meta;
  const e71 = h.earliest1771 || {};

  const precisionBadge = h.location?.precision === "ruian_verified"
    ? `<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300 text-[11px] font-bold">📍 Ověřeno ČÚZK RÚIAN</span>`
    : (h.location?.precision === "historic_church"
      ? `<span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-950 border border-rose-300 text-[11px] font-bold">⛪ Památka NPÚ ÚSKP</span>`
      : `<span class="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 border border-slate-400 text-[11px] font-bold">🏚️ Zaniklé stavení (orientační poloha)</span>`);

  const renderInhabRows = (c) => {
    if (!c) return `<p class="text-xs text-slate-500 italic">Pro toto sčítání není k tomuto stavení přiřazen arch.</p>`;
    if (!c.inhabitants || !c.inhabitants.length) {
      return `<p class="text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">${escHtml(c.note || "Arch dochován jako neobydlené stavení.")}</p>`;
    }
    return `
      <div class="space-y-2">
        <div class="flex flex-wrap items-center justify-between gap-2 text-xs bg-amber-50/90 p-2.5 rounded-xl border border-amber-200">
          <span><strong>Majitel / arch:</strong> ${escHtml(c.houseOwner || "-")} • <strong>Počet osob:</strong> ${c.inhabitants.length}</span>
          ${c.scanFile ? `<button type="button" onclick="openArchiveViewer('${escHtml(c.scanFile)}', '${escHtml(c.scanTitle || h.localName)}', '${escHtml(c.source)}', '', '${escHtml(c.originalUrl || "")}')" class="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold cursor-pointer">📜 Originální scan</button>` : ""}
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs border-collapse">
            <thead>
              <tr class="bg-amber-100/80 text-amber-950 text-left">
                <th class="p-2 border-b border-amber-200">Jméno</th>
                <th class="p-2 border-b border-amber-200">Poměr</th>
                <th class="p-2 border-b border-amber-200">Narození & Místo</th>
                <th class="p-2 border-b border-amber-200">Národnost</th>
                <th class="p-2 border-b border-amber-200">Povolání</th>
              </tr>
            </thead>
            <tbody>
              ${c.inhabitants.map(inh => `
                <tr class="border-b border-amber-100 hover:bg-amber-50/40">
                  <td class="p-2 font-bold text-slate-900">${escHtml(inh.name)}</td>
                  <td class="p-2 text-slate-700">${escHtml(inh.relation || "-")}</td>
                  <td class="p-2 text-slate-600">${escHtml(inh.birthDate || inh.birthYear || "-")}${inh.birthPlace ? ` (${escHtml(inh.birthPlace)})` : ""}</td>
                  <td class="p-2 text-slate-600">${escHtml(inh.nationality || "-")}</td>
                  <td class="p-2 text-slate-700">${escHtml(inh.occupation || "-")}${inh.employer ? ` <span class="text-slate-500">(${escHtml(inh.employer)})</span>` : ""}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  container.innerHTML = `
    <div class="parchment-card p-5 sm:p-6 rounded-2xl border border-amber-200 space-y-4">
      <div class="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-amber-200">
        <div>
          <div class="flex flex-wrap items-center gap-2 mb-1">
            ${precisionBadge}
            <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-950 border border-amber-300 text-[11px] font-bold">${escHtml(h.sector || "České Petrovice")}</span>
            ${h.location?.cadastralParcel ? `<span class="font-mono text-[11px] text-slate-600 bg-stone-100 px-2 py-0.5 rounded">${escHtml(h.location.cadastralParcel)}${h.location.areaM2 ? ` • ${h.location.areaM2} m²` : ""}</span>` : ""}
          </div>
          <h3 class="text-xl font-extrabold font-heading text-slate-900">${escHtml(h.localName)}</h3>
          <p class="text-xs text-slate-600">${escHtml(h.type)} • ${escHtml(h.location?.source || "")}</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <a href="obyvatele.html?house=${encodeURIComponent(h.number)}" class="px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold">👥 Všichni v rejstříku</a>
          <a href="cluster.html#tab=timeline&house=${encodeURIComponent(h.id)}" class="px-3 py-1.5 rounded-lg bg-indigo-900 hover:bg-indigo-950 text-white text-xs font-bold">🕸️ Časová osa domu</a>
        </div>
      </div>

      <p class="text-sm text-slate-800 leading-relaxed">${escHtml(h.description)}</p>

      <div class="flex flex-wrap gap-1.5 border-b border-amber-200 pb-2">
        <button type="button" data-house-tab-btn="overview" onclick="switchHouseDetailTab('overview')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-800 text-white cursor-pointer">📜 Přehled &amp; 1771–1806</button>
        <button type="button" data-house-tab-btn="census" onclick="switchHouseDetailTab('census')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-950 cursor-pointer">📋 Sčítání 1869 &amp; 1921 (${(c21?.inhabitants?.length || 0)})</button>
        <button type="button" data-house-tab-btn="econ1910" onclick="switchHouseDetailTab('econ1910')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-950 cursor-pointer">🐄 Hospodářství 1910 (PO/PZ)</button>
        <button type="button" data-house-tab-btn="docs" onclick="switchHouseDetailTab('docs')" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-950 cursor-pointer">🖼️ Dokumenty &amp; Chronologie</button>
      </div>

      <div data-house-tab-panel="overview" class="space-y-3">
        ${(e71.fromAlte?.length || e71.toNeue?.length || e71.alteEntries?.length) ? `
          <div class="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 space-y-2 text-xs">
            <h4 class="font-extrabold text-amber-950">📖 Nejstarší matrika 23-1 (1771–1784) &amp; Přečíslování 1805/1806</h4>
            ${(e71.fromAlte || []).map(c => `<p>• Nové čp. ${escHtml(h.number)} odpovídá před r. 1805 <strong>starému čp. ${escHtml(c.alte)}</strong> (rod <em>${escHtml(c.sample_family)}</em>).</p>`).join("")}
            ${(e71.toNeue || []).map(c => `<p>• Jako staré čp. ${escHtml(h.number)} (rod <em>${escHtml(c.sample_family)}</em>) přečíslováno 1805/1806 na <strong>nové čp. ${escHtml(c.neue)}</strong>.</p>`).join("")}
            ${(e71.alteEntries || []).length ? `
              <div class="mt-2 pt-2 border-t border-amber-200">
                <strong>Zaznamenané křty na tomto starém čísle (1771–1784):</strong>
                <ul class="list-disc ml-4 mt-1 space-y-0.5">
                  ${e71.alteEntries.slice(0, 6).map(x => `<li>${escHtml(x.date)}: otec <strong>${escHtml(x.father || "-")}</strong>, matka ${escHtml(x.mother || "-")}, dítě <em>${escHtml(x.child)}</em> (${escHtml(x.status || "")})</li>`).join("")}
                </ul>
              </div>
            ` : ""}
          </div>
        ` : `<p class="text-xs text-slate-600">${escHtml(h.statusStableCadastre)}</p>`}
      </div>

      <div data-house-tab-panel="census" class="hidden space-y-4">
        <div>
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-amber-950 mb-2">🇨🇿 Sčítání lidu 15. února 1921 (100% přepis)</h4>
          ${renderInhabRows(c21)}
        </div>
        ${c69 ? `
          <div class="pt-3 border-t border-amber-200">
            <h4 class="text-xs font-extrabold uppercase tracking-wider text-amber-950 mb-2">🦅 Výběrový vzorek sčítání 1869</h4>
            ${renderInhabRows(c69)}
          </div>
        ` : ""}
      </div>

      <div data-house-tab-panel="econ1910" class="hidden space-y-3">
        ${c10 ? `
          <div class="p-4 bg-white rounded-xl border border-amber-200 space-y-3 text-xs">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <strong class="text-sm text-amber-950">Sčítání 31. 12. 1910 (PO/PZ)</strong>
              <button type="button" onclick="openArchiveViewer('${escHtml(c10.scanFile)}', 'Sčítání 1910 – PO (čp. ${escHtml(h.number)})', 'SOkA ÚO, Sčítání 1910')" class="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold cursor-pointer">📜 Sumář PO 1910</button>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div class="p-2.5 rounded-lg bg-amber-50 border border-amber-200"><span class="text-slate-500 block">Přítomných</span><strong class="text-base">${c10.present}</strong></div>
              <div class="p-2.5 rounded-lg bg-sky-50 border border-sky-200"><span class="text-slate-500 block">Německá řeč</span><strong class="text-base">${c10.de}</strong></div>
              <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200"><span class="text-slate-500 block">Česká řeč</span><strong class="text-base">${c10.cs}</strong></div>
              <div class="p-2.5 rounded-lg bg-stone-100 border border-stone-200"><span class="text-slate-500 block">Nepřítomných</span><strong class="text-base">${c10.absent}</strong></div>
            </div>
            ${c10.livestock ? `
              <div class="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div class="flex items-center justify-between mb-1.5">
                  <strong class="text-emerald-950">🐄 Přehled hospodářského zvířectva (PZ 1910)</strong>
                  <button type="button" onclick="openArchiveViewer('${escHtml(c10.livestockScanFile)}', 'Přehled zvířectva 1910 (PZ)', 'SOkA ÚO, Sčítání 1910 PZ')" class="text-[11px] font-bold text-emerald-900 underline cursor-pointer">Zobrazit scan PZ</button>
                </div>
                <p>Koně: <strong>${c10.livestock.horses}</strong> • Skot: <strong>${c10.livestock.cattle}</strong> • Kozy: <strong>${c10.livestock.goats}</strong> • Prasata: <strong>${c10.livestock.pigs}</strong> • Drůbež: <strong>${c10.livestock.poultry}</strong> • Včelstva: <strong>${c10.livestock.beehives}</strong></p>
              </div>
            ` : ""}
            ${(c10.subHouses || []).length ? `<p class="text-slate-600">Evidované podčíslo z r. 1910: ${c10.subHouses.map(sh => `<strong>čp. ${escHtml(sh.cp)}</strong> (${sh.present} obyv.)`).join(", ")}</p>` : ""}
          </div>
        ` : `<p class="text-xs text-slate-500 italic">Pro tento objekt nebyl v archu PO/PZ 1910 samostatný řádek.</p>`}
      </div>

      <div data-house-tab-panel="docs" class="hidden space-y-2.5">
        ${(h.documents || []).map(d => `
          <div class="p-3 bg-amber-50/70 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span class="px-2 py-0.5 rounded bg-amber-200 text-amber-950 text-[10px] font-bold">${escHtml(d.type)} • ${escHtml(d.year)}</span>
              <h5 class="text-xs font-extrabold text-slate-900 mt-1">${escHtml(d.title)}</h5>
              <p class="text-xs text-slate-700">${escHtml(d.description)}</p>
            </div>
            ${d.scanFile ? `<button type="button" onclick="openArchiveViewer('${escHtml(d.scanFile)}', '${escHtml(d.title)}', '${escHtml(d.source)}', '', '${escHtml(d.originalUrl || "")}')" class="px-2.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shrink-0 cursor-pointer">📜 Scan</button>` : ""}
          </div>
        `).join("")}
        ${(h.timeline || []).map(ev => `
          <div class="p-3 bg-white rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <span class="px-2 py-0.5 rounded bg-stone-800 text-amber-100 font-mono font-bold text-[10px]">${escHtml(ev.year)}</span>
              <strong class="ml-1.5 text-slate-900">${escHtml(ev.owner)}</strong>
              <p class="text-slate-700 mt-1">${escHtml(ev.event)}</p>
            </div>
            ${ev.scanFile ? `<button type="button" onclick="openArchiveViewer('${escHtml(ev.scanFile)}', '${escHtml(h.localName + " – " + ev.year)}', '${escHtml(ev.source)}', '', '${escHtml(ev.archiveUrl || "")}')" class="px-2.5 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold shrink-0 cursor-pointer">📜 Scan</button>` : ""}
          </div>
        `).join("") || `<p class="text-xs text-slate-500">Zatím bez časové řady archivních událostí.</p>`}
      </div>
    </div>
  `;
}

function jumpToLocalityView(key) {
  if (!mainMap || typeof villageBoundariesData === "undefined") return;
  const v = villageBoundariesData.localityViews?.[key];
  if (!v) return;
  mainMap.setView(v.center, v.zoom);
  document.querySelectorAll("[data-locality-btn]").forEach(btn => {
    const act = btn.dataset.localityBtn === key;
    btn.classList.toggle("bg-amber-800", act);
    btn.classList.toggle("text-white", act);
    btn.classList.toggle("bg-white", !act);
    btn.classList.toggle("text-slate-800", !act);
  });
}

function switchHistoricalOverlay(key) {
  activeHistKey = key;
  if (activeHistOpacity <= 0) {
    updateCadastreOpacity(80);
    const slider = document.getElementById("cadastre-opacity-slider");
    if (slider) slider.value = 80;
  } else {
    applyHistoricalOverlay();
  }
}

function updateCadastreOpacity(val) {
  activeHistOpacity = Math.max(0, Math.min(100, Number(val) || 0));
  const lbl = document.getElementById("opacity-value-label");
  if (lbl) lbl.textContent = `${activeHistOpacity}%`;
  applyHistoricalOverlay();
}

function applyHistoricalOverlay() {
  if (!mainMap) return;
  if (activeHistoricalLayer && mainMap.hasLayer(activeHistoricalLayer)) {
    mainMap.removeLayer(activeHistoricalLayer);
    activeHistoricalLayer = null;
  }
  if (activeHistOpacity > 0) {
    activeHistoricalLayer = createHistoricalLayer(activeHistKey, activeHistOpacity / 100);
    activeHistoricalLayer.addTo(mainMap);
  }
  if (isSideBySideActive && sideHistMap) {
    sideHistMap.eachLayer(ly => { if (ly.options) sideHistMap.removeLayer(ly); });
    createHistoricalLayer(activeHistKey, 1.0).addTo(sideHistMap);
  }
}

function setBlendPreset(mode) {
  const slider = document.getElementById("cadastre-opacity-slider");
  const val = mode === "modern" ? 0 : (mode === "blend" ? 55 : 100);
  if (slider) slider.value = val;
  updateCadastreOpacity(val);
}

function toggleSideBySideMode() {
  const wrapper = document.getElementById("map-hist-wrapper");
  const mainWrap = document.getElementById("map-main-wrapper");
  const btn = document.getElementById("toggle-split-btn");
  if (!wrapper || !mainWrap || !mainMap) return;

  isSideBySideActive = !isSideBySideActive;
  wrapper.classList.toggle("hidden", !isSideBySideActive);
  mainWrap.classList.toggle("lg:col-span-6", isSideBySideActive);
  mainWrap.classList.toggle("lg:col-span-12", !isSideBySideActive);
  if (btn) {
    btn.classList.toggle("bg-amber-800", isSideBySideActive);
    btn.classList.toggle("text-white", isSideBySideActive);
  }

  setTimeout(() => {
    mainMap.invalidateSize();
    if (isSideBySideActive) {
      if (!sideHistMap) {
        sideHistMap = L.map("map-hist", { center: mainMap.getCenter(), zoom: mainMap.getZoom(), maxZoom: 20 });
        mainMap.on("moveend", () => {
          if (isSideBySideActive && sideHistMap && !isSyncingMapMove) {
            isSyncingMapMove = true;
            sideHistMap.setView(mainMap.getCenter(), mainMap.getZoom(), { animate: false });
            isSyncingMapMove = false;
          }
        });
        sideHistMap.on("moveend", () => {
          if (isSideBySideActive && !isSyncingMapMove) {
            isSyncingMapMove = true;
            mainMap.setView(sideHistMap.getCenter(), sideHistMap.getZoom(), { animate: false });
            isSyncingMapMove = false;
          }
        });
      } else {
        sideHistMap.invalidateSize();
        sideHistMap.setView(mainMap.getCenter(), mainMap.getZoom(), { animate: false });
      }
      sideHistMap.eachLayer(ly => sideHistMap.removeLayer(ly));
      createHistoricalLayer(activeHistKey, 1.0).addTo(sideHistMap);
    }
  }, 120);
}

function filterAtlasMaps(cat) {
  currentAtlasCategory = cat || "all";
  document.querySelectorAll("[data-atlas-filter]").forEach(b => {
    const act = b.dataset.atlasFilter === currentAtlasCategory;
    b.classList.toggle("bg-amber-800", act);
    b.classList.toggle("text-white", act);
    b.classList.toggle("bg-white", !act);
    b.classList.toggle("text-slate-700", !act);
  });
  renderMapAtlasCards();
}

function renderMapAtlasCards() {
  const grid = document.getElementById("atlas-map-grid");
  if (!grid || typeof historicalMapsData === "undefined") return;
  const list = currentAtlasCategory === "all"
    ? historicalMapsData
    : historicalMapsData.filter(m => m.category === currentAtlasCategory);

  grid.innerHTML = list.map(m => `
    <article class="parchment-card rounded-2xl border border-amber-200 overflow-hidden flex flex-col justify-between">
      <div>
        <div class="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer group" onclick="openArchiveViewer('${escHtml(m.imageFile)}', '${escHtml(m.title)}', '${escHtml(m.citationIso690)}', '', '${escHtml(m.externalUrl || "")}')">
          <img src="${escHtml(m.imageFile)}" alt="${escHtml(m.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy">
          <span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-stone-950/80 text-amber-200 text-[10px] font-mono font-bold">${escHtml(m.year)}</span>
          <span class="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-amber-900/90 text-white text-[10px] font-bold">🔍 Zvětšit</span>
        </div>
        <div class="p-4 space-y-1.5">
          <h4 class="text-sm font-extrabold font-heading text-slate-900">${escHtml(m.title)}</h4>
          <p class="text-[11px] font-bold text-amber-800">${escHtml(m.author)} • ${escHtml(m.scale)}</p>
          <p class="text-xs text-slate-700 leading-relaxed">${escHtml(m.annotation)}</p>
        </div>
      </div>
      <div class="px-4 pb-4 pt-2 border-t border-amber-100 flex items-center justify-between gap-2">
        ${m.isOverlay && m.overlayKey ? `<button type="button" onclick="switchHistoricalOverlay('${escHtml(m.overlayKey)}'); window.scrollTo({top:0,behavior:'smooth'});" class="px-2.5 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold cursor-pointer">🗺️ Na mapu</button>` : `<span class="text-[10px] text-slate-500">${escHtml(m.archive)}</span>`}
        ${m.externalUrl ? `<a href="${escHtml(m.externalUrl)}" target="_blank" rel="noopener noreferrer" class="text-xs font-bold text-amber-800 hover:underline">Archiv ↗</a>` : ""}
      </div>
    </article>
  `).join("");
}

// --------------------------------------------------------------------------
// 7. REJSTŘÍK OBYVATEL (obyvatele.html)
// --------------------------------------------------------------------------
function switchInhabitantsTab(tab) {
  currentInhabTab = tab;
  document.querySelectorAll("[data-inhab-tab-btn]").forEach(btn => {
    const act = btn.dataset.inhabTabBtn === tab;
    btn.classList.toggle("bg-amber-800", act);
    btn.classList.toggle("text-white", act);
    btn.classList.toggle("bg-white", !act);
    btn.classList.toggle("text-amber-950", !act);
  });
  document.querySelectorAll("[data-inhab-panel]").forEach(p => {
    p.classList.toggle("hidden", p.dataset.inhabPanel !== tab);
  });
}

function getFilteredRegistry() {
  if (typeof censusRegistryData === "undefined") return [];
  const q = normSearch(currentRegSearch);
  const hq = normSearch(currentRegHouse);
  return censusRegistryData.filter(r => {
    if (currentRegYear !== "all" && String(r.censusYear) !== String(currentRegYear)) return false;
    if (currentRegCat !== "all" && r.categoryKey !== currentRegCat) return false;
    if (currentRegNat !== "all") {
      const nl = (r.nationality || "").toLowerCase();
      if (currentRegNat === "de" && !nl.includes("něm")) return false;
      if (currentRegNat === "cs" && !nl.includes("česk")) return false;
    }
    if (hq && String(r.houseNumber).toLowerCase() !== hq) return false;
    if (!q) return true;
    const blob = normSearch(`${r.fullName} ${r.houseNumber} ${r.birthPlace} ${r.domovska} ${r.occupation} ${r.employer} ${r.relation}`);
    return blob.includes(q);
  });
}

function setRegistryPage(page) {
  currentRegistryPage = Math.max(1, Number(page) || 1);
  renderRegistryTable();
}

function setRegistryPageSize(sz) {
  registryPageSize = Number(sz);
  currentRegistryPage = 1;
  renderRegistryTable();
}

function renderRegistryPaginationBar(total) {
  const bar = document.getElementById("registry-pagination-bar");
  if (!bar) return;
  if (total === 0) {
    bar.innerHTML = "";
    bar.classList.add("hidden");
    return;
  }
  bar.classList.remove("hidden");
  const eff = registryPageSize > 0 ? registryPageSize : total;
  const totalPages = Math.max(1, Math.ceil(total / eff));
  if (currentRegistryPage > totalPages) currentRegistryPage = totalPages;
  const startIdx = (currentRegistryPage - 1) * eff + 1;
  const endIdx = Math.min(total, currentRegistryPage * eff);

  const pageBtns = [];
  if (totalPages > 1) {
    const pages = [...new Set([1, totalPages, currentRegistryPage - 1, currentRegistryPage, currentRegistryPage + 1])]
      .filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b);
    let prev = 0;
    pages.forEach(p => {
      if (prev && p - prev > 1) pageBtns.push(`<span class="px-1 text-slate-400">…</span>`);
      const act = p === currentRegistryPage;
      pageBtns.push(`<button type="button" onclick="setRegistryPage(${p})" class="px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer ${act ? "bg-amber-800 text-white border-amber-900" : "bg-white hover:bg-amber-100 text-slate-700 border-amber-200"}">${p}</button>`);
      prev = p;
    });
  }

  bar.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs">
      <div>Zobrazeno <strong>${startIdx}–${endIdx}</strong> z <strong>${total}</strong> záznamů (${currentRegistryPage}/${totalPages})</div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-1">
          <span class="text-[11px] text-slate-500 font-bold">Na stránku:</span>
          ${[50, 100, 0].map(sz => `<button type="button" onclick="setRegistryPageSize(${sz})" class="px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer ${registryPageSize === sz ? "bg-amber-800 text-white border-amber-900" : "bg-white hover:bg-amber-100 border-amber-200"}">${sz === 0 ? "Vše" : sz}</button>`).join("")}
        </div>
        ${totalPages > 1 ? `
          <div class="flex items-center gap-1">
            <button type="button" onclick="setRegistryPage(${currentRegistryPage - 1})" ${currentRegistryPage <= 1 ? "disabled" : ""} class="px-2.5 py-1 rounded-lg border bg-white disabled:opacity-40 cursor-pointer font-bold">← Předchozí</button>
            ${pageBtns.join("")}
            <button type="button" onclick="setRegistryPage(${currentRegistryPage + 1})" ${currentRegistryPage >= totalPages ? "disabled" : ""} class="px-2.5 py-1 rounded-lg border bg-white disabled:opacity-40 cursor-pointer font-bold">Další →</button>
          </div>
        ` : ""}
      </div>
    </div>
  `;
}

function renderRegistryTable() {
  const tbody = document.getElementById("registry-table-body");
  if (!tbody) return;
  const filtered = getFilteredRegistry();
  lastRegistryRecords = filtered;

  const eff = registryPageSize > 0 ? registryPageSize : filtered.length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / Math.max(1, eff)));
  if (currentRegistryPage > totalPages) currentRegistryPage = totalPages;
  const start = (currentRegistryPage - 1) * eff;
  const slice = registryPageSize > 0 ? filtered.slice(start, start + eff) : filtered;

  renderRegistryPaginationBar(filtered.length);

  if (!slice.length) {
    tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-sm text-slate-500">Žádný záznam nevyhovuje aktuálnímu filtru.</td></tr>`;
    return;
  }

  tbody.innerHTML = slice.map(r => `
    <tr class="border-b border-amber-100 hover:bg-amber-50/50 transition-colors text-xs">
      <td data-label="Jméno" class="p-2.5 font-bold text-slate-900">
        <button type="button" onclick="openPersonModal('${escHtml(r.id)}')" class="text-left text-amber-950 hover:text-amber-700 underline decoration-amber-400 cursor-pointer font-extrabold">
          ${escHtml(r.fullName)}
        </button>
        <div class="mt-0.5"><span class="px-1.5 py-0.5 rounded text-[10px] font-bold border ${r.categoryBadgeClass}">${r.categoryIcon} ${escHtml(r.categoryLabel)}</span></div>
      </td>
      <td data-label="Sčítání" class="p-2.5 font-mono font-bold text-slate-700">${r.censusYear}${r.isSample ? " (vzorek)" : ""}</td>
      <td data-label="Dům" class="p-2.5"><a href="mapa.html#house=${escHtml(r.houseId)}" class="px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold border border-amber-300">čp. ${escHtml(r.houseNumber)}</a></td>
      <td data-label="Postavení" class="p-2.5 text-slate-700">${escHtml(r.relation)}</td>
      <td data-label="Narození & Místo" class="p-2.5 text-slate-700">${escHtml(r.birthDate)}${r.birthPlace && r.birthPlace !== "-" ? `<br><span class="text-[11px] text-slate-500">${escHtml(r.birthPlace)}</span>` : ""}</td>
      <td data-label="Povolání" class="p-2.5 text-slate-700">${escHtml(r.occupation)}${r.employer ? `<br><span class="text-[11px] text-slate-500">${escHtml(r.employer)}</span>` : ""}</td>
      <td data-label="Scan" class="p-2.5">
        ${r.scanFile ? `<button type="button" onclick="openArchiveViewer('${escHtml(r.scanFile)}', '${escHtml(r.scanTitle || r.fullName)}', '${escHtml(r.notes)}', '', '${escHtml(r.originalUrl || "")}')" class="px-2 py-1 rounded bg-amber-800 hover:bg-amber-900 text-white font-bold cursor-pointer">📜</button>` : `<span class="text-slate-400">ARON</span>`}
      </td>
    </tr>
  `).join("");
}

function renderLinkedPeopleSection() {
  const container = document.getElementById("linked-people-grid");
  if (!container || typeof censusLinksData === "undefined") return;
  const list = (censusLinksData.linkedPeople || []).slice(0, 60);
  container.innerHTML = list.map(lp => `
    <div onclick="openPersonModal('${escHtml(lp.id)}')" class="parchment-card p-4 rounded-xl border border-amber-200 hover:border-amber-500 cursor-pointer flex flex-col justify-between gap-2">
      <div>
        <div class="flex items-center justify-between text-[11px]">
          <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-950 font-bold">čp. ${escHtml(lp.houseNumber)}</span>
          <span class="font-mono text-slate-600">${escHtml(lp.lifeSpan)}</span>
        </div>
        <h4 class="text-sm font-extrabold text-slate-900 mt-1.5">${escHtml(lp.name)}</h4>
        <p class="text-xs text-slate-600 mt-0.5">${escHtml(lp.role || "-")}</p>
      </div>
      <div class="pt-2 border-t border-amber-100 flex items-center justify-between text-[11px]">
        <span class="text-emerald-800 font-bold">${lp.censusCount}× sčítání • ${lp.parishCount}× matrika</span>
        <span class="text-amber-800 font-bold">Detail →</span>
      </div>
    </div>
  `).join("");
}

function renderPeopleProfiles() {
  const grid = document.getElementById("people-cards-grid");
  if (!grid || typeof peopleData === "undefined") return;
  grid.innerHTML = peopleData.map(p => `
    <div onclick="openPersonModal('${escHtml(p.id)}')" class="parchment-card p-5 rounded-2xl border border-amber-200 hover:border-amber-500 cursor-pointer flex flex-col justify-between group">
      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">čp. ${escHtml(p.houseNumber)}</span>
          <span class="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">${escHtml(p.lifeSpan)}</span>
        </div>
        <span class="px-2 py-0.5 text-[10px] font-bold rounded border inline-flex items-center gap-1 ${p.categoryBadgeClass}">${p.categoryIcon} ${escHtml(p.categoryLabel)}</span>
        <h3 class="text-base sm:text-lg font-bold text-slate-900 group-hover:text-amber-800 font-heading mt-1.5">${escHtml(p.name)}</h3>
        <p class="text-xs text-amber-900 font-semibold mb-1.5">${escHtml(p.role)}</p>
        <p class="text-xs text-slate-600 line-clamp-3 leading-relaxed">${escHtml(p.biography)}</p>
      </div>
      <div class="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-xs">
        <span class="text-[11px] text-slate-500">📚 ${(p.events?.length || 0) + (p.linkedCensusIds?.length || 0)} vazeb</span>
        <span class="font-bold text-amber-800">Zobrazit profil →</span>
      </div>
    </div>
  `).join("");
}

function getFilteredParishRegisters() {
  if (typeof parishRegistersData === "undefined" || !Array.isArray(parishRegistersData.entries)) return [];
  const q = normSearch(currentParishSearch);
  return parishRegistersData.entries.filter(e => {
    if (currentParishVol !== "all" && String(e.sign) !== String(currentParishVol)) return false;
    if (currentParishType !== "all" && String(e.record_type) !== String(currentParishType)) return false;
    if (!showDisputedParish && e.epistemic === "doc_disputed") return false;
    if (!q) return true;
    const blob = normSearch([
      e.sign, e.parish, e.record_type, e.year, e.date_raw, e.village_tag,
      e.subject, e.father, e.mother, e.surname_norm, e.house_number,
      e.godparents_or_witnesses, e.transcription, e.notes
    ].join(" "));
    return blob.includes(q);
  });
}

function renderParishVolumesSummary() {
  const box = document.getElementById("parish-volumes-summary");
  if (!box || typeof parishRegistersData === "undefined") return;
  const vols = parishRegistersData.volumes || [];
  const statusMap = {
    completed: { label: "100 % vytěženo", cls: "bg-emerald-100 text-emerald-950 border-emerald-300" },
    in_progress: { label: "Rozpracováno", cls: "bg-amber-100 text-amber-950 border-amber-300" },
    t0_mapped: { label: "T0 zmapováno", cls: "bg-sky-100 text-sky-950 border-sky-300" },
    t0_mapping: { label: "T0 mapování", cls: "bg-slate-100 text-slate-700 border-slate-300" }
  };
  box.innerHTML = vols.map(v => {
    const st = statusMap[v.status] || statusMap.t0_mapping;
    return `
      <div class="parchment-card p-3.5 rounded-xl border border-amber-200 flex flex-col justify-between gap-2 text-xs">
        <div>
          <div class="flex items-center justify-between gap-1">
            <span class="font-mono font-extrabold text-amber-950">sign. ${escHtml(v.sign)}</span>
            <span class="px-1.5 py-0.5 rounded border text-[10px] font-bold ${st.cls}">${escHtml(st.label)}</span>
          </div>
          <div class="font-bold text-slate-900 mt-1">${escHtml(v.parish_short)} (${escHtml(v.dates)})</div>
          <div class="text-[11px] text-slate-600 mt-0.5">${v.total_scans} skenů • ${(v.types || []).join("/")}</div>
          <div class="text-[11px] font-bold text-emerald-900 mt-1">${v.verified_count || 0} ověřených zápisů${v.disputed_count ? ` (+${v.disputed_count} sporných)` : ""}</div>
        </div>
        <div class="pt-2 border-t border-amber-100 flex items-center justify-between gap-1.5 text-[11px]">
          ${v.proof_scan ? `<button type="button" onclick="openArchiveViewer('${escHtml(v.proof_scan)}', 'Matrika ${escHtml(v.sign)} (${escHtml(v.parish_short)})', '${escHtml(v.proof_caption || v.notes)}', '', '${escHtml(v.permalink || "")}')" class="px-2 py-1 rounded bg-amber-800 hover:bg-amber-900 text-white font-bold cursor-pointer">📜 Ukázka</button>` : `<span class="text-slate-400">Bez náhledu</span>`}
          <a href="${escHtml(v.permalink)}" target="_blank" rel="noopener noreferrer" class="underline font-bold text-amber-900 hover:text-amber-700">ARON ↗</a>
        </div>
      </div>
    `;
  }).join("");
}

function setParishPage(page) {
  currentParishPage = Math.max(1, Number(page) || 1);
  renderParishRegistersTable();
}

function setParishPageSize(sz) {
  parishPageSize = Number(sz);
  currentParishPage = 1;
  renderParishRegistersTable();
}

function renderParishPaginationBar(total) {
  const bar = document.getElementById("parish-pagination-bar");
  if (!bar) return;
  if (total === 0) {
    bar.innerHTML = `<div class="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-slate-600">Žádné předfarní záznamy neodpovídají filtru (nebo vytěžení prvního svazku 2-8336 právě probíhá).</div>`;
    return;
  }
  const eff = parishPageSize > 0 ? parishPageSize : total;
  const totalPages = Math.max(1, Math.ceil(total / eff));
  if (currentParishPage > totalPages) currentParishPage = totalPages;
  const startIdx = (currentParishPage - 1) * eff + 1;
  const endIdx = Math.min(total, currentParishPage * eff);
  const pageBtns = [];
  if (totalPages > 1) {
    const pages = [...new Set([1, totalPages, currentParishPage - 1, currentParishPage, currentParishPage + 1])]
      .filter(p => p >= 1 && p <= totalPages).sort((a, b) => a - b);
    let prev = 0;
    pages.forEach(p => {
      if (prev && p - prev > 1) pageBtns.push(`<span class="px-1 text-slate-400">…</span>`);
      const act = p === currentParishPage;
      pageBtns.push(`<button type="button" onclick="setParishPage(${p})" class="px-2.5 py-1 rounded-lg border text-xs font-bold cursor-pointer ${act ? "bg-amber-800 text-white border-amber-900" : "bg-white hover:bg-amber-100 text-slate-700 border-amber-200"}">${p}</button>`);
      prev = p;
    });
  }
  bar.innerHTML = `
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs">
      <div>Zobrazeno <strong>${startIdx}–${endIdx}</strong> z <strong>${total}</strong> matričních zápisů (${currentParishPage}/${totalPages})</div>
      <div class="flex flex-wrap items-center gap-2">
        <div class="flex items-center gap-1">
          <span class="text-[11px] text-slate-500 font-bold">Na stránku:</span>
          ${[50, 100, 0].map(sz => `<button type="button" onclick="setParishPageSize(${sz})" class="px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer ${parishPageSize === sz ? "bg-amber-800 text-white border-amber-900" : "bg-white hover:bg-amber-100 border-amber-200"}">${sz === 0 ? "Vše" : sz}</button>`).join("")}
        </div>
        ${totalPages > 1 ? `
          <div class="flex items-center gap-1">
            <button type="button" onclick="setParishPage(${currentParishPage - 1})" ${currentParishPage <= 1 ? "disabled" : ""} class="px-2.5 py-1 rounded-lg border bg-white disabled:opacity-40 cursor-pointer font-bold">← Předchozí</button>
            ${pageBtns.join("")}
            <button type="button" onclick="setParishPage(${currentParishPage + 1})" ${currentParishPage >= totalPages ? "disabled" : ""} class="px-2.5 py-1 rounded-lg border bg-white disabled:opacity-40 cursor-pointer font-bold">Další →</button>
          </div>
        ` : ""}
      </div>
    </div>
  `;
}

function renderParishRegistersTable() {
  const tbody = document.getElementById("parish-table-body");
  if (!tbody) return;
  const filtered = getFilteredParishRegisters();
  const eff = parishPageSize > 0 ? parishPageSize : Math.max(1, filtered.length);
  const totalPages = Math.max(1, Math.ceil(filtered.length / eff));
  if (currentParishPage > totalPages) currentParishPage = totalPages;
  const start = (currentParishPage - 1) * eff;
  const slice = parishPageSize > 0 ? filtered.slice(start, start + eff) : filtered;
  renderParishPaginationBar(filtered.length);

  if (!slice.length) {
    tbody.innerHTML = `<tr><td colspan="5" class="p-6 text-center text-sm text-slate-500">Žádný matriční záznam nevyhovuje aktuálnímu filtru.</td></tr>`;
    return;
  }

  const typeBadges = {
    N: { label: "N (Křest)", cls: "bg-emerald-100 text-emerald-950 border-emerald-300" },
    O: { label: "O (Sňatek)", cls: "bg-amber-100 text-amber-950 border-amber-300" },
    Z: { label: "Z (Úmrtí)", cls: "bg-stone-200 text-stone-900 border-stone-300" }
  };

  tbody.innerHTML = slice.map(e => {
    const tb = typeBadges[e.record_type] || { label: e.record_type || "?", cls: "bg-slate-100 text-slate-800 border-slate-300" };
    const isDisputed = e.epistemic === "doc_disputed";
    const parents = [e.father, e.mother].filter(Boolean).join(" & ");
    const witnesses = e.godparents_or_witnesses ? `<div class="text-[11px] text-slate-500 mt-0.5">Kmotři/svědci: ${escHtml(e.godparents_or_witnesses)}</div>` : "";
    const houseBadge = e.house_number ? `<span class="ml-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-950 font-mono text-[10px] border border-amber-300">${escHtml(e.house_number)}</span>` : "";
    return `
      <tr class="border-b border-amber-100 hover:bg-amber-50/50 transition-colors text-xs ${isDisputed ? "bg-rose-50/40" : ""}">
        <td data-label="Datum & Typ" class="p-2.5 align-top">
          <div class="font-bold text-slate-900">${escHtml(e.date_raw || String(e.year || ""))}</div>
          <div class="mt-1 flex flex-wrap gap-1">
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold border ${tb.cls}">${escHtml(tb.label)}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold border ${isDisputed ? "bg-rose-100 text-rose-950 border-rose-300" : "bg-sky-50 text-sky-900 border-sky-200"}">${isDisputed ? "sporné [doc]" : "[doc]"}</span>
          </div>
        </td>
        <td data-label="Osoba / Rod" class="p-2.5 align-top">
          <div class="font-extrabold text-amber-950">${escHtml(e.subject || e.surname_norm || "-")}${houseBadge}</div>
          ${e.surname_norm ? `<div class="text-[11px] text-slate-500">Rod: <strong>${escHtml(e.surname_norm)}</strong></div>` : ""}
        </td>
        <td data-label="Rodiče / Partneři" class="p-2.5 align-top text-slate-700">
          ${parents ? escHtml(parents) : `<span class="text-slate-400">–</span>`}
          ${witnesses}
        </td>
        <td data-label="Značka & Přepis" class="p-2.5 align-top text-slate-700">
          <div class="text-[11px] font-mono text-amber-900">${escHtml(e.village_tag || "Petersdorf")}</div>
          <div class="italic text-slate-800 mt-0.5">${escHtml(e.transcription || "")}</div>
          ${e.notes ? `<div class="text-[11px] text-slate-500 mt-0.5">${escHtml(e.notes)}</div>` : ""}
        </td>
        <td data-label="Matrika & Sken" class="p-2.5 align-top whitespace-nowrap">
          <div class="font-mono font-bold text-slate-800">${escHtml(e.sign)} • sn. ${escHtml(e.scan)}</div>
          ${e.folio ? `<div class="text-[11px] text-slate-500">${escHtml(e.folio)}</div>` : ""}
          <div class="mt-1 flex flex-wrap gap-1">
            ${e.scan_file ? `<button type="button" onclick="openArchiveViewer('${escHtml(e.scan_file)}', '${escHtml(e.sign)} • sn. ${escHtml(e.scan)}', '${escHtml(e.subject || e.date_raw)}', '', '${escHtml(e.aron_url || "")}')" class="px-2 py-0.5 rounded bg-amber-800 hover:bg-amber-900 text-white font-bold cursor-pointer">📜</button>` : ""}
            ${e.aron_url ? `<a href="${escHtml(e.aron_url)}" target="_blank" rel="noopener noreferrer" class="px-2 py-0.5 rounded border border-amber-300 bg-white text-amber-900 font-bold hover:bg-amber-100">ARON ↗</a>` : ""}
          </div>
        </td>
      </tr>
    `;
  }).join("");
}

function initInhabitantsPage() {
  const params = new URLSearchParams(window.location.search);
  const hq = params.get("house");
  if (hq) {
    currentRegHouse = hq;
    const hInput = document.getElementById("reg-house-filter");
    if (hInput) hInput.value = hq;
  }
  renderRegistryTable();
  renderLinkedPeopleSection();
  renderPeopleProfiles();
  renderParishVolumesSummary();
  renderParishRegistersTable();
  const tabParam = params.get("tab");
  if (window.location.hash === "#parish" || tabParam === "parish") {
    switchInhabitantsTab("parish");
  } else if (window.location.hash.startsWith("#person=")) {
    openPersonModal(decodeURIComponent(window.location.hash.slice(8)));
  }
}

// --------------------------------------------------------------------------
// 8. DEMOGRAFIE & EKONOMIKA (demografie.html) – SVG grafy
// --------------------------------------------------------------------------
function switchDemographyTab(tabKey) {
  currentDemographyTab = tabKey;
  document.querySelectorAll("[data-demo-tab-btn]").forEach(b => {
    const act = b.dataset.demoTabBtn === tabKey;
    b.classList.toggle("bg-amber-800", act);
    b.classList.toggle("text-white", act);
    b.classList.toggle("bg-white", !act);
    b.classList.toggle("text-amber-950", !act);
  });
  document.querySelectorAll("[data-demo-panel]").forEach(p => {
    p.classList.toggle("hidden", p.dataset.demoPanel !== tabKey);
  });
}

function selectDemographyYearIdx(idx) {
  selectedDemographyPointIdx = idx;
  renderDemographyLongTermSvg();
}

function renderDemographyLongTermSvg() {
  const box = document.getElementById("demo-longterm-chart-box");
  if (!box || typeof demographyData === "undefined") return;
  const allSeries = demographyData.populationSeries;
  const chartSeries = allSeries.filter(r => r.pop != null);
  const idx = selectedDemographyPointIdx !== null
    ? selectedDemographyPointIdx
    : Math.max(0, chartSeries.findIndex(r => r.year === 1921));
  const sel = chartSeries[idx] || chartSeries[0];
  const preRow = allSeries.find(r => r.year === 1654);

  const W = 860, H = 330, padL = 52, padR = 46, padT = 28, padB = 42;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const minY = 1830, maxY = 2030, maxPop = 950, maxH = 180;
  const xOf = yr => +(padL + ((yr - minY) / (maxY - minY)) * plotW).toFixed(1);
  const yPop = v => +(padT + plotH - (v / maxPop) * plotH).toFixed(1);
  const yHouse = v => +(padT + plotH - (v / maxH) * plotH).toFixed(1);

  const popPts = chartSeries.map((r, i) => [xOf(r.numYear), yPop(r.pop), i, r]);
  const housePts = chartSeries.filter(r => r.houses != null).map((r, i) => [xOf(r.numYear), yHouse(r.houses), i, r]);
  const popPath = popPts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const housePath = housePts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");

  box.innerHTML = `
    <div class="p-3 bg-indigo-50/70 rounded-xl border border-indigo-200 mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
      <div class="flex flex-wrap items-center gap-2">
        <span class="px-2.5 py-0.5 rounded bg-indigo-950 text-white font-mono font-extrabold">${sel.year}</span>
        <strong class="text-indigo-950">👥 ${sel.est ? "~" : ""}${sel.pop} obyvatel</strong>
        ${sel.houses != null ? `<strong class="text-rose-800">🏠 ${sel.houses} domů</strong>` : ""}
        <span class="text-slate-600">(${escHtml(sel.source)})</span>
      </div>
      <span class="italic text-slate-700">${escHtml(sel.note)}</span>
    </div>
    <svg viewBox="0 0 ${W} ${H}" class="w-full h-auto bg-white rounded-xl border border-amber-200">
      ${[0, 200, 400, 600, 800].map(v => `<line x1="${padL}" y1="${yPop(v)}" x2="${W - padR}" y2="${yPop(v)}" stroke="#f1f5f9" /><text x="${padL - 8}" y="${yPop(v) + 4}" text-anchor="end" font-size="11" fill="#64748b">${v}</text>`).join("")}
      ${[1836, 1869, 1880, 1900, 1921, 1950, 1980, 2001, 2026].map(yr => `<line x1="${xOf(yr)}" y1="${padT}" x2="${xOf(yr)}" y2="${padT + plotH}" stroke="#f8fafc" /><text x="${xOf(yr)}" y="${H - 14}" text-anchor="middle" font-size="11" fill="#64748b">${yr}</text>`).join("")}
      <path d="${popPath}" fill="none" stroke="#1e3a8a" stroke-width="3" />
      <path d="${housePath}" fill="none" stroke="#be123c" stroke-width="2.2" stroke-dasharray="5 3" />
      ${popPts.map(([px, py, i, r]) => `<g class="cursor-pointer" onclick="selectDemographyYearIdx(${i})"><circle cx="${px}" cy="${py}" r="${i === idx ? 7 : 4.5}" fill="${i === idx ? "#f59e0b" : "#1e3a8a"}" stroke="#fff" stroke-width="1.5" /><title>${r.year}: ${r.pop} obyv.</title></g>`).join("")}
      ${housePts.map(([hx, hy, , r]) => `<circle cx="${hx}" cy="${hy}" r="3.5" fill="#be123c"><title>${r.year}: ${r.houses} domů</title></circle>`).join("")}
    </svg>
    <p class="text-[11px] text-slate-600 mt-2">💡 Modrá čára = počet obyvatel (1836–2026, maximum <strong>882</strong> v r. 1880); červená přerušovaná = doložený počet domů (1836–1921). ${preRow ? `<strong>Předkatastrální základ (${preRow.year}, Berní rula):</strong> ${escHtml(preRow.housesText)} — ${escHtml(preRow.note)}` : ""}</p>
  `;
}

function renderDemography1921Breakdown() {
  const box = document.getElementById("demo-1921-breakdown-box");
  if (!box || typeof censusRegistryData === "undefined") return;
  const r21 = censusRegistryData.filter(r => r.censusYear === 1921);

  const ageBuckets = [
    { label: "0–9 let", min: 0, max: 9, m: 0, f: 0 },
    { label: "10–19 let", min: 10, max: 19, m: 0, f: 0 },
    { label: "20–29 let", min: 20, max: 29, m: 0, f: 0 },
    { label: "30–39 let", min: 30, max: 39, m: 0, f: 0 },
    { label: "40–49 let", min: 40, max: 49, m: 0, f: 0 },
    { label: "50–59 let", min: 50, max: 59, m: 0, f: 0 },
    { label: "60+ let", min: 60, max: 120, m: 0, f: 0 }
  ];
  const birthPlaces = new Map();
  const occGroups = new Map();

  r21.forEach(r => {
    if (r.birthYear) {
      const age = 1921 - r.birthYear;
      const b = ageBuckets.find(x => age >= x.min && age <= x.max);
      if (b) {
        if (r.sex === "Ž") b.f++;
        else b.m++;
      }
    }
    const bp = (r.birthPlace || "").split(",")[0].trim();
    if (bp && bp !== "-") {
      const cleanBp = /^č\.?s\.?\s*petrovice|^čes\.\s*petrovice/i.test(bp) ? "České Petrovice (rodáci)" : bp;
      birthPlaces.set(cleanBp, (birthPlaces.get(cleanBp) || 0) + 1);
    }
    const oc = (r.occupation || "").toLowerCase();
    if (oc && oc !== "-" && !oc.includes("(15)") && !oc.includes("(16)")) {
      let grp = "Ostatní / domácnost";
      if (oc.includes("tkadl") || oc.includes("tkalc") || oc.includes("knofl")) grp = "Tkalcovství & textil";
      else if (oc.includes("zeměděl") || oc.includes("kočí")) grp = "Zemědělství & chov";
      else if (oc.includes("vede domácnost")) grp = "Vedení domácnosti";
      else if (oc.includes("zedn") || oc.includes("tesař") || oc.includes("truhlář") || oc.includes("dřevař") || oc.includes("obuv") || oc.includes("mlynář") || oc.includes("hostin") || oc.includes("pekař")) grp = "Řemesla, mlýn & hostinec";
      else if (oc.includes("stráž") || oc.includes("učitel") || oc.includes("kněz") || oc.includes("porodní")) grp = "Správa, stráž, škola & fara";
      else if (oc.includes("výměnk") || oc.includes("invalida")) grp = "Výměnkáři & důchodci";
      occGroups.set(grp, (occGroups.get(grp) || 0) + 1);
    }
  });

  const maxPyramid = Math.max(1, ...ageBuckets.map(b => Math.max(b.m, b.f)));
  const topOrigins = [...birthPlaces.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
  const topOcc = [...occGroups.entries()].sort((a, b) => b[1] - a[1]);

  box.innerHTML = `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div class="p-4 bg-white rounded-xl border border-amber-200 space-y-2.5">
        <h4 class="text-sm font-extrabold font-heading text-amber-950">🎂 Věková pyramida všech 467 obyvatel (1921)</h4>
        <div class="space-y-1.5 text-xs">
          ${[...ageBuckets].reverse().map(b => `
            <div class="grid grid-cols-12 items-center gap-1.5">
              <div class="col-span-4 flex justify-end items-center gap-1">
                <span class="font-mono text-[10px] text-sky-900">${b.m}</span>
                <div class="h-4 bg-sky-700 rounded-l" style="width: ${Math.round((b.m / maxPyramid) * 100)}%"></div>
              </div>
              <div class="col-span-4 text-center font-bold text-slate-700">${b.label}</div>
              <div class="col-span-4 flex items-center gap-1">
                <div class="h-4 bg-rose-600 rounded-r" style="width: ${Math.round((b.f / maxPyramid) * 100)}%"></div>
                <span class="font-mono text-[10px] text-rose-900">${b.f}</span>
              </div>
            </div>
          `).join("")}
        </div>
        <p class="text-[11px] text-slate-500">Modře = muži (M), červeně = ženy (Ž) podle data narození ve sčítání 1921.</p>
      </div>

      <div class="space-y-4">
        <div class="p-4 bg-white rounded-xl border border-amber-200">
          <h4 class="text-sm font-extrabold font-heading text-amber-950 mb-2">🧭 Rodiště / místa původu zapsaná v r. 1921</h4>
          <div class="space-y-1.5 text-xs">
            ${topOrigins.map(([name, cnt]) => `
              <div class="flex items-center justify-between gap-2">
                <span class="font-semibold text-slate-800">${escHtml(name)}</span>
                <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-950 font-mono font-bold">${cnt} os.</span>
              </div>
            `).join("")}
          </div>
        </div>
        <div class="p-4 bg-white rounded-xl border border-amber-200">
          <h4 class="text-sm font-extrabold font-heading text-amber-950 mb-2">⚒️ Hlavní skupiny obživy (1921)</h4>
          <div class="space-y-1.5 text-xs">
            ${topOcc.map(([name, cnt]) => `
              <div class="flex items-center justify-between gap-2">
                <span class="font-semibold text-slate-800">${escHtml(name)}</span>
                <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950 font-mono font-bold">${cnt}×</span>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderDemographySection() {
  if (typeof demographyData === "undefined") return;
  const kpi = document.getElementById("demography-kpi-grid");
  if (kpi) {
    kpi.innerHTML = `
      <div class="p-4 rounded-xl bg-white border border-amber-200">
        <span class="text-xs font-bold text-amber-900 uppercase">Maximum osídlení (1880)</span>
        <div class="text-2xl font-extrabold text-amber-950 mt-0.5">882 obyvatel</div>
        <p class="text-xs text-slate-600 mt-1">1869: 869 • 1880: 882 • 1890: 876 (157 domů).</p>
      </div>
      <div class="p-4 rounded-xl bg-white border border-amber-200">
        <span class="text-xs font-bold text-amber-900 uppercase">Sčítání 1910 (PO/PZ)</span>
        <div class="text-2xl font-extrabold text-indigo-950 mt-0.5">531 přít. + 92 nepř.</div>
        <p class="text-xs text-slate-600 mt-1">487 DE / 41 CS / 3 ciz. • 272 skotu, 127 koz.</p>
      </div>
      <div class="p-4 rounded-xl bg-white border border-amber-200">
        <span class="text-xs font-bold text-amber-900 uppercase">Sčítání 1921 (100% archy)</span>
        <div class="text-2xl font-extrabold text-emerald-900 mt-0.5">467 obyvatel</div>
        <p class="text-xs text-slate-600 mt-1">143 archů • 392 DE (83,9 %) / 70 CS (15,0 %) / 5 ciz.</p>
      </div>
      <div class="p-4 rounded-xl bg-white border border-amber-200">
        <span class="text-xs font-bold text-amber-900 uppercase">Katastr k. ú. 622702 (RÚIAN 2026)</span>
        <div class="text-2xl font-extrabold text-slate-900 mt-0.5">629,83 ha</div>
        <p class="text-xs text-slate-600 mt-1">1 777 parcel • 37,7 % louky/TTP, 27,9 % les, 24,6 % orná.</p>
      </div>
    `;
  }

  renderDemographyLongTermSvg();
  renderDemography1921Breakdown();

  const revBox = document.getElementById("demo-1910-revision-box");
  if (revBox) {
    revBox.innerHTML = `
      <div class="space-y-3">
        ${demographyData.revision1910.layers.map(l => `
          <div class="p-3 bg-white rounded-xl border border-amber-200 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div>
              <strong class="text-amber-950">${escHtml(l.step)}</strong>
              <p class="text-slate-600">${escHtml(l.note)}</p>
            </div>
            <div class="flex gap-1.5 font-mono font-bold">
              <span class="px-2 py-0.5 rounded bg-sky-100 text-sky-950">DE: ${l.de}</span>
              <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-950">CS: ${l.cs}</span>
              <span class="px-2 py-0.5 rounded bg-stone-100 text-slate-700">Ciz.: ${l.foreign}</span>
            </div>
          </div>
        `).join("")}
        <p class="text-xs text-slate-600 italic">${escHtml(demographyData.revision1910.absentsNote)}</p>
      </div>
    `;
  }

  const landBox = document.getElementById("demo-land-livestock-box");
  if (landBox) {
    const lv = demographyData.livestock1910;
    const landRows = demographyData.landUseRuian2026 || [];
    landBox.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div class="p-4 bg-white rounded-xl border border-amber-200 space-y-2.5">
          <h4 class="text-sm font-extrabold font-heading text-amber-950">📐 Struktura půdy k. ú. 622702 (RÚIAN 2026: 629,83 ha / 1 777 parcel)</h4>
          ${landRows.map(u => `
            <div class="space-y-1 text-xs">
              <div class="flex justify-between font-bold"><span>${escHtml(u.label)}</span><span>${u.ha} ha (${u.pct} % · ${u.parcels} p.)</span></div>
              <div class="w-full h-3 bg-stone-100 rounded-full overflow-hidden"><div class="h-full rounded-full" style="width:${u.pct}%;background:${u.color}"></div></div>
            </div>
          `).join("")}
          ${demographyData.landUseNote ? `<p class="text-[11px] text-slate-600 pt-1 italic">${escHtml(demographyData.landUseNote)}</p>` : ""}
        </div>
        <div class="p-4 bg-white rounded-xl border border-amber-200 space-y-2.5">
          <h4 class="text-sm font-extrabold font-heading text-amber-950">🐄 Hospodářské zvířectvo 31. 12. 1910 (PZ)</h4>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            <div class="p-2.5 rounded-lg bg-amber-50 border border-amber-200"><span class="text-slate-500 block">Skot celkem</span><strong class="text-lg">${lv.cattle.total}</strong> (${lv.cattle.cows} krav)</div>
            <div class="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200"><span class="text-slate-500 block">Kozy</span><strong class="text-lg">${lv.goats.total}</strong></div>
            <div class="p-2.5 rounded-lg bg-rose-50 border border-rose-200"><span class="text-slate-500 block">Prasata</span><strong class="text-lg">${lv.pigs.total}</strong>${lv.pigs.actualTotal ? ` (skut. ${lv.pigs.actualTotal})` : ""}</div>
            <div class="p-2.5 rounded-lg bg-sky-50 border border-sky-200"><span class="text-slate-500 block">Koně</span><strong class="text-lg">${lv.horses.total}</strong></div>
            <div class="p-2.5 rounded-lg bg-yellow-50 border border-yellow-200"><span class="text-slate-500 block">Drůbež</span><strong class="text-lg">${lv.poultry.total}</strong>${lv.poultry.actualTotal ? ` (skut. ${lv.poultry.actualTotal})` : ""}</div>
            <div class="p-2.5 rounded-lg bg-stone-100 border border-stone-200"><span class="text-slate-500 block">Včelstva</span><strong class="text-lg">${lv.beehives.total}</strong></div>
          </div>
          ${lv.note ? `<p class="text-[11px] text-slate-600 pt-1 italic">${escHtml(lv.note)}</p>` : ""}
        </div>
      </div>
    `;
  }

  const crisesBox = document.getElementById("demo-crises-box");
  if (crisesBox) {
    crisesBox.innerHTML = demographyData.mortalityCrises.map(c => `
      <div class="p-4 bg-white rounded-xl border border-amber-200">
        <span class="px-2 py-0.5 rounded bg-rose-100 text-rose-950 font-mono text-[11px] font-bold">${escHtml(c.period)}</span>
        <h4 class="text-sm font-extrabold text-slate-900 mt-1.5">${escHtml(c.event)}</h4>
        <p class="text-xs text-slate-700 mt-1">${escHtml(c.detail)}</p>
      </div>
    `).join("");
  }
}

// --------------------------------------------------------------------------
// 9. REFERENCE & PRŮVODCE (reference.html)
// --------------------------------------------------------------------------
function switchReferenceTab(tab) {
  currentReferenceTab = tab;
  document.querySelectorAll("[data-ref-tab-btn]").forEach(b => {
    const act = b.dataset.refTabBtn === tab;
    b.classList.toggle("bg-amber-800", act);
    b.classList.toggle("text-white", act);
    b.classList.toggle("bg-white", !act);
    b.classList.toggle("text-amber-950", !act);
  });
  document.querySelectorAll("[data-ref-panel]").forEach(p => {
    p.classList.toggle("hidden", p.dataset.refPanel !== tab);
  });
}

function filterReferencesCategory(cat) {
  currentRefCategory = cat || "all";
  renderReferencesSection();
}

function copyCitationText(elId, btn) {
  const el = document.getElementById(elId);
  if (!el || !navigator.clipboard) return;
  navigator.clipboard.writeText(el.textContent.trim()).then(() => {
    const old = btn.textContent;
    btn.textContent = "✓ Zkopírováno";
    setTimeout(() => { btn.textContent = old; }, 1600);
  });
}

function renderReferencesSection() {
  if (typeof referencesData === "undefined") return;
  const lang = window.currentLang || "cs";
  const pick = (obj, base) => (lang === "en" && obj[base + "En"]) ? obj[base + "En"] : ((lang === "de" && obj[base + "De"]) ? obj[base + "De"] : obj[base]);

  const citeBox = document.getElementById("project-citation-box");
  if (citeBox && referencesData.projectCitation) {
    const pc = referencesData.projectCitation;
    const today = new Date().toISOString().slice(0, 10);
    const iso = pc.iso690Template.replace("{TODAY}", today);
    citeBox.innerHTML = `
      <div class="space-y-3 text-xs">
        <div class="p-3 bg-stone-50 rounded-xl border border-stone-200">
          <div class="flex items-center justify-between mb-1">
            <strong class="text-slate-700 uppercase text-[10px]">ČSN ISO 690</strong>
            <button type="button" onclick="copyCitationText('proj-iso-cit', this)" class="px-2 py-0.5 rounded bg-white border border-amber-300 font-bold cursor-pointer">📋 Kopírovat</button>
          </div>
          <p id="proj-iso-cit" class="font-mono text-slate-800 select-all">${escHtml(iso)}</p>
        </div>
        <div class="p-3 bg-amber-50/70 rounded-xl border border-amber-200">
          <p><strong>Licence &amp; poděkování:</strong> ${escHtml(pick(pc, "licenseNote"))}</p>
          <p class="mt-1 text-amber-950 font-semibold">✨ ${escHtml(pc.acknowledgment)}</p>
        </div>
      </div>
    `;
  }

  const filtersEl = document.getElementById("references-category-filters");
  if (filtersEl) {
    filtersEl.innerHTML = referencesData.categories.map(c => {
      const cnt = c.key === "all" ? referencesData.items.length : referencesData.items.filter(i => i.category === c.key).length;
      const act = currentRefCategory === c.key;
      return `
        <button type="button" onclick="filterReferencesCategory('${c.key}')" class="px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${act ? "bg-amber-800 text-white border-amber-900" : "bg-white hover:bg-amber-100 text-slate-700 border-amber-200"}">
          ${c.icon} ${escHtml(pick(c, "label"))} <span class="text-[10px] opacity-80">(${cnt})</span>
        </button>
      `;
    }).join("");
  }

  const grid = document.getElementById("references-grid");
  if (grid) {
    const q = normSearch(currentRefSearch);
    const list = referencesData.items.filter(it => {
      if (currentRefCategory !== "all" && it.category !== currentRefCategory) return false;
      if (!q) return true;
      return normSearch(`${it.title} ${it.institution} ${it.signature} ${it.description}`).includes(q);
    });
    grid.innerHTML = list.map(it => `
      <article class="parchment-card p-5 rounded-2xl border border-amber-200 flex flex-col justify-between gap-3">
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 font-bold border border-amber-300">${escHtml(pick(it, "typeLabel"))}</span>
            <span class="font-mono text-slate-600 bg-stone-100 px-2 py-0.5 rounded">${escHtml(it.year)}</span>
          </div>
          <h3 class="text-base font-extrabold font-heading text-slate-900">${escHtml(pick(it, "title"))}</h3>
          <p class="text-xs font-bold text-amber-900">🏛️ ${escHtml(pick(it, "institution"))}</p>
          <p class="text-[11px] font-mono bg-amber-50/70 p-2 rounded border border-amber-200 text-slate-700">${escHtml(it.signature)}</p>
          <p class="text-xs sm:text-sm text-slate-700 leading-relaxed">${escHtml(pick(it, "description"))}</p>
        </div>
        <div class="pt-2 border-t border-amber-100 space-y-2">
          <div class="p-2 bg-stone-50 rounded border border-stone-200 text-[11px] font-mono text-slate-700">
            <div class="flex justify-between mb-1">
              <span class="text-[10px] font-sans uppercase text-slate-500 font-bold">ČSN ISO 690</span>
              <button type="button" onclick="copyCitationText('cit-${escHtml(it.id)}', this)" class="px-1.5 py-0.5 rounded bg-white border border-amber-300 font-sans font-bold text-[10px] cursor-pointer">📋 Kopírovat</button>
            </div>
            <span id="cit-${escHtml(it.id)}">${escHtml(it.citationIso690)}</span>
          </div>
          ${it.url ? `<div class="flex justify-end"><a href="${escHtml(it.url)}" target="_blank" rel="noopener noreferrer" class="px-3 py-1 rounded-lg bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold">Digitální zdroj ↗</a></div>` : ""}
        </div>
      </article>
    `).join("");
  }

  const dlBox = document.getElementById("downloadable-works-box");
  if (dlBox && referencesData.downloadableWorks) {
    dlBox.innerHTML = referencesData.downloadableWorks.groups.map(g => `
      <div class="parchment-card p-5 rounded-2xl border border-amber-200 space-y-3">
        <h3 class="text-base font-extrabold font-heading text-amber-950">${escHtml(g.title)}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          ${g.items.map(it => `
            <a href="${escHtml(it.url)}" class="p-3 rounded-xl bg-amber-50/70 hover:bg-amber-100 border border-amber-200 flex items-center justify-between gap-2 text-xs">
              <div>
                <div class="font-bold text-slate-900">${escHtml(it.title)}</div>
                <div class="text-[11px] text-slate-600">${escHtml(it.note)}</div>
              </div>
              <span class="font-bold text-amber-800 shrink-0">↗</span>
            </a>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

  const guideBox = document.getElementById("guide-content-box");
  if (guideBox && typeof guideData !== "undefined") {
    const coa = guideData.jurisdiction.coatOfArms;
    guideBox.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div class="lg:col-span-5 parchment-card p-5 rounded-2xl border border-amber-200 space-y-3">
          <div class="flex items-center gap-4">
            <img src="${escHtml(coa.svgPath)}" alt="Znak obce České Petrovice" class="w-20 h-24 object-contain bg-white p-1.5 rounded-xl border border-amber-300 shadow-xs">
            <div>
              <span class="px-2 py-0.5 rounded bg-amber-100 text-amber-950 text-[10px] font-bold">REKOS č. ${escHtml(coa.rekosId)}</span>
              <h3 class="text-base font-extrabold font-heading text-slate-900 mt-1">Znak Českých Petrovic</h3>
              <p class="text-[11px] text-slate-600">${escHtml(coa.decision)}</p>
            </div>
          </div>
          <p class="text-xs italic bg-amber-50/80 p-3 rounded-xl border border-amber-200">„${escHtml(coa.blazon)}“</p>
          <p class="text-xs text-slate-700">${escHtml(coa.symbolism)}</p>
          <a href="${escHtml(coa.rekosUrl)}" target="_blank" rel="noopener noreferrer" class="inline-block px-3 py-1 rounded-lg bg-amber-800 text-white text-xs font-bold">Registr REKOS PČR ↗</a>
        </div>

        <div class="lg:col-span-7 parchment-card p-5 rounded-2xl border border-amber-200 space-y-3">
          <h3 class="text-base font-extrabold font-heading text-amber-950">⛪ Farní příslušnost a posloupnost matrik (1591–1949)</h3>
          <div class="space-y-2 text-xs">
            ${guideData.parishSuccession.map(ps => `
              <div class="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 flex flex-wrap justify-between gap-2">
                <div><strong>${escHtml(ps.period)}</strong> • <span class="text-amber-950 font-bold">${escHtml(ps.parish)}</span><div class="text-slate-600">${escHtml(ps.registers)} – ${escHtml(ps.note)}</div></div>
                <a href="${escHtml(ps.url)}" target="_blank" rel="noopener noreferrer" class="self-center px-2 py-1 rounded bg-white border border-amber-300 font-bold text-amber-900">ARON ↗</a>
              </div>
            `).join("")}
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
        <div class="parchment-card p-5 rounded-2xl border border-amber-200 space-y-2">
          <h3 class="text-base font-extrabold font-heading text-rose-950">⚠️ Pojistka proti homonymům</h3>
          ${guideData.homonyms.map(hm => `
            <div class="p-2.5 rounded-lg border text-xs ${hm.ok ? "bg-emerald-50 border-emerald-300" : "bg-rose-50/60 border-rose-200"}">
              <strong>${hm.ok ? "✅" : "❌"} ${escHtml(hm.name)}</strong> <span class="font-mono text-[11px] text-slate-600">(${escHtml(hm.id)})</span>
              <p class="text-slate-700">${escHtml(hm.note)}</p>
            </div>
          `).join("")}
        </div>
        <div class="parchment-card p-5 rounded-2xl border border-amber-200 space-y-2">
          <h3 class="text-base font-extrabold font-heading text-amber-950">📜 Badatelský slovníček (11 pojmů)</h3>
          <div class="space-y-1.5 text-xs">
            ${guideData.dictionary.map(d => `<div class="p-2 rounded bg-amber-50/50 border border-amber-100"><strong>${escHtml(d.term)}:</strong> ${escHtml(d.cz)}</div>`).join("")}
          </div>
        </div>
      </div>
    `;
  }
}

// --------------------------------------------------------------------------
// 10. INICIALIZACE PODLE STRÁNKY
// --------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body?.dataset?.page || "";
  applyLanguageToPage();

  if (page === "home") {
    renderNewsSection();
  } else if (page === "story") {
    renderStorySection();
  } else if (page === "map") {
    initInteractiveMap();
  } else if (page === "inhabitants") {
    initInhabitantsPage();
  } else if (page === "demography") {
    renderDemographySection();
  } else if (page === "references") {
    renderReferencesSection();
    if (window.location.hash === "#pruvodce") switchReferenceTab("pruvodce");
    else if (window.location.hash === "#prace") switchReferenceTab("prace");
  }
});
