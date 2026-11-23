// ==========================================================================
// TROJJAZYČNÁ LOKALIZACE PORTÁLU ČESKÉ PETROVICE (CZ / EN / DE)
// ==========================================================================

const SITE_STORAGE_LANG_KEY = "ceske_petrovice_lang";
window.currentLang = localStorage.getItem(SITE_STORAGE_LANG_KEY) || "cs";

const SITE_I18N = {
  cs: {
    siteTitle: "České Petrovice",
    siteSub: "Böhmisch Petersdorf • Historie, Sčítání 1869–1921 & Mapa",
    navHome: "Úvod",
    navStory: "Příběh",
    navMap: "Mapa & Stavení",
    navPeople: "Obyvatelé",
    navDemography: "Demografie",
    navReferences: "Reference",
    navCluster: "Clustery",
    searchPlaceholder: "Hledat čp., příjmení nebo místo narození...",
    btnClose: "Zavřít"
  },
  en: {
    siteTitle: "České Petrovice",
    siteSub: "Böhmisch Petersdorf • History, 1869–1921 Censuses & Map",
    navHome: "Home",
    navStory: "Story",
    navMap: "Map & Houses",
    navPeople: "Inhabitants",
    navDemography: "Demography",
    navReferences: "References",
    navCluster: "Cluster Lab",
    searchPlaceholder: "Search house No., surname or birthplace...",
    btnClose: "Close"
  },
  de: {
    siteTitle: "Böhmisch Petersdorf",
    siteSub: "České Petrovice • Geschichte, Zählungen 1869–1921 & Karte",
    navHome: "Start",
    navStory: "Geschichte",
    navMap: "Karte & Häuser",
    navPeople: "Einwohner",
    navDemography: "Demografie",
    navReferences: "Quellen",
    navCluster: "Cluster-Labor",
    searchPlaceholder: "Hausnummer, Nachname oder Geburtsort suchen...",
    btnClose: "Schließen"
  }
};

function setSiteLanguage(lang) {
  if (!SITE_I18N[lang]) lang = "cs";
  window.currentLang = lang;
  try {
    localStorage.setItem(SITE_STORAGE_LANG_KEY, lang);
  } catch (e) {}
  applyLanguageToPage();
}

function applyLanguageToPage() {
  const lang = window.currentLang || "cs";
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-lang-btn]").forEach(btn => {
    const isAct = btn.dataset.langBtn === lang;
    btn.classList.toggle("bg-amber-400", isAct);
    btn.classList.toggle("text-amber-950", isAct);
    btn.classList.toggle("font-extrabold", isAct);
    btn.classList.toggle("bg-amber-900/60", !isAct);
    btn.classList.toggle("text-amber-100", !isAct);
  });

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const dict = SITE_I18N[lang] || SITE_I18N.cs;
    if (dict[key]) el.textContent = dict[key];
  });

  if (typeof renderNewsSection === "function" && document.getElementById("news-cards-grid")) {
    renderNewsSection();
  }
  if (typeof renderReferencesSection === "function" && document.getElementById("references-grid")) {
    renderReferencesSection();
  }
  if (typeof renderDemographySection === "function" && document.getElementById("demography-kpi-grid")) {
    renderDemographySection();
  }
  if (typeof renderRegistryPaginationBar === "function" && typeof lastRegistryRecords !== "undefined" && document.getElementById("registry-pagination-bar")) {
    renderRegistryPaginationBar((lastRegistryRecords || []).length);
  }
}

function protectLocalizedDomSubtree() {
  // No-op kompatibilní hook pro podstromy s vlastním překladem
}
