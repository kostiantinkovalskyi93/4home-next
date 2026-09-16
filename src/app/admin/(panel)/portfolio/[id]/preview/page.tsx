import { notFound } from "next/navigation";

import {
  ProjectDetail,
  type ProjectDetailMedia,
} from "@/components/portfolio/ProjectDetail";
import {
  getBunnyVideoPlaybackUrl,
  getBunnyVideoThumbnailUrl,
} from "@/lib/bunny/delivery";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

type MediaRow = {
  id: string;
  media_type: "photo" | "video";
  web_path: string | null;
  video_poster_path: string | null;
  storage_provider: string | null;
  bunny_video_id: string | null;
  sort_order: number;
};

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

  const {
    data: project,
    error: projectError,
  } = await supabase
    .from("portfolio_projects")
    .select(
      "id,title,category,wardrobe_type,short_description,client_task,solution,materials,hardware,features,year,location,color,production_term",
    )
    .eq("id", id)
    .maybeSingle();

  if (projectError) {
    console.error(
      "Failed to load portfolio preview project:",
      projectError,
    );

    throw new Error(
      "Не вдалося завантажити попередній перегляд.",
    );
  }

  if (!project) {
    notFound();
  }

  const {
    data: mediaRows,
    error: mediaError,
  } = await supabase
    .from("portfolio_media")
    .select(
      "id,media_type,web_path,video_poster_path,storage_provider,bunny_video_id,sort_order",
    )
    .eq("project_id", id)
    .eq("processing_status", "ready")
    .order("sort_order", { ascending: true });

  if (mediaError) {
    console.error(
      "Failed to load portfolio preview media:",
      mediaError,
    );

    throw new Error(
      "Не вдалося завантажити медіа попереднього перегляду.",
    );
  }

  const media: ProjectDetailMedia[] = [];

  for (const item of (mediaRows ?? []) as MediaRow[]) {
    const index = media.length;

    if (item.media_type === "photo") {
      if (!item.web_path) {
        continue;
      }

      media.push({
        type: "photo",
        src: supabase.storage
          .from("portfolio-public")
          .getPublicUrl(item.web_path).data.publicUrl,
        alt: `${project.title} — фото ${index + 1}`,
      });

      continue;
    }

    if (
      item.storage_provider === "bunny" &&
      item.bunny_video_id
    ) {
      media.push({
        type: "video",
        src: getBunnyVideoPlaybackUrl(
          item.bunny_video_id,
        ),
        posterSrc: getBunnyVideoThumbnailUrl(
          item.bunny_video_id,
        ),
        alt: `${project.title} — відео ${index + 1}`,
      });

      continue;
    }

    if (!item.web_path) {
      continue;
    }

    media.push({
      type: "video",
      src: supabase.storage
        .from("portfolio-videos")
        .getPublicUrl(item.web_path).data.publicUrl,
      posterSrc: item.video_poster_path
        ? supabase.storage
            .from("portfolio-video-posters")
            .getPublicUrl(item.video_poster_path).data.publicUrl
        : undefined,
      alt: `${project.title} — відео ${index + 1}`,
    });
  }

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
        clientTask: project.client_task,
        solution: project.solution,
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