type ProgressCallback = (progress: number) => void;

const FFMPEG_CORE_VERSION = "0.12.10";
const FFMPEG_CORE_BASE_URL =
  `https://cdn.jsdelivr.net/npm/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/umd`;

let ffmpegPromise:
  | Promise<import("@ffmpeg/ffmpeg").FFmpeg>
  | null = null;

function getExtension(fileName: string) {
  return (
    fileName
      .trim()
      .toLowerCase()
      .match(/\.([a-z0-9]+)$/)?.[1] ?? ""
  );
}

export function shouldTranscodeVideo(file: File) {
  const extension = getExtension(file.name);

  return (
    extension === "mov" ||
    extension === "webm" ||
    file.type === "video/quicktime" ||
    file.type === "video/webm"
  );
}

async function getFfmpeg() {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      const [
        { FFmpeg },
        { toBlobURL },
      ] = await Promise.all([
        import("@ffmpeg/ffmpeg"),
        import("@ffmpeg/util"),
      ]);

      const ffmpeg = new FFmpeg();

      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${FFMPEG_CORE_BASE_URL}/ffmpeg-core.js`,
          "text/javascript",
        ),
        wasmURL: await toBlobURL(
          `${FFMPEG_CORE_BASE_URL}/ffmpeg-core.wasm`,
          "application/wasm",
        ),
      });

      return ffmpeg;
    })().catch((error) => {
      ffmpegPromise = null;
      throw error;
    });
  }

  return ffmpegPromise;
}

export async function transcodeVideoForWeb(
  sourceFile: File,
  onProgress?: ProgressCallback,
) {
  const [{ fetchFile }, ffmpeg] =
    await Promise.all([
      import("@ffmpeg/util"),
      getFfmpeg(),
    ]);

  const token = crypto.randomUUID();
  const sourceExtension =
    getExtension(sourceFile.name) || "mov";
  const inputName =
    `input-${token}.${sourceExtension}`;
  const outputName =
    `output-${token}.mp4`;

  const progressListener = ({
    progress,
  }: {
    progress: number;
    time: number;
  }) => {
    if (!onProgress || !Number.isFinite(progress)) {
      return;
    }

    const percentage = Math.max(
      1,
      Math.min(99, Math.round(progress * 100)),
    );

    onProgress(percentage);
  };

  ffmpeg.on("progress", progressListener);

  try {
    onProgress?.(1);

    await ffmpeg.writeFile(
      inputName,
      await fetchFile(sourceFile),
    );

    const exitCode = await ffmpeg.exec([
      "-i",
      inputName,
      "-map_metadata",
      "-1",
      "-vf",
      "scale=w='min(1920,iw)':h='min(1080,ih)':force_original_aspect_ratio=decrease:force_divisible_by=2",
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
      outputName,
    ]);

    if (exitCode != 0) {
      throw new Error(
        "FFmpeg не зміг підготувати web-версію відео.",
      );
    }

    const output =
      await ffmpeg.readFile(outputName);

    if (typeof output === "string") {
      throw new Error(
        "Отримано некоректний результат обробки відео.",
      );
    }

    const bytes =
      new Uint8Array(output.byteLength);
    bytes.set(output);

    const baseName =
      sourceFile.name.replace(/\.[^.]+$/, "") ||
      "video";

    onProgress?.(100);

    return new File(
      [bytes],
      `${baseName}.mp4`,
      {
        type: "video/mp4",
        lastModified: Date.now(),
      },
    );
  } finally {
    ffmpeg.off("progress", progressListener);

    await Promise.allSettled([
      ffmpeg.deleteFile(inputName),
      ffmpeg.deleteFile(outputName),
    ]);
  }
}
