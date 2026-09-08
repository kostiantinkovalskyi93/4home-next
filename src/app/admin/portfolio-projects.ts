export type AdminProjectCategory =
  | "Кухні"
  | "Шафи"
  | "Інші меблі";

export type AdminProjectStatus =
  | "published"
  | "draft";

export type AdminPortfolioProject = {
  id: string;
  title: string;
  category: AdminProjectCategory;
  year: number;
  status: AdminProjectStatus;
  coverImage: string | null;
  photoCount: number;
  videoCount: number;
};

export type PortfolioProjectDatabaseRow = {
  id: string;
  title: string;
  category:
    | "kitchen"
    | "wardrobe"
    | "furniture";
  year: number;
  status:
    | "published"
    | "draft";
};

export type PortfolioMediaDatabaseRow = {
  project_id: string;
  media_type: "photo" | "video";
  sort_order: number;
  is_cover: boolean;
  card_path: string | null;
  processing_status:
    | "pending"
    | "processing"
    | "ready"
    | "failed";
};

export function mapProjectCategory(
  category: PortfolioProjectDatabaseRow["category"],
): AdminProjectCategory {
  switch (category) {
    case "kitchen":
      return "Кухні";

    case "wardrobe":
      return "Шафи";

    case "furniture":
      return "Інші меблі";
  }
}
