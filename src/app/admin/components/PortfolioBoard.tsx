"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  useMemo,
  useRef,
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

type CategoryFilter = "Усі" | AdminProjectCategory;

type PortfolioBoardProps = {
  projects: AdminPortfolioProject[];
};

type Point = {
  x: number;
  y: number;
};

type DragSession = {
  pointerId: number;
  activeId: string;
  sourceIndex: number;
  targetIndex: number;
  startPointer: Point;
  activeRect: DOMRect;
  slotRects: DOMRect[];
  visibleIds: string[];
};

const categoryFilters: CategoryFilter[] = [
  "Усі",
  "Кухні",
  "Шафи",
  "Інші меблі",
];

function moveItem<T>(
  items: T[],
  sourceIndex: number,
  targetIndex: number,
) {
  const next = [...items];
  const [moved] = next.splice(sourceIndex, 1);

  next.splice(targetIndex, 0, moved);

  return next;
}

function getStableTargetIndex(
  x: number,
  y: number,
  rects: DOMRect[],
  currentIndex: number,
) {
  const distances = rects.map((rect) => {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return Math.hypot(centerX - x, centerY - y);
  });

  let nearestIndex = currentIndex;
  let nearestDistance =
    distances[currentIndex] ?? Number.POSITIVE_INFINITY;

  distances.forEach((distance, index) => {
    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestIndex = index;
    }
  });

  if (nearestIndex === currentIndex) {
    return currentIndex;
  }

  const currentDistance =
    distances[currentIndex] ?? Number.POSITIVE_INFINITY;
  const hysteresisPx = 18;

  return nearestDistance + hysteresisPx < currentDistance
    ? nearestIndex
    : currentIndex;
}

function DragHandleIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      fill="currentColor"
    >
      <circle cx="6" cy="5" r="1.35" />
      <circle cx="14" cy="5" r="1.35" />
      <circle cx="6" cy="10" r="1.35" />
      <circle cx="14" cy="10" r="1.35" />
      <circle cx="6" cy="15" r="1.35" />
      <circle cx="14" cy="15" r="1.35" />
    </svg>
  );
}

function PortfolioBoardState({
  projects: sourceProjects,
}: PortfolioBoardProps) {
  const router = useRouter();

  const [allProjects, setAllProjects] =
    useState(sourceProjects);

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

  const [savingOrder, setSavingOrder] = useState(false);
  const [reorderError, setReorderError] = useState("");

  const [activeDragId, setActiveDragId] =
    useState<string | null>(null);

  const [activeDragOffset, setActiveDragOffset] =
    useState<Point>({ x: 0, y: 0 });

  const [previewTransforms, setPreviewTransforms] =
    useState<Record<string, Point>>({});

  const cardRefs = useRef(
    new Map<string, HTMLElement>(),
  );

  const dragSessionRef =
    useRef<DragSession | null>(null);


  const projects = useMemo(() => {
    const normalizedQuery = query
      .trim()
      .toLocaleLowerCase("uk");

    return allProjects.filter((project) => {
      const searchableText =
        `${project.title} ${project.category}`
          .toLocaleLowerCase("uk");

      const matchesQuery =
        !normalizedQuery ||
        searchableText.includes(normalizedQuery);

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
    });
  }, [allProjects, query, category, status]);

  const reorderEnabled =
    !savingOrder &&
    query.trim() === "" &&
    category === "Усі" &&
    status === "all";

  const resetDragVisuals = () => {
    dragSessionRef.current = null;
    setActiveDragId(null);
    setActiveDragOffset({ x: 0, y: 0 });
    setPreviewTransforms({});
  };

  const updatePreviewTransforms = (
    session: DragSession,
    targetIndex: number,
  ) => {
    const previewIds = moveItem(
      session.visibleIds,
      session.sourceIndex,
      targetIndex,
    );

    const nextTransforms: Record<string, Point> = {};

    session.visibleIds.forEach((id, originalIndex) => {
      if (id === session.activeId) {
        return;
      }

      const previewIndex = previewIds.indexOf(id);

      if (previewIndex === originalIndex) {
        return;
      }

      const from = session.slotRects[originalIndex];
      const to = session.slotRects[previewIndex];

      nextTransforms[id] = {
        x: to.left - from.left,
        y: to.top - from.top,
      };
    });

    setPreviewTransforms(nextTransforms);
  };

  const handleDragStart = (
    event: ReactPointerEvent<HTMLButtonElement>,
    projectId: string,
  ) => {
    if (!reorderEnabled || event.button !== 0) {
      return;
    }

    const visibleIds = projects.map(
      (project) => project.id,
    );

    const sourceIndex = visibleIds.indexOf(projectId);

    if (sourceIndex < 0) {
      return;
    }

    const slotRects = visibleIds.map((id) => {
      const node = cardRefs.current.get(id);

      if (!node) {
        throw new Error(
          `Missing portfolio card ref for ${id}`,
        );
      }

      return node.getBoundingClientRect();
    });

    event.preventDefault();
    setReorderError("");
    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    const session: DragSession = {
      pointerId: event.pointerId,
      activeId: projectId,
      sourceIndex,
      targetIndex: sourceIndex,
      startPointer: {
        x: event.clientX,
        y: event.clientY,
      },
      activeRect: slotRects[sourceIndex],
      slotRects,
      visibleIds,
    };

    dragSessionRef.current = session;
    setActionProjectId(null);
    setActiveDragId(projectId);
    setActiveDragOffset({ x: 0, y: 0 });
    setPreviewTransforms({});
  };

  const handleDragMove = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    const session = dragSessionRef.current;

    if (
      !session ||
      session.pointerId !== event.pointerId
    ) {
      return;
    }

    event.preventDefault();

    const offset = {
      x: event.clientX - session.startPointer.x,
      y: event.clientY - session.startPointer.y,
    };

    setActiveDragOffset(offset);

    const draggedCenterX =
      session.activeRect.left +
      session.activeRect.width / 2 +
      offset.x;
    const draggedCenterY =
      session.activeRect.top +
      session.activeRect.height / 2 +
      offset.y;

    const targetIndex = getStableTargetIndex(
      draggedCenterX,
      draggedCenterY,
      session.slotRects,
      session.targetIndex,
    );

    if (targetIndex === session.targetIndex) {
      return;
    }

    session.targetIndex = targetIndex;
    updatePreviewTransforms(session, targetIndex);
  };

  const persistProjectOrder = async (
    nextProjects: AdminPortfolioProject[],
    previousProjects: AdminPortfolioProject[],
  ) => {
    setSavingOrder(true);
    setReorderError("");

    try {
      const response = await fetch(
        "/admin/api/portfolio-project/reorder",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectIds: nextProjects.map(
              (project) => project.id,
            ),
          }),
        },
      );

      const result = (await response
        .json()
        .catch(() => null)) as
        | {
            ok?: boolean;
            updatedCount?: number;
            error?: string;
          }
        | null;

      if (
        !response.ok ||
        !result?.ok ||
        result.updatedCount !== nextProjects.length
      ) {
        throw new Error(
          result?.error ||
            "Не вдалося зберегти порядок робіт.",
        );
      }

      router.refresh();
    } catch (error) {
      console.error(
        "Failed to save portfolio project order:",
        error,
      );

      setAllProjects(previousProjects);
      setReorderError(
        error instanceof Error
          ? error.message
          : "Не вдалося зберегти порядок робіт.",
      );
    } finally {
      setSavingOrder(false);
    }
  };

  const handleDragEnd = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    const session = dragSessionRef.current;

    if (
      !session ||
      session.pointerId !== event.pointerId
    ) {
      return;
    }

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    const { sourceIndex, targetIndex } = session;

    if (sourceIndex === targetIndex) {
      resetDragVisuals();
      return;
    }

    const visualRects = new Map<string, DOMRect>();
    const transitionSnapshots = new Map<string, string>();

    session.visibleIds.forEach((id) => {
      const node = cardRefs.current.get(id);

      if (!node) {
        return;
      }

      visualRects.set(id, node.getBoundingClientRect());
      transitionSnapshots.set(id, node.style.transition);

      // Prevent the CSS transform transition from competing with
      // the FLIP commit when React moves the cards in the DOM.
      node.style.transition = "none";
    });

    const previousProjects = allProjects;

    const nextProjects = moveItem(
      previousProjects,
      sourceIndex,
      targetIndex,
    ).map((project, index) => ({
      ...project,
      sortOrder: index,
    }));

    flushSync(() => {
      setAllProjects(nextProjects);
      resetDragVisuals();
    });

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    session.visibleIds.forEach((id) => {
      const before = visualRects.get(id);
      const node = cardRefs.current.get(id);

      if (!before || !node) {
        return;
      }

      const restoreTransition = () => {
        node.style.transition =
          transitionSnapshots.get(id) ?? "";
      };

      if (reduceMotion) {
        restoreTransition();
        return;
      }

      const after = node.getBoundingClientRect();
      const deltaX = before.left - after.left;
      const deltaY = before.top - after.top;

      if (
        Math.abs(deltaX) < 0.5 &&
        Math.abs(deltaY) < 0.5
      ) {
        restoreTransition();
        return;
      }

      const animation = node.animate(
        [
          {
            transform: `translate3d(${deltaX}px, ${deltaY}px, 0)`,
          },
          {
            transform: "translate3d(0, 0, 0)",
          },
        ],
        {
          duration: 150,
          easing: "cubic-bezier(0.2, 0.8, 0.2, 1)",
        },
      );

      animation.finished
        .catch(() => undefined)
        .finally(restoreTransition);
    });

    void persistProjectOrder(
      nextProjects,
      previousProjects,
    );
  };

  const handleDragCancel = (
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => {
    const session = dragSessionRef.current;

    if (
      !session ||
      session.pointerId !== event.pointerId
    ) {
      return;
    }

    resetDragVisuals();
  };

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
        <header className={styles.headingRow}>
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
                onClick={() => setCategory(item)}
                className={
                  category === item
                    ? styles.tabActive
                    : styles.tab
                }
                aria-pressed={category === item}
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
                event.target.value as typeof status,
              )
            }
            aria-label="Фільтр за статусом"
          >
            <option value="all">Усі статуси</option>
            <option value="published">
              Опубліковано
            </option>
            <option value="draft">Чернетка</option>
          </select>
        </div>

        {reorderError ? (
          <div
            className={styles.deleteError}
            role="alert"
          >
            {reorderError}
          </div>
        ) : null}

        <div className={styles.grid}>
          {projects.map((project) => {
            const actionsOpen =
              actionProjectId === project.id;

            const isActive =
              activeDragId === project.id;

            const previewTransform =
              previewTransforms[project.id];

            const dragStyle: CSSProperties | undefined =
              isActive
                ? {
                    transform: `translate3d(${activeDragOffset.x}px, ${activeDragOffset.y}px, 0)`,
                    zIndex: 50,
                  }
                : previewTransform
                  ? {
                      transform: `translate3d(${previewTransform.x}px, ${previewTransform.y}px, 0)`,
                    }
                  : undefined;

            return (
              <article
                className={`${styles.card} ${
                  isActive ? styles.cardDragging : ""
                }`}
                key={project.id}
                ref={(node) => {
                  if (node) {
                    cardRefs.current.set(
                      project.id,
                      node,
                    );
                  } else {
                    cardRefs.current.delete(
                      project.id,
                    );
                  }
                }}
                style={dragStyle}
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

                <button
                  type="button"
                  className={styles.dragHandle}
                  aria-label={`Змінити позицію роботи: ${project.title}`}
                  title={
                    savingOrder
                      ? "Зберігаємо порядок…"
                      : reorderEnabled
                        ? "Перетягнути роботу"
                        : "Очистіть фільтри для зміни порядку"
                  }
                  disabled={!reorderEnabled}
                  onPointerDown={(event) =>
                    handleDragStart(
                      event,
                      project.id,
                    )
                  }
                  onPointerMove={handleDragMove}
                  onPointerUp={handleDragEnd}
                  onPointerCancel={handleDragCancel}
                >
                  <DragHandleIcon />
                </button>

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
                            className={
                              styles.deleteMenuItem
                            }
                            onClick={() =>
                              openDeleteConfirmation(
                                project,
                              )
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

        {projects.length === 0 &&
          (allProjects.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyStateIcon}>
                <ImageIcon />
              </div>

              <strong>Поки немає робіт</strong>

              <p>
                Додайте перший проєкт — після
                збереження він з’явиться тут.
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
              За цими параметрами робіт не знайдено.
            </div>
          ))}
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
              Роботу <strong>«{deleteProject.title}»</strong>{" "}
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
              Відновити видалену роботу через CMS буде
              неможливо.
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

export function PortfolioBoard({
  projects,
}: PortfolioBoardProps) {
  const stateKey = projects
    .map((project) =>
      [
        project.id,
        project.sortOrder,
        project.title,
        project.category,
        project.year ?? "",
        project.status,
        project.coverImage ?? "",
        project.photoCount,
        project.videoCount,
      ].join(":"),
    )
    .join("|");

  return (
    <PortfolioBoardState
      key={stateKey}
      projects={projects}
    />
  );
}
