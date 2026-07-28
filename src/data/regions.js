import { L } from "./dimensions.js";

export const AGE_BANDS = [
  { id: "under-18", label: L("Under 18", "18 év alatt", "Unter 18") },
  { id: "18-24", label: L("18–24", "18–24", "18–24") },
  { id: "25-34", label: L("25–34", "25–34", "25–34") },
  { id: "35-44", label: L("35–44", "35–44", "35–44") },
  { id: "45-54", label: L("45–54", "45–54", "45–54") },
  { id: "55-64", label: L("55–64", "55–64", "55–64") },
  { id: "65-74", label: L("65–74", "65–74", "65–74") },
  { id: "75-plus", label: L("75 or older", "75 éves vagy idősebb", "75 oder älter") },
  { id: "prefer-not", label: L("Prefer not to say", "Nem szeretném megadni", "Keine Angabe") },
];

export const COUNTRIES = [
  ["HU", "Hungary", "Magyarország", "Ungarn"],
  ["DE", "Germany", "Németország", "Deutschland"],
  ["AT", "Austria", "Ausztria", "Österreich"],
  ["CH", "Switzerland", "Svájc", "Schweiz"],
  ["RO", "Romania", "Románia", "Rumänien"],
  ["SK", "Slovakia", "Szlovákia", "Slowakei"],
  ["HR", "Croatia", "Horvátország", "Kroatien"],
  ["SI", "Slovenia", "Szlovénia", "Slowenien"],
  ["CZ", "Czechia", "Csehország", "Tschechien"],
  ["PL", "Poland", "Lengyelország", "Polen"],
  ["NL", "Netherlands", "Hollandia", "Niederlande"],
  ["BE", "Belgium", "Belgium", "Belgien"],
  ["FR", "France", "Franciaország", "Frankreich"],
  ["GB", "United Kingdom", "Egyesült Királyság", "Vereinigtes Königreich"],
  ["OTHER", "Other country", "Más ország", "Anderes Land"],
].map(([id, en, hu, de]) => ({ id, label: L(en, hu, de) }));

const broad = [
  ["capital", "Capital / metropolitan region", "Fővárosi / nagyvárosi régió", "Hauptstadt- / Metropolregion"],
  ["north", "Northern broad region", "Északi nagyrégió", "Nördliche Großregion"],
  ["east", "Eastern broad region", "Keleti nagyrégió", "Östliche Großregion"],
  ["south", "Southern broad region", "Déli nagyrégió", "Südliche Großregion"],
  ["west", "Western broad region", "Nyugati nagyrégió", "Westliche Großregion"],
  ["central", "Central broad region", "Középső nagyrégió", "Zentrale Großregion"],
  ["prefer-not", "Prefer not to say", "Nem szeretném megadni", "Keine Angabe"],
].map(([id, en, hu, de]) => ({ id, label: L(en, hu, de) }));

export const REGIONS = {
  HU: [
    ["budapest", "Budapest", "Budapest", "Budapest"],
    ["pest", "Pest", "Pest", "Pest"],
    ["central-transdanubia", "Central Transdanubia", "Közép-Dunántúl", "Mitteltransdanubien"],
    ["western-transdanubia", "Western Transdanubia", "Nyugat-Dunántúl", "Westtransdanubien"],
    ["southern-transdanubia", "Southern Transdanubia", "Dél-Dunántúl", "Südtransdanubien"],
    ["northern-hungary", "Northern Hungary", "Észak-Magyarország", "Nordungarn"],
    ["northern-great-plain", "Northern Great Plain", "Észak-Alföld", "Nördliche Große Tiefebene"],
    ["southern-great-plain", "Southern Great Plain", "Dél-Alföld", "Südliche Große Tiefebene"],
    ["prefer-not", "Prefer not to say", "Nem szeretném megadni", "Keine Angabe"],
  ].map(([id, en, hu, de]) => ({ id, label: L(en, hu, de) })),
  DE: [
    "Baden-Württemberg", "Bavaria", "Berlin", "Brandenburg", "Bremen", "Hamburg", "Hesse", "Lower Saxony", "Mecklenburg-Vorpommern", "North Rhine-Westphalia", "Rhineland-Palatinate", "Saarland", "Saxony", "Saxony-Anhalt", "Schleswig-Holstein", "Thuringia",
  ].map((name) => ({ id: name.toLowerCase().replaceAll(" ", "-"), label: L(name, name, name === "Bavaria" ? "Bayern" : name === "Hesse" ? "Hessen" : name === "Lower Saxony" ? "Niedersachsen" : name === "North Rhine-Westphalia" ? "Nordrhein-Westfalen" : name === "Rhineland-Palatinate" ? "Rheinland-Pfalz" : name === "Saxony" ? "Sachsen" : name === "Saxony-Anhalt" ? "Sachsen-Anhalt" : name === "Thuringia" ? "Thüringen" : name) })),
  DEFAULT: broad,
};

export function getRegions(country) {
  return REGIONS[country] ?? REGIONS.DEFAULT;
}

