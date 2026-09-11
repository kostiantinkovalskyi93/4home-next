import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { CONTACTS } from "@/data/contacts";
import { SITE_NAME, SITE_URL } from "@/lib/site";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Інші меблі на замовлення у Києві",
  description:
    "Тумби, консолі, столи, меблі для передпокою, ТВ-зони та інші корпусні меблі на замовлення у Києві та передмісті.",
  alternates: {
    canonical: "/furniture",
  },
  openGraph: {
    type: "website",
    url: "/furniture",
    locale: "uk_UA",
    siteName: SITE_NAME,
    title: "Інші меблі на замовлення у Києві",
    description:
      "Тумби, консолі, столи, меблі для передпокою, ТВ-зони та інші корпусні меблі на замовлення у Києві та передмісті.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Інші меблі на замовлення у Києві",
    description:
      "Тумби, консолі, столи, меблі для передпокою, ТВ-зони та інші корпусні меблі на замовлення у Києві та передмісті.",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/furniture#service`,
  name: "Корпусні меблі на замовлення",
  url: `${SITE_URL}/furniture`,
  description:
    "Проєктування, виготовлення, доставка та встановлення корпусних меблів за індивідуальними розмірами у Києві та передмісті.",
  provider: {
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#business`,
    name: SITE_NAME,
    url: SITE_URL,
  },
  areaServed: "Київ та передмістя",
  serviceType: [
    "Корпусні меблі на замовлення",
    "Тумби та консолі на замовлення",
    "ТВ-зони на замовлення",
    "Меблі для передпокою на замовлення",
  ],
};

const furnitureTypes = [
  {
    number: "01",
    label: "OBJECT / 01",
    title: "Тумби та консолі",
    description:
      "Компактні меблі для спальні, передпокою, вітальні та інших приміщень.",
    image: "/images/portfolio/furniture-01.webp",
    alt: "Тумба або консоль на замовлення 4HOME",
    layout: "feature",
  },
  {
    number: "02",
    label: "MEDIA / 02",
    title: "ТВ-зони",
    description:
      "Тумби та меблеві композиції під телевізор, техніку й системи зберігання.",
    image: "/images/portfolio/media-console/media_console_4.webp",
    alt: "ТВ-зона на замовлення 4HOME",
    layout: "wide",
  },
  {
    number: "03",
    label: "HALL / 03",
    title: "Меблі для передпокою",
    description:
      "Рішення для зберігання взуття, верхнього одягу та повсякденних речей.",
    image: "/images/home/portfolio/hall-furniture.webp",
    alt: "Меблі для передпокою на замовлення 4HOME",
    layout: "portrait",
  },
  {
    number: "04",
    label: "CUSTOM / 04",
    title: "Індивідуальні рішення",
    description:
      "Інші корпусні меблі за вашими розмірами, якщо стандартні варіанти не підходять.",
    image: "/images/furniture/furniture-03.webp",
    alt: "Індивідуальні корпусні меблі на замовлення 4HOME",
    layout: "detail",
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
    label: "DIMENSIONS",
    title: "Розміри",
    description:
      "Ураховуємо доступну ширину, висоту, глибину та особливості місця встановлення.",
  },
  {
    number: "02",
    label: "FUNCTION",
    title: "Призначення",
    description:
      "Конструкція залежить від того, як саме меблі використовуватимуться щодня.",
  },
  {
    number: "03",
    label: "STORAGE",
    title: "Зберігання",
    description:
      "Продумуємо полиці, шухляди, дверцята та відкриті секції відповідно до задачі.",
  },
  {
    number: "04",
    label: "INTERIOR",
    title: "Інтер’єр",
    description:
      "Фасади, кольори та пропорції підбираються так, щоб меблі виглядали частиною простору.",
  },
];

const projects = [
  {
    number: "01",
    image: "/images/portfolio/furniture-01.webp",
    alt: "Консоль на замовлення 4HOME",
    layout: "tall",
  },
  {
    number: "02",
    image: "/images/portfolio/media-console/media_console_4.webp",
    alt: "ТВ-тумба на замовлення 4HOME",
    layout: "wide",
  },
  {
    number: "03",
    image: "/images/furniture/furniture-03.webp",
    alt: "Тумба на замовлення 4HOME",
    layout: "compact",
  },
  {
    number: "04",
    image: "/images/home/portfolio/hall-furniture.webp",
    alt: "Меблі для передпокою на замовлення 4HOME",
    layout: "large",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd),
        }}
      />

      <main>
      {/* HERO */}
      <section className={styles.hero}>
        <div
          className={`container ${styles.pageContainer} ${styles.heroInner}`}
        >
          <div className={`${styles.heroTop} ${styles.heroEntranceOne}`}>
            <p className={styles.eyebrow}>ІНШІ МЕБЛІ НА ЗАМОВЛЕННЯ</p>

            <div className={styles.heroIndex}>
              <span>03</span>
              <span>/</span>
              <span>FURNITURE</span>
            </div>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <h1
                className={`${styles.heroTitle} ${styles.heroEntranceTwo}`}
              >
                Меблі,
                <br />
                що завершують
                <br />
                <span>простір.</span>
              </h1>

              <div
                className={`${styles.heroLower} ${styles.heroEntranceThree}`}
              >
                <p className={styles.heroText}>
                  Тумби, консолі, ТВ-зони, меблі для передпокою та інші
                  корпусні рішення за індивідуальними розмірами.
                </p>

                <div className={styles.heroActions}>
                  <Link
                    href="/contacts#lead-form"
                    className={styles.primaryButton}
                  >
                    <span>Розрахувати вартість</span>
                    <span aria-hidden="true">→</span>
                  </Link>

                  <Link href="/portfolio" className={styles.textButton}>
                    Переглянути роботи
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </div>

            <div
              className={`${styles.heroVisual} ${styles.heroEntranceFour}`}
            >
              <div className={styles.heroImageFrame}>
                <Image
                  src="/images/portfolio/media-console/media_console_4.webp"
                  alt="Індивідуальні корпусні меблі на замовлення"
                  fill
                  priority
                  sizes="(max-width: 1050px) 100vw, 48vw"
                  className={styles.heroImage}
                />

                <div className={styles.heroImageOverlay} />

                <div className={styles.heroImageMeta}>
                  <span>4HOME / 2026</span>
                  <span>INDIVIDUAL FURNITURE</span>
                </div>
              </div>

              <span className={styles.heroObjectNumber}>03</span>

              <div className={styles.heroCaption}>
                <span>OBJECT</span>
                <span>SPACE</span>
                <span>FUNCTION</span>
              </div>
            </div>
          </div>

          <div className={`${styles.heroFooter} ${styles.heroEntranceFive}`}>
            <span>INDIVIDUAL</span>
            <span className={styles.heroFooterLine} />
            <span>FURNITURE</span>
            <span className={styles.heroFooterLine} />
            <span>KYIV</span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.intro}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <p className={styles.sectionEyebrow}>МЕБЛІ 4HOME</p>
          </Reveal>

          <div className={styles.introGrid}>
            <Reveal>
              <h2 className={styles.sectionTitle}>
                Не просто предмет.
                <br />
                <span>Частина інтер’єру.</span>
              </h2>
            </Reveal>

            <Reveal delay={70}>
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
            </Reveal>
          </div>
        </div>
      </section>

      {/* COLLECTION */}
      <section className={styles.collection}>
        <div className={`container ${styles.pageContainer}`}>
          <div className={styles.collectionHeader}>
            <Reveal>
              <div>
                <p className={styles.sectionEyebrow}>COLLECTION / 01—04</p>

                <h2 className={styles.sectionTitle}>
                  Різні меблі.
                  <br />
                  <span>Один підхід.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <p className={styles.collectionLead}>
                Кожен предмет створюється під своє місце, функцію та
                пропорції конкретного інтер’єру.
              </p>
            </Reveal>
          </div>

          <div className={styles.collectionGrid}>
            {furnitureTypes.map((item, index) => (
              <Reveal key={item.number} delay={index * 45}>
                <article
                  className={`${styles.collectionItem} ${
                    item.layout === "feature"
                      ? styles.collectionFeature
                      : item.layout === "wide"
                        ? styles.collectionWide
                        : item.layout === "portrait"
                          ? styles.collectionPortrait
                          : styles.collectionDetail
                  }`}
                >
                  <div className={styles.collectionImageWrapper}>
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="
                        (max-width: 650px) 100vw,
                        (max-width: 1050px) 50vw,
                        55vw
                      "
                      className={styles.collectionImage}
                    />

                    <div className={styles.collectionOverlay} />

                    <span className={styles.collectionImageNumber}>
                      {item.number}
                    </span>
                  </div>

                  <div className={styles.collectionContent}>
                    <span className={styles.collectionLabel}>
                      {item.label}
                    </span>

                    <h3>{item.title}</h3>

                    <p>{item.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className={styles.principles}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <p className={styles.sectionEyebrow}>ПІДХІД</p>
          </Reveal>

          <div className={styles.principlesIntro}>
            <Reveal>
              <h2 className={styles.statementTitle}>
                Один предмет меблів
                <br />
                може змінити
                <br />
                <span>весь простір.</span>
              </h2>
            </Reveal>

            <Reveal delay={70}>
              <p className={styles.statementText}>
                Важливі не лише фасади. Пропорції, висота, глибина,
                розташування та функція визначають, наскільки природно меблі
                працюватимуть в інтер’єрі.
              </p>
            </Reveal>
          </div>

          <div className={styles.principlesList}>
            {advantages.map((item, index) => (
              <Reveal key={item.number} delay={index * 40}>
                <article className={styles.principleItem}>
                  <div className={styles.principleMeta}>
                    <span>{item.number}</span>
                    <span className={styles.principleLine} />
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <span className={styles.principleMark} aria-hidden="true">
                    +
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PLANNING */}
      <section className={styles.planning}>
        <div className={`container ${styles.pageContainer}`}>
          <div className={styles.planningHeader}>
            <Reveal>
              <div>
                <p className={styles.darkEyebrow}>ПЛАНУВАННЯ</p>

                <h2 className={styles.darkTitle}>
                  Спочатку задача.
                  <br />
                  <span>Потім форма.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <p className={styles.planningLead}>
                Для невеликих меблів особливо важливі правильні пропорції та
                функціональність. Кожен сантиметр має працювати на конкретну
                задачу.
              </p>
            </Reveal>
          </div>

          <div className={styles.planningList}>
            {planningItems.map((item, index) => (
              <Reveal key={item.number} delay={index * 45}>
                <article className={styles.planningItem}>
                  <div className={styles.planningMeta}>
                    <span className={styles.planningNumber}>{item.number}</span>

                    <span className={styles.planningLabel}>{item.label}</span>
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <span className={styles.planningDot} aria-hidden="true" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section className={styles.portfolio}>
        <div className={`container ${styles.pageContainer}`}>
          <div className={styles.portfolioHeader}>
            <Reveal>
              <div>
                <p className={styles.sectionEyebrow}>ВИКОНАНІ РОБОТИ</p>

                <h2 className={styles.sectionTitle}>
                  Меблі
                  <br />
                  <span>у реальних інтер’єрах.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <Link href="/portfolio" className={styles.textLink}>
                Усі роботи
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>

          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <Reveal key={project.number} delay={index * 45}>
                <Link
                  href="/portfolio"
                  className={`${styles.projectCard} ${
                    project.layout === "tall"
                      ? styles.projectTall
                      : project.layout === "wide"
                        ? styles.projectWide
                        : project.layout === "compact"
                          ? styles.projectCompact
                          : styles.projectLarge
                  }`}
                >
                  <div className={styles.projectImageWrapper}>
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="
                        (max-width: 650px) 100vw,
                        (max-width: 1050px) 50vw,
                        55vw
                      "
                      className={styles.projectImage}
                    />

                    <div className={styles.projectOverlay} />

                    <div className={styles.projectMeta}>
                      <span>{project.number}</span>
                      <span>4HOME / FURNITURE</span>
                    </div>

                    <span className={styles.projectArrow} aria-hidden="true">
                      ↗
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className={styles.process}>
        <div className={`container ${styles.pageContainer}`}>
          <div className={styles.processHeader}>
            <Reveal>
              <div>
                <p className={styles.sectionEyebrow}>ЯК ЦЕ ВІДБУВАЄТЬСЯ</p>

                <h2 className={styles.sectionTitle}>
                  Від ідеї
                  <br />
                  <span>до готових меблів.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <Link href="/process" className={styles.textLink}>
                Детальніше про процес
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>

          <div className={styles.processList}>
            {processSteps.map((step, index) => (
              <Reveal key={step.number} delay={index * 35}>
                <article className={styles.processItem}>
                  <span className={styles.processNumber}>{step.number}</span>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>

                  <span className={styles.processDot} aria-hidden="true" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <p className={styles.darkEyebrow}>ПОЧНЕМО З ІДЕЇ</p>
          </Reveal>

          <div className={styles.ctaGrid}>
            <Reveal>
              <h2 className={styles.ctaTitle}>
                Потрібні меблі,
                <br />
                яких немає
                <br />
                <span>у каталозі?</span>
              </h2>
            </Reveal>

            <Reveal delay={70}>
              <div className={styles.ctaContent}>
                <p>
                  Надішліть фото місця, приблизні розміри або коротко опишіть,
                  що саме потрібно зробити.
                </p>

                <div className={styles.ctaActions}>
                  <Link
                    href="/contacts#lead-form"
                    className={styles.ctaButton}
                  >
                    <span>Обговорити проєкт</span>
                    <span aria-hidden="true">→</span>
                  </Link>

                  <a
                    href={CONTACTS.phone.href}
                    className={styles.phoneLink}
                  >
                    {CONTACTS.phone.display}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
      </main>
    </>
  );
}