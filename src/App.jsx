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
        </div>
      </section>

      <section className="home-grid">
        <div className="progress-card panel-card">
          <div className="card-heading"><div><p className="eyebrow">{t(lang, "progress")}</p><h2>{completion}% {t(lang, "completed")}</h2></div><span className="progress-dial" style={{ "--progress": `${completion * 3.6}deg` }}>{completedIds.size}/{QUESTIONNAIRES.length}</span></div>
          <div className="progress-track"><span style={{ width: `${completion}%` }} /></div>
          <button className="recommended-test" onClick={() => startTest(recommended.id)}>
            <span className="recommended-icon" style={{ color: recommended.accent }}><Brain weight="duotone" /></span>
            <span><small>{t(lang, "recommended")}</small><strong>{localize(recommended.title, lang)}</strong><em>{recommended.questions.length} {t(lang, "questions")} · {recommended.minutes} {t(lang, "minutes")}</em></span>
            <ArrowRight />
          </button>
        </div>
        <div className="views-card panel-card">
          <div className="card-heading"><div><p className="eyebrow">{t(lang, "threeViews")}</p><h2>{t(lang, "navAtlas")}</h2></div><button className="text-button" onClick={() => navigate("atlas")}>{t(lang, "openFullAtlas")}<ArrowRight /></button></div>
          <div className="view-preview-grid">
            {[
              [ChartPolar, "viewConstellation", "viewConstellationDesc", "#3fa7ff"],
              [BookOpenText, "viewFieldbook", "viewFieldbookDesc", "#e7b45a"],
              [MapTrifold, "viewTerrain", "viewTerrainDesc", "#65d694"],
            ].map(([Icon, key, desc, color]) => (
              <button key={key} onClick={() => navigate("atlas")}><span style={{ color }}><Icon weight="duotone" /></span><strong>{t(lang, key)}</strong><small>{t(lang, desc)}</small></button>
            ))}
          </div>
        </div>
      </section>

      <section className="privacy-strip">
        <ShieldCheck size={28} weight="duotone" />
        <div><strong>{t(lang, "privateByDesign")}</strong><span>{t(lang, state.research.mode === "research" ? "researchStorageBody" : "privateStorageBody")}</span></div>
        <button onClick={() => navigate("settings")}>{t(lang, "learnMore")}<ArrowRight /></button>
      </section>
    </div>
  );
}

function TestsScreen({ lang, state, startTest }) {
  const [filter, setFilter] = useState("all");
  const completedIds = new Set(state.history.map((entry) => entry.questionnaireId));
  const tests = QUESTIONNAIRES.filter((test) => {
    if (filter === "all") return true;
    if (filter === "exploratory") return test.category === "exploratory";
    return test.category === filter;
  });
  return (
    <div className="page tests-page">
      <SectionHeader
        eyebrow={`${QUESTIONNAIRES.length} modules · ${getDocumentedItemCount()} items`}
        title={t(lang, "testsTitle")}
        body={t(lang, "testsIntro")}
      />
      <div className="filter-row">
        {FILTERS.map(([id, key]) => <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{t(lang, key)}</button>)}
      </div>
      <div className="test-grid">
        {tests.map((test) => {
          const draft = state.drafts[test.id];
          const answered = Object.values(draft?.answers ?? {}).filter((value) => value !== undefined).length;
          const complete = completedIds.has(test.id);
          return (
            <article className="test-card" key={test.id} style={{ "--accent": test.accent }}>
              <div className="test-card-top">
                <span className="test-category">{t(lang, test.category === "exploratory" ? "filterExploratory" : test.category === "civic" ? "filterCivic" : test.category === "values" ? "filterValues" : test.category === "personality" ? "filterPersonality" : "filterPolitical")}</span>
                {complete ? <span className="complete-badge"><Check />{t(lang, "complete")}</span> : null}
              </div>
              <h2>{localize(test.title, lang)}</h2>
              <p>{localize(test.description, lang)}</p>
              <div className="test-meta"><span>{test.questions.length} {t(lang, "questions")}</span><i /><span>{test.minutes} {t(lang, "minutes")}</span></div>
              <div className="test-status"><Info /><span>{t(lang, test.status === "public-domain" ? "publicDomainNote" : test.status === "interpretive" ? "validatedNote" : "exploratoryNote")}</span></div>
              {answered ? <div className="mini-progress"><span style={{ width: `${(answered / test.questions.length) * 100}%` }} /></div> : null}
              <button className="card-action" onClick={() => startTest(test.id)}>
                {answered ? t(lang, "resume") : complete ? t(lang, "retake") : t(lang, "start")}
                <ArrowRight />
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function QuizScreen({ lang, state, setState, test, onExit, onComplete }) {
  const carriedAnswers = useMemo(() => {
    const compatible = {};
    state.history.forEach((entry) => {
      Object.entries(entry.rawAnswers ?? {}).forEach(([questionId, answer]) => {
        if (test.questions.some((question) => question.id === questionId)) compatible[questionId] = answer;
      });
    });
    return { ...compatible, ...(state.drafts[test.id]?.answers ?? {}) };
  }, [state.history, state.drafts, test]);
  const [answers, setAnswers] = useState(carriedAnswers);
  const [index, setIndex] = useState(Math.min(state.drafts[test.id]?.index ?? 0, test.questions.length - 1));
  const [mode, setMode] = useState(state.preferences.scoringMode ?? "blind");
  const question = test.questions[index];
  const answered = Object.values(answers).filter((value) => value !== undefined).length;
  const liveProfile = mergeLiveProfile(state.history, test, answers);
  const liveScores = getTopDimensions(liveProfile, 4);

  useEffect(() => {
    setState((current) => ({
      ...current,
      drafts: { ...current.drafts, [test.id]: { answers, index, updatedAt: new Date().toISOString() } },
      preferences: { ...current.preferences, scoringMode: mode },
    }));
  }, [answers, index, mode, setState, test.id]);

  const choose = (value) => {
    setAnswers((current) => ({ ...current, [question.id]: value }));
    if (index < test.questions.length - 1) window.setTimeout(() => setIndex((current) => current + 1), 120);
  };

  const finish = () => {
    const result = scoreQuestionnaire(test, answers);
    const completion = { ...result, rawAnswers: answers };
    setState((current) => {
      const drafts = { ...current.drafts };
      delete drafts[test.id];
      return { ...current, drafts, history: [...current.history, completion] };
    });
    onComplete(completion);
  };

  return (
    <div className="quiz-page">
      <header className="quiz-header">
        <button className="icon-button" onClick={onExit}><ArrowLeft /></button>
        <div className="quiz-title"><span style={{ color: test.accent }}>{localize(test.title, lang)}</span><small>{answered}/{test.questions.length} {t(lang, "answerCount")}</small></div>
        <button className="save-exit-button" onClick={onExit}><FloppyDisk />{t(lang, "saveExit")}</button>
      </header>
      <div className="quiz-progress"><span style={{ width: `${((index + 1) / test.questions.length) * 100}%`, background: test.accent }} /></div>
      <main className="quiz-layout">
        <section className="question-panel">
          <div className="question-meta"><span>{String(index + 1).padStart(2, "0")} / {test.questions.length}</span><span className="local-save"><Check />{t(lang, "autosaved")}</span></div>
          <h1>{localize(question.text, lang)}</h1>
          <div className="likert-scale">
            <div className="scale-labels"><span>{t(lang, "quizDisagree")}</span><span>{t(lang, "quizAgree")}</span></div>
            <div className="scale-options">
              {[1, 2, 3, 4, 5].map((value) => <button key={value} className={answers[question.id] === value ? "selected" : ""} onClick={() => choose(value)}><span>{value}</span>{value === 3 ? <small>{t(lang, "quizNeutral")}</small> : null}</button>)}
            </div>
            <button className={classNames("skip-button", answers[question.id] === 0 && "selected")} onClick={() => choose(0)}>{t(lang, "quizSkip")}</button>
          </div>
          <div className="quiz-nav">
            <button disabled={index === 0} onClick={() => setIndex((current) => Math.max(0, current - 1))}><ArrowLeft />{t(lang, "previous")}</button>
            {index === test.questions.length - 1 ? <button className="primary-button" onClick={finish}>{t(lang, "finish")}<Check /></button> : <button onClick={() => setIndex((current) => Math.min(test.questions.length - 1, current + 1))}>{t(lang, "next")}<ArrowRight /></button>}
          </div>
        </section>
        <aside className="quiz-aside">
          <div className="mode-switch">
            <button className={mode === "blind" ? "active" : ""} onClick={() => setMode("blind")}><EyeSlash />{t(lang, "blindMode")}</button>
            <button className={mode === "live" ? "active" : ""} onClick={() => setMode("live")}><Eye />{t(lang, "liveMode")}</button>
          </div>
          <p>{t(lang, mode === "blind" ? "blindModeHint" : "liveModeHint")}</p>
          {mode === "blind" ? (
            <div className="blind-visual"><LockKey weight="duotone" /><span>{Math.round((answered / test.questions.length) * 100)}%</span><small>{t(lang, "coverage")}</small></div>
          ) : (
            <div className="live-scores">
              {liveScores.map(({ id, score }) => <div key={id}><span>{localize(DIMENSIONS[id].label, lang)}</span><strong>{score}</strong><i><em style={{ width: `${score}%`, background: DIMENSIONS[id].color }} /></i></div>)}
            </div>
          )}
          <div className="quiz-method-note"><Info /><span>{t(lang, test.status === "public-domain" ? "publicDomainNote" : test.status === "interpretive" ? "validatedNote" : "exploratoryNote")}</span></div>
        </aside>
      </main>
    </div>
  );
}

function ResultScreen({ lang, completion, navigate }) {
  const dimensions = Object.entries(completion.dimensions).filter(([, result]) => result.answered > 0).sort((a, b) => Math.abs(b[1].score - 50) - Math.abs(a[1].score - 50));
  return (
    <div className="page result-page">
      <div className="result-hero">
        <span className="result-check"><Check weight="bold" /></span>
        <p className="eyebrow">{localize(completion.questionnaireTitle, lang)}</p>
        <h1>{t(lang, "resultTitle")}</h1>
        <p>{t(lang, "resultBody")}</p>
        <div className="result-metrics">
          <MetricCard icon={CheckCircle} label={t(lang, "coverage")} value={percentage(completion.coverage)} color="#65d694" />
          <MetricCard icon={ShieldCheck} label={t(lang, "confidence")} value={percentage(completion.coverage)} color="#3fa7ff" />
          <MetricCard icon={Sparkle} label={t(lang, "complexity")} value={`${completion.complexity}/100`} color="#9a7cff" />
        </div>
      </div>
      <section className="result-dimensions panel-card">
        <div className="card-heading"><div><p className="eyebrow">{t(lang, "topDrivers")}</p><h2>{t(lang, "identityLayers")}</h2></div></div>
        {dimensions.map(([id, result]) => {
          const dimension = DIMENSIONS[id];
          return (
            <div className="result-dimension" key={id}>
              <div><span className="detail-dot" style={{ background: dimension.color }} /><strong>{localize(dimension.label, lang)}</strong><small>{localize(result.score >= 50 ? dimension.positivePole : dimension.negativePole, lang)}</small></div>
              <div className="result-bar"><span style={{ width: `${result.score}%`, background: dimension.color }} /><i style={{ left: `${result.score}%` }} /></div>
              <strong>{result.score}</strong>
            </div>
          );
        })}
      </section>
      <div className="result-actions"><button className="primary-button" onClick={() => navigate("atlas")}>{t(lang, "openFullAtlas")}<ArrowRight /></button><button className="secondary-button" onClick={() => navigate("tests")}>{t(lang, "backTests")}</button></div>
    </div>
  );
}

function AtlasScreen({ lang, profile, isDemo }) {
  const [view, setView] = useState("constellation");
  const [groupFilter, setGroupFilter] = useState("all");
  const available = Object.keys(profile.scores).filter((id) => DIMENSIONS[id]);
  const [selectedId, setSelectedId] = useState(available[0] ?? "culturalPluralism");
  return (
    <div className="page atlas-page">
      <SectionHeader
        eyebrow={isDemo ? t(lang, "exampleData") : t(lang, "yourData")}
        title={t(lang, "atlasTitle")}
        body={t(lang, "atlasSubtitle")}
        actions={<AtlasViewSwitcher view={view} setView={setView} lang={lang} />}
      />
      <div className="atlas-filters">
        {ATLAS_GROUPS.filter(([id]) => id === "all" || Object.values(DIMENSIONS).some((dimension) => dimension.group === id && Number.isFinite(profile.scores[dimension.id]))).map(([id, key]) => (
          <button key={id} className={groupFilter === id ? "active" : ""} onClick={() => setGroupFilter(id)}><i style={{ background: id === "all" ? "#dce9f5" : GROUPS[id]?.color }} />{t(lang, key)}</button>
        ))}
      </div>
      {view === "constellation" ? <ConstellationView profile={profile} lang={lang} groupFilter={groupFilter} selectedId={selectedId} setSelectedId={setSelectedId} /> : null}
      {view === "fieldbook" ? <FieldbookView profile={profile} lang={lang} selectedId={selectedId} setSelectedId={setSelectedId} /> : null}
      {view === "terrain" ? <TerrainView profile={profile} lang={lang} groupFilter={groupFilter} selectedId={selectedId} setSelectedId={setSelectedId} /> : null}
    </div>
  );
}

function InsightsScreen({ lang, profile }) {
  const metrics = getProfileMetrics(profile);
  const top = getTopDimensions(profile, 5);
  const tensions = getTensions(profile, 4);
  if (!profile.hasData) return (
    <div className="page"><SectionHeader title={t(lang, "insightsTitle")} body={t(lang, "insightsIntro")} /><div className="empty-state"><Lightbulb weight="duotone" /><h2>{t(lang, "noResults")}</h2></div></div>
  );
  return (
    <div className="page insights-page">
      <SectionHeader title={t(lang, "insightsTitle")} body={t(lang, "insightsIntro")} />
      <div className="metric-grid three">
        <MetricCard icon={ShieldCheck} label={t(lang, "confidence")} value={`${metrics.confidence}%`} note={`${metrics.layers} ${t(lang, "identityLayers").toLowerCase()}`} color="#3fa7ff" />
        <MetricCard icon={Sparkle} label={t(lang, "complexity")} value={`${metrics.complexity}/100`} note={t(lang, "modelPrincipleBody")} color="#9a7cff" />
        <MetricCard icon={ChartLineUp} label={t(lang, "coverage")} value={`${metrics.coverage}%`} note={t(lang, "overlapOnly")} color="#65d694" />
      </div>
      <div className="insight-layout">
        <section className="panel-card narrative-list">
          <div className="card-heading"><div><p className="eyebrow">{t(lang, "topDrivers")}</p><h2>{t(lang, "plainLanguage")}</h2></div></div>
          {top.map(({ id, score, confidence }, index) => (
            <article key={id}>
              <span className="insight-number">0{index + 1}</span>
              <div><h3>{localize(DIMENSIONS[id].label, lang)} <em>{score}</em></h3><p>{interpretDimension(id, score, lang)}</p><small>{Math.round(confidence * 100)}% {t(lang, "confidence").toLowerCase()}</small></div>
            </article>
          ))}
        </section>
        <section className="panel-card tensions-list">
          <div className="card-heading"><div><p className="eyebrow">{t(lang, "tensions")}</p><h2>{t(lang, "threeViews")}</h2></div></div>
          {tensions.length ? tensions.map(({ a, b, intensity }) => (
            <article key={`${a}-${b}`}>
              <div className="tension-icons"><i style={{ background: DIMENSIONS[a].color }} /><span>×</span><i style={{ background: DIMENSIONS[b].color }} /></div>
              <h3>{localize(DIMENSIONS[a].label, lang)} ↔ {localize(DIMENSIONS[b].label, lang)}</h3>
              <div className="tension-meter"><span style={{ width: `${intensity}%` }} /></div>
              <small>{intensity}/100 · {t(lang, "tension")}</small>
            </article>
          )) : <p>{t(lang, "noResults")}</p>}
        </section>
      </div>
    </div>
  );
}

function HistoryScreen({ lang, state, setState }) {
  const [expanded, setExpanded] = useState(null);
  const history = [...state.history].reverse();
  return (
    <div className="page history-page">
      <SectionHeader title={t(lang, "historyTitle")} body={t(lang, "historyIntro")} />
      {!history.length ? <div className="empty-state"><ClockCounterClockwise weight="duotone" /><h2>{t(lang, "noHistory")}</h2></div> : (
        <div className="history-timeline">
          {history.map((completion, index) => {
            const questionnaire = QUESTIONNAIRE_BY_ID[completion.questionnaireId];
            const isOpen = expanded === completion.completedAt;
            return (
              <article key={`${completion.completedAt}-${index}`} className={isOpen ? "open" : ""}>
                <span className="timeline-dot" style={{ background: questionnaire?.accent ?? "#3fa7ff" }} />
                <button className="history-summary" onClick={() => setExpanded(isOpen ? null : completion.completedAt)}>
                  <span><small>{dateLabel(completion.completedAt, lang)}</small><strong>{localize(questionnaire?.title ?? completion.questionnaireTitle, lang)}</strong><em>{completion.answered}/{completion.total} · {Math.round(completion.coverage * 100)}% {t(lang, "coverage").toLowerCase()}</em></span>
                  <span className="history-score">{completion.complexity}<small>{t(lang, "complexity")}</small></span>
                </button>
                {isOpen ? <div className="history-details">{Object.entries(completion.dimensions).map(([id, result]) => <div key={id}><span>{localize(DIMENSIONS[id]?.label, lang)}</span><i><em style={{ width: `${result.score}%`, background: DIMENSIONS[id]?.color }} /></i><strong>{result.score}</strong></div>)}</div> : null}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CompareScreen({ lang, state, setState, notify }) {
  const inputRef = useRef(null);
  const current = makeCurrentProfile(state);
  const [selectedId, setSelectedId] = useState(state.importedProfiles[0]?.id ?? "");
  const [includeMeta, setIncludeMeta] = useState(state.preferences.includeMetadataInExport);
  const selected = state.importedProfiles.find((profile) => profile.id === selectedId);
  const comparison = selected ? compareProfiles(current, selected) : null;

  const exportCurrent = (includeRaw = false) => {
    if (includeRaw && !window.confirm(t(lang, "rawWarning"))) return;
    const capsule = createProfileCapsule(state, { includeMetadata: includeMeta, includeRaw });
    downloadJson(capsule, `${(state.settings.alias || "mindcivilis-profile").replaceAll(" ", "-").toLowerCase()}.mindcivilis`);
  };

  const importFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const profile = parseProfileCapsule(await file.text());
      setState((currentState) => ({ ...currentState, importedProfiles: [...currentState.importedProfiles.filter((item) => item.id !== profile.id), profile] }));
      setSelectedId(profile.id);
      notify(t(lang, "profileImported"));
    } catch {
      notify(t(lang, "profileImportError"), "error");
    } finally {
      event.target.value = "";
    }
  };

  const addExample = () => {
    setState((currentState) => ({ ...currentState, importedProfiles: [...currentState.importedProfiles.filter((item) => item.id !== EXAMPLE_PROFILE.id), EXAMPLE_PROFILE] }));
    setSelectedId(EXAMPLE_PROFILE.id);
  };

  return (
    <div className="page compare-page">
      <SectionHeader title={t(lang, "compareTitle")} body={t(lang, "compareIntro")} />
      <div className="compare-toolbar panel-card">
        <div className="export-box">
          <span className="tool-icon"><Export weight="duotone" /></span>
          <div><strong>{t(lang, "currentProfile")}</strong><small>{current.alias} · {Object.keys(current.scores).length} {t(lang, "identityLayers").toLowerCase()}</small></div>
          <button onClick={() => exportCurrent(false)}><DownloadSimple />{t(lang, "exportProfile")}</button>
          <button className="subtle" onClick={() => exportCurrent(true)}>{t(lang, "exportRaw")}</button>
        </div>
        <label className="check-row"><input type="checkbox" checked={includeMeta} onChange={(event) => { setIncludeMeta(event.target.checked); setState((currentState) => ({ ...currentState, preferences: { ...currentState.preferences, includeMetadataInExport: event.target.checked } })); }} /><span>{t(lang, "includeMetadata")}</span></label>
        <div className="import-actions">
          <input ref={inputRef} type="file" accept=".mindcivilis,.json,application/json" hidden onChange={importFile} />
          <button className="secondary-button" onClick={() => inputRef.current?.click()}><FileArrowUp />{t(lang, "importProfile")}</button>
          <button className="text-button" onClick={addExample}><UsersThree />{t(lang, "addExample")}</button>
        </div>
      </div>
      <div className="profile-selector">
        <span>{t(lang, "savedProfiles")}</span>
        {state.importedProfiles.length ? state.importedProfiles.map((profile) => (
          <button key={profile.id} className={selectedId === profile.id ? "active" : ""} onClick={() => setSelectedId(profile.id)}><span>{profile.alias.slice(0, 1).toUpperCase()}</span><strong>{profile.alias}</strong><small>{profile.isExample ? "Example" : dateLabel(profile.importedAt ?? profile.createdAt, lang)}</small></button>
        )) : <button className="empty-profile" onClick={addExample}><UsersThree /><span>{t(lang, "selectProfile")}</span></button>}
      </div>
      {comparison ? (
        <div className="comparison-grid">
          <section className="panel-card compare-chart">
            <div className="card-heading"><div><p className="eyebrow">{t(lang, "sharedCoverage")}</p><h2>{comparison.overlap} {t(lang, "identityLayers").toLowerCase()}</h2></div><span className="coverage-pill">{comparison.confidence}% {t(lang, "confidence").toLowerCase()}</span></div>
            {comparison.rows.map((row) => (
              <div className="compare-row" key={row.id}>
                <span>{localize(DIMENSIONS[row.id].label, lang)}</span>
                <div className="dual-track"><i className="current-marker" style={{ left: `${row.scoreA}%` }} title={`${current.alias}: ${row.scoreA}`} /><i className="other-marker" style={{ left: `${row.scoreB}%` }} title={`${selected.alias}: ${row.scoreB}`} /><em /></div>
                <strong>{row.scoreA}<small> / </small>{row.scoreB}</strong>
              </div>
            ))}
          </section>
          <div className="compare-findings">
            <section className="panel-card"><div className="card-heading"><div><p className="eyebrow">{t(lang, "commonGround")}</p></div></div>{comparison.commonGround.length ? comparison.commonGround.map((row) => <article key={row.id}><i style={{ background: DIMENSIONS[row.id].color }} /><div><strong>{localize(DIMENSIONS[row.id].label, lang)}</strong><span>{row.difference} {t(lang, "pointGap")}</span></div></article>) : <p>{t(lang, "overlapOnly")}</p>}</section>
            <section className="panel-card"><div className="card-heading"><div><p className="eyebrow">{t(lang, "biggestDifferences")}</p></div></div>{comparison.differences.map((row) => <article key={row.id}><i className="difference" style={{ background: DIMENSIONS[row.id].color }} /><div><strong>{localize(DIMENSIONS[row.id].label, lang)}</strong><span>{row.difference} {t(lang, "pointGap")}</span></div></article>)}</section>
          </div>
        </div>
      ) : <div className="empty-state"><UsersThree weight="duotone" /><h2>{t(lang, "selectProfile")}</h2><p>{t(lang, "overlapOnly")}</p></div>}
    </div>
  );
}

function ExploreScreen({ lang }) {
  const [group, setGroup] = useState("all");
  const dimensions = Object.values(DIMENSIONS).filter((dimension) => group === "all" || dimension.group === group);
  return (
    <div className="page explore-page">
      <SectionHeader title={t(lang, "exploreTitle")} body={t(lang, "exploreIntro")} />
      <section className="model-principle panel-card"><span><Compass weight="duotone" /></span><div><h2>{t(lang, "modelPrinciple")}</h2><p>{t(lang, "modelPrincipleBody")}</p></div></section>
      <div className="filter-row">{ATLAS_GROUPS.map(([id, key]) => <button key={id} className={group === id ? "active" : ""} onClick={() => setGroup(id)}>{t(lang, key)}</button>)}</div>
      <div className="dimension-grid">
        {dimensions.map((dimension) => (
          <article key={dimension.id} style={{ "--accent": dimension.color }}>
            <span className="dimension-group">{localize(GROUPS[dimension.group]?.label, lang)}</span>
            <h3>{localize(dimension.label, lang)}</h3>
            <div className="pole-pair"><span>{localize(dimension.negativePole, lang)}</span><i /><span>{localize(dimension.positivePole, lang)}</span></div>
            <p>{localize(dimension.description, lang)}</p>
          </article>
        ))}
      </div>
      <section className="inventory panel-card">
        <div className="card-heading"><div><p className="eyebrow">{t(lang, "fullInventory")}</p><h2>{QUESTIONNAIRES.length} · {getDocumentedItemCount()} {t(lang, "questions")}</h2></div></div>
        <div className="inventory-list">{QUESTIONNAIRES.map((test) => <div key={test.id}><i style={{ background: test.accent }} /><span>{localize(test.title, lang)}</span><strong>{test.questions.length}</strong><small>{t(lang, test.status === "public-domain" ? "publicDomainNote" : test.status === "interpretive" ? "validatedNote" : "exploratoryNote")}</small></div>)}</div>
      </section>
    </div>
  );
}

function cohortLabel(value, dimension, lang) {
  if (dimension === "country") {
    return localize(COUNTRIES.find((country) => country.id === value)?.label ?? { en: value, hu: value, de: value }, lang);
  }
  if (dimension === "age") {
    return localize(AGE_BANDS.find((band) => band.id === value)?.label ?? { en: value, hu: value, de: value }, lang);
  }
  return localize(COHORT_FALLBACK_LABELS[value] ?? { en: value, hu: value, de: value }, lang);
}

function ResearchScreen({ lang, state, profile, navigate }) {
  const [dimension, setDimension] = useState("age");
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cohortError, setCohortError] = useState("");
  const tracks = [
    [CheckCircle, "trackQualityTitle", "trackQualityBody", "#65d694"],
    [GlobeHemisphereWest, "trackLanguageTitle", "trackLanguageBody", "#3fa7ff"],
    [Brain, "trackStructureTitle", "trackStructureBody", "#9a7cff"],
    [MapTrifold, "trackDemographicTitle", "trackDemographicBody", "#e7b45a"],
    [ClockCounterClockwise, "trackLongitudinalTitle", "trackLongitudinalBody", "#63c7d7"],
    [Scales, "trackBiasTitle", "trackBiasBody", "#ef907b"],
  ];
  const tiers = [
    ["R1", "tierOneTitle", "tierOneBody", state.research.mode === "research"],
    ["R2", "tierTwoTitle", "tierTwoBody", false],
    ["R3", "tierThreeTitle", "tierThreeBody", state.research.mode === "research"],
  ];
  const scoreIds = PRIMARY_ATLAS_DIMENSIONS.filter((id) => Number.isFinite(profile.scores?.[id])).slice(0, 6);

  useEffect(() => {
    let active = true;
    if (state.research.mode !== "research") {
      setCohorts([]);
      return () => { active = false; };
    }
    setLoading(true);
    setCohortError("");
    fetchResearchCohorts(dimension)
      .then((payload) => {
        if (active) setCohorts(payload.cohorts ?? []);
      })
      .catch(() => {
        if (active) setCohortError(t(lang, "cohortLoadError"));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [dimension, lang, state.research.mode]);

  return (
    <div className="page research-page">
      <SectionHeader
        eyebrow={t(lang, "researchTracksEyebrow")}
        title={t(lang, "researchHubTitle")}
        body={t(lang, "researchHubIntro")}
        actions={<button className="secondary-button" onClick={() => navigate("settings")}><GearSix />{t(lang, "manageResearchChoice")}</button>}
      />
      <section className="research-status-grid">
        <article className="panel-card collection-panel">
          <p className="eyebrow">{t(lang, "researchStatusLabel")}</p>
          <div className="collection-panel-title"><span><LockKey size={22} weight="duotone" /></span><div><h2>{t(lang, state.research.mode === "research" ? "researchStorageActive" : "privateStorageActive")}</h2><p>{t(lang, state.research.mode === "research" ? "researchStorageBody" : "privateStorageBody")}</p></div></div>
          <div className="mode-readout"><span>{t(lang, "researchModeLabel")}</span><strong className={state.research.mode === "research" ? "research" : "private"}>{t(lang, state.research.mode === "research" ? "modeResearch" : "modePrivate")}</strong></div>
        </article>
        <article className="panel-card researcher-panel">
          <p className="eyebrow">MindCivilis × research</p>
          <h2>{t(lang, "researcherTitle")}</h2>
          <p>{t(lang, "researcherBody")}</p>
          <div className="researcher-links">
            <a className="primary-button" href="https://janszkyjozsef.github.io/Ifj.-Janszky-J-zsef-Profil/#applications" target="_blank" rel="noreferrer">{t(lang, "openResearchProfile")}<Export /></a>
            <a className="secondary-button" href="https://jozsef-janszky-portfolio.joe328.chatgpt.site/#applications" target="_blank" rel="noreferrer">{t(lang, "openSitesProfile")}<Export /></a>
          </div>
        </article>
      </section>

      <section className="cohort-section panel-card">
        <div className="card-heading"><div><p className="eyebrow">01 · {t(lang, "cohortEyebrow")}</p><h2>{t(lang, "cohortTitle")}</h2></div><UsersThree size={28} weight="duotone" /></div>
        <p>{t(lang, "cohortIntro")}</p>
        {state.research.mode !== "research" ? (
          <div className="cohort-locked"><LockKey weight="duotone" /><div><strong>{t(lang, "cohortConsentRequired")}</strong><p>{t(lang, "cohortConsentBody")}</p></div><button className="primary-button" onClick={() => navigate("settings")}>{t(lang, "manageResearchChoice")}</button></div>
        ) : (
          <>
            <div className="cohort-controls">
              <span>{t(lang, "compareBy")}</span>
              {COHORT_DIMENSIONS.map(([id, key]) => <button key={id} className={dimension === id ? "active" : ""} onClick={() => setDimension(id)}>{t(lang, key)}</button>)}
            </div>
            {loading ? <div className="cohort-empty">{t(lang, "loading")}</div> : null}
            {cohortError ? <div className="cohort-empty error">{cohortError}</div> : null}
            {!loading && !cohortError && !cohorts.length ? <div className="cohort-empty"><UsersThree weight="duotone" /><strong>{t(lang, "cohortNotReady")}</strong><span>{t(lang, "cohortThreshold").replace("{count}", MIN_COHORT_SIZE)}</span></div> : null}
            <div className="cohort-grid">
              {cohorts.map((cohort) => (
                <article key={cohort.label}>
                  <header><div><strong>{cohortLabel(cohort.label, dimension, lang)}</strong><span>{cohort.count} {t(lang, "participants")}</span></div><span className="privacy-threshold"><ShieldCheck />n≥{MIN_COHORT_SIZE}</span></header>
                  <div className="cohort-score-list">
                    {scoreIds.filter((id) => Number.isFinite(cohort.scores?.[id])).map((id) => {
                      const average = cohort.scores[id];
                      const own = profile.scores[id];
                      return (
                        <div key={id}>
                          <span>{localize(DIMENSIONS[id].label, lang)}</span>
                          <div className="cohort-dual-track"><i style={{ width: `${average}%`, background: DIMENSIONS[id].color }} /><em style={{ left: `${own}%` }} title={`${t(lang, "yourData")}: ${own}`} /></div>
                          <strong>{average}<small>{Number.isFinite(own) ? ` / ${own}` : ""}</small></strong>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>
            {cohorts.length ? <p className="cohort-legend"><i />{t(lang, "cohortAverage")} <em />{t(lang, "yourProfileMarker")}</p> : null}
          </>
        )}
      </section>

      <section className="research-tracks-section">
        <div className="card-heading"><div><p className="eyebrow">02 · {t(lang, "researchTracksEyebrow")}</p><h2>{t(lang, "researchTracksTitle")}</h2></div><ChartLineUp size={28} weight="duotone" /></div>
        <div className="research-track-grid">
          {tracks.map(([Icon, title, body, color], index) => (
            <article key={title} style={{ "--track-color": color }}>
              <span className="track-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="track-icon"><Icon size={22} weight="duotone" /></span>
              <h3>{t(lang, title)}</h3>
              <p>{t(lang, body)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="data-tier-section panel-card">
        <div className="card-heading"><div><p className="eyebrow">03 · {t(lang, "dataMinimisation")}</p><h2>{t(lang, "dataLayersTitle")}</h2></div><ShieldCheck size={28} weight="duotone" /></div>
        <div className="data-tier-grid">
          {tiers.map(([id, title, body, enabled]) => (
            <article key={id} className={enabled ? "enabled" : ""}>
              <span>{id}</span>
              <div><h3>{t(lang, title)}</h3><p>{t(lang, body)}</p></div>
              <i>{enabled ? <Check weight="bold" /> : <LockKey />}</i>
            </article>
          ))}
        </div>
        <div className="safeguard-note"><Info weight="fill" /><div><strong>{t(lang, "safeguardTitle")}</strong><span>{t(lang, "safeguardBody")}</span></div></div>
        <ResearchNotice lang={lang} />
      </section>
    </div>
  );
}

function SettingsScreen({ lang, state, setState, notify }) {
  const [settings, setSettings] = useState(state.settings);
  const [dataBusy, setDataBusy] = useState(false);
  const regions = getRegions(settings.country);
  const update = (key, value) => setSettings((current) => ({ ...current, [key]: value, ...(key === "country" ? { region: "" } : {}) }));
  const save = () => {
    setState((current) => ({ ...current, settings }));
    notify(t(lang, "settingsSaved"));
  };
  const exportResearch = async () => {
    if (!state.research.participantToken) return notify(t(lang, "researchTokenMissing"), "error");
    setDataBusy(true);
    try {
      downloadResearchExport(await participationAction(state.research.participantToken, "export"));
      notify(t(lang, "researchExportReady"));
    } catch {
      notify(t(lang, "researchDataActionError"), "error");
    } finally {
      setDataBusy(false);
    }
  };
  const withdrawResearch = async () => {
    if (!window.confirm(t(lang, "researchDeleteConfirm"))) return;
    setDataBusy(true);
    try {
      if (state.research.participantToken) await participationAction(state.research.participantToken, "delete");
      setState((current) => ({
        ...current,
        research: { ...initialState.research, mode: "private", decisionAt: new Date().toISOString() },
      }));
      notify(t(lang, "researchDeleted"));
    } catch {
      notify(t(lang, "researchDataActionError"), "error");
    } finally {
      setDataBusy(false);
    }
  };
  const removeAll = async () => {
    if (!window.confirm(t(lang, "deleteConfirm"))) return;
    setDataBusy(true);
    try {
      if (state.research.participantToken) await participationAction(state.research.participantToken, "delete");
      clearState();
      setState({ ...initialState, language: lang });
      setSettings(initialState.settings);
      notify(t(lang, "deleteDone"));
    } catch {
      notify(t(lang, "researchDataActionError"), "error");
    } finally {
      setDataBusy(false);
    }
  };
  return (
    <div className="page settings-page">
      <SectionHeader title={t(lang, "settingsTitle")} body={t(lang, "settingsIntro")} />
      <div className="settings-layout">
        <section className="panel-card settings-form">
          <div className="card-heading"><div><p className="eyebrow">{t(lang, "dataMinimisation")}</p><h2>{t(lang, "currentProfile")}</h2></div><ShieldCheck weight="duotone" /></div>
          <label><span>{t(lang, "alias")}</span><input value={settings.alias} maxLength={80} placeholder={t(lang, "aliasPlaceholder")} onChange={(event) => update("alias", event.target.value)} /></label>
          <div className="form-grid">
            <label><span>{t(lang, "ageBand")}</span><select value={settings.ageBand} onChange={(event) => update("ageBand", event.target.value)}><option value="">{t(lang, "choose")}</option>{AGE_BANDS.map((band) => <option key={band.id} value={band.id}>{localize(band.label, lang)}</option>)}</select></label>
            <label><span>{t(lang, "country")}</span><select value={settings.country} onChange={(event) => update("country", event.target.value)}><option value="">{t(lang, "choose")}</option>{COUNTRIES.map((country) => <option key={country.id} value={country.id}>{localize(country.label, lang)}</option>)}</select></label>
            <label><span>{t(lang, "broadRegion")}</span><select value={settings.region} disabled={!settings.country} onChange={(event) => update("region", event.target.value)}><option value="">{t(lang, "choose")}</option>{regions.map((region) => <option key={region.id} value={region.id}>{localize(region.label, lang)}</option>)}</select></label>
          </div>
          <p className="form-hint"><Info />{t(lang, "metadataHint")} {t(lang, "exactAge")}</p>
          <button className="primary-button" onClick={save}><FloppyDisk />{t(lang, "saveSettings")}</button>
        </section>
        <section className="panel-card research-card">
          <div className="card-heading"><div><p className="eyebrow">{t(lang, "researchStatusLabel")}</p><h2>{t(lang, state.research.mode === "research" ? "modeResearch" : "modePrivate")}</h2></div><HandHeart weight="duotone" /></div>
          <p>{t(lang, state.research.mode === "research" ? "researchStorageBody" : "privateStorageBody")}</p>
          <div className="research-purpose"><Info weight="fill" /><span>{t(lang, "researchPurpose")}</span></div>
          {state.research.mode === "research" ? (
            <>
              <div className="research-receipt">
                <span><strong>{t(lang, "gender")}</strong>{t(lang, GENDER_OPTIONS.find(([id]) => id === state.research.gender)?.[1] ?? "preferNot")}</span>
                <span><strong>{t(lang, "settlementType")}</strong>{t(lang, SETTLEMENT_OPTIONS.find(([id]) => id === state.research.settlementType)?.[1] ?? "preferNot")}</span>
                <span><strong>{t(lang, "country")}</strong>{cohortLabel(state.research.country, "country", lang)}</span>
                <span><strong>{t(lang, "exactAgeResearch")}</strong>{state.research.age}</span>
              </div>
              <div className="research-data-actions">
                <button className="secondary-button" disabled={dataBusy} onClick={exportResearch}><DownloadSimple />{t(lang, "downloadResearchData")}</button>
                <button className="danger-button" disabled={dataBusy} onClick={withdrawResearch}><Trash />{t(lang, "deleteResearchData")}</button>
              </div>
            </>
          ) : (
            <button className="primary-button" onClick={() => setState((current) => ({ ...current, research: { ...initialState.research, mode: null } }))}><HandHeart />{t(lang, "reviewResearchConsent")}</button>
          )}
          <ResearchNotice lang={lang} />
        </section>
      </div>
      <section className="privacy-sources panel-card">
        <div><h2>{t(lang, "privacySources")}</h2><p>{t(lang, "staysHere")}</p></div>
        <div className="source-links">
          <a href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX%3A02016R0679-20160504" target="_blank" rel="noreferrer">EU GDPR <ArrowRight /></a>
          <a href="https://www.edpb.europa.eu/documents/guideline/guidelines-052020-on-consent-under-regulation-2016679_en" target="_blank" rel="noreferrer">EDPB consent guidance <ArrowRight /></a>
          <a href="https://ec.europa.eu/eurostat/web/nuts" target="_blank" rel="noreferrer">Eurostat NUTS <ArrowRight /></a>
        </div>
        <button className="danger-button" disabled={dataBusy} onClick={removeAll}><Trash />{t(lang, "deleteAll")}</button>
      </section>
    </div>
  );
}

export function App() {
  const [state, setState] = useMindCivilisState();
  const lang = state.language;
  const [screen, setScreen] = useState("home");
  const [testId, setTestId] = useState(null);
  const [result, setResult] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const profile = useMemo(() => buildProfile(state.history), [state.history]);
  const atlasProfile = profile.hasData ? profile : {
    scores: DEMO_SCORES,
    confidence: Object.fromEntries(Object.keys(DEMO_SCORES).map((id) => [id, 0.72])),
    evidence: Object.fromEntries(Object.keys(DEMO_SCORES).map((id) => [id, { questionnaireId: "MindCivilis example", answered: 8, total: 10 }])),
    hasData: false,
  };

  const notify = (message, tone = "success") => {
    setToast({ message, tone });
    window.setTimeout(() => setToast(null), 4200);
  };
  const navigate = (next) => {
    setScreen(next);
    setTestId(null);
    setResult(null);
    setMobileNavOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const startTest = (id) => {
    setTestId(id);
    setResult(null);
    setScreen("quiz");
    window.scrollTo({ top: 0 });
  };
  const changeLanguage = (language) => setState((current) => ({ ...current, language }));
  const handleCompletion = (completion) => {
    setResult(completion);
    setScreen("result");
    if (state.research.mode !== "research" || !state.research.participantToken) return;
    const nextProfile = buildProfile([...state.history, completion]);
    submitResearchProfile({
      token: state.research.participantToken,
      profile: nextProfile,
      completion,
    }).then(() => {
      setState((current) => ({
        ...current,
        research: { ...current.research, lastSubmittedAt: new Date().toISOString() },
      }));
      notify(t(lang, "researchProfileSaved"));
    }).catch(() => notify(t(lang, "researchProfileSaveError"), "error"));
  };

  if (screen === "quiz" && testId) {
    return <QuizScreen lang={lang} state={state} setState={setState} test={QUESTIONNAIRE_BY_ID[testId]} onExit={() => navigate("tests")} onComplete={handleCompletion} />;
  }

  return (
    <div className="app-shell">
      <aside className={classNames("sidebar", mobileNavOpen && "mobile-open")}>
        <div className="sidebar-top"><Brand lang={lang} /><button className="mobile-close icon-button" onClick={() => setMobileNavOpen(false)}><X /></button></div>
        <nav>
          {NAV.map(([id, key, Icon]) => <button key={id} className={screen === id ? "active" : ""} onClick={() => navigate(id)}><Icon size={19} weight={screen === id ? "fill" : "regular"} /><span>{t(lang, key)}</span></button>)}
        </nav>
        <div className="sidebar-privacy"><ShieldCheck size={21} weight="duotone" /><div><strong>{t(lang, "privateByDesign")}</strong><span>{t(lang, state.research.mode === "research" ? "pseudonymousStorage" : "localOnly")}</span></div></div>
        <div className="sidebar-bottom">
          <a className="sidebar-profile-link" href={RESEARCH_PROFILE_URL} aria-label={t(lang, "navProfile")} title={t(lang, "navProfile")}>
            <UserCircle size={19} weight="duotone" />
            <span>{t(lang, "navProfile")}</span>
          </a>
          <button className={screen === "settings" ? "active" : ""} onClick={() => navigate("settings")}><GearSix /><span>{t(lang, "navSettings")}</span></button>
          <LanguageSwitch lang={lang} onChange={changeLanguage} compact />
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNavOpen(true)}><List /></button>
          <Brand lang={lang} compact />
          <div className="topbar-right"><span className="local-status"><LockKey weight="fill" />{t(lang, state.research.mode === "research" ? "storageStatusResearch" : "localOnly")}</span><LanguageSwitch lang={lang} onChange={changeLanguage} /></div>
        </header>
        <main className="main-content">
          {screen === "home" ? <HomeScreen lang={lang} state={state} profile={profile} navigate={navigate} startTest={startTest} /> : null}
          {screen === "tests" ? <TestsScreen lang={lang} state={state} startTest={startTest} /> : null}
          {screen === "result" && result ? <ResultScreen lang={lang} completion={result} navigate={navigate} /> : null}
          {screen === "atlas" ? <AtlasScreen lang={lang} profile={atlasProfile} isDemo={!profile.hasData} /> : null}
          {screen === "insights" ? <InsightsScreen lang={lang} profile={profile} /> : null}
          {screen === "history" ? <HistoryScreen lang={lang} state={state} setState={setState} /> : null}
          {screen === "compare" ? <CompareScreen lang={lang} state={state} setState={setState} notify={notify} /> : null}
          {screen === "research" ? <ResearchScreen lang={lang} state={state} profile={profile} navigate={navigate} /> : null}
          {screen === "explore" ? <ExploreScreen lang={lang} /> : null}
          {screen === "settings" ? <SettingsScreen lang={lang} state={state} setState={setState} notify={notify} /> : null}
        </main>
      </div>
      {mobileNavOpen ? <button className="mobile-overlay" onClick={() => setMobileNavOpen(false)} aria-label="Close navigation" /> : null}
      {!state.research.mode ? <ResearchEntryModal lang={lang} state={state} setState={setState} onLanguageChange={changeLanguage} /> : null}
      <Toast message={toast?.message} tone={toast?.tone} onClose={() => setToast(null)} />
    </div>
  );
}
