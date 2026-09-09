import { notFound } from "next/navigation";

import {
  ProjectDetail,
  type ProjectDetailMedia,
} from "@/components/portfolio/ProjectDetail";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

const specs = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter(
          (item): item is { label: string; value: string } =>
            !!item &&
            typeof item === "object" &&
            "label" in item &&
            "value" in item,
        )
        .map((item) => ({
          label: String(item.label),
          value: String(item.value),
        }))
    : [];

export default async function Preview({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("portfolio_projects")
    .select(
      "id,title,category,wardrobe_type,short_description,materials,hardware,features,year,location,color,production_term",
    )
    .eq("id", id)
    .maybeSingle();

  if (!project) notFound();

  const { data: mediaRows } = await supabase
    .from("portfolio_media")
    .select("id,media_type,web_path,video_poster_path,sort_order")
    .eq("project_id", id)
    .eq("processing_status", "ready")
    .order("sort_order", { ascending: true });

  const media: ProjectDetailMedia[] = (mediaRows ?? [])
    .filter(
      (
        item,
      ): item is typeof item & {
        media_type: "photo" | "video";
        web_path: string;
      } =>
        (item.media_type === "photo" || item.media_type === "video") &&
        Boolean(item.web_path),
    )
    .map((item, index) => ({
      type: item.media_type,
      src: supabase.storage
        .from(
          item.media_type === "video"
            ? "portfolio-videos"
            : "portfolio-public",
        )
        .getPublicUrl(item.web_path).data.publicUrl,
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
    }));

  const images = media
    .filter((item) => item.type === "photo")
    .map(({ src, alt }) => ({ src, alt }));

  const category =
    project.category === "kitchen"
      ? "Кухні"
      : project.category === "furniture"
        ? "Інші меблі"
        : project.wardrobe_type === "sliding"
          ? "Шафа-купе"
          : "Розпашна шафа";

  return (
    <ProjectDetail
      preview
      editHref={`/admin/portfolio/${id}/edit`}
      project={{
        title: project.title,
        category,
        shortDescription: project.short_description,
        materials: specs(project.materials),
        hardware: specs(project.hardware),
        features: project.features,
        year: project.year,
        location: project.location,
        color: project.color,
        productionTerm: project.production_term,
        images,
        media,
      }}
    />
  );
}
