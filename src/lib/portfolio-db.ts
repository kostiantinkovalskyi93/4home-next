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
  processing_status: "pending" | "processing" | "ready" | "failed";
};

function mapCategory(project: ProjectRow): PublicPortfolioCategory {
  if (project.category === "kitchen") return "Кухні";
  if (project.category === "furniture") return "Інші меблі";

  return project.wardrobe_type === "sliding"
    ? "Шафи-купе"
    : "Розпашні шафи";
}

export async function getPublishedPortfolioProjects() {
  const supabase = await createClient();

  const { data: projectRows, error: projectError } = await supabase
    .from("portfolio_projects")
    .select(
      "id, slug, title, category, wardrobe_type, short_description, materials, hardware, features, year, location, color, production_term",
    )
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (projectError) {
    console.error("Failed to load published portfolio:", projectError);
    return [] as PublicPortfolioProject[];
  }

  const projects = (projectRows ?? []) as ProjectRow[];
  if (!projects.length) return [];

  const { data: mediaRows, error: mediaError } = await supabase
    .from("portfolio_media")
    .select(
      "id, project_id, media_type, web_path, card_path, video_poster_path, sort_order, is_cover, processing_status",
    )
    .in(
      "project_id",
      projects.map((project) => project.id),
    )
    .eq("processing_status", "ready")
    .order("sort_order", { ascending: true });

  if (mediaError) {
    console.error("Failed to load published portfolio media:", mediaError);
    return [];
  }

  const media = (mediaRows ?? []) as MediaRow[];

  return projects.flatMap((project) => {
    const projectMedia = media.filter(
      (item) => item.project_id === project.id && item.web_path,
    );

    const photos = projectMedia.filter(
      (item) => item.media_type === "photo",
    );

    const cover =
      photos.find((item) => item.is_cover && item.card_path) ??
      photos.find((item) => item.card_path);

    if (!cover?.card_path || !photos.length) return [];

    const coverImage = supabase.storage
      .from("portfolio-public")
      .getPublicUrl(cover.card_path).data.publicUrl;

    const images = photos.map((item, index) => ({
      src: supabase.storage
        .from("portfolio-public")
        .getPublicUrl(item.web_path!).data.publicUrl,
      alt:
        index === 0
          ? `${project.title} — 4HOME`
          : `${project.title} — фото ${index + 1}`,
    }));

    const mixedMedia: PublicPortfolioMedia[] = projectMedia.map(
      (item, index) => ({
        type: item.media_type,
        src: supabase.storage
          .from(
            item.media_type === "video"
              ? "portfolio-videos"
              : "portfolio-public",
          )
          .getPublicUrl(item.web_path!).data.publicUrl,
        posterSrc:
          item.media_type === "video" && item.video_poster_path
            ? supabase.storage
                .from("portfolio-video-posters")
                .getPublicUrl(item.video_poster_path).data.publicUrl
            : undefined,
        alt:
          item.media_type === "video"
            ? `${project.title} — відео ${index + 1}`
            : `${project.title} — фото ${index + 1}`,
      }),
    );

    return [
      {
        id: project.id,
        slug: project.slug,
        title: project.title,
        category: mapCategory(project),
        coverImage,
        images,
        media: mixedMedia,
        shortDescription: project.short_description,
        materials: Array.isArray(project.materials)
          ? (project.materials as Array<{ label: string; value: string }>)
          : [],
        hardware: Array.isArray(project.hardware)
          ? (project.hardware as Array<{ label: string; value: string }>)
          : [],
        features: project.features,
        year: project.year,
        location: project.location,
        color: project.color,
        productionTerm: project.production_term,
      },
    ];
  });
}

export async function getPublishedPortfolioProject(slug: string) {
  const projects = await getPublishedPortfolioProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}
