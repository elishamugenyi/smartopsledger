import type { Metadata } from "next";
import { ThemeProvider } from "@/app/components/theme-provider";
import "./globals.css";

const themeInitScript = `
(function () {
  try {
    var theme = localStorage.getItem("theme");
    var isDark =
      theme === "dark" ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (e) {}
})();
`;

export const metadata: Metadata = {
  title: "SmartOps Ledger",
  description:
    "SmartOps Ledger helps businesses run secure, modern operational accounting workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
