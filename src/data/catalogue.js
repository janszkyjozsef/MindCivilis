import { L } from "./dimensions.js";

const item = (id, dimensionId, direction, en, hu, de, source = "mindcivilis-original") => ({
  id,
  dimensionId,
  direction,
  text: L(en, hu, de),
  source,
});

const p = (id, dim, direction, en, hu, de) => item(`pol-${id}`, dim, direction, en, hu, de, id <= 20 ? "mindcivilis-canonical-20" : "mindcivilis-curated-draft");

const politicalBanks = {
  culturalPluralism: [
    p(1, "culturalPluralism", -1, "The state should support the traditional family model.", "Az államnak támogatnia kellene a hagyományos családmodellt.", "Der Staat sollte das traditionelle Familienmodell unterstützen."),
    p(2, "culturalPluralism", 1, "Schools should teach gender equality.", "Az iskolákban oktatni kellene a nemek közötti egyenlőséget.", "Schulen sollten die Gleichstellung der Geschlechter vermitteln."),
    p(3, "culturalPluralism", -1, "The state should actively shape education to deepen understanding of national history and culture.", "Az államnak aktívan be kellene avatkoznia az oktatás tartalmába, hogy előmozdítsa a nemzeti történelem és kultúra mélyebb megértését.", "Der Staat sollte Bildungsinhalte aktiv gestalten, um das Verständnis nationaler Geschichte und Kultur zu vertiefen."),
    p(4, "culturalPluralism", -1, "The government should actively regulate media content to protect the common good.", "A kormánynak aktív szerepet kellene vállalnia a média tartalmának szabályozásában, hogy megvédje a közjót.", "Die Regierung sollte Medieninhalte aktiv regulieren, um das Gemeinwohl zu schützen."),
    p(5, "culturalPluralism", 1, "The state should support multicultural programmes that help ethnic and cultural minorities participate fully.", "Az államnak támogatnia kellene a multikulturális programokat az etnikai és kulturális kisebbségek integrációjának előmozdítása érdekében.", "Der Staat sollte multikulturelle Programme fördern, die ethnischen und kulturellen Minderheiten volle Teilhabe ermöglichen."),
    p(21, "culturalPluralism", 1, "Public institutions should adapt when inherited customs exclude part of society.", "A közintézményeknek alkalmazkodniuk kellene, ha az örökölt szokások a társadalom egy részét kizárják.", "Öffentliche Institutionen sollten sich anpassen, wenn überlieferte Bräuche Teile der Gesellschaft ausschließen."),
    p(22, "culturalPluralism", -1, "A shared national culture matters more than accommodating distinct cultural practices.", "A közös nemzeti kultúra fontosabb, mint az eltérő kulturális gyakorlatokhoz való alkalmazkodás.", "Eine gemeinsame Nationalkultur ist wichtiger als die Berücksichtigung unterschiedlicher kultureller Praktiken."),
    p(23, "culturalPluralism", 1, "Minority viewpoints deserve public recognition even when most citizens disagree with them.", "A kisebbségi nézőpontok akkor is megérdemlik a nyilvános elismerést, ha a többség nem ért velük egyet.", "Minderheitenpositionen verdienen öffentliche Anerkennung, auch wenn die Mehrheit ihnen widerspricht."),
    p(24, "culturalPluralism", -1, "Rapid cultural change can weaken the bonds a society needs.", "A gyors kulturális változás meggyengítheti a társadalom számára szükséges kötelékeket.", "Schneller kultureller Wandel kann die Bindungen schwächen, die eine Gesellschaft braucht."),
    p(25, "culturalPluralism", 1, "People should be free to form families and communities beyond traditional models.", "Az embereknek szabadon kellene családot és közösséget alakítaniuk a hagyományos modelleken túl is.", "Menschen sollten Familien und Gemeinschaften auch jenseits traditioneller Modelle frei gestalten können."),
  ],
  socialEconomy: [
    p(6, "socialEconomy", 1, "The state should guarantee a basic income to every citizen.", "Az államnak biztosítania kellene az alapvető jövedelmet minden állampolgár számára.", "Der Staat sollte allen Bürgerinnen und Bürgern ein Grundeinkommen garantieren."),
    p(7, "socialEconomy", 1, "Taxes should be more progressive to reduce the income gap between rich and poor.", "Az adókat progresszívebbé kellene tenni, hogy csökkentsék a gazdag és szegény közötti jövedelmi különbségeket.", "Steuern sollten progressiver sein, um Einkommensunterschiede zwischen Arm und Reich zu verringern."),
    p(8, "socialEconomy", -1, "Without government intervention, markets can handle economic crises on their own.", "A kormányzati beavatkozás nélkül a piac önmagában képes kezelni a gazdasági válságokat.", "Märkte können Wirtschaftskrisen ohne staatliches Eingreifen aus eigener Kraft bewältigen."),
    p(9, "socialEconomy", 1, "Government should intervene in healthcare markets to make essential care accessible to everyone.", "A kormánynak be kellene avatkoznia az egészségügyi szolgáltatások piacán annak érdekében, hogy mindenki számára elérhetővé tegye az alapvető egészségügyi ellátást.", "Der Staat sollte in den Gesundheitsmarkt eingreifen, damit eine grundlegende Versorgung für alle zugänglich ist."),
    p(10, "socialEconomy", -1, "The state should not limit how much companies may pay their executives.", "Az államnak nem kellene korlátoznia, hogy mennyit fizethetnek a cégek a vezetőiknek.", "Der Staat sollte nicht begrenzen, wie viel Unternehmen ihren Führungskräften zahlen dürfen."),
    p(26, "socialEconomy", 1, "Essential public services should remain accessible even when they are not profitable.", "Az alapvető közszolgáltatásoknak akkor is elérhetőnek kell maradniuk, ha nem nyereségesek.", "Grundlegende öffentliche Dienste sollten auch dann zugänglich bleiben, wenn sie nicht profitabel sind."),
    p(27, "socialEconomy", -1, "People should bear most economic risks created by their own choices.", "Az embereknek nagyrészt maguknak kellene viselniük a saját döntéseikből eredő gazdasági kockázatokat.", "Menschen sollten wirtschaftliche Risiken aus eigenen Entscheidungen überwiegend selbst tragen."),
    p(28, "socialEconomy", 1, "Workers should have a stronger voice in major company decisions.", "A munkavállalóknak erősebb beleszólást kellene kapniuk a vállalatok fontos döntéseibe.", "Beschäftigte sollten bei wichtigen Unternehmensentscheidungen stärker mitbestimmen."),
    p(29, "socialEconomy", -1, "Lower taxes usually create more social benefit than expanding public programmes.", "Az alacsonyabb adók általában több társadalmi hasznot teremtenek, mint a közprogramok bővítése.", "Niedrigere Steuern schaffen meist mehr gesellschaftlichen Nutzen als der Ausbau öffentlicher Programme."),
    p(30, "socialEconomy", 1, "Public policy should prevent extreme concentrations of wealth and economic power.", "A közpolitikának meg kellene akadályoznia a vagyon és gazdasági hatalom szélsőséges koncentrációját.", "Öffentliche Politik sollte extreme Konzentrationen von Vermögen und Wirtschaftsmacht verhindern."),
  ],
  democraticChecks: [
    p(11, "democraticChecks", -1, "Government may restrict press freedom when it invokes national security.", "A kormánynak joga van korlátozni a sajtószabadságot nemzetbiztonsági érdekekre hivatkozva.", "Die Regierung darf die Pressefreiheit unter Berufung auf die nationale Sicherheit einschränken."),
    p(12, "democraticChecks", -1, "A strong leader is more important than democratic institutions.", "Az erős vezető fontosabb, mint a demokratikus intézmények.", "Eine starke Führung ist wichtiger als demokratische Institutionen."),
    p(13, "democraticChecks", -1, "Government may ignore court decisions when they conflict with the national interest.", "A kormánynak joga van figyelmen kívül hagyni a bírósági döntéseket, ha azok ellentétesek a nemzet érdekeivel.", "Die Regierung darf Gerichtsurteile ignorieren, wenn sie dem nationalen Interesse widersprechen."),
    p(14, "democraticChecks", 1, "Government should cooperate with the political opposition to build long-term unity and stability.", "A kormánynak törekednie kell arra, hogy a politikai ellenzékkel együttműködve alakítson ki hosszú távú nemzeti egységet és stabilitást.", "Die Regierung sollte mit der politischen Opposition zusammenarbeiten, um langfristige Einheit und Stabilität zu schaffen."),
    p(15, "democraticChecks", 1, "Regularly seeking citizens' views is more important than fast and efficient decisions.", "A polgárok véleményének rendszeres kikérése fontosabb, mint a gyors és hatékony döntéshozatal.", "Die regelmäßige Einbeziehung der Bürgermeinung ist wichtiger als schnelle und effiziente Entscheidungen."),
    p(31, "democraticChecks", 1, "Independent courts should be able to stop policies supported by a parliamentary majority.", "A független bíróságoknak meg kell tudniuk állítani a parlamenti többség által támogatott intézkedéseket.", "Unabhängige Gerichte sollten Maßnahmen einer Parlamentsmehrheit stoppen können."),
    p(32, "democraticChecks", -1, "During a serious crisis, executive leaders need broad freedom from parliamentary oversight.", "Súlyos válság idején a végrehajtó vezetésnek széles szabadságra van szüksége a parlamenti ellenőrzéstől.", "In einer schweren Krise braucht die Exekutive weitgehende Freiheit von parlamentarischer Kontrolle."),
    p(33, "democraticChecks", 1, "Public authorities should explain the evidence behind major decisions.", "A közhatalomnak ismertetnie kellene a fontos döntések mögötti bizonyítékokat.", "Öffentliche Stellen sollten die Belege hinter wichtigen Entscheidungen offenlegen."),
    p(34, "democraticChecks", 1, "Peaceful protest is a necessary democratic safeguard even when it is disruptive.", "A békés tiltakozás akkor is szükséges demokratikus biztosíték, ha zavaró.", "Friedlicher Protest ist auch dann ein notwendiger demokratischer Schutz, wenn er stört."),
    p(35, "democraticChecks", -1, "Winning an election gives a government a mandate to remove obstacles to its programme.", "A választási győzelem felhatalmazza a kormányt, hogy eltávolítsa programja akadályait.", "Ein Wahlsieg gibt einer Regierung das Mandat, Hindernisse für ihr Programm zu beseitigen."),
  ],
  reformOrientation: [
    p(16, "reformOrientation", -1, "Social change usually causes more harm than benefit.", "A társadalmi változások általában több kárt okoznak, mint hasznot.", "Gesellschaftlicher Wandel verursacht meist mehr Schaden als Nutzen."),
    p(17, "reformOrientation", -1, "Preserving traditional values and institutions is more important than introducing innovations.", "A hagyományos értékek és intézmények megőrzése fontosabb, mint az újítások bevezetése.", "Die Bewahrung traditioneller Werte und Institutionen ist wichtiger als die Einführung von Neuerungen."),
    p(18, "reformOrientation", 1, "Radical reforms are needed to solve society's problems.", "Radikális reformok szükségesek a társadalom problémáinak megoldásához.", "Radikale Reformen sind nötig, um gesellschaftliche Probleme zu lösen."),
    p(19, "reformOrientation", -1, "Gradual change is better than rapid, comprehensive reform.", "A fokozatos változások jobbak, mint a gyors, átfogó reformok.", "Schrittweiser Wandel ist besser als schnelle, umfassende Reformen."),
    p(20, "reformOrientation", -1, "Political leaders should focus on long-term stability rather than short-term change.", "A politikai vezetőknek inkább a hosszú távú stabilitásra kellene összpontosítaniuk, mint a rövid távú változásokra.", "Politische Führung sollte sich eher auf langfristige Stabilität als auf kurzfristigen Wandel konzentrieren."),
    p(36, "reformOrientation", 1, "Institutions that repeatedly fail should be redesigned rather than merely repaired.", "Az ismételten kudarcot valló intézményeket inkább újra kellene tervezni, mint pusztán javítgatni.", "Wiederholt versagende Institutionen sollten neu gestaltet und nicht nur repariert werden."),
    p(37, "reformOrientation", -1, "Reforms should wait until their unintended effects are well understood.", "A reformokkal várni kellene, amíg nem értjük jól a nem szándékolt következményeiket.", "Reformen sollten warten, bis ihre unbeabsichtigten Folgen gut verstanden sind."),
    p(38, "reformOrientation", 1, "A period of disruption can be acceptable when it removes a deep injustice.", "Egy átmeneti zavar elfogadható lehet, ha mély igazságtalanságot szüntet meg.", "Eine Phase der Störung kann vertretbar sein, wenn sie tiefes Unrecht beseitigt."),
    p(39, "reformOrientation", -1, "Stable rules are often more valuable than policies that quickly follow public opinion.", "A stabil szabályok gyakran értékesebbek, mint a közvéleményt gyorsan követő intézkedések.", "Stabile Regeln sind oft wertvoller als Maßnahmen, die der öffentlichen Meinung schnell folgen."),
    p(40, "reformOrientation", 1, "Younger generations should be free to reshape institutions they inherited.", "A fiatalabb nemzedékeknek szabadon kellene átalakítaniuk az örökölt intézményeket.", "Jüngere Generationen sollten überlieferte Institutionen frei umgestalten können."),
  ],
  globalCooperation: [
    p(41, "globalCooperation", 1, "Countries should accept binding international rules for problems that cross borders.", "Az országoknak kötelező nemzetközi szabályokat kellene elfogadniuk a határokon átnyúló problémákra.", "Staaten sollten für grenzüberschreitende Probleme verbindliche internationale Regeln akzeptieren."),
    p(42, "globalCooperation", -1, "National democratic control should outweigh international commitments.", "A nemzeti demokratikus ellenőrzésnek elsőbbséget kellene élveznie a nemzetközi kötelezettségekkel szemben.", "Nationale demokratische Kontrolle sollte internationale Verpflichtungen überwiegen."),
    p(43, "globalCooperation", 1, "Shared European institutions can protect citizens where individual states cannot.", "A közös európai intézmények ott is megvédhetik a polgárokat, ahol az egyes államok nem tudják.", "Gemeinsame europäische Institutionen können Bürger dort schützen, wo einzelne Staaten es nicht können."),
    p(44, "globalCooperation", -1, "A country should retain the right to disregard international decisions that harm its interests.", "Egy országnak joga kellene legyen figyelmen kívül hagyni az érdekeit sértő nemzetközi döntéseket.", "Ein Staat sollte internationale Entscheidungen missachten dürfen, wenn sie seinen Interessen schaden."),
    p(45, "globalCooperation", 1, "Climate, migration and security require durable cross-border institutions.", "Az éghajlat, a migráció és a biztonság tartós, határokon átívelő intézményeket igényel.", "Klima, Migration und Sicherheit erfordern dauerhafte grenzüberschreitende Institutionen."),
    p(46, "globalCooperation", -1, "International organisations are too distant to make legitimate domestic choices.", "A nemzetközi szervezetek túl távoliak ahhoz, hogy legitim belföldi döntéseket hozzanak.", "Internationale Organisationen sind zu weit entfernt, um legitime innerstaatliche Entscheidungen zu treffen."),
    p(47, "globalCooperation", 1, "Wealthier countries have obligations beyond their own citizens.", "A gazdagabb országoknak saját polgáraikon túlmutató kötelezettségeik is vannak.", "Wohlhabendere Länder haben Pflichten über die eigenen Bürger hinaus."),
    p(48, "globalCooperation", -1, "Economic resilience is worth limiting dependence on international supply chains.", "A gazdasági ellenálló képességért érdemes korlátozni a nemzetközi ellátási láncoktól való függést.", "Für wirtschaftliche Widerstandsfähigkeit lohnt es sich, die Abhängigkeit von internationalen Lieferketten zu begrenzen."),
    p(49, "globalCooperation", 1, "International courts are valuable checks when domestic safeguards fail.", "A nemzetközi bíróságok értékes biztosítékok, ha a belföldi kontrollok kudarcot vallanak.", "Internationale Gerichte sind wertvolle Sicherungen, wenn innerstaatliche Kontrollen versagen."),
    p(50, "globalCooperation", -1, "Political solidarity should begin and largely end at national borders.", "A politikai szolidaritásnak a nemzeti határoknál kellene kezdődnie és nagyrészt véget érnie.", "Politische Solidarität sollte an nationalen Grenzen beginnen und weitgehend enden."),
  ],
  localism: [
    p(51, "localism", 1, "Local communities should control more of the taxes raised in their area.", "A helyi közösségeknek nagyobb ellenőrzést kellene kapniuk a területükön beszedett adók felett.", "Lokale Gemeinschaften sollten über einen größeren Teil der vor Ort erhobenen Steuern verfügen."),
    p(52, "localism", -1, "National standards are usually fairer than locally different rules.", "Az országos szabványok általában méltányosabbak, mint a helyenként eltérő szabályok.", "Nationale Standards sind meist fairer als lokal unterschiedliche Regeln."),
    p(53, "localism", 1, "Residents should have a direct say in major local development projects.", "A lakosoknak közvetlen beleszólást kellene kapniuk a nagy helyi fejlesztésekbe.", "Einwohner sollten bei großen lokalen Entwicklungsprojekten direkt mitentscheiden."),
    p(54, "localism", -1, "Central government can allocate scarce resources more consistently than municipalities.", "A központi kormány következetesebben oszthatja el a szűkös erőforrásokat, mint az önkormányzatok.", "Die Zentralregierung kann knappe Ressourcen einheitlicher verteilen als Kommunen."),
    p(55, "localism", 1, "Public services should be designed around local conditions even if provision differs by region.", "A közszolgáltatásokat a helyi körülményekhez kellene igazítani, még ha emiatt régiónként eltérnek is.", "Öffentliche Dienste sollten lokale Bedingungen berücksichtigen, auch wenn sie regional unterschiedlich ausfallen."),
    p(56, "localism", -1, "Major crises require uniform national decisions rather than local experimentation.", "A nagy válságok egységes országos döntéseket igényelnek a helyi kísérletezés helyett.", "Große Krisen erfordern einheitliche nationale Entscheidungen statt lokaler Experimente."),
    p(57, "localism", 1, "Small communities often understand their own social needs best.", "A kisebb közösségek gyakran maguk értik a legjobban saját társadalmi szükségleteiket.", "Kleine Gemeinschaften verstehen ihre sozialen Bedürfnisse oft am besten."),
    p(58, "localism", -1, "Too much local autonomy creates unacceptable differences in citizens' rights.", "A túl nagy helyi autonómia elfogadhatatlan különbségeket teremt az állampolgári jogokban.", "Zu viel lokale Autonomie schafft unvertretbare Unterschiede bei Bürgerrechten."),
    p(59, "localism", 1, "Policy innovation should be tested locally before nationwide adoption.", "A szakpolitikai újításokat helyben kellene kipróbálni az országos bevezetés előtt.", "Politische Neuerungen sollten lokal erprobt werden, bevor sie landesweit gelten."),
    p(60, "localism", -1, "Regional inequalities are best addressed through stronger central coordination.", "A regionális egyenlőtlenségeket erősebb központi koordinációval lehet a legjobban kezelni.", "Regionale Ungleichheiten lassen sich am besten durch stärkere zentrale Koordination angehen."),
  ],
  ecologicalPriority: [
    p(61, "ecologicalPriority", 1, "Economic policy should respect ecological limits even when growth slows.", "A gazdaságpolitikának akkor is tiszteletben kellene tartania az ökológiai korlátokat, ha lassul a növekedés.", "Wirtschaftspolitik sollte ökologische Grenzen auch dann achten, wenn das Wachstum langsamer wird."),
    p(62, "ecologicalPriority", -1, "Technological innovation will solve most environmental limits without major lifestyle changes.", "A technológiai innováció a legtöbb környezeti korlátot jelentős életmódváltás nélkül megoldja.", "Technologische Innovation wird die meisten Umweltgrenzen ohne große Lebensstiländerungen lösen."),
    p(63, "ecologicalPriority", 1, "Future generations should have a formal voice in today's major infrastructure decisions.", "A jövő nemzedékek érdekeinek formális képviseletet kellene kapniuk a mai nagy infrastrukturális döntésekben.", "Künftige Generationen sollten in heutigen großen Infrastrukturentscheidungen formell vertreten sein."),
    p(64, "ecologicalPriority", -1, "Environmental rules should be relaxed when they threaten many existing jobs.", "A környezetvédelmi szabályokat enyhíteni kellene, ha sok meglévő munkahelyet veszélyeztetnek.", "Umweltauflagen sollten gelockert werden, wenn sie viele bestehende Arbeitsplätze gefährden."),
    p(65, "ecologicalPriority", 1, "Public budgets should count long-term environmental damage as a real cost.", "A költségvetéseknek valós költségként kellene számolniuk a hosszú távú környezeti károkkal.", "Öffentliche Haushalte sollten langfristige Umweltschäden als reale Kosten erfassen."),
    p(66, "ecologicalPriority", -1, "Higher consumption remains a reasonable measure of social progress.", "A magasabb fogyasztás továbbra is a társadalmi haladás ésszerű mércéje.", "Höherer Konsum bleibt ein sinnvolles Maß für gesellschaftlichen Fortschritt."),
    p(67, "ecologicalPriority", 1, "High-emission activities should bear more of their social and environmental cost.", "A nagy kibocsátású tevékenységeknek nagyobb részt kellene viselniük társadalmi és környezeti költségeikből.", "Emissionsintensive Tätigkeiten sollten einen größeren Teil ihrer sozialen und ökologischen Kosten tragen."),
    p(68, "ecologicalPriority", -1, "Countries should prioritise competitiveness when environmental standards differ globally.", "Az országoknak a versenyképességet kellene előtérbe helyezniük, ha a környezetvédelmi szabályok világszerte eltérnek.", "Staaten sollten Wettbewerbsfähigkeit priorisieren, wenn Umweltstandards weltweit unterschiedlich sind."),
    p(69, "ecologicalPriority", 1, "Protecting biodiversity can justify limits on private land use.", "A biológiai sokféleség védelme indokolhatja a magánterületek használatának korlátozását.", "Der Schutz der Artenvielfalt kann Beschränkungen privater Landnutzung rechtfertigen."),
    p(70, "ecologicalPriority", -1, "Environmental transition should never move faster than current markets can absorb.", "A környezeti átállás soha nem haladhatna gyorsabban, mint amit a jelenlegi piacok elbírnak.", "Der ökologische Übergang sollte nie schneller erfolgen, als bestehende Märkte verkraften können."),
  ],
  civilLiberty: [
    p(71, "civilLiberty", 1, "Surveillance powers should expire automatically unless lawmakers renew them publicly.", "A megfigyelési jogköröknek automatikusan meg kellene szűnniük, hacsak a törvényhozás nyilvánosan meg nem újítja őket.", "Überwachungsbefugnisse sollten automatisch auslaufen, sofern sie nicht öffentlich verlängert werden."),
    p(72, "civilLiberty", -1, "People with nothing to hide have little reason to fear state data collection.", "Akinek nincs rejtegetnivalója, annak kevés oka van félni az állami adatgyűjtéstől.", "Wer nichts zu verbergen hat, braucht staatliche Datenerhebung kaum zu fürchten."),
    p(73, "civilLiberty", 1, "Security agencies should need independent approval before accessing private communications.", "A biztonsági szerveknek független engedélyre lenne szükségük a magánkommunikációhoz való hozzáférés előtt.", "Sicherheitsbehörden sollten vor dem Zugriff auf private Kommunikation eine unabhängige Genehmigung benötigen."),
    p(74, "civilLiberty", -1, "Temporary limits on public assembly are acceptable whenever authorities identify a serious risk.", "A gyülekezés ideiglenes korlátozása elfogadható, ha a hatóságok súlyos kockázatot azonosítanak.", "Vorübergehende Einschränkungen öffentlicher Versammlungen sind vertretbar, sobald Behörden ein ernstes Risiko feststellen."),
    p(75, "civilLiberty", 1, "Emergency measures should remain open to court challenge.", "A rendkívüli intézkedéseket bíróság előtt továbbra is meg lehessen támadni.", "Notstandsmaßnahmen sollten weiterhin gerichtlich anfechtbar sein."),
    p(76, "civilLiberty", -1, "Preventing a rare catastrophic threat can justify broad monitoring of the public.", "Egy ritka, katasztrofális fenyegetés megelőzése indokolhatja a lakosság széles körű megfigyelését.", "Die Verhinderung einer seltenen Katastrophengefahr kann breite Überwachung der Bevölkerung rechtfertigen."),
    p(77, "civilLiberty", 1, "People should be told when automated systems influence decisions about their rights.", "Az embereket tájékoztatni kellene, ha automatizált rendszerek befolyásolják a jogaikról szóló döntéseket.", "Menschen sollten erfahren, wenn automatisierte Systeme Entscheidungen über ihre Rechte beeinflussen."),
    p(78, "civilLiberty", -1, "Anonymous online speech creates more public danger than democratic value.", "A névtelen online véleménynyilvánítás több közveszélyt teremt, mint demokratikus értéket.", "Anonyme Onlineäußerungen schaffen mehr öffentliche Gefahr als demokratischen Wert."),
    p(79, "civilLiberty", 1, "Security policy should use the least intrusive effective measure.", "A biztonságpolitikának a legkevésbé beavatkozó hatékony eszközt kellene alkalmaznia.", "Sicherheitspolitik sollte die am wenigsten eingreifende wirksame Maßnahme nutzen."),
    p(80, "civilLiberty", -1, "Broad preventive powers are preferable to waiting until harm occurs.", "A széles megelőző jogkörök jobbak, mint megvárni, amíg kár történik.", "Weitreichende Präventionsbefugnisse sind besser, als auf einen Schaden zu warten."),
  ],
};

const politicalOrder = ["culturalPluralism", "socialEconomy", "democraticChecks", "reformOrientation", "globalCooperation", "localism", "ecologicalPriority", "civilLiberty"];
const politicalQuick = politicalOrder.slice(0, 4).flatMap((id) => politicalBanks[id].slice(0, 5));
const politicalStandard = politicalOrder.slice(0, 4).flatMap((id) => politicalBanks[id]);
const politicalDeep = politicalOrder.flatMap((id) => politicalBanks[id]);

const personalityBanks = {
  openness: [
    [1, "I have a vivid imagination.", "Élénk a képzeletem.", "Ich habe eine lebhafte Vorstellungskraft.", 1],
    [2, "I am interested in abstract ideas.", "Érdekelnek az elvont gondolatok.", "Ich interessiere mich für abstrakte Ideen.", 1],
    [3, "I enjoy encountering unfamiliar perspectives.", "Élvezem az ismeretlen nézőpontokkal való találkozást.", "Ich begegne gern ungewohnten Perspektiven.", 1],
    [4, "I prefer routine over trying something new.", "Inkább a rutint választom valami új kipróbálása helyett.", "Ich bevorzuge Routine gegenüber etwas Neuem.", -1],
    [5, "Art and ideas can deeply move me.", "A művészet és az eszmék mélyen meg tudnak érinteni.", "Kunst und Ideen können mich tief bewegen.", 1],
    [6, "I like exploring more than one explanation.", "Szeretek egynél több magyarázatot megvizsgálni.", "Ich prüfe gern mehr als eine Erklärung.", 1],
    [7, "I rarely wonder how things could be different.", "Ritkán gondolkodom azon, hogyan lehetnének másként a dolgok.", "Ich frage mich selten, wie Dinge anders sein könnten.", -1],
    [8, "I seek experiences that challenge my assumptions.", "Keresem azokat az élményeket, amelyek megkérdőjelezik a feltevéseimet.", "Ich suche Erfahrungen, die meine Annahmen infrage stellen.", 1],
    [9, "Complex questions hold my attention.", "Az összetett kérdések lekötik a figyelmemet.", "Komplexe Fragen fesseln meine Aufmerksamkeit.", 1],
  ],
  conscientiousness: [
    [10, "I am always prepared.", "Általában felkészült vagyok.", "Ich bin meistens vorbereitet.", 1],
    [11, "I follow through on commitments.", "Végigviszem a vállalásaimat.", "Ich halte meine Verpflichtungen ein.", 1],
    [12, "I keep my things in order.", "Rendben tartom a dolgaimat.", "Ich halte meine Dinge in Ordnung.", 1],
    [13, "I often leave tasks unfinished.", "Gyakran hagyok félbe feladatokat.", "Ich lasse Aufgaben oft unvollendet.", -1],
    [14, "I plan before acting on important matters.", "Fontos ügyekben cselekvés előtt tervezek.", "Bei wichtigen Dingen plane ich vor dem Handeln.", 1],
    [15, "Deadlines help me organise my effort.", "A határidők segítenek megszervezni az erőfeszítéseimet.", "Fristen helfen mir, meine Arbeit zu organisieren.", 1],
    [16, "I find it difficult to maintain routines.", "Nehezen tartom fenn a rutinokat.", "Es fällt mir schwer, Routinen beizubehalten.", -1],
    [17, "I notice details that affect the quality of my work.", "Észreveszem a munkám minőségét befolyásoló részleteket.", "Ich bemerke Details, die die Qualität meiner Arbeit beeinflussen.", 1],
    [18, "I can work steadily toward a distant goal.", "Kitartóan tudok dolgozni egy távoli célért.", "Ich kann stetig auf ein fernes Ziel hinarbeiten.", 1],
  ],
  extraversion: [
    [19, "I feel comfortable around people.", "Jól érzem magam emberek között.", "Ich fühle mich unter Menschen wohl.", 1],
    [20, "I start conversations.", "Gyakran kezdeményezek beszélgetést.", "Ich beginne Gespräche.", 1],
    [21, "I bring energy into groups.", "Energiát viszek a csoportokba.", "Ich bringe Energie in Gruppen.", 1],
    [22, "I prefer to stay in the background.", "Inkább a háttérben maradok.", "Ich bleibe lieber im Hintergrund.", -1],
    [23, "Social gatherings usually energise me.", "A társas összejövetelek általában feltöltenek.", "Gesellige Treffen geben mir meist Energie.", 1],
    [24, "I speak up easily in a group.", "Könnyen megszólalok egy csoportban.", "Ich ergreife in Gruppen leicht das Wort.", 1],
    [25, "I need a lot of time alone after social contact.", "Sok egyedüllétre van szükségem társas érintkezés után.", "Nach sozialen Kontakten brauche ich viel Zeit allein.", -1],
    [26, "I enjoy meeting new people.", "Szeretek új embereket megismerni.", "Ich lerne gern neue Menschen kennen.", 1],
    [27, "Others often experience me as enthusiastic.", "Mások gyakran lelkesnek látnak.", "Andere erleben mich oft als begeistert.", 1],
  ],
  agreeableness: [
    [28, "I sympathise with other people's feelings.", "Együtt érzek mások érzéseivel.", "Ich fühle mit den Gefühlen anderer mit.", 1],
    [29, "I make people feel at ease.", "Segítek, hogy mások fesztelenül érezzék magukat.", "Ich sorge dafür, dass Menschen sich wohlfühlen.", 1],
    [30, "I try to understand before I criticise.", "Kritika előtt igyekszem megérteni.", "Ich versuche zu verstehen, bevor ich kritisiere.", 1],
    [31, "I can be harsh when others make mistakes.", "Kemény tudok lenni, ha mások hibáznak.", "Ich kann hart sein, wenn andere Fehler machen.", -1],
    [32, "I look for solutions that preserve relationships.", "Olyan megoldásokat keresek, amelyek megőrzik a kapcsolatokat.", "Ich suche Lösungen, die Beziehungen erhalten.", 1],
    [33, "I assume good faith until I have reason not to.", "Jóhiszeműséget feltételezek, amíg nincs okom másra.", "Ich unterstelle guten Willen, solange nichts dagegenspricht.", 1],
    [34, "Winning an argument matters more than harmony.", "Egy vita megnyerése fontosabb, mint a harmónia.", "Ein Argument zu gewinnen ist wichtiger als Harmonie.", -1],
    [35, "I am willing to compromise on non-essential points.", "Nem lényegi kérdésekben hajlandó vagyok kompromisszumra.", "Bei unwesentlichen Punkten bin ich kompromissbereit.", 1],
    [36, "I notice when someone is left out.", "Észreveszem, ha valakit kihagynak.", "Ich bemerke, wenn jemand ausgeschlossen wird.", 1],
  ],
  emotionalStability: [
    [37, "I stay calm under pressure.", "Nyomás alatt is nyugodt maradok.", "Ich bleibe unter Druck ruhig.", 1],
    [38, "I recover after a difficult day.", "Egy nehéz nap után visszanyerem az egyensúlyomat.", "Nach einem schwierigen Tag finde ich mein Gleichgewicht wieder.", 1],
    [39, "Uncertainty quickly overwhelms me.", "A bizonytalanság gyorsan túlterhel.", "Unsicherheit überwältigt mich schnell.", -1],
    [40, "My mood changes very easily.", "A hangulatom nagyon könnyen változik.", "Meine Stimmung wechselt sehr leicht.", -1],
    [41, "I can think clearly when plans go wrong.", "Tisztán tudok gondolkodni, ha a tervek félresiklanak.", "Ich kann klar denken, wenn Pläne scheitern.", 1],
    [42, "I worry about many things.", "Sok minden miatt aggódom.", "Ich mache mir über viele Dinge Sorgen.", -1],
    [43, "Criticism stays with me for a long time.", "A kritika sokáig velem marad.", "Kritik beschäftigt mich lange.", -1],
    [44, "I can pause before reacting emotionally.", "Tudok szünetet tartani, mielőtt érzelmileg reagálok.", "Ich kann innehalten, bevor ich emotional reagiere.", 1],
    [45, "Setbacks rarely define my whole day.", "A kudarcok ritkán határozzák meg az egész napomat.", "Rückschläge bestimmen selten meinen ganzen Tag.", 1],
  ],
};

const personalityOrder = ["openness", "conscientiousness", "extraversion", "agreeableness", "emotionalStability"];
const personalityItems = Object.fromEntries(
  personalityOrder.map((dimensionId) => [
    dimensionId,
    personalityBanks[dimensionId].map(([id, en, hu, de, direction]) => item(`ipip-${id}`, dimensionId, direction, en, hu, de, "public-domain-ipip-inspired")),
  ]),
);
const personalityQuick = personalityOrder.flatMap((id) => personalityItems[id].slice(0, 4));
const personalityDeep = personalityOrder.flatMap((id) => personalityItems[id]);

const scaleTemplates = {
  en: [
    (pos) => `I usually try to ${pos}.`,
    (pos) => `When choices are difficult, I still try to ${pos}.`,
    (pos) => `People who know me would say that I ${pos}.`,
    (pos) => `It matters enough to me to ${pos}, even when inconvenient.`,
    (_pos, neg) => `I generally prefer to ${neg}.`,
  ],
  hu: [
    (pos) => `Általában igyekszem ${pos}.`,
    (pos) => `Nehéz döntésekben is igyekszem ${pos}.`,
    (pos) => `Akik ismernek, azt mondanák, hogy igyekszem ${pos}.`,
    (pos) => `Még kényelmetlenség árán is fontos számomra ${pos}.`,
    (_pos, neg) => `Általában inkább szeretek ${neg}.`,
  ],
  de: [
    (pos) => `Ich versuche meistens, ${pos}.`,
    (pos) => `Auch bei schwierigen Entscheidungen versuche ich, ${pos}.`,
    (pos) => `Menschen, die mich kennen, würden sagen, dass ich versuche, ${pos}.`,
    (pos) => `Es ist mir wichtig genug, ${pos}, auch wenn es unbequem ist.`,
    (_pos, neg) => `Im Allgemeinen ziehe ich es vor, ${neg}.`,
  ],
};

function facetItems(prefix, dimensionId, facetIndex, pos, neg) {
  return scaleTemplates.en.map((template, index) => item(
    `${prefix}-${facetIndex + 1}-${index + 1}`,
    dimensionId,
    index === 4 ? -1 : 1,
    template(pos.en, neg.en),
    scaleTemplates.hu[index](pos.hu, neg.hu),
    scaleTemplates.de[index](pos.de, neg.de),
    "mindcivilis-exploratory",
  ));
}

function scale(prefix, dimensionId, facets) {
  return facets.flatMap((facet, index) => facetItems(prefix, dimensionId, index, facet.pos, facet.neg));
}

function eightItemScale(prefix, dimensionId, facet) {
  return [
    ...facetItems(prefix, dimensionId, 0, facet.pos, facet.neg),
    item(`${prefix}-1-6`, dimensionId, 1, `Public decisions should usually aim to ${facet.pos.en}.`, `A közösségi döntéseknek általában arra kell törekedniük, hogy ${facet.pos.hu}.`, `Öffentliche Entscheidungen sollten normalerweise darauf zielen, ${facet.pos.de}.`, "mindcivilis-exploratory"),
    item(`${prefix}-1-7`, dimensionId, 1, `In uncertain cases, I lean toward approaches that try to ${facet.pos.en}.`, `Bizonytalan helyzetben olyan megközelítések felé hajlok, amelyek igyekeznek ${facet.pos.hu}.`, `In unsicheren Fällen neige ich zu Ansätzen, die versuchen, ${facet.pos.de}.`, "mindcivilis-exploratory"),
    item(`${prefix}-1-8`, dimensionId, -1, `I am comfortable with policies that ${facet.neg.en}.`, `Elfogadhatónak tartom azokat az intézkedéseket, amelyek inkább szeretnek ${facet.neg.hu}.`, `Ich kann mich mit Maßnahmen anfreunden, die ${facet.neg.de}.`, "mindcivilis-exploratory"),
  ];
}

const clauses = {
  values: {
    communityValue: ["protect shared wellbeing", "a közös jóllétet védeni", "gemeinsames Wohlergehen zu schützen", "put private benefit first", "a magánelőnyt előtérbe helyezni", "privaten Nutzen an erste Stelle zu setzen"],
    autonomyValue: ["respect people's self-direction", "tiszteletben tartani az emberek önirányítását", "die Selbstbestimmung von Menschen zu achten", "let others define the right path", "másokra hagyni a helyes út meghatározását", "anderen die Bestimmung des richtigen Weges zu überlassen"],
    equalityValue: ["secure equal standing", "az egyenlő státuszt biztosítani", "Gleichstellung zu sichern", "accept status differences as natural", "természetesnek venni a státuszkülönbségeket", "Statusunterschiede als natürlich hinzunehmen"],
    achievementValue: ["develop mastery and contribute visibly", "jártasságot fejleszteni és láthatóan hozzájárulni", "Kompetenz zu entwickeln und sichtbar beizutragen", "avoid demanding goals", "kerülni a komoly erőfeszítést igénylő célokat", "anspruchsvolle Ziele zu vermeiden"],
    traditionValue: ["preserve meaningful inherited practices", "megőrizni a jelentős örökölt gyakorlatokat", "bedeutsame überlieferte Praktiken zu bewahren", "replace inherited practices quickly", "gyorsan lecserélni az örökölt gyakorlatokat", "überlieferte Praktiken schnell zu ersetzen"],
    careValue: ["notice vulnerability and reduce harm", "észrevenni a sérülékenységet és csökkenteni az ártalmat", "Verletzlichkeit wahrzunehmen und Schaden zu verringern", "keep emotional distance from others' needs", "érzelmi távolságot tartani mások szükségleteitől", "emotionalen Abstand zu den Bedürfnissen anderer zu halten"],
  },
};

const simpleFacet = (values) => ({ pos: L(values[0], values[1], values[2]), neg: L(values[3], values[4], values[5]) });

const valuesItems = Object.entries(clauses.values).flatMap(([dimensionId, values]) => scale("values", dimensionId, [simpleFacet(values)]));

const moralItems = [
  ["moralCare", "protect people from avoidable harm", "megvédeni az embereket az elkerülhető ártalomtól", "Menschen vor vermeidbarem Schaden zu schützen", "treat vulnerability as a private matter", "magánügyként kezelni a sérülékenységet", "Verletzlichkeit als Privatsache zu behandeln"],
  ["moralFairness", "apply fair rules consistently", "következetesen méltányos szabályokat alkalmazni", "faire Regeln konsequent anzuwenden", "bend rules for preferred groups", "kedvelt csoportok érdekében hajlítani a szabályokat", "Regeln für bevorzugte Gruppen zu beugen"],
  ["moralLoyalty", "stand by a community that depends on me", "kitartani egy rám támaszkodó közösség mellett", "zu einer Gemeinschaft zu stehen, die auf mich zählt", "avoid obligations to any group", "kerülni minden csoport iránti kötelezettséget", "Verpflichtungen gegenüber Gruppen zu vermeiden"],
  ["moralAuthority", "respect legitimate roles and duties", "tiszteletben tartani a legitim szerepeket és kötelességeket", "legitime Rollen und Pflichten zu achten", "dismiss roles and duties as irrelevant", "jelentéktelennek tekinteni a szerepeket és kötelességeket", "Rollen und Pflichten als bedeutungslos abzutun"],
  ["moralLiberty", "protect people from domination and coercion", "megvédeni az embereket az uralomtól és kényszertől", "Menschen vor Beherrschung und Zwang zu schützen", "accept coercion when it is convenient", "elfogadni a kényszert, ha kényelmes", "Zwang hinzunehmen, wenn er bequem ist"],
].flatMap(([dimensionId, ...values], index) => facetItems("moral", dimensionId, index, simpleFacet(values).pos, simpleFacet(values).neg));

const participationItems = scale("participation", "participation", [
  simpleFacet(["vote and follow representative decisions", "szavazni és követni a képviseleti döntéseket", "zu wählen und repräsentative Entscheidungen zu verfolgen", "leave elections to others", "másokra hagyni a választásokat", "Wahlen anderen zu überlassen"]),
  simpleFacet(["help organise local community efforts", "helyi közösségi kezdeményezéseket szervezni", "lokale Gemeinschaftsinitiativen mitzuorganisieren", "stay outside local initiatives", "kívül maradni a helyi kezdeményezéseken", "lokalen Initiativen fernzubleiben"]),
  simpleFacet(["speak publicly for issues I value", "nyilvánosan kiállni a fontos ügyekért", "öffentlich für wichtige Anliegen einzutreten", "keep civic concerns entirely private", "teljesen magánügyként kezelni a közéleti aggodalmakat", "zivile Anliegen ganz privat zu halten"]),
  simpleFacet(["join deliberation with people who disagree", "részt venni párbeszédben olyanokkal is, akik nem értenek egyet", "mit Andersdenkenden zu beraten", "avoid civic disagreement", "kerülni a közéleti nézeteltérést", "zivilen Meinungsstreit zu vermeiden"]),
  simpleFacet(["use digital tools for constructive civic action", "digitális eszközöket használni építő közéleti cselekvésre", "digitale Werkzeuge konstruktiv zivil zu nutzen", "treat online civic spaces as pointless", "értelmetlennek tekinteni az online közéleti tereket", "digitale zivile Räume für sinnlos zu halten"]),
]);

const trustItems = scale("trust", "institutionalTrust", [
  simpleFacet(["rely on transparent public institutions", "átlátható közintézményekre támaszkodni", "auf transparente öffentliche Institutionen zu vertrauen", "assume public institutions always conceal their motives", "mindig rejtett szándékot feltételezni a közintézményekről", "öffentlichen Institutionen stets verborgene Motive zu unterstellen"]),
  simpleFacet(["give qualified experts conditional trust", "feltételes bizalmat adni képzett szakértőknek", "qualifizierten Fachleuten bedingt zu vertrauen", "reject expert advice as self-interested", "önérdekűként elutasítani a szakértői tanácsot", "Fachberatung als eigennützig abzulehnen"]),
  simpleFacet(["trust journalism that shows sources and corrections", "bízni a forrásokat és javításokat bemutató újságírásban", "Journalismus mit Quellen und Korrekturen zu vertrauen", "assume all news is equally unreliable", "minden hírt egyformán megbízhatatlannak tartani", "alle Nachrichten für gleichermaßen unzuverlässig zu halten"]),
  simpleFacet(["work with accountable local institutions", "elszámoltatható helyi intézményekkel együttműködni", "mit rechenschaftspflichtigen lokalen Institutionen zu arbeiten", "avoid local institutions entirely", "teljesen kerülni a helyi intézményeket", "lokale Institutionen ganz zu meiden"]),
  simpleFacet(["extend initial trust while keeping boundaries", "kezdeti bizalmat adni világos határok mellett", "anfängliches Vertrauen bei klaren Grenzen zu geben", "withhold trust until certainty is possible", "minden bizalmat visszatartani a teljes bizonyosságig", "Vertrauen bis zur Gewissheit zurückzuhalten"]),
]);

const communityRoleItems = scale("community-role", "communityRole", [
  simpleFacet(["connect people who could help one another", "összekötni egymásnak segíteni képes embereket", "Menschen zu verbinden, die einander helfen können", "keep useful contacts separate", "külön tartani a hasznos kapcsolatokat", "hilfreiche Kontakte getrennt zu halten"]),
  simpleFacet(["care for shared resources over time", "hosszú távon gondozni a közös erőforrásokat", "gemeinsame Ressourcen langfristig zu pflegen", "leave shared resources to someone else", "másokra hagyni a közös erőforrásokat", "gemeinsame Ressourcen anderen zu überlassen"]),
  simpleFacet(["question routines that exclude people", "megkérdőjelezni a kirekesztő rutinokat", "ausgrenzende Routinen infrage zu stellen", "leave established routines unchallenged", "érintetlenül hagyni a bevett rutinokat", "etablierte Routinen unangetastet zu lassen"]),
  simpleFacet(["turn shared ideas into practical projects", "a közös ötleteket gyakorlati projektekké alakítani", "gemeinsame Ideen in praktische Projekte umzusetzen", "stop at discussing ideas", "megállni az ötletek megbeszélésénél", "bei der Diskussion von Ideen stehenzubleiben"]),
]);

const epistemicItems = scale("epistemic", "epistemicCare", [
  simpleFacet(["compare sources with different incentives", "eltérő érdekeltségű forrásokat összevetni", "Quellen mit unterschiedlichen Interessen zu vergleichen", "rely on the first plausible source", "az első hihető forrásra támaszkodni", "sich auf die erste plausible Quelle zu verlassen"]),
  simpleFacet(["check claims before sharing them", "ellenőrizni az állításokat megosztás előtt", "Behauptungen vor dem Teilen zu prüfen", "share claims that feel right", "megérzés alapján megosztani állításokat", "stimmig wirkende Behauptungen ungeprüft zu teilen"]),
  simpleFacet(["state uncertainty when evidence is incomplete", "jelezni a bizonytalanságot hiányos bizonyíték esetén", "Unsicherheit bei unvollständiger Evidenz zu benennen", "sound certain even when evidence is thin", "biztosnak hangzani kevés bizonyíték mellett is", "auch bei dünner Evidenz sicher aufzutreten"]),
  simpleFacet(["review how my own assumptions shape conclusions", "átgondolni, hogyan alakítják feltevéseim a következtetéseimet", "zu prüfen, wie eigene Annahmen Schlussfolgerungen prägen", "treat my first interpretation as neutral", "semlegesnek tekinteni az első értelmezésemet", "die erste eigene Deutung für neutral zu halten"]),
  simpleFacet(["revise my view when stronger evidence appears", "felülvizsgálni a nézetemet erősebb bizonyíték esetén", "meine Sicht bei stärkerer Evidenz zu revidieren", "protect my view from conflicting evidence", "megvédeni a nézetemet az ellentmondó bizonyítéktól", "meine Sicht vor widersprechender Evidenz zu schützen"]),
]);

const futureItems = scale("future", "futureOrientation", [
  simpleFacet(["consider effects beyond the next few years", "a következő néhány éven túli hatásokat mérlegelni", "Folgen über die nächsten Jahre hinaus zu bedenken", "focus only on immediate outcomes", "csak a közvetlen eredményekre figyelni", "nur unmittelbare Ergebnisse zu betrachten"]),
  simpleFacet(["adapt plans when conditions change", "alkalmazkodni, ha a körülmények változnak", "Pläne an veränderte Bedingungen anzupassen", "hold to a plan regardless of new conditions", "új körülményektől függetlenül ragaszkodni a tervhez", "unabhängig von neuen Bedingungen am Plan festzuhalten"]),
  simpleFacet(["prepare for low-probability high-impact risks", "felkészülni a kis valószínűségű, nagy hatású kockázatokra", "auf seltene Risiken mit großer Wirkung vorbereitet zu sein", "ignore risks that are not immediate", "figyelmen kívül hagyni a nem közvetlen kockázatokat", "nicht unmittelbare Risiken zu ignorieren"]),
  simpleFacet(["test promising innovations carefully", "óvatosan kipróbálni az ígéretes újításokat", "vielversprechende Innovationen sorgfältig zu erproben", "avoid experiments with new approaches", "kerülni az új megközelítések kipróbálását", "Experimente mit neuen Ansätzen zu vermeiden"]),
  simpleFacet(["preserve what works while preparing for change", "megőrizni, ami működik, miközben készülök a változásra", "Bewährtes zu erhalten und zugleich Wandel vorzubereiten", "choose either stability or change without combining them", "a stabilitás és változás közül csak az egyiket választani", "Stabilität und Wandel nicht miteinander zu verbinden"]),
]);

const dialogueItems = scale("dialogue", "dialogueStyle", [
  simpleFacet(["listen for the strongest version of another view", "a másik nézet legerősebb változatát meghallani", "auf die stärkste Form einer anderen Sicht zu hören", "listen only for weaknesses to attack", "csak támadható gyengeségeket keresni", "nur nach angreifbaren Schwächen zu suchen"]),
  simpleFacet(["state disagreement clearly without humiliating others", "világosan vitatkozni mások megalázása nélkül", "Widerspruch klar und ohne Demütigung zu äußern", "soften every disagreement until it is unclear", "minden vitát érthetetlenségig tompítani", "jeden Widerspruch bis zur Unklarheit abzuschwächen"]),
  simpleFacet(["look for language that different groups can share", "eltérő csoportok számára közös nyelvet keresni", "nach einer Sprache zu suchen, die verschiedene Gruppen teilen können", "use language that marks opposing camps", "szembenálló táborokat kijelölő nyelvet használni", "Sprache zu nutzen, die gegnerische Lager markiert"]),
  simpleFacet(["set boundaries when dialogue becomes abusive", "határt szabni, ha a párbeszéd bántalmazóvá válik", "Grenzen zu setzen, wenn Dialog missbräuchlich wird", "continue any discussion regardless of harm", "minden beszélgetést folytatni az ártalomtól függetlenül", "jedes Gespräch ungeachtet des Schadens fortzusetzen"]),
]);

const solidarityItems = scale("solidarity", "solidarity", [
  simpleFacet(["take responsibility for the consequences of my choices", "felelősséget vállalni döntéseim következményeiért", "Verantwortung für die Folgen meiner Entscheidungen zu übernehmen", "shift personal consequences to others", "másokra hárítani a személyes következményeket", "persönliche Folgen auf andere abzuwälzen"]),
  simpleFacet(["support mutual aid when people face hardship", "kölcsönös segítséget nyújtani nehéz helyzetben", "gegenseitige Hilfe in Notlagen zu unterstützen", "treat hardship as purely private", "kizárólag magánügyként kezelni a nehézséget", "Not als reine Privatsache zu behandeln"]),
  simpleFacet(["extend concern beyond people similar to me", "a hozzám hasonló embereken túl is törődni másokkal", "Fürsorge über mir ähnliche Menschen hinaus auszudehnen", "reserve solidarity for my own group", "a saját csoportomra korlátozni a szolidaritást", "Solidarität auf die eigene Gruppe zu beschränken"]),
  simpleFacet(["return help and contribute when I can", "viszonozni a segítséget és hozzájárulni, amikor tudok", "Hilfe zu erwidern und beizutragen, wenn ich kann", "accept support without reciprocal duty", "viszonosság nélkül elfogadni a támogatást", "Unterstützung ohne Gegenpflicht anzunehmen"]),
  simpleFacet(["share responsibility for public goods", "részt vállalni a közjavak fenntartásában", "Verantwortung für öffentliche Güter zu teilen", "leave public goods to voluntary charity alone", "a közjavakat csak önkéntes jótékonyságra hagyni", "öffentliche Güter allein freiwilliger Wohltätigkeit zu überlassen"]),
]);

const exploratoryDefs = [
  ["sovereignty", "globalCooperation", L("Sovereignty & international cooperation", "Szuverenitás és nemzetközi együttműködés", "Souveränität & internationale Zusammenarbeit"), L("Where should binding decisions sit when problems cross borders?", "Hol szülessenek kötelező döntések, ha a problémák átlépik a határokat?", "Wo sollten verbindliche Entscheidungen liegen, wenn Probleme Grenzen überschreiten?"), ["share authority across borders when problems are genuinely shared", "határokon át megosztani a hatáskört valóban közös problémáknál", "Befugnisse bei wirklich gemeinsamen Problemen grenzüberschreitend zu teilen", "retain national control over every binding choice", "minden kötelező döntést nemzeti ellenőrzés alatt tartani", "jede bindende Entscheidung national zu kontrollieren"]],
  ["technocracy", "technocracy", L("Technocracy & popular decision-making", "Technokrácia és népi döntéshozatal", "Technokratie & Bürgerentscheidung"), L("How should expertise and democratic authorship be combined?", "Hogyan kapcsolódjon össze a szakértelem és a demokratikus beleszólás?", "Wie sollten Expertise und demokratische Mitgestaltung verbunden werden?"), ["give qualified expertise meaningful decision weight", "érdemi döntési súlyt adni a képzett szakértelemnek", "qualifizierter Expertise echtes Entscheidungsgewicht zu geben", "let popularity outweigh technical evidence", "a népszerűséget a technikai bizonyíték elé helyezni", "Popularität über fachliche Evidenz zu stellen"]],
  ["security", "civilLiberty", L("Security & civil liberties", "Biztonság és polgári szabadságok", "Sicherheit & Bürgerrechte"), L("Which safeguards remain essential under threat?", "Mely biztosítékok maradnak nélkülözhetetlenek fenyegetés idején?", "Welche Schutzvorkehrungen bleiben unter Bedrohung unverzichtbar?"), ["protect civil liberties while managing risk", "a kockázat kezelése mellett védeni a polgári szabadságokat", "Bürgerrechte bei der Risikosteuerung zu schützen", "accept broad intrusion for preventive security", "széles beavatkozást elfogadni a megelőző biztonságért", "breite Eingriffe für präventive Sicherheit hinzunehmen"]],
  ["ecology", "ecologicalPriority", L("Ecology & growth", "Ökológia és növekedés", "Ökologie & Wachstum"), L("How should ecological limits affect economic choices?", "Hogyan hassanak az ökológiai korlátok a gazdasági döntésekre?", "Wie sollten ökologische Grenzen wirtschaftliche Entscheidungen prägen?"), ["treat ecological limits as binding constraints", "kötelező korlátként kezelni az ökológiai határokat", "ökologische Grenzen als verbindlich zu behandeln", "prioritise current growth over distant environmental cost", "a jelen növekedést a távoli környezeti költség elé helyezni", "heutiges Wachstum über ferne Umweltkosten zu stellen"]],
  ["localism", "localism", L("Centralisation & localism", "Központosítás és lokalizmus", "Zentralisierung & Lokalismus"), L("At what level should public decisions be made?", "Milyen szinten szülessenek a közösségi döntések?", "Auf welcher Ebene sollten öffentliche Entscheidungen fallen?"), ["place decisions close to affected communities", "az érintett közösségekhez közel vinni a döntéseket", "Entscheidungen nahe bei betroffenen Gemeinschaften anzusiedeln", "prefer uniform central direction", "egységes központi irányítást előnyben részesíteni", "einheitliche zentrale Steuerung zu bevorzugen"]],
  ["merit", "meritStructure", L("Meritocracy & structural equality", "Meritokrácia és strukturális egyenlőség", "Meritokratie & strukturelle Gleichheit"), L("What explains unequal outcomes and what correction is fair?", "Mi magyarázza az egyenlőtlen eredményeket, és milyen korrekció méltányos?", "Was erklärt ungleiche Ergebnisse und welcher Ausgleich ist fair?"), ["correct structural barriers to fair opportunity", "korrigálni a méltányos esélyek strukturális akadályait", "strukturelle Hindernisse fairer Chancen auszugleichen", "treat outcomes mainly as individual merit", "az eredményeket főként egyéni érdemként kezelni", "Ergebnisse vor allem als individuelle Leistung zu betrachten"]],
  ["secular", "secularPublicLife", L("Secular state & religious-cultural public life", "Szekuláris állam és vallási-kulturális közélet", "Säkularer Staat & religiös-kulturelle Öffentlichkeit"), L("How should belief and public authority relate?", "Hogyan viszonyuljon egymáshoz a hit és a közhatalom?", "Wie sollten Glaube und öffentliche Gewalt zueinander stehen?"), ["keep public authority neutral between beliefs", "a közhatalmat világnézetileg semlegesen tartani", "öffentliche Gewalt zwischen Weltanschauungen neutral zu halten", "give inherited religion a privileged public role", "kiemelt közéleti szerepet adni az örökölt vallásnak", "überlieferter Religion eine privilegierte öffentliche Rolle zu geben"]],
  ["system", "systemCritique", L("System trust & system criticism", "Rendszerbizalom és rendszerkritika", "Systemvertrauen & Systemkritik"), L("Are failures exceptions or signs of deeper structure?", "A kudarcok kivételek vagy mélyebb szerkezeti jelek?", "Sind Fehler Ausnahmen oder Zeichen tieferer Strukturen?"), ["ask whether recurring failures are structural", "megkérdezni, hogy az ismétlődő kudarcok strukturálisak-e", "zu fragen, ob wiederkehrende Fehler strukturell sind", "treat recurring failures as isolated exceptions", "elszigetelt kivételként kezelni az ismétlődő kudarcokat", "wiederkehrende Fehler als Einzelfälle zu behandeln"]],
  ["digital", "digitalCaution", L("Digital state & AI caution", "Digitális állam és MI-óvatosság", "Digitalstaat & KI-Vorsicht"), L("Which rights should constrain automated public systems?", "Mely jogok korlátozzák az automatizált közrendszereket?", "Welche Rechte sollten automatisierte öffentliche Systeme begrenzen?"), ["require rights, transparency and appeal before automation", "jogokat, átláthatóságot és jogorvoslatot követelni automatizálás előtt", "vor Automatisierung Rechte, Transparenz und Einspruch zu verlangen", "adopt efficient automation before safeguards are complete", "hatékony automatizálást bevezetni a biztosítékok teljessége előtt", "effiziente Automatisierung vor vollständigen Schutzmaßnahmen einzuführen"]],
];

const exploratoryTests = exploratoryDefs.map(([id, dimensionId, title, description, values]) => ({
  id: `explore-${id}`,
  family: `explore-${id}`,
  category: "exploratory",
  title,
  description,
  questions: eightItemScale(`explore-${id}`, dimensionId, simpleFacet(values)),
  status: "exploratory",
  minutes: 3,
  accent: "#64cbd0",
}));

const Q = (config) => ({ status: "exploratory", accent: "#3fa7ff", ...config });

export const QUESTIONNAIRES = [
  Q({ id: "political-quick", family: "political", level: 1, category: "political", title: L("Quick Civic Snapshot", "Gyors közéleti pillanatkép", "Schneller Bürgerkompass"), description: L("A 20-item entry point built from the original MindCivilis political compass.", "20 kérdéses belépő az eredeti MindCivilis politikai iránytű alapján.", "Ein Einstieg mit 20 Aussagen aus dem ursprünglichen MindCivilis-Kompass."), questions: politicalQuick, minutes: 6, status: "interpretive", accent: "#3fa7ff" }),
  Q({ id: "political-standard", family: "political", level: 2, category: "political", title: L("Standard Political Atlas", "Standard politikai atlasz", "Politischer Standardatlas"), description: L("A 40-item reading of culture, economy, democratic power and change.", "40 kérdés a kultúra, gazdaság, demokratikus hatalom és változás rétegeiről.", "40 Aussagen zu Kultur, Wirtschaft, demokratischer Macht und Wandel."), questions: politicalStandard, minutes: 12, status: "interpretive", accent: "#3fa7ff" }),
  Q({ id: "political-deep", family: "political", level: 3, category: "political", title: L("Deep Civic-Political Profile", "Mély közéleti-politikai profil", "Tiefes zivil-politisches Profil"), description: L("The full 80-item civic-political bank with eight explicit dimensions.", "A teljes, 80 kérdéses közéleti-politikai bank nyolc külön dimenzióval.", "Die vollständige 80-Item-Bank mit acht klaren Dimensionen."), questions: politicalDeep, minutes: 24, status: "interpretive", accent: "#3fa7ff" }),
  Q({ id: "personality-quick", family: "personality", level: 1, category: "personality", title: L("Personality Snapshot", "Személyiség-pillanatkép", "Persönlichkeits-Snapshot"), description: L("A concise 20-item, public-domain IPIP-style layer.", "Rövid, 20 kérdéses, közkincs IPIP-jellegű személyiségréteg.", "Eine kurze 20-Item-Schicht im gemeinfreien IPIP-Stil."), questions: personalityQuick, minutes: 6, status: "public-domain", accent: "#9a7cff" }),
  Q({ id: "personality-deep", family: "personality", level: 2, category: "personality", title: L("Deeper Personality Profile", "Mélyebb személyiségprofil", "Vertieftes Persönlichkeitsprofil"), description: L("A 45-item Big Five–style reflection using public-domain item logic.", "45 kérdéses Big Five-jellegű önreflexió közkincs itemlogikával.", "Eine 45-Item-Reflexion im Big-Five-Stil mit gemeinfreier Itemlogik."), questions: personalityDeep, minutes: 14, status: "public-domain", accent: "#9a7cff" }),
  Q({ id: "values", family: "values", category: "values", title: L("Personal Values Compass", "Személyes értékiránytű", "Persönlicher Wertekompass"), description: L("Thirty prompts across community, autonomy, equality, achievement, continuity and care.", "Harminc állítás a közösség, autonómia, egyenlőség, teljesítmény, folytonosság és gondoskodás mentén.", "Dreißig Aussagen zu Gemeinschaft, Autonomie, Gleichheit, Leistung, Kontinuität und Fürsorge."), questions: valuesItems, minutes: 9, accent: "#65d694" }),
  Q({ id: "moral", family: "moral", category: "values", title: L("Moral Priorities", "Erkölcsi prioritások", "Moralische Prioritäten"), description: L("How care, fairness, loyalty, authority and liberty enter your judgments.", "Hogyan jelenik meg ítéleteidben a gondoskodás, méltányosság, lojalitás, tekintély és szabadság.", "Wie Fürsorge, Fairness, Loyalität, Autorität und Freiheit deine Urteile prägen."), questions: moralItems, minutes: 8, accent: "#65d694" }),
  Q({ id: "participation", family: "participation", category: "civic", title: L("Civic Participation Style", "Közéleti részvételi stílus", "Stil der Bürgerbeteiligung"), description: L("Institutional, community, advocacy, deliberative and digital participation.", "Intézményi, közösségi, érdekképviseleti, tanácskozó és digitális részvétel.", "Institutionelle, gemeinschaftliche, anwaltschaftliche, beratende und digitale Beteiligung."), questions: participationItems, minutes: 8, accent: "#e7b45a" }),
  Q({ id: "trust", family: "trust", category: "civic", title: L("Institutional Trust & Scepticism", "Intézményi bizalom és szkepticizmus", "Institutionelles Vertrauen & Skepsis"), description: L("Conditional trust across government, expertise, media, local institutions and people.", "Feltételes bizalom a kormányzat, szakértelem, média, helyi intézmények és emberek iránt.", "Bedingtes Vertrauen in Staat, Expertise, Medien, lokale Institutionen und Menschen."), questions: trustItems, minutes: 8, accent: "#e7b45a" }),
  Q({ id: "community-role", family: "community-role", category: "civic", title: L("Community Role Test", "Közösségi szerepteszt", "Gemeinschaftsrollentest"), description: L("Do you tend to connect, steward, challenge or build?", "Inkább összekötsz, gondozol, kihívsz vagy építesz?", "Verbindest, bewahrst, hinterfragst oder gestaltest du eher?"), questions: communityRoleItems, minutes: 6, accent: "#84b960" }),
  Q({ id: "epistemic", family: "epistemic", category: "civic", title: L("Media & Epistemic Style", "Média- és ismereti stílus", "Medien- & Erkenntnisstil"), description: L("Source diversity, verification, uncertainty, reflection and revision.", "Forrásdiverzitás, ellenőrzés, bizonytalanság, reflexió és felülvizsgálat.", "Quellenvielfalt, Prüfung, Unsicherheit, Reflexion und Revision."), questions: epistemicItems, minutes: 8, accent: "#64cbd0" }),
  Q({ id: "future", family: "future", category: "civic", title: L("Future Orientation & Change Style", "Jövőorientáció és változásstílus", "Zukunftsorientierung & Wandelstil"), description: L("Time horizon, adaptation, risk, innovation and continuity.", "Időtáv, alkalmazkodás, kockázat, innováció és folytonosság.", "Zeithorizont, Anpassung, Risiko, Innovation und Kontinuität."), questions: futureItems, minutes: 8, accent: "#f17865" }),
  Q({ id: "dialogue", family: "dialogue", category: "civic", title: L("Disagreement & Dialogue Style", "Vita- és párbeszédstílus", "Konflikt- & Dialogstil"), description: L("Listening, clarity, bridge-building and boundaries in disagreement.", "Figyelem, világosság, hídépítés és határok nézeteltérésben.", "Zuhören, Klarheit, Brückenbau und Grenzen im Widerspruch."), questions: dialogueItems, minutes: 6, accent: "#c281d8" }),
  Q({ id: "solidarity", family: "solidarity", category: "civic", title: L("Responsibility & Solidarity", "Felelősség és szolidaritás", "Verantwortung & Solidarität"), description: L("Personal agency, mutual aid, universal concern, reciprocity and public duty.", "Személyes cselekvőképesség, kölcsönös segítség, univerzális törődés, viszonosság és közfeladat.", "Eigenverantwortung, gegenseitige Hilfe, universale Fürsorge, Reziprozität und öffentliche Pflicht."), questions: solidarityItems, minutes: 8, accent: "#84b960" }),
  ...exploratoryTests,
];

export const QUESTIONNAIRE_BY_ID = Object.fromEntries(QUESTIONNAIRES.map((test) => [test.id, test]));

export function getQuestionnaireCount() {
  return QUESTIONNAIRES.length;
}

export function getDocumentedItemCount() {
  return QUESTIONNAIRES.reduce((sum, test) => sum + test.questions.length, 0);
}
