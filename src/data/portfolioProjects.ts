export type PortfolioCategory =
  | "Кухні"
  | "Розпашні шафи"
  | "Шафи-купе"
  | "Інші меблі";

export type PortfolioImage = {
  src: string;
  alt: string;
};

export type PortfolioProject = {
  slug: string;
  title: string;
  category: PortfolioCategory;
  coverImage: string;
  images: PortfolioImage[];
};

export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "kitchen-01",
    title: "Світла кухня",
    category: "Кухні",
    coverImage:
      "/images/portfolio/kitchen-luxury/luxury_kitchen_1.webp",
    images: [
      {
        src: "/images/portfolio/kitchen-luxury/luxury_kitchen_1.webp",
        alt: "Світла кухня на замовлення 4HOME — загальний вигляд",
      },
      {
        src: "/images/portfolio/kitchen-luxury/luxury_kitchen_2.webp",
        alt: "Світла кухня на замовлення 4HOME — вигляд кухонної зони",
      },
      {
        src: "/images/portfolio/kitchen-luxury/luxury_kitchen_3.webp",
        alt: "Світла кухня на замовлення 4HOME — фасади та робоча зона",
      },
      {
        src: "/images/portfolio/kitchen-luxury/luxury_kitchen_4.webp",
        alt: "Світла кухня на замовлення 4HOME — меблі в інтер’єрі",
      },
      {
        src: "/images/portfolio/kitchen-luxury/luxury_kitchen_5.webp",
        alt: "Світла кухня на замовлення 4HOME — деталі проєкту",
      },
      {
        src: "/images/portfolio/kitchen-luxury/luxury_kitchen_6.webp",
        alt: "Світла кухня на замовлення 4HOME — кухонні меблі",
      },
      {
        src: "/images/portfolio/kitchen-luxury/luxury_kitchen_7.webp",
        alt: "Світла кухня на замовлення 4HOME — загальний інтер’єр",
      },
      {
        src: "/images/portfolio/kitchen-luxury/luxury_kitchen_8.webp",
        alt: "Світла кухня на замовлення 4HOME — додатковий ракурс",
      },
      {
        src: "/images/portfolio/kitchen-luxury/luxury_kitchen_9.webp",
        alt: "Світла кухня на замовлення 4HOME — завершений проєкт",
      },
    ],
  },

  {
    slug: "kitchen-02",
    title: "Кухня у світлому інтер’єрі",
    category: "Кухні",
    coverImage:
      "/images/portfolio/kitchen-white/big_white_kitchen_1.webp",
    images: [
      {
        src: "/images/portfolio/kitchen-white/big_white_kitchen_1.webp",
        alt: "Світла кухня 4HOME — загальний вигляд",
      },
      {
        src: "/images/portfolio/kitchen-white/big_white_kitchen_2.webp",
        alt: "Світла кухня 4HOME — другий ракурс",
      },
      {
        src: "/images/portfolio/kitchen-white/big_white_kitchen_3.webp",
        alt: "Світла кухня 4HOME — робоча зона",
      },
      {
        src: "/images/portfolio/kitchen-white/big_white_kitchen_4.webp",
        alt: "Світла кухня 4HOME — фасади",
      },
      {
        src: "/images/portfolio/kitchen-white/big_white_kitchen_5.webp",
        alt: "Світла кухня 4HOME — меблі в інтер’єрі",
      },
      {
        src: "/images/portfolio/kitchen-white/big_white_kitchen_6.webp",
        alt: "Світла кухня 4HOME — деталі",
      },
      {
        src: "/images/portfolio/kitchen-white/big_white_kitchen_7.webp",
        alt: "Світла кухня 4HOME — кухонна зона",
      },
      {
        src: "/images/portfolio/kitchen-white/big_white_kitchen_8.webp",
        alt: "Світла кухня 4HOME — додатковий ракурс",
      },
      {
        src: "/images/portfolio/kitchen-white/big_white_kitchen_9.webp",
        alt: "Світла кухня 4HOME — завершений проєкт",
      },
      {
        src: "/images/portfolio/kitchen-white/big_white_kitchen_10.webp",
        alt: "Світла кухня 4HOME — інший вигляд",
      },
      {
        src: "/images/portfolio/kitchen-white/big_white_kitchen_11.webp",
        alt: "Світла кухня 4HOME — фінальний ракурс",
      },
    ],
  },

  {
    slug: "kitchen-03",
    title: "Сучасна кухня",
    category: "Кухні",
    coverImage: "/images/portfolio/kitchen-03.webp",
    images: [
      {
        src: "/images/portfolio/kitchen-03.webp",
        alt: "Сучасна кухня на замовлення 4HOME",
      },
    ],
  },

  {
    slug: "hinged-01",
    title: "Вбудована розпашна шафа",
    category: "Розпашні шафи",
    coverImage:
      "/images/portfolio/hinged-wardrobe/ward1_0.webp",
    images: [
      {
        src: "/images/portfolio/hinged-wardrobe/ward1_0.webp",
        alt: "Вбудована розпашна шафа 4HOME — загальний вигляд",
      },
      {
        src: "/images/portfolio/hinged-wardrobe/ward1_1.webp",
        alt: "Вбудована розпашна шафа 4HOME — фасади",
      },
      {
        src: "/images/portfolio/hinged-wardrobe/ward1_2.webp",
        alt: "Вбудована розпашна шафа 4HOME — вигляд у приміщенні",
      },
      {
        src: "/images/portfolio/hinged-wardrobe/ward1_3.webp",
        alt: "Вбудована розпашна шафа 4HOME — додатковий ракурс",
      },
      {
        src: "/images/portfolio/hinged-wardrobe/ward1_4.webp",
        alt: "Вбудована розпашна шафа 4HOME — деталі",
      },
      {
        src: "/images/portfolio/hinged-wardrobe/ward1_5.webp",
        alt: "Вбудована розпашна шафа 4HOME — інший ракурс",
      },
      {
        src: "/images/portfolio/hinged-wardrobe/ward1_6.webp",
        alt: "Вбудована розпашна шафа 4HOME — завершений проєкт",
      },
    ],
  },

  {
    slug: "hinged-02",
    title: "Світла розпашна шафа",
    category: "Розпашні шафи",
    coverImage: "/images/portfolio/hinged-02.webp",
    images: [
      {
        src: "/images/portfolio/hinged-02.webp",
        alt: "Світла розпашна шафа на замовлення 4HOME",
      },
    ],
  },

  {
    slug: "sliding-01",
    title: "Дзеркальна шафа-купе",
    category: "Шафи-купе",
    coverImage:
      "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_1.webp",
    images: [
      {
        src: "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_1.webp",
        alt: "Дзеркальна шафа-купе 4HOME — загальний вигляд",
      },
      {
        src: "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_2.webp",
        alt: "Дзеркальна шафа-купе 4HOME — фасади",
      },
      {
        src: "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_3.webp",
        alt: "Дзеркальна шафа-купе 4HOME — вигляд у кімнаті",
      },
      {
        src: "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_4.webp",
        alt: "Дзеркальна шафа-купе 4HOME — додатковий ракурс",
      },
      {
        src: "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_5.webp",
        alt: "Дзеркальна шафа-купе 4HOME — деталі",
      },
      {
        src: "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_6.webp",
        alt: "Дзеркальна шафа-купе 4HOME — інший ракурс",
      },
      {
        src: "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_7.webp",
        alt: "Дзеркальна шафа-купе 4HOME — меблі в інтер’єрі",
      },
      {
        src: "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_8.webp",
        alt: "Дзеркальна шафа-купе 4HOME — дзеркальні фасади",
      },
      {
        src: "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_9.webp",
        alt: "Дзеркальна шафа-купе 4HOME — вигляд збоку",
      },
      {
        src: "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_10.webp",
        alt: "Дзеркальна шафа-купе 4HOME — завершений вигляд",
      },
      {
        src: "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_11.webp",
        alt: "Дзеркальна шафа-купе 4HOME — додаткове фото",
      },
      {
        src: "/images/portfolio/sliding-mirror/sliding_mirror_ward_2_12.webp",
        alt: "Дзеркальна шафа-купе 4HOME — фінальний ракурс",
      },
    ],
  },

  {
    slug: "sliding-02",
    title: "Шафа-купе для кімнати",
    category: "Шафи-купе",
    coverImage: "/images/portfolio/sliding-02.webp",
    images: [
      {
        src: "/images/portfolio/sliding-02.webp",
        alt: "Шафа-купе для кімнати 4HOME",
      },
    ],
  },

  {
    slug: "furniture-01",
    title: "Консоль",
    category: "Інші меблі",
    coverImage: "/images/portfolio/furniture-01.webp",
    images: [
      {
        src: "/images/portfolio/furniture-01.webp",
        alt: "Консоль на замовлення 4HOME",
      },
    ],
  },

  {
    slug: "furniture-02",
    title: "ТВ-тумба",
    category: "Інші меблі",
    coverImage:
      "/images/portfolio/media-console/media_console_1.webp",
    images: [
      {
        src: "/images/portfolio/media-console/media_console_1.webp",
        alt: "ТВ-тумба 4HOME — загальний вигляд",
      },
      {
        src: "/images/portfolio/media-console/media_console_2.webp",
        alt: "ТВ-тумба 4HOME — другий ракурс",
      },
      {
        src: "/images/portfolio/media-console/media_console_3.webp",
        alt: "ТВ-тумба 4HOME — деталі",
      },
      {
        src: "/images/portfolio/media-console/media_console_4.webp",
        alt: "ТВ-тумба 4HOME — завершений проєкт",
      },
    ],
  },
];

export function getPortfolioProject(slug: string) {
  return portfolioProjects.find((project) => project.slug === slug);
}