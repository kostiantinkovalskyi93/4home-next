import { notFound } from "next/navigation";

import {
  NewProjectForm,
  type StoredPortfolioMedia,
} from "../../../../components/NewProjectForm";

import { createClient } from "@/lib/supabase/server";

type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type MediaRow = {
  id: string;
  media_type: "photo" | "video";
  original_path: string | null;
  web_path: string | null;
  card_path: string | null;
  video_poster_path: string | null;
  sort_order: number;
  is_cover: boolean;
  focal_x: number;
  focal_y: number;
  crop_zoom: number;
  processing_status:
    | "pending"
    | "processing"
    | "ready"
    | "failed";
};

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project, error: projectError } =
    await supabase
      .from("portfolio_projects")
      .select(`
        id,
        slug,
        title,
        category,
        wardrobe_type,
        short_description,
        materials,
        hardware,
        features,
        year,
        location,
        color,
        production_term,
        status
      `)
      .eq("id", id)
      .maybeSingle();

  if (projectError) {
    console.error(
      "Failed to load portfolio project:",
      projectError,
    );

    notFound();
  }

  if (!project) {
    notFound();
  }

  const { data: mediaRows, error: mediaError } =
    await supabase
      .from("portfolio_media")
      .select(`
        id,
        media_type,
        original_path,
        web_path,
        card_path,
        video_poster_path,
        sort_order,
        is_cover,
        focal_x,
        focal_y,
        crop_zoom,
        processing_status
      `)
      .eq("project_id", id)
      .order("sort_order", {
        ascending: true,
      });

  if (mediaError) {
    console.error(
      "Failed to load portfolio media:",
      mediaError,
    );
  }

  const initialMedia: StoredPortfolioMedia[] = [];

  for (const media of (mediaRows ?? []) as MediaRow[]) {
    let previewUrl: string | null = null;

    if (media.media_type === "video") {
      if (
        media.processing_status !== "ready" ||
        !media.web_path
      ) {
        continue;
      }

      previewUrl = supabase.storage
        .from("portfolio-videos")
        .getPublicUrl(media.web_path)
        .data.publicUrl;
    } else if (
      media.processing_status === "ready" &&
      media.web_path
    ) {
      previewUrl = supabase.storage
        .from("portfolio-public")
        .getPublicUrl(media.web_path)
        .data.publicUrl;
    } else if (media.original_path) {
      const {
        data: signedData,
        error: signedError,
      } = await supabase.storage
        .from("portfolio-originals")
        .createSignedUrl(
          media.original_path,
          3600,
        );

      if (signedError) {
        console.error(
          `Failed to create signed URL for media ${media.id}:`,
          signedError,
        );
        continue;
      }

      previewUrl = signedData.signedUrl;
    }

    if (!previewUrl) {
      continue;
    }

    const sourcePath =
      media.media_type === "video"
        ? media.web_path
        : media.original_path;

    const fileName =
      sourcePath?.split("/").pop() ??
      (media.media_type === "video"
        ? "Відео"
        : "Фото");

    const posterUrl =
      media.media_type === "video" && media.video_poster_path
        ? supabase.storage
            .from("portfolio-video-posters")
            .getPublicUrl(media.video_poster_path).data.publicUrl
        : undefined;

    initialMedia.push({
      id: media.id,
      name: fileName,
      type: media.media_type,
      url: previewUrl,
      originalPath:
        media.original_path ?? undefined,
      webPath: media.web_path,
      cardPath: media.card_path,
      posterPath: media.video_poster_path,
      posterUrl,
      sortOrder: media.sort_order,
      isCover:
        media.media_type === "photo" &&
        media.is_cover,
      processingStatus:
        media.processing_status,
      focalX: media.focal_x,
      focalY: media.focal_y,
      cropZoom: media.crop_zoom,
    });
  }

  return (
    <NewProjectForm
      initialProject={project}
      initialMedia={initialMedia}
    />
  );
}
