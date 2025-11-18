import Header from "@/components/Header";
import "./globals.css";
import Footer from '../components/Footer'

export const metadata = {
  title: "Patas Perdidas",
  description: "Plataforma para ONGs, adoção e busca de animais perdidos",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
               <Footer /> {/* ✅ Footer global */}
        {children}
      </body>
    </html>
  )
}
