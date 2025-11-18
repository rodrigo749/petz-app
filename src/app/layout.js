import './globals.css'
import { GeistSans } from 'geist/font/sans'
import Footer from './components/footer'

export const metadata = {
  title: 'Petz-App',
  description: 'Conectando pessoas e pets com amor 💕',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={GeistSans.className}>
      <body>
        <main>{children}</main>
        <Footer /> {/* ✅ Footer global */}
      </body>
    </html>
  )
}
