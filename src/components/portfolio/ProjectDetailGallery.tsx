"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type TouchEvent,
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
  const lightboxRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const lightVideoRef = useRef<HTMLVideoElement>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lightThumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const didMountRef = useRef(false);
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

  const openLightbox = useCallback(() => {
    pauseVideos();
    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setLightbox(true);
  }, [pauseVideos]);

  const closeLightbox = useCallback(() => {
    pauseVideos();
    setLightbox(false);
  }, [pauseVideos]);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (event.touches.length !== 1) {
      touchStartRef.current = null;
      return;
    }

    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;

      if (!start || event.changedTouches.length !== 1 || count < 2) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;

      if (Math.abs(deltaX) < 52 || Math.abs(deltaX) <= Math.abs(deltaY) * 1.15) {
        return;
      }

      if (deltaX < 0) showNext();
      else showPrevious();
    },
    [count, showNext, showPrevious],
  );

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    thumbRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });

    if (lightbox) {
      lightThumbRefs.current[active]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [active, lightbox]);

  useEffect(() => {
    if (!lightbox) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeLightbox();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        showNext();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = Array.from(
        lightboxRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), video[controls], [href], [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => !element.hasAttribute("disabled"));

      if (!focusable.length) {
        event.preventDefault();
        closeButtonRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      requestAnimationFrame(() => {
        previouslyFocusedRef.current?.focus();
      });
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
        <div
          className={styles.mainVideoWrap}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <video
            ref={mainVideoRef}
            className={styles.mainVideo}
            src={item.src}
            poster={item.posterSrc}
            controls
            playsInline
            preload="metadata"
            aria-label={item.alt}
          />

          <button
            className={styles.videoExpand}
            type="button"
            onClick={openLightbox}
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
          onClick={openLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          aria-label="Відкрити фото на весь екран"
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            priority={active === 0}
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
              ref={(element) => {
                thumbRefs.current[index] = element;
              }}
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
                  {mediaItem.posterSrc ? (
                    <video
                      className={styles.thumbVideo}
                      poster={mediaItem.posterSrc}
                      muted
                      playsInline
                      preload="none"
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  ) : (
                    <video
                      className={styles.thumbVideo}
                      src={mediaItem.src}
                      muted
                      playsInline
                      preload="metadata"
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  )}
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
          ref={lightboxRef}
          className={styles.lightbox}
          role="dialog"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeLightbox();
          }}
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

          <div
            className={styles.lightStage}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
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
                  poster={item.posterSrc}
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
                  priority={active === 0}
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
                  ref={(element) => {
                    lightThumbRefs.current[index] = element;
                  }}
                  onClick={() => selectMedia(index)}
                  className={`${styles.lightThumb} ${
                    index === active ? styles.lightThumbActive : ""
                  }`}
                  aria-label={
                    mediaItem.type === "video"
                      ? `Показати відео ${index + 1}`
                      : `Показати фото ${index + 1}`
                  }
                  aria-current={
                    index === active
                      ? "true"
                      : undefined
                  }
                >
                  {mediaItem.type === "video" ? (
                    <>
                      {mediaItem.posterSrc ? (
                        <video
                          className={styles.thumbVideo}
                          poster={mediaItem.posterSrc}
                          muted
                          playsInline
                          preload="none"
                          tabIndex={-1}
                          aria-hidden="true"
                        />
                      ) : (
                        <video
                          className={styles.thumbVideo}
                          src={mediaItem.src}
                          muted
                          playsInline
                          preload="metadata"
                          tabIndex={-1}
                          aria-hidden="true"
                        />
                      )}
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
