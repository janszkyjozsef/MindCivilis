"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  GENDERS,
  MIN_COHORT_SIZE,
  NOTICE_VERSION,
  QUESTIONS,
  SETTLEMENT_TYPES,
  Scores,
  ageBand,
} from "@/lib/research";

type Decision = "declined" | "consented";
type Demographics = {
  gender: string;
  settlementType: string;
  country: string;
  age: number;
};
type StoredState = {
  decision: Decision;
  demographics?: Demographics;
  answers?: number[];
  scores?: Scores;
};
type Cohort = Scores & { label: string; count: number };
type Dimension = "age" | "country" | "settlement" | "gender";

const STORAGE_KEY = "mindcivilis.participation.v1";
const TOKEN_KEY = "mindcivilis.private-token.v1";

function getOrCreateToken() {
  const existing = localStorage.getItem(TOKEN_KEY);
  if (existing) return existing;
  const token = crypto.randomUUID();
  localStorage.setItem(TOKEN_KEY, token);
  return token;
}

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const payload = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "Váratlan hiba történt.");
  }
  return payload;
}

function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => (
        <i key={index} />
      ))}
    </span>
  );
}

function ScoreBar({
  label,
  left,
  right,
  value,
}: {
  label: string;
  left: string;
  right: string;
  value: number;
}) {
  const position = Math.max(0, Math.min(100, 50 + value / 2));
  return (
    <div className="score-row">
      <div className="score-heading">
        <strong>{label}</strong>
        <b>{value > 0 ? `+${value}` : value}</b>
      </div>
      <div className="score-track" aria-label={`${label}: ${value}`}>
        <span className="score-zero" />
        <span className="score-position" style={{ left: `${position}%` }} />
      </div>
      <div className="score-labels">
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );
}

function IdeologyMap({
  scores,
  cohort,
}: {
  scores: Scores;
  cohort: Cohort | null;
}) {
  const pointStyle = {
    left: `${50 + scores.economic * 0.38}%`,
    top: `${50 + scores.social * 0.38}%`,
  };
  const cohortStyle = cohort
    ? {
        left: `${50 + cohort.economic * 0.38}%`,
        top: `${50 + cohort.social * 0.38}%`,
      }
    : undefined;

  return (
    <section className="map-card" aria-labelledby="map-title">
      <div className="card-heading">
        <div>
          <p className="eyebrow">Saját nézettér</p>
          <h2 id="map-title">Ideológiai térkép</h2>
        </div>
        <span className="privacy-chip">Saját pont</span>
      </div>
      <p className="card-intro">
        Két tengelyen mutatjuk meg, merre húznak a válaszaid. Ez tájékozódási
        segédlet, nem politikai diagnózis.
      </p>
      <div className="map-shell">
        <div className="axis-label axis-top">
          <strong>Társadalmi autonómia</strong>
          <small>önrendelkezés, nyitottság</small>
        </div>
        <div className="axis-label axis-right">
          <strong>Piaci önállóság</strong>
          <small>verseny, választás</small>
        </div>
        <div className="axis-label axis-bottom">
          <strong>Közösségi rend</strong>
          <small>folytonosság, összetartozás</small>
        </div>
        <div className="axis-label axis-left">
          <strong>Szolidaritás</strong>
          <small>egyenlőség, közös felelősség</small>
        </div>
        <div className="map-grid">
          <span className="map-axis horizontal" />
          <span className="map-axis vertical" />
          {cohort && cohortStyle ? (
            <span
              className="map-point cohort-point"
              style={cohortStyle}
              title={`${cohort.label} csoportátlaga`}
            />
          ) : null}
          <span
            className="map-point own-point"
            style={pointStyle}
            title="A saját eredményed"
          >
            <i />
          </span>
        </div>
      </div>
      <div className="map-legend">
        <span>
          <i className="legend-dot own" /> Saját eredmény
        </span>
        {cohort ? (
          <span>
            <i className="legend-dot cohort" /> {cohort.label} (n={cohort.count})
          </span>
        ) : null}
      </div>
    </section>
  );
}

export function MindCivilisApp() {
  const [ready, setReady] = useState(false);
  const [token, setToken] = useState("");
  const [stored, setStored] = useState<StoredState | null>(null);
  const [consentOpen, setConsentOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [gender, setGender] = useState("");
  const [settlementType, setSettlementType] = useState("");
  const [country, setCountry] = useState("");
  const [age, setAge] = useState("");
  const [specialConsent, setSpecialConsent] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [dimension, setDimension] = useState<Dimension>("age");
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohort, setSelectedCohort] = useState("");
  const [cohortLoading, setCohortLoading] = useState(false);

  useEffect(() => {
    const privateToken = getOrCreateToken();
    const saved = localStorage.getItem(STORAGE_KEY);
    queueMicrotask(() => {
      setToken(privateToken);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as StoredState;
          setStored(parsed);
          setAnswers(parsed.answers ?? []);
        } catch {
          localStorage.removeItem(STORAGE_KEY);
          setConsentOpen(true);
        }
      } else {
        setConsentOpen(true);
      }
      setReady(true);
    });
  }, []);

  const saveLocal = (next: StoredState) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setStored(next);
  };

  useEffect(() => {
    if (!stored?.scores) return;
    let active = true;
    queueMicrotask(() => setCohortLoading(true));
    fetch(`/api/cohorts?dimension=${dimension}`)
      .then(async (response) => {
        if (!response.ok) throw new Error();
        return (await response.json()) as { cohorts: Cohort[] };
      })
      .then(({ cohorts: nextCohorts }) => {
        if (!active) return;
        setCohorts(nextCohorts);
        const ownValue = ownDimensionValue(dimension, stored.demographics);
        const preferred =
          nextCohorts.find((cohort) => cohort.label === ownValue)?.label ??
          nextCohorts[0]?.label ??
          "";
        setSelectedCohort(preferred);
      })
      .catch(() => {
        if (active) {
          setCohorts([]);
          setSelectedCohort("");
        }
      })
      .finally(() => {
        if (active) setCohortLoading(false);
      });
    return () => {
      active = false;
    };
  }, [dimension, stored?.demographics, stored?.scores]);

  const cohort =
    cohorts.find((item) => item.label === selectedCohort) ?? null;

  async function declineResearch() {
    setBusy(true);
    setError("");
    try {
      await api("/api/decline", {
        method: "POST",
        body: JSON.stringify({ token }),
      });
      saveLocal({ decision: "declined" });
      setConsentOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Mentési hiba.");
    } finally {
      setBusy(false);
    }
  }

  async function consentResearch(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const demographics: Demographics = {
        gender,
        settlementType,
        country: country.trim(),
        age: Number(age),
      };
      await api("/api/consent", {
        method: "POST",
        body: JSON.stringify({
          token,
          ...demographics,
          explicitSpecialCategoryConsent: specialConsent,
        }),
      });
      saveLocal({ decision: "consented", demographics });
      setAnswers([]);
      setQuestionIndex(0);
      setConsentOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Mentési hiba.");
    } finally {
      setBusy(false);
    }
  }

  function answerQuestion(value: number) {
    const nextAnswers = [...answers];
    nextAnswers[questionIndex] = value;
    setAnswers(nextAnswers);
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex(questionIndex + 1);
    }
  }

  async function finishQuestionnaire() {
    if (!stored?.demographics || answers.length !== QUESTIONS.length) return;
    setBusy(true);
    setError("");
    try {
      const response = await api<{ scores: Scores }>("/api/results", {
        method: "POST",
        body: JSON.stringify({ token, answers }),
      });
      saveLocal({
        decision: "consented",
        demographics: stored.demographics,
        answers,
        scores: response.scores,
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Mentési hiba.");
    } finally {
      setBusy(false);
    }
  }

  async function exportData() {
    setBusy(true);
    setError("");
    try {
      const exported = await api<Record<string, unknown>>("/api/participation", {
        method: "POST",
        body: JSON.stringify({ token, action: "export" }),
      });
      const blob = new Blob([JSON.stringify(exported, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "mindcivilis-sajat-adatok.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Exportálási hiba.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteData() {
    if (
      !window.confirm(
        "Biztosan törlöd a MindCivilisben tárolt részvételi adatokat és eredményeket?",
      )
    ) {
      return;
    }
    setBusy(true);
    setError("");
    try {
      await api("/api/participation", {
        method: "POST",
        body: JSON.stringify({ token, action: "delete" }),
      });
      localStorage.removeItem(STORAGE_KEY);
      setStored(null);
      setAnswers([]);
      setPrivacyOpen(false);
      setConsentOpen(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Törlési hiba.");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <main className="loading-screen" role="status">
        <LogoMark />
        <span>MindCivilis betöltése…</span>
      </main>
    );
  }

  const questionnaireComplete = answers.length === QUESTIONS.length;

  return (
    <main className={stored?.scores ? "app result-mode" : "app"}>
      <header className="topbar">
        <button className="brand" onClick={() => window.scrollTo(0, 0)}>
          <LogoMark />
          <span>
            Mind<strong>Civilis</strong>
          </span>
        </button>
        <nav aria-label="Fő navigáció">
          {stored?.scores ? <a href="#terkep">Az én térképem</a> : null}
          <button onClick={() => setNoticeOpen(true)}>Tájékoztató</button>
          <button onClick={() => setPrivacyOpen(true)}>Adatvédelem</button>
        </nav>
        <span className="adult-mark">18+</span>
      </header>

      {stored?.decision === "declined" ? (
        <section className="declined-view">
          <div className="declined-copy">
            <p className="eyebrow">A döntésedet tiszteletben tartjuk</p>
            <h1>A MindCivilis kutatás nélkül is nyitva marad.</h1>
            <p>
              Nem kérünk demográfiai vagy ideológiai adatot, és nem mutatunk
              személyes ideológiai térképet. A döntésről kizárólag egy véletlen,
              álnevesített technikai azonosítót és a tájékoztató verzióját
              tároljuk privát adatbázisban.
            </p>
            <div className="button-row">
              <button
                className="primary-button"
                onClick={() => setConsentOpen(true)}
              >
                Mégis részt veszek
              </button>
              <button
                className="text-button"
                onClick={() => setNoticeOpen(true)}
              >
                Mit tárolunk?
              </button>
            </div>
          </div>
          <div className="declined-visual" aria-hidden="true">
            <span className="ghost-axis horizontal" />
            <span className="ghost-axis vertical" />
            <strong>A térképhez önkéntes hozzájárulás kell</strong>
          </div>
        </section>
      ) : stored?.decision === "consented" && !stored.scores ? (
        <section className="questionnaire-view">
          <div className="questionnaire-head">
            <div>
              <p className="eyebrow">12 rövid állítás</p>
              <h1>Hol helyezkednek el a nézeteid?</h1>
              <p>
                Nincs jó vagy rossz válasz. Azt jelöld, ami most a legközelebb
                áll hozzád.
              </p>
            </div>
            <span className="progress-count">
              {Math.min(questionIndex + 1, QUESTIONS.length)} / {QUESTIONS.length}
            </span>
          </div>
          <div className="progress-track">
            <span
              style={{
                width: `${((questionIndex + (answers[questionIndex] ? 1 : 0)) / QUESTIONS.length) * 100}%`,
              }}
            />
          </div>
          <article className="question-card">
            <span className="question-number">
              {String(questionIndex + 1).padStart(2, "0")}
            </span>
            <h2>{QUESTIONS[questionIndex].text}</h2>
            <div className="likert-labels">
              <span>Egyáltalán nem értek egyet</span>
              <span>Teljesen egyetértek</span>
            </div>
            <div className="likert-buttons">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  aria-label={`${value} az 5-ből`}
                  className={answers[questionIndex] === value ? "selected" : ""}
                  onClick={() => answerQuestion(value)}
                >
                  {value}
                </button>
              ))}
            </div>
          </article>
          <div className="question-actions">
            <button
              className="text-button"
              disabled={questionIndex === 0}
              onClick={() => setQuestionIndex(questionIndex - 1)}
            >
              ← Előző
            </button>
            {questionnaireComplete ? (
              <button
                className="primary-button"
                disabled={busy}
                onClick={finishQuestionnaire}
              >
                {busy ? "Privát mentés…" : "Eredmény megjelenítése"}
              </button>
            ) : (
              <button
                className="secondary-button"
                disabled={!answers[questionIndex]}
                onClick={() =>
                  setQuestionIndex(
                    Math.min(questionIndex + 1, QUESTIONS.length - 1),
                  )
                }
              >
                Következő →
              </button>
            )}
          </div>
          {error ? <p className="form-error">{error}</p> : null}
        </section>
      ) : stored?.scores ? (
        <section className="dashboard" id="terkep">
          <IdeologyMap scores={stored.scores} cohort={cohort} />
          <aside className="result-sidebar">
            <section className="result-card">
              <div className="card-heading">
                <div>
                  <p className="eyebrow">Saját eredmény</p>
                  <h2>Három nézeti tengely</h2>
                </div>
                <span className="saved-mark">Privátan mentve</span>
              </div>
              <ScoreBar
                label="Gazdasági nézet"
                left="Szolidaritás"
                right="Piaci önállóság"
                value={stored.scores.economic}
              />
              <ScoreBar
                label="Társadalmi nézet"
                left="Autonómia"
                right="Közösségi rend"
                value={stored.scores.social}
              />
              <ScoreBar
                label="Nyitottság"
                left="Nemzetközi"
                right="Szuverenitás"
                value={stored.scores.openness}
              />
            </section>
            <section className="compare-card">
              <p className="eyebrow">Összehasonlítás</p>
              <h2>Valódi csoportátlagok</h2>
              <p>
                Kizárólag legalább {MIN_COHORT_SIZE} befejezett részvételből
                számolt átlagot mutatunk.
              </p>
              <label>
                Nézőpont
                <select
                  value={dimension}
                  onChange={(event) =>
                    setDimension(event.target.value as Dimension)
                  }
                >
                  <option value="age">Korosztály</option>
                  <option value="country">Ország</option>
                  <option value="settlement">Településtípus</option>
                  <option value="gender">Nem</option>
                </select>
              </label>
              {cohorts.length ? (
                <label>
                  Csoport
                  <select
                    value={selectedCohort}
                    onChange={(event) => setSelectedCohort(event.target.value)}
                  >
                    {cohorts.map((item) => (
                      <option key={item.label} value={item.label}>
                        {item.label} · n={item.count}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <div className="empty-cohort">
                  <strong>
                    {cohortLoading
                      ? "Csoportok frissítése…"
                      : "Még nincs elegendő adat"}
                  </strong>
                  <span>
                    Ennél a bontásnál egyik csoport sem érte el a 10 főt.
                  </span>
                </div>
              )}
            </section>
            <div className="privacy-note">
              <span className="shield-icon" aria-hidden="true">
                ✓
              </span>
              <div>
                <strong>Az adataid védelme</strong>
                <p>
                  Véletlen helyi kulccsal, név és e-mail nélkül tárolunk.
                </p>
                <button onClick={() => setPrivacyOpen(true)}>
                  Saját adatok kezelése
                </button>
              </div>
            </div>
          </aside>
        </section>
      ) : (
        <section className="hero">
          <p>Az alkalmazás előkészítése…</p>
        </section>
      )}

      <footer>
        <span>MindCivilis · független kutatási prototípus · 2026</span>
        <div>
          <button onClick={() => setNoticeOpen(true)}>Adatkezelés</button>
          <a
            href="https://github.com/janszkyjozsef"
            target="_blank"
            rel="noreferrer"
          >
            Kapcsolat
          </a>
        </div>
      </footer>

      {consentOpen ? (
        <div className="modal-backdrop">
          <section
            className="consent-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-title"
          >
            <div className="consent-copy">
              <div>
                <span className="consent-kicker">Önkéntes kutatás · 18+</span>
                <h1 id="consent-title">Mielőtt elkezdjük</h1>
                <p>
                  A MindCivilis azt vizsgálja, hogyan rendeződnek egymáshoz
                  társadalmi nézetek. A részvétel önkéntes. Ha nemet mondasz,
                  nem kérünk demográfiai vagy ideológiai választ.
                </p>
                <ul>
                  <li>Nincs név, e-mail vagy hirdetési profil.</li>
                  <li>A visszautasítást is csak álnevesített kulccsal mentjük.</li>
                  <li>Bármikor exportálhatod vagy törölheted a saját adataidat.</li>
                </ul>
              </div>
              <button
                className="notice-link"
                onClick={() => setNoticeOpen(true)}
              >
                Részletes adatkezelési tájékoztató ↗
              </button>
            </div>
            <form className="consent-form" onSubmit={consentResearch}>
              <div className="form-heading">
                <p className="eyebrow">Ha részt veszel</p>
                <h2>Négy alapadatot kérünk</h2>
              </div>
              <div className="field-grid">
                <label>
                  Nem
                  <select
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                    required
                  >
                    <option value="">Válassz…</option>
                    {GENDERS.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Településtípus
                  <select
                    value={settlementType}
                    onChange={(event) => setSettlementType(event.target.value)}
                    required
                  >
                    <option value="">Válassz…</option>
                    {SETTLEMENT_TYPES.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Ország
                  <input
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    placeholder="Például: Magyarország"
                    minLength={2}
                    maxLength={80}
                    required
                  />
                </label>
                <label>
                  Életkor
                  <input
                    type="number"
                    value={age}
                    onChange={(event) => setAge(event.target.value)}
                    min={18}
                    max={110}
                    placeholder="18–110"
                    required
                  />
                </label>
              </div>
              <label className="consent-checkbox">
                <input
                  type="checkbox"
                  checked={specialConsent}
                  onChange={(event) => setSpecialConsent(event.target.checked)}
                  required
                />
                <span>
                  Kifejezetten hozzájárulok, hogy a politikai véleményre utaló
                  kérdőívválaszaimat kutatási célból kezeljék.
                  <small>
                    A hozzájárulás visszavonható; a visszavonás nem érinti a
                    korábbi kezelés jogszerűségét.
                  </small>
                </span>
              </label>
              {error ? <p className="form-error">{error}</p> : null}
              <div className="consent-actions">
                <button
                  type="submit"
                  className="primary-button"
                  disabled={busy}
                >
                  {busy ? "Biztonságos mentés…" : "Hozzájárulok a kutatáshoz"}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  disabled={busy}
                  onClick={declineResearch}
                >
                  Folytatom kutatás nélkül
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}

      {noticeOpen ? (
        <NoticeModal onClose={() => setNoticeOpen(false)} />
      ) : null}

      {privacyOpen ? (
        <div className="modal-backdrop">
          <section
            className="sheet-modal privacy-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-title"
          >
            <button
              className="close-button"
              aria-label="Bezárás"
              onClick={() => setPrivacyOpen(false)}
            >
              ×
            </button>
            <p className="eyebrow">Önkiszolgáló adatvédelem</p>
            <h2 id="privacy-title">A saját részvételi adataid</h2>
            <p>
              A böngésződben őrzött véletlen kulccsal tudjuk megtalálni a
              rekordodat. A szerver a kulcsot csak a lenyomat képzéséhez
              használja; maga a kulcs nem kerül az adatbázisba.
            </p>
            <div className="privacy-actions">
              <button
                className="secondary-button"
                disabled={busy}
                onClick={exportData}
              >
                Saját adatok letöltése
              </button>
              <button
                className="danger-button"
                disabled={busy}
                onClick={deleteData}
              >
                Saját adatok végleges törlése
              </button>
            </div>
            {error ? <p className="form-error">{error}</p> : null}
            <small>
              Ha a helyi böngészőadatokat törlöd a kulcs nélkül, a rekord nem
              lesz összekapcsolható veled. Ilyen esetben a GitHub-profilon jelzett
              kapcsolati csatornán kérhetsz segítséget.
            </small>
          </section>
        </div>
      ) : null}
    </main>
  );
}

function ownDimensionValue(
  dimension: Dimension,
  demographics?: Demographics,
) {
  if (!demographics) return "";
  if (dimension === "age") return ageBand(demographics.age);
  if (dimension === "country") return demographics.country;
  if (dimension === "settlement") return demographics.settlementType;
  return demographics.gender;
}

function NoticeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop">
      <section
        className="sheet-modal notice-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="notice-title"
      >
        <button className="close-button" aria-label="Bezárás" onClick={onClose}>
          ×
        </button>
        <p className="eyebrow">Verzió: {NOTICE_VERSION}</p>
        <h2 id="notice-title">Adatkezelési és kutatási tájékoztató</h2>
        <p className="notice-lead">
          Ez a tájékoztató közérthetően és teljes terjedelemben leírja a
          MindCivilis kutatási prototípus adatkezelését. Utolsó frissítés:
          2026. július 28.
        </p>

        <div className="notice-content">
          <section>
            <h3>1. Adatkezelő és kapcsolat</h3>
            <p>
              Adatkezelő: <strong>József Janszky</strong>, a független
              MindCivilis kutatási projekt működtetője. Kapcsolat és azonosítható
              nyilvános profil:{" "}
              <a
                href="https://github.com/janszkyjozsef"
                target="_blank"
                rel="noreferrer"
              >
                github.com/janszkyjozsef
              </a>
              . A saját rekord exportja és törlése az alkalmazásban közvetlenül
              elvégezhető.
            </p>
          </section>
          <section>
            <h3>2. A kutatás célja</h3>
            <p>
              A cél társadalmi, gazdasági és nyitottsági nézetmintázatok
              feltárása, valamint legalább tízfős csoportok összesített
              összehasonlítása korosztály, ország, településtípus és nem szerint.
              Az eredmény nem minősítés, profilalkotási döntés vagy politikai
              diagnózis.
            </p>
          </section>
          <section>
            <h3>3. Kezelt adatok</h3>
            <p>
              Hozzájárulás esetén: nem, településtípus, ország, életkor és
              származtatott korcsoport; a 12 kérdőívválasz; három számított
              tengelyérték; a hozzájárulás és kitöltés időpontja; a tájékoztató
              verziója; valamint egy véletlen helyi részvételi kulcs
              visszafordíthatatlan lenyomata. Név, e-mail, telefonszám vagy
              hirdetési azonosító nem kerül az alkalmazás adatbázisába.
            </p>
            <p>
              Elutasítás esetén kizárólag a részvételi kulcs lenyomata, az
              elutasítás időpontja és a tájékoztató verziója kerül külön,
              privát táblába. Demográfiai vagy ideológiai adat ilyenkor nem
              mentődik.
            </p>
          </section>
          <section>
            <h3>4. Jogalap és különleges adat</h3>
            <p>
              Az általános adatkezelés jogalapja az önkéntes hozzájárulás
              (GDPR 6. cikk (1) a)). A politikai véleményre utaló válaszok
              különleges személyes adatnak minősülhetnek; kezelésük alapja a
              külön, kifejezett hozzájárulás (GDPR 9. cikk (2) a)). A
              hozzájárulás megtagadása nem jár hátránnyal, és bármikor
              visszavonható.
            </p>
          </section>
          <section>
            <h3>5. Tárolás, hozzáférés és címzettek</h3>
            <p>
              Az adatok nem nyilvános, hozzáférés-védett Cloudflare D1
              adatbázisban maradnak. A nyilvános felületen csak legalább{" "}
              {MIN_COHORT_SIZE} fős csoportok száma és átlaga jelenhet meg.
              Egyéni válasz vagy rekord nem kerül nyilvánosságra. Az alkalmazás
              saját adatbázisa nem rögzít IP-címet vagy böngészőazonosítót; a
              tárhely- és hálózati szolgáltatók biztonsági naplói ettől
              függetlenül, saját szabályaik szerint keletkezhetnek.
            </p>
            <p>
              Technikai szolgáltatóként a webhelyet biztosító OpenAI Sites és
              annak Cloudflare-infrastruktúrája férhet hozzá az adatokhoz a
              szolgáltatás működtetéséhez és védelméhez.
            </p>
          </section>
          <section>
            <h3>6. Megőrzési idő</h3>
            <p>
              A kutatási rekordokat legfeljebb 24 hónapig, illetve a
              hozzájárulás visszavonásáig kezeljük. A törlés az alkalmazásból
              azonnal kezdeményezhető. A már jogszerűen létrehozott, kizárólag
              összesített és személyhez többé nem kapcsolható statisztika nem
              feltétlenül állítható vissza egyéni rekordra.
            </p>
          </section>
          <section>
            <h3>7. Az érintett jogai</h3>
            <p>
              Kérhető hozzáférés, helyesbítés, törlés, korlátozás,
              adathordozhatóság, valamint a hozzájárulás visszavonása. A helyi
              kulccsal az export és a törlés önkiszolgálóan elérhető. Panasz a
              Nemzeti Adatvédelmi és Információszabadság Hatóságnál (NAIH) vagy
              az illetékes bíróságnál nyújtható be.
            </p>
          </section>
          <section>
            <h3>8. Biztonság és automatizált döntés</h3>
            <p>
              Álnevesített azonosítást, elkülönített elutasítási rekordokat,
              titkosított hálózati kapcsolatot és minimumlétszámú aggregálást
              alkalmazunk. A pontszám automatikus matematikai összesítés, de nem
              jár jogi vagy hasonlóan jelentős hatással, és nem használjuk
              személyre szabott politikai befolyásolásra.
            </p>
          </section>
          <section>
            <h3>9. Kutatási korlátok</h3>
            <p>
              A minta önkéntes, ezért nem reprezentatív. Az országok és
              csoportok közötti eltérés nem jelent ok-okozati kapcsolatot. Az
              alacsony elemszámú csoportokat a rendszer elrejti; hamis vagy
              szintetikus csoportadatokat nem jelenít meg.
            </p>
          </section>
        </div>
        <button className="primary-button" onClick={onClose}>
          Értem, bezárom
        </button>
      </section>
    </div>
  );
}
