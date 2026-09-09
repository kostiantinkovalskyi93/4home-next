import Link from "next/link";

import { ProjectDetailGallery } from "./ProjectDetailGallery";
import styles from "./ProjectDetail.module.css";

export type ProjectDetailImage = {
  src: string;
  alt: string;
};

export type ProjectDetailMedia = {
  type: "photo" | "video";
  src: string;
  alt: string;
};

export type ProjectDetailData = {
  title: string;
  category: string;
  shortDescription?: string | null;
  location?: string | null;
  color?: string | null;
  productionTerm?: string | null;
  year?: number | null;
  materials?: Array<{ label: string; value: string }>;
  hardware?: Array<{ label: string; value: string }>;
  features?: string | null;
  images: ProjectDetailImage[];
  media?: ProjectDetailMedia[];
};

type Props = {
  project: ProjectDetailData;
  preview?: boolean;
  editHref?: string;
};

export function ProjectDetail({
  project,
  preview = false,
  editHref,
}: Props) {
  const specs = [
    project.location ? ["Локація", project.location] : null,
    ["Тип меблів", project.category],
    project.year ? ["Рік", String(project.year)] : null,
    project.color ? ["Колір", project.color] : null,
    project.productionTerm
      ? ["Термін виготовлення", project.productionTerm]
      : null,
  ].filter(Boolean) as [string, string][];

  const media: ProjectDetailMedia[] =
    project.media && project.media.length > 0
      ? project.media
      : project.images.map((image) => ({
          type: "photo" as const,
          ...image,
        }));

  return (
    <main className={styles.page}>
      {preview && (
        <div className={styles.previewBar}>
          <span>ПОПЕРЕДНІЙ ПЕРЕГЛЯД</span>
          <span>Так виглядатиме опублікована сторінка</span>
          {editHref && (
            <Link href={editHref}>← Повернутися до редагування</Link>
          )}
        </div>
      )}

      <section className={styles.hero}>
        <div className={styles.shell}>
          <div className={styles.breadcrumbs}>
            <Link href="/portfolio">Портфоліо</Link>
            <span>/</span>
            <span>{project.category}</span>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.copy}>
              <p className={styles.eyebrow}>РЕАЛІЗОВАНИЙ ПРОЄКТ</p>
              <h1>{project.title}</h1>
              {project.shortDescription && (
                <p className={styles.lead}>{project.shortDescription}</p>
              )}

              {specs.length > 0 && (
                <dl className={styles.specs}>
                  {specs.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>

            <ProjectDetailGallery
              media={media}
              title={project.title}
              description={project.shortDescription}
            />
          </div>
        </div>
      </section>

      {(project.materials?.length ||
        project.hardware?.length ||
        project.features) && (
        <section className={styles.details}>
          <div className={styles.shell}>
            <p className={styles.eyebrow}>ДЕТАЛІ ПРОЄКТУ</p>
            <div className={styles.detailGrid}>
              <div>
                <h2>
                  Матеріали та
                  <br />
                  комплектація
                </h2>
              </div>
              <div className={styles.detailContent}>
                {project.materials?.map((item) => (
                  <div
                    className={styles.detailRow}
                    key={`m-${item.label}-${item.value}`}
                  >
                    <span>{item.label || "Матеріал"}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
                {project.hardware?.map((item) => (
                  <div
                    className={styles.detailRow}
                    key={`h-${item.label}-${item.value}`}
                  >
                    <span>{item.label || "Фурнітура"}</span>
                    <strong>{item.value}</strong>
                  </div>
                ))}
                {project.features && (
                  <p className={styles.features}>{project.features}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className={styles.cta}>
        <div className={styles.shell}>
          <p className={styles.eyebrow}>ПОДОБАЄТЬСЯ РІШЕННЯ?</p>
          <h2>
            Створимо подібні меблі
            <br />
            для вашого простору.
          </h2>
          <div className={styles.actions}>
            <Link
              className={styles.primary}
              href="/contacts#lead-form"
            >
              Розрахувати подібні меблі <span>→</span>
            </Link>
            <Link className={styles.back} href="/portfolio">
              ← Назад до портфоліо
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
