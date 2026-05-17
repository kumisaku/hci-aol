import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider, LanguageProvider } from "@/lib/contexts";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "EcoPath — Perencana Kebun Urban",
  description:
    "Rencanakan dan kelola kebun urban kamu. Rekomendasi tanaman, visual planner, dan jadwal perawatan.",
  keywords: ["kebun", "urban farming", "balkon", "tanaman", "bertanam"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                classNames: {
                  toast: "rounded-xl border border-border shadow-card font-sans",
                  success: "border-l-4 border-l-primary",
                  error: "border-l-4 border-l-red-500",
                },
              }}
            />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
