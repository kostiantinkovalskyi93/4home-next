import "server-only";

import { createHash } from "node:crypto";

const BUNNY_STREAM_API_BASE_URL =
  "https://video.bunnycdn.com";

export const BUNNY_STREAM_TUS_ENDPOINT =
  "https://video.bunnycdn.com/tusupload";

const DEFAULT_REQUEST_TIMEOUT_MS = 15_000;

const DEFAULT_UPLOAD_AUTHORIZATION_TTL_SECONDS =
  60 * 60;

type BunnyStreamConfiguration = {
  libraryId: string;
  apiKey: string;
};

type BunnyStreamRequestOptions = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  timeoutMs?: number;
};

export type BunnyStreamVideo = {
  videoLibraryId: number;
  guid: string;
  title: string;
  dateUploaded: string;
  views: number;
  isPublic: boolean;
  length: number;
  status: number;
  framerate: number;
  rotation: number;
  width: number;
  height: number;
  availableResolutions: string | null;
  thumbnailCount: number;
  encodeProgress: number;
  storageSize: number;
  captions: Array<{
    srclang: string;
    label: string;
  }>;
  hasMP4Fallback: boolean;
  collectionId: string;
  thumbnailFileName: string;
  averageWatchTime: number;
  totalWatchTime: number;
  category: string;
  chapters: Array<{
    title: string;
    start: number;
    end: number;
  }>;
  moments: Array<{
    label: string;
    timestamp: number;
  }>;
  metaTags: Array<{
    property: string;
    value: string;
  }>;
  transcodingMessages: Array<{
    timeStamp: string;
    level: number;
    issueCode: number;
    message: string;
    value: string;
  }>;
};

export type CreateBunnyStreamVideoInput = {
  title: string;
};

export type BunnyStreamUploadAuthorization = {
  endpoint: string;
  libraryId: string;
  videoId: string;
  authorizationSignature: string;
  authorizationExpire: number;
};

export class BunnyStreamError extends Error {
  readonly status: number | null;
  readonly responseBody: string | null;

  constructor(
    message: string,
    options?: {
      status?: number | null;
      responseBody?: string | null;
      cause?: unknown;
    },
  ) {
    super(message, {
      cause: options?.cause,
    });

    this.name = "BunnyStreamError";
    this.status = options?.status ?? null;
    this.responseBody =
      options?.responseBody ?? null;
  }
}

function getBunnyStreamConfiguration(): BunnyStreamConfiguration {
  const libraryId =
    process.env.BUNNY_STREAM_LIBRARY_ID?.trim();

  const apiKey =
    process.env.BUNNY_STREAM_API_KEY?.trim();

  if (!libraryId) {
    throw new BunnyStreamError(
      "Missing BUNNY_STREAM_LIBRARY_ID.",
    );
  }

  if (!/^\d+$/.test(libraryId)) {
    throw new BunnyStreamError(
      "BUNNY_STREAM_LIBRARY_ID must be numeric.",
    );
  }

  if (!apiKey) {
    throw new BunnyStreamError(
      "Missing BUNNY_STREAM_API_KEY.",
    );
  }

  return {
    libraryId,
    apiKey,
  };
}

function buildBunnyStreamUrl(
  libraryId: string,
  pathname: string,
) {
  const normalizedPathname =
    pathname.startsWith("/")
      ? pathname
      : `/${pathname}`;

  return `${BUNNY_STREAM_API_BASE_URL}/library/${libraryId}${normalizedPathname}`;
}

async function bunnyStreamRequest<T>(
  pathname: string,
  options: BunnyStreamRequestOptions = {},
): Promise<T> {
  const { libraryId, apiKey } =
    getBunnyStreamConfiguration();

  const controller = new AbortController();

  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ??
      DEFAULT_REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await fetch(
      buildBunnyStreamUrl(
        libraryId,
        pathname,
      ),
      {
        method: options.method ?? "GET",

        headers: {
          AccessKey: apiKey,
          Accept: "application/json",
          ...(options.body !== undefined
            ? {
                "Content-Type":
                  "application/json",
              }
            : {}),
        },

        body:
          options.body !== undefined
            ? JSON.stringify(options.body)
            : undefined,

        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      const responseBody = await response
        .text()
        .catch(() => "");

      throw new BunnyStreamError(
        `Bunny Stream request failed with status ${response.status}.`,
        {
          status: response.status,
          responseBody:
            responseBody || null,
        },
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    const responseText =
      await response.text();

    if (!responseText) {
      return undefined as T;
    }

    try {
      return JSON.parse(responseText) as T;
    } catch (error) {
      throw new BunnyStreamError(
        "Bunny Stream returned invalid JSON.",
        {
          status: response.status,
          responseBody: responseText,
          cause: error,
        },
      );
    }
  } catch (error) {
    if (error instanceof BunnyStreamError) {
      throw error;
    }

    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new BunnyStreamError(
        "Bunny Stream request timed out.",
        {
          cause: error,
        },
      );
    }

    throw new BunnyStreamError(
      "Bunny Stream request failed.",
      {
        cause: error,
      },
    );
  } finally {
    clearTimeout(timeout);
  }
}

function normalizeVideoId(videoId: string) {
  const normalizedVideoId =
    videoId.trim();

  if (!normalizedVideoId) {
    throw new BunnyStreamError(
      "Bunny Stream video ID is required.",
    );
  }

  return normalizedVideoId;
}

export async function createBunnyStreamVideo(
  input: CreateBunnyStreamVideoInput,
) {
  const title = input.title.trim();

  if (!title) {
    throw new BunnyStreamError(
      "Bunny Stream video title is required.",
    );
  }

  return bunnyStreamRequest<BunnyStreamVideo>(
    "/videos",
    {
      method: "POST",
      body: {
        title,
      },
    },
  );
}

export async function getBunnyStreamVideo(
  videoId: string,
) {
  const normalizedVideoId =
    normalizeVideoId(videoId);

  return bunnyStreamRequest<BunnyStreamVideo>(
    `/videos/${encodeURIComponent(
      normalizedVideoId,
    )}`,
  );
}

export async function deleteBunnyStreamVideo(
  videoId: string,
) {
  const normalizedVideoId =
    normalizeVideoId(videoId);

  await bunnyStreamRequest<void>(
    `/videos/${encodeURIComponent(
      normalizedVideoId,
    )}`,
    {
      method: "DELETE",
    },
  );
}

export function createBunnyStreamUploadAuthorization(
  videoId: string,
  ttlSeconds =
    DEFAULT_UPLOAD_AUTHORIZATION_TTL_SECONDS,
): BunnyStreamUploadAuthorization {
  const normalizedVideoId =
    normalizeVideoId(videoId);

  if (
    !Number.isInteger(ttlSeconds) ||
    ttlSeconds <= 0
  ) {
    throw new BunnyStreamError(
      "Bunny Stream upload authorization TTL must be a positive integer.",
    );
  }

  const { libraryId, apiKey } =
    getBunnyStreamConfiguration();

  const authorizationExpire =
    Math.floor(Date.now() / 1000) +
    ttlSeconds;

  const authorizationSignature =
    createHash("sha256")
      .update(
        `${libraryId}${apiKey}${authorizationExpire}${normalizedVideoId}`,
        "utf8",
      )
      .digest("hex");

  return {
    endpoint:
      BUNNY_STREAM_TUS_ENDPOINT,
    libraryId,
    videoId: normalizedVideoId,
    authorizationSignature,
    authorizationExpire,
  };
}