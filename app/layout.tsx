import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pitch Clarity Score",
  description: "Analysez la clarté et l’impact de votre pitch"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
