"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { FaChevronDown } from "react-icons/fa";
import { NAV_LINKS } from "@/constants/navigation";
import styles from "@/styles/Header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
          {NAV_LINKS.map(({ id, label, href }) => (
            <Link key={id} href={href} className={styles.link}>
              {label}
              {id !== 'apoiar' && <FaChevronDown size={12} className="chevron-icon" />}
            </Link>
          ))}
        </div>

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
                {NAV_LINKS.map(({ id, label, href }) => (
                  <Link
                    key={id}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={styles.mobileLink}
                  >
                    {label}
                    {id !== 'apoiar' && <FaChevronDown size={12} />}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
