import Link from "next/link";

import {
  InstagramIcon,
  MailIcon,
  TelegramIcon,
} from "@/components/ui/ContactIcons";
import { CONTACTS } from "@/data/contacts";

import styles from "./Footer.module.css";

const footerNavigation = [
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

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        <div className={styles.mainGrid}>
          <div className={styles.brand}>
            <p className={styles.brandText}>
              Меблі на замовлення
              <br />
              у Києві та передмісті
            </p>
          </div>

          <div className={styles.navigation}>
            <p className={styles.sectionTitle}>НАВІГАЦІЯ</p>

            <nav
              className={styles.navigationGrid}
              aria-label="Навігація у футері"
            >
              {footerNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.navigationLink}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className={styles.contacts}>
            <p className={styles.sectionTitle}>КОНТАКТИ</p>

            <div className={styles.contactPrimary}>
              <a
                href={CONTACTS.primaryPhone.href}
                className={styles.phoneContact}
              >
                <span className={styles.contactName}>
                  {CONTACTS.primaryPhone.name}
                </span>

                <strong>{CONTACTS.primaryPhone.display}</strong>
              </a>

              <a
                href={CONTACTS.secondaryPhone.href}
                className={styles.phoneContact}
              >
                <span className={styles.contactName}>
                  {CONTACTS.secondaryPhone.name}
                </span>

                <strong>{CONTACTS.secondaryPhone.display}</strong>
              </a>

              <a
                href={CONTACTS.email.href}
                className={styles.emailLink}
              >
                <MailIcon className={styles.contactIcon} />

                <span>{CONTACTS.email.display}</span>
              </a>
            </div>

            <div className={styles.socialLinks}>
              <a
                href={CONTACTS.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <span className={styles.socialLinkContent}>
                  <InstagramIcon className={styles.contactIcon} />
                  <span>Instagram</span>
                </span>

                <span
                  className={styles.externalArrow}
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>

              <a
                href={CONTACTS.telegram.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
              >
                <span className={styles.socialLinkContent}>
                  <TelegramIcon className={styles.contactIcon} />
                  <span>{CONTACTS.telegram.label}</span>
                </span>

                <span
                  className={styles.externalArrow}
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>© 2026 4HOME</p>

          <p>Меблі на замовлення · Київ та передмістя</p>
        </div>
      </div>
    </footer>
  );
}