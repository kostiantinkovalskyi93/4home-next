"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  portfolioProjects,
  type PortfolioCategory,
} from "@/data/portfolioProjects";

import styles from "./page.module.css";

const filters = [
  "Усі",
  "Кухні",
  "Розпашні шафи",
  "Шафи-купе",
  "Інші меблі",
] as const;

type Filter = (typeof filters)[number];

const LARGE_IMAGE_SIZES =
  "(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 58vw";

const SMALL_IMAGE_SIZES =
  "(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 42vw";

const FULL_IMAGE_SIZES =
  "(max-width: 650px) 100vw, 100vw";

export function PortfolioGallery() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Усі");

  const visibleProjects =
    activeFilter === "Усі"
      ? portfolioProjects
      : portfolioProjects.filter(
          (project) =>
            project.category ===
            (activeFilter as PortfolioCategory),
        );

  return (
    <section className={styles.portfolio}>
      <div className={`container ${styles.pageContainer}`}>
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
                  isActive ? styles.filterButtonActive : ""
                }`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <p
          className={styles.resultsInfo}
          aria-live="polite"
        >
          {activeFilter === "Усі"
            ? `Усі роботи — ${visibleProjects.length}`
            : `${activeFilter} — ${visibleProjects.length}`}
        </p>

        <div className={styles.grid}>
          {visibleProjects.map((project, index) => {
            const isLast =
              index === visibleProjects.length - 1;

            const isLastUnpaired =
              isLast &&
              visibleProjects.length % 2 !== 0;

            const positionInPair = index % 2;
            const pairIndex = Math.floor(index / 2);

            const isLarge =
              pairIndex % 2 === 0
                ? positionInPair === 0
                : positionInPair === 1;

            const cardClassName = isLastUnpaired
              ? `${styles.projectCard} ${styles.projectFull}`
              : `${styles.projectCard} ${
                  isLarge
                    ? styles.projectLarge
                    : styles.projectSmall
                }`;

            const imageSizes = isLastUnpaired
              ? FULL_IMAGE_SIZES
              : isLarge
                ? LARGE_IMAGE_SIZES
                : SMALL_IMAGE_SIZES;

            return (
              <Link
                key={project.slug}
                href={`/portfolio/${project.slug}`}
                className={cardClassName}
              >
                <div className={styles.imageWrapper}>
                  <Image
                    src={project.coverImage}
                    alt={
                      project.images[0]?.alt ??
                      project.title
                    }
                    fill
                    sizes={imageSizes}
                    className={styles.image}
                  />

                  <div className={styles.overlay} />

                  <div
                    className={styles.projectContent}
                  >
                    <span
                      className={styles.projectCategory}
                    >
                      {project.category}
                    </span>

                    <h2>{project.title}</h2>

                    <span
                      className={styles.projectArrow}
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}