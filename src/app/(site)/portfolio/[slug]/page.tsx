import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetail } from "@/components/portfolio/ProjectDetail";
import { getPublishedPortfolioProject } from "@/lib/portfolio-db";
import {
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

function getProjectDescription(
  title: string,
  shortDescription: string | null,
) {
  return (
    shortDescription ??
    `${title}. Реалізований проєкт меблів на замовлення 4HOME у Києві та передмісті.`
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const project =
    await getPublishedPortfolioProject(slug);

  if (!project) {
    return {
      title: "Проєкт не знайдено",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${project.title} — портфоліо`;
  const socialTitle =
    `${project.title} — портфоліо ${SITE_NAME}`;
  const description = getProjectDescription(
    project.title,
    project.shortDescription,
  );
  const canonical =
    `/portfolio/${project.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      url: canonical,
      siteName: SITE_NAME,
      locale: "uk_UA",
      title: socialTitle,
      description,
      images: [
        {
          url: project.coverImage,
          alt: `${project.title} — ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [project.coverImage],
    },
  };
}

export default async function Page({
  params,
}: Props) {
  const { slug } = await params;
  const project =
    await getPublishedPortfolioProject(slug);

  if (!project) {
    notFound();
  }

  const projectUrl =
    `${SITE_URL}/portfolio/${project.slug}`;
  const description = getProjectDescription(
    project.title,
    project.shortDescription,
  );

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description,
    url: projectUrl,
    image: project.images.map(
      (image) => image.src,
    ),
    creator: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(project.year
      ? {
          dateCreated: String(project.year),
        }
      : {}),
    ...(project.location
      ? {
          contentLocation: {
            "@type": "Place",
            name: project.location,
          },
        }
      : {}),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Головна",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Портфоліо",
        item: `${SITE_URL}/portfolio`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: projectUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            projectJsonLd,
          ).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd,
          ).replace(/</g, "\\u003c"),
        }}
      />

      <ProjectDetail project={project} />
    </>
  );
}
