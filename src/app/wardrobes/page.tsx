import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { CONTACTS } from "@/data/contacts";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Шафи на замовлення у Києві",
  description:
    "Розпашні шафи та шафи-купе на замовлення у Києві та передмісті. Індивідуальні розміри, наповнення, матеріали, доставка та монтаж.",
};

const types = [
  {
    id: "hinged",
    number: "01",
    index: "HINGED",
    label: "РОЗПАШНІ ШАФИ",
    title: "Розпашні шафи",
    description:
      "Індивідуальні шафи для спальні, передпокою, дитячої, гардеробної та інших приміщень.",
    image: "/images/portfolio/hinged-02.webp",
    alt: "Розпашна шафа на замовлення",
  },
  {
    id: "sliding",
    number: "02",
    index: "SLIDING",
    label: "ШАФИ-КУПЕ",
    title: "Шафи-купе",
    description:
      "Рішення для приміщень, де важливо ефективно використати простір і зберегти зручний доступ до речей.",
    image: "/images/portfolio/sliding-01.webp",
    alt: "Шафа-купе на замовлення",
  },
];

const advantages = [
  {
    number: "01",
    title: "За вашими розмірами",
    description:
      "Шафа проєктується під конкретну нішу, стіну або частину приміщення.",
  },
  {
    number: "02",
    title: "Індивідуальне наповнення",
    description:
      "Полиці, шухляди, секції та зони для одягу формуються під ваші потреби.",
  },
  {
    number: "03",
    title: "Підбір матеріалів",
    description:
      "Підбираємо корпус, фасади, дзеркала та фурнітуру відповідно до проєкту.",
  },
  {
    number: "04",
    title: "Доставка та монтаж",
    description:
      "Після виготовлення шафа доставляється та встановлюється на об’єкті.",
  },
];

const planningItems = [
  {
    number: "01",
    title: "Ніша або стіна",
    short: "SPACE",
    description:
      "Враховуємо геометрію приміщення, плінтуси, розетки, виступи та інші особливості.",
  },
  {
    number: "02",
    title: "Система відкривання",
    short: "OPENING",
    description:
      "Підбираємо формат дверей відповідно до ширини проходу, планування та сценарію використання.",
  },
  {
    number: "03",
    title: "Внутрішнє наповнення",
    short: "INSIDE",
    description:
      "Розподіляємо полиці, шухляди та секції так, щоб шафою було зручно користуватися щодня.",
  },
  {
    number: "04",
    title: "Зовнішній вигляд",
    short: "FACADE",
    description:
      "Фасади, кольори, дзеркала та деталі підбираються під інтер’єр приміщення.",
  },
];

const projects = [
  {
    number: "01",
    image: "/images/portfolio/hinged-01.webp",
    alt: "Розпашна шафа у світлому інтер'єрі",
    layout: "tall",
    position: "center",
  },
  {
    number: "02",
    image: "/images/home/portfolio/hall-furniture.webp",
    alt: "Шафа для передпокою на замовлення",
    layout: "wide",
    position: "center",
  },
  {
    number: "03",
    image: "/images/portfolio/sliding-02.webp",
    alt: "Шафа-купе з дзеркальними фасадами",
    layout: "narrow",
    position: "center",
  },
  {
    number: "04",
    image: "/images/portfolio/sliding-02.webp",
    alt: "Шафа-купе на замовлення у кімнаті",
    layout: "detail",
    position: "72% center",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Запит",
    description:
      "Фото, приблизні розміри та опис того, яка шафа потрібна.",
  },
  {
    number: "02",
    title: "Замір",
    description:
      "Уточнюємо розміри ніші, стіни та особливості приміщення.",
  },
  {
    number: "03",
    title: "Прорахунок",
    description:
      "Формуємо конструкцію, наповнення та розраховуємо вартість.",
  },
  {
    number: "04",
    title: "Погодження",
    description:
      "Узгоджуємо фасади, матеріали, фурнітуру та деталі.",
  },
  {
    number: "05",
    title: "Виготовлення",
    description:
      "Шафа виготовляється за погодженими параметрами.",
  },
  {
    number: "06",
    title: "Монтаж",
    description:
      "Доставляємо та встановлюємо готові меблі.",
  },
];

export default function WardrobesPage() {
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
                ШАФИ НА ЗАМОВЛЕННЯ
              </p>
            </div>

            <div
              className={`${styles.heroIndex} ${styles.heroEntrance} ${styles.heroEntranceTwo}`}
            >
              <span>02</span>
              <span>/</span>
              <span>WARDROBES</span>
            </div>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div
                className={`${styles.heroEntrance} ${styles.heroEntranceThree}`}
              >
                <h1 className={styles.heroTitle}>
                  Шафа
                  <br />
                  як частина
                  <br />
                  <span>простору.</span>
                </h1>
              </div>

              <div
                className={`${styles.heroLower} ${styles.heroEntrance} ${styles.heroEntranceFour}`}
              >
                <p className={styles.heroText}>
                  Розпашні шафи та шафи-купе за
                  індивідуальними розмірами, з продуманим
                  наповненням і дизайном під конкретний
                  інтер’єр.
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
              <div
                className={styles.heroArchitecture}
                aria-hidden="true"
              >
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className={styles.heroImageFrame}>
                <Image
                  src="/images/portfolio/hinged-02.webp"
                  alt="Шафа на замовлення у Києві"
                  fill
                  priority
                  sizes="(max-width: 850px) 100vw, 48vw"
                  className={styles.heroImage}
                />

                <div className={styles.heroImageOverlay} />

                <div className={styles.heroImageMeta}>
                  <span>4HOME</span>
                  <span>FITTED WARDROBE</span>
                </div>
              </div>

              <div className={styles.heroSideIndex}>
                <span>01</span>
                <span>02</span>
                <span>03</span>
                <span>04</span>
              </div>
            </div>
          </div>

          <div
            className={`${styles.heroFooter} ${styles.heroEntrance} ${styles.heroEntranceSix}`}
          >
            <span>ФАСАД</span>
            <span className={styles.heroFooterLine} />
            <span>НАПОВНЕННЯ</span>
            <span className={styles.heroFooterLine} />
            <span>ПРОСТІР</span>
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
              ШАФИ 4HOME
            </p>
          </Reveal>

          <div className={styles.introGrid}>
            <Reveal delay={60}>
              <h2 className={styles.sectionTitle}>
                Не типове рішення.
                <br />
                <span>Меблі під приміщення.</span>
              </h2>
            </Reveal>

            <Reveal delay={130}>
              <div className={styles.introContent}>
                <p>
                  Шафа проєктується з урахуванням
                  розмірів, розташування дверей, стін,
                  ніш та інших особливостей конкретного
                  приміщення.
                </p>

                <p>
                  Перед виготовленням погоджуються
                  конструкція, внутрішнє наповнення,
                  фасади, матеріали та фурнітура.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================================
          TYPES
      ======================================== */}

      <section className={styles.types}>
        <div
          className={`container ${styles.pageContainer}`}
        >
          <Reveal>
            <div className={styles.typesHeader}>
              <p className={styles.sectionEyebrow}>
                ТИПИ ШАФ
              </p>

              <h2 className={styles.sectionTitle}>
                Два формати.
                <br />
                <span>Різні сценарії.</span>
              </h2>
            </div>
          </Reveal>

          <div className={styles.typesList}>
            {types.map((item, index) => (
              <article
                key={item.id}
                id={item.id}
                className={`${styles.typePanel} ${
                  index % 2 === 1
                    ? styles.typePanelReverse
                    : ""
                }`}
              >
                <Reveal
                  className={styles.typeVisualReveal}
                >
                  <div className={styles.typeVisual}>
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 750px) 100vw, 55vw"
                      className={styles.typeImage}
                    />

                    <div
                      className={styles.typeImageOverlay}
                      aria-hidden="true"
                    />

                    <div className={styles.typeImageIndex}>
                      <span>{item.number}</span>
                      <span>{item.index}</span>
                    </div>
                  </div>
                </Reveal>

                <Reveal
                  delay={90}
                  className={styles.typeContentReveal}
                >
                  <div className={styles.typeContent}>
                    <div className={styles.typeNumber}>
                      {item.number}
                    </div>

                    <p className={styles.typeLabel}>
                      {item.label}
                    </p>

                    <h3>{item.title}</h3>

                    <p className={styles.typeDescription}>
                      {item.description}
                    </p>

                    <div
                      className={styles.typeLines}
                      aria-hidden="true"
                    >
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </Reveal>
              </article>
            ))}
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
                  <span>зовні й усередині.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={90}>
              <p className={styles.advantagesLead}>
                Розміри, наповнення та зовнішній вигляд
                формуються як одна система — відповідно
                до конкретного приміщення.
              </p>
            </Reveal>
          </div>

          <div className={styles.advantagesList}>
            {advantages.map((item, index) => (
              <Reveal
                key={item.number}
                delay={index * 50}
              >
                <article className={styles.advantageItem}>
                  <div className={styles.advantageMeta}>
                    <span>{item.number}</span>
                    <span
                      className={styles.advantageLine}
                      aria-hidden="true"
                    />
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <span
                    className={styles.advantageArrow}
                    aria-hidden="true"
                  >
                    ↘
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          ARCHITECTURE / PLANNING
      ======================================== */}

      <section className={styles.planning}>
        <div
          className={`container ${styles.pageContainer}`}
        >
          <div className={styles.planningHeader}>
            <Reveal>
              <div>
                <p className={styles.darkEyebrow}>
                  ВНУТРІШНЯ АРХІТЕКТУРА
                </p>

                <h2 className={styles.darkTitle}>
                  Важливо не тільки,
                  <br />
                  <span>як шафа виглядає.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <p className={styles.planningLead}>
                Зручність шафи залежить від того,
                наскільки правильно спроєктовані
                внутрішні секції, система відкривання та
                використання доступного простору.
              </p>
            </Reveal>
          </div>

          <div className={styles.cabinet}>
            {planningItems.map((item, index) => (
              <Reveal
                key={item.number}
                delay={index * 55}
                className={styles.cabinetReveal}
              >
                <article className={styles.cabinetSection}>
                  <div className={styles.cabinetTop}>
                    <span className={styles.cabinetNumber}>
                      {item.number}
                    </span>

                    <span className={styles.cabinetShort}>
                      {item.short}
                    </span>
                  </div>

                  <div
                    className={styles.cabinetGraphic}
                    aria-hidden="true"
                  >
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className={styles.cabinetContent}>
                    <h3>{item.title}</h3>

                    <p>{item.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={190}>
            <div className={styles.planningBottom}>
              <span>01 — SPACE</span>
              <span>02 — OPENING</span>
              <span>03 — INSIDE</span>
              <span>04 — FACADE</span>
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
                  Шафи
                  <br />
                  <span>у реальних інтер’єрах.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={90}>
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
                delay={index * 50}
                className={
                  project.layout === "wide"
                    ? styles.projectWideReveal
                    : project.layout === "detail"
                      ? styles.projectDetailReveal
                      : undefined
                }
              >
                <Link
                  href="/portfolio"
                  className={`${styles.projectCard} ${
                    project.layout === "tall"
                      ? styles.projectTall
                      : project.layout === "wide"
                        ? styles.projectWide
                        : project.layout === "detail"
                          ? styles.projectDetail
                          : styles.projectNarrow
                  }`}
                >
                  <div
                    className={styles.projectImageWrapper}
                  >
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="(max-width: 700px) 100vw, 50vw"
                      className={styles.projectImage}
                      style={{
                        objectPosition: project.position,
                      }}
                    />

                    <div
                      className={styles.projectOverlay}
                      aria-hidden="true"
                    />

                    <div className={styles.projectMeta}>
                      <span>{project.number}</span>
                      <span>WARDROBE / 4HOME</span>
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
                  Від першого запиту
                  <br />
                  <span>до готової шафи.</span>
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

          <div className={styles.processList}>
            {processSteps.map((step, index) => (
              <Reveal
                key={step.number}
                delay={Math.min(index, 5) * 45}
              >
                <article className={styles.processItem}>
                  <span className={styles.processNumber}>
                    {step.number}
                  </span>

                  <h3>{step.title}</h3>

                  <p>{step.description}</p>

                  <span
                    className={styles.processDot}
                    aria-hidden="true"
                  />
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
                Є місце
                <br />
                для шафи?
                <br />
                <span>Спроєктуємо рішення.</span>
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <div className={styles.ctaContent}>
                <p>
                  Надішліть фото місця встановлення,
                  приблизні розміри або коротко опишіть,
                  яка шафа вам потрібна.
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