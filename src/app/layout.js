import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Patas Perdidas",
  description: "Encontre • Adote • Ajude",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header className="topbar">
          <div className="container">
            <div className="brand">
              <div className="logo" aria-hidden="true"></div>
              <div>
                <div className="brand-title">Patas Perdidas</div>
                <div className="brand-sub">Encontre • Adote • Ajude</div>
              </div>
            </div>

            <nav className="toplinks" aria-label="menu">
              <a href="#">Entrar</a>
              <a href="#">Adoção</a>
              <a href="#">Pets perdidos</a>
              <a href="#">Apoiar</a>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="site-footer">
          © 2025 Patas Perdidas — Projeto exemplo
        </footer>
      </body>
    </html>
  );
}
