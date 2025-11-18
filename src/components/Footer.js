import { FaTiktok, FaFacebook, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>Patas Perdidas 🐾</h2>
          <p>Conectando pessoas e pets com amor 💕</p>
        </div>

        {/*<div className="footer-links">
          <a href="#">Sobre</a>
          <a href="#">Contato</a>
          <a href="#">Apoiar</a>
        </div>*/}

        {/* Ícones sociais */}
        <div className="footer-icons">
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
          >
            <FaTiktok />
          </a>

          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <FaFacebook />
          </a>

          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
        </div>

        <div className="footer-copy">
          <p>© {year} Patas Perdidas. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
