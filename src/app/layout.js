import "./globals.css";
import Footer from '../components/Footer'
import { Geist } from "next/font/google";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
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
      <body>
        <Header />
        <Footer /> {/* ✅ Footer global */}
        {children}
      </body>
    </html>
  )
}
