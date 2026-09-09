"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { ProjectDetailMedia } from "./ProjectDetail";

import styles from "./ProjectDetail.module.css";

type ProjectDetailGalleryProps = {
  media: ProjectDetailMedia[];
  title: string;
  description?: string | null;
};

export function ProjectDetailGallery({
  media,
  title,
  description,
}: ProjectDetailGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const lightVideoRef = useRef<HTMLVideoElement>(null);
  const count = media.length;

  const pauseVideos = useCallback(() => {
    mainVideoRef.current?.pause();
    lightVideoRef.current?.pause();
  }, []);

  const selectMedia = useCallback(
    (index: number) => {
      pauseVideos();
      setActive(index);
    },
    [pauseVideos],
  );

  const showPrevious = useCallback(() => {
    if (count < 2) return;

    pauseVideos();
    setActive((current) =>
      current === 0 ? count - 1 : current - 1,
    );
  }, [count, pauseVideos]);

  const showNext = useCallback(() => {
    if (count < 2) return;

    pauseVideos();
    setActive((current) =>
      current === count - 1 ? 0 : current + 1,
    );
  }, [count, pauseVideos]);

  const closeLightbox = useCallback(() => {
    pauseVideos();
    setLightbox(false);
  }, [pauseVideos]);

  useEffect(() => {
    if (!lightbox) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeLightbox();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeLightbox, lightbox, showNext, showPrevious]);

  if (!count) {
    return (
      <div className={styles.empty}>
        Медіа проєкту готуються.
      </div>
    );
  }

  const item = media[active];
  const isVideo = item.type === "video";

  return (
    <div className={styles.gallery}>
      {isVideo ? (
        <div className={styles.mainVideoWrap}>
          <video
            ref={mainVideoRef}
            className={styles.mainVideo}
            src={item.src}
            controls
            playsInline
            preload="metadata"
            aria-label={item.alt}
          />

          <button
            className={styles.videoExpand}
            type="button"
            onClick={() => {
              pauseVideos();
              setLightbox(true);
            }}
            aria-label="Відкрити відео на весь екран"
          >
            ↗
          </button>

          <span className={styles.videoBadge}>ВІДЕО</span>
          <span className={styles.counter}>
            {active + 1} / {count}
          </span>
        </div>
      ) : (
        <button
          className={styles.mainImage}
          type="button"
          onClick={() => setLightbox(true)}
          aria-label="Відкрити фото на весь екран"
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 62vw"
          />

          <span className={styles.zoom} aria-hidden="true">
            ↗
          </span>

          <span className={styles.counter}>
            {active + 1} / {count}
          </span>
        </button>
      )}

      <div className={styles.galleryControls}>
        <div className={styles.thumbs}>
          {media.map((mediaItem, index) => (
            <button
              key={`${mediaItem.type}-${mediaItem.src}-${index}`}
              type="button"
              onClick={() => selectMedia(index)}
              className={`${styles.thumb} ${
                index === active ? styles.thumbActive : ""
              }`}
              aria-label={
                mediaItem.type === "video"
                  ? `Відео ${index + 1}`
                  : `Фото ${index + 1}`
              }
              aria-current={index === active ? "true" : undefined}
            >
              {mediaItem.type === "video" ? (
                <>
                  <video
                    className={styles.thumbVideo}
                    src={mediaItem.src}
                    muted
                    playsInline
                    preload="metadata"
                    tabIndex={-1}
                    aria-hidden="true"
                  />
                  <span className={styles.thumbPlay} aria-hidden="true">
                    ▶
                  </span>
                </>
              ) : (
                <Image
                  src={mediaItem.src}
                  alt=""
                  fill
                  sizes="90px"
                />
              )}
            </button>
          ))}
        </div>

        {count > 1 && (
          <div className={styles.arrows}>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Попереднє медіа"
            >
              ←
            </button>

            <button
              type="button"
              onClick={showNext}
              aria-label="Наступне медіа"
            >
              →
            </button>
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Галерея проєкту ${title}`}
        >
          <div className={styles.lightboxTop}>
            <div>
              <span className={styles.lightboxEyebrow}>
                4HOME / ПРОЄКТ
              </span>
              <strong>{title}</strong>
            </div>

            <div className={styles.lightboxTopRight}>
              <span>
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(count).padStart(2, "0")}
              </span>

              <button
                ref={closeButtonRef}
                type="button"
                className={styles.close}
                onClick={closeLightbox}
                aria-label="Закрити галерею"
              >
                ×
              </button>
            </div>
          </div>

          <div className={styles.lightStage}>
            {count > 1 && (
              <button
                type="button"
                className={`${styles.lightArrow} ${styles.lightPrev}`}
                onClick={showPrevious}
                aria-label="Попереднє медіа"
              >
                ←
              </button>
            )}

            {isVideo ? (
              <div className={styles.lightVideoWrap}>
                <video
                  ref={lightVideoRef}
                  className={styles.lightVideo}
                  src={item.src}
                  controls
                  playsInline
                  preload="metadata"
                  autoPlay
                  aria-label={item.alt}
                />
              </div>
            ) : (
              <div className={styles.lightImage}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  priority
                  sizes="100vw"
                />
              </div>
            )}

            {count > 1 && (
              <button
                type="button"
                className={`${styles.lightArrow} ${styles.lightNext}`}
                onClick={showNext}
                aria-label="Наступне медіа"
              >
                →
              </button>
            )}
          </div>

          <div className={styles.lightboxBottom}>
            <div className={styles.lightThumbs}>
              {media.map((mediaItem, index) => (
                <button
                  key={`light-${mediaItem.type}-${mediaItem.src}-${index}`}
                  type="button"
                  onClick={() => selectMedia(index)}
                  className={`${styles.lightThumb} ${
                    index === active ? styles.lightThumbActive : ""
                  }`}
                  aria-label={
                    mediaItem.type === "video"
                      ? `Показати відео ${index + 1}`
                      : `Показати фото ${index + 1}`
                  }
                >
                  {mediaItem.type === "video" ? (
                    <>
                      <video
                        className={styles.thumbVideo}
                        src={mediaItem.src}
                        muted
                        playsInline
                        preload="metadata"
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                      <span
                        className={styles.thumbPlay}
                        aria-hidden="true"
                      >
                        ▶
                      </span>
                    </>
                  ) : (
                    <Image
                      src={mediaItem.src}
                      alt=""
                      fill
                      sizes="76px"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className={styles.lightMeta}>
              <strong>{title}</strong>
              {description && <span>{description}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
