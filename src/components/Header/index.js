"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { NAV_LINKS } from "@/constants/navigation";
import styles from "./header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
    setUsuarioLogado(u);

    // Listen for changes in localStorage (from other tabs/windows)
    const handleStorageChange = () => {
      const updated = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
      setUsuarioLogado(updated);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/images/Logo.png"
            alt="Patas Perdidas"
            width={180}
            height={60}
            priority
            className={styles.logoImage}
          />
        </Link>

        {/* Desktop Menu */}
        <div className={styles.desktop}>
          {NAV_LINKS.map(({ id, label, href, subLinks }) => (
            <div 
              key={id} 
              className={styles.dropdown}
              onMouseEnter={() => subLinks && setDropdownOpen(id)}
              onMouseLeave={() => setDropdownOpen(null)}
            >
              {subLinks ? (
                <button
                  className={styles.link}
                  aria-expanded={dropdownOpen === id}
                  aria-haspopup={"true"}
                >
                  {label}
                  {dropdownOpen === id ? (
                    <FaChevronUp size={12} className="chevron-icon" />
                  ) : (
                    <FaChevronDown size={12} className="chevron-icon" />
                  )}
                </button>
              ) : (
                <Link href={href} className={styles.link}>{label}</Link>
              )}

              {subLinks && dropdownOpen === id && (
                <div className={styles.dropdownMenu}>
                  {subLinks.map((subLink, index) => (
                    <Link
                      key={index}
                      href={subLink.href}
                      className={styles.dropdownItem}
                    >
                      {subLink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Profile avatar (desktop) */}
        {usuarioLogado && (
          <div className={styles.profileWrap} onMouseEnter={() => setProfileOpen(true)} onMouseLeave={() => setProfileOpen(false)}>
            <button
              className={styles.avatarLink}
              onClick={() => setProfileOpen(!profileOpen)}
              aria-haspopup="true"
              aria-expanded={profileOpen}
            >
              <span className={styles.avatarIcon} aria-hidden>
                {usuarioLogado.imagem ? (
                  <img
                    src={usuarioLogado.imagem}
                    alt="Perfil"
                    className={styles.avatarImage}
                  />
                ) : (
                  <img
                    src="/images/Avatar.png"
                    alt="Perfil padrão"
                    className={styles.avatarImage}
                  />
                )}
              </span>
            </button>

            {profileOpen && (
              <div className={styles.dropdownMenu} role="menu">
                <Link
                  href={usuarioLogado.tipo === "ong" ? "/perfil-ong" : "/perfil-usuario"}
                  className={styles.dropdownItem}
                  onClick={() => setProfileOpen(false)}
                >
                  Editar perfil
                </Link>

                <Link
                  href="/meus-pets-perdidos"
                  className={styles.dropdownItem}
                  onClick={() => setProfileOpen(false)}
                >
                  Meus pets perdidos
                </Link>

                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    // logout
                    localStorage.removeItem("usuarioLogado");
                    setUsuarioLogado(null);
                    setProfileOpen(false);
                    router.push("/");
                  }}
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        )}

        <button
          className={styles.toggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className={styles.mobile}>
            <div
              className={styles.overlay}
              onClick={() => setMenuOpen(false)}
            />

            <div className={styles.sheet}>
              <div className={styles.sheetHeader}>
                <Image
                  src="/images/Logo.png"
                  alt="Patas Perdidas"
                  width={150}
                  height={50}
                />
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fechar menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className={styles.sheetLinks}>
                {/* Mobile user links when logged in */}
                {usuarioLogado && (
                  <div className={styles.mobileUser}>
                    <div className={styles.mobileUserHeader}>
                      <span className={styles.mobileAvatar}>
                        {usuarioLogado.imagem ? (
                          <img src={usuarioLogado.imagem} alt="avatar" />
                        ) : (
                          <img src="/images/Avatar.png" alt="avatar" />
                        )}
                      </span>
                      <div className={styles.mobileUserName}>
                        {usuarioLogado.nome || usuarioLogado.razaoSocial || "Usuário"}
                      </div>
                    </div>

                    <div className={styles.mobileUserLinks}>
                      <Link
                        href={usuarioLogado.tipo === "ong" ? "/perfil-ong" : "/perfil-usuario"}
                        onClick={() => setMenuOpen(false)}
                        className={styles.mobileSubLink}
                      >
                        Editar perfil
                      </Link>

                      <Link
                        href="/meus-pets-perdidos"
                        onClick={() => setMenuOpen(false)}
                        className={styles.mobileSubLink}
                      >
                        Meus pets perdidos
                      </Link>

                      <button
                        className={styles.mobileSubLink}
                        onClick={() => {
                          localStorage.removeItem("usuarioLogado");
                          setUsuarioLogado(null);
                          setMenuOpen(false);
                          router.push("/");
                        }}
                      >
                        Sair
                      </button>
                    </div>
                  </div>
                )}
                {NAV_LINKS.map(({ id, label, href, subLinks }) => (
                  <div key={id}>
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={styles.mobileLink}
                    >
                      {label}
                      {subLinks && <FaChevronDown size={12} />}
                    </Link>
                    {subLinks && (
                      <div className={styles.mobileSubLinks}>
                        {subLinks.map((subLink, index) => (
                          <Link
                            key={index}
                            href={subLink.href}
                            onClick={() => setMenuOpen(false)}
                            className={styles.mobileSubLink}
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}