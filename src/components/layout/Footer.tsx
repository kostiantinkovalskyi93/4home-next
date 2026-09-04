import Image from "next/image";
import Link from "next/link";

import { CONTACTS } from "@/data/contacts";

import styles from "./Footer.module.css";

const navigation = [
  { label: "Кухні", href: "/kitchens" },
  { label: "Шафи", href: "/wardrobes" },
  { label: "Інші меблі", href: "/furniture" },
  { label: "Наші роботи", href: "/portfolio" },
  { label: "Контакти", href: "/contacts" },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <Link
              href="/"
              className={styles.logo}
              aria-label="4HOME — головна сторінка"
            >
              <Image
                src="/brand/4home-logo.png"
                alt="4HOME"
                width={522}
                height={247}
                className={styles.logoImage}
              />
            </Link>

            <p className={styles.brandText}>
              Меблі на замовлення
              <br />
              у Києві та передмісті
            </p>
          </div>

          <div className={styles.navigationBlock}>
            <p className={styles.columnLabel}>Навігація</p>

            <nav className={styles.navigation} aria-label="Навігація у підвалі">
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
          </div>

          <div className={styles.contactsBlock}>
            <p className={styles.columnLabel}>Контакти</p>

            <div className={styles.primaryContacts}>
              <a href={CONTACTS.phone.href} className={styles.contactLink}>
                {CONTACTS.phone.display}
              </a>

              <a href={CONTACTS.email.href} className={styles.contactLink}>
                {CONTACTS.email.display}
              </a>
            </div>

            <div className={styles.socials}>
              <a
                href={CONTACTS.instagram.href}
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                aria-label="Відкрити Instagram 4HOME"
              >
                <span>Instagram</span>
                <span className={styles.socialArrow} aria-hidden="true">
                  ↗
                </span>
              </a>

              <a
                href={CONTACTS.viber.href}
                className={styles.socialLink}
                aria-label="Написати 4HOME у Viber"
              >
                <span>Viber</span>
                <span className={styles.socialArrow} aria-hidden="true">
                  ↗
                </span>
              </a>

              <a
                href={CONTACTS.telegram.href}
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
                aria-label="Написати 4HOME у Telegram"
              >
                <span>Telegram</span>
                <span className={styles.socialArrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© 2026 4HOME</p>

          <p>Меблі на замовлення • Київ та передмістя</p>
        </div>
      </div>
    </footer>
  );
}