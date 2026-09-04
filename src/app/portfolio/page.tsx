import type { Metadata } from "next";
import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { CONTACTS } from "@/data/contacts";

import { PortfolioGallery } from "./PortfolioGallery";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Наші роботи",
  description:
    "Портфоліо 4HOME: кухні, шафи та інші корпусні меблі на замовлення у Києві та передмісті.",
};

export default function PortfolioPage() {
  return (
    <>
      <Header />

      <main>
        <section className={styles.hero}>
          <div className={`container ${styles.pageContainer}`}>
            <p className={styles.eyebrow}>ПОРТФОЛІО 4HOME</p>

            <h1 className={styles.heroTitle}>
              Реальні роботи,
              <br />
              а не картинки з каталогу
            </h1>

            <p className={styles.heroText}>
              Кухні, шафи та інші корпусні меблі, створені під конкретні
              приміщення, розміри та задачі.
            </p>
          </div>
        </section>

        <PortfolioGallery />

        <section className={styles.note}>
          <div className={`container ${styles.pageContainer}`}>
            <div className={styles.noteGrid}>
              <div>
                <p className={styles.sectionEyebrow}>
                  КОЖЕН ПРОЄКТ УНІКАЛЬНИЙ
                </p>

                <h2 className={styles.sectionTitle}>
                  Фото показують результат,
                  <br />
                  але не обмежують можливості
                </h2>
              </div>

              <div className={styles.noteContent}>
                <p>
                  Меблі з портфоліо створювались під конкретні приміщення та
                  потреби. Ваш проєкт може мати інші розміри, конструкцію,
                  наповнення та зовнішній вигляд.
                </p>

                <Link href="/contacts" className={styles.textLink}>
                  Обговорити свій проєкт
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div
            className={`container ${styles.pageContainer} ${styles.ctaGrid}`}
          >
            <div>
              <p className={styles.darkEyebrow}>МАЄТЕ СХОЖУ ІДЕЮ?</p>

              <h2 className={styles.ctaTitle}>
                Покажіть, що
                <br />
                потрібно зробити
              </h2>
            </div>

            <div className={styles.ctaContent}>
              <p>
                Надішліть фото, приблизні розміри або приклад меблів, які вам
                подобаються. Цього достатньо, щоб почати обговорення.
              </p>

              <div className={styles.ctaActions}>
                <Link href="/contacts" className={styles.primaryButton}>
                  Розрахувати вартість
                  <span aria-hidden="true">→</span>
                </Link>

                <a
                  href={CONTACTS.phone.href}
                  className={styles.secondaryButton}
                >
                  {CONTACTS.phone.display}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}