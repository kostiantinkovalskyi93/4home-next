import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { CONTACTS } from "@/data/contacts";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Інші меблі на замовлення у Києві",
  description:
    "Тумби, консолі, столи, меблі для передпокою, ТВ-зони та інші корпусні меблі на замовлення у Києві та передмісті.",
};

const furnitureTypes = [
  {
    number: "01",
    title: "Тумби та консолі",
    description:
      "Компактні меблі для спальні, передпокою, вітальні та інших приміщень.",
    image: "/images/furniture/furniture-01.webp",
    alt: "Тумба або консоль на замовлення 4HOME",
    layout: "large",
  },
  {
    number: "02",
    title: "ТВ-зони",
    description:
      "Тумби та меблеві композиції під телевізор, техніку й системи зберігання.",
    image: "/images/furniture/furniture-02.webp",
    alt: "ТВ-зона на замовлення 4HOME",
    layout: "small",
  },
  {
    number: "03",
    title: "Меблі для передпокою",
    description:
      "Рішення для зберігання взуття, верхнього одягу та повсякденних речей.",
    image: "/images/furniture/furniture-04.webp",
    alt: "Меблі для передпокою на замовлення 4HOME",
    layout: "small",
  },
  {
    number: "04",
    title: "Індивідуальні рішення",
    description:
      "Інші корпусні меблі за вашими розмірами, якщо стандартні варіанти не підходять.",
    image: "/images/furniture/furniture-03.webp",
    alt: "Індивідуальні корпусні меблі на замовлення 4HOME",
    layout: "large",
  },
];

const advantages = [
  {
    number: "01",
    title: "За вашими розмірами",
    description:
      "Меблі проєктуються під конкретну стіну, нішу або частину приміщення.",
  },
  {
    number: "02",
    title: "Під конкретну задачу",
    description:
      "Функціональність визначається тим, що саме потрібно зберігати або розміщувати.",
  },
  {
    number: "03",
    title: "Єдиний стиль",
    description:
      "Колір, матеріали та деталі можна підібрати під уже існуючий інтер’єр.",
  },
  {
    number: "04",
    title: "Доставка та монтаж",
    description:
      "Після виготовлення меблі доставляються та встановлюються на об’єкті.",
  },
];

const planningItems = [
  {
    number: "01",
    title: "Розміри",
    description:
      "Ураховуємо доступну ширину, висоту, глибину та особливості місця встановлення.",
  },
  {
    number: "02",
    title: "Призначення",
    description:
      "Конструкція залежить від того, як саме меблі використовуватимуться щодня.",
  },
  {
    number: "03",
    title: "Зберігання",
    description:
      "Продумуємо полиці, шухляди, дверцята та відкриті секції відповідно до задачі.",
  },
  {
    number: "04",
    title: "Інтер’єр",
    description:
      "Фасади, кольори та пропорції підбираються так, щоб меблі виглядали частиною простору.",
  },
];

const projects = [
  {
    number: "01",
    image: "/images/furniture/furniture-01.webp",
    alt: "Консоль на замовлення 4HOME",
  },
  {
    number: "02",
    image: "/images/furniture/furniture-02.webp",
    alt: "ТВ-тумба на замовлення 4HOME",
  },
  {
    number: "03",
    image: "/images/furniture/furniture-03.webp",
    alt: "Тумба на замовлення 4HOME",
  },
  {
    number: "04",
    image: "/images/furniture/furniture-04.webp",
    alt: "Меблі для передпокою на замовлення 4HOME",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Запит",
    description: "Фото, приблизні розміри та короткий опис потрібних меблів.",
  },
  {
    number: "02",
    title: "Замір",
    description: "Уточнюємо розміри та особливості місця встановлення.",
  },
  {
    number: "03",
    title: "Прорахунок",
    description: "Формуємо конструкцію, підбираємо матеріали та вартість.",
  },
  {
    number: "04",
    title: "Погодження",
    description: "Узгоджуємо зовнішній вигляд, наповнення та деталі.",
  },
  {
    number: "05",
    title: "Виготовлення",
    description: "Меблі виготовляються за погодженими параметрами.",
  },
  {
    number: "06",
    title: "Монтаж",
    description: "Доставляємо та встановлюємо готові меблі.",
  },
];

export default function FurniturePage() {
  return (
    <>
      <Header />

      <main>
        <section className={styles.hero}>
          <Image
            src="/images/furniture/furniture-hero.webp"
            alt="Індивідуальні корпусні меблі на замовлення"
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />

          <div className={styles.heroOverlay} />

          <div
            className={`container ${styles.pageContainer} ${styles.heroInner}`}
          >
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>ІНШІ МЕБЛІ НА ЗАМОВЛЕННЯ</p>

              <h1 className={styles.heroTitle}>
                Меблі для задач,
                <br />
                де стандартного мало
              </h1>

              <p className={styles.heroText}>
                Тумби, консолі, ТВ-зони, меблі для передпокою та інші корпусні
                рішення за індивідуальними розмірами.
              </p>

              <div className={styles.heroActions}>
                <Link href="/contacts" className={styles.primaryButton}>
                  Розрахувати вартість
                  <span aria-hidden="true">→</span>
                </Link>

                <Link href="/portfolio" className={styles.secondaryButton}>
                  Переглянути роботи
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.intro}>
          <div
            className={`container ${styles.pageContainer} ${styles.introGrid}`}
          >
            <div>
              <p className={styles.sectionEyebrow}>МЕБЛІ 4HOME</p>

              <h2 className={styles.sectionTitle}>
                Для простору,
                <br />
                де потрібне своє рішення
              </h2>
            </div>

            <div className={styles.introContent}>
              <p>
                Не всі меблі можна зручно підібрати серед стандартних готових
                моделей. Розміри приміщення, ніші або конкретна функція часто
                потребують індивідуального проєкту.
              </p>

              <p>
                Тому конструкція, пропорції, матеріали та наповнення
                підбираються під конкретне місце й задачу.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.types}>
          <div className={`container ${styles.pageContainer}`}>
            <div className={styles.typesHeader}>
              <p className={styles.sectionEyebrow}>ЩО МОЖНА ЗРОБИТИ</p>

              <h2 className={styles.sectionTitle}>
                Різні меблі —
                <br />
                один підхід
              </h2>
            </div>

            <div className={styles.visualGrid}>
              {furnitureTypes.map((item) => (
                <article
                  key={item.number}
                  className={`${styles.visualCard} ${
                    item.layout === "large"
                      ? styles.visualCardLarge
                      : styles.visualCardSmall
                  }`}
                >
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 700px) 100vw, 50vw"
                    className={styles.visualImage}
                  />

                  <div className={styles.visualOverlay} />

                  <div className={styles.visualContent}>
                    <span className={styles.visualNumber}>{item.number}</span>

                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.advantages}>
          <div className={`container ${styles.pageContainer}`}>
            <div className={styles.sectionHeading}>
              <p className={styles.sectionEyebrow}>ОСНОВНІ ПРИНЦИПИ</p>

              <h2 className={styles.sectionTitle}>
                Створюємо меблі
                <br />
                під конкретний простір
              </h2>
            </div>

            <div className={styles.advantagesGrid}>
              {advantages.map((item) => (
                <article key={item.number} className={styles.advantageCard}>
                  <span className={styles.cardNumber}>{item.number}</span>

                  <div>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardText}>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.planning}>
          <div className={`container ${styles.pageContainer}`}>
            <div className={styles.planningHeader}>
              <div>
                <p className={styles.darkEyebrow}>ПЛАНУВАННЯ</p>

                <h2 className={styles.darkTitle}>
                  Спочатку задача,
                  <br />
                  потім конструкція
                </h2>
              </div>

              <p className={styles.planningLead}>
                Для невеликих меблів особливо важливі правильні пропорції та
                функціональність. Кожен сантиметр має працювати на конкретну
                задачу.
              </p>
            </div>

            <div className={styles.planningGrid}>
              {planningItems.map((item) => (
                <article key={item.number} className={styles.planningItem}>
                  <span className={styles.planningNumber}>{item.number}</span>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.portfolio}>
          <div className={`container ${styles.pageContainer}`}>
            <div className={styles.portfolioHeader}>
              <div>
                <p className={styles.sectionEyebrow}>ВИКОНАНІ РОБОТИ</p>

                <h2 className={styles.sectionTitle}>
                  Приклади
                  <br />
                  індивідуальних меблів
                </h2>
              </div>

              <Link href="/portfolio" className={styles.textLink}>
                Усі роботи
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className={styles.projectsGrid}>
              {projects.map((project) => (
                <Link
                  key={project.number}
                  href="/portfolio"
                  className={styles.projectCard}
                >
                  <div className={styles.projectImageWrapper}>
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="(max-width: 700px) 100vw, 25vw"
                      className={styles.projectImage}
                    />

                    <span className={styles.projectNumber}>
                      {project.number}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.process}>
          <div className={`container ${styles.pageContainer}`}>
            <div className={styles.processHeader}>
              <p className={styles.sectionEyebrow}>ЯК ЦЕ ВІДБУВАЄТЬСЯ</p>

              <h2 className={styles.sectionTitle}>
                Від ідеї
                <br />
                до готових меблів
              </h2>
            </div>

            <div className={styles.processGrid}>
              {processSteps.map((step) => (
                <article key={step.number} className={styles.processItem}>
                  <span className={styles.processNumber}>{step.number}</span>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.cta}>
          <div
            className={`container ${styles.pageContainer} ${styles.ctaGrid}`}
          >
            <div>
              <p className={styles.darkEyebrow}>ПОЧНЕМО З ПРОРАХУНКУ</p>

              <h2 className={styles.ctaTitle}>
                Є ідея
                <br />
                для меблів?
              </h2>
            </div>

            <div className={styles.ctaContent}>
              <p>
                Надішліть фото місця, приблизні розміри або коротко опишіть, що
                саме потрібно зробити.
              </p>

              <div className={styles.ctaActions}>
                <Link href="/contacts" className={styles.primaryButton}>
                  Розрахувати вартість
                  <span aria-hidden="true">→</span>
                </Link>

                <a
                  href={CONTACTS.phone.href}
                  className={styles.secondaryButton}
                >
                  {CONTACTS.phone.display}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}