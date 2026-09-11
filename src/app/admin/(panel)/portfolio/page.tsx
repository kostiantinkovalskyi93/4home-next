import { PortfolioBoard } from "../../components/PortfolioBoard";
import {
  mapProjectCategory,
  type AdminPortfolioProject,
  type PortfolioMediaDatabaseRow,
  type PortfolioProjectDatabaseRow,
} from "../../portfolio-projects";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminPortfolioPage() {
  const supabase = await createClient();

  const {
    data: projectRows,
    error: projectsError,
  } = await supabase
    .from("portfolio_projects")
    .select(`
      id,
      title,
      category,
      year,
      status
    `)
    .order("updated_at", {
      ascending: false,
    });

  if (projectsError) {
    console.error(
      "Failed to load portfolio projects:",
      projectsError,
    );

    throw new Error(
      "Не вдалося завантажити портфоліо.",
    );
  }

  const projectsData =
    (projectRows ?? []) as PortfolioProjectDatabaseRow[];

  const projectIds = projectsData.map(
    (project) => project.id,
  );

  let mediaData: PortfolioMediaDatabaseRow[] = [];

  if (projectIds.length > 0) {
    const {
      data: mediaRows,
      error: mediaError,
    } = await supabase
      .from("portfolio_media")
      .select(`
        project_id,
        media_type,
        sort_order,
        is_cover,
        card_path,
        processing_status
      `)
      .in("project_id", projectIds)
      .order("sort_order", {
        ascending: true,
      });

    if (mediaError) {
      console.error(
        "Failed to load portfolio media:",
        mediaError,
      );

      throw new Error(
        "Не вдалося завантажити медіа портфоліо.",
      );
    }

    mediaData =
      (mediaRows ?? []) as PortfolioMediaDatabaseRow[];
  }

  const projects: AdminPortfolioProject[] =
    projectsData.map((project) => {
      const projectMedia = mediaData.filter(
        (media) =>
          media.project_id === project.id,
      );

      const photos = projectMedia.filter(
        (media) =>
          media.media_type === "photo",
      );

      const videos = projectMedia.filter(
        (media) =>
          media.media_type === "video",
      );

      const cover =
        photos.find(
          (media) =>
            media.is_cover &&
            media.processing_status === "ready" &&
            Boolean(media.card_path),
        ) ??
        photos.find(
          (media) =>
            media.processing_status === "ready" &&
            Boolean(media.card_path),
        );

      const coverImage =
        cover?.card_path
          ? supabase.storage
              .from("portfolio-public")
              .getPublicUrl(cover.card_path)
              .data.publicUrl
          : null;

      return {
        id: project.id,
        title: project.title,
        category: mapProjectCategory(
          project.category,
        ),
        year: project.year,
        status: project.status,
        coverImage,
        photoCount: photos.length,
        videoCount: videos.length,
      };
    });

  return (
    <PortfolioBoard projects={projects} />
  );
}
