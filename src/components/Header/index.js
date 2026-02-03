"use client";

import { useEffect, useMemo, useState } from "react";
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

  // 🔐 sincroniza estado de autenticação
  useEffect(() => {
    const syncAuth = () => {
      const u = JSON.parse(localStorage.getItem("usuarioLogado") || "null");
      setUsuarioLogado(u);
    };

    syncAuth();

    // outras abas
    window.addEventListener("storage", syncAuth);
    // mesma aba (login/logout)
    window.addEventListener("auth-changed", syncAuth);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-changed", syncAuth);
    };
  }, []);

  // ✅ normaliza o usuário (suporta {user:{...}} ou {...})
  const user = useMemo(() => {
    return usuarioLogado?.user ? usuarioLogado.user : usuarioLogado;
  }, [usuarioLogado]);

  // 🏢 regra: apenas ONG (CNPJ) vê opções de perfil ONG
  // suporta: user.role === "ong" e/ou user.tipo === "ong" e/ou cnpj em qualquer nível
  const isOng =
    !!user?.cnpj ||
    user?.tipo === "ong" ||
    user?.role === "ong";

  // 🔍 filtra links conforme login
  const navLinksFiltrados = NAV_LINKS.filter((link) => {
    if (link.id === "perfil" && !isOng) return false;
    if (link.id === "login" && usuarioLogado) return false;
    return true;
  });

  // ✅ pega a imagem do usuário/ong (tenta campos comuns)
  const avatarSrc =
    user?.imagem ||
    user?.avatar ||
    user?.photo ||
    "/images/Avatar.png";

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

        {/* ================= DESKTOP MENU ================= */}
        <div className={styles.desktop}>
          {navLinksFiltrados.map(({ id, label, href, subLinks }) => (
            <div
              key={id}
              className={styles.dropdown}
              onMouseEnter={() => subLinks && setDropdownOpen(id)}
              onMouseLeave={() => setDropdownOpen(null)}
            >
              {subLinks ? (
                <button
                  type="button"
                  className={styles.link}
                  aria-expanded={dropdownOpen === id}
                  aria-haspopup="true"
                >
                  {label}
                  {dropdownOpen === id ? (
                    <FaChevronUp size={12} />
                  ) : (
                    <FaChevronDown size={12} />
                  )}
                </button>
              ) : (
                <Link href={href} className={styles.link}>
                  {label}
                </Link>
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

        {/* ================= AVATAR DESKTOP ================= */}
        {user && (
          <div className={styles.profileWrap}>
            <Link href="/perfil" className={styles.avatarLink}>
              <span className={styles.avatarIcon}>
                <img
                  src={avatarSrc}
                  alt="Perfil"
                  className={styles.avatarImage}
                />
              </span>
            </Link>
          </div>
        )}

        {/* ================= BOTÃO MOBILE ================= */}
        <button
          className={styles.toggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* ================= MOBILE MENU ================= */}
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
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Fechar menu"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className={styles.sheetLinks}>
                {navLinksFiltrados.map(({ id, label, href, subLinks }) => (
                  <div key={id}>
                    {subLinks ? (
                      <div className={styles.mobileLink}>
                        {label} <FaChevronDown size={12} />
                      </div>
                    ) : (
                      <Link
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={styles.mobileLink}
                      >
                        {label}
                      </Link>
                    )}

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
