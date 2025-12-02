"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { NAV_LINKS } from "@/constants/navigation";
import styles from "./header.module.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

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
              <button
                className={styles.link}
                aria-expanded={dropdownOpen === id}
                aria-haspopup={subLinks ? "true" : "false"}
              >
                {label}
                {subLinks && (
                  dropdownOpen === id ? (
                    <FaChevronUp size={12} className="chevron-icon" />
                  ) : (
                    <FaChevronDown size={12} className="chevron-icon" />
                  )
                )}
              </button>
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