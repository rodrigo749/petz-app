import "./globals.css";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Inter } from "next/font/google";
import { ToastProvider } from "@/components/Toast/toast.context";



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
    <html lang="pt-BR" className={inter.variable} suppressHydrationWarning>
      <body style={{display: "flex", flexDirection: "column", minHeight: "100vh"}} suppressHydrationWarning>
        <ToastProvider>
          <Header />
          <main style={{ flexGrow: 1 }}>
            {children}
          </main>
          <Footer /> {/* ✅ Footer global */}
        </ToastProvider>
        {/* Paw elements for parallax */}
        <div className="paw paw1"><img src="/images/paww.svg" alt="paw" /></div>
        <div className="paw paw2"><img src="/images/paws.png" alt="paw" /></div>
        <div className="paw paw3"><img src="/images/paww.png" alt="paw" /></div>
        <div className="paw paw4"><img src="/images/paww.svg" alt="paw" /></div>
        <div className="paw paw5"><img src="/images/paws.png" alt="paw" /></div>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                const body = document.body;
                let scrollTimeout;

                function showScrollbar() {
                  body.classList.add('scrolling');
                  clearTimeout(scrollTimeout);
                  scrollTimeout = setTimeout(() => {
                    body.classList.remove('scrolling');
                  }, 1000); // Hide after 1 second of no scrolling
                }

                window.addEventListener('scroll', showScrollbar);

                // Parallax for paws
                const paws = document.querySelectorAll('.paw');
                window.addEventListener('scroll', function() {
                  const scrollY = window.scrollY;
                  paws.forEach((paw, index) => {
                    const speed = (index + 1) * 0.5;
                    paw.style.transform = \`translateY(\${scrollY * speed}px)\`;
                  });
                });
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
