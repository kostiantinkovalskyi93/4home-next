import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { CONTACTS } from "@/data/contacts";
import { getPublishedPortfolioProjects } from "@/lib/portfolio-db";
import {
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

import { PortfolioGallery } from "./PortfolioGallery";
import styles from "./page.module.css";

const PORTFOLIO_TITLE =
  "Наші роботи — меблі на замовлення у Києві";
const PORTFOLIO_DESCRIPTION =
  "Реальні проєкти 4HOME: кухні, шафи та інші корпусні меблі на замовлення у Києві та передмісті.";

export const metadata: Metadata = {
  title: PORTFOLIO_TITLE,
  description: PORTFOLIO_DESCRIPTION,
  alternates: {
    canonical: "/portfolio",
  },
  openGraph: {
    type: "website",
    url: "/portfolio",
    siteName: SITE_NAME,
    locale: "uk_UA",
    title: PORTFOLIO_TITLE,
    description: PORTFOLIO_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: PORTFOLIO_TITLE,
    description: PORTFOLIO_DESCRIPTION,
  },
};

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const portfolioProjects =
    await getPublishedPortfolioProjects();

  const projectCount = String(
    portfolioProjects.length,
  ).padStart(2, "0");

  const portfolioJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: PORTFOLIO_TITLE,
    description: PORTFOLIO_DESCRIPTION,
    url: `${SITE_URL}/portfolio`,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: portfolioProjects.length,
      itemListElement: portfolioProjects.map(
        (project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}/portfolio/${project.slug}`,
          name: project.title,
          image: project.coverImage,
        }),
      ),
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            portfolioJsonLd,
          ).replace(/</g, "\\u003c"),
        }}
      />
      <section className={styles.hero}>
        <div className={`container ${styles.pageContainer}`}>
          <div className={styles.heroTop}>
            <div
              className={`${styles.heroEntrance} ${styles.heroEntranceOne}`}
            >
              <p className={styles.eyebrow}>ПОРТФОЛІО 4HOME</p>
            </div>

            <div
              className={`${styles.heroEntrance} ${styles.heroEntranceTwo}`}
            >
              <div className={styles.heroIndex}>
                <span>SELECTED</span>
                <span>{projectCount} WORKS</span>
              </div>
            </div>
          </div>

          <div className={styles.heroMain}>
            <div>
              <div
                className={`${styles.heroEntrance} ${styles.heroEntranceThree}`}
              >
                <h1 className={styles.heroTitle}>
                  Реальні
                  <br />
                  простори.
                  <br />
                  <span>Реальні меблі.</span>
                </h1>
              </div>
            </div>

            <div className={styles.heroSide}>
              <div
                className={`${styles.heroEntrance} ${styles.heroEntranceFour}`}
              >
                <p className={styles.heroText}>
                  Кухні, шафи та інші корпусні меблі, створені під конкретне
                  приміщення, розміри та щоденні задачі.
                </p>
              </div>

              <div
                className={`${styles.heroEntrance} ${styles.heroEntranceFive}`}
              >
                <div className={styles.heroMeta}>
                  <span>KYIV</span>
                  <span>2026</span>
                  <span>INDIVIDUAL FURNITURE</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${styles.heroEntrance} ${styles.heroEntranceSix}`}
          >
            <div className={styles.scrollCue} aria-hidden="true">
              <span>ДИВИТИСЯ РОБОТИ</span>
              <span className={styles.scrollLine} />
              <span>↓</span>
            </div>
          </div>
        </div>
      </section>

      <PortfolioGallery projects={portfolioProjects} />

      <section className={styles.statement}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <p className={styles.darkEyebrow}>НЕ КАТАЛОГ</p>
          </Reveal>

          <div className={styles.statementGrid}>
            <Reveal delay={70}>
              <h2 className={styles.statementTitle}>
                Те, що ви бачите —
                <br />
                вже створено.
                <br />
                <span>Те, що створимо для вас — буде іншим.</span>
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <div className={styles.statementContent}>
                <p>
                  Кожен проєкт у портфоліо створювався під конкретне
                  приміщення. Фото показують підхід і результат, але не
                  обмежують майбутню конструкцію, розміри, матеріали чи
                  наповнення.
                </p>

                <Link
                  href="/contacts#lead-form"
                  className={styles.darkTextLink}
                >
                  Обговорити свій проєкт
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={220}>
            <div className={styles.statementRule}>
              <span>4HOME</span>
              <span>ONE SPACE — ONE SOLUTION</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <p className={styles.sectionEyebrow}>НАСТУПНИЙ ПРОЄКТ</p>
          </Reveal>

          <div className={styles.finalCtaGrid}>
            <Reveal delay={70}>
              <h2 className={styles.finalCtaTitle}>
                Можливо,
                <br />
                наступним
                <br />
                <span>буде ваш.</span>
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <div className={styles.finalCtaContent}>
                <p>
                  Надішліть фото приміщення, приблизні розміри або приклад
                  меблів, які вам подобаються. Цього достатньо, щоб почати
                  обговорення.
                </p>

                <div className={styles.finalActions}>
                  <Link
                    href="/contacts#lead-form"
                    className={styles.primaryButton}
                  >
                    <span>Розрахувати вартість</span>
                    <span aria-hidden="true">→</span>
                  </Link>

                  <a
                    href={CONTACTS.primaryPhone.href}
                    className={styles.phoneLink}
                  >
                    {CONTACTS.primaryPhone.display}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}