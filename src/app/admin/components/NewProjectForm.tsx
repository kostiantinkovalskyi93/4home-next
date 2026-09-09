"use client";

/* eslint-disable @next/next/no-img-element */

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import { Upload } from "tus-js-client";

import { createClient } from "@/lib/supabase/client";
import {
  shouldTranscodeVideo,
  transcodeVideoForWeb,
} from "@/lib/video-transcode";

import {
  ArrowLeftIcon,
  ImageIcon,
  PlusIcon,
  VideoIcon,
} from "./AdminIcons";

import styles from "./NewProjectForm.module.css";

type MediaItem = {
  id: string;
  name: string;
  type: "photo" | "video";
  url: string;
  size: number | null;
  source: "local" | "stored";
  file?: File;
  originalPath?: string;
  webPath?: string | null;
  cardPath?: string | null;
  sortOrder?: number;
  isCover?: boolean;
  processingStatus?: "pending" | "processing" | "ready" | "failed";
  focalX?: number;
  focalY?: number;
  cropZoom?: number;
  uploadProgress?: number;
  processingLabel?: string;
  preparedFile?: File;
};

export type StoredPortfolioMedia = {
  id: string;
  name: string;
  type: "photo" | "video";
  url: string;
  originalPath?: string;
  webPath: string | null;
  cardPath: string | null;
  sortOrder: number;
  isCover: boolean;
  processingStatus: "pending" | "processing" | "ready" | "failed";
  focalX: number;
  focalY: number;
  cropZoom: number;
  size?: number | null;
};

type SpecificationItem = {
  id: string;
  label: string;
  value: string;
};

type ProjectCategory =
  | "kitchen"
  | "wardrobe"
  | "furniture";

type WardrobeType =
  | "hinged"
  | "sliding";

type SaveStatus =
  | "idle"
  | "saving"
  | "saved"
  | "error";

type InitialProject = {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  wardrobe_type: WardrobeType | null;
  short_description: string;
  materials: unknown;
  hardware: unknown;
  features: string | null;
  year: number | null;
  location: string | null;
  color: string | null;
  production_term: string | null;
  status: "draft" | "published";
};

type NewProjectFormProps = {
  initialProject?: InitialProject;
  initialMedia?: StoredPortfolioMedia[];
};

const initialMaterials: SpecificationItem[] = [
  {
    id: "material-facades",
    label: "Фасади",
    value: "",
  },
  {
    id: "material-body",
    label: "Корпус",
    value: "",
  },
  {
    id: "material-worktop",
    label: "Стільниця",
    value: "",
  },
];

const initialHardware: SpecificationItem[] = [
  {
    id: "hardware-hinges",
    label: "Петлі",
    value: "",
  },
  {
    id: "hardware-guides",
    label: "Напрямні",
    value: "",
  },
];

function formatMb(size: number) {
  return `${(size / 1024 / 1024).toFixed(1)} МБ`;
}

function getFileExtension(fileName: string) {
  const match = fileName
    .trim()
    .toLowerCase()
    .match(/\.([a-z0-9]+)$/);

  return match?.[1] ?? "";
}

function isSupportedVideoFile(file: File) {
  const extension = getFileExtension(file.name);

  return (
    file.type === "video/mp4" ||
    file.type === "video/webm" ||
    file.type === "video/quicktime" ||
    extension === "mp4" ||
    extension === "webm" ||
    extension === "mov"
  );
}


function createEmptySpecification(
  prefix: "material" | "hardware",
): SpecificationItem {
  return {
    id: `${prefix}-${crypto.randomUUID()}`,
    label: "",
    value: "",
  };
}

function normalizeSpecifications(
  items: SpecificationItem[],
) {
  return items
    .map((item) => ({
      label: item.label.trim(),
      value: item.value.trim(),
    }))
    .filter(
      (item) =>
        item.label.length > 0 ||
        item.value.length > 0,
    );
}

function parseSpecifications(
  value: unknown,
  fallback: SpecificationItem[],
  prefix: "material" | "hardware",
): SpecificationItem[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .filter(
      (
        item,
      ): item is {
        label?: unknown;
        value?: unknown;
      } =>
        typeof item === "object" &&
        item !== null,
    )
    .map((item) => ({
      id: `${prefix}-${crypto.randomUUID()}`,
      label:
        typeof item.label === "string"
          ? item.label
          : "",
      value:
        typeof item.value === "string"
          ? item.value
          : "",
    }));

  return items.length > 0
    ? items
    : fallback;
}

function createSlug(title: string) {
  const transliteration: Record<string, string> = {
    а: "a",
    б: "b",
    в: "v",
    г: "h",
    ґ: "g",
    д: "d",
    е: "e",
    є: "ye",
    ж: "zh",
    з: "z",
    и: "y",
    і: "i",
    ї: "yi",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "kh",
    ц: "ts",
    ч: "ch",
    ш: "sh",
    щ: "shch",
    ь: "",
    ю: "yu",
    я: "ya",
    "'": "",
    "’": "",
  };

  const normalized = title
    .trim()
    .toLocaleLowerCase("uk")
    .split("")
    .map(
      (character) =>
        transliteration[character] ??
        character,
    )
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const baseSlug =
    normalized || "project";

  return `${baseSlug}-${crypto
    .randomUUID()
    .slice(0, 8)}`;
}

export function NewProjectForm({
  initialProject,
  initialMedia = [],
}: NewProjectFormProps) {
  const router = useRouter();
  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const isEditMode = Boolean(initialProject);

  const [title, setTitle] = useState(
    initialProject?.title ?? "",
  );

  const [category, setCategory] =
    useState<ProjectCategory>(
      initialProject?.category ?? "kitchen",
    );

  const [wardrobeType, setWardrobeType] =
    useState<WardrobeType>(
      initialProject?.wardrobe_type ??
        "hinged",
    );

  const [
    shortDescription,
    setShortDescription,
  ] = useState(
    initialProject?.short_description ?? "",
  );

  const [features, setFeatures] = useState(
    initialProject?.features ?? "",
  );

  const [year, setYear] = useState(
    initialProject?.year == null
      ? ""
      : String(initialProject.year),
  );
  const [location, setLocation] = useState(
    initialProject?.location ?? "",
  );
  const [color, setColor] = useState(
    initialProject?.color ?? "",
  );
  const [productionTerm, setProductionTerm] =
    useState(
      initialProject?.production_term ?? "",
    );

  const [projectStatus, setProjectStatus] =
    useState<"draft" | "published">(
      initialProject?.status ?? "draft",
    );

  const [projectId, setProjectId] =
    useState<string | null>(
      initialProject?.id ?? null,
    );

  const [projectSlug, setProjectSlug] =
    useState<string | null>(
      initialProject?.slug ?? null,
    );

  const [saveStatus, setSaveStatus] =
    useState<SaveStatus>("idle");

  const saveInFlightRef = useRef(false);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [media, setMedia] =
    useState<MediaItem[]>(() =>
      initialMedia.map((item) => ({
        ...item,
        size: null,
        source: "stored" as const,
      })),
    );

  const [cropMediaId, setCropMediaId] =
    useState<string | null>(null);

  const [cropPoint, setCropPoint] = useState({
    x: 0.5,
    y: 0.5,
  });

  const [cropZoom, setCropZoom] = useState(1);

  const [cropImageSize, setCropImageSize] = useState({
    width: 0,
    height: 0,
  });

  const [cropViewportSize, setCropViewportSize] =
    useState({
      width: 0,
      height: 0,
    });

  const [isCropDragging, setIsCropDragging] =
    useState(false);

  const [draggedMediaId, setDraggedMediaId] =
    useState<string | null>(null);

  const [cropDragStart, setCropDragStart] =
    useState<{
      pointerX: number;
      pointerY: number;
      focalX: number;
      focalY: number;
    } | null>(null);

  const [materials, setMaterials] =
    useState<SpecificationItem[]>(() =>
      initialProject
        ? parseSpecifications(
            initialProject.materials,
            initialMaterials,
            "material",
          )
        : initialMaterials,
    );

  const [hardware, setHardware] =
    useState<SpecificationItem[]>(() =>
      initialProject
        ? parseSpecifications(
            initialProject.hardware,
            initialHardware,
            "hardware",
          )
        : initialHardware,
    );

  const videoCount = media.filter(
    (item) => item.type === "video",
  ).length;

  const photoCount = media.filter(
    (item) => item.type === "photo",
  ).length;

  const incompletePhotoCount = media.filter(
    (item) =>
      item.type === "photo" &&
      item.source === "stored" &&
      item.processingStatus !== "ready",
  ).length;

  const canAddVideo = videoCount < 2;

  const isMediaProcessing = media.some(
    (item) =>
      item.source === "local" &&
      item.processingStatus === "processing",
  );

  const hasFailedLocalMedia = media.some(
    (item) =>
      item.source === "local" &&
      item.processingStatus === "failed",
  );

  const accepted = useMemo(
    () =>
      "image/jpeg,image/png,video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov",
    [],
  );

  const markAsChanged = () => {
    if (
      saveStatus === "saved" ||
      saveStatus === "error"
    ) {
      setSaveStatus("idle");
      setSaveMessage("");
    }
  };

  const handleTitleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setTitle(event.target.value);
    markAsChanged();
  };

  const handleCategoryChange = (
    nextCategory: ProjectCategory,
  ) => {
    setCategory(nextCategory);
    markAsChanged();
  };

  const handleDescriptionChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setShortDescription(event.target.value);
    markAsChanged();
  };

  const handleFeaturesChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setFeatures(event.target.value);
    markAsChanged();
  };

  const handleYearChange = (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    setYear(event.target.value);
    markAsChanged();
  };

  const prepareLocalMedia = async (item: MediaItem) => {
    const file = item.file;

    if (!file) return;

    setMedia((current) =>
      current.map((currentItem) =>
        currentItem.id === item.id
          ? {
              ...currentItem,
              processingStatus: "processing",
              uploadProgress: 0,
              processingLabel:
                item.type === "video" && shouldTranscodeVideo(file)
                  ? "Оптимізація 0%"
                  : "Підготовка…",
            }
          : currentItem,
      ),
    );

    try {
      let preparedFile = file;

      if (item.type === "video" && shouldTranscodeVideo(file)) {
        preparedFile = await transcodeVideoForWeb(
          file,
          (progress) => {
            setMedia((current) =>
              current.map((currentItem) =>
                currentItem.id === item.id
                  ? {
                      ...currentItem,
                      uploadProgress: progress,
                      processingLabel: `Оптимізація ${progress}%`,
                    }
                  : currentItem,
              ),
            );
          },
        );
      } else if (item.type === "photo") {
        const bitmap = await createImageBitmap(file);
        bitmap.close();
      }

      setMedia((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                preparedFile,
                processingStatus: "ready",
                uploadProgress: 100,
                processingLabel: "Готово до збереження",
              }
            : currentItem,
        ),
      );
    } catch (error) {
      console.error("Local media preparation failed:", error);

      setMedia((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                preparedFile: undefined,
                processingStatus: "failed",
                uploadProgress: undefined,
                processingLabel: "Не вдалося підготувати файл",
              }
            : currentItem,
        ),
      );

      setSaveStatus("error");
      setSaveMessage(
        `Не вдалося підготувати "${file.name}". Видаліть файл і спробуйте додати його ще раз.`,
      );
    }
  };

  const retryLocalMediaPreparation = (id: string) => {
    const target = media.find(
      (item) =>
        item.id === id &&
        item.source === "local" &&
        item.processingStatus === "failed",
    );

    if (!target) return;

    setSaveStatus("idle");
    setSaveMessage("");
    void prepareLocalMedia(target);
  };

  const handleFiles = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(
      event.target.files ?? [],
    );

    if (!files.length) return;

    const next: MediaItem[] = [];
    let remainingVideos = 2 - videoCount;

    for (const file of files) {
      const isVideo = isSupportedVideoFile(file);
      const isPhoto =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        /\.(jpe?g|png)$/i.test(file.name);

      if (!isVideo && !isPhoto) {
        setSaveStatus("error");
        setSaveMessage(
          `"${file.name}" не підтримується. Дозволено JPG, PNG, MP4, WebM та MOV.`,
        );
        continue;
      }

      if (isVideo && remainingVideos <= 0) {
        setSaveStatus("error");
        setSaveMessage(
          "До одного проєкту можна додати максимум 2 відео.",
        );
        continue;
      }

      if (isVideo && file.size > 100 * 1024 * 1024) {
        setSaveStatus("error");
        setSaveMessage(
          `"${file.name}" перевищує ліміт 100 MB.`,
        );
        continue;
      }

      if (isVideo) remainingVideos -= 1;

      next.push({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        name: file.name,
        type: isVideo ? "video" : "photo",
        url: URL.createObjectURL(file),
        size: file.size,
        source: "local",
        file,
        processingStatus: "processing",
        uploadProgress: 0,
        processingLabel: "Підготовка…",
      });
    }

    if (next.length) {
      setMedia((current) => [...current, ...next]);
      setSaveStatus("idle");
      setSaveMessage("");

      void (async () => {
        for (const item of next) {
          await prepareLocalMedia(item);
        }
      })();
    }

    event.target.value = "";
  };

  const removeMedia = async (id: string) => {
    const target = media.find(
      (item) => item.id === id,
    );

    if (!target) {
      return;
    }

    if (saveStatus === "saving") {
      setSaveStatus("error");
      setSaveMessage("Дочекайтеся завершення поточної операції з медіа.");
      return;
    }

    if (target.source === "local") {
      URL.revokeObjectURL(target.url);

      setMedia((current) =>
        current.filter((item) => item.id !== id),
      );

      markAsChanged();
      return;
    }

    const isStoredVideo =
      target.type === "video" &&
      target.source === "stored";

    if (
      !window.confirm(
        isStoredVideo
          ? `Видалити "${target.name}"? Відео буде видалене з проєкту та сховища.`
          : `Видалити "${target.name}"? Фото буде видалене з проєкту та сховища.`,
      )
    ) {
      return;
    }

    setSaveStatus("saving");
    setSaveMessage(
      isStoredVideo
        ? "Видаляємо відео…"
        : "Видаляємо фото…",
    );

    try {
      const response = await fetch(
        isStoredVideo
          ? "/admin/api/portfolio-media/delete-video"
          : "/admin/api/portfolio-media/delete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mediaId: target.id,
          }),
        },
      );

      const result = (await response
        .json()
        .catch(() => null)) as
        | {
            error?: string;
            newCoverId?: string | null;
            newCoverStatus?: string | null;
            cleanupWarnings?: string[];
          }
        | null;

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Не вдалося видалити фото.",
        );
      }

      setMedia((current) =>
        current
          .filter((item) => item.id !== id)
          .map((item, index) => ({
            ...item,
            isCover:
              item.type === "photo" &&
              item.source === "stored"
                ? item.id === result?.newCoverId
                : item.isCover,
            sortOrder:
              item.type === "photo" &&
              item.source === "stored"
                ? index
                : item.sortOrder,
          })),
      );

      if (
        result?.newCoverId &&
        result.newCoverStatus !== "ready"
      ) {
        try {
          await processStoredPhoto(
            result.newCoverId,
          );
        } catch (processError) {
          console.error(
            "New automatic cover could not be processed:",
            processError,
          );
        }
      }

      setSaveStatus("saved");
      setSaveMessage(
        result?.cleanupWarnings?.length
          ? "Фото видалено. Частина старих файлів потребує фонової очистки."
          : "Фото видалено. Порядок та обкладинку оновлено.",
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Failed to delete portfolio photo:",
        error,
      );

      setSaveStatus("error");
      setSaveMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося видалити фото.",
      );
    }
  };

  const persistStoredPhotoOrder = async (
    nextMedia: MediaItem[],
  ) => {
    if (!projectId) {
      return;
    }

    const mediaIds = nextMedia
      .filter(
        (item) =>
          item.type === "photo" &&
          item.source === "stored",
      )
      .map((item) => item.id);

    const response = await fetch(
      "/admin/api/portfolio-media/reorder",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          mediaIds,
        }),
      },
    );

    const result = (await response
      .json()
      .catch(() => null)) as
      | { error?: string }
      | null;

    if (!response.ok) {
      throw new Error(
        result?.error ??
          "Не вдалося зберегти порядок фото.",
      );
    }
  };

  const moveStoredPhoto = async (
    sourceId: string,
    targetId: string,
  ) => {
    if (
      sourceId === targetId ||
      saveStatus === "saving"
    ) {
      return;
    }

    const source = media.find(
      (item) => item.id === sourceId,
    );
    const target = media.find(
      (item) => item.id === targetId,
    );

    if (
      !source ||
      !target ||
      source.type !== "photo" ||
      target.type !== "photo" ||
      source.source !== "stored" ||
      target.source !== "stored"
    ) {
      return;
    }

    const previousMedia = media;
    const nextMedia = [...media];

    const sourceIndex = nextMedia.findIndex(
      (item) => item.id === sourceId,
    );
    const targetIndex = nextMedia.findIndex(
      (item) => item.id === targetId,
    );

    const [moved] = nextMedia.splice(
      sourceIndex,
      1,
    );

    nextMedia.splice(
      targetIndex,
      0,
      moved,
    );

    const storedPhotoIds = nextMedia
      .filter(
        (item) =>
          item.type === "photo" &&
          item.source === "stored",
      )
      .map((item) => item.id);

    const normalized = nextMedia.map((item) => {
      const nextSortOrder =
        item.type === "photo" &&
        item.source === "stored"
          ? storedPhotoIds.indexOf(item.id)
          : item.sortOrder;

      return {
        ...item,
        sortOrder: nextSortOrder,
      };
    });

    setMedia(normalized);
    setSaveStatus("saving");
    setSaveMessage("Зберігаємо порядок фото…");

    try {
      await persistStoredPhotoOrder(normalized);

      setSaveStatus("saved");
      setSaveMessage("Порядок фото збережено.");
      router.refresh();
    } catch (error) {
      console.error(
        "Failed to reorder portfolio photos:",
        error,
      );

      setMedia(previousMedia);
      setSaveStatus("error");
      setSaveMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося змінити порядок фото.",
      );
    } finally {
      setDraggedMediaId(null);
    }
  };

  const moveStoredPhotoByStep = (
    id: string,
    direction: -1 | 1,
  ) => {
    const storedPhotos = media.filter(
      (item) =>
        item.type === "photo" &&
        item.source === "stored",
    );

    const index = storedPhotos.findIndex(
      (item) => item.id === id,
    );

    const nextIndex = index + direction;

    if (
      index < 0 ||
      nextIndex < 0 ||
      nextIndex >= storedPhotos.length
    ) {
      return;
    }

    void moveStoredPhoto(
      id,
      storedPhotos[nextIndex].id,
    );
  };

  const cleanupIncompletePhotos = async () => {
    if (
      !projectId ||
      incompletePhotoCount === 0 ||
      saveStatus === "saving"
    ) {
      return;
    }

    if (
      !window.confirm(
        `Видалити ${incompletePhotoCount} незавершених фото (pending / failed)?`,
      )
    ) {
      return;
    }

    setSaveStatus("saving");
    setSaveMessage(
      "Очищаємо незавершені фото…",
    );

    try {
      const response = await fetch(
        "/admin/api/portfolio-media/cleanup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            projectId,
          }),
        },
      );

      const result = (await response
        .json()
        .catch(() => null)) as
        | {
            error?: string;
            deletedIds?: string[];
            coverId?: string | null;
            coverStatus?: string | null;
          }
        | null;

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Не вдалося очистити незавершені фото.",
        );
      }

      const deleted = new Set(
        result?.deletedIds ?? [],
      );

      setMedia((current) =>
        current
          .filter((item) => !deleted.has(item.id))
          .map((item) => ({
            ...item,
            isCover:
              item.type === "photo" &&
              item.source === "stored"
                ? item.id === result?.coverId
                : item.isCover,
          })),
      );

      if (
        result?.coverId &&
        result.coverStatus !== "ready"
      ) {
        try {
          await processStoredPhoto(
            result.coverId,
          );
        } catch (processError) {
          console.error(
            "Automatic cover processing after cleanup failed:",
            processError,
          );
        }
      }

      setSaveStatus("saved");
      setSaveMessage(
        deleted.size > 0
          ? `Очищено незавершених фото: ${deleted.size}.`
          : "Незавершених фото немає.",
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Failed to clean incomplete portfolio photos:",
        error,
      );

      setSaveStatus("error");
      setSaveMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося очистити незавершені фото.",
      );
    }
  };

  const addMaterial = () => {
    setMaterials((current) => [
      ...current,
      createEmptySpecification("material"),
    ]);

    markAsChanged();
  };

  const addHardware = () => {
    setHardware((current) => [
      ...current,
      createEmptySpecification("hardware"),
    ]);

    markAsChanged();
  };

  const updateMaterial = (
    id: string,
    field: "label" | "value",
    value: string,
  ) => {
    setMaterials((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );

    markAsChanged();
  };

  const updateHardware = (
    id: string,
    field: "label" | "value",
    value: string,
  ) => {
    setHardware((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item,
      ),
    );

    markAsChanged();
  };

  const removeMaterial = (id: string) => {
    setMaterials((current) =>
      current.filter(
        (item) => item.id !== id,
      ),
    );

    markAsChanged();
  };

  const removeHardware = (id: string) => {
    setHardware((current) =>
      current.filter(
        (item) => item.id !== id,
      ),
    );

    markAsChanged();
  };

  const processStoredPhoto = async (
    mediaId: string,
    focalPoint?: {
      x: number;
      y: number;
      zoom?: number;
    },
  ): Promise<string | null> => {
    const response = await fetch(
      "/admin/api/process-photo",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaId,
          ...(focalPoint
            ? {
                focalX: focalPoint.x,
                focalY: focalPoint.y,
                cropZoom: focalPoint.zoom ?? 1,
              }
            : {}),
        }),
      },
    );

    const result = (await response
      .json()
      .catch(() => null)) as
      | {
          error?: string;
          galleryUrl?: string;
          cardUrl?: string;
        }
      | null;

    if (!response.ok) {
      throw new Error(
        result?.error ??
          "Не вдалося обробити фото.",
      );
    }

    setMedia((current) =>
      current.map((item) =>
        item.id === mediaId
          ? {
              ...item,
              url:
                result?.galleryUrl ??
                item.url,
              processingStatus: "ready",
            }
          : item,
      ),
    );

    return result?.galleryUrl ?? null;
  };

  const reprocessPhoto = async (
    mediaId: string,
  ) => {
    if (saveStatus === "saving") return;

    setSaveStatus("saving");
    setSaveMessage("Обробляємо фото…");

    try {
      setMedia((current) =>
        current.map((item) =>
          item.id === mediaId
            ? {
                ...item,
                processingStatus:
                  "processing",
              }
            : item,
        ),
      );

      await processStoredPhoto(mediaId);

      setSaveStatus("saved");
      setSaveMessage(
        "WebP-версії фото створено.",
      );
      router.refresh();
    } catch (error) {
      console.error(
        "Failed to reprocess portfolio photo:",
        error,
      );

      setMedia((current) =>
        current.map((item) =>
          item.id === mediaId
            ? {
                ...item,
                processingStatus: "failed",
              }
            : item,
        ),
      );

      setSaveStatus("error");
      setSaveMessage(
        "Не вдалося обробити фото.",
      );
    }
  };

  const clamp = (
    value: number,
    min: number,
    max: number,
  ) => Math.min(max, Math.max(min, value));

  const getCropGeometry = (
    focalX: number,
    focalY: number,
    zoom: number,
  ) => {
    const {
      width: sourceWidth,
      height: sourceHeight,
    } = cropImageSize;

    const {
      width: viewportWidth,
      height: viewportHeight,
    } = cropViewportSize;

    if (
      sourceWidth <= 0 ||
      sourceHeight <= 0 ||
      viewportWidth <= 0 ||
      viewportHeight <= 0
    ) {
      return null;
    }

    const targetRatio = 4 / 3;
    const sourceRatio =
      sourceWidth / sourceHeight;

    let baseCropWidth = sourceWidth;
    let baseCropHeight = sourceHeight;

    if (sourceRatio > targetRatio) {
      baseCropWidth =
        sourceHeight * targetRatio;
    } else {
      baseCropHeight =
        sourceWidth / targetRatio;
    }

    const safeZoom = clamp(zoom, 1, 3);
    const cropWidth =
      baseCropWidth / safeZoom;
    const cropHeight =
      baseCropHeight / safeZoom;

    const halfWidth = cropWidth / 2;
    const halfHeight = cropHeight / 2;

    const centerX = clamp(
      focalX * sourceWidth,
      halfWidth,
      sourceWidth - halfWidth,
    );

    const centerY = clamp(
      focalY * sourceHeight,
      halfHeight,
      sourceHeight - halfHeight,
    );

    const scale =
      viewportWidth / cropWidth;

    return {
      sourceWidth,
      sourceHeight,
      cropWidth,
      cropHeight,
      centerX,
      centerY,
      scale,
      focalX: centerX / sourceWidth,
      focalY: centerY / sourceHeight,
      zoom: safeZoom,
      renderedWidth:
        sourceWidth * scale,
      renderedHeight:
        sourceHeight * scale,
      left:
        viewportWidth / 2 -
        centerX * scale,
      top:
        viewportHeight / 2 -
        centerY * scale,
    };
  };

  const normalizeCropPoint = (
    x: number,
    y: number,
    zoom: number,
  ) => {
    const geometry =
      getCropGeometry(x, y, zoom);

    if (!geometry) {
      return {
        x: clamp(x, 0, 1),
        y: clamp(y, 0, 1),
      };
    }

    return {
      x: geometry.focalX,
      y: geometry.focalY,
    };
  };

  const openCropEditor = (item: MediaItem) => {
    const initialZoom = clamp(
      item.cropZoom ?? 1,
      1,
      3,
    );

    setCropMediaId(item.id);
    setCropZoom(initialZoom);
    setCropPoint({
      x: item.focalX ?? 0.5,
      y: item.focalY ?? 0.5,
    });
    setCropImageSize({
      width: 0,
      height: 0,
    });
    setCropViewportSize({
      width: 0,
      height: 0,
    });
    setIsCropDragging(false);
    setCropDragStart(null);
  };

  const resetCrop = () => {
    setCropPoint({
      x: 0.5,
      y: 0.5,
    });
    setCropZoom(1);
  };

  const handleCropImageLoad = (
    event: React.SyntheticEvent<
      HTMLImageElement
    >,
  ) => {
    const image = event.currentTarget;

    setCropImageSize({
      width: image.naturalWidth,
      height: image.naturalHeight,
    });
  };

  const handleCropViewportRef = (
    node: HTMLDivElement | null,
  ) => {
    if (!node) return;

    const rect = node.getBoundingClientRect();

    setCropViewportSize((current) => {
      if (
        Math.abs(current.width - rect.width) < 0.5 &&
        Math.abs(current.height - rect.height) < 0.5
      ) {
        return current;
      }

      return {
        width: rect.width,
        height: rect.height,
      };
    });
  };

  const startCropDrag = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!getCropGeometry(
      cropPoint.x,
      cropPoint.y,
      cropZoom,
    )) {
      return;
    }

    event.currentTarget.setPointerCapture(
      event.pointerId,
    );

    setIsCropDragging(true);
    setCropDragStart({
      pointerX: event.clientX,
      pointerY: event.clientY,
      focalX: cropPoint.x,
      focalY: cropPoint.y,
    });
  };

  const moveCropDrag = (
    event: React.PointerEvent<HTMLDivElement>,
  ) => {
    if (!isCropDragging || !cropDragStart) {
      return;
    }

    const geometry = getCropGeometry(
      cropDragStart.focalX,
      cropDragStart.focalY,
      cropZoom,
    );

    if (!geometry) {
      return;
    }

    const deltaX =
      event.clientX -
      cropDragStart.pointerX;

    const deltaY =
      event.clientY -
      cropDragStart.pointerY;

    const sourceDeltaX =
      deltaX / geometry.scale;

    const sourceDeltaY =
      deltaY / geometry.scale;

    const nextX =
      cropDragStart.focalX -
      sourceDeltaX /
        geometry.sourceWidth;

    const nextY =
      cropDragStart.focalY -
      sourceDeltaY /
        geometry.sourceHeight;

    setCropPoint(
      normalizeCropPoint(
        nextX,
        nextY,
        cropZoom,
      ),
    );
  };

  const endCropDrag = (
    event:
      | React.PointerEvent<HTMLDivElement>
      | React.PointerEvent<HTMLElement>,
  ) => {
    if (
      event.currentTarget.hasPointerCapture?.(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    setIsCropDragging(false);
    setCropDragStart(null);
  };

  const changeCropZoom = (
    nextZoom: number,
  ) => {
    const safeZoom = clamp(
      nextZoom,
      1,
      3,
    );

    setCropZoom(safeZoom);

    setCropPoint((current) =>
      normalizeCropPoint(
        current.x,
        current.y,
        safeZoom,
      ),
    );
  };

  const handleCropWheel = (
    event: React.WheelEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();

    const direction =
      event.deltaY > 0 ? -1 : 1;

    changeCropZoom(
      cropZoom + direction * 0.08,
    );
  };

  const saveCropPoint = async () => {
    if (!cropMediaId || saveStatus === "saving") {
      return;
    }

    const normalized =
      normalizeCropPoint(
        cropPoint.x,
        cropPoint.y,
        cropZoom,
      );

    setSaveStatus("saving");
    setSaveMessage("Оновлюємо кадр 4:3…");

    try {
      await processStoredPhoto(
        cropMediaId,
        {
          x: normalized.x,
          y: normalized.y,
          zoom: cropZoom,
        },
      );

      setMedia((current) =>
        current.map((item) =>
          item.id === cropMediaId
            ? {
                ...item,
                focalX: normalized.x,
                focalY: normalized.y,
                cropZoom,
              }
            : item,
        ),
      );

      setCropMediaId(null);
      setSaveStatus("saved");
      setSaveMessage(
        "Кадр обкладинки оновлено.",
      );
      router.refresh();
    } catch (error) {
      console.error(
        "Failed to update cover crop:",
        error,
      );

      setSaveStatus("error");
      setSaveMessage(
        "Не вдалося оновити кадр.",
      );
    }
  };

  const setCoverPhoto = async (mediaId: string) => {
    if (!projectId || saveStatus === "saving") return;

    const previousCover = media.find(
      (item) => item.type === "photo" && item.source === "stored" && item.isCover,
    );

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const targetPhoto = media.find(
        (item) => item.id === mediaId,
      );

      if (
        targetPhoto &&
        targetPhoto.processingStatus !== "ready"
      ) {
        setSaveMessage(
          "Готуємо WebP для нової обкладинки…",
        );
        await processStoredPhoto(mediaId);
      }

      if (previousCover && previousCover.id !== mediaId) {
        const { error } = await supabase
          .from("portfolio_media")
          .update({ is_cover: false })
          .eq("id", previousCover.id)
          .eq("project_id", projectId);
        if (error) throw error;
      }

      const { error } = await supabase
        .from("portfolio_media")
        .update({ is_cover: true })
        .eq("id", mediaId)
        .eq("project_id", projectId);

      if (error) {
        if (previousCover) {
          await supabase
            .from("portfolio_media")
            .update({ is_cover: true })
            .eq("id", previousCover.id)
            .eq("project_id", projectId);
        }
        throw error;
      }

      setMedia((current) =>
        current.map((item) => ({
          ...item,
          isCover:
            item.type === "photo" && item.source === "stored"
              ? item.id === mediaId
              : item.isCover,
        })),
      );

      setSaveStatus("saved");
      setSaveMessage("Обкладинку змінено.");
      router.refresh();
    } catch (error) {
      console.error("Failed to change portfolio cover:", error);
      setSaveStatus("error");
      setSaveMessage("Не вдалося змінити обкладинку.");
    }
  };

  const uploadPendingPhotos = async (
    targetProjectId: string,
  ) => {
    const pendingPhotos = media.filter(
      (item) =>
        item.type === "photo" &&
        item.source === "local" &&
        item.processingStatus === "ready" &&
        item.file,
    );

    if (!pendingPhotos.length) {
      return;
    }

    const { data: existingMedia, error: mediaError } =
      await supabase
        .from("portfolio_media")
        .select("sort_order")
        .eq("project_id", targetProjectId)
        .order("sort_order", { ascending: false })
        .limit(1);

    if (mediaError) {
      throw mediaError;
    }

    let nextSortOrder =
      existingMedia?.[0]?.sort_order != null
        ? existingMedia[0].sort_order + 1
        : 0;

    const { data: existingCover, error: coverLookupError } =
      await supabase
        .from("portfolio_media")
        .select("id")
        .eq("project_id", targetProjectId)
        .eq("media_type", "photo")
        .eq("is_cover", true)
        .maybeSingle();

    if (coverLookupError) throw coverLookupError;

    let hasCover = Boolean(existingCover);

    for (const item of pendingPhotos) {
      const mediaId = crypto.randomUUID();
      const file = item.file;

      if (!file) {
        continue;
      }

      const extension =
        file.type === "image/png" ? "png" : "jpg";

      const originalPath =
        `${targetProjectId}/photos/${mediaId}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("portfolio-originals")
          .upload(originalPath, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: false,
          });

      if (uploadError) {
        throw uploadError;
      }

      const { error: insertMediaError } =
        await supabase
          .from("portfolio_media")
          .insert({
            id: mediaId,
            project_id: targetProjectId,
            media_type: "photo",
            sort_order: nextSortOrder,
            original_path: originalPath,
            is_cover: !hasCover,
            processing_status: "pending",
          });

      if (insertMediaError) {
        await supabase.storage
          .from("portfolio-originals")
          .remove([originalPath]);

        throw insertMediaError;
      }

      const { data: signedData, error: signedError } =
        await supabase.storage
          .from("portfolio-originals")
          .createSignedUrl(originalPath, 3600);

      if (signedError) {
        throw signedError;
      }

      const storedItem: MediaItem = {
        id: mediaId,
        name: item.name,
        type: "photo",
        url: signedData.signedUrl,
        size: item.size,
        source: "stored",
        originalPath,
        sortOrder: nextSortOrder,
        isCover: !hasCover,
        processingStatus: "pending",
        focalX: 0.5,
        focalY: 0.5,
        cropZoom: 1,
      };

      URL.revokeObjectURL(item.url);

      setMedia((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? storedItem
            : currentItem,
        ),
      );

      const processResponse = await fetch(
        "/admin/api/process-photo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mediaId,
          }),
        },
      );

      const processResult = (await processResponse
        .json()
        .catch(() => null)) as
        | {
            error?: string;
            galleryUrl?: string;
            cardUrl?: string;
          }
        | null;

      if (!processResponse.ok) {
        throw new Error(
          processResult?.error ??
            "Оригінал фото збережено, але не вдалося створити WebP-версії.",
        );
      }

      if (processResult?.galleryUrl) {
        setMedia((current) =>
          current.map((currentItem) =>
            currentItem.id === mediaId
              ? {
                  ...currentItem,
                  url: processResult.galleryUrl!,
                  processingStatus: "ready",
                }
              : currentItem,
          ),
        );
      }

      hasCover = true;
      nextSortOrder += 1;
    }
  };

  const uploadPendingVideos = async (
    targetProjectId: string,
  ) => {
    const pendingVideos = media.filter(
      (item) =>
        item.type === "video" &&
        item.source === "local" &&
        item.processingStatus === "ready" &&
        item.file,
    );

    if (!pendingVideos.length) {
      return;
    }

    const { count: storedVideoCount, error: videoCountError } =
      await supabase
        .from("portfolio_media")
        .select("id", { count: "exact", head: true })
        .eq("project_id", targetProjectId)
        .eq("media_type", "video");

    if (videoCountError) {
      throw videoCountError;
    }

    if ((storedVideoCount ?? 0) + pendingVideos.length > 2) {
      throw new Error(
        "Ліміт 2 відео вже досягнуто. Оновіть сторінку перед повторною спробою.",
      );
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
      throw new Error(
        "Сесію адміністратора не знайдено. Увійдіть повторно.",
      );
    }

    const { data: existingMedia, error: mediaError } =
      await supabase
        .from("portfolio_media")
        .select("sort_order")
        .eq("project_id", targetProjectId)
        .order("sort_order", { ascending: false })
        .limit(1);

    if (mediaError) {
      throw mediaError;
    }

    let nextSortOrder =
      existingMedia?.[0]?.sort_order != null
        ? existingMedia[0].sort_order + 1
        : 0;

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl) {
      throw new Error(
        "NEXT_PUBLIC_SUPABASE_URL не налаштовано.",
      );
    }

    const projectRef =
      new URL(supabaseUrl).hostname.split(".")[0];

    const endpoint =
      `https://${projectRef}.storage.supabase.co/storage/v1/upload/resumable`;

    for (const item of pendingVideos) {
      const file = item.file;

      if (!file) {
        continue;
      }

      const mediaId = crypto.randomUUID();

      const uploadFile = item.preparedFile ?? file;

      if (shouldTranscodeVideo(file) && !item.preparedFile) {
        throw new Error(
          `Відео "${item.name}" ще не підготовлене до збереження.`,
        );
      }

      const extension = "mp4";
      const contentType = "video/mp4";

      const storagePath =
        `${targetProjectId}/videos/${mediaId}.${extension}`;

      setMedia((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                uploadProgress: 0,
                processingLabel:
                  "Завантаження 0%",
              }
            : currentItem,
        ),
      );

      await new Promise<void>((resolve, reject) => {
        const upload = new Upload(uploadFile, {
          endpoint,
          retryDelays: [0, 1000, 3000, 5000],
          headers: {
            authorization:
              `Bearer ${session.access_token}`,
          },
          uploadDataDuringCreation: true,
          removeFingerprintOnSuccess: true,
          metadata: {
            bucketName: "portfolio-videos",
            objectName: storagePath,
            contentType,
            cacheControl: "31536000",
          },
          chunkSize: 6 * 1024 * 1024,
          onError(error) {
            void upload
              .abort(true)
              .catch((abortError) => {
                console.error(
                  "Failed to terminate interrupted TUS upload:",
                  abortError,
                );
              })
              .finally(() => reject(error));
          },
          onProgress(bytesUploaded, bytesTotal) {
            const progress =
              bytesTotal > 0
                ? Math.round(
                    (bytesUploaded / bytesTotal) * 100,
                  )
                : 0;

            setMedia((current) =>
              current.map((currentItem) =>
                currentItem.id === item.id
                  ? {
                      ...currentItem,
                      uploadProgress: progress,
                      processingLabel:
                        `Завантаження ${progress}%`,
                    }
                  : currentItem,
              ),
            );
          },
          onSuccess() {
            resolve();
          },
        });

        upload.findPreviousUploads().then(
          (previousUploads) => {
            if (previousUploads.length) {
              upload.resumeFromPreviousUpload(
                previousUploads[0],
              );
            }

            upload.start();
          },
          reject,
        );
      });

      const { error: insertError } =
        await supabase
          .from("portfolio_media")
          .insert({
            id: mediaId,
            project_id: targetProjectId,
            media_type: "video",
            sort_order: nextSortOrder,
            original_path: null,
            web_path: storagePath,
            card_path: null,
            is_cover: false,
            processing_status: "ready",
          });

      if (insertError) {
        const { error: cleanupError } =
          await supabase.storage
            .from("portfolio-videos")
            .remove([storagePath]);

        if (cleanupError) {
          console.error(
            "Video DB insert failed and Storage cleanup also failed:",
            cleanupError,
          );
          throw new Error(
            `${insertError.message} Також не вдалося автоматично очистити завантажений MP4.`,
          );
        }

        throw insertError;
      }

      const publicUrl = supabase.storage
        .from("portfolio-videos")
        .getPublicUrl(storagePath)
        .data.publicUrl;

      URL.revokeObjectURL(item.url);

      setMedia((current) =>
        current.map((currentItem) =>
          currentItem.id === item.id
            ? {
                id: mediaId,
                name: item.name,
                type: "video",
                url: publicUrl,
                size: item.size,
                source: "stored",
                webPath: storagePath,
                cardPath: null,
                sortOrder: nextSortOrder,
                isCover: false,
                processingStatus: "ready",
                focalX: 0.5,
                focalY: 0.5,
                cropZoom: 1,
                uploadProgress: 100,
                processingLabel: undefined,
              }
            : currentItem,
        ),
      );

      nextSortOrder += 1;
    }
  };

  const handleSaveDraft = async () => {
    if (saveInFlightRef.current || saveStatus === "saving") {
      return;
    }

    if (isMediaProcessing) {
      setSaveStatus("error");
      setSaveMessage("Дочекайтеся завершення оптимізації медіа.");
      return;
    }

    if (hasFailedLocalMedia) {
      setSaveStatus("error");
      setSaveMessage(
        "Є медіафайл, який не вдалося підготувати. Видаліть його та додайте повторно.",
      );
      return;
    }

    const cleanTitle = title.trim();
    const cleanDescription =
      shortDescription.trim();

    if (!cleanTitle) {
      setSaveStatus("error");
      setSaveMessage(
        "Вкажіть назву роботи.",
      );
      return;
    }

    if (!cleanDescription) {
      setSaveStatus("error");
      setSaveMessage(
        "Додайте короткий опис роботи.",
      );
      return;
    }

    const parsedYear =
      year.trim() === "" ? null : Number(year);

    if (
      parsedYear !== null &&
      (!Number.isInteger(parsedYear) ||
        parsedYear < 2020 ||
        parsedYear > 2100)
    ) {
      setSaveStatus("error");
      setSaveMessage(
        "Перевірте рік роботи.",
      );
      return;
    }

    saveInFlightRef.current = true;
    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error(
          "Сесію адміністратора не знайдено. Увійдіть повторно.",
        );
      }

      const cleanMaterials =
        normalizeSpecifications(materials);

      const cleanHardware =
        normalizeSpecifications(hardware);

      const commonData = {
        title: cleanTitle,
        category,
        wardrobe_type:
          category === "wardrobe"
            ? wardrobeType
            : null,
        short_description:
          cleanDescription,
        materials: cleanMaterials,
        hardware: cleanHardware,
        features:
          features.trim() || null,
        year: parsedYear,
        location: location.trim() || null,
        color: color.trim() || null,
        production_term:
          productionTerm.trim() || null,
      };

      if (!projectId) {
        const slug =
          projectSlug ??
          createSlug(cleanTitle);

        const {
          data,
          error,
        } = await supabase
          .from("portfolio_projects")
          .insert({
            ...commonData,
            slug,
            created_by: user.id,
            status: "draft",
            published_at: null,
          })
          .select("id, slug")
          .single();

        if (error) {
          throw error;
        }

        setProjectId(data.id);
        setProjectSlug(data.slug);

        await uploadPendingPhotos(data.id);
        await uploadPendingVideos(data.id);

        setSaveStatus("saved");
        setSaveMessage(
          "Чернетку та медіафайли збережено.",
        );

        router.replace(
          `/admin/portfolio/${data.id}/edit`,
        );

        return;
      }

      const { error } = await supabase
        .from("portfolio_projects")
        .update(commonData)
        .eq("id", projectId);

      if (error) {
        throw error;
      }

      await uploadPendingPhotos(projectId);
      await uploadPendingVideos(projectId);

      setSaveStatus("saved");
      setSaveMessage(
        "Зміни та медіафайли збережено.",
      );
    } catch (error) {
      console.error(
        "Failed to save portfolio draft:",
        error,
      );

      setSaveStatus("error");

      setSaveMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося зберегти чернетку.",
      );
    } finally {
      saveInFlightRef.current = false;
    }
  };

  const handlePublish = async () => {
    if (!projectId || saveStatus === "saving") {
      setSaveStatus("error");
      setSaveMessage(
        "Спочатку збережіть роботу як чернетку.",
      );
      return;
    }

    const cleanTitle = title.trim();
    const cleanDescription = shortDescription.trim();

    if (!cleanTitle || !cleanDescription) {
      setSaveStatus("error");
      setSaveMessage(
        "Для публікації потрібні назва та короткий опис.",
      );
      return;
    }

    const readyPhotos = media.filter(
      (item) =>
        item.type === "photo" &&
        item.source === "stored" &&
        item.processingStatus === "ready",
    );

    const readyCover = readyPhotos.find(
      (item) => item.isCover,
    );

    if (!readyPhotos.length || !readyCover) {
      setSaveStatus("error");
      setSaveMessage(
        "Для публікації потрібне хоча б одне готове фото та вибрана обкладинка.",
      );
      return;
    }

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const parsedYear =
        year.trim() === "" ? null : Number(year);

      if (
        parsedYear !== null &&
        (!Number.isInteger(parsedYear) ||
          parsedYear < 2020 ||
          parsedYear > 2100)
      ) {
        throw new Error("Перевірте рік роботи.");
      }

      const { error } = await supabase
        .from("portfolio_projects")
        .update({
          title: cleanTitle,
          category,
          wardrobe_type:
            category === "wardrobe"
              ? wardrobeType
              : null,
          short_description: cleanDescription,
          materials: normalizeSpecifications(materials),
          hardware: normalizeSpecifications(hardware),
          features: features.trim() || null,
          year: parsedYear,
          location: location.trim() || null,
          color: color.trim() || null,
          production_term:
            productionTerm.trim() || null,
          status: "published",
          published_at: new Date().toISOString(),
        })
        .eq("id", projectId);

      if (error) throw error;

      setProjectStatus("published");
      setSaveStatus("saved");
      setSaveMessage(
        "Роботу опубліковано на сайті.",
      );
      router.refresh();
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося опублікувати роботу.",
      );
    }
  };

  const handleUnpublish = async () => {
    if (!projectId || saveStatus === "saving") {
      return;
    }

    if (
      !window.confirm(
        "Зняти цю роботу з публікації? Вона залишиться в CMS як чернетка.",
      )
    ) {
      return;
    }

    setSaveStatus("saving");
    setSaveMessage("");

    try {
      const { error } = await supabase
        .from("portfolio_projects")
        .update({
          status: "draft",
          published_at: null,
        })
        .eq("id", projectId);

      if (error) {
        throw error;
      }

      setProjectStatus("draft");
      setSaveStatus("saved");
      setSaveMessage(
        "Роботу знято з публікації.",
      );
      router.refresh();
    } catch (error) {
      setSaveStatus("error");
      setSaveMessage(
        error instanceof Error
          ? error.message
          : "Не вдалося зняти роботу з публікації.",
      );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageTop}>
        <Link
          href="/admin/portfolio"
          className={styles.back}
        >
          <ArrowLeftIcon />
          Назад
        </Link>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondary}
            onClick={handleSaveDraft}
            disabled={saveStatus === "saving" || isMediaProcessing}
          >
            {isMediaProcessing
              ? "Оптимізація медіа…"
              : saveStatus === "saving"
              ? "Зберігаємо..."
              : saveStatus === "saved"
                ? "Збережено"
                : projectStatus === "published"
                  ? "Зберегти зміни"
                  : "Зберегти чернетку"}
          </button>

          {projectId ? (
            <Link
              href={`/admin/portfolio/${projectId}/preview`}
              className={styles.secondary}
              target="_blank"
            >
              Попередній перегляд
            </Link>
          ) : (
            <button
              type="button"
              className={styles.secondary}
              disabled
            >
              Попередній перегляд
            </button>
          )}

          <button
            type="button"
            className={
              projectStatus === "published"
                ? styles.secondary
                : styles.primary
            }
            onClick={
              projectStatus === "published"
                ? handleUnpublish
                : handlePublish
            }
            disabled={saveStatus === "saving" || isMediaProcessing}
          >
            {projectStatus === "published"
              ? "Зняти з публікації"
              : "Опублікувати"}
          </button>
        </div>
      </div>

      {saveMessage && (
        <div
          className={
            saveStatus === "error"
              ? styles.saveError
              : styles.saveSuccess
          }
          role={
            saveStatus === "error"
              ? "alert"
              : "status"
          }
        >
          {saveMessage}
        </div>
      )}

      <section className={styles.panel}>
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>
              ПОРТФОЛІО
            </span>

            <h1>
              {isEditMode
                ? "Редагування роботи"
                : "Нова робота"}
            </h1>
          </div>

          <p>
            {isEditMode
              ? "Внесіть зміни та збережіть чернетку."
              : "Один екран — тільки необхідне для швидкої публікації."}
          </p>
        </header>

        <div className={styles.columns}>
          <div className={styles.formColumn}>
            <Field label="Назва роботи *">
              <input
                value={title}
                onChange={handleTitleChange}
                placeholder="Наприклад: Кухня у ЖК Варшавський"
              />
            </Field>

            <Field label="Категорія *">
              <div className={styles.segmented}>
                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={
                      category === "kitchen"
                    }
                    onChange={() =>
                      handleCategoryChange(
                        "kitchen",
                      )
                    }
                  />
                  <span>Кухні</span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={
                      category === "wardrobe"
                    }
                    onChange={() =>
                      handleCategoryChange(
                        "wardrobe",
                      )
                    }
                  />
                  <span>Шафи</span>
                </label>

                <label>
                  <input
                    type="radio"
                    name="category"
                    checked={
                      category === "furniture"
                    }
                    onChange={() =>
                      handleCategoryChange(
                        "furniture",
                      )
                    }
                  />
                  <span>Інші меблі</span>
                </label>
              </div>
            </Field>

            {category === "wardrobe" && (
              <Field label="Тип шафи *">
                <div
                  className={
                    styles.wardrobeSegmented
                  }
                >
                  <label>
                    <input
                      type="radio"
                      name="wardrobeType"
                      checked={
                        wardrobeType ===
                        "hinged"
                      }
                      onChange={() => {
                        setWardrobeType(
                          "hinged",
                        );
                        markAsChanged();
                      }}
                    />
                    <span>Розпашна</span>
                  </label>

                  <label>
                    <input
                      type="radio"
                      name="wardrobeType"
                      checked={
                        wardrobeType ===
                        "sliding"
                      }
                      onChange={() => {
                        setWardrobeType(
                          "sliding",
                        );
                        markAsChanged();
                      }}
                    />
                    <span>Купе</span>
                  </label>
                </div>
              </Field>
            )}

            <Field label="Короткий опис *">
              <textarea
                rows={4}
                value={shortDescription}
                onChange={
                  handleDescriptionChange
                }
                placeholder="Коротко про проєкт, стиль та головну ідею."
              />
            </Field>

            <div className={styles.sectionTitle}>
              <div>
                <h2>Матеріали</h2>

                <p>
                  Додавайте тільки те, що
                  потрібно показати на сайті.
                </p>
              </div>

              <button
                type="button"
                onClick={addMaterial}
              >
                <PlusIcon />
                Додати матеріал
              </button>
            </div>

            <div className={styles.pairList}>
              {materials.map((item) => (
                <PairRow
                  key={item.id}
                  item={item}
                  labelPlaceholder="Матеріал"
                  valuePlaceholder="Наприклад: МДФ фарбований"
                  onChange={(field, value) =>
                    updateMaterial(
                      item.id,
                      field,
                      value,
                    )
                  }
                  onRemove={() =>
                    removeMaterial(item.id)
                  }
                />
              ))}
            </div>

            <div className={styles.sectionTitle}>
              <div>
                <h2>Фурнітура</h2>
              </div>

              <button
                type="button"
                onClick={addHardware}
              >
                <PlusIcon />
                Додати позицію
              </button>
            </div>

            <div className={styles.pairList}>
              {hardware.map((item) => (
                <PairRow
                  key={item.id}
                  item={item}
                  labelPlaceholder="Назва"
                  valuePlaceholder="Наприклад: Hettich"
                  onChange={(field, value) =>
                    updateHardware(
                      item.id,
                      field,
                      value,
                    )
                  }
                  onRemove={() =>
                    removeHardware(item.id)
                  }
                />
              ))}
            </div>

            <Field label="Особливості (необов’язково)">
              <textarea
                rows={3}
                value={features}
                onChange={
                  handleFeaturesChange
                }
                placeholder="LED-підсвічування, острів, приховані ручки..."
              />
            </Field>

            <Field label="Локація / ЖК (необов’язково)">
              <input
                type="text"
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value);
                  markAsChanged();
                }}
                placeholder="Наприклад: ЖК Варшавський, Київ"
              />
            </Field>

            <Field label="Колір (необов’язково)">
              <input
                type="text"
                value={color}
                onChange={(event) => {
                  setColor(event.target.value);
                  markAsChanged();
                }}
                placeholder="Наприклад: теплий білий / дуб"
              />
            </Field>

            <Field label="Термін виготовлення (необов’язково)">
              <input
                type="text"
                value={productionTerm}
                onChange={(event) => {
                  setProductionTerm(
                    event.target.value,
                  );
                  markAsChanged();
                }}
                placeholder="Наприклад: 5–6 тижнів"
              />
            </Field>

            <Field label="Рік">
              <select
                value={year}
                onChange={handleYearChange}
              >
                <option value="2026">
                  2026
                </option>
                <option value="2025">
                  2025
                </option>
                <option value="2024">
                  2024
                </option>
                <option value="2023">
                  2023
                </option>
                <option value="2022">
                  2022
                </option>
                <option value="2021">
                  2021
                </option>
                <option value="2020">
                  2020
                </option>
              </select>
            </Field>
          </div>

          <div className={styles.mediaColumn}>
            <div className={styles.mediaHeader}>
              <div>
                <h2>Фото та відео</h2>

                <p>
                  JPG / PNG автоматично
                  підготуємо для web. MOV / WebM
                  автоматично перетворимо у web MP4.
                  Максимум 2 відео.
                </p>
              </div>

              <div className={styles.mediaHeaderActions}>
                {projectId &&
                  incompletePhotoCount > 0 && (
                    <button
                      type="button"
                      className={styles.cleanupAction}
                      onClick={() =>
                        void cleanupIncompletePhotos()
                      }
                      disabled={
                        saveStatus === "saving"
                      }
                    >
                      Очистити незавершені (
                      {incompletePhotoCount})
                    </button>
                  )}

                <div className={styles.counters}>
                <span>
                  <ImageIcon />
                  {photoCount}
                </span>

                <span>
                  <VideoIcon />
                  {videoCount}/2
                </span>
                </div>
              </div>
            </div>

            <label className={styles.dropzone}>
              <input
                type="file"
                multiple
                accept={accepted}
                onChange={handleFiles}
                disabled={saveStatus === "saving"}
              />

              <span
                className={styles.uploadIcon}
              >
                <PlusIcon />
              </span>

              <strong>
                Перетягніть файли сюди
              </strong>

              <span>
                або натисніть для вибору
              </span>

              <small>
                JPG, PNG • MP4, WebM, MOV • до 100 MB • MOV → MP4 автоматично{" "}
                {canAddVideo
                  ? "до 2 відео"
                  : "— ліміт відео використано"}
              </small>
            </label>

            {media.length > 0 ? (
              <div className={styles.mediaGrid}>
                {media.map(
                  (item) => (
                    <article
                      className={`${styles.mediaCard} ${
                        draggedMediaId === item.id
                          ? styles.mediaCardDragging
                          : ""
                      }`}
                      key={item.id}
                      draggable={
                        item.type === "photo" &&
                        item.source === "stored" &&
                        saveStatus !== "saving"
                      }
                      onDragStart={() => {
                        if (
                          item.type === "photo" &&
                          item.source === "stored"
                        ) {
                          setDraggedMediaId(item.id);
                        }
                      }}
                      onDragEnd={() =>
                        setDraggedMediaId(null)
                      }
                      onDragOver={(event) => {
                        if (
                          draggedMediaId &&
                          item.type === "photo" &&
                          item.source === "stored"
                        ) {
                          event.preventDefault();
                        }
                      }}
                      onDrop={(event) => {
                        event.preventDefault();

                        if (draggedMediaId) {
                          void moveStoredPhoto(
                            draggedMediaId,
                            item.id,
                          );
                        }
                      }}
                    >
                      <div
                        className={
                          styles.preview
                        }
                      >
                        {item.type ===
                        "photo" ? (
                          item.source === "local" ? (
                            <Image
                              src={item.url}
                              alt=""
                              fill
                              unoptimized
                              className={
                                styles.previewImage
                              }
                            />
                          ) : (
                            <img
                              src={item.url}
                              alt=""
                              className={
                                styles.previewImage
                              }
                            />
                          )
                        ) : (
                          <video
                            src={item.url}
                            muted
                            preload="metadata"
                          />
                        )}

                        {item.type === "photo" &&
                          item.source === "stored" && (
                            <span
                              className={styles.orderBadge}
                              title="Перетягніть картку, щоб змінити порядок"
                            >
                              ≡ {Number(item.sortOrder ?? 0) + 1}
                            </span>
                          )}

                        {item.type === "photo" &&
                          item.isCover && (
                            <span
                              className={
                                styles.cover
                              }
                            >
                              Обкладинка
                            </span>
                          )}

                        {item.type ===
                          "video" && (
                          <span
                            className={
                              styles.videoBadge
                            }
                          >
                            <VideoIcon />
                          </span>
                        )}
                      </div>

                      <div
                        className={
                          styles.mediaInfo
                        }
                      >
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {item.source === "local" &&
                          item.processingLabel
                            ? item.processingLabel
                            : item.size != null
                              ? formatMb(item.size)
                              : item.source === "stored"
                                ? "Збережено"
                                : ""}
                        </span>

                        {item.source === "local" &&
                          item.uploadProgress != null &&
                          item.processingStatus === "processing" && (
                            <div
                              className={styles.videoProgress}
                              aria-label={`Підготовлено ${item.uploadProgress}%`}
                            >
                              <span
                                style={{
                                  width: `${item.uploadProgress}%`,
                                }}
                              />
                            </div>
                          )}

                        {item.type === "video" &&
                          item.source === "stored" && (
                            <span className={styles.readyState}>
                              ✓ Готово
                            </span>
                          )}
                      </div>

                      {item.source === "local" &&
                        item.processingStatus === "failed" && (
                          <button
                            type="button"
                            className={styles.processAction}
                            onClick={() =>
                              retryLocalMediaPreparation(item.id)
                            }
                            disabled={saveStatus === "saving"}
                          >
                            Повторити підготовку
                          </button>
                        )}

                      {item.type === "photo" &&
                        item.source === "stored" &&
                        item.processingStatus !== "ready" && (
                          <button
                            type="button"
                            className={styles.processAction}
                            onClick={() =>
                              void reprocessPhoto(item.id)
                            }
                          >
                            {item.processingStatus === "failed"
                              ? "Повторити обробку"
                              : "Обробити фото"}
                          </button>
                        )}

                      {item.type === "photo" &&
                        item.source === "stored" &&
                        !item.isCover && (
                          <button
                            type="button"
                            className={styles.coverAction}
                            onClick={() =>
                              void setCoverPhoto(item.id)
                            }
                          >
                            Зробити обкладинкою
                          </button>
                        )}

                      {item.type === "photo" &&
                        item.source === "stored" &&
                        item.isCover &&
                        item.processingStatus === "ready" && (
                          <button
                            type="button"
                            className={styles.cropAction}
                            onClick={() =>
                              openCropEditor(item)
                            }
                          >
                            Налаштувати кадр 4:3
                          </button>
                        )}

                      {item.type === "photo" &&
                        item.source === "stored" && (
                          <div className={styles.orderActions}>
                            <button
                              type="button"
                              onClick={() =>
                                moveStoredPhotoByStep(
                                  item.id,
                                  -1,
                                )
                              }
                              disabled={
                                saveStatus === "saving"
                              }
                              aria-label={`Перемістити ${item.name} ліворуч`}
                            >
                              ←
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                moveStoredPhotoByStep(
                                  item.id,
                                  1,
                                )
                              }
                              disabled={
                                saveStatus === "saving"
                              }
                              aria-label={`Перемістити ${item.name} праворуч`}
                            >
                              →
                            </button>
                          </div>
                        )}

                      <button
                        type="button"
                        className={
                          styles.remove
                        }
                        onClick={() =>
                          removeMedia(
                            item.id,
                          )
                        }
                        aria-label={`Видалити ${item.name}`}
                        disabled={saveStatus === "saving"}
                      >
                        ×
                      </button>
                    </article>
                  ),
                )}
              </div>
            ) : (
              <div className={styles.mediaHint}>
                <strong>
                  Як це працюватиме після
                  підключення media pipeline
                </strong>

                <span>
                  Фото: backup оригіналу →
                  WebP для сайту → прев’ю
                  картки.
                </span>

                <span>
                  Відео: транскодування →
                  poster → оригінал не
                  зберігається.
                </span>
              </div>
            )}

            {cropMediaId &&
              (() => {
                const cropItem = media.find(
                  (item) =>
                    item.id === cropMediaId,
                );

                if (!cropItem) return null;

                const geometry =
                  getCropGeometry(
                    cropPoint.x,
                    cropPoint.y,
                    cropZoom,
                  );

                return (
                  <section
                    className={
                      styles.cropEditorModern
                    }
                  >
                    <div
                      className={
                        styles.cropModernHeader
                      }
                    >
                      <div>
                        <span
                          className={
                            styles.cropEyebrow
                          }
                        >
                          ОБКЛАДИНКА PORTFOLIO
                        </span>

                        <strong>
                          Виберіть кадр 4:3
                        </strong>

                        <p>
                          Перетягуйте фото під
                          рамкою. Масштаб змінюється
                          повзунком або колесом
                          миші.
                        </p>
                      </div>

                      <button
                        type="button"
                        className={
                          styles.cropModernClose
                        }
                        onClick={() =>
                          setCropMediaId(null)
                        }
                        aria-label="Закрити редактор кадру"
                      >
                        ×
                      </button>
                    </div>

                    <div
                      className={
                        styles.cropCanvasShell
                      }
                    >
                      <div
                        ref={
                          handleCropViewportRef
                        }
                        className={`${styles.cropViewport} ${
                          isCropDragging
                            ? styles.cropViewportDragging
                            : ""
                        }`}
                        onPointerDown={
                          startCropDrag
                        }
                        onPointerMove={
                          moveCropDrag
                        }
                        onPointerUp={
                          endCropDrag
                        }
                        onPointerCancel={
                          endCropDrag
                        }
                        onWheel={
                          handleCropWheel
                        }
                      >
                        <img
                          src={cropItem.url}
                          alt=""
                          draggable={false}
                          onLoad={
                            handleCropImageLoad
                          }
                          className={
                            styles.cropMovableImage
                          }
                          style={
                            geometry
                              ? {
                                  width: `${geometry.renderedWidth}px`,
                                  height: `${geometry.renderedHeight}px`,
                                  left: `${geometry.left}px`,
                                  top: `${geometry.top}px`,
                                }
                              : undefined
                          }
                        />

                        <div
                          className={
                            styles.cropGuides
                          }
                          aria-hidden="true"
                        >
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>

                        <div
                          className={
                            styles.cropCenterMark
                          }
                          aria-hidden="true"
                        />

                        <span
                          className={
                            styles.cropDragHint
                          }
                          aria-hidden="true"
                        >
                          Перетягніть фото
                        </span>
                      </div>
                    </div>

                    <div
                      className={
                        styles.cropControls
                      }
                    >
                      <div
                        className={
                          styles.zoomControl
                        }
                      >
                        <div
                          className={
                            styles.zoomLabels
                          }
                        >
                          <span>
                            Масштаб
                          </span>
                          <strong>
                            {cropZoom.toFixed(2)}×
                          </strong>
                        </div>

                        <div
                          className={
                            styles.zoomRow
                          }
                        >
                          <button
                            type="button"
                            onClick={() =>
                              changeCropZoom(
                                cropZoom - 0.1,
                              )
                            }
                            aria-label="Зменшити масштаб"
                          >
                            −
                          </button>

                          <input
                            type="range"
                            min="1"
                            max="3"
                            step="0.01"
                            value={cropZoom}
                            onChange={(event) =>
                              changeCropZoom(
                                Number(
                                  event.target
                                    .value,
                                ),
                              )
                            }
                            aria-label="Масштаб кадру"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              changeCropZoom(
                                cropZoom + 0.1,
                              )
                            }
                            aria-label="Збільшити масштаб"
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div
                        className={
                          styles.cropActionsModern
                        }
                      >
                        <button
                          type="button"
                          className={
                            styles.cropReset
                          }
                          onClick={resetCrop}
                        >
                          Скинути
                        </button>

                        <button
                          type="button"
                          className={
                            styles.cropSaveModern
                          }
                          onClick={() =>
                            void saveCropPoint()
                          }
                        >
                          Зберегти кадр
                        </button>
                      </div>
                    </div>
                  </section>
                );
              })()}

            <div
              className={
                styles.optimizationNote
              }
            >
              <span className={styles.dot} />

              <div>
                <strong>
                  Автоматична оптимізація
                </strong>

                <p>
                  Оригінальні JPG / PNG вже
                  зберігаються у приватному
                  Supabase Storage. WebP та
                  обкладинку підключимо на
                  наступному кроці.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span>{label}</span>
      {children}
    </label>
  );
}

function PairRow({
  item,
  labelPlaceholder,
  valuePlaceholder,
  onChange,
  onRemove,
}: {
  item: SpecificationItem;
  labelPlaceholder: string;
  valuePlaceholder: string;
  onChange: (
    field: "label" | "value",
    value: string,
  ) => void;
  onRemove: () => void;
}) {
  return (
    <div className={styles.pairRow}>
      <input
        value={item.label}
        onChange={(event) =>
          onChange(
            "label",
            event.target.value,
          )
        }
        placeholder={labelPlaceholder}
        aria-label="Назва характеристики"
      />

      <input
        value={item.value}
        onChange={(event) =>
          onChange(
            "value",
            event.target.value,
          )
        }
        placeholder={valuePlaceholder}
        aria-label={
          item.label
            ? `Значення: ${item.label}`
            : "Значення характеристики"
        }
      />

      <button
        type="button"
        onClick={onRemove}
        aria-label={
          item.label
            ? `Видалити ${item.label}`
            : "Видалити позицію"
        }
        title="Видалити"
      >
        ×
      </button>
    </div>
  );
}