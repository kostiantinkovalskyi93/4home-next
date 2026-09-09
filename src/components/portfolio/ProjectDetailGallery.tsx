"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { ProjectDetailImage } from "./ProjectDetail";

import styles from "./ProjectDetail.module.css";

type ProjectDetailGalleryProps = {
  images: ProjectDetailImage[];
  title: string;
  description?: string | null;
};

export function ProjectDetailGallery({
  images,
  title,
  description,
}: ProjectDetailGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const count = images.length;

  const showPrevious = useCallback(() => {
    if (count < 2) {
      return;
    }

    setActive((current) =>
      current === 0 ? count - 1 : current - 1,
    );
  }, [count]);

  const showNext = useCallback(() => {
    if (count < 2) {
      return;
    }

    setActive((current) =>
      current === count - 1 ? 0 : current + 1,
    );
  }, [count]);

  const closeLightbox = useCallback(() => {
    setLightbox(false);
  }, []);

  useEffect(() => {
    if (!lightbox) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    closeLightbox,
    lightbox,
    showNext,
    showPrevious,
  ]);

  if (!count) {
    return (
      <div className={styles.empty}>
        Фото проєкту готуються.
      </div>
    );
  }

  const image = images[active];

  return (
    <div className={styles.gallery}>
      <button
        className={styles.mainImage}
        type="button"
        onClick={() => setLightbox(true)}
        aria-label="Відкрити фото на весь екран"
      >
        <Image
          src={image.src}
          alt={image.alt}
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

      <div className={styles.galleryControls}>
        <div className={styles.thumbs}>
          {images.map((item, index) => (
            <button
              key={`${item.src}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`${styles.thumb} ${
                index === active
                  ? styles.thumbActive
                  : ""
              }`}
              aria-label={`Фото ${index + 1}`}
              aria-current={
                index === active ? "true" : undefined
              }
            >
              <Image
                src={item.src}
                alt=""
                fill
                sizes="90px"
              />
            </button>
          ))}
        </div>

        {count > 1 && (
          <div className={styles.arrows}>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Попереднє фото"
            >
              ←
            </button>

            <button
              type="button"
              onClick={showNext}
              aria-label="Наступне фото"
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
                aria-label="Попереднє фото"
              >
                ←
              </button>
            )}

            <div className={styles.lightImage}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="100vw"
              />
            </div>

            {count > 1 && (
              <button
                type="button"
                className={`${styles.lightArrow} ${styles.lightNext}`}
                onClick={showNext}
                aria-label="Наступне фото"
              >
                →
              </button>
            )}
          </div>

          <div className={styles.lightboxBottom}>
            <div className={styles.lightThumbs}>
              {images.map((item, index) => (
                <button
                  key={`light-${item.src}-${index}`}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`${styles.lightThumb} ${
                    index === active
                      ? styles.lightThumbActive
                      : ""
                  }`}
                  aria-label={`Показати фото ${index + 1}`}
                >
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="76px"
                  />
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
