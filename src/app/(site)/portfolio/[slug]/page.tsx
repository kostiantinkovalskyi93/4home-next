import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Reveal } from "@/components/ui/Reveal";
import { CONTACTS } from "@/data/contacts";
import {
  getPublishedPortfolioProject,
  getPublishedPortfolioProjects,
} from "@/lib/portfolio-db";
import { SITE_URL } from "@/lib/site";

import { ProjectGallery } from "./ProjectGallery";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = await getPublishedPortfolioProject(slug);

  if (!project) {
    return {
      title: "Проєкт не знайдено",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalPath = `/portfolio/${project.slug}`;

  const description =
    `${project.title}. Реалізований проєкт меблів на замовлення 4HOME у портфоліо виконаних робіт.`;

  return {
    title: `${project.title} — портфоліо`,
    description,

    alternates: {
      canonical: canonicalPath,
    },

    openGraph: {
      type: "article",
      url: canonicalPath,
      title: `${project.title} — портфоліо 4HOME`,
      description,
      images: [
        {
          url: project.coverImage,
          alt: `${project.title} — 4HOME`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${project.title} — портфоліо 4HOME`,
      description,
      images: [project.coverImage],
    },
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project = await getPublishedPortfolioProject(slug);

  if (!project) {
    notFound();
  }

  const portfolioProjects =
    await getPublishedPortfolioProjects();

  const projectIndex = portfolioProjects.findIndex(
    (item) => item.slug === project.slug,
  );

  const nextProject =
    portfolioProjects[
      (projectIndex + 1) % portfolioProjects.length
    ];

  const currentNumber = String(projectIndex + 1).padStart(2, "0");
  const totalNumber = String(portfolioProjects.length).padStart(2, "0");

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Головна",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Наші роботи",
        item: `${SITE_URL}/portfolio`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${SITE_URL}/portfolio/${project.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <main>
        {/* ========================================
            HERO
        ======================================== */}

        <section className={styles.hero}>
          <div className={`container ${styles.pageContainer}`}>
            <nav
              className={`${styles.breadcrumbs} ${styles.heroEntrance} ${styles.heroEntranceOne}`}
              aria-label="Навігація"
            >
              <Link href="/">Головна</Link>

              <span aria-hidden="true">/</span>

              <Link href="/portfolio">Наші роботи</Link>

              <span aria-hidden="true">/</span>

              <span>{project.title}</span>
            </nav>

            <div className={styles.heroTop}>
              <div
                className={`${styles.heroEntrance} ${styles.heroEntranceTwo}`}
              >
                <p className={styles.eyebrow}>
                  {project.category}
                </p>
              </div>

              <div
                className={`${styles.projectIndex} ${styles.heroEntrance} ${styles.heroEntranceThree}`}
              >
                <span>PROJECT</span>

                <span>
                  {currentNumber}
                  <span className={styles.projectIndexDivider}>
                    /
                  </span>
                  {totalNumber}
                </span>
              </div>
            </div>

            <div className={styles.heroMain}>
              <div
                className={`${styles.heroEntrance} ${styles.heroEntranceFour}`}
              >
                <h1 className={styles.title}>
                  {project.title}
                </h1>
              </div>

              <div
                className={`${styles.heroMeta} ${styles.heroEntrance} ${styles.heroEntranceFive}`}
              >
                <span>4HOME</span>
                <span>REALIZED PROJECT</span>
                <span>KYIV</span>
              </div>
            </div>

            <div
              className={`${styles.heroFooter} ${styles.heroEntrance} ${styles.heroEntranceSix}`}
            >
              <span>ДИВИТИСЯ ПРОЄКТ</span>

              <span className={styles.heroLine} />

              <span aria-hidden="true">↓</span>
            </div>
          </div>
        </section>

        {/* ========================================
            GALLERY
        ======================================== */}

        <section className={styles.gallery}>
          <ProjectGallery images={project.images} />
        </section>

        {/* ========================================
            PROJECT STATEMENT
        ======================================== */}

        <section className={styles.info}>
          <div className={`container ${styles.pageContainer}`}>
            <Reveal>
              <p className={styles.sectionEyebrow}>
                ПРОЄКТ 4HOME
              </p>
            </Reveal>

            <div className={styles.infoGrid}>
              <Reveal delay={70}>
                <h2 className={styles.sectionTitle}>
                  Не готова модель.
                  <br />
                  <span>
                    Рішення для конкретного простору.
                  </span>
                </h2>
              </Reveal>

              <Reveal delay={150}>
                <div className={styles.infoContent}>
                  <p>
                    Кожен проєкт 4HOME створюється
                    індивідуально — відповідно до розмірів,
                    планування та щоденних потреб конкретного
                    приміщення.
                  </p>

                  <p>
                    Якщо вам подобається цей напрямок,
                    використаємо його як орієнтир і створимо
                    окреме рішення саме для вашого простору.
                  </p>

                  <Link
                    href="/contacts#lead-form"
                    className={styles.infoLink}
                  >
                    Обговорити подібний проєкт

                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={220}>
              <div className={styles.infoRule}>
                <span>
                  {currentNumber} / {totalNumber}
                </span>

                <span>{project.category}</span>

                <span>INDIVIDUAL FURNITURE</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ========================================
            NEXT PROJECT
        ======================================== */}

        {nextProject && nextProject.slug !== project.slug && (
          <section className={styles.nextProject}>
            <div className={`container ${styles.pageContainer}`}>
              <Reveal>
                <div className={styles.nextHeader}>
                  <div>
                    <p className={styles.sectionEyebrow}>
                      НАСТУПНИЙ ПРОЄКТ
                    </p>

                    <p className={styles.nextCounter}>
                      {String(
                        ((projectIndex + 1) %
                          portfolioProjects.length) +
                          1,
                      ).padStart(2, "0")}{" "}
                      / {totalNumber}
                    </p>
                  </div>

                  <Link
                    href="/portfolio"
                    className={styles.allProjectsLink}
                  >
                    Усі роботи

                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </Reveal>

              <Reveal delay={90}>
                <Link
                  href={`/portfolio/${nextProject.slug}`}
                  className={styles.nextCard}
                >
                  <div className={styles.nextImageWrapper}>
                    <Image
                      src={nextProject.coverImage}
                      alt={
                        nextProject.images[0]?.alt ??
                        nextProject.title
                      }
                      fill
                      sizes="(max-width: 650px) 100vw, 1280px"
                      className={styles.nextImage}
                    />

                    <div
                      className={styles.nextOverlay}
                      aria-hidden="true"
                    />

                    <div className={styles.nextCardTop}>
                      <span>{nextProject.category}</span>

                      <span>4HOME</span>
                    </div>

                    <div className={styles.nextCardBottom}>
                      <h2>{nextProject.title}</h2>

                      <span
                        className={styles.nextArrow}
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            </div>
          </section>
        )}

        {/* ========================================
            CTA
        ======================================== */}

        <section className={styles.cta}>
          <div className={`container ${styles.pageContainer}`}>
            <Reveal>
              <p className={styles.darkEyebrow}>
                ВАШ ПРОЄКТ
              </p>
            </Reveal>

            <div className={styles.ctaGrid}>
              <Reveal delay={70}>
                <h2 className={styles.ctaTitle}>
                  Подобається
                  <br />
                  цей напрямок?
                  <br />
                  <span>Створимо ваш.</span>
                </h2>
              </Reveal>

              <Reveal delay={150}>
                <div className={styles.ctaContent}>
                  <p>
                    Надішліть фото приміщення, приблизні
                    розміри або приклад меблів, які вам
                    подобаються. Цього достатньо, щоб почати
                    обговорення.
                  </p>

                  <div className={styles.ctaActions}>
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

        {/* ========================================
            BACK
        ======================================== */}

        <section className={styles.backSection}>
          <div className={`container ${styles.pageContainer}`}>
            <Link
              href="/portfolio"
              className={styles.backLink}
            >
              <span aria-hidden="true">←</span>

              Повернутися до всіх робіт
            </Link>

            <span className={styles.backBrand}>
              4HOME / PORTFOLIO
            </span>
          </div>
        </section>
      </main>
    </>
  );
}