import type { Metadata } from "next";
import { MindCivilisApp } from "./MindCivilisApp";

export const metadata: Metadata = {
  title: "MindCivilis – Nézetek a térképen",
  description:
    "Önkéntes, anonim kutatási kérdőív és ideológiai térkép valódi, legalább tízfős csoportátlagokkal.",
  other: {
    "codex-preview": "development",
  },
};

export default function Home() {
  return <MindCivilisApp />;
}
