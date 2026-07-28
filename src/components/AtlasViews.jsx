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
              {data.map((entry) => <Cell key={entry.id} fill={entry.dimension.color} stroke={selectedId === entry.id ? "#08121d" : "#fffdf7"} strokeWidth={selectedId === entry.id ? 4 : 2} fillOpacity={0.82} />)}
              <LabelList dataKey="short" position="top" offset={8} fill="#233246" fontSize={10} fontWeight={600} />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        <div className="terrain-legend">{t(lang, "viewTerrainDesc")}</div>
      </div>
      <AtlasDetail selectedId={selectedId} profile={profile} lang={lang} />
    </div>
  );
}

export function AtlasViewSwitcher({ view, setView, lang }) {
  const views = [
    { id: "constellation", label: t(lang, "viewConstellation"), icon: ChartPolar },
    { id: "fieldbook", label: t(lang, "viewFieldbook"), icon: BookOpenText },
    { id: "terrain", label: t(lang, "viewTerrain"), icon: MapTrifold },
  ];
  return (
    <div className="atlas-switch" role="tablist">
      {views.map(({ id, label, icon: Icon }) => (
        <button key={id} role="tab" aria-selected={view === id} className={view === id ? "active" : ""} onClick={() => setView(id)}>
          <Icon size={17} weight={view === id ? "fill" : "regular"} />
          {label}
        </button>
      ))}
    </div>
  );
}
