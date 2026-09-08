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

export type PublicPortfolioProject = {
  id: string;
  slug: string;
  title: string;
  category: PublicPortfolioCategory;
  coverImage: string;
  images: PublicPortfolioImage[];
};

type ProjectRow = {
  id: string;
  slug: string;
  title: string;
  category: "kitchen" | "wardrobe" | "furniture";
  wardrobe_type: "hinged" | "sliding" | null;
};

type MediaRow = {
  id: string;
  project_id: string;
  web_path: string | null;
  card_path: string | null;
  sort_order: number;
  is_cover: boolean;
  processing_status: "pending" | "processing" | "ready" | "failed";
};

function mapCategory(
  project: ProjectRow,
): PublicPortfolioCategory {
  if (project.category === "kitchen") return "Кухні";
  if (project.category === "furniture") return "Інші меблі";
  return project.wardrobe_type === "sliding"
    ? "Шафи-купе"
    : "Розпашні шафи";
}

export async function getPublishedPortfolioProjects() {
  const supabase = await createClient();

  const { data: projectRows, error: projectError } =
    await supabase
      .from("portfolio_projects")
      .select("id, slug, title, category, wardrobe_type")
      .eq("status", "published")
      .order("published_at", { ascending: false });

  if (projectError) {
    console.error("Failed to load published portfolio:", projectError);
    return [] as PublicPortfolioProject[];
  }

  const projects=(projectRows ?? []) as ProjectRow[];
  if (!projects.length) return [];

  const { data: mediaRows, error: mediaError } =
    await supabase
      .from("portfolio_media")
      .select("id, project_id, web_path, card_path, sort_order, is_cover, processing_status")
      .in("project_id", projects.map((project)=>project.id))
      .eq("media_type","photo")
      .eq("processing_status","ready")
      .order("sort_order",{ascending:true});

  if (mediaError) {
    console.error("Failed to load published portfolio media:", mediaError);
    return [];
  }

  const media=(mediaRows ?? []) as MediaRow[];

  return projects.flatMap((project) => {
    const photos=media.filter((item)=>item.project_id===project.id && item.web_path);
    const cover=photos.find((item)=>item.is_cover && item.card_path)
      ?? photos.find((item)=>item.card_path);

    if (!cover?.card_path || !photos.length) return [];

    const coverImage=supabase.storage
      .from("portfolio-public")
      .getPublicUrl(cover.card_path).data.publicUrl;

    const images=photos.map((item,index)=>({
      src:supabase.storage
        .from("portfolio-public")
        .getPublicUrl(item.web_path!).data.publicUrl,
      alt:index===0
        ? `${project.title} — 4HOME`
        : `${project.title} — фото ${index+1}`,
    }));

    return [{
      id:project.id,
      slug:project.slug,
      title:project.title,
      category:mapCategory(project),
      coverImage,
      images,
    }];
  });
}

export async function getPublishedPortfolioProject(slug:string) {
  const projects=await getPublishedPortfolioProjects();
  return projects.find((project)=>project.slug===slug) ?? null;
}
