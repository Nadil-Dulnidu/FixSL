import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import "./globals.css";
import "leaflet/dist/leaflet.css";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FixSL | Citizen-Powered Sri Lanka Infrastructure Reporting",
  description:
    "Report road damage, broken streetlights, hazardous potholes, garbage pileups, and drainage issues across Sri Lanka. Track progress in real-time.",
  keywords: [
    "Sri Lanka infrastructure",
    "pothole report Colombo",
    "FixSL",
    "civic reporting",
    "Sri Lanka road repairs",
    "community tracking",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${poppins.variable} dark h-full antialiased`}>
        <body className="min-h-screen flex flex-col bg-[#090d16] text-slate-100 font-sans selection:bg-amber-500/30 selection:text-amber-200">
          {children}
          <Toaster
            position="top-right"
            richColors
            toastOptions={{
              style: {
                background: "#111827",
                border: "1px solid #1e293b",
                color: "#f8fafc",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
