import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/layout/Header";

import styles from "./page.module.css";

const advantages = [
  {
    number: "01",
    title: "За вашими розмірами",
    description:
      "Меблі проєктуються під конкретне приміщення, планування та ваші побажання.",
  },
  {
    number: "02",
    title: "Прорахунок до виготовлення",
    description:
      "До початку робіт погоджуємо конструкцію, матеріали та вартість проєкту.",
  },
  {
    number: "03",
    title: "Від проєкту до монтажу",
    description:
      "Один зрозумілий процес: проєктування, виготовлення, доставка та встановлення.",
  },
  {
    number: "04",
    title: "Реальні виконані роботи",
    description:
      "Показуємо виконані проєкти, щоб ви могли оцінити стиль, підхід і результат.",
  },
];

const categories = [
  {
    number: "01",
    title: "Кухні",
    description:
      "Кухні за індивідуальними розмірами з урахуванням планування, техніки та ваших щоденних сценаріїв.",
    href: "/kitchens",
    image: "/images/home/categories/kitchens.webp",
    alt: "Кухня на замовлення",
    layout: "primary",
  },
  {
    number: "02",
    title: "Розпашні шафи",
    description:
      "Шафи для спальні, передпокою, дитячої та інших приміщень.",
    href: "/wardrobes#hinged",
    image: "/images/home/categories/hinged-wardrobes.webp",
    alt: "Розпашна шафа на замовлення",
    layout: "secondary",
  },
  {
    number: "03",
    title: "Шафи-купе",
    description:
      "Вбудовані та окремостоячі рішення для ефективного використання простору.",
    href: "/wardrobes#sliding",
    image: "/images/home/categories/sliding-wardrobes.webp",
    alt: "Шафа-купе на замовлення",
    layout: "tertiary",
  },
  {
    number: "04",
    title: "Інші меблі",
    description:
      "Тумби, столи, консолі та інші корпусні меблі, створені під ваш простір.",
    href: "/furniture",
    image: "/images/home/categories/other-furniture.webp",
    alt: "Корпусні меблі на замовлення",
    layout: "minor",
  },
];

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>4HOME • КИЇВ</p>

              <h1 className={styles.title}>
                Меблі на замовлення
                <br />
                у Києві
              </h1>

              <p className={styles.description}>
                Проєктуємо, прораховуємо вартість, виготовляємо, доставляємо
                та встановлюємо корпусні меблі за індивідуальними розмірами.
              </p>

              <div className={styles.actions}>
                <Link href="/contacts" className={styles.primaryButton}>
                  Розрахувати вартість
                </Link>

                <Link href="/portfolio" className={styles.secondaryButton}>
                  Переглянути роботи
                </Link>
              </div>
            </div>

            <div className={styles.heroVisual}>
              <div className={styles.imageFrame}>
                <Image
                  src="/images/home/hero-kitchen.webp"
                  alt="Кухня на замовлення 4HOME"
                  fill
                  priority
                  sizes="(max-width: 900px) 100vw, 55vw"
                  className={styles.heroImage}
                />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.advantages}>
          <div className="container">
            <div className={styles.advantagesHeader}>
              <p className={styles.sectionEyebrow}>ІНДИВІДУАЛЬНИЙ ПІДХІД</p>

              <h2 className={styles.sectionTitle}>
                Меблі, створені
                <br />
                для вашого простору
              </h2>

              <p className={styles.sectionIntro}>
                Не готові рішення зі складу, а меблі, які створюються під
                конкретне приміщення, ваші потреби та майбутній інтер’єр.
              </p>
            </div>

            <div className={styles.advantagesGrid}>
              {advantages.map((item) => (
                <article key={item.number} className={styles.advantageCard}>
                  <span className={styles.advantageNumber}>{item.number}</span>

                  <div className={styles.advantageContent}>
                    <h3 className={styles.advantageTitle}>{item.title}</h3>

                    <p className={styles.advantageDescription}>
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.categories}>
          <div className="container">
            <div className={styles.categoriesHeader}>
              <div>
                <p className={styles.categoriesEyebrow}>ЩО МИ ВИГОТОВЛЯЄМО</p>

                <h2 className={styles.categoriesTitle}>
                  Меблі для різних
                  <br />
                  просторів і задач
                </h2>
              </div>

              <p className={styles.categoriesIntro}>
                Кожен проєкт починається не з готової моделі, а з вашого
                приміщення, розмірів, потреб і побажань до майбутніх меблів.
              </p>
            </div>

            <div className={styles.categoriesGrid}>
              {categories.map((category) => (
                <article
                  key={category.number}
                  className={`${styles.categoryCard} ${
                    styles[
                      `category${category.layout[0].toUpperCase()}${category.layout.slice(
                        1,
                      )}`
                    ]
                  }`}
                >
                  <Link href={category.href} className={styles.categoryLink}>
                    <div className={styles.categoryImageWrapper}>
                      <Image
                        src={category.image}
                        alt={category.alt}
                        fill
                        sizes={
                          category.layout === "primary"
                            ? "(max-width: 760px) 100vw, 60vw"
                            : "(max-width: 760px) 100vw, 40vw"
                        }
                        className={styles.categoryImage}
                      />

                      <div className={styles.categoryShade} />

                      <span className={styles.categoryNumber}>
                        {category.number}
                      </span>

                      <span
                        className={styles.categoryArrow}
                        aria-hidden="true"
                      >
                        ↗
                      </span>
                    </div>

                    <div className={styles.categoryContent}>
                      <h3 className={styles.categoryTitle}>
                        {category.title}
                      </h3>

                      <p className={styles.categoryDescription}>
                        {category.description}
                      </p>

                      <span className={styles.categoryMore}>
                        Переглянути
                        <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}