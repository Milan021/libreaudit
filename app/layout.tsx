import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LibreAudit — Auditez vos dépendances logicielles",
  description:
    "Auditez vos logiciels propriétaires, mesurez les risques de lock-in et découvrez les alternatives libres.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
