"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<CategoryFilter>("Усі");

  const [status, setStatus] = useState<
    "all" | "published" | "draft"
  >("all");

  const [actionProjectId, setActionProjectId] =
    useState<string | null>(null);

  const [deleteProject, setDeleteProject] =
    useState<AdminPortfolioProject | null>(null);

  const [deletingProjectId, setDeletingProjectId] =
    useState<string | null>(null);

  const [deleteError, setDeleteError] = useState("");

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

  const openDeleteConfirmation = (
    project: AdminPortfolioProject,
  ) => {
    setActionProjectId(null);
    setDeleteError("");
    setDeleteProject(project);
  };

  const closeDeleteConfirmation = () => {
    if (deletingProjectId) {
      return;
    }

    setDeleteError("");
    setDeleteProject(null);
  };

  const handleDeleteProject = async () => {
    if (!deleteProject || deletingProjectId) {
      return;
    }

    setDeletingProjectId(deleteProject.id);
    setDeleteError("");

    try {
      const response = await fetch(
        "/admin/api/portfolio-project/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId: deleteProject.id,
          }),
        },
      );

      const result = (await response
        .json()
        .catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok || !result?.ok) {
        throw new Error(
          result?.error ||
            "Не вдалося видалити роботу.",
        );
      }

      setDeleteProject(null);
      router.refresh();
    } catch (error) {
      console.error(
        "Failed to delete portfolio project:",
        error,
      );

      setDeleteError(
        error instanceof Error
          ? error.message
          : "Не вдалося видалити роботу.",
      );
    } finally {
      setDeletingProjectId(null);
    }
  };

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
          <Link
            href="/admin/profile"
            className={styles.avatar}
            aria-label="Відкрити профіль адміністратора"
            title="Профіль"
          >
            К
          </Link>

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
          {projects.map((project) => {
            const actionsOpen =
              actionProjectId === project.id;

            return (
              <article
                className={styles.card}
                key={project.id}
              >
                <Link
                  href={`/admin/portfolio/${project.id}/edit`}
                  className={styles.cardLink}
                  aria-label={`Редагувати роботу: ${project.title}`}
                >
                  <div className={styles.imageWrap}>
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 580px) calc(100vw - 36px), (max-width: 1000px) 50vw, (max-width: 1250px) 33vw, 25vw"
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.emptyCover}>
                        <ImageIcon />
                        <span>Фото ще не додано</span>
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
                </Link>

                <div className={styles.cardBody}>
                  <div className={styles.cardTitleRow}>
                    <Link
                      href={`/admin/portfolio/${project.id}/edit`}
                      className={styles.cardTitleLink}
                    >
                      <h2>{project.title}</h2>
                    </Link>

                    <div className={styles.actionsWrap}>
                      <button
                        type="button"
                        className={styles.moreButton}
                        aria-label={`Дії з роботою: ${project.title}`}
                        aria-haspopup="menu"
                        aria-expanded={actionsOpen}
                        onClick={() =>
                          setActionProjectId(
                            actionsOpen
                              ? null
                              : project.id,
                          )
                        }
                      >
                        <MoreIcon />
                      </button>

                      {actionsOpen ? (
                        <div
                          className={styles.actionsMenu}
                          role="menu"
                        >
                          <button
                            type="button"
                            role="menuitem"
                            className={styles.deleteMenuItem}
                            onClick={() =>
                              openDeleteConfirmation(project)
                            }
                          >
                            Видалити роботу
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <p>
                    {project.category}
                    <span> • </span>
                    {project.year ?? "Рік не вказано"}
                  </p>

                  <div className={styles.meta}>
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
              </article>
            );
          })}
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

      {deleteProject ? (
        <div
          className={styles.modalBackdrop}
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteConfirmation();
            }
          }}
        >
          <div
            className={styles.deleteDialog}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-project-title"
            aria-describedby="delete-project-description"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                closeDeleteConfirmation();
              }
            }}
          >
            <span className={styles.deleteEyebrow}>
              НЕЗВОРОТНА ДІЯ
            </span>

            <h2 id="delete-project-title">
              Видалити роботу?
            </h2>

            <p
              id="delete-project-description"
              className={styles.deleteDescription}
            >
              Роботу{" "}
              <strong>
                «{deleteProject.title}»
              </strong>{" "}
              буде видалено разом із її фото та відео.
            </p>

            {deleteProject.status === "published" ? (
              <p className={styles.publishedWarning}>
                Ця робота зараз опублікована. Після
                видалення вона одразу зникне з
                публічного портфоліо.
              </p>
            ) : null}

            <p className={styles.deletePermanent}>
              Відновити видалену роботу через CMS
              буде неможливо.
            </p>

            {deleteError ? (
              <div
                className={styles.deleteError}
                role="alert"
              >
                {deleteError}
              </div>
            ) : null}

            <div className={styles.deleteDialogActions}>
              <button
                type="button"
                className={styles.cancelDeleteButton}
                disabled={Boolean(deletingProjectId)}
                onClick={closeDeleteConfirmation}
              >
                Скасувати
              </button>

              <button
                type="button"
                className={styles.confirmDeleteButton}
                disabled={Boolean(deletingProjectId)}
                aria-busy={Boolean(deletingProjectId)}
                onClick={handleDeleteProject}
              >
                {deletingProjectId
                  ? "Видаляємо…"
                  : "Так, видалити назавжди"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}