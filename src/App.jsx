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
  const radarIds = ["communityValue", "autonomyValue", "democraticChecks", "epistemicCare", "futureOrientation", "dialogueStyle"];
  const radar = radarIds.map((id) => ({ label: localize(DIMENSIONS[id].label, lang).split(" ")[0], score: atlas.scores[id] ?? 50 }));
  return (
    <div className="page home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">{t(lang, "welcomeEyebrow")}</p>
          <h1>{t(lang, "welcomeTitle")}</h1>
          <p>{t(lang, "welcomeBody")}</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => startTest("political-quick")}><Play weight="fill" />{t(lang, "startSnapshot")}</button>
            <button className="secondary-button" onClick={() => navigate("atlas")}><ChartPolar />{t(lang, "openAtlas")}</button>
          </div>
          {draft ? (
            <button className="resume-line" onClick={() => startTest(draft[0])}><ClockCounterClockwise />{t(lang, "continueDraft")}<ArrowRight /></button>
          ) : null}
        </div>
        <div className="hero-atlas-card" role="img" aria-label={t(lang, "navAtlas")}>
          <div className="hero-orbit hero-orbit-one" />
          <div className="hero-orbit hero-orbit-two" />
          <div className="hero-radar">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radar} outerRadius="67%">
                <PolarGrid stroke="#29445e" />
                <PolarAngleAxis dataKey="label" tick={{ fill: "#a8bac9", fontSize: 9 }} />
                <Radar dataKey="score" stroke="#41aaff" fill="#2689e6" fillOpacity={0.24} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="hero-atlas-center"><span>M</span><small>{profile.hasData ? t(lang, "yourData") : t(lang, "exampleData")}</small></div>
          <div className="atlas-card-footer"><span><i className="blue" />{t(lang, "groupPolitical")}</span><span><i className="green" />{t(lang, "groupValues")}</span><span><i className="purple" />{t(lang, "groupPersonality")}</span></div>
        ×N÷ÒÚ$z{-®éÜj×BæÆ&VÂÂF–ÖVç6–öâÂÆær—ÓÂ÷7G&öæsãÇ7ãç¶6ö†÷'Bæ6÷VçGÒ·B†ÆærÂ''F–6—çG2"—ÓÂ÷7ããÂöF—cãÇ7â6Æ74æÖSÒ'&—f7’×F‡&W6†öÆB#ãÅ6†–VÆD6†V6²óæî(šW´Ô”åô4ô„õ%Eõ4•¤WÓÂ÷7ããÂö†VFW#à¢ÆF—b6Æ74æÖSÒ&6ö†÷'B×66÷&RÖÆ—7B#à¢·66÷&T–G2æf–ÇFW"‚†–B’ÓâçVÖ&W"æ—4f–æ—FR†6ö†÷'Bç66÷&W3òå¶–EÒ’’æÖ‚†–B’Óâ°¢6öç7BfW&vRÒ6ö†÷'Bç66÷&W5¶–EÓ°¢6öç7B÷vâÒ&öf–ÆRç66÷&W5¶–EÓ°¢&WGW&â€¢ÆF—b¶W“×¶–GÓà¢Ç7ãç¶Æö6Æ—¦R„D”ÔTå4”ôå5¶–EÒæÆ&VÂÂÆær—ÓÂ÷7ãà¢ÆF—b6Æ74æÖSÒ&6ö†÷'BÖGVÂ×G&6²#ãÆ’7G–ÆS×·²v–GFƒ¢G¶fW&vWÒVÂ&6¶w&÷VæC¢D”ÔTå4”ôå5¶–EÒæ6öÆ÷"×ÒóãÆVÒ7G–ÆS×·²ÆVgC¢G¶÷vçÒV×ÒF—FÆS×¶G·B†ÆærÂ'–÷W$FF"—Ó¢G¶÷vçÖÒóãÂöF—cà¢Ç7G&öæsç¶fW&vWÓÇ6ÖÆÃç´çVÖ&W"æ—4f–æ—FR†÷vâ’òòG¶÷vçÖ¢"'ÓÂ÷6ÖÆÃãÂ÷7G&öæsà¢ÂöF—cà¢“°¢Ò—Ð¢ÂöF—cà¢Âö'F–6ÆSà¢’—Ð¢ÂöF—cà¢¶6ö†÷'G2æÆVæwF‚òÇ6Æ74æÖSÒ&6ö†÷'BÖÆVvVæB#ãÆ’óç·B†ÆærÂ&6ö†÷'DfW&vR"—ÒÆVÒóç·B†ÆærÂ'–÷W%&öf–ÆTÖ&¶W""—ÓÂ÷â¢çVÆÇÐ¢Âóà¢—Ð¢Â÷6V7F–öãà ¢Ç6V7F–öâ6Æ74æÖSÒ'&W6V&6‚×G&6·2×6V7F–öâ#à¢ÆF—b6Æ74æÖSÒ&6&BÖ†VF–ær#ãÆF—cãÇ6Æ74æÖSÒ&W–V'&÷r#ã"+r·B†ÆærÂ'&W6V&6…G&6·4W–V'&÷r"—ÓÂ÷ãÆƒ#ç·B†ÆærÂ'&W6V&6…G&6·5F—FÆR"—ÓÂöƒ#ãÂöF—cãÄ6†'DÆ–æUW6—¦S×³#‡ÒvV–v‡CÒ&GV÷FöæR"óãÂöF—cà¢ÆF—b6Æ74æÖSÒ'&W6V&6‚×G&6²Öw&–B#àÐ¢·G&6·2æÖ‚…´–6öâÂF—FÆRÂ&öG’Â6öÆ÷%ÒÂ–æFW‚’Óâ€Ð¢Æ'F–6ÆR¶W“×·F—FÆWÒ7G–ÆS×·²"Ò×G&6²Ö6öÆ÷"#¢6öÆ÷"×ÓàÐ¢Ç7â6Æ74æÖSÒ'G&6²Ö–æFW‚#çµ7G&–ær†–æFW‚²’çE7F'Bƒ"Â#"—ÓÂ÷7ãàÐ¢Ç7â6Æ74æÖSÒ'G&6²Ö–6öâ#ãÄ–6öâ6—¦S×³#'ÒvV–v‡CÒ&GV÷FöæR"óãÂ÷7ãàÐ¢Æƒ3ç·B†ÆærÂF—FÆR—ÓÂöƒ3àÐ¢Çç·B†ÆærÂ&öG’—ÓÂ÷àÐ¢Âö'F–6ÆSàÐ¢’—ÐÐ¢ÂöF—càÐ¢Â÷6V7F–öãàÐ Ð¢Ç6V7F–öâ6Æ74æÖSÒ&FF×F–W"×6V7F–öâæVÂÖ6&B#à¢ÆF—b6Æ74æÖSÒ&6&BÖ†VF–ær#ãÆF—cãÇ6Æ74æÖSÒ&W–V'&÷r#ã2+r·B†ÆærÂ&FFÖ–æ–Ö—6F–öâ"—ÓÂ÷ãÆƒ#ç·B†ÆærÂ&FFÆ–W'5F—FÆR"—ÓÂöƒ#ãÂöF—cãÅ6†–VÆD6†V6²6—¦S×³#‡ÒvV–v‡CÒ&GV÷FöæR"óãÂöF—cà¢ÆF—b6Æ74æÖSÒ&FF×F–W"Öw&–B#àÐ¢·F–W'2æÖ‚…¶–BÂF—FÆRÂ&öG’ÂVæ&ÆVEÒ’Óâ€Ð¢Æ'F–6ÆR¶W“×¶–GÒ6Æ74æÖS×¶Væ&ÆVBò&Væ&ÆVB"¢"'ÓàÐ¢Ç7ãç¶–GÓÂ÷7ãàÐ¢ÆF—cãÆƒ3ç·B†ÆærÂF—FÆR—ÓÂöƒ3ãÇç·B†ÆærÂ&öG’—ÓÂ÷ãÂöF—càÐ¢Æ“ç¶Væ&ÆVBòÄ6†V6²vV–v‡CÒ&&öÆB"óâ¢ÄÆö6´¶W’óçÓÂö“àÐ¢Âö'F–6ÆSàÐ¢’—ÐÐ¢ÂöF—cà¢ÆF—b6Æ74æÖSÒ'6fVwV&BÖæ÷FR#ãÄ–æfòvV–v‡CÒ&f–ÆÂ"óãÆF—cãÇ7G&öæsç·B†ÆærÂ'6fVwV&EF—FÆR"—ÓÂ÷7G&öæsãÇ7ãç·B†ÆærÂ'6fVwV&D&öG’"—ÓÂ÷7ããÂöF—cãÂöF—cà¢Å&W6V&6„æ÷F–6RÆæs×¶ÆæwÒóà¢Â÷6V7F–öãà¢ÂöF—càÐ¢“°Ð§ÐÐ Ð¦gVæ7F–öâ6WGF–æw567&VVâ‡²ÆærÂ7FFRÂ6WE7FFRÂæ÷F–g’Ò’°¢6öç7B·6WGF–æw2Â6WE6WGF–æw5ÒÒW6U7FFR‡7FFRç6WGF–æw2“°¢6öç7B¶FF'W7’Â6WDFF'W7•ÒÒW6U7FFR†fÇ6R“°¢6öç7B&Vv–öç2ÒvWE&Vv–öç2‡6WGF–æw2æ6÷VçG'’“°¢6öç7BWFFRÒ†¶W’ÂfÇVR’Óâ6WE6WGF–æw2‚†7W'&VçB’Óâ‡²ââæ7W'&VçBÂ¶¶W•Ó¢fÇVRÂâââ†¶W’ÓÓÒ&6÷VçG'’"ò²&Vv–öã¢""Ò¢·Ò’Ò’“°Ð¢6öç7B6fRÒ‚’Óâ°Ð¢6WE7FFR‚†7W'&VçB’Óâ‡²ââæ7W'&VçBÂ6WGF–æw2Ò’“°Ð¢æ÷F–g’‡B†ÆærÂ'6WGF–æw56fVB"’“°Ð¢Ó°Ð¢6öç7BW‡÷'E&W6V&6‚Ò7–æ2‚’Óâ°¢–b‚7FFRç&W6V&6‚ç'F–6—çEFö¶Vâ’&WGW&âæ÷F–g’‡B†ÆærÂ'&W6V&6…Fö¶VäÖ—76–ær"’Â&W'&÷""“°¢6WDFF'W7’‡G'VR“°¢G'’°¢F÷væÆöE&W6V&6„W‡÷'B†v—B'F–6—F–öä7F–öâ‡7FFRç&W6V&6‚ç'F–6—çEFö¶VâÂ&W‡÷'B"’“°¢æ÷F–g’‡B†ÆærÂ'&W6V&6„W‡÷'E&VG’"’“°¢Ò6F6‚°¢æ÷F–g’‡B†ÆærÂ'&W6V&6„FF7F–öäW'&÷""’Â&W'&÷""“°¢Òf–æÆÇ’°¢6WDFF'W7’†fÇ6R“°¢Ð¢Ó°¢6öç7Bv—F†G&u&W6V&6‚Ò7–æ2‚’Óâ°¢–b‚v–æF÷ræ6öæf—&Ò‡B†ÆærÂ'&W6V&6„FVÆWFT6öæf—&Ò"’’’&WGW&ã°¢6WDFF'W7’‡G'VR“°¢G'’°¢–b‡7FFRç&W6V&6‚ç'F–6—çEFö¶Vâ’v—B'F–6—F–öä7F–öâ‡7FFRç&W6V&6‚ç'F–6—çEFö¶VâÂ&FVÆWFR"“°¢6WE7FFR‚†7W'&VçB’Óâ‡°¢ââæ7W'&VçBÀ¢&W6V&6ƒ¢²ââæ–æ—F–Å7FFRç&W6V&6‚ÂÖöFS¢'&—fFR"ÂFV6—6–öäC¢æWrFFR‚’çFô•4õ7G&–ær‚’ÒÀ¢Ò’“°¢æ÷F–g’‡B†ÆærÂ'&W6V&6„FVÆWFVB"’“°¢Ò6F6‚°¢æ÷F–g’‡B†ÆærÂ'&W6V&6„FF7F–öäW'&÷""’Â&W'&÷""“°¢Òf–æÆÇ’°¢6WDFF'W7’†fÇ6R“°¢Ð¢Ó°¢6öç7B&VÖ÷fTÆÂÒ7–æ2‚’Óâ°¢–b‚v–æF÷ræ6öæf—&Ò‡B†ÆærÂ&FVÆWFT6öæf—&Ò"’’’&WGW&ã°¢6WDFF'W7’‡G'VR“°¢G'’°¢–b‡7FFRç&W6V&6‚ç'F–6—çEFö¶Vâ’v—B'F–6—F–öä7F–öâ‡7FFRç&W6V&6‚ç'F–6—çEFö¶VâÂ&FVÆWFR"“°¢6ÆV%7FFR‚“°¢6WE7FFR‡²ââæ–æ—F–Å7FFRÂÆæwVvS¢ÆærÒ“°¢6WE6WGF–æw2†–æ—F–Å7FFRç6WGF–æw2“°¢æ÷F–g’‡B†ÆærÂ&FVÆWFTFöæR"’“°¢Ò6F6‚°¢æ÷F–g’‡B†ÆærÂ'&W6V&6„FF7F–öäW'&÷""’Â&W'&÷""“°¢Òf–æÆÇ’°¢6WDFF'W7’†fÇ6R“°¢Ð¢Ó°¢&WGW&â€Ð¢ÆF—b6Æ74æÖSÒ'vR6WGF–æw2×vR#àÐ¢Å6V7F–öä†VFW"F—FÆS×·B†ÆærÂ'6WGF–æw5F—FÆR"—Ò&öG“×·B†ÆærÂ'6WGF–æw4–çG&ò"—ÒóàÐ¢ÆF—b6Æ74æÖSÒ'6WGF–æw2ÖÆ–÷WB#àÐ¢Ç6V7F–öâ6Æ74æÖSÒ'æVÂÖ6&B6WGF–æw2Öf÷&Ò#àÐ¢ÆF—b6Æ74æÖSÒ&6&BÖ†VF–ær#ãÆF—cãÇ6Æ74æÖSÒ&W–V'&÷r#ç·B†ÆærÂ&FFÖ–æ–Ö—6F–öâ"—ÓÂ÷ãÆƒ#ç·B†ÆærÂ&7W'&VçE&öf–ÆR"—ÓÂöƒ#ãÂöF—cãÅ6†–VÆD6†V6²vV–v‡CÒ&GV÷FöæR"óãÂöF—càÐ¢ÆÆ&VÃãÇ7ãç·B†ÆærÂ&Æ–2"—ÓÂ÷7ããÆ–çWBfÇVS×·6WGF–æw2æÆ–7ÒÖ„ÆVæwFƒ×³ƒÒÆ6V†öÆFW#×·B†ÆærÂ&Æ–5Æ6V†öÆFW""—Òöä6†ævS×²†WfVçB’ÓâWFFR‚&Æ–2"ÂWfVçBçF&vWBçfÇVR—ÒóãÂöÆ&VÃàÐ¢ÆF—b6Æ74æÖSÒ&f÷&ÒÖw&–B#àÐ¢ÆÆ&VÃãÇ7ãç·B†ÆærÂ&vT&æB"—ÓÂ÷7ããÇ6VÆV7BfÇVS×·6WGF–æw2ævT&æGÒöä6†ævS×²†WfVçB’ÓâWFFR‚&vT&æB"ÂWfVçBçF&vWBçfÇVR—ÓãÆ÷F–öâfÇVSÒ"#ç·B†ÆærÂ&6†ö÷6R"—ÓÂö÷F–öãç´tUô$äE2æÖ‚†&æB’ÓâÆ÷F–öâ¶W“×¶&æBæ–GÒfÇVS×¶&æBæ–GÓç¶Æö6Æ—¦R†&æBæÆ&VÂÂÆær—ÓÂö÷F–öãâ—ÓÂ÷6VÆV7CãÂöÆ&VÃàÐ¢ÆÆ&VÃãÇ7ãç·B†ÆærÂ&6÷VçG'’"—ÓÂ÷7ããÇ6VÆV7BfÇVS×·6WGF–æw2æ6÷VçG'—Òöä6†ævS×²†WfVçB’ÓâWFFR‚&6÷VçG'’"ÂWfVçBçF&vWBçfÇVR—ÓãÆ÷F–öâfÇVSÒ"#ç·B†ÆærÂ&6†ö÷6R"—ÓÂö÷F–öãç´4õTåE$”U2æÖ‚†6÷VçG'’’ÓâÆ÷F–öâ¶W“×¶6÷VçG'’æ–GÒfÇVS×¶6÷VçG'’æ–GÓç¶Æö6Æ—¦R†6÷VçG'’æÆ&VÂÂÆær—ÓÂö÷F–öãâ—ÓÂ÷6VÆV7CãÂöÆ&VÃàÐ¢ÆÆ&VÃãÇ7ãç·B†ÆærÂ&'&öE&Vv–öâ"—ÓÂ÷7ããÇ6VÆV7BfÇVS×·6WGF–æw2ç&Vv–öçÒF—6&ÆVC×²6WGF–æw2æ6÷VçG'—Òöä6†ævS×²†WfVçB’ÓâWFFR‚'&Vv–öâ"ÂWfVçBçF&vWBçfÇVR—ÓãÆ÷F–öâfÇVSÒ"#ç·B†ÆærÂ&6†ö÷6R"—ÓÂö÷F–öãç·&Vv–öç2æÖ‚‡&Vv–öâ’ÓâÆ÷F–öâ¶W“×·&Vv–öâæ–GÒfÇVS×·&Vv–öâæ–GÓç¶Æö6Æ—¦R‡&Vv–öâæÆ&VÂÂÆær—ÓÂö÷F–öãâ—ÓÂ÷6VÆV7CãÂöÆ&VÃàÐ¢ÂöF—càÐ¢Ç6Æ74æÖSÒ&f÷&ÒÖ†–çB#ãÄ–æfòóç·B†ÆærÂ&ÖWFFF†–çB"—Ò·B†ÆærÂ&W†7DvR"—ÓÂ÷àÐ¢Æ'WGFöâ6Æ74æÖSÒ'&–Ö'’Ö'WGFöâ"öä6Æ–6³×·6fWÓãÄfÆ÷”F—6²óç·B†ÆærÂ'6fU6WGF–æw2"—ÓÂö'WGFöãàÐ¢Â÷6V7F–öãà¢Ç6V7F–öâ6Æ74æÖSÒ'æVÂÖ6&B&W6V&6‚Ö6&B#à¢ÆF—b6Æ74æÖSÒ&6&BÖ†VF–ær#ãÆF—cãÇ6Æ74æÖSÒ&W–V'&÷r#ç·B†ÆærÂ'&W6V&6…7FGW4Æ&VÂ"—ÓÂ÷ãÆƒ#ç·B†ÆærÂ7FFRç&W6V&6‚æÖöFRÓÓÒ'&W6V&6‚"ò&ÖöFU&W6V&6‚"¢&ÖöFU&—fFR"—ÓÂöƒ#ãÂöF—cãÄ†æD†V'BvV–v‡CÒ&GV÷FöæR"óãÂöF—cà¢Çç·B†ÆærÂ7FFRç&W6V&6‚æÖöFRÓÓÒ'&W6V&6‚"ò'&W6V&6…7F÷&vT&öG’"¢'&—fFU7F÷&vT&öG’"—ÓÂ÷à¢ÆF—b6Æ74æÖSÒ'&W6V&6‚×W'÷6R#ãÄ–æfòvV–v‡CÒ&f–ÆÂ"óãÇ7ãç·B†ÆærÂ'&W6V&6…W'÷6R"—ÓÂ÷7ããÂöF—cà¢·7FFRç&W6V&6‚æÖöFRÓÓÒ'&W6V&6‚"ò€¢Ãà¢ÆF—b6Æ74æÖSÒ'&W6V&6‚×&V6V—B#à¢Ç7ããÇ7G&öæsç·B†ÆærÂ&vVæFW""—ÓÂ÷7G&öæsç·B†ÆærÂtTäDU%ôõD”ôå2æf–æB‚…¶–EÒ’Óâ–BÓÓÒ7FFRç&W6V&6‚ævVæFW"“òå³Òóò'&VfW$æ÷B"—ÓÂ÷7ãà¢Ç7ããÇ7G&öæsç·B†ÆærÂ'6WGFÆVÖVçEG—R"—ÓÂ÷7G&öæsç·B†ÆærÂ4UEDÄTÔTåEôõD”ôå2æf–æB‚…¶–EÒ’Óâ–BÓÓÒ7FFRç&W6V&6‚ç6WGFÆVÖVçEG—R“òå³Òóò'&VfW$æ÷B"—ÓÂ÷7ãà¢Ç7ããÇ7G&öæsç·B†ÆærÂ&6÷VçG'’"—ÓÂ÷7G&öæsç¶6ö†÷'DÆ&VÂ‡7FFRç&W6V&6‚æ6÷VçG'’Â&6÷VçG'’"ÂÆær—ÓÂ÷7ãà¢Ç7ããÇ7G&öæsç·B†ÆærÂ&W†7DvU&W6V&6‚"—ÓÂ÷7G&öæsç·7FFRç&W6V&6‚ævWÓÂ÷7ãà¢ÂöF—cà¢ÆF—b6Æ74æÖSÒ'&W6V&6‚ÖFFÖ7F–öç2#à¢Æ'WGFöâ6Æ74æÖSÒ'6V6öæF'’Ö'WGFöâ"F—6&ÆVC×¶FF'W7—Òöä6Æ–6³×¶W‡÷'E&W6V&6‡ÓãÄF÷væÆöE6–×ÆRóç·B†ÆærÂ&F÷væÆöE&W6V&6„FF"—ÓÂö'WGFöãà¢Æ'WGFöâ6Æ74æÖSÒ&FævW"Ö'WGFöâ"F—6&ÆVC×¶FF'W7—Òöä6Æ–6³×·v—F†G&u&W6V&6‡ÓãÅG&6‚óç·B†ÆærÂ&FVÆWFU&W6V&6„FF"—ÓÂö'WGFöãà¢ÂöF—cà¢Âóà¢’¢€¢Æ'WGFöâ6Æ74æÖSÒ'&–Ö'’Ö'WGFöâ"öä6Æ–6³×²‚’Óâ6WE7FFR‚†7W'&VçB’Óâ‡²ââæ7W'&VçBÂ&W6V&6ƒ¢²ââæ–æ—F–Å7FFRç&W6V&6‚ÂÖöFS¢çVÆÂÒÒ’—ÓãÄ†æD†V'Bóç·B†ÆærÂ'&Wf–Wu&W6V&6„6öç6VçB"—ÓÂö'WGFöãà¢—Ð¢Å&W6V&6„æ÷F–6RÆæs×¶ÆæwÒóà¢Â÷6V7F–öãà¢ÂöF—càÐ¢Ç6V7F–öâ6Æ74æÖSÒ'&—f7’×6÷W&6W2æVÂÖ6&B#àÐ¢ÆF—cãÆƒ#ç·B†ÆærÂ'&—f7•6÷W&6W2"—ÓÂöƒ#ãÇç·B†ÆærÂ'7F—4†W&R"—ÓÂ÷ãÂöF—càÐ¢ÆF—b6Æ74æÖSÒ'6÷W&6RÖÆ–æ·2#àÐ¢Æ‡&VcÒ&‡GG3¢òöWW"ÖÆW‚æWW&÷æWRöÆVvÂÖ6öçFVçBôTâõE…Bô…DÔÂó÷W&“Ô4TÄU‚S4#e#cs’Ó#cSB"F&vWCÒ%ö&Ææ²"&VÃÒ&æ÷&VfW'&W"#äURtE"Ä'&÷u&–v‡BóãÂöàÐ¢Æ‡&VcÒ&‡GG3¢ò÷wwræVG"æWW&÷æWRöFö7VÖVçG2öwV–FVÆ–æRöwV–FVÆ–æW2ÓS##ÖöâÖ6öç6VçB×VæFW"×&VwVÆF–öâÓ#ccs•öVâ"F&vWCÒ%ö&Ææ²"&VÃÒ&æ÷&VfW'&W"#äTE"6öç6VçBwV–Fæ6RÄ'&÷u&–v‡BóãÂöàÐ¢Æ‡&VcÒ&‡GG3¢òöV2æWW&÷æWRöWW&÷7FB÷vV"öçWG2"F&vWCÒ%ö&Ææ²"&VÃÒ&æ÷&VfW'&W"#äWW&÷7FBåUE2Ä'&÷u&–v‡BóãÂöàÐ¢ÂöF—càÐ¢Æ'WGFöâ6Æ74æÖSÒ&FævW"Ö'WGFöâ"F—6&ÆVC×¶FF'W7—Òöä6Æ–6³×·&VÖ÷fTÆÇÓãÅG&6‚óç·B†ÆærÂ&FVÆWFTÆÂ"—ÓÂö'WGFöãà¢Â÷6V7F–öãàÐ¢ÂöF—càÐ¢“°Ð§ÐÐ Ð¦W‡÷'BgVæ7F–öâ‚’°Ð¢6öç7B·7FFRÂ6WE7FFUÒÒW6TÖ–æD6—f–Æ—57FFR‚“°Ð¢6öç7BÆærÒ7FFRæÆæwVvS°Ð¢6öç7B·67&VVâÂ6WE67&VVåÒÒW6U7FFR‚&†öÖR"“°Ð¢6öç7B·FW7D–BÂ6WEFW7D–EÒÒW6U7FFR†çVÆÂ“°Ð¢6öç7B·&W7VÇBÂ6WE&W7VÇEÒÒW6U7FFR†çVÆÂ“°Ð¢6öç7B¶Öö&–ÆTæd÷VâÂ6WDÖö&–ÆTæd÷VåÒÒW6U7FFR†fÇ6R“°Ð¢6öç7B·Fö7BÂ6WEFö7EÒÒW6U7FFR†çVÆÂ“°Ð¢6öç7B&öf–ÆRÒW6TÖVÖò‚‚’Óâ'V–ÆE&öf–ÆR‡7FFRæ†—7F÷'’’Â·7FFRæ†—7F÷'•Ò“°Ð¢6öç7BFÆ5&öf–ÆRÒ&öf–ÆRæ†4FFò&öf–ÆR¢°Ð¢66÷&W3¢DTÔõõ44õ$U2ÀÐ¢6öæf–FVæ6S¢ö&¦V7Bæg&öÔVçG&–W2„ö&¦V7Bæ¶W—2„DTÔõõ44õ$U2’æÖ‚†–B’Óâ¶–BÂãs%Ò’’ÀÐ¢Wf–FVæ6S¢ö&¦V7Bæg&öÔVçG&–W2„ö&¦V7Bæ¶W—2„DTÔõõ44õ$U2’æÖ‚†–B’Óâ¶–BÂ²VW7F–öææ—&T–C¢$Ö–æD6—f–Æ—2W†×ÆR"Âç7vW&VC¢‚ÂF÷FÃ¢ÕÒ’’ÀÐ¢†4FF¢fÇ6RÀÐ¢Ó°Ð Ð¢6öç7Bæ÷F–g’Ò†ÖW76vRÂFöæRÒ'7V66W72"’Óâ°Ð¢6WEFö7B‡²ÖW76vRÂFöæRÒ“°Ð¢v–æF÷rç6WEF–ÖV÷WB‚‚’Óâ6WEFö7B†çVÆÂ’ÂC#“°Ð¢Ó°Ð¢6öç7Bæf–vFRÒ†æW‡B’Óâ°Ð¢6WE67&VVâ†æW‡B“°Ð¢6WEFW7D–B†çVÆÂ“°Ð¢6WE&W7VÇB†çVÆÂ“°Ð¢6WDÖö&–ÆTæd÷Vâ†fÇ6R“°Ð¢v–æF÷rç67&öÆÅFò‡²F÷¢Â&V†f–÷#¢'6Öö÷F‚"Ò“°Ð¢Ó°Ð¢6öç7B7F'EFW7BÒ†–B’Óâ°¢6WEFW7D–B†–B“°Ð¢6WE&W7VÇB†çVÆÂ“°Ð¢6WE67&VVâ‚'V—¢"“°Ð¢v–æF÷rç67&öÆÅFò‡²F÷¢Ò“°Ð¢Ó°¢6öç7B6†ævTÆæwVvRÒ†ÆæwVvR’Óâ6WE7FFR‚†7W'&VçB’Óâ‡²ââæ7W'&VçBÂÆæwVvRÒ’“°¢6öç7B†æFÆT6ö×ÆWF–öâÒ†6ö×ÆWF–öâ’Óâ°¢6WE&W7VÇB†6ö×ÆWF–öâ“°¢6WE67&VVâ‚'&W7VÇB"“°¢–b‡7FFRç&W6V&6‚æÖöFRÓÒ'&W6V&6‚"ÇÂ7FFRç&W6V&6‚ç'F–6—çEFö¶Vâ’&WGW&ã°¢6öç7BæW‡E&öf–ÆRÒ'V–ÆE&öf–ÆR…²ââç7FFRæ†—7F÷'’Â6ö×ÆWF–öåÒ“°¢7V&Ö—E&W6V&6…&öf–ÆR‡°¢Fö¶Vã¢7FFRç&W6V&6‚ç'F–6—çEFö¶VâÀ¢&öf–ÆS¢æW‡E&öf–ÆRÀ¢6ö×ÆWF–öâÀ¢Ò’çF†Vâ‚‚’Óâ°¢6WE7FFR‚†7W'&VçB’Óâ‡°¢ââæ7W'&VçBÀ¢&W6V&6ƒ¢²ââæ7W'&VçBç&W6V&6‚ÂÆ7E7V&Ö—GFVDC¢æWrFFR‚’çFô•4õ7G&–ær‚’ÒÀ¢Ò’“°¢æ÷F–g’‡B†ÆærÂ'&W6V&6…&öf–ÆU6fVB"’“°¢Ò’æ6F6‚‚‚’Óâæ÷F–g’‡B†ÆærÂ'&W6V&6…&öf–ÆU6fTW'&÷""’Â&W'&÷""’“°¢Ó° ¢–b‡67&VVâÓÓÒ'V—¢"bbFW7D–B’°¢&WGW&âÅV—¥67&VVâÆæs×¶ÆæwÒ7FFS×·7FFWÒ6WE7FFS×·6WE7FFWÒFW7C×µTU5D”ôää•$Uô%•ô”E·FW7D–E×ÒöäW†—C×²‚’Óâæf–vFR‚'FW7G2"—Òöä6ö×ÆWFS×¶†æFÆT6ö×ÆWF–öçÒóã°¢ÐÐ Ð¢&WGW&â€Ð¢ÆF—b6Æ74æÖSÒ&×6†VÆÂ#àÐ¢Æ6–FR6Æ74æÖS×¶6Æ74æÖW2‚'6–FV&""ÂÖö&–ÆTæd÷Vâbb&Öö&–ÆRÖ÷Vâ"—ÓàÐ¢ÆF—b6Æ74æÖSÒ'6–FV&"×F÷#ãÄ'&æBÆæs×¶ÆæwÒóãÆ'WGFöâ6Æ74æÖSÒ&Öö&–ÆRÖ6Æ÷6R–6öâÖ'WGFöâ"öä6Æ–6³×²‚’Óâ6WDÖö&–ÆTæd÷Vâ†fÇ6R—ÓãÅ‚óãÂö'WGFöããÂöF—càÐ¢ÆæcàÐ¢´äbæÖ‚…¶–BÂ¶W’Â–6öåÒ’ÓâÆ'WGFöâ¶W“×¶–GÒ6Æ74æÖS×·67&VVâÓÓÒ–Bò&7F—fR"¢"'Òöä6Æ–6³×²‚’Óâæf–vFR†–B—ÓãÄ–6öâ6—¦S×³—ÒvV–v‡C×·67&VVâÓÓÒ–Bò&f–ÆÂ"¢'&VwVÆ"'ÒóãÇ7ãç·B†ÆærÂ¶W’—ÓÂ÷7ããÂö'WGFöãâ—ÐÐ¢ÂöæcàÐ¢ÆF—b6Æ74æÖSÒ'6–FV&"×&—f7’#ãÅ6†–VÆD6†V6²6—¦S×³#ÒvV–v‡CÒ&GV÷FöæR"óãÆF—cãÇ7G&öæsç·B†ÆærÂ'&—fFT'”FW6–vâ"—ÓÂ÷7G&öæsãÇ7ãç·B†ÆærÂ7FFRç&W6V&6‚æÖöFRÓÓÒ'&W6V&6‚"ò'6WVFöç–Ö÷W57F÷&vR"¢&Æö6ÄöæÇ’"—ÓÂ÷7ããÂöF—cãÂöF—cà¢ÆF—b6Æ74æÖSÒ'6–FV&"Ö&÷GFöÒ#ãÆ'WGFöâ6Æ74æÖS×·67&VVâÓÓÒ'6WGF–æw2"ò&7F—fR"¢"'Òöä6Æ–6³×²‚’Óâæf–vFR‚'6WGF–æw2"—ÓãÄvV%6—‚óãÇ7ãç·B†ÆærÂ&æe6WGF–æw2"—ÓÂ÷7ããÂö'WGFöããÄÆæwVvU7v—F6‚Ææs×¶ÆæwÒöä6†ævS×¶6†ævTÆæwVvWÒ6ö×7BóãÂöF—càÐ¢Âö6–FSàÐ¢ÆF—b6Æ74æÖSÒ'v÷&·76R#àÐ¢Æ†VFW"6Æ74æÖSÒ'F÷&"#àÐ¢Æ'WGFöâ6Æ74æÖSÒ&Öö&–ÆRÖÖVçR"öä6Æ–6³×²‚’Óâ6WDÖö&–ÆTæd÷Vâ‡G'VR—ÓãÄÆ—7BóãÂö'WGFöãàÐ¢Ä'&æBÆæs×¶ÆæwÒ6ö×7BóàÐ¢ÆF—b6Æ74æÖSÒ'F÷&"×&–v‡B#ãÇ7â6Æ74æÖSÒ&Æö6Â×7FGW2#ãÄÆö6´¶W’vV–v‡CÒ&f–ÆÂ"óç·B†ÆærÂ7FFRç&W6V&6‚æÖöFRÓÓÒ'&W6V&6‚"ò'7F÷&vU7FGW5&W6V&6‚"¢&Æö6ÄöæÇ’"—ÓÂ÷7ããÄÆæwVvU7v—F6‚Ææs×¶ÆæwÒöä6†ævS×¶6†ævTÆæwVvWÒóãÂöF—cà¢Âö†VFW#àÐ¢ÆÖ–â6Æ74æÖSÒ&Ö–âÖ6öçFVçB#àÐ¢·67&VVâÓÓÒ&†öÖR"òÄ†öÖU67&VVâÆæs×¶ÆæwÒ7FFS×·7FFWÒ&öf–ÆS×·&öf–ÆWÒæf–vFS×¶æf–vFWÒ7F'EFW7C×·7F'EFW7GÒóâ¢çVÆÇÐÐ¢·67&VVâÓÓÒ'FW7G2"òÅFW7G567&VVâÆæs×¶ÆæwÒ7FFS×·7FFWÒ7F'EFW7C×·7F'EFW7GÒóâ¢çVÆÇÐÐ¢·67&VVâÓÓÒ'&W7VÇB"bb&W7VÇBòÅ&W7VÇE67&VVâÆæs×¶ÆæwÒ6ö×ÆWF–öã×·&W7VÇGÒæf–vFS×¶æf–vFWÒóâ¢çVÆÇÐÐ¢·67&VVâÓÓÒ&FÆ2"òÄFÆ567&VVâÆæs×¶ÆæwÒ&öf–ÆS×¶FÆ5&öf–ÆWÒ—4FVÖó×²&öf–ÆRæ†4FFÒóâ¢çVÆÇÐÐ¢·67&VVâÓÓÒ&–ç6–v‡G2"òÄ–ç6–v‡G567&VVâÆæs×¶ÆæwÒ&öf–ÆS×·&öf–ÆWÒóâ¢çVÆÇÐÐ¢·67&VVâÓÓÒ&†—7F÷'’"òÄ†—7F÷'•67&VVâÆæs×¶ÆæwÒ7FFS×·7FFWÒ6WE7FFS×·6WE7FFWÒóâ¢çVÆÇÐÐ¢·67&VVâÓÓÒ&6ö×&R"òÄ6ö×&U67&VVâÆæs×¶ÆæwÒ7FFS×·7FFWÒ6WE7FFS×·6WE7FFWÒæ÷F–g“×¶æ÷F–g—Òóâ¢çVÆÇÐÐ¢·67&VVâÓÓÒ'&W6V&6‚"òÅ&W6V&6…67&VVâÆæs×¶ÆæwÒ7FFS×·7FFWÒ&öf–ÆS×·&öf–ÆWÒæf–vFS×¶æf–vFWÒóâ¢çVÆÇÐ¢·67&VVâÓÓÒ&W‡Æ÷&R"òÄW‡Æ÷&U67&VVâÆæs×¶ÆæwÒóâ¢çVÆÇÐÐ¢·67&VVâÓÓÒ'6WGF–æw2"òÅ6WGF–æw567&VVâÆæs×¶ÆæwÒ7FFS×·7FFWÒ6WE7FFS×·6WE7FFWÒæ÷F–g“×¶æ÷F–g—Òóâ¢çVÆÇÐÐ¢ÂöÖ–ãàÐ¢ÂöF—càÐ¢¶Öö&–ÆTæd÷VâòÆ'WGFöâ6Æ74æÖSÒ&Öö&–ÆRÖ÷fW&Æ’"öä6Æ–6³×²‚’Óâ6WDÖö&–ÆTæd÷Vâ†fÇ6R—Ò&–ÖÆ&VÃÒ$6Æ÷6Ræf–vF–öâ"óâ¢çVÆÇÐÐ¢²7FFRç&W6V&6‚æÖöFRòÅ&W6V&6„VçG'”ÖöFÂÆæs×¶ÆæwÒ7FFS×·7FFWÒ6WE7FFS×·6WE7FFWÒöäÆæwVvT6†ævS×¶6†ævTÆæwVvWÒóâ¢çVÆÇÐÐ¢ÅFö7BÖW76vS×·Fö7CòæÖW76vWÒFöæS×·Fö7CòçFöæWÒöä6Æ÷6S×²‚’Óâ6WEFö7B†çVÆÂ—ÒóàÐ¢ÂöF—càÐ¢“°Ð§ÐÐ