import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { CONTACTS } from "@/data/contacts";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Кухні на замовлення у Києві",
  description:
    "Кухні на замовлення у Києві та передмісті. Індивідуальні розміри, підбір матеріалів, виготовлення, доставка та монтаж.",
};

const advantages = [
  {
    number: "01",
    title: "Під ваше приміщення",
    description:
      "Планування кухні формується з урахуванням розмірів приміщення, комунікацій, техніки та щоденних сценаріїв.",
  },
  {
    number: "02",
    title: "Індивідуальне наповнення",
    description:
      "Кількість секцій, шухляд, полиць і робочих зон визначається відповідно до ваших потреб.",
  },
  {
    number: "03",
    title: "Матеріали та фурнітура",
    description:
      "Допомагаємо підібрати фасади, корпусні матеріали, стільницю та механізми під конкретний проєкт.",
  },
  {
    number: "04",
    title: "Доставка та монтаж",
    description:
      "Після виготовлення кухня доставляється та встановлюється на об’єкті.",
  },
];

const planningItems = [
  {
    number: "01",
    title: "Планування",
    description:
      "Враховуємо геометрію приміщення, розташування вікон, дверей, розеток, води та вентиляції.",
  },
  {
    number: "02",
    title: "Побутова техніка",
    description:
      "Передбачаємо місця для вбудованої та окремостоячої техніки ще на етапі проєктування.",
  },
  {
    number: "03",
    title: "Робоча зона",
    description:
      "Розміщуємо основні функціональні зони так, щоб кухнею було зручно користуватися щодня.",
  },
  {
    number: "04",
    title: "Зберігання",
    description:
      "Продумуємо внутрішнє наповнення шаф і шухляд відповідно до доступного простору.",
  },
];

const projects = [
  {
    number: "01",
    image:
      "/images/portfolio/kitchen-luxury/luxury_kitchen_1.webp",
    alt: "Кухня на замовлення 4HOME",
    className: "large",
  },
  {
    number: "02",
    image: "/images/kitchens/kitchen-02.webp",
    alt: "Світла кухня на замовлення 4HOME",
    className: "small",
  },
  {
    number: "03",
    image:
      "/images/portfolio/kitchen-white/big_white_kitchen_2.webp",
    alt: "Сучасна кухня на замовлення 4HOME",
    className: "wide",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Запит",
    description:
      "Фото, приблизні розміри та короткий опис побажань.",
  },
  {
    number: "02",
    title: "Замір",
    description:
      "Уточнюємо геометрію приміщення та технічні особливості.",
  },
  {
    number: "03",
    title: "Прорахунок",
    description:
      "Підбираємо конструкцію, матеріали та формуємо вартість.",
  },
  {
    number: "04",
    title: "Погодження",
    description:
      "Фіксуємо зовнішній вигляд, наповнення та деталі проєкту.",
  },
  {
    number: "05",
    title: "Виготовлення",
    description:
      "Меблі виготовляються за погодженими параметрами.",
  },
  {
    number: "06",
    title: "Монтаж",
    description:
      "Доставляємо та встановлюємо готову кухню.",
  },
];

export default function KitchensPage() {
  return (
    <main>
      {/* ========================================
          HERO
      ======================================== */}

      <section className={styles.hero}>
        <div
          className={`container ${styles.pageContainer} ${styles.heroInner}`}
        >
          <div className={styles.heroTop}>
            <div
              className={`${styles.heroEntrance} ${styles.heroEntranceOne}`}
            >
              <p className={styles.eyebrow}>
                КУХНІ НА ЗАМОВЛЕННЯ
              </p>
            </div>

            <div
              className={`${styles.heroIndex} ${styles.heroEntrance} ${styles.heroEntranceTwo}`}
            >
              <span>01</span>
              <span>/</span>
              <span>KITCHENS</span>
            </div>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div
                className={`${styles.heroEntrance} ${styles.heroEntranceThree}`}
              >
                <h1 className={styles.heroTitle}>
                  Кухня,
                  <br />
                  створена
                  <br />
                  <span>під простір.</span>
                </h1>
              </div>

              <div
                className={`${styles.heroLower} ${styles.heroEntrance} ${styles.heroEntranceFour}`}
              >
                <p className={styles.heroText}>
                  Індивідуальне планування, розміри,
                  матеріали та наповнення — відповідно до
                  вашого приміщення і способу життя.
                </p>

                <div className={styles.heroActions}>
                  <Link
                    href="/contacts#lead-form"
                    className={styles.primaryButton}
                  >
                    <span>Розрахувати вартість</span>
                    <span aria-hidden="true">→</span>
                  </Link>

                  <Link
                    href="/portfolio"
                    className={styles.textButton}
                  >
                    Переглянути роботи
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </div>

            <div
              className={`${styles.heroVisual} ${styles.heroEntrance} ${styles.heroEntranceFive}`}
            >
              <div className={styles.heroImageFrame}>
                <Image
                  src="/images/portfolio/kitchen-luxury/luxury_kitchen_7.webp"
                  alt="Кухня на замовлення у Києві"
                  fill
                  priority
                  sizes="(max-width: 850px) 100vw, 58vw"
                  className={styles.heroImage}
                />

                <div
                  className={styles.heroImageOverlay}
                  aria-hidden="true"
                />

                <div className={styles.heroImageMeta}>
                  <span>4HOME</span>
                  <span>INDIVIDUAL KITCHEN</span>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`${styles.heroFooter} ${styles.heroEntrance} ${styles.heroEntranceSix}`}
          >
            <span>ПРОЄКТУЄМО ПІД ВАШ ПРОСТІР</span>
            <span className={styles.heroLine} />
            <span aria-hidden="true">↓</span>
          </div>
        </div>
      </section>

      {/* ========================================
          INTRO
      ======================================== */}

      <section className={styles.intro}>
        <div
          className={`container ${styles.pageContainer}`}
        >
          <Reveal>
            <p className={styles.sectionEyebrow}>
              КУХНЯ 4HOME
            </p>
          </Reveal>

          <div className={styles.introGrid}>
            <Reveal delay={60}>
              <h2 className={styles.sectionTitle}>
                Не готовий набір.
                <br />
                <span>
                  Індивідуальний проєкт.
                </span>
              </h2>
            </Reveal>

            <Reveal delay={130}>
              <div className={styles.introContent}>
                <p>
                  Кухня проєктується під конкретне
                  приміщення: його розміри, планування,
                  розташування комунікацій та побутової
                  техніки.
                </p>

                <p>
                  Перед виготовленням погоджуються
                  конструкція, зовнішній вигляд,
                  наповнення та матеріали. Це дозволяє
                  створити меблі, які відповідають саме
                  вашому простору.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================================
          PRINCIPLES
      ======================================== */}

      <section className={styles.advantages}>
        <div
          className={`container ${styles.pageContainer}`}
        >
          <div className={styles.advantagesHeader}>
            <Reveal>
              <div>
                <p className={styles.sectionEyebrow}>
                  ОСНОВНІ ПРИНЦИПИ
                </p>

                <h2 className={styles.sectionTitle}>
                  Продумуємо
                  <br />
                  <span>до деталей.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <p className={styles.advantagesLead}>
                Кожне рішення має працювати не лише
                візуально, а й у щоденному користуванні.
              </p>
            </Reveal>
          </div>

          <div className={styles.advantagesList}>
            {advantages.map((item, index) => (
              <Reveal
                key={item.number}
                delay={Math.min(index, 3) * 55}
              >
                <article className={styles.advantageItem}>
                  <span className={styles.advantageNumber}>
                    {item.number}
                  </span>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <span
                    className={styles.advantageMark}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          PLANNING / SIGNATURE
      ======================================== */}

      <section className={styles.planning}>
        <div
          className={`container ${styles.pageContainer}`}
        >
          <div className={styles.planningHeader}>
            <Reveal>
              <div>
                <p className={styles.darkEyebrow}>
                  ПЛАНУВАННЯ
                </p>

                <h2 className={styles.darkTitle}>
                  Важливо те,
                  <br />
                  <span>що не видно на фото.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <p className={styles.planningLead}>
                Хороша кухня — це не лише фасади. Важливо
                правильно розмістити техніку, робочі
                поверхні, системи зберігання та врахувати
                особливості самого приміщення.
              </p>
            </Reveal>
          </div>

          <div className={styles.planningTrack}>
            <div
              className={styles.planningProgress}
              aria-hidden="true"
            />

            {planningItems.map((item, index) => (
              <Reveal
                key={item.number}
                delay={index * 60}
              >
                <article className={styles.planningItem}>
                  <div className={styles.planningTop}>
                    <span className={styles.planningNumber}>
                      {item.number}
                    </span>

                    <span
                      className={styles.planningDot}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={180}>
            <div className={styles.planningFooter}>
              <span>SPACE</span>
              <span>APPLIANCES</span>
              <span>WORK ZONE</span>
              <span>STORAGE</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========================================
          PORTFOLIO
      ======================================== */}

      <section className={styles.portfolio}>
        <div
          className={`container ${styles.pageContainer}`}
        >
          <div className={styles.portfolioHeader}>
            <Reveal>
              <div>
                <p className={styles.sectionEyebrow}>
                  ВИКОНАНІ РОБОТИ
                </p>

                <h2 className={styles.sectionTitle}>
                  Кухні
                  <br />
                  <span>у реальних просторах.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <Link
                href="/portfolio"
                className={styles.textLink}
              >
                Усі роботи
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>

          <div className={styles.projectsGrid}>
            {projects.map((project, index) => (
              <Reveal
                key={project.number}
                delay={Math.min(index, 2) * 60}
                className={
                  project.className === "wide"
                    ? styles.projectWideReveal
                    : undefined
                }
              >
                <Link
                  href="/portfolio"
                  className={`${styles.projectCard} ${
                    project.className === "large"
                      ? styles.projectLarge
                      : project.className === "wide"
                        ? styles.projectWide
                        : styles.projectSmall
                  }`}
                >
                  <div
                    className={styles.projectImageWrapper}
                  >
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes={
                        project.className === "wide"
                          ? "100vw"
                          : "(max-width: 700px) 100vw, 55vw"
                      }
                      className={styles.projectImage}
                    />

                    <div
                      className={styles.projectOverlay}
                      aria-hidden="true"
                    />

                    <div className={styles.projectMeta}>
                      <span>{project.number}</span>

                      <span>REALIZED PROJECT</span>
                    </div>

                    <span
                      className={styles.projectArrow}
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          PROCESS
      ======================================== */}

      <section className={styles.process}>
        <div
          className={`container ${styles.pageContainer}`}
        >
          <div className={styles.processHeader}>
            <Reveal>
              <div>
                <p className={styles.sectionEyebrow}>
                  ЯК ЦЕ ВІДБУВАЄТЬСЯ
                </p>

                <h2 className={styles.sectionTitle}>
                  Від запиту
                  <br />
                  <span>до монтажу.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <Link
                href="/process"
                className={styles.textLink}
              >
                Детальніше про процес
                <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>

          <div className={styles.processTimeline}>
            {processSteps.map((step, index) => (
              <Reveal
                key={step.number}
                delay={Math.min(index, 5) * 45}
              >
                <article className={styles.processItem}>
                  <div className={styles.processMeta}>
                    <span>{step.number}</span>

                    <span
                      className={styles.processLine}
                      aria-hidden="true"
                    />
                  </div>

                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          CTA
      ======================================== */}

      <section className={styles.cta}>
        <div
          className={`container ${styles.pageContainer}`}
        >
          <Reveal>
            <p className={styles.darkEyebrow}>
              ПОЧНЕМО З ПРОРАХУНКУ
            </p>
          </Reveal>

          <div className={styles.ctaGrid}>
            <Reveal delay={70}>
              <h2 className={styles.ctaTitle}>
                Плануєте
                <br />
                нову кухню?
                <br />
                <span>Обговорімо простір.</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <div className={styles.ctaContent}>
                <p>
                  Надішліть фото приміщення, приблизні
                  розміри або коротко опишіть, яку кухню
                  ви плануєте.
                </p>

                <div className={styles.ctaActions}>
                  <Link
                    href="/contacts#lead-form"
                    className={styles.ctaButton}
                  >
                    <span>Розрахувати вартість</span>
                    <span aria-hidden="true">→</span>
                  </Link>

                  <a
                    href={CONTACTS.primaryPhone.href}
                    className={styles.phoneLink}
                  >
                    {CONTACTS.primaryPhone.display}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}