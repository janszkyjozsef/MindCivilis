import { useMemo, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  LabelList,
} from "recharts";
import { ArrowRight, BookOpenText, ChartPolar, MapTrifold, Sparkle } from "@phosphor-icons/react";
import { DIMENSIONS, GROUPS, PRIMARY_ATLAS_DIMENSIONS } from "../data/dimensions.js";
import { QUESTIONNAIRE_BY_ID } from "../data/catalogue.js";
import { localize, t } from "../data/i18n.js";
import { getProfileMetrics, getTensions, getTopDimensions, interpretDimension } from "../lib/scoring.js";

const GROUP_ORDER = ["political", "values", "personality", "civic", "knowledge", "future", "dialogue", "community"];

function scoreEntries(profile, groupFilter = "all") {
  return Object.entries(profile.scores ?? {})
    .filter(([id]) => DIMENSIONS[id])
    .filter(([id]) => groupFilter === "all" || DIMENSIONS[id].group === groupFilter)
    .map(([id, score]) => ({
      id,
      score,
      confidence: profile.confidence?.[id] ?? 0.55,
      dimension: DIMENSIONS[id],
    }));
}

function AtlasDetail({ selectedId, profile, lang, onClose }) {
  const dimension = DIMENSIONS[selectedId];
  if (!dimension) return (
    <aside className="atlas-detail atlas-detail-empty">
      <Sparkle size={21} weight="duotone" />
      <p>{t(lang, "tapLayer")}</p>
    </aside>
  );
  const score = profile.scores[selectedId] ?? 50;
  const confidence = Math.round((profile.confidence?.[selectedId] ?? 0.55) * 100);
  const evidence = profile.evidence?.[selectedId];
  const evidenceTitle = evidence?.questionnaireId
    ? QUESTIONNAIRE_BY_ID[evidence.questionnaireId]?.title
      ? localize(QUESTIONNAIRE_BY_ID[evidence.questionnaireId].title, lang)
      : evidence.questionnaireId.startsWith("MindCivilis") ? t(lang, "demoProfileSource") : evidence.questionnaireId
    : t(lang, "demoProfileSource");
  return (
    <aside className="atlas-detail">
      <div className="detail-heading">
        <span className="detail-dot" style={{ background: dimension.color }} />
        <div>
          <p className="eyebrow">{localize(GROUPS[dimension.group]?.label, lang)}</p>
          <h3>{localize(dimension.label, lang)}</h3>
        </div>
        {onClose ? <button className="icon-button" onClick={onClose} aria-label={t(lang, "close")}>×</button> : null}
      </div>
      <div className="score-ring" style={{ "--score-color": dimension.color, "--score": `${score * 3.6}deg` }}>
        <strong>{score}</strong>
        <span>/ 100</span>
      </div>
      <div className="pole-line">
        <span>{localize(dimension.negativePole, lang)}</span>
        <span>{localize(dimension.positivePole, lang)}</span>
      </div>
      <div className="detail-section">
        <h4>{t(lang, "plainLanguage")}</h4>
        <p>{interpretDimension(selectedId, score, lang)}</p>
      </div>
      <div className="detail-section">
        <h4>{t(lang, "shapedLayer")}</h4>
        <p>{confidence}% {t(lang, "confidence").toLowerCase()} · {evidence?.answered ?? "—"}/{evidence?.total ?? "—"} {t(lang, "answerCount")}</p>
      </div>
      <div className="detail-section evidence-line">
        <h4>{t(lang, "evidenceSources")}</h4>
        <p>{evidenceTitle}</p>
      </div>
    </aside>
  );
}

function buildNetwork(profile, groupFilter, lang) {
  const allEntries = scoreEntries(profile, groupFilter);
  const entries = groupFilter === "all"
    ? GROUP_ORDER.flatMap((groupId) => allEntries
      .filter((entry) => entry.dimension.group === groupId)
      .sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50))
      .slice(0, 2))
    : allEntries;
  const groups = GROUP_ORDER.filter((groupId) => entries.some((entry) => entry.dimension.group === groupId));
  const elements = [{ data: { id: "identity", label: "MindCivilis\nIdentity", kind: "identity", score: 50, color: "#e9eef5" }, position: { x: 450, y: 305 } }];
  const groupRadius = groups.length === 1 ? 0 : 220;

  groups.forEach((groupId, groupIndex) => {
    const angle = groups.length === 1 ? -Math.PI / 2 : (Math.PI * 2 * groupIndex) / groups.length - Math.PI / 2;
    const groupX = 450 + Math.cos(angle) * groupRadius;
    const groupY = 305 + Math.sin(angle) * groupRadius;
    const group = GROUPS[groupId];
    const groupEntries = entries.filter((entry) => entry.dimension.group === groupId);
    elements.push({
      data: { id: `group-${groupId}`, label: localize(group.label, lang), kind: "group", score: Math.round(groupEntries.reduce((sum, entry) => sum + entry.score, 0) / groupEntries.length), color: group.color },
      position: { x: groups.length === 1 ? 450 : groupX, y: groups.length === 1 ? 200 : groupY },
    });
    elements.push({ data: { id: `edge-identity-${groupId}`, source: "identity", target: `group-${groupId}`, color: group.color, kind: "trunk" } });

    const childRadius = groups.length === 1 ? 205 : 92;
    groupEntries.forEach((entry, childIndex) => {
      const childAngle = groups.length === 1
        ? (Math.PI * 2 * childIndex) / groupEntries.length - Math.PI / 2
        : angle - 0.75 + (groupEntries.length === 1 ? 0.75 : (1.5 * childIndex) / (groupEntries.length - 1));
      const baseX = groups.length === 1 ? 450 : groupX;
      const baseY = groups.length === 1 ? 305 : groupY;
      elements.push({
        data: {
          id: entry.id,
          label: `${localize(entry.dimension.label, lang)}\n${entry.score}`,
          kind: "dimension",
          score: entry.score,
          confidence: entry.confidence,
          color: entry.dimension.color,
        },
        position: { x: baseX + Math.cos(childAngle) * childRadius, y: baseY + Math.sin(childAngle) * childRadius },
      });
      elements.push({ data: { id: `edge-${groupId}-${entry.id}`, source: `group-${groupId}`, target: entry.id, color: entry.dimension.color, kind: "branch" } });
    });
  });
  return elements;
}

export function ConstellationView({ profile, lang, groupFilter, selectedId, setSelectedId }) {
  const elements = useMemo(() => buildNetwork(profile, groupFilter, lang), [profile, groupFilter, lang]);
  const stylesheet = useMemo(() => [
    {
      selector: "node",
      style: {
        label: "data(label)",
        "text-wrap": "wrap",
        "text-max-width": 86,
        "text-valign": "center",
        "text-halign": "center",
        color: "#dce9f5",
        "font-size": 9,
        "font-family": "Inter, system-ui, sans-serif",
        "background-color": "#071725",
        "border-width": 1.4,
        "border-color": "data(color)",
        width: "mapData(score, 0, 100, 48, 67)",
        height: "mapData(score, 0, 100, 48, 67)",
      },
    },
    {
      selector: 'node[kind = "identity"]',
      style: {
        width: 116,
        height: 116,
        "font-family": "Cormorant Garamond, Georgia, serif",
        "font-size": 17,
        color: "#f7f1e8",
        "background-color": "#07111c",
        "border-width": 2,
        "border-color": "#3fa7ff",
      },
    },
    {
      selector: 'node[kind = "group"]',
      style: {
        width: 82,
        height: 82,
        "font-size": 10,
        "font-weight": 600,
        "background-color": "#0a1a27",
        "border-width": 2,
      },
    },
    {
      selector: "node:selected",
      style: {
        "border-width": 3,
        "overlay-opacity": 0,
      },
    },
    {
      selector: "edge",
      style: {
        width: 1,
        "line-color": "data(color)",
        "target-arrow-color": "data(color)",
        "curve-style": "bezier",
        opacity: 0.54,
      },
    },
    {
      selector: 'edge[kind = "branch"]',
      style: { "line-style": "dashed", "line-dash-pattern": [4, 5], opacity: 0.45 },
    },
  ], []);

  return (
    <div className="atlas-visual-shell constellation-shell">
      <div className="constellation-canvas" aria-label={t(lang, "viewConstellation")}>
        <div className="starfield" />
        <CytoscapeComponent
          elements={elements}
          stylesheet={stylesheet}
          layout={{ name: "preset", fit: true, padding: 44 }}
          minZoom={0.72}
          maxZoom={1.7}
          style={{ width: "100%", height: "100%", position: "relative", zIndex: 1 }}
          cy={(cy) => {
            cy.off("tap", "node");
            cy.on("tap", "node", (event) => {
              const id = event.target.id();
              if (DIMENSIONS[id]) setSelectedId(id);
            });
          }}
        />
        <div className="constellation-key"><span>{t(lang, "alignment")}</span><i /> <span>{t(lang, "tension")}</span><i className="dashed" /></div>
      </div>
      <AtlasDetail selectedId={selectedId} profile={profile} lang={lang} />
    </div>
  );
}

const RADAR_IDS = ["communityValue", "autonomyValue", "equalityValue", "democraticChecks", "futureOrientation", "epistemicCare"];

export function FieldbookView({ profile, lang, selectedId, setSelectedId }) {
  const metrics = getProfileMetrics(profile);
  const top = getTopDimensions(profile, 3);
  const tensions = getTensions(profile, 1);
  const rows = PRIMARY_ATLAS_DIMENSIONS.filter((id) => Number.isFinite(profile.scores[id])).slice(0, 8);
  const radar = RADAR_IDS.filter((id) => Number.isFinite(profile.scores[id])).map((id) => ({
    id,
    label: localize(DIMENSIONS[id].label, lang).split(" ").slice(0, 2).join(" "),
    score: profile.scores[id],
  }));
  return (
    <div className="fieldbook-scene">
      <section className="fieldbook-paper">
        <div className="paper-topline">
          <span>MindCivilis / {t(lang, "navAtlas")}</span>
          <span>{t(lang, "savedOn")} {new Intl.DateTimeFormat(lang, { dateStyle: "medium" }).format(new Date())}</span>
        </div>
        <h2>{t(lang, "fieldbookTitle")}</h2>
        <p className="paper-intro">{t(lang, "fieldbookBody")}</p>
        <div className="paper-rule-title">{t(lang, "identityLayers")}</div>
        <div className="fieldbook-content-grid">
          <div className="layer-ledger">
            {rows.map((id) => {
              const dimension = DIMENSIONS[id];
              const score = profile.scores[id];
              return (
                <button key={id} className={`ledger-row ${selectedId === id ? "active" : ""}`} onClick={() => setSelectedId(id)}>
                  <span className="ledger-label"><i style={{ background: dimension.color }} />{localize(dimension.label, lang)}</span>
                  <span className="ledger-track"><span style={{ left: `${score}%`, borderColor: dimension.color }} /></span>
                  <strong>{score}</strong>
                </button>
              );
            })}
          </div>
          <div className="fieldbook-radar">
            <p>{t(lang, "navAtlas")}</p>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radar} outerRadius="70%">
                <PolarGrid stroke="#b9b1a3" />
                <PolarAngleAxis dataKey="label" tick={{ fill: "#283649", fontSize: 10 }} />
                <Radar dataKey="score" stroke="#2356a5" fill="#3b6db8" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="metrics-strip">
              <span><strong>{metrics.confidence}%</strong>{t(lang, "confidence")}</span>
              <span><strong>{metrics.complexity}</strong>{t(lang, "complexity")}</span>
              <span><strong>{metrics.layers}</strong>{t(lang, "coverage")}</span>
            </div>
          </div>
        </div>
        <div className="paper-rule-title">{t(lang, "topDrivers")}</div>
        <div className="fieldbook-insights">
          {top.map(({ id, score }, index) => (
            <button key={id} className="paper-insight" onClick={() => setSelectedId(id)}>
              <span className="paper-icon" style={{ color: DIMENSIONS[id].color }}>{index === 0 ? <Sparkle /> : index === 1 ? <ChartPolar /> : <MapTrifold />}</span>
              <span><strong>{localize(DIMENSIONS[id].label, lang)}</strong><small>{interpretDimension(id, score, lang)}</small></span>
              <ArrowRight />
            </button>
          ))}
          {tensions.length ? (
            <button className="paper-insight tension-card" onClick={() => setSelectedId(tensions[0].a)}>
              <span className="paper-icon"><BookOpenText /></span>
              <span><strong>{t(lang, "tensions")}</strong><small>{localize(DIMENSIONS[tensions[0].a].label, lang)} × {localize(DIMENSIONS[tensions[0].b].label, lang)}</small></span>
              <ArrowRight />
            </button>
          ) : null}
        </div>
        <div className="paper-footer">MindCivilis · {t(lang, "privateByDesign")} · {t(lang, "notUploaded")}</div>
      </section>
      <div className="fieldbook-tabs"><span>Atlas</span><span>Values</span><span>Views</span><span>Notes</span></div>
      <AtlasDetail selectedId={selectedId} profile={profile} lang={lang} />
    </div>
  );
}

const TERRAIN_ANCHORS = {
  community: { x: 24, y: 45 },
  civic: { x: 36, y: 25 },
  values: { x: 49, y: 39 },
  political: { x: 45, y: 70 },
  knowledge: { x: 72, y: 72 },
  future: { x: 61, y: 86 },
  dialogue: { x: 67, y: 55 },
  personality: { x: 83, y: 39 },
};

const TERRAIN_OFFSETS = [
  { x: 0, y: 0 },
  { x: -10, y: 8 },
  { x: 10, y: 7 },
  { x: -12, y: -8 },
  { x: 12, y: -8 },
  { x: 0, y: 14 },
  { x: 0, y: -14 },
  { x: 17, y: 1 },
  { x: -17, y: 1 },
];

function terrainCoordinates(entry, index, expanded = false) {
  const anchor = TERRAIN_ANCHORS[entry.dimension.group] ?? { x: 50, y: 50 };
  const offset = expanded ? TERRAIN_OFFSETS[index % TERRAIN_OFFSETS.length] : TERRAIN_OFFSETS[0];
  const scoreOffset = (entry.score - 50) * 0.08;
  return {
    ...entry,
    x: Math.max(8, Math.min(92, anchor.x + offset.x + scoreOffset)),
    y: Math.max(8, Math.min(92, anchor.y + offset.y + scoreOffset * 0.5)),
    size: 150 + entry.confidence * 220,
    short: localize(entry.dimension.label, "en").split(" ")[0],
  };
}

export function TerrainView({ profile, lang, groupFilter, selectedId, setSelectedId }) {
  const allEntries = scoreEntries(profile, groupFilter);
  const visibleEntries = groupFilter === "all"
    ? GROUP_ORDER.map((groupId) => {
      const groupEntries = allEntries.filter((entry) => entry.dimension.group === groupId);
      return groupEntries.find((entry) => entry.id === selectedId)
        ?? groupEntries.sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50))[0];
    })
      .filter(Boolean)
    : allEntries;
  const data = visibleEntries
    .map((entry, index) => terrainCoordinates(entry, index, groupFilter !== "all"))
    .map((entry) => ({ ...entry, short: localize(entry.dimension.label, lang).split(" ").slice(0, 2).join(" ") }));
  return (
    <div className="atlas-visual-shell terrain-shell">
      <div className="terrain-map">
        <div className="axis-caption axis-top">{t(lang, "change")}</div>
        <div className="axis-caption axis-bottom">{t(lang, "continuity")}</div>
        <div className="axis-caption axis-left">{t(lang, "collective")}</div>
        <div className="axis-caption axis-right">{t(lang, "personal")}</div>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 42, right: 42, bottom: 42, left: 42 }}>
            <CartesianGrid stroke="#c6c0b2" strokeDasharray="2 7" opacity={0.7} />
            <XAxis type="number" dataKey="x" domain={[0, 100]} hide />
            <YAxis type="number" dataKey="y" domain={[0, 100]} hide />
            <ZAxis type="number" dataKey="size" range={[80, 270]} />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} content={({ active, payload }) => {
              if (!active || !payload?.[0]?.payload) return null;
              const entry = payload[0].payload;
              return <div className="terrain-tooltip"><strong>{localize(entry.dimension.label, lang)}</strong><span>{entry.score}/100</span></div>;
            }} />
            <Scatter data={data} onClick={(entry) => setSelectedId(entry.id)}>
              {data.map((entry) => <Cell key={entry.id} fill={entry.dimension.color} stroke={selectedId === entry.id ? "#08121d" : "#fffdf7"} strokeWidth={selectedId === entry.…32759 tokens truncated…shoz.",
    researchDeleteConfirm: "Végleg törlöd a beleegyezéssel tárolt szerverrekordot, és privát módra váltasz?",
    researchDeleted: "A beleegyezéssel tárolt szerverrekord törölve; a privát böngészős mód aktív maradt.",
    downloadResearchData: "Szerverrekord letöltése",
    deleteResearchData: "Visszavonás és szerverrekord törlése",
    reviewResearchConsent: "Kutatási hozzájárulás áttekintése",
    researchProfileSaved: "A származtatott atlaszprofil a beleegyezéses kutatási rekordba mentve.",
    researchProfileSaveError: "A helyi eredmény biztonságban van, de a kutatási másolatot nem sikerült menteni.",
  },
  de: {
    appName: "MindCivilis",
    tagline: "Ein vielschichtiges Porträt, kein Etikett.",
    language: "Sprache",
    demoProfileSource: "MindCivilis-Beispielprofil",
    navHome: "Start",
    navTests: "Fragebögen",
    navAtlas: "Mein Atlas",
    navInsights: "Einblicke",
    navHistory: "Verlauf",
    navCompare: "Vergleichen",
    navResearch: "Forschung",
    navExplore: "Erkunden",
    navProfile: "Józsefs Profil",
    navSettings: "Einstellungen",
    privateByDesign: "Privat konzipiert",
    staysHere: "Deine Antworten bleiben in diesem Browser, solange du sie nicht exportierst.",
    welcomeEyebrow: "DEIN BÜRGERSINN, IN SCHICHTEN",
    welcomeTitle: "Erkenne das Muster hinter deinen Positionen.",
    welcomeBody: "MindCivilis verbindet politische Haltung, Werte, Persönlichkeit und Beteiligungsstil zu einem wachsenden Identitätsatlas. Es bietet Reflexion — keine Diagnose, Parteizuordnung oder Wahlempfehlung.",
    startSnapshot: "20-Fragen-Schnelltest starten",
    openAtlas: "Beispielatlas öffnen",
    continueDraft: "Gespeicherten Entwurf fortsetzen",
    progress: "Fortschritt",
    completed: "abgeschlossen",
    recommended: "Als Nächstes empfohlen",
    minutes: "Min.",
    localOnly: "Nur lokal",
    noAccount: "Kein Konto, Tracking oder Cloud-Zwang",
    threeViews: "Ein Profil, drei Lesarten",
    viewConstellation: "Konstellation",
    viewFieldbook: "Profilbuch",
    viewTerrain: "Identitätskarte",
    viewConstellationDesc: "Beziehungen und Spannungen zwischen Identitätsschichten.",
    viewFieldbookDesc: "Eine lesbare redaktionelle Deutung mit Belegen.",
    viewTerrainDesc: "Deine Haltung zwischen kollektiv–persönlich und Kontinuität–Wandel.",
    testsTitle: "Fragebogenbibliothek",
    testsIntro: "Wähle einen kurzen Einstieg oder baue mit der Zeit einen tieferen Atlas auf. Verschachtelte Fragebögen nutzen frühere Antworten weiter.",
    filterAll: "Alle",
    filterPolitical: "Politisch",
    filterPersonality: "Persönlichkeit",
    filterValues: "Werte",
    filterCivic: "Zivilgesellschaft",
    filterExploratory: "Explorativ",
    validatedNote: "Interpretativer Prototyp",
    exploratoryNote: "Explorativ · nicht klinisch validiert",
    publicDomainNote: "Gemeinfreie IPIP-ähnliche Aussagen",
    questions: "Fragen",
    start: "Starten",
    resume: "Fortsetzen",
    retake: "Wiederholen",
    complete: "Fertig",
    quizAgree: "Stimme voll zu",
    quizDisagree: "Stimme gar nicht zu",
    quizNeutral: "Neutral",
    quizSkip: "Unsicher / überspringen",
    previous: "Zurück",
    next: "Weiter",
    finish: "Fragebogen abschließen",
    saveExit: "Speichern & schließen",
    autosaved: "Lokal gespeichert",
    blindMode: "Verdeckte Wertung",
    liveMode: "Live-Vorschau",
    blindModeHint: "Werte bleiben bis zum Abschluss verborgen.",
    liveModeHint: "Sieh während des Antwortens, wie sich deine Karte verändert.",
    resultTitle: "Dein Ergebnis ist bereit",
    resultBody: "Dies ist eine richtungsweisende Reflexion auf Basis dieses Fragebogens — keine feste Identität oder fachliche Beurteilung.",
    coverage: "Abdeckung",
    confidence: "Konfidenz",
    complexity: "Komplexität",
    topDrivers: "Was auffällt",
    tensions: "Produktive Spannungen",
    evidence: "Belege",
    openFullAtlas: "Vollständigen Atlas öffnen",
    backTests: "Zur Bibliothek",
    atlasTitle: "Dein Identitätsatlas",
    atlasSubtitle: "Ein Profil, drei sich ergänzende Lesarten.",
    exampleData: "Beispielprofil — ein Fragebogen ersetzt es durch deine Daten",
    yourData: "Aus deinen gespeicherten Antworten",
    groupAll: "Alle Schichten",
    groupPolitical: "Politisch",
    groupValues: "Werte",
    groupPersonality: "Persönlichkeit",
    groupCivic: "Zivil",
    groupKnowledge: "Information",
    groupFuture: "Zukunft",
    groupDialogue: "Dialog",
    groupCommunity: "Gemeinschaft",
    tapLayer: "Wähle eine Schicht, um sie zu lesen",
    plainLanguage: "Verständliche Deutung",
    shapedLayer: "Was hat diese Schicht geprägt?",
    evidenceSources: "Belegquellen",
    alignment: "Übereinstimmung",
    tension: "Spannung",
    collective: "Kollektiv",
    personal: "Persönlich",
    continuity: "Kontinuität",
    change: "Wandel",
    fieldbookTitle: "Ein vielschichtiges Porträt, kein Etikett",
    fieldbookBody: "Deine zivile Identität hat mehrere Quellen. Dieser Atlas zeigt, wie Perspektiven, Prioritäten und Erfahrungen zusammenspielen — und wo sie in verschiedene Richtungen ziehen.",
    identityLayers: "Deine Identitätsschichten",
    insightsTitle: "Bemerkenswerte Muster",
    insightsIntro: "Deutungen entstehen aus deinem neuesten lokalen Profil und zeigen immer ihre Datenabdeckung.",
    noResults: "Schließe mindestens einen Fragebogen ab, um persönliche Einblicke zu erhalten.",
    historyTitle: "Dein Atlas im Zeitverlauf",
    historyIntro: "Wiederholungen bleiben lokal erhalten, damit du Verschiebungen erkennst, ohne jede Änderung als Wandel zu deuten.",
    noHistory: "Noch keine Fragebögen abgeschlossen.",
    compareTitle: "Zwei Profile vergleichen",
    compareIntro: "Verglichen werden nur gemeinsame Dimensionen. Es gibt keinen einzelnen Kompatibilitätswert: Gemeinsamkeiten, Unterschiede und Datenabdeckung werden getrennt gezeigt.",
    currentProfile: "Aktuelles Profil",
    savedProfiles: "Gespeicherte und importierte Profile",
    importProfile: "Profilkapsel importieren",
    exportProfile: "Mein Profil exportieren",
    exportRaw: "Mit Rohantworten exportieren",
    rawWarning: "Rohantworten können sensible politische Meinungen offenlegen. Teile sie nur bewusst.",
    includeMetadata: "Optionale Altersgruppe und Großregion einbeziehen",
    addExample: "Beispielprofil hinzufügen",
    selectProfile: "Profil zum Vergleich auswählen",
    commonGround: "Gemeinsame Basis",
    biggestDifferences: "Größte Unterschiede",
    pointGap: "Punkte Abstand",
    sharedCoverage: "Gemeinsame Abdeckung",
    profileImported: "Profil lokal importiert",
    profileImportError: "Diese Datei ist keine gültige MindCivilis-Profilkapsel.",
    exploreTitle: "Das Modell erkunden",
    exploreIntro: "Jede Dimension hat zwei Pole. Ein Wert beschreibt eine aktuelle Tendenz, keine Typenzugehörigkeit.",
    modelPrinciple: "MindCivilis richtig lesen",
    modelPrincipleBody: "Werte nahe der Mitte können Ausgleich, Kontextabhängigkeit oder Unsicherheit bedeuten. Hohe Konfidenz heißt, dass mehr relevante Fragen beantwortet wurden — nicht, dass eine Deutung objektiv wahr ist.",
    fullInventory: "Vollständige Fragebogenübersicht",
    settingsTitle: "Datenschutz & Profileinstellungen",
    settingsIntro: "Alles Folgende ist optional und bleibt in diesem Browser, solange du es nicht exportierst.",
    alias: "Profilname",
    aliasPlaceholder: "z. B. Mein Juli-Atlas",
    ageBand: "Altersgruppe",
    country: "Land",
    broadRegion: "Großregion",
    choose: "Auswählen…",
    preferNot: "Keine Angabe",
    metadataHint: "Nutze Altersgruppe und Großregion — kein Geburtsdatum, keine Postleitzahl oder genaue Position.",
    saveSettings: "Einstellungen speichern",
    settingsSaved: "Einstellungen lokal gespeichert",
    researchTitle: "Optionale Forschungsbeteiligung",
    researchBody: "Derzeit wird nichts automatisch gesendet. Wenn du zustimmst, erstellt MindCivilis ein herunterladbares Forschungspaket, über dessen spätere Weitergabe du entscheidest.",
    researchModeLabel: "Wie ich MindCivilis nutzen möchte",
    modePrivate: "Private Erkundung",
    modeResearch: "Forschungsbeitrag",
    adultConfirm: "Ich bestätige, dass ich mindestens 18 Jahre alt bin.",
    researchConsent: "Ich willige freiwillig in ein Forschungspaket mit abgeleiteten Werten, Konfidenz, meinen neuesten Fragebogen-Zusammenfassungen, Oberflächensprache und ausgewählten groben demografischen Angaben ein.",
    rawConsent: "Meine Rohantworten separat einbeziehen.",
    longitudinalConsent: "Ich erlaube, künftige Beiträge mit einer zufälligen Studien-ID im Zeitverlauf zu verknüpfen.",
    longitudinalWarning: "Dies ermöglicht Test–Retest- und Verlaufsforschung ohne Namen oder E-Mail-Adresse.",
    consentUnselected: "Einwilligungen sind bewusst nicht vorausgewählt und können vor dem Export widerrufen werden.",
    createResearch: "Forschungspaket erstellen",
    researchReady: "Forschungspaket heruntergeladen. Es wurde nicht hochgeladen.",
    researchBlocked: "Volljährigkeitsbestätigung und Einwilligung auf Werteebene sind erforderlich.",
    researchPurpose: "Zweck: explorative Untersuchung ziviler Identitätsmuster und Fragebogenentwicklung.",
    researchMissing: "Automatische Datenerhebung bleibt deaktiviert, bis Verantwortliche, Ethikprozess, Aufbewahrungsfrist, Kontakt und Widerrufsverfahren benannt sind.",
    deleteAll: "Alle lokalen Daten löschen",
    deleteConfirm: "Antworten, Entwürfe, Verlauf und importierte Profile aus diesem Browser löschen?",
    deleteDone: "Lokale MindCivilis-Daten gelöscht",
    dataActions: "Deine Daten",
    download: "Herunterladen",
    close: "Schließen",
    menu: "Menü",
    learnMore: "Mehr erfahren",
    notUploaded: "Nicht hochgeladen",
    savedOn: "Gespeichert",
    latest: "Neueste",
    answerCount: "beantwortet",
    overlapOnly: "Nur überlappende Dimensionen werden einbezogen.",
    dataMinimisation: "Datenminimierung",
    privacySources: "Datenschutz- und Forschungsquellen",
    exactAge: "Das genaue Alter wird nur bei einer gesonderten Forschungseinwilligung abgefragt.",
    entryTitle: "Wie möchtest du MindCivilis nutzen?",
    entryBody: "Beide Optionen öffnen den vollständigen Atlas. Du kannst deine Wahl später unter Datenschutz & Einstellungen ändern.",
    privateChoiceTitle: "Privat erkunden",
    privateChoiceBody: "Fragebögen ausfüllen, lokal speichern, Profile vergleichen und den Atlas exportieren. Nichts wird für Forschung verwendet.",
    researchChoiceTitle: "Ich bin offen für Forschungsnutzung",
    researchChoiceBody: "Mit ausdrücklicher Einwilligung werden vier demografische Angaben und abgeleitete Atlaswerte privat für die Forschung gespeichert.",
    sameExperience: "Dieselbe vollständige App · kein eingeschränkter Modus",
    entryResearchTitle: "Freiwillige Forschungsteilnahme",
    entryResearchBody: "Bei Einwilligung fragen wir nur Geschlecht, Siedlungstyp, Land und Alter. Importierte Vergleichsprofile werden nie einbezogen.",
    collectionNotOpen: "Die Forschungssammlung ist noch nicht geöffnet",
    collectionNotOpenBody: "Diese Version speichert deine Wahl lokal und kann ein Vorschaupaket erstellen. Es gibt keinen Upload-Endpunkt für Forschung.",
    scoreDataTitle: "Beitrag auf Werteebene",
    scoreDataBody: "Abgeleitete Werte, Konfidenz, neueste Fragebogen-Zusammenfassungen, Oberflächensprache und optionale grobe demografische Angaben. Daten und Wiederholungen erfordern R3.",
    rawDataTitle: "Antworten auf Itemebene",
    rawDataBody: "Analytisch nützlicher, aber potenziell aufschlussreicher. Dies bleibt eine separate optionale Wahl.",
    saveResearchChoice: "Forschungspräferenzen speichern",
    continuePrivate: "Privat fortfahren",
    back: "Zurück",
    researchChoiceSaved: "Forschungspräferenzen lokal gespeichert",
    researchHubTitle: "Forschungskarte",
    researchHubIntro: "Eine transparente Ansicht dazu, was eingewilligte MindCivilis-Daten untersuchen helfen, was gespeichert wird und wie geschützte Gruppenvergleiche funktionieren.",
    researchStatusLabel: "Aktueller Status",
    researcherTitle: "Forscher hinter MindCivilis",
    researcherBody: "MindCivilis ist eine unabhängige Anwendung von József Janszky, Doktorand und Forscher an der Universität Pécs.",
    openResearchProfile: "Forschungsprofil öffnen",
    openSitesProfile: "Sites-Portfolio",
    researchTracksEyebrow: "Mögliches Forschungsprogramm",
    researchTracksTitle: "Sechs Fragen, zu denen der Atlas beitragen könnte",
    trackQualityTitle: "Fragebogenqualität",
    trackQualityBody: "Abschluss, fehlende Antworten, Belastung, interne Konsistenz und ein kürzerer Forschungskern.",
    trackLanguageTitle: "EN · HU · DE Äquivalenz",
    trackLanguageBody: "Faktorstruktur, Übersetzungsqualität und Messinvarianz zwischen den Sprachen.",
    trackStructureTitle: "Identitätsstruktur",
    trackStructureBody: "Wie politische, Werte-, Persönlichkeits- und zivile Dimensionen zusammenhängen, clustern und produktive Spannungen bilden.",
    trackDemographicTitle: "Alter & grobe Region",
    trackDemographicBody: "Explorative Vergleiche nach Altersgruppe, Land, Siedlungstyp und Geschlecht ohne Anspruch auf Bevölkerungsnormen.",
    trackLongitudinalTitle: "Veränderung im Zeitverlauf",
    trackLongitudinalBody: "Künftige Test–Retest- und Profilveränderungsanalyse unter demselben pseudonymen Teilnahmeschlüssel.",
    trackBiasTitle: "Audit von Wertung & Visualisierung",
    trackBiasBody: "Prüfen, ob Wertung, Konfidenz und Atlasansichten zwischen Sprachen oder Untergruppen unterschiedlich funktionieren.",
    dataLayersTitle: "Drei trennbare Datenebenen",
    tierOneTitle: "R1 · Abgeleitetes Profil",
    tierOneBody: "Abgeleitete Werte, Konfidenz und die neueste Fragebogen-Zusammenfassung, gespeichert nach ausdrücklicher Einwilligung.",
    tierTwoTitle: "R2 · Rohantworten",
    tierTwoBody: "Der aktuelle Serverablauf speichert keine Rohantworten auf Itemebene.",
    tierThreeTitle: "R3 · Pseudonyme Verknüpfung",
    tierThreeBody: "Ein zufälliger Geräteschlüssel verknüpft spätere Beiträge. Gespeichert wird nur sein SHA-256-Hash; kein Name, keine E-Mail und kein importiertes Profil.",
    safeguardTitle: "Datenschutzgrenze",
    safeguardBody: "Einzelrecords bleiben privat. Gruppenmittelwerte erscheinen erst ab 10 abgeschlossenen Teilnahmen; der Browserschlüssel ermöglicht Export oder Löschung.",
    manageResearchChoice: "Meine Wahl verwalten",
    pseudonymousStorage: "Pseudonyme private Datenbank",
    storageStatusResearch: "Lokal + eingewilligte Forschung",
    researchStorageActive: "Die eingewilligte Forschungsspeicherung ist aktiv",
    researchStorageBody: "Antworten bleiben lokal; ausgewählte Demografie und abgeleitete Atlaswerte werden nur mit ausdrücklicher Einwilligung unter einem gehashten Zufallsschlüssel gespeichert.",
    privateStorageActive: "Private Browserspeicherung ist aktiv",
    privateStorageBody: "Antworten, Entwürfe und Ergebnisse bleiben in diesem Browser und werden nicht für Forschung genutzt.",
    gender: "Geschlecht",
    genderWoman: "Frau",
    genderMan: "Mann",
    genderNonBinary: "Nicht-binär",
    genderSelfDescribed: "Andere Selbstbeschreibung",
    settlementType: "Siedlungstyp",
    settlementCapital: "Hauptstadt / Metropolregion",
    settlementLargeCity: "Großstadt (100.000+ Einwohner)",
    settlementCity: "Stadt",
    settlementTownVillage: "Kleinstadt oder Dorf",
    settlementRural: "Ländlicher Raum",
    exactAgeResearch: "Alter",
    specialCategoryConsent: "Ich willige ausdrücklich in die Verarbeitung meiner zivilen und politischen Ansichten zu Forschungszwecken ein.",
    specialCategoryConsentBody: "Dies ist freiwillig, für die private Nutzung nicht erforderlich und kann in den Einstellungen mit dem lokal gespeicherten Teilnahmeschlüssel widerrufen werden.",
    researchSaveError: "Die Einwilligung konnte nicht gespeichert werden. Es wurde nichts übermittelt; erneut versuchen oder privat fortfahren.",
    saving: "Speichern…",
    cohortEyebrow: "EINGEWILLIGTE GRUPPENANSICHT",
    cohortTitle: "Wie breite Gruppen zu deinem Atlas stehen",
    cohortIntro: "Vergleiche Gruppenmittelwerte nach Altersgruppe, Land, Siedlungstyp oder Geschlecht. Es sind explorative Teilnehmermittelwerte, keine Bevölkerungsnormen.",
    cohortConsentRequired: "Für Gruppenkarten ist Forschungseinwilligung erforderlich",
    cohortConsentBody: "Die Karte ist für Teilnehmende sichtbar, die zum selben geschützten, aggregierten Datensatz beitragen.",
    compareBy: "Vergleichen nach",
    cohortAge: "Altersgruppe",
    cohortCountry: "Land",
    cohortSettlement: "Siedlung",
    cohortGender: "Geschlecht",
    loading: "Laden…",
    cohortLoadError: "Gruppenmittelwerte sind vorübergehend nicht verfügbar.",
    cohortNotReady: "Noch keine datenschutzsichere Gruppe verfügbar",
    cohortThreshold: "Eine Gruppe erscheint erst ab mindestens {count} abgeschlossenen Teilnahmen.",
    participants: "Teilnehmende",
    cohortAverage: "Gruppenmittel",
    yourProfileMarker: "Marker deines Profils",
    researchTokenMissing: "Der lokale Teilnahmeschlüssel fehlt; der Serverrecord ist von diesem Browser nicht erreichbar.",
    researchExportReady: "Dein eingewilligter Forschungsrecord wurde heruntergeladen.",
    researchDataActionError: "Die Forschungsdaten-Aktion ist fehlgeschlagen. Der lokale Schlüssel bleibt für einen neuen Versuch erhalten.",
    researchDeleteConfirm: "Den eingewilligten Serverrecord endgültig löschen und in den privaten Modus wechseln?",
    researchDeleted: "Der eingewilligte Serverrecord wurde gelöscht; der private Browsermodus bleibt aktiv.",
    downloadResearchData: "Serverrecord herunterladen",
    deleteResearchData: "Widerrufen & Serverrecord löschen",
    reviewResearchConsent: "Forschungseinwilligung prüfen",
    researchProfileSaved: "Das abgeleitete Atlasprofil wurde im eingewilligten Forschungsrecord gespeichert.",
    researchProfileSaveError: "Das lokale Ergebnis ist sicher, aber die Forschungskopie konnte nicht gespeichert werden.",
  },
};

export function t(lang, key) {
  return copy[lang]?.[key] ?? copy.en[key] ?? key;
}

export function localize(value, lang) {
  if (typeof value === "string") return value;
  return value?.[lang] ?? value?.en ?? "";
}
