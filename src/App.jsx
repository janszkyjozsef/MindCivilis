import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Brain,
  ChartLineUp,
  ChartPolar,
  Check,
  CheckCircle,
  ClockCounterClockwise,
  Compass,
  DownloadSimple,
  Export,
  Eye,
  EyeSlash,
  FileArrowUp,
  FloppyDisk,
  GearSix,
  GlobeHemisphereWest,
  HandHeart,
  House,
  Info,
  Lightbulb,
  List,
  LockKey,
  MapTrifold,
  Play,
  Scales,
  ShieldCheck,
  Sparkle,
  Trash,
  TrendUp,
  UploadSimple,
  UserCircle,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { QUESTIONNAIRES, QUESTIONNAIRE_BY_ID, getDocumentedItemCount } from "./data/catalogue.js";
import { DEMO_SCORES, DIMENSIONS, EXAMPLE_PROFILE, GROUPS, PRIMARY_ATLAS_DIMENSIONS } from "./data/dimensions.js";
import { AGE_BANDS, COUNTRIES, getRegions } from "./data/regions.js";
import { LANGUAGES, localize, t } from "./data/i18n.js";
import { COHORT_FALLBACK_LABELS, RESEARCH_NOTICE } from "./data/research.js";
import {
  bandForScore,
  buildProfile,
  compareProfiles,
  getProfileMetrics,
  getTensions,
  getTopDimensions,
  interpretDimension,
  mergeLiveProfile,
  scoreQuestionnaire,
} from "./lib/scoring.js";
import {
  clearState,
  createProfileCapsule,
  downloadJson,
  initialState,
  loadState,
  makeCurrentProfile,
  parseProfileCapsule,
  persistState,
} from "./lib/storage.js";
import {
  COHORT_DIMENSIONS,
  GENDER_OPTIONS,
  MIN_COHORT_SIZE,
  SETTLEMENT_OPTIONS,
  createParticipantToken,
  downloadResearchExport,
  fetchResearchCohorts,
  participationAction,
  saveResearchConsent,
  submitResearchProfile,
} from "./lib/research.js";
import { AtlasViewSwitcher, ConstellationView, FieldbookView, TerrainView } from "./components/AtlasViews.jsx";

const NAV = [
  ["home", "navHome", House],
  ["tests", "navTests", List],
  ["atlas", "navAtlas", ChartPolar],
  ["insights", "navInsights", Lightbulb],
  ["history", "navHistory", ClockCounterClockwise],
  ["compare", "navCompare", UsersThree],
  ["research", "navResearch", HandHeart],
  ["explore", "navExplore", Compass],
];

const FILTERS = [
  ["all", "filterAll"],
  ["political", "filterPolitical"],
  ["personality", "filterPersonality"],
  ["values", "filterValues"],
  ["civic", "filterCivic"],
  ["exploratory", "filterExploratory"],
];

const ATLAS_GROUPS = [
  ["all", "groupAll"],
  ["political", "groupPolitical"],
  ["values", "groupValues"],
  ["personality", "groupPersonality"],
  ["civic", "groupCivic"],
  ["knowledge", "groupKnowledge"],
  ["future", "groupFuture"],
  ["dialogue", "groupDialogue"],
  ["community", "groupCommunity"],
];

const RESEARCH_PROFILE_URL = "https://jozsef-janszky-portfolio.joe328.chatgpt.site/#applications";

function useMindCivilisState() {
  const [state, setState] = useState(loadState);
  useEffect(() => {
    persistState(state);
    document.documentElement.lang = state.language;
  }, [state]);
  return [state, setState];
}

function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

function percentage(value) {
  return `${Math.round(value * 100)}%`;
}

function dateLabel(value, lang) {
  try {
    return new Intl.DateTimeFormat(lang, { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function LanguageSwitch({ lang, onChange, compact = false }) {
  return (
    <div className={classNames("language-switch", compact && "compact")} aria-label={t(lang, "language")}>
      {LANGUAGES.map((language) => (
        <button key={language.id} className={lang === language.id ? "active" : ""} onClick={() => onChange(language.id)} title={language.label}>
          {language.short}
        </button>
      ))}
    </div>
  );
}

function Brand({ lang, compact = false }) {
  return (
    <div className={classNames("brand", compact && "compact-brand")}>
      <div className="brand-mark">M</div>
      <div>
        <strong>{t(lang, "appName")}</strong>
        {!compact ? <span>{t(lang, "tagline")}</span> : null}
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, body, actions }) {
  return (
    <header className="section-header">
      <div>
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        {body ? <p>{body}</p> : null}
      </div>
      {actions ? <div className="section-actions">{actions}</div> : null}
    </header>
  );
}

function MetricCard({ icon: Icon, label, value, note, color = "#3fa7ff" }) {
  return (
    <div className="metric-card">
      <span className="metric-icon" style={{ color, background: `${color}18` }}><Icon size={20} weight="duotone" /></span>
      <div><strong>{value}</strong><span>{label}</span>{note ? <small>{note}</small> : null}</div>
    </div>
  );
}

function Toast({ message, tone = "success", onClose }) {
  if (!message) return null;
  return (
    <div className={`toast ${tone}`} role="status">
      {tone === "success" ? <CheckCircle weight="fill" /> : <Info weight="fill" />}
      <span>{message}</span>
      <button onClick={onClose} aria-label="Close"><X /></button>
    </div>
  );
}

function ResearchNotice({ lang }) {
  const notice = RESEARCH_NOTICE[lang] ?? RESEARCH_NOTICE.en;
  return (
    <details className="research-notice">
      <summary><BookOpenText />{notice.title}<ArrowRight /></summary>
      <div className="research-notice-body">
        <p>{notice.intro}</p>
        {notice.sections.map(([title, body]) => <section key={title}><h3>{title}</h3><p>{body}</p></section>)}
      </div>
    </details>
  );
}

function ResearchEntryModal({ lang, state, setState, onLanguageChange }) {
  const [step, setStep] = useState("choice");
  const [draft, setDraft] = useState({
    gender: state.research.gender || "",
    settlementType: state.research.settlementType || "",
    country: state.research.country || "",
    age: state.research.age || "",
    explicitSpecialCategoryConsent: false,
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const choosePrivate = () => {
    setState((current) => ({
      ...current,
      research: {
        ...initialState.research,
        mode: "private",
        decisionAt: new Date().toISOString(),
      },
    }));
  };

  const chooseResearch = async () => {
    const age = Number(draft.age);
    if (!draft.gender || !draft.settlementType || !draft.country || !Number.isInteger(age) || age < 18 || age > 110 || !draft.explicitSpecialCategoryConsent) return;
    setBusy(true);
    setError("");
    try {
      const token = state.research.participantToken || createParticipantToken();
      await saveResearchConsent({ ...draft, token, age, language: lang });
      const now = new Date().toISOString();
      setState((current) => ({
        ...current,
        research: {
          ...initialState.research,
          mode: "research",
          adult: true,
          scoreConsent: true,
          participantToken: token,
          gender: draft.gender,
          settlementType: draft.settlementType,
          country: draft.country,
          age,
          explicitSpecialCategoryConsent: true,
          serverConsentAt: now,
          decisionAt: now,
        },
      }));
    } catch {
      setError(t(lang, "researchSaveError"));
    } finally {
      setBusy(false);
    }
  };

  const updateDraft = (key, value) => setDraft((current) => ({ ...current, [key]: value }));
  const age = Number(draft.age);
  const ready = draft.gender && draft.settlementType && draft.country
    && Number.isInteger(age) && age >= 18 && age <= 110
    && draft.explicitSpecialCategoryConsent;

  return (
    <div className="entry-overlay" role="presentation">
      <section className="entry-dialog" role="dialog" aria-modal="true" aria-labelledby="entry-title">
        <header className="entry-dialog-top">
          <Brand lang={lang} compact />
          <LanguageSwitch lang={lang} onChange={onLanguageChange} />
        </header>
        {step === "choice" ? (
          <div className="entry-content">
            <p className="eyebrow">{t(lang, "privateByDesign")}</p>
            <h1 id="entry-title">{t(lang, "entryTitle")}</h1>
            <p className="entry-intro">{t(lang, "entryBody")}</p>
            <div className="entry-choice-grid">
              <button className="entry-choice" onClick={choosePrivate}>
                <span className="entry-choice-icon private"><ShieldCheck size={28} weight="duotone" /></span>
                <strong>{t(lang, "privateChoiceTitle")}</strong>
                <p>{t(lang, "privateChoiceBody")}</p>
                <small><Check />{t(lang, "sameExperience")}</small>
                <span className="entry-choice-action">{t(lang, "continuePrivate")}<ArrowRight /></span>
              </button>
              <button className="entry-choice research" onClick={() => setStep("research")}>
                <span className="entry-choice-icon research"><HandHeart size={28} weight="duotone" /></span>
                <strong>{t(lang, "researchChoiceTitle")}</strong>
                <p>{t(lang, "researchChoiceBody")}</p>
                <small><LockKey />{t(lang, "pseudonymousStorage")}</small>
                <span className="entry-choice-action">{t(lang, "learnMore")}<ArrowRight /></span>
              </button>
            </div>
          </div>
        ) : (
          <div className="entry-content research-step">
            <button className="entry-back" onClick={() => setStep("choice")}><ArrowLeft />{t(lang, "back")}</button>
            <p className="eyebrow">{t(lang, "researchTitle")}</p>
            <h1 id="entry-title">{t(lang, "entryResearchTitle")}</h1>
            <p className="entry-intro">{t(lang, "entryResearchBody")}</p>
            <div className="collection-status"><LockKey weight="duotone" /><div><strong>{t(lang, "researchStorageActive")}</strong><span>{t(lang, "researchStorageBody")}</span></div></div>
            <div className="research-demographics">
              <label><span>{t(lang, "gender")}</span><select value={draft.gender} onChange={(event) => updateDraft("gender", event.target.value)}><option value="">{t(lang, "choose")}</option>{GENDER_OPTIONS.map(([id, key]) => <option key={id} value={id}>{t(lang, key)}</option>)}</select></label>
              <label><span>{t(lang, "settlementType")}</span><select value={draft.settlementType} onChange={(event) => updateDraft("settlementType", event.target.value)}><option value="">{t(lang, "choose")}</option>{SETTLEMENT_OPTIONS.map(([id, key]) => <option key={id} value={id}>{t(lang, key)}</option>)}</select></label>
              <label><span>{t(lang, "country")}</span><select value={draft.country} onChange={(event) => updateDraft("country", event.target.value)}><option value="">{t(lang, "choose")}</option>{COUNTRIES.map((country) => <option key={country.id} value={country.id}>{localize(country.label, lang)}</option>)}</select></label>
              <label><span>{t(lang, "exactAgeResearch")}</span><input type="number" min="18" max="110" inputMode="numeric" value={draft.age} onChange={(event) => updateDraft("age", event.target.value)} /></label>
            </div>
            <label className="consent-row special-consent"><input type="checkbox" checked={draft.explicitSpecialCategoryConsent} onChange={(event) => updateDraft("explicitSpecialCategoryConsent", event.target.checked)} /><span><strong>{t(lang, "specialCategoryConsent")}</strong><small>{t(lang, "specialCategoryConsentBody")}</small></span></label>
            <ResearchNotice lang={lang} />
            {error ? <p className="entry-error" role="alert">{error}</p> : null}
            <div className="entry-actions">
              <button className="secondary-button" onClick={choosePrivate}>{t(lang, "continuePrivate")}</button>
              <button className="primary-button" disabled={!ready || busy} onClick={chooseResearch}><Check />{busy ? t(lang, "saving") : t(lang, "saveResearchChoice")}</button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function HomeScreen({ lang, state, profile, navigate, startTest }) {
  const completedIds = new Set(state.history.map((entry) => entry.questionnaireId));
  const completion = Math.round((completedIds.size / QUESTIONNAIRES.length) * 100);
  const recommended = QUESTIONNAIRES.find((test) => !completedIds.has(test.id)) ?? QUESTIONNAIRES[0];
  const draft = Object.entries(state.drafts).find(([, value]) => Object.keys(value.answers ?? {}).length > 0);
  const atlas = profile.hasData ? profile : { scores: DEMO_SCORES, confidence: Object.fromEntries(Object.keys(DEMO_SCORES).map((id) => [id, 0.72])) };
  const radarIds = ["community…87609 tokens truncated…us: 6px;
  color: #b8c8d3;
  font-size: 8px;
}

.research-receipt strong {
  display: block;
  margin-bottom: 4px;
  color: #6f8798;
  font-size: 7px;
}

.research-data-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cohort-section {
  margin-top: 18px;
  padding: 23px;
}

.cohort-section > p {
  max-width: 760px;
  color: #718797;
  font-size: 9px;
  line-height: 1.6;
}

.cohort-locked {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 14px;
  margin-top: 17px;
  padding: 18px;
  border: 1px solid rgba(231, 180, 90, 0.2);
  border-radius: 8px;
  background: rgba(143, 101, 33, 0.07);
  color: #a28c62;
}

.cohort-locked strong {
  color: #d5c291;
  font-size: 9px;
}

.cohort-locked p {
  margin: 4px 0 0;
  font-size: 7px;
}

.cohort-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  margin-top: 18px;
}

.cohort-controls > span {
  margin-right: 5px;
  color: #718798;
  font-size: 8px;
}

.cohort-controls button {
  min-height: 31px;
  padding: 0 11px;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: rgba(4, 17, 28, 0.7);
  color: #8297a7;
  font-size: 8px;
  cursor: pointer;
}

.cohort-controls button.active {
  border-color: rgba(63, 167, 255, 0.38);
  background: rgba(49, 134, 196, 0.14);
  color: #b9dcf2;
}

.cohort-empty {
  min-height: 150px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 8px;
  margin-top: 16px;
  padding: 25px;
  border: 1px dashed var(--line-strong);
  border-radius: 8px;
  color: #637e91;
  font-size: 8px;
  text-align: center;
}

.cohort-empty svg {
  width: 30px;
  height: 30px;
}

.cohort-empty strong {
  color: #a9bdca;
  font-size: 10px;
}

.cohort-empty.error {
  color: #dc8c7c;
}

.cohort-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.cohort-grid > article {
  padding: 17px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: rgba(3, 15, 25, 0.58);
}

.cohort-grid header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.cohort-grid header strong,
.cohort-grid header span {
  display: block;
}

.cohort-grid header strong {
  color: #d7e1e7;
  font-family: var(--serif);
  font-size: 17px;
  font-weight: 500;
}

.cohort-grid header span {
  margin-top: 3px;
  color: #6e8596;
  font-size: 7px;
}

.privacy-threshold {
  height: fit-content;
  display: inline-flex !important;
  align-items: center;
  gap: 4px;
  padding: 5px 7px;
  border-radius: 999px;
  background: rgba(53, 151, 98, 0.09);
  color: #75d99f !important;
}

.cohort-score-list {
  margin-top: 15px;
}

.cohort-score-list > div {
  display: grid;
  grid-template-columns: minmax(100px, 0.9fr) minmax(120px, 1.3fr) 56px;
  align-items: center;
  gap: 8px;
  padding: 7px 0;
  border-top: 1px solid rgba(90, 124, 149, 0.11);
  color: #7f95a5;
  font-size: 7px;
}

.cohort-score-list > div > strong {
  color: #bdd0dc;
  font-size: 8px;
  text-align: right;
}

.cohort-score-list > div > strong small {
  color: #7190a4;
}

.cohort-dual-track {
  position: relative;
  height: 5px;
  border-radius: 999px;
  background: rgba(77, 111, 136, 0.18);
}

.cohort-dual-track i {
  position: absolute;
  inset: 0 auto 0 0;
  border-radius: inherit;
  opacity: 0.7;
}

.cohort-dual-track em {
  position: absolute;
  top: 50%;
  width: 2px;
  height: 13px;
  border-radius: 2px;
  background: #f0eadf;
  transform: translate(-1px, -50%);
  box-shadow: 0 0 0 2px rgba(3, 15, 25, 0.8);
}

.cohort-legend {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px !important;
  font-size: 7px !important;
}

.cohort-legend i {
  width: 18px;
  height: 4px;
  border-radius: 99px;
  background: var(--blue);
}

.cohort-legend em {
  width: 2px;
  height: 11px;
  margin-left: 8px;
  background: #f0eadf;
}

.entry-overlay {
  position: fixed;
  z-index: 200;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  overflow: auto;
  background: rgba(0, 6, 11, 0.82);
  backdrop-filter: blur(14px);
}

.entry-dialog {
  width: min(930px, 100%);
  max-height: calc(100vh - 48px);
  overflow: auto;
  border: 1px solid rgba(87, 151, 199, 0.28);
  border-radius: 12px;
  background:
    radial-gradient(circle at 88% 5%, rgba(35, 124, 194, 0.16), transparent 24rem),
    linear-gradient(145deg, #071826, #030d17 72%);
  box-shadow: 0 48px 130px rgba(0, 0, 0, 0.58);
}

.entry-dialog-top {
  min-height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 28px;
  border-bottom: 1px solid var(--line);
}

.entry-content {
  padding: 35px;
}

.entry-content > h1 {
  max-width: 700px;
  margin: 0;
  color: #f1eee8;
  font-family: var(--serif);
  font-size: clamp(34px, 5vw, 51px);
  font-weight: 500;
  line-height: 1.02;
}

.entry-intro {
  max-width: 680px;
  margin: 14px 0 0;
  color: #8398a8;
  font-size: 10px;
  line-height: 1.65;
}

.entry-choice-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 13px;
  margin-top: 28px;
}

.entry-choice {
  min-height: 290px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 22px;
  border: 1px solid rgba(101, 214, 148, 0.22);
  border-radius: 10px;
  background: linear-gradient(150deg, rgba(49, 152, 98, 0.08), rgba(4, 16, 27, 0.72));
  color: #dce6ec;
  text-align: left;
  cursor: pointer;
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease;
}

.entry-choice.research {
  border-color: rgba(63, 167, 255, 0.25);
  background: linear-gradient(150deg, rgba(42, 132, 202, 0.1), rgba(4, 16, 27, 0.72));
}

.entry-choice:hover {
  transform: translateY(-2px);
  border-color: rgba(109, 204, 247, 0.55);
}

.entry-choice-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 9px;
}

.entry-choice-icon.private { color: var(--green); }
.entry-choice-icon.research { color: var(--blue); }

.entry-choice > strong {
  margin-top: 24px;
  color: #eef1f1;
  font-family: var(--serif);
  font-size: 24px;
  font-weight: 500;
}

.entry-choice > p {
  margin: 10px 0 0;
  color: #7e93a3;
  font-size: 9px;
  line-height: 1.65;
}

.entry-choice > small {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 16px;
  color: #6f8d80;
  font-size: 7px;
}

.entry-choice.research > small {
  color: #7199b5;
}

.entry-choice-action {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid var(--line);
  color: #9fcde9;
  font-size: 9px;
  font-weight: 650;
}

.entry-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #73a9cb;
  font-size: 8px;
  cursor: pointer;
}

.collection-status {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  margin-top: 20px;
  padding: 13px;
  border: 1px solid rgba(231, 180, 90, 0.22);
  border-radius: 7px;
  background: rgba(143, 101, 33, 0.08);
  color: #a68f64;
}

.collection-status strong,
.collection-status span {
  display: block;
}

.collection-status strong { font-size: 9px; }
.collection-status span { margin-top: 4px; font-size: 7px; line-height: 1.5; }

.entry-consents {
  margin-top: 10px;
}

.entry-actions {
  display: flex;
  justify-content: flex-end;
  gap: 9px;
  margin-top: 21px;
}

.primary-button:disabled {
  opacity: 0.42;
  cursor: not-allowed;
  transform: none;
}

.privacy-sources {
  display: grid;
  grid-template-columns: minmax(200px, 1fr) minmax(300px, 1.6fr) auto;
  align-items: center;
  gap: 20px;
  margin-top: 16px;
  padding: 20px;
}

.privacy-sources h2 {
  margin: 0;
  color: #d3dfe6;
  font-family: var(--serif);
  font-size: 19px;
  font-weight: 500;
}

.privacy-sources p {
  margin: 4px 0 0;
  color: #657c8e;
  font-size: 8px;
}

.source-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.source-links a {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 9px;
  border: 1px solid var(--line);
  border-radius: 5px;
  color: #77b6e1;
  font-size: 7px;
  text-decoration: none;
}

.danger-button {
  border: 1px solid rgba(231, 109, 96, 0.32);
  background: rgba(156, 59, 52, 0.12);
  color: #ef9b92;
}

.toast {
  position: fixed;
  z-index: 100;
  right: 20px;
  bottom: 20px;
  max-width: min(420px, calc(100vw - 40px));
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 10px;
  padding: 13px 14px;
  border: 1px solid rgba(85, 193, 132, 0.35);
  border-radius: 8px;
  background: rgba(6, 31, 24, 0.96);
  color: #a9dfbf;
  box-shadow: var(--shadow);
  font-size: 9px;
}

.toast.error {
  border-color: rgba(224, 105, 93, 0.35);
  background: rgba(46, 16, 15, 0.96);
  color: #eeafa8;
}

.toast button {
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.mobile-overlay {
  display: none;
}

@media (max-width: 1180px) {
  .app-shell {
    grid-template-columns: 196px minmax(0, 1fr);
  }

  .sidebar {
    width: 196px;
  }

  .page {
    width: min(1120px, calc(100% - 40px));
  }

  .home-hero {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }

  .hero-copy h1 {
    font-size: 52px;
  }

  .test-grid,
  .dimension-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .atlas-visual-shell,
  .fieldbook-scene {
    grid-template-columns: minmax(0, 1fr) 260px;
  }

  .fieldbook-tabs {
    right: 253px;
  }

  .fieldbook-paper {
    padding-inline: 28px;
  }

  .fieldbook-content-grid {
    grid-template-columns: 1fr;
  }

  .fieldbook-radar {
    display: none;
  }
}

@media (max-width: 900px) {
  .app-shell {
    display: block;
  }

  .workspace {
    min-width: 0;
  }

  .sidebar {
    width: min(280px, 86vw);
    transform: translateX(-105%);
    transition: transform 220ms ease;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .mobile-close {
    display: grid;
  }

  .mobile-overlay {
    position: fixed;
    z-index: 45;
    inset: 0;
    display: block;
    border: 0;
    background: rgba(0, 5, 9, 0.68);
    backdrop-filter: blur(3px);
  }

  .topbar {
    height: 60px;
    justify-content: space-between;
    padding: 0 18px;
  }

  .topbar > .brand,
  .mobile-menu {
    display: flex;
  }

  .topbar > .brand {
    margin-right: auto;
  }

  .topbar > .brand .brand-mark {
    width: 30px;
    height: 30px;
    flex-basis: 30px;
  }

  .mobile-menu {
    width: 34px;
    height: 34px;
    align-items: center;
    justify-content: center;
    border: 0;
    background: transparent;
    color: #8aa1b2;
  }

  .local-status {
    display: none;
  }

  .topbar .language-switch button {
    min-width: 31px;
  }

  .page {
    width: min(100% - 28px, 800px);
    padding-top: 32px;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px;
  }

  .home-hero {
    grid-template-columns: 1fr;
    padding-top: 15px;
  }

  .hero-copy {
    max-width: none;
  }

  .hero-atlas-card {
    min-height: 410px;
  }

  .home-grid,
  .settings-layout,
  .insight-layout,
  .comparison-grid,
  .research-status-grid,
  .cohort-grid {
    grid-template-columns: 1fr;
  }

  .research-track-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .data-tier-grid {
    grid-template-columns: 1fr;
  }

  .quiz-layout {
    grid-template-columns: 1fr;
  }

  .quiz-aside {
    order: -1;
  }

  .blind-visual,
  .live-scores {
    min-height: 130px;
  }

  .atlas-visual-shell,
  .fieldbook-scene {
    grid-template-columns: 1fr;
  }

  .atlas-detail {
    border-top: 1px solid var(--line);
    border-left: 0;
  }

  .fieldbook-scene {
    padding: 8px;
  }

  .fieldbook-scene > .atlas-detail {
    margin: 12px -8px -8px;
  }

  .fieldbook-tabs {
    display: none;
  }

  .privacy-sources {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 650px) {
  .topbar {
    gap: 8px;
  }

  .topbar > .brand strong {
    font-size: 15px;
  }

  .topbar .language-switch button {
    min-width: 27px;
    padding: 0 5px;
  }

  .home-page {
    padding-top: 20px;
  }

  .hero-copy h1,
  .section-header h1,
  .result-hero h1 {
    font-size: 38px;
  }

  .hero-copy > p:not(.eyebrow) {
    font-size: 12px;
  }

  .hero-actions,
  .result-actions,
  .import-actions,
  .entry-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .hero-actions button,
  .result-actions button,
  .import-actions button,
  .entry-actions button {
    width: 100%;
  }

  .entry-overlay {
    align-items: start;
    padding: 9px;
  }

  .entry-dialog {
    max-height: none;
  }

  .entry-dialog-top {
    min-height: 60px;
    padding: 0 16px;
  }

  .entry-dialog-top .brand span {
    display: none;
  }

  .entry-content {
    padding: 25px 17px;
  }

  .entry-choice-grid,
  .research-track-grid,
  .research-demographics,
  .research-receipt {
    grid-template-columns: 1fr;
  }

  .entry-choice {
    min-height: 255px;
  }

  .researcher-links {
    flex-direction: column;
  }

  .cohort-locked {
    grid-template-columns: 1fr;
  }

  .cohort-score-list > div {
    grid-template-columns: minmax(90px, 0.8fr) minmax(100px, 1.2fr) 46px;
  }

  .researcher-links a {
    width: 100%;
  }

  .research-mode-control > div {
    grid-template-columns: 1fr;
  }

  .hero-atlas-card {
    min-height: 340px;
  }

  .hero-radar {
    inset: 20px 4px 38px;
  }

  .view-preview-grid,
  .test-grid,
  .dimension-grid,
  .result-metrics,
  .metric-grid,
  .fieldbook-insights {
    grid-template-columns: 1fr;
  }

  .view-preview-grid button {
    min-height: 105px;
  }

  .privacy-strip {
    grid-template-columns: auto 1fr;
  }

  .privacy-strip button {
    grid-column: 2;
    justify-self: start;
  }

  .section-actions,
  .atlas-switch {
    width: 100%;
  }

  .atlas-switch button {
    flex: 1;
    justify-content: center;
    padding-inline: 6px;
  }

  .atlas-page {
    width: calc(100% - 16px);
  }

  .atlas-filters {
    flex-wrap: nowrap;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .atlas-filters button {
    flex: 0 0 auto;
  }

  .constellation-canvas,
  .terrain-map {
    min-height: 510px;
  }

  .fieldbook-scene {
    min-height: auto;
  }

  .fieldbook-paper {
    min-height: 680px;
    padding: 22px 18px 36px;
  }

  .fieldbook-paper > h2 {
    font-size: 35px;
  }

  .fieldbook-content-grid {
    gap: 8px;
  }

  .ledger-row {
    grid-template-columns: 120px 1fr 24px;
  }

  .paper-footer {
    inset-inline: 18px;
  }

  .quiz-header {
    padding: 0 12px;
  }

  .quiz-title span {
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .save-exit-button {
    width: 38px;
    padding: 0;
    font-size: 0;
  }

  .quiz-layout {
    width: calc(100% - 18px);
    padding: 16px 0 30px;
  }

  .quiz-aside {
    display: none;
  }

  .question-panel {
    min-height: calc(100vh - 96px);
    padding: 24px 17px;
  }

  .question-panel h1 {
    margin-top: 38px;
    font-size: 29px;
  }

  .likert-scale {
    margin-top: 48px;
  }

  .scale-options {
    gap: 5px;
  }

  .scale-options button:nth-child(n) {
    width: 42px;
    height: 42px;
    margin-top: 0;
  }

  .result-dimension {
    grid-template-columns: 1fr 40px;
    padding: 12px 0;
  }

  .result-dimension > div:first-child {
    grid-column: 1;
  }

  .result-bar {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .result-dimension > strong {
    grid-column: 2;
    grid-row: 1;
  }

  .history-details > div {
    grid-template-columns: 110px 1fr 27px;
  }

  .export-box {
    grid-template-columns: auto 1fr;
  }

  .export-box button {
    grid-column: 1 / -1;
    justify-content: center;
  }

  .compare-row {
    grid-template-columns: 112px 1fr;
  }

  .compare-row > strong {
    display: none;
  }

  .form-grid,
  .inventory-list {
    grid-template-columns: 1fr;
  }

  .form-grid label:last-child {
    grid-column: auto;
  }

  .inventory-list small {
    grid-column: 2 / 4;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
