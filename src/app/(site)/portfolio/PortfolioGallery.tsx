"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";

import type {
  PublicPortfolioCategory,
  PublicPortfolioProject,
} from "@/lib/portfolio-db";

import styles from "./page.module.css";

const filters = [
  "Усі",
  "Кухні",
  "Розпашні шафи",
  "Шафи-купе",
  "Інші меблі",
] as const;

type Filter = (typeof filters)[number];

type Project = PublicPortfolioProject;

const LARGE_IMAGE_SIZES =
  "(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 58vw";

const SMALL_IMAGE_SIZES =
  "(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 42vw";

const FULL_IMAGE_SIZES =
  "(max-width: 650px) 100vw, 100vw";

function getProjectLayout(
  index: number,
  total: number,
) {
  if (total === 1) {
    return {
      className: styles.projectFull,
      sizes: FULL_IMAGE_SIZES,
    };
  }

  const position = index % 5;

  if (position === 4) {
    return {
      className: styles.projectFull,
      sizes: FULL_IMAGE_SIZES,
    };
  }

  if (position === 0 || position === 3) {
    return {
      className: styles.projectLarge,
      sizes: LARGE_IMAGE_SIZES,
    };
  }

  return {
    className: styles.projectSmall,
    sizes: SMALL_IMAGE_SIZES,
  };
}

type ProjectCardProps = {
  project: Project;
  index: number;
  total: number;
  filterKey: string;
};

function ProjectCard({
  project,
  index,
  total,
  filterKey,
}: ProjectCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const layout = getProjectLayout(index, total);

  useEffect(() => {
    const element = cardRef.current;

    if (!element) {
      return;
    }

    setIsVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      {
        threshold: 0.04,
        rootMargin: "0px 0px 4% 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [filterKey]);

  return (
    <Link
      ref={cardRef}
      href={`/portfolio/${project.slug}`}
      className={`${styles.projectCard} ${layout.className} ${
        isVisible ? styles.projectCardVisible : ""
      }`}
        style={{
    "--project-delay": `${Math.min(index % 5, 3) * 45}ms`,
  } as CSSProperties}
    >
      <div className={styles.imageReveal}>
        <div className={styles.imageWrapper}>
          <Image
            src={project.coverImage}
            alt={project.images[0]?.alt ?? project.title}
            fill
            sizes={layout.sizes}
            className={styles.image}
          />

          <div className={styles.overlay} />

          <div className={styles.projectNumber} aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </div>

          <div className={styles.projectContent}>
            <div className={styles.projectText}>
              <span className={styles.projectCategory}>
                {project.category}
              </span>

              <h2>{project.title}</h2>
            </div>

            <span
              className={styles.projectArrow}
              aria-hidden="true"
            >
              <span>→</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

type PortfolioGalleryProps = {
  projects: PublicPortfolioProject[];
};

export function PortfolioGallery({
  projects,
}: PortfolioGalleryProps) {
  const [activeFilter, setActiveFilter] =
    useState<Filter>("Усі");

  const visibleProjects =
    activeFilter === "Усі"
      ? projects
      : projects.filter(
          (project) =>
            project.category ===
            (activeFilter as PublicPortfolioCategory),
        );

  return (
    <section className={styles.portfolio}>
      <div className={`container ${styles.pageContainer}`}>
        <div className={styles.portfolioIntro}>
          <div className={styles.portfolioIndex}>
            <span className={styles.indexLabel}>ВИБРАНІ РОБОТИ</span>

            <span className={styles.indexCount}>
              {String(visibleProjects.length).padStart(2, "0")}
            </span>
          </div>

          <div
            className={styles.filters}
            role="group"
            aria-label="Фільтр робіт за категоріями"
          >
            {filters.map((filter) => {
              const isActive = activeFilter === filter;

              return (
                <button
                  key={filter}
                  type="button"
                  aria-pressed={isActive}
                  className={`${styles.filterButton} ${
                    isActive
                      ? styles.filterButtonActive
                      : ""
                  }`}
                  onClick={() => setActiveFilter(filter)}
                >
                  <span>{filter}</span>

                  <span
                    className={styles.filterLine}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </div>

        <p
          className={styles.resultsInfo}
          aria-live="polite"
        >
          {activeFilter === "Усі"
            ? `${visibleProjects.length} виконаних проєктів`
            : `${activeFilter} · ${visibleProjects.length}`}
        </p>

        <div
          key={activeFilter}
          className={styles.grid}
        >
          {visibleProjects.map((project, index) => (
            <ProjectCard
              key={`${activeFilter}-${project.slug}`}
              project={project}
              index={index}
              total={visibleProjects.length}
              filterKey={activeFilter}
            />
          ))}
        </div>

        {visibleProjects.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              У цій категорії роботи ще не додані.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}