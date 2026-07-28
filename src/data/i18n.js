export const LANGUAGES = [
  { id: "en", short: "EN", label: "English" },
  { id: "hu", short: "HU", label: "Magyar" },
  { id: "de", short: "DE", label: "Deutsch" },
];

const copy = {
  en: {
    appName: "MindCivilis",
    tagline: "A layered portrait, not a label.",
    language: "Language",
    demoProfileSource: "MindCivilis example profile",
    navHome: "Home",
    navTests: "Questionnaires",
    navAtlas: "My Atlas",
    navInsights: "Insights",
    navHistory: "History",
    navCompare: "Compare",
    navResearch: "Research",
    navExplore: "Explore",
    navSettings: "Settings",
    privateByDesign: "Private by design",
    staysHere: "Your answers stay in this browser unless you export them.",
    welcomeEyebrow: "YOUR CIVIC SELF, IN LAYERS",
    welcomeTitle: "See the pattern behind your positions.",
    welcomeBody: "MindCivilis combines civic outlook, values, personality and participation style into an evolving identity atlas. It offers reflectionâ€”not a diagnosis, party match or voting recommendation.",
    startSnapshot: "Start the 20-question snapshot",
    openAtlas: "Open example atlas",
    continueDraft: "Continue saved draft",
    progress: "Progress",
    completed: "completed",
    recommended: "Recommended next",
    minutes: "min",
    localOnly: "Local only",
    noAccount: "No account, tracking or cloud required",
    threeViews: "One profile, three readings",
    viewConstellation: "Constellation",
    viewFieldbook: "Fieldbook",
    viewTerrain: "Identity Map",
    viewConstellationDesc: "Relationships and tensions between identity layers.",
    viewFieldbookDesc: "A readable editorial interpretation with evidence.",
    viewTerrainDesc: "Your outlook placed between collectiveâ€“personal and continuityâ€“change.",
    testsTitle: "Questionnaire library",
    testsIntro: "Choose a short entry point or build a deeper atlas over time. Nested questionnaires reuse earlier answers.",
    filterAll: "All",
    filterPolitical: "Political",
    filterPersonality: "Personality",
    filterValues: "Values",
    filterCivic: "Civic life",
    filterExploratory: "Exploratory",
    validatedNote: "Interpretive prototype",
    exploratoryNote: "Exploratory Â· not clinically validated",
    publicDomainNote: "Public-domain IPIP-style items",
    questions: "questions",
    start: "Start",
    resume: "Resume",
    retake: "Retake",
    complete: "Complete",
    quizAgree: "Strongly agree",
    quizDisagree: "Strongly disagree",
    quizNeutral: "Neutral",
    quizSkip: "Not sure / skip",
    previous: "Previous",
    next: "Next",
    finish: "Finish questionnaire",
    saveExit: "Save & exit",
    autosaved: "Saved locally",
    blindMode: "Blind scoring",
    liveMode: "Live preview",
    blindModeHint: "Scores stay hidden until you finish.",
    liveModeHint: "See how your map changes as you answer.",
    resultTitle: "Your result is ready",
    resultBody: "This is a directional reflection based on this questionnaireâ€”not a fixed identity or expert assessment.",
    coverage: "Coverage",
    confidence: "Confidence",
    complexity: "Complexity",
    topDrivers: "What stands out",
    tensions: "Productive tensions",
    evidence: "Evidence",
    openFullAtlas: "Open full atlas",
    backTests: "Back to library",
    atlasTitle: "Your Identity Atlas",
    atlasSubtitle: "One profile, three complementary ways to read it.",
    exampleData: "Example profile â€” complete a questionnaire to replace it",
    yourData: "Built from your saved answers",
    groupAll: "All layers",
    groupPolitical: "Political",
    groupValues: "Values",
    groupPersonality: "Personality",
    groupCivic: "Civic",
    groupKnowledge: "Information",
    groupFuture: "Future",
    groupDialogue: "Dialogue",
    groupCommunity: "Community",
    tapLayer: "Select a layer to read it",
    plainLanguage: "Plain-language interpretation",
    shapedLayer: "What shaped this layer?",
    evidenceSources: "Evidence sources",
    alignment: "Alignment",
    tension: "Tension",
    collective: "Collective",
    personal: "Personal",
    continuity: "Continuity",
    change: "Change",
    fieldbookTitle: "A layered portrait, not a label",
    fieldbookBody: "Your civic identity draws from several sources. This atlas shows how perspectives, priorities and experiences work togetherâ€”and where they pull in different directions.",
    identityLayers: "Your identity layers",
    insightsTitle: "Patterns worth noticing",
    insightsIntro: "Interpretations are generated from your latest local profile and always show their evidence coverage.",
    noResults: "Complete at least one questionnaire to create personal insights.",
    historyTitle: "Your atlas over time",
    historyIntro: "Retakes are preserved locally so you can notice drift without treating every change as a transformation.",
    noHistory: "No completed questionnaires yet.",
    compareTitle: "Compare two profiles",
    compareIntro: "Compare only shared dimensions. There is no single compatibility score: common ground, differences and data coverage are shown separately.",
    currentProfile: "Current profile",
    savedProfiles: "Saved and imported profiles",
    importProfile: "Import profile capsule",
    exportProfile: "Export my profile",
    exportRaw: "Export with raw answers",
    rawWarning: "Raw answers can reveal sensitive political opinions. Share them only deliberately.",
    includeMetadata: "Include optional age band and broad region",
    addExample: "Add an example profile",
    selectProfile: "Select a profile to compare",
    commonGround: "Common ground",
    biggestDifferences: "Biggest differences",
    pointGap: "point gap",
    sharedCoverage: "Shared coverage",
    profileImported: "Profile imported locally",
    profileImportError: "This file is not a valid MindCivilis profile capsule.",
    exploreTitle: "Explore the model",
    exploreIntro: "Every dimension has two poles. A score describes a current tendency, not membership in a type.",
    modelPrinciple: "How to read MindCivilis",
    modelPrincipleBody: "Scores near the middle can indicate balance, context dependence or uncertainty. High confidence means more relevant questions were answeredâ€”not that an interpretation is objectively true.",
    fullInventory: "Full questionnaire inventory",
    settingsTitle: "Privacy & profile settings",
    settingsIntro: "Everything below is optional and stored only in this browser unless you export it.",
    alias: "Profile alias",
    aliasPlaceholder: "e.g. My July atlas",
    ageBand: "Age band",
    country: "Country",
    broadRegion: "Broad region",
    choose: "Chooseâ€¦",
    preferNot: "Prefer not to say",
    metadataHint: "Use an age band and broad regionâ€”not a birth date, postal code or precise location.",
    saveSettings: "Save settings",
    settingsSaved: "Settings saved locally",
    researchTitle: "Optional research contribution",
    researchBody: "Nothing is currently sent anywhere. If you opt in, MindCivilis creates a downloadable research package that you decide whether to share later.",
    researchModeLabel: "How I want to use MindCivilis",
    modePrivate: "Private exploration",
    modeResearch: "Research contribution",
    adultConfirm: "I confirm that I am 18 or older.",
    researchConsent: "I freely consent to a research package containing derived scores, confidence, my latest questionnaire summaries, interface language and selected broad demographics.",
    rawConsent: "Separately include my raw questionnaire responses.",
    longitudinalConsent: "Allow my future contributions to be linked over time using a random study ID.",
    longitudinalWarning: "This enables testâ€“retest and change-over-time research without adding your name or email.",
    consentUnselected: "Consent boxes are intentionally unselected and can be withdrawn before export.",
    createResearch: "Create research package",
    researchReady: "Research package downloaded. It was not uploaded.",
    researchBlocked: "Adult confirmation and score-level consent are required.",
    researchPurpose: "Purpose: exploratory study of civic identity patterns and questionnaire development.",
    researchMissing: "Automatic data collection remains disabled until a named data controller, ethics process, retention period, contact and withdrawal procedure exist.",
    deleteAll: "Delete all local data",
    deleteConfirm: "Delete answers, drafts, history and imported profiles from this browser?",
    deleteDone: "Local MindCivilis data deleted",
    dataActions: "Your data",
    download: "Download",
    close: "Close",
    menu: "Menu",
    learnMore: "Learn more",
    notUploaded: "Not uploaded",
    savedOn: "Saved",
    latest: "Latest",
    answerCount: "answered",
    overlapOnly: "Only overlapping dimensions are included.",
    dataMinimisation: "Data minimisation",
    privacySources: "Privacy and research sources",
    exactAge: "Exact age is requested only if you separately choose research mode.",
    entryTitle: "How would you like to use MindCivilis?",
    entryBody: "Both choices unlock the complete atlas. Your selection can be changed later in Privacy & settings.",
    privateChoiceTitle: "Explore privately",
    privateChoiceBody: "Take questionnaires, save locally, compare profiles and export your atlas. Nothing is used for research.",
    researchChoiceTitle: "I am open to research use",
    researchChoiceBody: "With explicit consent, save four demographic fields and your derived atlas scores in private research storage.",
    sameExperience: "Same complete app Â· no reduced mode",
    entryResearchTitle: "Optional research participation",
    entryResearchBody: "If you consent, we ask only gender, settlement type, country and age. Imported comparison profiles are never included.",
    collectionNotOpen: "Research collection is not yet open",
    collectionNotOpenBody: "This version stores your choice locally and can create a preview package. It has no research upload endpoint.",
    scoreDataTitle: "Score-level contribution",
    scoreDataBody: "Derived scores, confidence, latest questionnaire summaries, interface language and any optional broad demographics. Dates and repeated completions require R3.",
    rawDataTitle: "Item-level answers",
    rawDataBody: "More analytically useful, but potentially more revealing. This remains a separate optional choice.",
    saveResearchChoice: "Save research preferences",
    continuePrivate: "Continue privately",
    back: "Back",
    researchChoiceSaved: "Research preferences saved locally",
    researchHubTitle: "Research map",
    researchHubIntro: "A transparent view of what consented MindCivilis data can help study, what is stored and how privacy-safe group comparisons work.",
    researchStatusLabel: "Current status",
    researcherTitle: "Researcher behind MindCivilis",
    researcherBody: "MindCivilis is an independent application by JÃ³zsef Janszky, PhD candidate and researcher at the University of PÃ©cs.",
    openResearchProfile: "Open research profile",
    openSitesProfile: "Sites portfolio",
    researchTracksEyebrow: "Possible research programme",
    researchTracksTitle: "Six questions the atlas could help answer",
    trackQualityTitle: "Questionnaire quality",
    trackQualityBody: "Completion, missingness, burden, internal consistency and a shorter research core.",
    trackLanguageTitle: "EN Â· HU Â· DE equivalence",
    trackLanguageBody: "Factor structure, translation quality and measurement invariance across languages.",
    trackStructureTitle: "Identity structure",
    trackStructureBody: "How political, value, personality and civic dimensions relate, cluster and form productive tensions.",
    trackDemographicTitle: "Age & broad geography",
    trackDemographicBody: "Exploratory age-band, country, settlement-type and gender comparisons without claiming population norms.",
    trackLongitudinalTitle: "Change over time",
    trackLongitudinalBody: "Future testâ€“retest and profile-change analysis under the same pseudonymous participant token.",
    trackBiasTitle: "Scoring & visualisation audit",
    trackBiasBody: "Check whether scoring, confidence and atlas views behave unevenly across languages or subgroups.",
    dataLayersTitle: "Three separable data layers",
    tierOneTitle: "R1 Â· Derived profile",
    tierOneBody: "Derived scores, confidence and the latest questionnaire summary, stored after explicit consent.",
    tierTwoTitle: "R2 Â· Raw answers",
    tierTwoBody: "Item-level responses are not stored by the current server workflow.",
    tierThreeTitle: "R3 Â· Pseudonymous link",
    tierThreeBody: "A random device token links future contributions. Only its SHA-256 hash is stored; no name, email or imported profile.",
    safeguardTitle: "Privacy boundary",
    safeguardBody: "Individual records stay private. Cohort averages appear only from 10 completed participants, and the browser token enables self-service export or deletion.",
    manageResearchChoice: "Manage my choice",
    pseudonymousStorage: "Pseudonymous private database",
    storageStatusResearch: "Local + consented research",
    researchStorageActive: "Consented research storage is active",
    researchStorageBody: "Answers remain local; selected demographics and derived atlas scores are sent only after explicit consent and stored under a hashed random token.",
    privateStorageActive: "Private browser storage is active",
    privateStorageBody: "Answers, drafts and results stay in this browser and are not used for research.",
    gender: "Gender",
    genderWoman: "Woman",
    genderMan: "Man",
    genderNonBinary: "Non-binary",
    genderSelfDescribed: "Another self-description",
    settlementType: "Settlement type",
    settlementCapital: "Capital / metropolitan area",
    settlementLargeCity: "Large city (100,000+ residents)",
    settlementCity: "City",
    settlementTownVillage: "Town or village",
    settlementRural: "Rural / farm area",
    exactAgeResearch: "Age",
    specialCategoryConsent: "I explicitly consent to the research processing of my civic and political outlook data.",
    specialCategoryConsentBody: "This is voluntary, not required for private use, and can be withdrawn from Settings using the locally stored participation token.",
    researchSaveError: "Consent could not be saved. Nothing was submitted; try again or continue privately.",
    saving: "Savingâ€¦",
    cohortEyebrow: "CONSENTED GROUP VIEW",
    cohortTitle: "How broad groups relate to your atlas",
    cohortIntro: "Compare group averages by age band, country, settlement type or gender. These are exploratory participant averages, not population norms.",
    cohortConsentRequired: "Research consent is reqï¯{¶‰ËkºwµçY±•á¥½¸…Õ˜	…Í¥Ì‘¥•Í•ÌÉ…•‰½•¹ÌƒŠP­•¥¹”™•ÍÑ”%‘•¹Ñ¥Ó‘Ğ½‘•È™…¡±¥¡”	•ÕÉÑ•¥±Õ¹œ¸ˆ°4(€€€½Ù•É…”è€‰‰‘•­Õ¹œˆ°4(€€€½¹™¥‘•¹”è€‰-½¹™¥‘•¹èˆ°4(€€€½µÁ±•á¥Ñäè€‰-½µÁ±•á¥Ó‘Ğˆ°4(€€€Ñ½ÁÉ¥Ù•ÉÌè€‰]…Ì…Õ™›‘±±Ğˆ°4(€€€Ñ•¹Í¥½¹Ìè€‰AÉ½‘Õ­Ñ¥Ù”MÁ…¹¹Õ¹•¸ˆ°4(€€€•Ù¥‘•¹”è€‰	•±•”ˆ°4(€€€½Á•¹Õ±±Ñ±…Ìè€‰Y½±±ÍÓ‘¹‘¥•¸Ñ±…ÌƒÙ™™¹•¸ˆ°4(€€€‰…­Q•ÍÑÌè€‰iÕÈ	¥‰±¥½Ñ¡•¬ˆ°4(€€€…Ñ±…ÍQ¥Ñ±”è€‰•¥¸%‘•¹Ñ¥Ó‘ÑÍ…Ñ±…Ìˆ°4(€€€…Ñ±…ÍMÕ‰Ñ¥Ñ±”è€‰¥¸AÉ½™¥°°‘É•¤Í¥ •ÉŸ‘¹é•¹‘”1•Í…ÉÑ•¸¸ˆ°4(€€€•á…µÁ±•…Ñ„è€‰	•¥ÍÁ¥•±ÁÉ½™¥°ƒŠP•¥¸É…•‰½•¸•ÉÍ•ÑéĞ•Ì‘ÕÉ ‘•¥¹”…Ñ•¸ˆ°4(€€€å½ÕÉ…Ñ„è€‰ÕÌ‘•¥¹•¸•ÍÁ•¥¡•ÉÑ•¸¹Ñİ½ÉÑ•¸ˆ°4(€€€É½ÕÁ±°è€‰±±”M¡¥¡Ñ•¸ˆ°4(€€€É½ÕÁA½±¥Ñ¥…°è€‰A½±¥Ñ¥Í ˆ°4(€€€É½ÕÁY…±Õ•Ìè€‰]•ÉÑ”ˆ°4(€€€É½ÕÁA•ÉÍ½¹…±¥Ñäè€‰A•ÉÏÙ¹±¥¡­•¥Ğˆ°4(€€€É½ÕÁ¥Ù¥Œè€‰i¥Ù¥°ˆ°4(€€€É½ÕÁ-¹½İ±•‘”è€‰%¹™½Éµ…Ñ¥½¸ˆ°4(€€€É½ÕÁÕÑÕÉ”è€‰iÕ­Õ¹™Ğˆ°4(€€€É½ÕÁ¥…±½Õ”è€‰¥…±½œˆ°4(€€€É½ÕÁ½µµÕ¹¥Ñäè€‰•µ•¥¹Í¡…™Ğˆ°4(€€€Ñ…Á1…å•Èè€‰_‘¡±”•¥¹”M¡¥¡Ğ°Õ´Í¥”éÔ±•Í•¸ˆ°4(€€€Á±…¥¹1…¹Õ…”è€‰Y•ÉÍÓ‘¹‘±¥¡”•ÕÑÕ¹œˆ°4(€€€Í¡…Á•‘1…å•Èè€‰]…Ì¡…Ğ‘¥•Í”M¡¥¡Ğ•ÁË‘Ğüˆ°4(€€€•Ù¥‘•¹•M½ÕÉ•Ìè€‰	•±•ÅÕ•±±•¸ˆ°4(€€€…±¥¹µ•¹Ğè€‹q‰•É•¥¹ÍÑ¥µµÕ¹œˆ°4(€€€Ñ•¹Í¥½¸è€‰MÁ…¹¹Õ¹œˆ°4(€€€½±±•Ñ¥Ù”è€‰-½±±•­Ñ¥Øˆ°4(€€€Á•ÉÍ½¹…°è€‰A•ÉÏÙ¹±¥ ˆ°4(€€€½¹Ñ¥¹Õ¥Ñäè€‰-½¹Ñ¥¹Õ¥Ó‘Ğˆ°4(€€€¡…¹”è€‰]…¹‘•°ˆ°4(€€€™¥•±‘‰½½­Q¥Ñ±”è€‰¥¸Ù¥•±Í¡¥¡Ñ¥•ÌA½ÉÑË‘Ğ°­•¥¸Ñ¥­•ÑĞˆ°4(€€€™¥•±‘‰½½­	½‘äè€‰•¥¹”é¥Ù¥±”%‘•¹Ñ¥Ó‘Ğ¡…Ğµ•¡É•É”EÕ•±±•¸¸¥•Í•ÈÑ±…Ìé•¥Ğ°İ¥”A•ÉÍÁ•­Ñ¥Ù•¸°AÉ¥½É¥Ó‘Ñ•¸Õ¹É™…¡ÉÕ¹•¸éÕÍ…µµ•¹ÍÁ¥•±•¸ƒŠPÕ¹İ¼Í¥”¥¸Ù•ÉÍ¡¥•‘•¹”I¥¡ÑÕ¹•¸é¥•¡•¸¸ˆ°4(€€€¥‘•¹Ñ¥Ñå1…å•ÉÌè€‰•¥¹”%‘•¹Ñ¥Ó‘ÑÍÍ¡¥¡Ñ•¸ˆ°4(€€€¥¹Í¥¡ÑÍQ¥Ñ±”è€‰	•µ•É­•¹Íİ•ÉÑ”5ÕÍÑ•Èˆ°4(€€€¥¹Í¥¡ÑÍ%¹ÑÉ¼è€‰•ÕÑÕ¹•¸•¹ÑÍÑ•¡•¸…ÕÌ‘•¥¹•´¹•Õ•ÍÑ•¸±½­…±•¸AÉ½™¥°Õ¹é•¥•¸¥µµ•È¥¡É”…Ñ•¹…‰‘•­Õ¹œ¸ˆ°4(€€€¹½I•ÍÕ±ÑÌè€‰M¡±¥—}”µ¥¹‘•ÍÑ•¹Ì•¥¹•¸É…•‰½•¸…ˆ°Õ´Á•ÉÏÙ¹±¥¡”¥¹‰±¥­”éÔ•É¡…±Ñ•¸¸ˆ°4(€€€¡¥ÍÑ½ÉåQ¥Ñ±”è€‰•¥¸Ñ±…Ì¥´i•¥ÑÙ•É±…Õ˜ˆ°4(€€€¡¥ÍÑ½Éå%¹ÑÉ¼è€‰]¥•‘•É¡½±Õ¹•¸‰±•¥‰•¸±½­…°•É¡…±Ñ•¸°‘…µ¥Ğ‘ÔY•ÉÍ¡¥•‰Õ¹•¸•É­•¹¹ÍĞ°½¡¹”©•‘”ƒ¹‘•ÉÕ¹œ…±Ì]…¹‘•°éÔ‘•ÕÑ•¸¸ˆ°4(€€€¹½!¥ÍÑ½Éäè€‰9½ ­•¥¹”É…•‹Ù•¸…‰•Í¡±½ÍÍ•¸¸ˆ°4(€€€½µÁ…É•Q¥Ñ±”è€‰iİ•¤AÉ½™¥±”Ù•É±•¥¡•¸ˆ°4(€€€½µÁ…É•%¹ÑÉ¼è€‰Y•É±¥¡•¸İ•É‘•¸¹ÕÈ•µ•¥¹Í…µ”¥µ•¹Í¥½¹•¸¸Ì¥‰Ğ­•¥¹•¸•¥¹é•±¹•¸-½µÁ…Ñ¥‰¥±¥Ó‘ÑÍİ•ÉĞè•µ•¥¹Í…µ­•¥Ñ•¸°U¹Ñ•ÉÍ¡¥•‘”Õ¹…Ñ•¹…‰‘•­Õ¹œİ•É‘•¸•ÑÉ•¹¹Ğ•é•¥Ğ¸ˆ°4(€€€ÕÉÉ•¹ÑAÉ½™¥±”è€‰­ÑÕ•±±•ÌAÉ½™¥°ˆ°4(€€€Í…Ù•‘AÉ½™¥±•Ìè€‰•ÍÁ•¥¡•ÉÑ”Õ¹¥µÁ½ÉÑ¥•ÉÑ”AÉ½™¥±”ˆ°4(€€€¥µÁ½ÉÑAÉ½™¥±”è€‰AÉ½™¥±­…ÁÍ•°¥µÁ½ÉÑ¥•É•¸ˆ°4(€€€•áÁ½ÉÑAÉ½™¥±”è€‰5•¥¸AÉ½™¥°•áÁ½ÉÑ¥•É•¸ˆ°4(€€€•áÁ½ÉÑI…Üè€‰5¥ĞI½¡…¹Ñİ½ÉÑ•¸•áÁ½ÉÑ¥•É•¸ˆ°4(€€€É…İ]…É¹¥¹œè€‰I½¡…¹Ñİ½ÉÑ•¸¯Ù¹¹•¸Í•¹Í¥‰±”Á½±¥Ñ¥Í¡”5•¥¹Õ¹•¸½™™•¹±••¸¸Q•¥±”Í¥”¹ÕÈ‰•İÕÍÍĞ¸ˆ°4(€€€¥¹±Õ‘•5•Ñ…‘…Ñ„è€‰=ÁÑ¥½¹…±”±Ñ•ÉÍÉÕÁÁ”Õ¹É¿}É•¥½¸•¥¹‰•é¥•¡•¸ˆ°4(€€€…‘‘á…µÁ±”è€‰	•¥ÍÁ¥•±ÁÉ½™¥°¡¥¹éÕ›ñ•¸ˆ°4(€€€Í•±•ÑAÉ½™¥±”è€‰AÉ½™¥°éÕ´Y•É±•¥ …ÕÍß‘¡±•¸ˆ°4(€€€½µµ½¹É½Õ¹è€‰•µ•¥¹Í…µ”	…Í¥Ìˆ°4(€€€‰¥•ÍÑ¥™™•É•¹•Ìè€‰ËÛ}Ñ”U¹Ñ•ÉÍ¡¥•‘”ˆ°4(€€€Á½¥¹Ñ…Àè€‰AÕ¹­Ñ”‰ÍÑ…¹ˆ°4(€€€Í¡…É•‘½Ù•É…”è€‰•µ•¥¹Í…µ”‰‘•­Õ¹œˆ°4(€€€ÁÉ½™¥±•%µÁ½ÉÑ•è€‰AÉ½™¥°±½­…°¥µÁ½ÉÑ¥•ÉĞˆ°4(€€€ÁÉ½™¥±•%µÁ½ÉÑÉÉ½Èè€‰¥•Í”…Ñ•¤¥ÍĞ­•¥¹”Ÿñ±Ñ¥”5¥¹‘¥Ù¥±¥ÌµAÉ½™¥±­…ÁÍ•°¸ˆ°4(€€€•áÁ±½É•Q¥Ñ±”è€‰…Ì5½‘•±°•É­Õ¹‘•¸ˆ°4(€€€•áÁ±½É•%¹ÑÉ¼è€‰)•‘”¥µ•¹Í¥½¸¡…Ğéİ•¤A½±”¸¥¸]•ÉĞ‰•Í¡É•¥‰Ğ•¥¹”…­ÑÕ•±±”Q•¹‘•¹è°­•¥¹”QåÁ•¹éÕ•£ÙÉ¥­•¥Ğ¸ˆ°4(€€€µ½‘•±AÉ¥¹¥Á±”è€‰5¥¹‘¥Ù¥±¥ÌÉ¥¡Ñ¥œ±•Í•¸ˆ°4(€€€µ½‘•±AÉ¥¹¥Á±•	½‘äè€‰]•ÉÑ”¹…¡”‘•È5¥ÑÑ”¯Ù¹¹•¸ÕÍ±•¥ °-½¹Ñ•áÑ…‰£‘¹¥­•¥Ğ½‘•ÈU¹Í¥¡•É¡•¥Ğ‰•‘•ÕÑ•¸¸!½¡”-½¹™¥‘•¹è¡•§}Ğ°‘…ÍÌµ•¡ÈÉ•±•Ù…¹Ñ”É…•¸‰•…¹Ñİ½ÉÑ•ĞİÕÉ‘•¸ƒŠP¹¥¡Ğ°‘…ÍÌ•¥¹”•ÕÑÕ¹œ½‰©•­Ñ¥Øİ…¡È¥ÍĞ¸ˆ°4(€€€™Õ±±%¹Ù•¹Ñ½Éäè€‰Y½±±ÍÓ‘¹‘¥”É…•‰½•»ñ‰•ÉÍ¥¡Ğˆ°4(€€€Í•ÑÑ¥¹ÍQ¥Ñ±”è€‰…Ñ•¹Í¡ÕÑè€˜AÉ½™¥±•¥¹ÍÑ•±±Õ¹•¸ˆ°4(€€€Í•ÑÑ¥¹Í%¹ÑÉ¼è€‰±±•Ì½±•¹‘”¥ÍĞ½ÁÑ¥½¹…°Õ¹‰±•¥‰Ğ¥¸‘¥•Í•´	É½İÍ•È°Í½±…¹”‘Ô•Ì¹¥¡Ğ•áÁ½ÉÑ¥•ÉÍĞ¸ˆ°4(€€€…±¥…Ìè€‰AÉ½™¥±¹…µ”ˆ°4(€€€…±¥…ÍA±…•¡½±‘•Èè€‰è¸¸5•¥¸)Õ±¤µÑ±…Ìˆ°4(€€€…•	…¹è€‰±Ñ•ÉÍÉÕÁÁ”ˆ°4(€€€½Õ¹ÑÉäè€‰1…¹ˆ°4(€€€‰É½…‘I•¥½¸è€‰É¿}É•¥½¸ˆ°4(€€€¡½½Í”è€‰ÕÍß‘¡±•»Š˜ˆ°4(€€€ÁÉ•™•É9½Ğè€‰-•¥¹”¹…‰”ˆ°4(€€€µ•Ñ…‘…Ñ…!¥¹Ğè€‰9ÕÑé”±Ñ•ÉÍÉÕÁÁ”Õ¹É¿}É•¥½¸ƒŠP­•¥¸•‰ÕÉÑÍ‘…ÑÕ´°­•¥¹”A½ÍÑ±•¥Ñé…¡°½‘•È•¹…Õ”A½Í¥Ñ¥½¸¸ˆ°4(€€€Í…Ù•M•ÑÑ¥¹Ìè€‰¥¹ÍÑ•±±Õ¹•¸ÍÁ•¥¡•É¸ˆ°4(€€€Í•ÑÑ¥¹ÍM…Ù•è€‰¥¹ÍÑ•±±Õ¹•¸±½­…°•ÍÁ•¥¡•ÉĞˆ°4(€€€É•Í•…É¡Q¥Ñ±”è€‰=ÁÑ¥½¹…±”½ÉÍ¡Õ¹Í‰•Ñ•¥±¥Õ¹œˆ°4(€€€É•Í•…É¡	½‘äè€‰•Éé•¥Ğİ¥É¹¥¡ÑÌ…ÕÑ½µ…Ñ¥Í •Í•¹‘•Ğ¸]•¹¸‘ÔéÕÍÑ¥µµÍĞ°•ÉÍÑ•±±Ğ5¥¹‘¥Ù¥±¥Ì•¥¸¡•ÉÕ¹Ñ•É±…‘‰…É•Ì½ÉÍ¡Õ¹ÍÁ…­•Ğ°ƒñ‰•È‘•ÍÍ•¸ÍÃ‘Ñ•É”]•¥Ñ•É…‰”‘Ô•¹ÑÍ¡•¥‘•ÍĞ¸ˆ°4(€€€É•Í•…É¡5½‘•1…‰•°è€‰]¥”¥ 5¥¹‘¥Ù¥±¥Ì¹ÕÑé•¸·Ù¡Ñ”ˆ°4(€€€µ½‘•AÉ¥Ù…Ñ”è€‰AÉ¥Ù…Ñ”É­Õ¹‘Õ¹œˆ°4(€€€µ½‘•I•Í•…É è€‰½ÉÍ¡Õ¹Í‰•¥ÑÉ…œˆ°4(€€€…‘Õ±Ñ½¹™¥É´è€‰% ‰•ÍÓ‘Ñ¥”°‘…ÍÌ¥ µ¥¹‘•ÍÑ•¹Ì€Äà)…¡É”…±Ğ‰¥¸¸ˆ°4(€€€É•Í•…É¡½¹Í•¹Ğè€‰% İ¥±±¥”™É•¥İ¥±±¥œ¥¸•¥¸½ÉÍ¡Õ¹ÍÁ…­•Ğµ¥Ğ…‰•±•¥Ñ•Ñ•¸]•ÉÑ•¸°-½¹™¥‘•¹è°µ•¥¹•¸¹•Õ•ÍÑ•¸É…•‰½•¸µiÕÍ…µµ•¹™…ÍÍÕ¹•¸°=‰•É™³‘¡•¹ÍÁÉ…¡”Õ¹…ÕÍ•ß‘¡±Ñ•¸É½‰•¸‘•µ½É…™¥Í¡•¸¹…‰•¸•¥¸¸ˆ°4(€€€É…İ½¹Í•¹Ğè€‰5•¥¹”I½¡…¹Ñİ½ÉÑ•¸Í•Á…É…Ğ•¥¹‰•é¥•¡•¸¸ˆ°4(€€€±½¹¥ÑÕ‘¥¹…±½¹Í•¹Ğè€‰% •É±…Õ‰”°¯ñ¹™Ñ¥”	•¥ÑË‘”µ¥Ğ•¥¹•ÈéÕ›‘±±¥•¸MÑÕ‘¥•¸µ%¥´i•¥ÑÙ•É±…Õ˜éÔÙ•É­»ñÁ™•¸¸ˆ°4(€€€±½¹¥ÑÕ‘¥¹…±]…É¹¥¹œè€‰¥•Ì•É·Ù±¥¡ĞQ•ÍÓŠMI•Ñ•ÍĞ´Õ¹Y•É±…Õ™Í™½ÉÍ¡Õ¹œ½¡¹”9…µ•¸½‘•Èµ5…¥°µ‘É•ÍÍ”¸ˆ°4(€€€½¹Í•¹ÑU¹Í•±•Ñ•è€‰¥¹İ¥±±¥Õ¹•¸Í¥¹‰•İÕÍÍĞ¹¥¡ĞÙ½É…ÕÍ•ß‘¡±ĞÕ¹¯Ù¹¹•¸Ù½È‘•´áÁ½ÉĞİ¥‘•ÉÉÕ™•¸İ•É‘•¸¸ˆ°4(€€€É•…Ñ•I•Í•…É è€‰½ÉÍ¡Õ¹ÍÁ…­•Ğ•ÉÍÑ•±±•¸ˆ°4(€€€É•Í•…É¡I•…‘äè€‰½ÉÍ¡Õ¹ÍÁ…­•Ğ¡•ÉÕ¹Ñ•É•±…‘•¸¸ÌİÕÉ‘”¹¥¡Ğ¡½¡•±…‘•¸¸ˆ°4(€€€É•Í•…É¡	±½­•è€‰Y½±±«‘¡É¥­•¥ÑÍ‰•ÍÓ‘Ñ¥Õ¹œÕ¹¥¹İ¥±±¥Õ¹œ…Õ˜]•ÉÑ••‰•¹”Í¥¹•É™½É‘•É±¥ ¸ˆ°4(€€€É•Í•…É¡AÕÉÁ½Í”è€‰iİ•¬è•áÁ±½É…Ñ¥Ù”U¹Ñ•ÉÍÕ¡Õ¹œé¥Ù¥±•È%‘•¹Ñ¥Ó‘ÑÍµÕÍÑ•ÈÕ¹É…•‰½•¹•¹Ñİ¥­±Õ¹œ¸ˆ°4(€€€É•Í•…É¡5¥ÍÍ¥¹œè€‰ÕÑ½µ…Ñ¥Í¡”…Ñ•¹•É¡•‰Õ¹œ‰±•¥‰Ğ‘•…­Ñ¥Ù¥•ÉĞ°‰¥ÌY•É…¹Ñİ½ÉÑ±¥¡”°Ñ¡¥­ÁÉ½é•ÍÌ°Õ™‰•İ…¡ÉÕ¹Í™É¥ÍĞ°-½¹Ñ…­ĞÕ¹]¥‘•ÉÉÕ™ÍÙ•É™…¡É•¸‰•¹…¹¹ĞÍ¥¹¸ˆ°4(€€€‘•±•Ñ•±°è€‰±±”±½­…±•¸…Ñ•¸³ÙÍ¡•¸ˆ°4(€€€‘•±•Ñ•½¹™¥É´è€‰¹Ñİ½ÉÑ•¸°¹ÑßñÉ™”°Y•É±…Õ˜Õ¹¥µÁ½ÉÑ¥•ÉÑ”AÉ½™¥±”…ÕÌ‘¥•Í•´	É½İÍ•È³ÙÍ¡•¸üˆ°4(€€€‘•±•Ñ•½¹”è€‰1½­…±”5¥¹‘¥Ù¥±¥Ìµ…Ñ•¸•³ÙÍ¡Ğˆ°4(€€€‘…Ñ…Ñ¥½¹Ìè€‰•¥¹”…Ñ•¸ˆ°4(€€€‘½İ¹±½…è€‰!•ÉÕ¹Ñ•É±…‘•¸ˆ°4(€€€±½Í”è€‰M¡±¥—}•¸ˆ°4(€€€µ•¹Ôè€‰5•»ğˆ°4(€€€±•…É¹5½É”è€‰5•¡È•É™…¡É•¸ˆ°4(€€€¹½ÑUÁ±½…‘•è€‰9¥¡Ğ¡½¡•±…‘•¸ˆ°4(€€€Í…Ù•‘=¸è€‰•ÍÁ•¥¡•ÉĞˆ°4(€€€±…Ñ•ÍĞè€‰9•Õ•ÍÑ”ˆ°4(€€€…¹Íİ•É½Õ¹Ğè€‰‰•…¹Ñİ½ÉÑ•Ğˆ°4(€€€½Ù•É±…Á=¹±äè€‰9ÕÈƒñ‰•É±…ÁÁ•¹‘”¥µ•¹Í¥½¹•¸İ•É‘•¸•¥¹‰•é½•¸¸ˆ°4(€€€‘…Ñ…5¥¹¥µ¥Í…Ñ¥½¸è€‰…Ñ•¹µ¥¹¥µ¥•ÉÕ¹œˆ°4(€€€ÁÉ¥Ù…åM½ÕÉ•Ìè€‰…Ñ•¹Í¡ÕÑè´Õ¹½ÉÍ¡Õ¹ÍÅÕ•±±•¸ˆ°4(€€€•á…Ñ”è€‰…Ì•¹…Õ”±Ñ•Èİ¥É¹ÕÈ‰•¤•¥¹•È•Í½¹‘•ÉÑ•¸½ÉÍ¡Õ¹Í•¥¹İ¥±±¥Õ¹œ…‰•™É…Ğ¸ˆ°(€€€•¹ÑÉåQ¥Ñ±”è€‰]¥”·Ù¡Ñ•ÍĞ‘Ô5¥¹‘¥Ù¥±¥Ì¹ÕÑé•¸üˆ°4(€€€•¹ÑÉå	½‘äè€‰	•¥‘”=ÁÑ¥½¹•¸ƒÙ™™¹•¸‘•¸Ù½±±ÍÓ‘¹‘¥•¸Ñ±…Ì¸Ô­…¹¹ÍĞ‘•¥¹”]…¡°ÍÃ‘Ñ•ÈÕ¹Ñ•È…Ñ•¹Í¡ÕÑè€˜¥¹ÍÑ•±±Õ¹•¸ƒ‘¹‘•É¸¸ˆ°4(€€€ÁÉ¥Ù…Ñ•¡½¥•Q¥Ñ±”è€‰AÉ¥Ù…Ğ•É­Õ¹‘•¸ˆ°4(€€€ÁÉ¥Ù…Ñ•¡½¥•	½‘äè€‰É…•‹Ù•¸…ÕÍ›ñ±±•¸°±½­…°ÍÁ•¥¡•É¸°AÉ½™¥±”Ù•É±•¥¡•¸Õ¹‘•¸Ñ±…Ì•áÁ½ÉÑ¥•É•¸¸9¥¡ÑÌİ¥É›ñÈ½ÉÍ¡Õ¹œÙ•Éİ•¹‘•Ğ¸ˆ°4(€€€É•Í•…É¡¡½¥•Q¥Ñ±”è€‰% ‰¥¸½™™•¸›ñÈ½ÉÍ¡Õ¹Í¹ÕÑéÕ¹œˆ°4(€€€É•Í•…É¡¡½¥•	½‘äè€‰5¥Ğ…ÕÍ‘Ëñ­±¥¡•È¥¹İ¥±±¥Õ¹œİ•É‘•¸Ù¥•È‘•µ½É…™¥Í¡”¹…‰•¸Õ¹…‰•±•¥Ñ•Ñ”Ñ±…Íİ•ÉÑ”ÁÉ¥Ù…Ğ›ñÈ‘¥”½ÉÍ¡Õ¹œ•ÍÁ•¥¡•ÉĞ¸ˆ°(€€€Í…µ•áÁ•É¥•¹”è€‰¥•Í•±‰”Ù½±±ÍÓ‘¹‘¥”ÁÀƒ
Ü­•¥¸•¥¹•Í¡Ë‘¹­Ñ•È5½‘ÕÌˆ°4(€€€•¹ÑÉåI•Í•…É¡Q¥Ñ±”è€‰É•¥İ¥±±¥”½ÉÍ¡Õ¹ÍÑ•¥±¹…¡µ”ˆ°(€€€•¹ÑÉåI•Í•…É¡	½‘äè€‰	•¤¥¹İ¥±±¥Õ¹œ™É…•¸İ¥È¹ÕÈ•Í¡±•¡Ğ°M¥•‘±Õ¹ÍÑåÀ°1…¹Õ¹±Ñ•È¸%µÁ½ÉÑ¥•ÉÑ”Y•É±•¥¡ÍÁÉ½™¥±”İ•É‘•¸¹¥”•¥¹‰•é½•¸¸ˆ°(€€€½±±•Ñ¥½¹9½Ñ=Á•¸è€‰¥”½ÉÍ¡Õ¹ÍÍ…µµ±Õ¹œ¥ÍĞ¹½ ¹¥¡Ğ—Ù™™¹•Ğˆ°4(€€€½±±•Ñ¥½¹9½Ñ=Á•¹	½‘äè€‰¥•Í”Y•ÉÍ¥½¸ÍÁ•¥¡•ÉĞ‘•¥¹”]…¡°±½­…°Õ¹­…¹¸•¥¸Y½ÉÍ¡…ÕÁ…­•Ğ•ÉÍÑ•±±•¸¸Ì¥‰Ğ­•¥¹•¸UÁ±½…µ¹‘ÁÕ¹­Ğ›ñÈ½ÉÍ¡Õ¹œ¸ˆ°4(€€€Í½É•…Ñ…Q¥Ñ±”è€‰	•¥ÑÉ…œ…Õ˜]•ÉÑ••‰•¹”ˆ°4(€€€Í½É•…Ñ…	½‘äè€‰‰•±•¥Ñ•Ñ”]•ÉÑ”°-½¹™¥‘•¹è°¹•Õ•ÍÑ”É…•‰½•¸µiÕÍ…µµ•¹™…ÍÍÕ¹•¸°=‰•É™³‘¡•¹ÍÁÉ…¡”Õ¹½ÁÑ¥½¹…±”É½‰”‘•µ½É…™¥Í¡”¹…‰•¸¸…Ñ•¸Õ¹]¥•‘•É¡½±Õ¹•¸•É™½É‘•É¸HÌ¸ˆ°4(€€€É…İ…Ñ…Q¥Ñ±”è€‰¹Ñİ½ÉÑ•¸…Õ˜%Ñ•µ•‰•¹”ˆ°4(€€€É…İ…Ñ…	½‘äè€‰¹…±åÑ¥Í »ñÑé±¥¡•È°…‰•ÈÁ½Ñ•¹é¥•±°…Õ™Í¡±ÕÍÍÉ•¥¡•È¸¥•Ì‰±•¥‰Ğ•¥¹”Í•Á…É…Ñ”½ÁÑ¥½¹…±”]…¡°¸ˆ°4(€€€Í…Ù•I•Í•…É¡¡½¥”è€‰½ÉÍ¡Õ¹ÍÁË‘™•É•¹é•¸ÍÁ•¥¡•É¸ˆ°4(€€€½¹Ñ¥¹Õ•AÉ¥Ù…Ñ”è€‰AÉ¥Ù…Ğ™½ÉÑ™…¡É•¸ˆ°4(€€€‰…¬è€‰iÕËñ¬ˆ°4(€€€É•Í•…É¡¡½¥•M…Ù•è€‰½ÉÍ¡Õ¹ÍÁË‘™•É•¹é•¸±½­…°•ÍÁ•¥¡•ÉĞˆ°4(€€€É•Í•…É¡!Õ‰Q¥Ñ±”è€‰½ÉÍ¡Õ¹Í­…ÉÑ”ˆ°4(€€€É•Í•…É¡!Õ‰%¹ÑÉ¼è€‰¥¹”ÑÉ…¹ÍÁ…É•¹Ñ”¹Í¥¡Ğ‘…éÔ°İ…Ì•¥¹•İ¥±±¥Ñ”5¥¹‘¥Ù¥±¥Ìµ…Ñ•¸Õ¹Ñ•ÉÍÕ¡•¸¡•±™•¸°İ…Ì•ÍÁ•¥¡•ÉĞİ¥ÉÕ¹İ¥”•Í£ñÑéÑ”ÉÕÁÁ•¹Ù•É±•¥¡”™Õ¹­Ñ¥½¹¥•É•¸¸ˆ°(€€€É•Í•…É¡MÑ…ÑÕÍ1…‰•°è€‰­ÑÕ•±±•ÈMÑ…ÑÕÌˆ°4(€€€É•Í•…É¡•ÉQ¥Ñ±”è€‰½ÉÍ¡•È¡¥¹Ñ•È5¥¹‘¥Ù¥±¥Ìˆ°4(€€€É•Í•…É¡•É	½‘äè€‰5¥¹‘¥Ù¥±¥Ì¥ÍĞ•¥¹”Õ¹…‰£‘¹¥”¹İ•¹‘Õ¹œÙ½¸+ÍéÍ•˜)…¹Íé­ä°½­Ñ½É…¹Õ¹½ÉÍ¡•È…¸‘•ÈU¹¥Ù•ÉÍ¥Ó‘ĞC¥Ì¸ˆ°4(€€€½Á•¹I•Í•…É¡AÉ½™¥±”è€‰½ÉÍ¡Õ¹ÍÁÉ½™¥°ƒÙ™™¹•¸ˆ°4(€€€½Á•¹M¥Ñ•ÍAÉ½™¥±”è€‰M¥Ñ•ÌµA½ÉÑ™½±¥¼ˆ°4(€€€É•Í•…É¡QÉ…­Íå•‰É½Üè€‰7Ù±¥¡•Ì½ÉÍ¡Õ¹ÍÁÉ½É…µ´ˆ°4(€€€É•Í•…É¡QÉ…­ÍQ¥Ñ±”è€‰M•¡ÌÉ…•¸°éÔ‘•¹•¸‘•ÈÑ±…Ì‰•¥ÑÉ…•¸¯Ù¹¹Ñ”ˆ°4(€€€ÑÉ…­EÕ…±¥ÑåQ¥Ñ±”è€‰É…•‰½•¹ÅÕ…±¥Ó‘Ğˆ°4(€€€ÑÉ…­EÕ…±¥Ñå	½‘äè€‰‰Í¡±ÕÍÌ°™•¡±•¹‘”¹Ñİ½ÉÑ•¸°	•±…ÍÑÕ¹œ°¥¹Ñ•É¹”-½¹Í¥ÍÑ•¹èÕ¹•¥¸¯ñÉé•É•È½ÉÍ¡Õ¹Í­•É¸¸ˆ°4(€€€ÑÉ…­1…¹Õ…•Q¥Ñ±”è€‰8ƒ
Ü!Tƒ
ÜƒÅÕ¥Ù…±•¹èˆ°4(€€€ÑÉ…­1…¹Õ…•	½‘äè€‰…­Ñ½ÉÍÑÉÕ­ÑÕÈ°ƒq‰•ÉÍ•ÑéÕ¹ÍÅÕ…±¥Ó‘ĞÕ¹5•ÍÍ¥¹Ù…É¥…¹èéİ¥Í¡•¸‘•¸MÁÉ…¡•¸¸ˆ°4(€€€ÑÉ…­MÑÉÕÑÕÉ•Q¥Ñ±”è€‰%‘•¹Ñ¥Ó‘ÑÍÍÑÉÕ­ÑÕÈˆ°4(€€€ÑÉ…­MÑÉÕÑÕÉ•	½‘äè€‰]¥”Á½±¥Ñ¥Í¡”°]•ÉÑ”´°A•ÉÏÙ¹±¥¡­•¥ÑÌ´Õ¹é¥Ù¥±”¥µ•¹Í¥½¹•¸éÕÍ…µµ•¹£‘¹•¸°±ÕÍÑ•É¸Õ¹ÁÉ½‘Õ­Ñ¥Ù”MÁ…¹¹Õ¹•¸‰¥±‘•¸¸ˆ°4(€€€ÑÉ…­•µ½É…Á¡¥Q¥Ñ±”è€‰±Ñ•È€˜É½‰”I•¥½¸ˆ°4(€€€ÑÉ…­•µ½É…Á¡¥	½‘äè€‰áÁ±½É…Ñ¥Ù”Y•É±•¥¡”¹… ±Ñ•ÉÍÉÕÁÁ”°1…¹°M¥•‘±Õ¹ÍÑåÀÕ¹•Í¡±•¡Ğ½¡¹”¹ÍÁÉÕ …Õ˜	•ÛÙ±­•ÉÕ¹Í¹½Éµ•¸¸ˆ°(€€€ÑÉ…­1½¹¥ÑÕ‘¥¹…±Q¥Ñ±”è€‰Y•Ë‘¹‘•ÉÕ¹œ¥´i•¥ÑÙ•É±…Õ˜ˆ°4(€€€ÑÉ…­1½¹¥ÑÕ‘¥¹…±	½‘äè€‰/ñ¹™Ñ¥”Q•ÍÓŠMI•Ñ•ÍĞ´Õ¹AÉ½™¥±Ù•Ë‘¹‘•ÉÕ¹Í…¹…±åÍ”Õ¹Ñ•È‘•µÍ•±‰•¸ÁÍ•Õ‘½¹åµ•¸Q•¥±¹…¡µ•Í¡³ñÍÍ•°¸ˆ°(€€€ÑÉ…­	¥…ÍQ¥Ñ±”è€‰Õ‘¥ĞÙ½¸]•ÉÑÕ¹œ€˜Y¥ÍÕ…±¥Í¥•ÉÕ¹œˆ°4(€€€ÑÉ…­	¥…Í	½‘äè€‰AËñ™•¸°½ˆ]•ÉÑÕ¹œ°-½¹™¥‘•¹èÕ¹Ñ±…Í…¹Í¥¡Ñ•¸éİ¥Í¡•¸MÁÉ…¡•¸½‘•ÈU¹Ñ•ÉÉÕÁÁ•¸Õ¹Ñ•ÉÍ¡¥•‘±¥ ™Õ¹­Ñ¥½¹¥•É•¸¸ˆ°4(€€€‘…Ñ…1…å•ÉÍQ¥Ñ±”è€‰É•¤ÑÉ•¹¹‰…É”…Ñ•¹•‰•¹•¸ˆ°4(€€€Ñ¥•É=¹•Q¥Ñ±”è€‰HÄƒ
Ü‰•±•¥Ñ•Ñ•ÌAÉ½™¥°ˆ°4(€€€Ñ¥•É=¹•	½‘äè€‰‰•±•¥Ñ•Ñ”]•ÉÑ”°-½¹™¥‘•¹èÕ¹‘¥”¹•Õ•ÍÑ”É…•‰½•¸µiÕÍ…µµ•¹™…ÍÍÕ¹œ°•ÍÁ•¥¡•ÉĞ¹… …ÕÍ‘Ëñ­±¥¡•È¥¹İ¥±±¥Õ¹œ¸ˆ°(€€€Ñ¥•ÉQİ½Q¥Ñ±”è€‰HÈƒ
ÜI½¡…¹Ñİ½ÉÑ•¸ˆ°4(€€€Ñ¥•ÉQİ½	½‘äè€‰•È…­ÑÕ•±±”M•ÉÙ•É…‰±…Õ˜ÍÁ•¥¡•ÉĞ­•¥¹”I½¡…¹Ñİ½ÉÑ•¸…Õ˜%Ñ•µ•‰•¹”¸ˆ°(€€€Ñ¥•ÉQ¡É••Q¥Ñ±”è€‰HÌƒ
ÜAÍ•Õ‘½¹åµ”Y•É­»ñÁ™Õ¹œˆ°(€€€Ñ¥•ÉQ¡É••	½‘äè€‰¥¸éÕ›‘±±¥•È•Ë‘Ñ•Í¡³ñÍÍ•°Ù•É­»ñÁ™ĞÍÃ‘Ñ•É”	•¥ÑË‘”¸•ÍÁ•¥¡•ÉĞİ¥É¹ÕÈÍ•¥¸M!´ÈÔØµ!…Í ì­•¥¸9…µ”°­•¥¹”µ5…¥°Õ¹­•¥¸¥µÁ½ÉÑ¥•ÉÑ•ÌAÉ½™¥°¸ˆ°(€€€Í…™•Õ…É‘Q¥Ñ±”è€‰…Ñ•¹Í¡ÕÑéÉ•¹é”ˆ°(€€€Í…™•Õ…É‘	½‘äè€‰¥¹é•±É•½É‘Ì‰±•¥‰•¸ÁÉ¥Ù…Ğ¸ÉÕÁÁ•¹µ¥ÑÑ•±İ•ÉÑ”•ÉÍ¡•¥¹•¸•ÉÍĞ…ˆ€ÄÀ…‰•Í¡±½ÍÍ•¹•¸Q•¥±¹…¡µ•¸ì‘•È	É½İÍ•ÉÍ¡³ñÍÍ•°•É·Ù±¥¡ĞáÁ½ÉĞ½‘•È3ÙÍ¡Õ¹œ¸ˆ°(€€€µ…¹…•I•Í•…É¡¡½¥”è€‰5•¥¹”]…¡°Ù•Éİ…±Ñ•¸ˆ°(€€€ÁÍ•Õ‘½¹åµ½ÕÍMÑ½É…”è€‰AÍ•Õ‘½¹åµ”ÁÉ¥Ù…Ñ”…Ñ•¹‰…¹¬ˆ°(€€€ÍÑ½É…•MÑ…ÑÕÍI•Í•…É è€‰1½­…°€¬•¥¹•İ¥±±¥Ñ”½ÉÍ¡Õ¹œˆ°(€€€É•Í•…É¡MÑ½É…•Ñ¥Ù”è€‰¥”•¥¹•İ¥±±¥Ñ”½ÉÍ¡Õ¹ÍÍÁ•¥¡•ÉÕ¹œ¥ÍĞ…­Ñ¥Øˆ°(€€€É•Í•…É¡MÑ½É…•	½‘äè€‰¹Ñİ½ÉÑ•¸‰±•¥‰•¸±½­…°ì…ÕÍ•ß‘¡±Ñ”•µ½É…™¥”Õ¹…‰•±•¥Ñ•Ñ”Ñ±…Íİ•ÉÑ”İ•É‘•¸¹ÕÈµ¥Ğ…ÕÍ‘Ëñ­±¥¡•È¥¹İ¥±±¥Õ¹œÕ¹Ñ•È•¥¹•´•¡…Í¡Ñ•¸iÕ™…±±ÍÍ¡³ñÍÍ•°•ÍÁ•¥¡•ÉĞ¸ˆ°(€€€ÁÉ¥Ù…Ñ•MÑ½É…•Ñ¥Ù”è€‰AÉ¥Ù…Ñ”	É½İÍ•ÉÍÁ•¥¡•ÉÕ¹œ¥ÍĞ…­Ñ¥Øˆ°(€€€ÁÉ¥Ù…Ñ•MÑ½É…•	½‘äè€‰¹Ñİ½ÉÑ•¸°¹ÑßñÉ™”Õ¹É•‰¹¥ÍÍ”‰±•¥‰•¸¥¸‘¥•Í•´	É½İÍ•ÈÕ¹İ•É‘•¸¹¥¡Ğ›ñÈ½ÉÍ¡Õ¹œ•¹ÕÑéĞ¸ˆ°(€€€•¹‘•Èè€‰•Í¡±•¡Ğˆ°(€€€•¹‘•É]½µ…¸è€‰É…Ôˆ°(€€€•¹‘•É5…¸è€‰5…¹¸ˆ°(€€€•¹‘•É9½¹	¥¹…Éäè€‰9¥¡Ğµ‰¥»‘Èˆ°(€€€•¹‘•ÉM•±™•ÍÉ¥‰•è€‰¹‘•É”M•±‰ÍÑ‰•Í¡É•¥‰Õ¹œˆ°(€€€Í•ÑÑ±•µ•¹ÑQåÁ”è€‰M¥•‘±Õ¹ÍÑåÀˆ°(€€€Í•ÑÑ±•µ•¹Ñ…Á¥Ñ…°è€‰!…ÕÁÑÍÑ…‘Ğ€¼5•ÑÉ½Á½±É•¥½¸ˆ°(€€€Í•ÑÑ±•µ•¹Ñ1…É•¥Ñäè€‰É¿}ÍÑ…‘Ğ€ ÄÀÀ¸ÀÀÀ¬¥¹İ½¡¹•È¤ˆ°(€€€Í•ÑÑ±•µ•¹Ñ¥Ñäè€‰MÑ…‘Ğˆ°(€€€Í•ÑÑ±•µ•¹ÑQ½İ¹Y¥±±…”è€‰-±•¥¹ÍÑ…‘Ğ½‘•È½É˜ˆ°(€€€Í•ÑÑ±•µ•¹ÑIÕÉ…°è€‰3‘¹‘±¥¡•ÈI…Õ´ˆ°(€€€•á…Ñ•I•Í•…É è€‰±Ñ•Èˆ°(€€€ÍÁ•¥…±…Ñ•½Éå½¹Í•¹Ğè€‰% İ¥±±¥”…ÕÍ‘Ëñ­±¥ ¥¸‘¥”Y•É…É‰•¥ÑÕ¹œµ•¥¹•Èé¥Ù¥±•¸Õ¹Á½±¥Ñ¥Í¡•¸¹Í¥¡Ñ•¸éÔ½ÉÍ¡Õ¹Íéİ•­•¸•¥¸¸ˆ°(€€€ÍÁ•¥…±…Ñ•½Éå½¹Í•¹Ñ	½‘äè€‰¥•Ì¥ÍĞ™É•¥İ¥±±¥œ°›ñÈ‘¥”ÁÉ¥Ù…Ñ”9ÕÑéÕ¹œ¹¥¡Ğ•É™½É‘•É±¥ Õ¹­…¹¸¥¸‘•¸¥¹ÍÑ•±±Õ¹•¸µ¥Ğ‘•´±½­…°•ÍÁ•¥¡•ÉÑ•¸Q•¥±¹…¡µ•Í¡³ñÍÍ•°İ¥‘•ÉÉÕ™•¸İ•É‘•¸¸ˆ°(€€€É•Í•…É¡M…Ù•ÉÉ½Èè€‰¥”¥¹İ¥±±¥Õ¹œ­½¹¹Ñ”¹¥¡Ğ•ÍÁ•¥¡•ÉĞİ•É‘•¸¸ÌİÕÉ‘”¹¥¡ÑÌƒñ‰•Éµ¥ÑÑ•±Ğì•É¹•ÕĞÙ•ÉÍÕ¡•¸½‘•ÈÁÉ¥Ù…Ğ™½ÉÑ™…¡É•¸¸ˆ°(€€€Í…Ù¥¹œè€‰MÁ•¥¡•É»Š˜ˆ°(€€€½¡½ÉÑå•‰É½Üè€‰%9]%11%QIUAA99M%!Pˆ°(€€€½¡½ÉÑQ¥Ñ±”è€‰]¥”‰É•¥Ñ”ÉÕÁÁ•¸éÔ‘•¥¹•´Ñ±…ÌÍÑ•¡•¸ˆ°(€€€½¡½ÉÑ%¹ÑÉ¼è€‰Y•É±•¥¡”ÉÕÁÁ•¹µ¥ÑÑ•±İ•ÉÑ”¹… ±Ñ•ÉÍÉÕÁÁ”°1…¹°M¥•‘±Õ¹ÍÑåÀ½‘•È•Í¡±•¡Ğ¸ÌÍ¥¹•áÁ±½É…Ñ¥Ù”Q•¥±¹•¡µ•Éµ¥ÑÑ•±İ•ÉÑ”°­•¥¹”	•ÛÙ±­•ÉÕ¹Í¹½Éµ•¸¸ˆ°(€€€½¡½ÉÑ½¹Í•¹ÑI•ÅÕ¥É•è€‰ñÈÉÕÁÁ•¹­…ÉÑ•¸¥ÍĞ½ÉÍ¡Õ¹Í•¥¹İ¥±±¥Õ¹œ•É™½É‘•É±¥ ˆ°(€€€½¡½ÉÑ½¹Í•¹Ñ	½‘äè€‰¥”-…ÉÑ”¥ÍĞ›ñÈQ•¥±¹•¡µ•¹‘”Í¥¡Ñ‰…È°‘¥”éÕ´Í•±‰•¸•Í£ñÑéÑ•¸°…É•¥•ÉÑ•¸…Ñ•¹Í…Ñè‰•¥ÑÉ…•¸¸ˆ°(€€€½µÁ…É•	äè€‰Y•É±•¥¡•¸¹… ˆ°(€€€½¡½ÉÑ”è€‰±Ñ•ÉÍÉÕÁÁ”ˆ°(€€€½¡½ÉÑ½Õ¹ÑÉäè€‰1…¹ˆ°(€€€½¡½ÉÑM•ÑÑ±•µ•¹Ğè€‰M¥•‘±Õ¹œˆ°(€€€½¡½ÉÑ•¹‘•Èè€‰•Í¡±•¡Ğˆ°(€€€±½…‘¥¹œè€‰1…‘•»Š˜ˆ°(€€€½¡½ÉÑ1½…‘ÉÉ½Èè€‰ÉÕÁÁ•¹µ¥ÑÑ•±İ•ÉÑ”Í¥¹Ù½Ëñ‰•É•¡•¹¹¥¡ĞÙ•É›ñ‰…È¸ˆ°(€€€½¡½ÉÑ9½ÑI•…‘äè€‰9½ ­•¥¹”‘…Ñ•¹Í¡ÕÑéÍ¥¡•É”ÉÕÁÁ”Ù•É›ñ‰…Èˆ°(€€€½¡½ÉÑQ¡É•Í¡½±è€‰¥¹”ÉÕÁÁ”•ÉÍ¡•¥¹Ğ•ÉÍĞ…ˆµ¥¹‘•ÍÑ•¹Ìí½Õ¹Ñô…‰•Í¡±½ÍÍ•¹•¸Q•¥±¹…¡µ•¸¸ˆ°(€€€Á…ÉÑ¥¥Á…¹ÑÌè€‰Q•¥±¹•¡µ•¹‘”ˆ°(€€€½¡½ÉÑÙ•É…”è€‰ÉÕÁÁ•¹µ¥ÑÑ•°ˆ°(€€€å½ÕÉAÉ½™¥±•5…É­•Èè€‰5…É­•È‘•¥¹•ÌAÉ½™¥±Ìˆ°(€€€É•Í•…É¡Q½­•¹5¥ÍÍ¥¹œè€‰•È±½­…±”Q•¥±¹…¡µ•Í¡³ñÍÍ•°™•¡±Ğì‘•ÈM•ÉÙ•ÉÉ•½É¥ÍĞÙ½¸‘¥•Í•´	É½İÍ•È¹¥¡Ğ•ÉÉ•¥¡‰…È¸ˆ°(€€€É•Í•…É¡áÁ½ÉÑI•…‘äè€‰•¥¸•¥¹•İ¥±±¥Ñ•È½ÉÍ¡Õ¹ÍÉ•½ÉİÕÉ‘”¡•ÉÕ¹Ñ•É•±…‘•¸¸ˆ°(€€€É•Í•…É¡…Ñ…Ñ¥½¹ÉÉ½Èè€‰¥”½ÉÍ¡Õ¹Í‘…Ñ•¸µ­Ñ¥½¸¥ÍĞ™•¡±•Í¡±…•¸¸•È±½­…±”M¡³ñÍÍ•°‰±•¥‰Ğ›ñÈ•¥¹•¸¹•Õ•¸Y•ÉÍÕ •É¡…±Ñ•¸¸ˆ°(€€€É•Í•…É¡•±•Ñ•½¹™¥É´è€‰•¸•¥¹•İ¥±±¥Ñ•¸M•ÉÙ•ÉÉ•½É•¹‘Ÿñ±Ñ¥œ³ÙÍ¡•¸Õ¹¥¸‘•¸ÁÉ¥Ù…Ñ•¸5½‘ÕÌİ•¡Í•±¸üˆ°(€€€É•Í•…É¡•±•Ñ•è€‰•È•¥¹•İ¥±±¥Ñ”M•ÉÙ•ÉÉ•½ÉİÕÉ‘”•³ÙÍ¡Ğì‘•ÈÁÉ¥Ù…Ñ”	É½İÍ•Éµ½‘ÕÌ‰±•¥‰Ğ…­Ñ¥Ø¸ˆ°(€€€‘½İ¹±½…‘I•Í•…É¡…Ñ„è€‰M•ÉÙ•ÉÉ•½É¡•ÉÕ¹Ñ•É±…‘•¸ˆ°(€€€‘•±•Ñ•I•Í•…É¡…Ñ„è€‰]¥‘•ÉÉÕ™•¸€˜M•ÉÙ•ÉÉ•½É³ÙÍ¡•¸ˆ°(€€€É•Ù¥•İI•Í•…É¡½¹Í•¹Ğè€‰½ÉÍ¡Õ¹Í•¥¹İ¥±±¥Õ¹œÁËñ™•¸ˆ°(€€€É•Í•…É¡AÉ½™¥±•M…Ù•è€‰…Ì…‰•±•¥Ñ•Ñ”Ñ±…ÍÁÉ½™¥°İÕÉ‘”¥´•¥¹•İ¥±±¥Ñ•¸½ÉÍ¡Õ¹ÍÉ•½É•ÍÁ•¥¡•ÉĞ¸ˆ°(€€€É•Í•…É¡AÉ½™¥±•M…Ù•ÉÉ½Èè€‰…Ì±½­…±”É•‰¹¥Ì¥ÍĞÍ¥¡•È°…‰•È‘¥”½ÉÍ¡Õ¹Í­½Á¥”­½¹¹Ñ”¹¥¡Ğ•ÍÁ•¥¡•ÉĞİ•É‘•¸¸ˆ°(€ô°4)ôì4(4)•áÁ½ÉĞ™Õ¹Ñ¥½¸Ğ¡±…¹œ°­•ä¤ì4(€É•ÑÕÉ¸½Áåm±…¹tü¹m­•åt€üü½Áä¹•¹m­•åt€üü­•äì4)ô4(4)•áÁ½ÉĞ™Õ¹Ñ¥½¸±½…±¥é”¡Ù…±Õ”°±…¹œ¤ì4(€¥˜€¡ÑåÁ•½˜Ù…±Õ”€ôôô€‰ÍÑÉ¥¹œˆ¤É•ÑÕÉ¸Ù…±Õ”ì4(€É•ÑÕÉ¸Ù…±Õ”ü¹m±…¹t€üüÙ…±Õ”ü¹•¸€üü€ˆˆì4)ô4(