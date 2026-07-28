import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://mindcivilis.joe328.chatgpt.site"),
  title: {
    default: "MindCivilis – Nézetek a térképen",
    template: "%s · MindCivilis",
  },
  description:
    "Önkéntes kutatási kérdőív és ideológiai térkép valódi, legalább tízfős csoportátlagokkal.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "MindCivilis – Nézetek a térképen",
    description:
      "Önkéntes, privát kutatási részvétel. Lásd a saját ideológiai térképedet és a valódi csoportátlagokat.",
    images: [{ url: "/og.png", width: 1731, height: 909 }],
    locale: "hu_HU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu">
      <body>{children}</body>
    </html>
  );
}
