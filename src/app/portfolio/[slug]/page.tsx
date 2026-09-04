import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { CONTACTS } from "@/data/contacts";
import {
  getPortfolioProject,
  portfolioProjects,
} from "@/data/portfolioProjects";

import { ProjectGallery } from "./ProjectGallery";
import styles from "./page.module.css";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return portfolioProjects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  const project = getPortfolioProject(slug);

  if (!project) {
    return {
      title: "Проєкт не знайдено",
    };
  }

  return {
    title: `${project.title} — портфоліо`,
    description: `${project.title}. Реалізований проєкт меблів на замовлення 4HOME.`,
  };
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { slug } = await params;

  const project = getPortfolioProject(slug);

  if (!project) {
    notFound();
  }

  const sameCategoryProjects = portfolioProjects.filter(
    (item) =>
      item.slug !== project.slug &&
      item.category === project.category,
  );

  const otherCategoryProjects = portfolioProjects.filter(
    (item) =>
      item.slug !== project.slug &&
      item.category !== project.category,
  );

  const relatedProjects = [
    ...sameCategoryProjects,
    ...otherCategoryProjects,
  ].slice(0, 3);

  return (
    <>
      <Header />

      <main>
        {/* HERO */}
        <section className={styles.hero}>
          <div className={`container ${styles.pageContainer}`}>
            <nav
              className={styles.breadcrumbs}
              aria-label="Навігація"
            >
              <Link href="/">Головна</Link>

              <span aria-hidden="true">/</span>

              <Link href="/portfolio">
                Наші роботи
              </Link>

              <span aria-hidden="true">/</span>

              <span>{project.title}</span>
            </nav>

            <p className={styles.eyebrow}>
              {project.category}
            </p>

            <h1 className={styles.title}>
              {project.title}
            </h1>
          </div>
        </section>

        {/* GALLERY */}
        <section className={styles.gallery}>
          <div className={`container ${styles.pageContainer}`}>
            <ProjectGallery images={project.images} />
          </div>
        </section>

        {/* PROJECT INFO */}
        <section className={styles.info}>
          <div
            className={`container ${styles.pageContainer} ${styles.infoGrid}`}
          >
            <div>
              <p className={styles.sectionEyebrow}>
                ПРОЄКТ 4HOME
              </p>

              <h2 className={styles.sectionTitle}>
                Меблі створені
                <br />
                під конкретний простір
              </h2>
            </div>

            <div className={styles.infoContent}>
              <p>
                Кожен проєкт 4HOME створюється індивідуально
                за розмірами та потребами конкретного
                приміщення.
              </p>

              <p>
                Якщо вам подобається цей напрямок, його можна
                використати як орієнтир для вашого власного
                проєкту.
              </p>
            </div>
          </div>
        </section>

        {/* OTHER PROJECTS */}
        {relatedProjects.length > 0 && (
          <section className={styles.related}>
            <div className={`container ${styles.pageContainer}`}>
              <div className={styles.relatedHeader}>
                <div>
                  <p className={styles.sectionEyebrow}>
                    ЩЕ РОБОТИ
                  </p>

                  <h2 className={styles.relatedTitle}>
                    Інші проєкти
                    <br />
                    4HOME
                  </h2>
                </div>

                <Link
                  href="/portfolio"
                  className={styles.relatedAllLink}
                >
                  Усі роботи

                  <span aria-hidden="true">→</span>
                </Link>
              </div>

              <div className={styles.relatedGrid}>
                {relatedProjects.map((item) => (
                  <Link
                    key={item.slug}
                    href={`/portfolio/${item.slug}`}
                    className={styles.relatedCard}
                  >
                    <div className={styles.relatedImageWrapper}>
                      <Image
                        src={item.coverImage}
                        alt={item.images[0]?.alt ?? item.title}
                        fill
                        sizes="
                          (max-width: 650px) 100vw,
                          (max-width: 1000px) 50vw,
                          33vw
                        "
                        className={styles.relatedImage}
                      />

                      <div
                        className={styles.relatedOverlay}
                        aria-hidden="true"
                      />

                      <div className={styles.relatedCardContent}>
                        <span className={styles.relatedCategory}>
                          {item.category}
                        </span>

                        <div className={styles.relatedCardBottom}>
                          <h3>{item.title}</h3>

                          <span
                            className={styles.relatedArrow}
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className={styles.cta}>
          <div
            className={`container ${styles.pageContainer} ${styles.ctaGrid}`}
          >
            <div>
              <p className={styles.darkEyebrow}>
                ПОДОБАЄТЬСЯ ЦЕЙ ПРОЄКТ?
              </p>

              <h2 className={styles.ctaTitle}>
                Розрахуємо
                <br />
                подібне рішення
              </h2>
            </div>

            <div className={styles.ctaContent}>
              <p>
                Надішліть фото приміщення та приблизні розміри.
                Це допоможе почати обговорення вашого проєкту.
              </p>

              <div className={styles.ctaActions}>
                <Link
                  href="/contacts"
                  className={styles.primaryButton}
                >
                  Розрахувати подібний проєкт

                  <span aria-hidden="true">→</span>
                </Link>

                <a
                  href={CONTACTS.primaryPhone.href}
                  className={styles.secondaryButton}
                >
                  {CONTACTS.primaryPhone.display}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* BACK */}
        <section className={styles.backSection}>
          <div className={`container ${styles.pageContainer}`}>
            <Link
              href="/portfolio"
              className={styles.backLink}
            >
              <span aria-hidden="true">←</span>

              Повернутися до всіх робіт
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}