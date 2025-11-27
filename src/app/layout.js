import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Patas Perdidas",
  description: "Plataforma para ONGs, adoção e busca de animais perdidos",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={geistSans.variable}>
      <body style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
        <Header />
        <main style={{ flexGrow: 1 }}>
          {children}
        </main>
        <Footer /> {/* ✅ Footer global */}
      </body>
    </html>
  );
}
