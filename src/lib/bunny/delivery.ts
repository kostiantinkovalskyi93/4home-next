const BUNNY_STREAM_CDN_HOSTNAME =
  "vz-3950be91-be9.b-cdn.net";

function normalizeVideoId(videoId: string) {
  return videoId.trim();
}

export function getBunnyVideoPlaybackUrl(
  videoId: string,
) {
  const normalizedVideoId =
    normalizeVideoId(videoId);

  return `https://${BUNNY_STREAM_CDN_HOSTNAME}/${normalizedVideoId}/playlist.m3u8`;
}

export function getBunnyVideoThumbnailUrl(
  videoId: string,
) {
  const normalizedVideoId =
    normalizeVideoId(videoId);

  return `https://${BUNNY_STREAM_CDN_HOSTNAME}/${normalizedVideoId}/thumbnail.jpg`;
}