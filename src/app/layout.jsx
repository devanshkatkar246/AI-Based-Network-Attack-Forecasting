import "./globals.css";

export const metadata = {
  title: "Temporal Network World Model | AI Attack Forecasting MVP",
  description: "AI-Based Network Attack Forecasting from Network Traffic Data - SIH 2026 Problem Statement 26153",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-slate-50">
      <body className="h-full bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
