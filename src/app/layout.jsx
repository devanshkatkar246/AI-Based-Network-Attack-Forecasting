import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata = {
  title: "The Forecaster — Temporal Network Intelligence",
  description:
    "The Forecaster is a temporal network intelligence system that forecasts future attack trajectories from network telemetry and provides early warning, evidence, and intervention analysis.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark h-full bg-[#0B0E12]" style={{ colorScheme: "dark" }}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                  if (localStorage.getItem('sih_theme') === 'light') {
                    localStorage.removeItem('sih_theme');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="h-full bg-[#0B0E12] text-[#E7EBF0] antialiased font-sans selection:bg-[#7898C7]/30 selection:text-[#E7EBF0]">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
