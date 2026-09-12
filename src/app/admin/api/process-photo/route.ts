import { NextResponse } from "next/server";
import sharp from "sharp";

import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ProcessPhotoBody = {
  mediaId?: unknown;
  focalX?: unknown;
  focalY?: unknown;
  cropZoom?: unknown;
};

function normalizedCoordinate(
  value: unknown,
  fallback: number,
) {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return fallback;
  }

  return Math.min(1, Math.max(0, value));
}

function calculateFourByThreeCrop(
  width: number,
  height: number,
  focalX: number,
  focalY: number,
  cropZoom: number,
) {
  const targetRatio = 4 / 3;
  const sourceRatio = width / height;
  const safeZoom = Math.min(
    3,
    Math.max(1, cropZoom),
  );

  let baseCropWidth = width;
  let baseCropHeight = height;

  if (sourceRatio > targetRatio) {
    baseCropWidth =
      height * targetRatio;
  } else {
    baseCropHeight =
      width / targetRatio;
  }

  const cropWidth = Math.max(
    1,
    Math.round(baseCropWidth / safeZoom),
  );

  const cropHeight = Math.max(
    1,
    Math.round(baseCropHeight / safeZoom),
  );

  const halfWidth = cropWidth / 2;
  const halfHeight = cropHeight / 2;

  const centerX = Math.min(
    width - halfWidth,
    Math.max(
      halfWidth,
      focalX * width,
    ),
  );

  const centerY = Math.min(
    height - halfHeight,
    Math.max(
      halfHeight,
      focalY * height,
    ),
  );

  const left = Math.round(
    Math.min(
      width - cropWidth,
      Math.max(
        0,
        centerX - halfWidth,
      ),
    ),
  );

  const top = Math.round(
    Math.min(
      height - cropHeight,
      Math.max(
        0,
        centerY - halfHeight,
      ),
    ),
  );

  return {
    left,
    top,
    width: cropWidth,
    height: cropHeight,
    focalX: centerX / width,
    focalY: centerY / height,
    cropZoom: safeZoom,
  };
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { error: "Потрібна авторизація адміністратора." },
      { status: 401 },
    );
  }

  const { data: admin, error: adminError } =
    await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();

  if (adminError || !admin) {
    return NextResponse.json(
      { error: "Недостатньо прав для обробки фото." },
      { status: 403 },
    );
  }

  let body: ProcessPhotoBody;

  try {
    body = (await request.json()) as ProcessPhotoBody;
  } catch {
    return NextResponse.json(
      { error: "Некоректний запит." },
      { status: 400 },
    );
  }

  if (
    typeof body.mediaId !== "string" ||
    body.mediaId.length < 1
  ) {
    return NextResponse.json(
      { error: "Не передано mediaId." },
      { status: 400 },
    );
  }

  const mediaId = body.mediaId;

  const { data: media, error: mediaError } =
    await supabase
      .from("portfolio_media")
      .select(`
        id,
        project_id,
        media_type,
        original_path,
        card_path,
        focal_x,
        focal_y,
        crop_zoom
      `)
      .eq("id", mediaId)
      .maybeSingle();

  if (mediaError) {
    console.error(
      "Failed to load portfolio photo for processing:",
      mediaError,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося завантажити фотографію для обробки.",
      },
      { status: 500 },
    );
  }

  if (!media) {
    return NextResponse.json(
      { error: "Фото не знайдено." },
      { status: 404 },
    );
  }

  if (
    media.media_type !== "photo" ||
    !media.original_path
  ) {
    return NextResponse.json(
      { error: "Медіафайл не є фотографією." },
      { status: 400 },
    );
  }

  const focalX = normalizedCoordinate(
    body.focalX,
    media.focal_x ?? 0.5,
  );
  const focalY = normalizedCoordinate(
    body.focalY,
    media.focal_y ?? 0.5,
  );

  const cropZoom =
    typeof body.cropZoom === "number" &&
    Number.isFinite(body.cropZoom)
      ? Math.min(
          3,
          Math.max(1, body.cropZoom),
        )
      : Math.min(
          3,
          Math.max(
            1,
            media.crop_zoom ?? 1,
          ),
        );

  const { error: processingStatusError } =
    await supabase
      .from("portfolio_media")
      .update({
        processing_status: "processing",
      })
      .eq("id", mediaId);

  if (processingStatusError) {
    console.error(
      "Failed to mark portfolio photo as processing:",
      processingStatusError,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося розпочати обробку фотографії.",
      },
      { status: 500 },
    );
  }

  const galleryPath =
    `${media.project_id}/gallery/${mediaId}.webp`;
  const cardVersion = Date.now();
  const cardPath =
    `${media.project_id}/card/${mediaId}-${cardVersion}.webp`;

  try {
    const { data: original, error: downloadError } =
      await supabase.storage
        .from("portfolio-originals")
        .download(media.original_path);

    if (downloadError || !original) {
      throw downloadError ?? new Error(
        "Не вдалося завантажити original.",
      );
    }

    const inputBuffer = Buffer.from(
      await original.arrayBuffer(),
    );

    const {
      data: rotatedBuffer,
      info: rotatedInfo,
    } = await sharp(inputBuffer, {
      failOn: "error",
    })
      .rotate()
      .toBuffer({ resolveWithObject: true });

    const width = rotatedInfo.width;
    const height = rotatedInfo.height;

    if (!width || !height) {
      throw new Error(
        "Не вдалося визначити розмір фотографії.",
      );
    }

    const galleryBuffer = await sharp(rotatedBuffer)
      .resize({
        width: 1920,
        height: 1920,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 88,
        effort: 4,
      })
      .toBuffer();

    const crop = calculateFourByThreeCrop(
      width,
      height,
      focalX,
      focalY,
      cropZoom,
    );

    const cardBuffer = await sharp(rotatedBuffer)
      .extract(crop)
      .resize({
        width: 1200,
        height: 900,
        fit: "fill",
        withoutEnlargement: false,
      })
      .webp({
        quality: 88,
        effort: 4,
      })
      .toBuffer();

    const { error: galleryUploadError } =
      await supabase.storage
        .from("portfolio-public")
        .upload(galleryPath, galleryBuffer, {
          contentType: "image/webp",
          cacheControl: "31536000",
          upsert: true,
        });

    if (galleryUploadError) {
      throw galleryUploadError;
    }

    const { error: cardUploadError } =
      await supabase.storage
        .from("portfolio-public")
        .upload(cardPath, cardBuffer, {
          contentType: "image/webp",
          cacheControl: "31536000",
          upsert: true,
        });

    if (cardUploadError) {
      throw cardUploadError;
    }

    const { error: updateError } = await supabase
      .from("portfolio_media")
      .update({
        web_path: galleryPath,
        card_path: cardPath,
        width,
        height,
        focal_x: crop.focalX,
        focal_y: crop.focalY,
        crop_zoom: crop.cropZoom,
        processing_status: "ready",
      })
      .eq("id", mediaId);

    if (updateError) {
      throw updateError;
    }

    if (
      media.card_path &&
      media.card_path !== cardPath
    ) {
      const { error: oldCardCleanupError } =
        await supabase.storage
          .from("portfolio-public")
          .remove([media.card_path]);

      if (oldCardCleanupError) {
        console.error(
          "New card saved, but old card cleanup failed:",
          oldCardCleanupError,
        );
      }
    }

    const galleryUrl = supabase.storage
      .from("portfolio-public")
      .getPublicUrl(galleryPath).data.publicUrl;

    const cardUrl = supabase.storage
      .from("portfolio-public")
      .getPublicUrl(cardPath).data.publicUrl;

    return NextResponse.json({
      ok: true,
      mediaId,
      galleryPath,
      cardPath,
      galleryUrl,
      cardUrl,
      width,
      height,
      focalX: crop.focalX,
      focalY: crop.focalY,
      cropZoom: crop.cropZoom,
    });
  } catch (error) {
    console.error(
      "Failed to process portfolio photo:",
      error,
    );

    await supabase
      .from("portfolio_media")
      .update({ processing_status: "failed" })
      .eq("id", mediaId);

    return NextResponse.json(
      {
        error:
          "Оригінал збережено, але WebP-версії створити не вдалося.",
      },
      { status: 500 },
    );
  }
}
