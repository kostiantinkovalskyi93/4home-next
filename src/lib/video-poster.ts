const POSTER_MAX_WIDTH = 1280;
const POSTER_MAX_HEIGHT = 1280;
const POSTER_QUALITY = 0.82;

function waitForEvent(
  target: EventTarget,
  eventName: string,
  errorName = "error",
) {
  return new Promise<void>((resolve, reject) => {
    const handleSuccess = () => {
      cleanup();
      resolve();
    };

    const handleError = () => {
      cleanup();
      reject(new Error("Не вдалося прочитати відео для poster-зображення."));
    };

    const cleanup = () => {
      target.removeEventListener(eventName, handleSuccess);
      target.removeEventListener(errorName, handleError);
    };

    target.addEventListener(eventName, handleSuccess, { once: true });
    target.addEventListener(errorName, handleError, { once: true });
  });
}

function canvasToWebp(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Браузер не зміг створити WebP poster для відео."));
          return;
        }

        resolve(blob);
      },
      "image/webp",
      POSTER_QUALITY,
    );
  });
}

export async function createVideoPoster(videoFile: File) {
  const sourceUrl = URL.createObjectURL(videoFile);
  const video = document.createElement("video");

  video.muted = true;
  video.playsInline = true;
  video.preload = "metadata";
  video.src = sourceUrl;

  try {
    await waitForEvent(video, "loadedmetadata");

    if (!video.videoWidth || !video.videoHeight) {
      throw new Error("Відео не містить доступного кадру для poster-зображення.");
    }

    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    const targetTime = duration > 0
      ? Math.min(Math.max(duration * 0.08, 0.1), Math.max(duration - 0.1, 0.1), 1)
      : 0;

    if (targetTime > 0) {
      video.currentTime = targetTime;
      await waitForEvent(video, "seeked");
    } else {
      await waitForEvent(video, "loadeddata");
    }

    const scale = Math.min(
      1,
      POSTER_MAX_WIDTH / video.videoWidth,
      POSTER_MAX_HEIGHT / video.videoHeight,
    );
    const width = Math.max(1, Math.round(video.videoWidth * scale));
    const height = Math.max(1, Math.round(video.videoHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error("Не вдалося підготувати canvas для poster-зображення.");
    }

    context.drawImage(video, 0, 0, width, height);
    const blob = await canvasToWebp(canvas);
    const baseName = videoFile.name.replace(/\.[^.]+$/, "") || "video";

    return new File([blob], `${baseName}-poster.webp`, {
      type: "image/webp",
      lastModified: Date.now(),
    });
  } finally {
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(sourceUrl);
  }
}
