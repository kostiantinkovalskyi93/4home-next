"use client";

import Image from "next/image";
import { useState } from "react";

import styles from "./page.module.css";

const filters = [
  "Усі",
  "Кухні",
  "Розпашні шафи",
  "Шафи-купе",
  "Інші меблі",
] as const;

type Filter = (typeof filters)[number];

type Project = {
  id: string;
  title: string;
  category: Exclude<Filter, "Усі">;
  image: string;
  alt: string;
  size: "large" | "small";
};

const projects: Project[] = [
  {
    id: "kitchen-01",
    title: "Світла кухня",
    category: "Кухні",
    image: "/images/portfolio/kitchen-01.webp",
    alt: "Світла кухня на замовлення 4HOME",
    size: "large",
  },
  {
    id: "kitchen-02",
    title: "Сучасна кухня",
    category: "Кухні",
    image: "/images/portfolio/kitchen-02.webp",
    alt: "Сучасна кухня на замовлення 4HOME",
    size: "small",
  },
  {
    id: "kitchen-03",
    title: "Кухня у світлому інтер’єрі",
    category: "Кухні",
    image: "/images/portfolio/kitchen-03.webp",
    alt: "Кухня у світлому інтер'єрі 4HOME",
    size: "small",
  },
  {
    id: "hinged-01",
    title: "Світла розпашна шафа",
    category: "Розпашні шафи",
    image: "/images/portfolio/hinged-01.webp",
    alt: "Світла розпашна шафа на замовлення 4HOME",
    size: "small",
  },
  {
    id: "hinged-02",
    title: "Вбудована шафа",
    category: "Розпашні шафи",
    image: "/images/portfolio/hinged-02.webp",
    alt: "Вбудована розпашна шафа на замовлення 4HOME",
    size: "large",
  },
  {
    id: "sliding-01",
    title: "Дзеркальна шафа-купе",
    category: "Шафи-купе",
    image: "/images/portfolio/sliding-01.webp",
    alt: "Дзеркальна шафа-купе на замовлення 4HOME",
    size: "small",
  },
  {
    id: "sliding-02",
    title: "Шафа-купе для кімнати",
    category: "Шафи-купе",
    image: "/images/portfolio/sliding-02.webp",
    alt: "Шафа-купе для кімнати 4HOME",
    size: "small",
  },
  {
    id: "furniture-01",
    title: "Консоль",
    category: "Інші меблі",
    image: "/images/portfolio/furniture-01.webp",
    alt: "Консоль на замовлення 4HOME",
    size: "small",
  },
  {
    id: "furniture-02",
    title: "ТВ-тумба",
    category: "Інші меблі",
    image: "/images/portfolio/furniture-02.webp",
    alt: "ТВ-тумба на замовлення 4HOME",
    size: "large",
  },
];

export function PortfolioGallery() {
  const [activeFilter, setActiveFilter] = useState<Filter>("Усі");

  const visibleProjects =
    activeFilter === "Усі"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

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

        <p className={styles.resultsInfo} aria-live="polite">
          {activeFilter === "Усі"
            ? `Усі роботи — ${visibleProjects.length}`
            : `${activeFilter} — ${visibleProjects.length}`}
        </p>

        <div className={styles.grid}>
          {visibleProjects.map((project) => (
            <article
              key={project.id}
              className={`${styles.projectCard} ${
                project.size === "large"
                  ? styles.projectLarge
                  : styles.projectSmall
              }`}
            >
              <div className={styles.imageWrapper}>
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 650px) 100vw, (max-width: 1000px) 50vw, 58vw"
                  className={styles.image}
                />

                <div className={styles.overlay} />

                <div className={styles.projectContent}>
                  <span className={styles.projectCategory}>
                    {project.category}
                  </span>

                  <h2>{project.title}</h2>

                  <span className={styles.projectArrow} aria-hidden="true">
                    →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}