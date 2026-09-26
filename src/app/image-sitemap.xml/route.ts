import { getPublishedPortfolioProjects } from "@/lib/portfolio-db";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const projects = await getPublishedPortfolioProjects();

  const entries = projects
    .filter((project) => project.images.length > 0)
    .map((project) => {
      const images = project.images
        .map(
          (image) =>
            `    <image:image>\n      <image:loc>${escapeXml(image.src)}</image:loc>\n    </image:image>`,
        )
        .join("\n");

      return `  <url>\n    <loc>${escapeXml(`${SITE_URL}/portfolio/${project.slug}`)}</loc>\n${images}\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${entries}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
