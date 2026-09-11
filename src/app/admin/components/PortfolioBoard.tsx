"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useMemo,
  useState,
} from "react";

import type {
  AdminPortfolioProject,
  AdminProjectCategory,
} from "../portfolio-projects";

import {
  ImageIcon,
  MoreIcon,
  PlusIcon,
  SearchIcon,
  VideoIcon,
} from "./AdminIcons";

import styles from "./PortfolioBoard.module.css";

type CategoryFilter =
  | "Усі"
  | AdminProjectCategory;

type PortfolioBoardProps = {
  projects: AdminPortfolioProject[];
};

const categoryFilters: CategoryFilter[] = [
  "Усі",
  "Кухні",
  "Шафи",
  "Інші меблі",
];

export function PortfolioBoard({
  projects: sourceProjects,
}: PortfolioBoardProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<CategoryFilter>("Усі");

  const [status, setStatus] = useState<
    "all" | "published" | "draft"
  >("all");

  const projects = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLocaleLowerCase("uk");

    return sourceProjects.filter(
      (project) => {
        const searchableText =
          `${project.title} ${project.category}`
            .toLocaleLowerCase("uk");

        const matchesQuery =
          !normalizedQuery ||
          searchableText.includes(
            normalizedQuery,
          );

        const matchesCategory =
          category === "Усі" ||
          project.category === category;

        const matchesStatus =
          status === "all" ||
          project.status === status;

        return (
          matchesQuery &&
          matchesCategory &&
          matchesStatus
        );
      },
    );
  }, [
    sourceProjects,
    query,
    category,
    status,
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.topbar}>
        <label className={styles.search}>
          <SearchIcon />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Пошук за назвою, категорією..."
            aria-label="Пошук робіт"
            autoComplete="off"
          />
        </label>

        <div className={styles.profile}>
          <span className={styles.avatar}>
            К
          </span>

          <span>
            <strong>Костянтин</strong>
            <small>Адміністратор</small>
          </span>
        </div>
      </div>

      <section className={styles.panel}>
        <header
          className={styles.headingRow}
        >
          <div>
            <h1>Портфоліо</h1>
            <p>Керуйте вашими роботами</p>
          </div>

          <Link
            href="/admin/portfolio/new"
            className={styles.addButton}
          >
            <PlusIcon />
            Додати роботу
          </Link>
        </header>

        <div className={styles.controls}>
          <div className={styles.tabs}>
            {categoryFilters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  setCategory(item)
                }
                className={
                  category === item
                    ? styles.tabActive
                    : styles.tab
                }
                aria-pressed={
                  category === item
                }
              >
                {item}
              </button>
            ))}
          </div>

          <select
            className={styles.select}
            value={status}
            onChange={(event) =>
              setStatus(
                event.target
                  .value as typeof status,
              )
            }
            aria-label="Фільтр за статусом"
          >
            <option value="all">
              Усі статуси
            </option>

            <option value="published">
              Опубліковано
            </option>

            <option value="draft">
              Чернетка
            </option>
          </select>
        </div>

        <div className={styles.grid}>
          {projects.map((project) => (
            <Link
              href={`/admin/portfolio/${project.id}/edit`}
              className={styles.card}
              key={project.id}
              aria-label={`Редагувати роботу: ${project.title}`}
            >
              <div
                className={styles.imageWrap}
              >
                {project.coverImage ? (
                  <Image
                    src={project.coverImage}
                    alt={project.title}
                    fill
                    sizes="(max-width: 580px) calc(100vw - 36px), (max-width: 1000px) 50vw, (max-width: 1250px) 33vw, 25vw"
                    className={styles.image}
                  />
                ) : (
                  <div
                    className={
                      styles.emptyCover
                    }
                  >
                    <ImageIcon />

                    <span>
                      Фото ще не додано
                    </span>
                  </div>
                )}

                <span
                  className={`${styles.status} ${
                    project.status === "draft"
                      ? styles.draft
                      : styles.published
                  }`}
                >
                  {project.status === "draft"
                    ? "Чернетка"
                    : "Опубліковано"}
                </span>
              </div>

              <div
                className={styles.cardBody}
              >
                <div
                  className={
                    styles.cardTitleRow
                  }
                >
                  <h2>{project.title}</h2>

                  <span
                    className={styles.more}
                    aria-hidden="true"
                  >
                    <MoreIcon />
                  </span>
                </div>

                <p>
                  {project.category}
                  <span> • </span>
                  {project.year ?? "Рік не вказано"}
                </p>

                <div
                  className={styles.meta}
                >
                  <span>
                    <ImageIcon />
                    {project.photoCount}
                  </span>

                  <span>
                    <VideoIcon />
                    {project.videoCount}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {projects.length === 0 && (
          sourceProjects.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <ImageIcon />
              </div>

              <strong>Поки немає робіт</strong>

              <p>
                Додайте перший проєкт — після збереження він з’явиться тут.
              </p>

              <Link
                href="/admin/portfolio/new"
                className={styles.emptyStateAction}
              >
                <PlusIcon />
                Додати роботу
              </Link>
            </div>
          ) : (
            <div className={styles.empty}>
              За цими параметрами робіт не
              знайдено.
            </div>
          )
        )}
      </section>
    </div>
  );
}