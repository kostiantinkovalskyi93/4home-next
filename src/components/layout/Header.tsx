"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import {
  InstagramIcon,
  MailIcon,
  TelegramIcon,
  ViberIcon,
} from "@/components/ui/ContactIcons";
import { CONTACTS } from "@/data/contacts";

import styles from "./Header.module.css";

const navigation = [
  {
    label: "Про нас",
    href: "/about",
  },
  {
    label: "Кухні",
    href: "/kitchens",
  },
  {
    label: "Шафи",
    href: "/wardrobes",
  },
  {
    label: "Інші меблі",
    href: "/furniture",
  },
  {
    label: "Наші роботи",
    href: "/portfolio",
  },
  {
    label: "Процес",
    href: "/process",
  },
  {
    label: "Матеріали",
    href: "/materials",
  },
  {
    label: "Контакти",
    href: "/contacts",
  },
] as const;

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current);
  };

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeMenu, isMenuOpen]);

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.inner}`}>
          <Link
            href="/"
            className={styles.logo}
            aria-label="4HOME — головна сторінка"
            onClick={closeMenu}
          >
            <Image
              src="/brand/4home-logo.png"
              alt="4HOME"
              width={522}
              height={247}
              className={styles.logoImage}
            />
          </Link>

          <nav
            className={styles.navigation}
            aria-label="Основна навігація"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.navLink}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            <Link
              href="/contacts"
              className={styles.cta}
            >
              Розрахувати вартість
            </Link>

            <a
              href={CONTACTS.primaryPhone.href}
              className={styles.phone}
            >
              {CONTACTS.primaryPhone.display}
            </a>
          </div>

          <button
            type="button"
            className={`${styles.menuButton} ${
              isMenuOpen ? styles.menuButtonOpen : ""
            }`}
            aria-label={
              isMenuOpen
                ? "Закрити меню"
                : "Відкрити меню"
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <button
        type="button"
        className={`${styles.mobileMenuOverlay} ${
          isMenuOpen
            ? styles.mobileMenuOverlayOpen
            : ""
        }`}
        aria-label="Закрити меню"
        tabIndex={isMenuOpen ? 0 : -1}
        onClick={closeMenu}
      />

      <aside
        id="mobile-navigation"
        className={`${styles.mobileMenu} ${
          isMenuOpen ? styles.mobileMenuOpen : ""
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className={styles.mobileMenuInner}>
          <nav
            className={styles.mobileNavigation}
            aria-label="Мобільна навігація"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.mobileNavLink}
                tabIndex={isMenuOpen ? 0 : -1}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.mobileMenuBottom}>
            <Link
              href="/contacts"
              className={styles.mobileCta}
              tabIndex={isMenuOpen ? 0 : -1}
              onClick={closeMenu}
            >
              Розрахувати вартість
            </Link>

            <div className={styles.mobileContacts}>
              <a
                href={CONTACTS.primaryPhone.href}
                className={styles.mobilePhoneContact}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                <span className={styles.mobileContactName}>
                  {CONTACTS.primaryPhone.name}
                </span>

                <strong>
                  {CONTACTS.primaryPhone.display}
                </strong>
              </a>

              <a
                href={CONTACTS.secondaryPhone.href}
                className={styles.mobilePhoneContact}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                <span className={styles.mobileContactName}>
                  {CONTACTS.secondaryPhone.name}
                </span>

                <strong>
                  {CONTACTS.secondaryPhone.display}
                </strong>
              </a>
            </div>

            <div className={styles.mobileContactChannels}>
              <a
                href={CONTACTS.email.href}
                className={styles.mobileChannel}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                <MailIcon
                  className={styles.mobileChannelIcon}
                />

                <span>Email</span>
              </a>

              <a
                href={CONTACTS.instagram.href}
                target="_blank"
                rel="noreferrer"
                className={styles.mobileChannel}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                <InstagramIcon
                  className={styles.mobileChannelIcon}
                />

                <span>Instagram</span>
              </a>

              <a
                href={CONTACTS.viber.href}
                className={styles.mobileChannel}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                <ViberIcon
                  className={styles.mobileChannelIcon}
                />

                <span>Viber</span>
              </a>

              <a
                href={CONTACTS.telegram.href}
                target="_blank"
                rel="noreferrer"
                className={styles.mobileChannel}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                <TelegramIcon
                  className={styles.mobileChannelIcon}
                />

                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}