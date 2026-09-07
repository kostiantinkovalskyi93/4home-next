"use client";

import Image from "next/image";
import {
  type CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import type { PortfolioImage } from "@/data/portfolioProjects";

import styles from "./ProjectGallery.module.css";

type ProjectGalleryProps = {
  images: PortfolioImage[];
};

const PREVIEW_COUNT = 5;
const SWIPE_THRESHOLD = 45;

type PreviewImageProps = {
  image: PortfolioImage;
  imageIndex: number;
  imagesLength: number;
  variant: "wide" | "portrait" | "landscape";
  delay: number;
  hiddenCount?: number;
  onOpen: (index: number) => void;
};

function PreviewImage({
  image,
  imageIndex,
  imagesLength,
  variant,
  delay,
  hiddenCount = 0,
  onOpen,
}: PreviewImageProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = buttonRef.current;

    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        setIsVisible(true);
        observer.unobserve(entry.target);
      },
      {
        threshold: 0.04,
        rootMargin: "0px 0px 4% 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`${styles.editorialPreview} ${
        styles[
          variant === "wide"
            ? "editorialWide"
            : variant === "portrait"
              ? "editorialPortrait"
              : "editorialLandscape"
        ]
      } ${isVisible ? styles.editorialVisible : ""}`}
      style={
        {
          "--gallery-delay": `${delay}ms`,
        } as CSSProperties
      }
      onClick={() => onOpen(imageIndex)}
      aria-label={`Відкрити фото ${imageIndex + 1} з ${imagesLength}`}
    >
      <span className={styles.editorialMask}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={
            variant === "wide"
              ? "(max-width: 650px) 100vw, 1280px"
              : "(max-width: 650px) 100vw, 50vw"
          }
          className={styles.previewImage}
        />

        {hiddenCount > 0 && (
          <span className={styles.moreOverlay}>
            <strong>+{hiddenCount}</strong>
            <span>фото</span>
          </span>
        )}

        <span
          className={styles.imageNumber}
          aria-hidden="true"
        >
          {String(imageIndex + 1).padStart(2, "0")}
        </span>
      </span>
    </button>
  );
}

export function ProjectGallery({
  images,
}: ProjectGalleryProps) {
  const [activeIndex, setActiveIndex] =
    useState<number | null>(null);

  const touchStartX = useRef<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement =
    useRef<HTMLElement | null>(null);

  const isOpen = activeIndex !== null;

  const openGallery = (index: number) => {
    previousActiveElement.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    setActiveIndex(index);
  };

  const closeGallery = useCallback(() => {
    setActiveIndex(null);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === 0
        ? images.length - 1
        : current - 1;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) {
        return null;
      }

      return current === images.length - 1
        ? 0
        : current + 1;
    });
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        closeGallery();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }

      if (event.key === "Tab") {
        const dialog =
          document.querySelector<HTMLElement>(
            '[data-project-lightbox="true"]',
          );

        if (!dialog) {
          return;
        }

        const focusableElements = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
          ),
        );

        if (focusableElements.length === 0) {
          return;
        }

        const firstElement =
          focusableElements[0];

        const lastElement =
          focusableElements[
            focusableElements.length - 1
          ];

        if (
          event.shiftKey &&
          document.activeElement === firstElement
        ) {
          event.preventDefault();
          lastElement.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === lastElement
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    window.requestAnimationFrame(() => {
      closeButtonRef.current?.focus();
    });

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );

      window.requestAnimationFrame(() => {
        previousActiveElement.current?.focus();
      });
    };
  }, [
    closeGallery,
    isOpen,
    showNext,
    showPrevious,
  ]);

  const handleTouchStart = (
    event: React.TouchEvent<HTMLDivElement>,
  ) => {
    touchStartX.current =
      event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (
    event: React.TouchEvent<HTMLDivElement>,
  ) => {
    if (touchStartX.current === null) {
      return;
    }

    const touchEndX =
      event.changedTouches[0]?.clientX;

    if (touchEndX === undefined) {
      touchStartX.current = null;
      return;
    }

    const distance =
      touchEndX - touchStartX.current;

    if (
      Math.abs(distance) >= SWIPE_THRESHOLD
    ) {
      if (distance > 0) {
        showPrevious();
      } else {
        showNext();
      }
    }

    touchStartX.current = null;
  };

  if (images.length === 0) {
    return null;
  }

  const previewImages =
    images.slice(0, PREVIEW_COUNT);

  const hiddenCount = Math.max(
    images.length - PREVIEW_COUNT,
    0,
  );

  return (
    <>
      <div className={styles.galleryShell}>
        {/* MAIN IMAGE */}

        <div className={styles.coverReveal}>
          <button
            type="button"
            className={styles.coverButton}
            onClick={() => openGallery(0)}
            aria-label={`Відкрити фото 1 з ${images.length}`}
          >
            <Image
              src={images[0].src}
              alt={images[0].alt}
              fill
              priority
              sizes="100vw"
              className={styles.coverImage}
            />

            <span
              className={styles.coverOverlay}
              aria-hidden="true"
            />

            <span className={styles.coverMeta}>
              <span>
                01 /{" "}
                {String(images.length).padStart(
                  2,
                  "0",
                )}
              </span>

              <span className={styles.openHint}>
                <span>Відкрити галерею</span>
                <span aria-hidden="true">↗</span>
              </span>
            </span>
          </button>
        </div>

        {/* EDITORIAL PREVIEW */}

        {previewImages.length > 1 && (
          <div className={styles.editorialGrid}>
            {previewImages[1] && (
              <PreviewImage
                image={previewImages[1]}
                imageIndex={1}
                imagesLength={images.length}
                variant="portrait"
                delay={0}
                onOpen={openGallery}
              />
            )}

            {previewImages[2] && (
              <PreviewImage
                image={previewImages[2]}
                imageIndex={2}
                imagesLength={images.length}
                variant="landscape"
                delay={45}
                onOpen={openGallery}
              />
            )}

            {previewImages[3] && (
              <PreviewImage
                image={previewImages[3]}
                imageIndex={3}
                imagesLength={images.length}
                variant="landscape"
                delay={45}
                onOpen={openGallery}
              />
            )}

            {previewImages[4] && (
              <PreviewImage
                image={previewImages[4]}
                imageIndex={4}
                imagesLength={images.length}
                variant="wide"
                delay={70}
                hiddenCount={hiddenCount}
                onOpen={openGallery}
              />
            )}
          </div>
        )}
      </div>

      {/* ========================================
          LIGHTBOX
      ======================================== */}

      {activeIndex !== null && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Галерея проєкту"
          data-project-lightbox="true"
        >
          <div className={styles.topBar}>
            <div className={styles.lightboxBrand}>
              <span>4HOME</span>

              <span className={styles.counter}>
                {String(activeIndex + 1).padStart(
                  2,
                  "0",
                )}{" "}
                /{" "}
                {String(images.length).padStart(
                  2,
                  "0",
                )}
              </span>
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              className={styles.closeButton}
              onClick={closeGallery}
              aria-label="Закрити галерею"
            >
              ×
            </button>
          </div>

          <div
            className={styles.stage}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {images.length > 1 && (
              <button
                type="button"
                className={`${styles.navigationButton} ${styles.previousButton}`}
                onClick={showPrevious}
                aria-label="Попереднє фото"
              >
                ←
              </button>
            )}

            <div
              className={
                styles.activeImageWrapper
              }
            >
              <Image
                key={images[activeIndex].src}
                src={images[activeIndex].src}
                alt={images[activeIndex].alt}
                fill
                sizes="100vw"
                className={styles.activeImage}
              />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                className={`${styles.navigationButton} ${styles.nextButton}`}
                onClick={showNext}
                aria-label="Наступне фото"
              >
                →
              </button>
            )}
          </div>

          {images.length > 1 && (
            <div
              className={styles.thumbnailsWrapper}
            >
              <div className={styles.thumbnails}>
                {images.map((image, index) => (
                  <button
                    key={`${image.src}-${index}`}
                    type="button"
                    className={`${styles.thumbnailButton} ${
                      activeIndex === index
                        ? styles.thumbnailButtonActive
                        : ""
                    }`}
                    onClick={() =>
                      setActiveIndex(index)
                    }
                    aria-label={`Перейти до фото ${
                      index + 1
                    }`}
                    aria-current={
                      activeIndex === index
                        ? "true"
                        : undefined
                    }
                  >
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      sizes="90px"
                      className={
                        styles.thumbnailImage
                      }
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}