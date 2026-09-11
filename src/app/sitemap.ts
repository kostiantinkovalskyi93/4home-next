import type { MetadataRoute } from "next";

import { getPublishedPortfolioProjects } from "@/lib/portfolio-db";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/kitchens`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/wardrobes`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/furniture`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/portfolio`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/about`,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/process`,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/materials`,
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contacts`,
      changeFrequency: "yearly",
      priority: 0.8,
    },
  ];

  const projects =
    await getPublishedPortfolioProjects();

  const portfolioPages: MetadataRoute.Sitemap =
    projects.map((project) => ({
      url: `${SITE_URL}/portfolio/${project.slug}`,
      changeFrequency: "yearly",
      priority: 0.7,
    }));

  return [...staticPages, ...portfolioPages];
}
