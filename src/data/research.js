import { L } from "./dimensions.js";

export const RESEARCH_NOTICE = {
  en: {
    title: "Research data notice",
    intro: "Research participation is optional. Private mode remains fully usable and stores questionnaire data only in this browser.",
    sections: [
      ["Who and why", "MindCivilis is an independent project by József Janszky. Consented data is used to explore civic-identity patterns, improve questionnaires, examine language equivalence and audit whether scoring behaves differently across broad groups."],
      ["What is stored", "A random participation token is created on your device. The server stores only its SHA-256 hash, your gender choice, settlement type, country, exact age and derived age band, interface language, consent receipt, derived atlas scores and confidence, plus the latest questionnaire summary. The current server workflow does not store raw item answers."],
      ["What is not requested", "No name, email address, account, birth date, postal code, precise location, contact list or imported comparison profile is requested or stored for research."],
      ["Storage and access", "Private-mode data stays in your browser. Consented research data is stored in the MindCivilis site's private database. Public views expose only group averages for cohorts of at least 10 completed participants. Individual records are not public."],
      ["Voluntary choice and withdrawal", "You may refuse without losing any app function. Keep the participation token stored in this browser: it lets you download or permanently delete your server record from Settings. Clearing the browser before deletion can remove that key."],
      ["Retention and review", "This research pilot is reviewed no later than 28 July 2028. Records may be deleted earlier by the participant or when they are no longer needed for the stated pilot purposes."],
      ["Limits and contact", "MindCivilis is exploratory and does not provide diagnosis, party matching or voting advice. Questions about the project can be raised through the linked public researcher profile. Do not participate if you do not accept this storage model."],
    ],
  },
  hu: {
    title: "Teljes kutatási adatkezelési tájékoztató",
    intro: "A kutatási részvétel önkéntes. A privát mód minden funkciója változatlanul használható, és a kérdőívadatokat csak ebben a böngészőben tárolja.",
    sections: [
      ["Ki és milyen célból kezeli az adatokat?", "A MindCivilis Janszky József önálló projektje. A beleegyezéssel megadott adatokat közéleti identitásminták feltárására, a kérdőívek javítására, a nyelvi változatok összevetésére, valamint a pontozás tág társadalmi csoportok közötti eltéréseinek ellenőrzésére használjuk."],
      ["Milyen adatot tárolunk?", "Az eszközöd véletlen részvételi kulcsot készít. A szerver csak ennek SHA-256 lenyomatát, a megadott nemet, településtípust, országot, pontos életkort és az abból képzett korcsoportot, a felület nyelvét, a hozzájárulási nyugtát, a származtatott atlaszpontszámokat és bizonyosságot, továbbá a legutóbbi kérdőív rövid összesítőjét tárolja. A jelenlegi szerverfolyamat nem tárol tételszintű nyers válaszokat."],
      ["Mit nem kérünk?", "Nem kérünk és kutatási célra nem tárolunk nevet, e-mail-címet, fiókot, születési dátumot, irányítószámot, pontos tartózkodási helyet, névjegyzéket vagy importált összehasonlító profilt."],
      ["Hol tároljuk és mi látható?", "Privát módban az adatok a böngésződben maradnak. Beleegyezés esetén a kutatási rekord a MindCivilis oldal elkülönített, nem nyilvános adatbázisába kerül. A nyilvános felület csak legalább 10 befejezett résztvevőből álló csoportok átlagait mutatja; egyéni rekordot nem tesz közzé."],
      ["Önkéntesség és visszavonás", "A részvétel megtagadása semmilyen alkalmazásfunkciót nem vesz el. Őrizd meg a böngészőben tárolt részvételi kulcsot: ezzel a Beállításokban letöltheted vagy végleg törölheted a szerveren tárolt rekordodat. Ha előbb törlöd a böngésző adatait, ez a kulcs elveszhet."],
      ["Megőrzés és felülvizsgálat", "A kutatási pilotot legkésőbb 2028. július 28-án felülvizsgáljuk. A rekordot a résztvevő kérésére, illetve akkor is korábban törölhetjük, ha a megjelölt pilotcélokhoz már nincs rá szükség."],
      ["Korlátok és kapcsolat", "A MindCivilis feltáró önismereti eszköz: nem diagnózis, nem pártajánló és nem szavazási tanács. A projekttel kapcsolatos kérdés a kapcsolt nyilvános kutatói profilon keresztül tehető fel. Ne járulj hozzá, ha ezt a tárolási modellt nem fogadod el."],
    ],
  },
  de: {
    title: "Vollständige Forschungs-Datenschutzhinweise",
    intro: "Die Forschungsteilnahme ist freiwillig. Der private Modus bleibt vollständig nutzbar und speichert Fragebogendaten nur in diesem Browser.",
    sections: [
      ["Verantwortung und Zweck", "MindCivilis ist ein unabhängiges Projekt von József Janszky. Eingewilligte Daten dienen der explorativen Untersuchung ziviler Identitätsmuster, der Verbesserung der Fragebögen, Sprachvergleichen und der Prüfung möglicher Bewertungsunterschiede zwischen breiten Gruppen."],
      ["Gespeicherte Daten", "Das Gerät erzeugt einen zufälligen Teilnahmeschlüssel. Der Server speichert nur dessen SHA-256-Hash, Geschlechtsangabe, Siedlungstyp, Land, genaues Alter und Altersgruppe, Oberflächensprache, Einwilligungsbeleg, abgeleitete Atlaswerte und Konfidenz sowie die neueste Fragebogen-Zusammenfassung. Der aktuelle Serverablauf speichert keine Rohantworten auf Itemebene."],
      ["Nicht erhobene Daten", "Name, E-Mail, Konto, Geburtsdatum, Postleitzahl, genauer Standort, Kontakte und importierte Vergleichsprofile werden für die Forschung weder verlangt noch gespeichert."],
      ["Speicherung und Sichtbarkeit", "Im privaten Modus bleiben Daten im Browser. Eingewilligte Forschungsdaten liegen in der privaten Datenbank der MindCivilis-Site. Öffentlich sichtbar sind nur Gruppenmittelwerte aus mindestens 10 abgeschlossenen Teilnahmen; Einzelrecords werden nicht veröffentlicht."],
      ["Freiwilligkeit und Widerruf", "Eine Ablehnung schränkt keine App-Funktion ein. Der im Browser gespeicherte Teilnahmeschlüssel ermöglicht in den Einstellungen Download oder endgültige Löschung des Serverrecords. Wird der Browser vorher geleert, kann dieser Schlüssel verloren gehen."],
      ["Aufbewahrung", "Der Forschungspilot wird spätestens am 28. Juli 2028 überprüft. Records können auf Wunsch oder bei Wegfall des Pilotzwecks früher gelöscht werden."],
      ["Grenzen und Kontakt", "MindCivilis ist explorativ und bietet weder Diagnose noch Partei- oder Wahlempfehlung. Fragen können über das verlinkte öffentliche Forschungsprofil gestellt werden. Stimme nicht zu, wenn du dieses Speichermodell nicht akzeptierst."],
    ],
  },
};

export const COHORT_FALLBACK_LABELS = {
  woman: L("Women", "Nők", "Frauen"),
  man: L("Men", "Férfiak", "Männer"),
  "non-binary": L("Non-binary", "Nem bináris", "Nicht-binär"),
  "self-described": L("Self-described", "Más önmeghatározás", "Selbstbezeichnung"),
  "prefer-not": L("Prefer not to say", "Nem kívánja megadni", "Keine Angabe"),
  capital: L("Capital / metropolitan area", "Főváros / metropolisztérség", "Hauptstadt / Metropolregion"),
  "large-city": L("Large city", "Nagyváros", "Großstadt"),
  city: L("City", "Város", "Stadt"),
  "town-village": L("Town or village", "Kisváros vagy falu", "Kleinstadt oder Dorf"),
  rural: L("Rural / farm area", "Külterület vagy tanya", "Ländlicher Raum"),
};
