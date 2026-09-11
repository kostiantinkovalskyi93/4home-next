import { createClient } from "@/lib/supabase/server";

export type PublicPortfolioCategory =
  | "Кухні"
  | "Розпашні шафи"
  | "Шафи-купе"
  | "Інші меблі";

export type PublicPortfolioImage = {
  src: string;
  alt: string;
};

export type PublicPortfolioMedia = {
  type: "photo" | "video";
  src: string;
  posterSrc?: string;
  alt: string;
};

export type PublicPortfolioProject = {
  id: string;
  slug: string;
  title: string;
  category: PublicPortfolioCategory;
  coverImage: string;
  images: PublicPortfolioImage[];
  media: PublicPortfolioMedia[];
  shortDescription: string | null;
  clientTask: string | null;
  solution: string | null;
  materials: Array<{ label: string; value: string }>;
  hardware: Array<{ label: string; value: string }>;
  features: string | null;
  year: number | null;
  location: string | null;
  color: string | null;
  productionTerm: string | null;
};

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: "kitchen" | "wardrobe" | "furniture";
  wardrobe_type: "hinged" | "sliding" | null;
  short_description: string | null;
  client_task: string | null;
  solution: string | null;
  materials: unknown;
  hardware: unknown;
  features: string | null;
  year: number | null;
  location: string | null;
  color: string | null;
  production_term: string | null;
};

type MediaRow = {
  id: string;
  project_id: string;
  media_type: "photo" | "video";
  web_path: string | null;
  card_path: string | null;
  video_poster_path: string | null;
  sort_order: number;
  is_cover: boolean;
  processing_status:
    | "pending"
    | "processing"
    | "ready"
    | "failed";
};

const PROJECT_COLUMNS =
  "id, slug, title, category, wardrobe_type, short_description, client_task, solution, materials, hardware, features, year, location, color, production_term";

const MEDIA_COLUMNS =
  "id, project_id, media_type, web_path, card_path, video_poster_path, sort_order, is_cover, processing_status";

function mapCategory(
  project: ProjectRow,
): PublicPortfolioCategory {
  if (project.category === "kitchen") {
    return "Кухні";
  }

  if (project.category === "furniture") {
    return "Інші меблі";
  }

  return project.wardrobe_type === "sliding"
    ? "Шафи-купе"
    : "Розпашні шафи";
}

function mapKeyValueList(
  value: unknown,
): Array<{ label: string; value: string }> {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("label" in item) ||
      !("value" in item) ||
      typeof item.label !== "string" ||
      typeof item.value !== "string"
    ) {
      return [];
    }

    return [
      {
        label: item.label,
        value: item.value,
      },
    ];
  });
}

function buildPublicProject(
  project: ProjectRow,
  mediaRows: MediaRow[],
  getPublicUrl: (
    bucket: string,
    path: string,
  ) => string,
): PublicPortfolioProject | null {
  const projectMedia = mediaRows.filter(
    (item) =>
      item.project_id === project.id &&
      item.processing_status === "ready" &&
      Boolean(item.web_path),
  );

  const photos = projectMedia.filter(
    (item) => item.media_type === "photo",
  );

  const cover =
    photos.find(
      (item) =>
        item.is_cover &&
        Boolean(item.card_path),
    ) ??
    photos.find((item) =>
      Boolean(item.card_path),
    );

  if (
    !cover?.card_path ||
    !cover.web_path ||
    photos.length === 0
  ) {
    return null;
  }

  const orderedMedia = [
    cover,
    ...projectMedia.filter(
      (item) => item.id !== cover.id,
    ),
  ];

  const orderedPhotos = [
    cover,
    ...photos.filter(
      (item) => item.id !== cover.id,
    ),
  ];

  const coverImage = getPublicUrl(
    "portfolio-public",
    cover.card_path,
  );

  const images: PublicPortfolioImage[] =
    orderedPhotos.map((item, index) => ({
      src: getPublicUrl(
        "portfolio-public",
        item.web_path!,
      ),
      alt:
        index === 0
          ? `${project.title} — 4HOME`
          : `${project.title} — фото ${index + 1}`,
    }));

  const mixedMedia: PublicPortfolioMedia[] =
    orderedMedia.map((item, index) => ({
      type: item.media_type,
      src: getPublicUrl(
        item.media_type === "video"
          ? "portfolio-videos"
          : "portfolio-public",
        item.web_path!,
      ),
      posterSrc:
        item.media_type === "video" &&
        item.video_poster_path
          ? getPublicUrl(
              "portfolio-video-posters",
              item.video_poster_path,
            )
          : undefined,
      alt:
        item.media_type === "video"
          ? `${project.title} — відео ${index + 1}`
          : index === 0
            ? `${project.title} — 4HOME`
            : `${project.title} — фото ${index + 1}`,
    }));

  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    category: mapCategory(project),
    coverImage,
    images,
    media: mixedMedia,
    shortDescription:
      project.short_description,
    clientTask: project.client_task,
    solution: project.solution,
    materials: mapKeyValueList(
      project.materials,
    ),
    hardware: mapKeyValueList(
      project.hardware,
    ),
    features: project.features,
    year: project.year,
    location: project.location,
    color: project.color,
    productionTerm: project.production_term,
  };
}

export async function getPublishedPortfolioProjects() {
  const supabase = await createClient();

  const {
    data: projectRows,
    error: projectError,
  } = await supabase
    .from("portfolio_projects")
    .select(PROJECT_COLUMNS)
    .eq("status", "published")
    .order("published_at", {
      ascending: false,
    });

  if (projectError) {
    console.error(
      "Failed to load published portfolio:",
      projectError,
    );

    throw new Error(
      "Не вдалося завантажити портфоліо.",
    );
  }

  const projects =
    (projectRows ?? []) as ProjectRow[];

  if (projects.length === 0) {
    return [] as PublicPortfolioProject[];
  }

  const {
    data: mediaRows,
    error: mediaError,
  } = await supabase
    .from("portfolio_media")
    .select(MEDIA_COLUMNS)
    .in(
      "project_id",
      projects.map((project) => project.id),
    )
    .eq("processing_status", "ready")
    .order("sort_order", {
      ascending: true,
    });

  if (mediaError) {
    console.error(
      "Failed to load published portfolio media:",
      mediaError,
    );

    throw new Error(
      "Не вдалося завантажити медіа портфоліо.",
    );
  }

  const media = (mediaRows ?? []) as MediaRow[];

  const getPublicUrl = (
    bucket: string,
    path: string,
  ) =>
    supabase.storage
      .from(bucket)
      .getPublicUrl(path).data.publicUrl;

  return projects.flatMap((project) => {
    const mapped = buildPublicProject(
      project,
      media,
      getPublicUrl,
    );

    return mapped ? [mapped] : [];
  });
}

export async function getPublishedPortfolioProject(
  slug: string,
) {
  const supabase = await createClient();

  const {
    data: projectRow,
    error: projectError,
  } = await supabase
    .from("portfolio_projects")
    .select(PROJECT_COLUMNS)
    .eq("status", "published")
    .eq("slug", slug)
    .maybeSingle();

  if (projectError) {
    console.error(
      "Failed to load published portfolio project:",
      projectError,
    );

    throw new Error(
      "Не вдалося завантажити проєкт портфоліо.",
    );
  }

  if (!projectRow) {
    return null;
  }

  const project = projectRow as ProjectRow;

  const {
    data: mediaRows,
    error: mediaError,
  } = await supabase
    .from("portfolio_media")
    .select(MEDIA_COLUMNS)
    .eq("project_id", project.id)
    .eq("processing_status", "ready")
    .order("sort_order", {
      ascending: true,
    });

  if (mediaError) {
    console.error(
      "Failed to load published project media:",
      mediaError,
    );

    throw new Error(
      "Не вдалося завантажити медіа проєкту.",
    );
  }

  const getPublicUrl = (
    bucket: string,
    path: string,
  ) =>
    supabase.storage
      .from(bucket)
      .getPublicUrl(path).data.publicUrl;

  return buildPublicProject(
    project,
    (mediaRows ?? []) as MediaRow[],
    getPublicUrl,
  );
}
