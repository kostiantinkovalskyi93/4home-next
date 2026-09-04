"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  InstagramIcon,
  MailIcon,
  TelegramIcon,
  ViberIcon,
} from "@/components/ui/ContactIcons";
import { CONTACTS } from "@/data/contacts";

import styles from "./Header.module.css";

const navigation = [
  { label: "Про нас", href: "/about" },
  { label: "Кухні", href: "/kitchens" },
  { label: "Шафи", href: "/wardrobes" },
  { label: "Інші меблі", href: "/furniture" },
  { label: "Наші роботи", href: "/portfolio" },
  { label: "Процес", href: "/process" },
  { label: "Матеріали", href: "/materials" },
  { label: "Контакти", href: "/contacts" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function toggleMenu() {
    setIsMenuOpen((current) => !current);
  }

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
              priority
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
            <Link href="/contacts" className={styles.cta}>
              Розрахувати вартість
            </Link>

            <a
              href={CONTACTS.primaryPhone.href}
              className={styles.phone}
              aria-label={`Зателефонувати Сергію: ${CONTACTS.primaryPhone.display}`}
            >
              {CONTACTS.primaryPhone.display}
            </a>
          </div>

          <button
            className={`${styles.menuButton} ${
              isMenuOpen ? styles.menuButtonOpen : ""
            }`}
            type="button"
            aria-label={
              isMenuOpen ? "Закрити меню" : "Відкрити меню"
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

      <div
        className={`${styles.mobileMenuOverlay} ${
          isMenuOpen ? styles.mobileMenuOverlayOpen : ""
        }`}
        aria-hidden={!isMenuOpen}
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
              onClick={closeMenu}
            >
              Розрахувати вартість
            </Link>

            <div className={styles.mobileContacts}>
              <a
                href={CONTACTS.primaryPhone.href}
                className={styles.mobilePhoneContact}
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
              >
                <MailIcon className={styles.mobileChannelIcon} />
                <span>Email</span>
              </a>

              <a
                href={CONTACTS.instagram.href}
                className={styles.mobileChannel}
                target="_blank"
                rel="noopener noreferrer"
              >
                <InstagramIcon
                  className={styles.mobileChannelIcon}
                />
                <span>Instagram</span>
              </a>

              <a
                href={CONTACTS.viber.href}
                className={styles.mobileChannel}
              >
                <ViberIcon className={styles.mobileChannelIcon} />
                <span>Viber</span>
              </a>

              <a
                href={CONTACTS.telegram.href}
                className={styles.mobileChannel}
                target="_blank"
                rel="noopener noreferrer"
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