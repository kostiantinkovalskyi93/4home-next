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

const portfolioProjects = [
  {
    number: "01",
    title: "Світла кухня",
    category: "Кухня на замовлення",
    image: "/images/home/portfolio/kitchen-light.webp",
    alt: "Світла кухня на замовлення",
    size: "featured",
  },
  {
    number: "02",
    title: "Вбудована шафа",
    category: "Розпашні шафи",
    image: "/images/home/portfolio/fitted-wardrobe.webp",
    alt: "Вбудована розпашна шафа",
    size: "small",
  },
  {
    number: "03",
    title: "Меблі для передпокою",
    category: "Індивідуальні меблі",
    image: "/images/home/portfolio/hall-furniture.webp",
    alt: "Меблі для передпокою на замовлення",
    size: "small",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Запит",
    description:
      "Надсилаєте фото, розміри або коротко описуєте, які меблі вам потрібні.",
  },
  {
    number: "02",
    title: "Замір",
    description:
      "Уточнюємо розміри приміщення та важливі технічні особливості майбутнього проєкту.",
  },
  {
    number: "03",
    title: "Прорахунок",
    description:
      "Формуємо конструкцію, підбираємо матеріали та розраховуємо вартість.",
  },
  {
    number: "04",
    title: "Погодження",
    description:
      "Узгоджуємо остаточний вигляд, наповнення, матеріали та деталі замовлення.",
  },
  {
    number: "05",
    title: "Виготовлення",
    description:
      "Після погодження проєкт переходить у виготовлення за затвердженими параметрами.",
  },
  {
    number: "06",
    title: "Доставка та монтаж",
    description:
      "Доставляємо меблі, виконуємо встановлення та перевіряємо готовий результат.",
  },
];

const materials = [
  {
    number: "01",
    title: "Корпусні матеріали",
    description:
      "Підбираємо матеріали для корпусу з урахуванням призначення меблів, навантаження та бюджету.",
  },
  {
    number: "02",
    title: "Фасади",
    description:
      "Підбираємо колір, фактуру та тип фасадів так, щоб меблі гармонійно вписувалися в інтер’єр.",
  },
  {
    number: "03",
    title: "Стільниці та поверхні",
    description:
      "Враховуємо зовнішній вигляд, практичність і умови використання робочих поверхонь.",
  },
  {
    number: "04",
    title: "Фурнітура та механізми",
    description:
      "Підбираємо петлі, напрямні, системи відкривання та інші механізми відповідно до конструкції.",
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

                      <span className={styles.categoryArrow} aria-hidden="true">
                        ↗
                      </span>
                    </div>

                    <div className={styles.categoryContent}>
                      <h3 className={styles.categoryTitle}>{category.title}</h3>

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

        <section className={styles.portfolio}>
          <div className="container">
            <div className={styles.portfolioHeader}>
              <div>
                <p className={styles.portfolioEyebrow}>НАШІ РОБОТИ</p>

                <h2 className={styles.portfolioTitle}>
                  Подивіться на
                  <br />
                  результат наживо
                </h2>
              </div>

              <div className={styles.portfolioHeaderRight}>
                <p className={styles.portfolioIntro}>
                  Кілька прикладів виконаних меблів. У повному портфоліо
                  зберемо більше фотографій кожного проєкту.
                </p>

                <Link href="/portfolio" className={styles.portfolioAllLink}>
                  Усі роботи
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className={styles.portfolioGrid}>
              {portfolioProjects.map((project) => (
                <article
                  key={project.number}
                  className={`${styles.portfolioCard} ${
                    project.size === "featured"
                      ? styles.portfolioFeatured
                      : styles.portfolioSmall
                  }`}
                >
                  <Link href="/portfolio" className={styles.portfolioLink}>
                    <div className={styles.portfolioImageWrapper}>
                      <Image
                        src={project.image}
                        alt={project.alt}
                        fill
                        sizes={
                          project.size === "featured"
                            ? "(max-width: 760px) 100vw, 58vw"
                            : "(max-width: 760px) 100vw, 38vw"
                        }
                        className={styles.portfolioImage}
                      />

                      <span className={styles.portfolioNumber}>
                        {project.number}
                      </span>

                      <span className={styles.portfolioArrow} aria-hidden="true">
                        ↗
                      </span>
                    </div>

                    <div className={styles.portfolioInfo}>
                      <p className={styles.portfolioCategory}>
                        {project.category}
                      </p>

                      <h3 className={styles.portfolioProjectTitle}>
                        {project.title}
                      </h3>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            <div className={styles.portfolioMobileAction}>
              <Link href="/portfolio" className={styles.portfolioMobileLink}>
                Переглянути всі роботи
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.process}>
          <div className="container">
            <div className={styles.processHeader}>
              <div>
                <p className={styles.processEyebrow}>ЯК МИ ПРАЦЮЄМО</p>

                <h2 className={styles.processTitle}>
                  Від першого запиту
                  <br />
                  до готових меблів
                </h2>
              </div>

              <p className={styles.processIntro}>
                Зрозумілий послідовний процес без готових шаблонів — кожне
                замовлення проходить шлях від вашої ідеї до встановлення.
              </p>
            </div>

            <ol className={styles.processTimeline}>
              {processSteps.map((step) => (
                <li key={step.number} className={styles.processStep}>
                  <div className={styles.processMarker}>
                    <span>{step.number}</span>
                  </div>

                  <div className={styles.processContent}>
                    <h3 className={styles.processStepTitle}>{step.title}</h3>

                    <p className={styles.processDescription}>
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className={styles.processAction}>
              <Link href="/contacts" className={styles.processButton}>
                Обговорити проєкт
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.materials}>
          <div className="container">
            <div className={styles.materialsHeader}>
              <div>
                <p className={styles.materialsEyebrow}>
                  МАТЕРІАЛИ ТА ФУРНІТУРА
                </p>

                <h2 className={styles.materialsTitle}>
                  Підбираємо рішення
                  <br />
                  під конкретний проєкт
                </h2>
              </div>

              <div className={styles.materialsHeaderRight}>
                <p className={styles.materialsIntro}>
                  Матеріали, кольори та механізми підбираються під конструкцію,
                  стиль, умови використання та бюджет майбутніх меблів.
                </p>

                <Link href="/materials" className={styles.materialsLink}>
                  Детальніше про матеріали
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className={styles.materialsGrid}>
              {materials.map((item) => (
                <article key={item.number} className={styles.materialCard}>
                  <div className={styles.materialTop}>
                    <span className={styles.materialNumber}>{item.number}</span>
                    <span className={styles.materialPlus} aria-hidden="true">
                      +
                    </span>
                  </div>

                  <div className={styles.materialContent}>
                    <h3 className={styles.materialTitle}>{item.title}</h3>

                    <p className={styles.materialDescription}>
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}