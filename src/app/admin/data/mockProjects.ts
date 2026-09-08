export type AdminProjectCategory = "Кухні" | "Шафи" | "Інші меблі";
export type AdminProjectStatus = "published" | "draft";

export type AdminProject = {
  id: string;
  title: string;
  category: AdminProjectCategory;
  year: number;
  status: AdminProjectStatus;
  coverImage: string;
  photoCount: number;
  videoCount: number;
};

export const adminProjects: AdminProject[] = [
  {
    id: "kitchen-01",
    title: "Світла кухня",
    category: "Кухні",
    year: 2026,
    status: "published",
    coverImage: "/images/portfolio/kitchen-luxury/luxury_kitchen_1.webp",
    photoCount: 9,
    videoCount: 0,
  },
  {
    id: "kitchen-02",
    title: "Кухня у світлому інтер’єрі",
    category: "Кухні",
    year: 2026,
    status: "published",
    coverImage: "/images/portfolio/kitchen-white/big_white_kitchen_1.webp",
    photoCount: 11,
    videoCount: 0,
  },
  {
    id: "kitchen-03",
    title: "Сучасна кухня",
    category: "Кухні",
    year: 2026,
    status: "draft",
    coverImage: "/images/portfolio/kitchen-03.webp",
    photoCount: 1,
    videoCount: 0,
  },
  {
    id: "hinged-01",
    title: "Вбудована розпашна шафа",
    category: "Шафи",
    year: 2025,
    status: "published",
    coverImage: "/images/portfolio/hinged-wardrobe/ward1_0.webp",
    photoCount: 7,
    videoCount: 0,
  },
  {
    id: "hinged-02",
    title: "Світла розпашна шафа",
    category: "Шафи",
    year: 2025,
    status: "published",
    coverImage: "/images/portfolio/hinged-02.webp",
    photoCount: 1,
    videoCount: 0,
  },
  {
    id: "sliding-01",
    title: "Дзеркальна шафа-купе",
    category: "Шафи",
    year: 2025,
    status: "published",
    coverImage: "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_1.webp",
    photoCount: 11,
    videoCount: 0,
  },
  {
    id: "sliding-02",
    title: "Шафа-купе для кімнати",
    category: "Шафи",
    year: 2024,
    status: "published",
    coverImage: "/images/portfolio/sliding-02.webp",
    photoCount: 1,
    videoCount: 0,
  },
  {
    id: "furniture-02",
    title: "ТВ-тумба",
    category: "Інші меблі",
    year: 2024,
    status: "published",
    coverImage: "/images/portfolio/media-console/media_console_1.webp",
    photoCount: 5,
    videoCount: 0,
  },
];
