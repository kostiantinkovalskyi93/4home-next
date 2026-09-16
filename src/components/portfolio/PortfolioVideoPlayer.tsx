"use client";

import Hls from "hls.js";
import Image from "next/image";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type PortfolioVideoPlayerProps = {
  src: string;
  poster?: string | null;
  className?: string;
  autoPlay?: boolean;
  ariaLabel?: string;
};

const HLS_EXTENSION = ".m3u8";

function isHlsSource(src: string) {
  try {
    const url = new URL(src, window.location.origin);

    return url.pathname.toLowerCase().endsWith(HLS_EXTENSION);
  } catch {
    return src.split("?")[0].toLowerCase().endsWith(HLS_EXTENSION);
  }
}

export const PortfolioVideoPlayer = forwardRef<
  HTMLVideoElement,
  PortfolioVideoPlayerProps
>(function PortfolioVideoPlayer(
  {
    src,
    poster,
    className,
    autoPlay = false,
    ariaLabel,
  },
  forwardedRef,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);

  useImperativeHandle(
    forwardedRef,
    () => {
      if (!videoRef.current) {
        throw new Error("Portfolio video element is not mounted.");
      }

      return videoRef.current;
    },
    [],
  );

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    setIsReady(false);

    const hlsSource = isHlsSource(src);
    let revealed = false;

    const revealVideo = () => {
      if (revealed) {
        return;
      }

      if (video.videoWidth <= 0 || video.videoHeight <= 0) {
        return;
      }

      revealed = true;
      setIsReady(true);
    };

    const requestPlayback = () => {
      if (!autoPlay) {
        return;
      }

      void video.play().catch(() => {
        // Autoplay may be blocked by browser policy.
      });
    };

    if (
      hlsSource &&
      !Hls.isSupported() &&
      video.canPlayType("application/vnd.apple.mpegurl")
    ) {
      const handleLoadedData = () => {
        revealVideo();
        requestPlayback();
      };

      video.addEventListener("loadeddata", handleLoadedData);
      video.src = src;
      video.load();

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.pause();
        video.removeAttribute("src");
        video.load();
      };
    }

    if (hlsSource && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        autoStartLoad: false,
        startLevel: -1,
        capLevelToPlayerSize: false,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      });

      let playbackRequested = false;

      const requestHlsPlayback = () => {
        if (!autoPlay || playbackRequested) {
          return;
        }

        playbackRequested = true;

        void video.play().catch(() => {
          // Autoplay may be blocked by browser policy.
        });
      };

      const handleManifestParsed = () => {
        const exact720Level = hls.levels.findIndex(
          (level) => level.height === 720,
        );

        const firstAbove720 = hls.levels.findIndex(
          (level) =>
            typeof level.height === "number" && level.height > 720,
        );

        const highestLevel =
          hls.levels.length > 0 ? hls.levels.length - 1 : -1;

        let initialLevel = -1;

        if (exact720Level >= 0) {
          initialLevel = exact720Level;
        } else if (firstAbove720 >= 0) {
          initialLevel = firstAbove720;
        } else {
          initialLevel = highestLevel;
        }

        if (initialLevel >= 0) {
          hls.startLevel = initialLevel;
        }

        hls.startLoad();
      };

      const handleFragBuffered = () => {
        requestHlsPlayback();
      };

      const handleLoadedData = () => {
        revealVideo();
        requestHlsPlayback();
      };

      const handlePlaying = () => {
        revealVideo();
      };

      const handleError = (
        _event: unknown,
        data: {
          fatal: boolean;
          type: string;
        },
      ) => {
        if (!data.fatal) {
          return;
        }

        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          hls.startLoad();
          return;
        }

        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          hls.recoverMediaError();
          return;
        }

        hls.destroy();
      };

      video.addEventListener("loadeddata", handleLoadedData);
      video.addEventListener("playing", handlePlaying);

      hls.on(Hls.Events.MANIFEST_PARSED, handleManifestParsed);
      hls.on(Hls.Events.FRAG_BUFFERED, handleFragBuffered);
      hls.on(Hls.Events.ERROR, handleError);

      hls.loadSource(src);
      hls.attachMedia(video);

      return () => {
        video.removeEventListener("loadeddata", handleLoadedData);
        video.removeEventListener("playing", handlePlaying);

        hls.off(Hls.Events.MANIFEST_PARSED, handleManifestParsed);
        hls.off(Hls.Events.FRAG_BUFFERED, handleFragBuffered);
        hls.off(Hls.Events.ERROR, handleError);

        video.pause();
        hls.destroy();
        video.removeAttribute("src");
        video.load();
      };
    }

    const handleLoadedData = () => {
      revealVideo();
      requestPlayback();
    };

    video.addEventListener("loadeddata", handleLoadedData);
    video.src = src;
    video.load();

    return () => {
      video.removeEventListener("loadeddata", handleLoadedData);
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [autoPlay, src]);

  return (
    <>
      {poster && !isReady && (
        <Image
          src={poster}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          priority={autoPlay}
          style={{
            zIndex: 1,
            objectFit: "contain",
            objectPosition: "center",
            background: "#111",
            pointerEvents: "none",
          }}
        />
      )}

      <video
        ref={videoRef}
        className={className}
        poster={poster ?? undefined}
        controls
        playsInline
        preload="metadata"
        aria-label={ariaLabel}
        style={{
          opacity: poster && !isReady ? 0 : 1,
          transition: "opacity 180ms ease",
        }}
      />
    </>
  );
});
