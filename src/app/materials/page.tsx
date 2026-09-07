import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { CONTACTS } from "@/data/contacts";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Матеріали для меблів на замовлення",
  description:
    "Матеріали та фурнітура для меблів на замовлення 4HOME: корпус, фасади, стільниці, меблеві механізми, кольори та фактури.",
  alternates: {
    canonical: "/materials",
  },
};

const materialGroups = [
  {
    number: "01",
    label: "FACADES",
    title: "Фасади",
    description:
      "Саме фасади найбільше впливають на візуальне сприйняття меблів. Їхній колір, фактура та пропорції підбираються під конкретний інтер’єр.",
    meta: "Колір / фактура / пропорції",
    image: "/images/materials/material-facades.webp",
    alt: "Фасади меблів на замовлення 4HOME",
    className: "facades",
  },
  {
    number: "02",
    label: "BODY",
    title: "Корпус",
    description:
      "Корпусні матеріали підбираються з урахуванням конструкції, навантаження, внутрішнього наповнення та умов використання меблів.",
    meta: "Конструкція / навантаження / використання",
    image: "/images/materials/material-body.webp",
    alt: "Корпус та внутрішнє наповнення меблів 4HOME",
    className: "body",
  },
  {
    number: "03",
    label: "WORKTOP",
    title: "Стільниці",
    description:
      "Для кухонь і робочих поверхонь важливі не лише зовнішній вигляд, а й практичність, товщина, геометрія та взаємодія з іншими матеріалами.",
    meta: "Поверхня / товщина / практичність",
    image: "/images/materials/material-worktop.webp",
    alt: "Стільниця для кухонних меблів 4HOME",
    className: "worktop",
  },
  {
    number: "04",
    label: "HARDWARE",
    title: "Фурнітура",
    description:
      "Петлі, напрямні та механізми визначають те, як меблі працюють щодня. Підбираємо їх відповідно до конструкції та сценарію використання.",
    meta: "Механіка / комфорт / сценарій",
    image: "/images/materials/material-hardware.webp",
    alt: "Меблева фурнітура та механізми 4HOME",
    className: "hardware",
  },
];

const selectionItems = [
  {
    number: "01",
    title: "Простір",
    description:
      "Враховуємо освітлення, площу приміщення, кольори стін, підлоги та вже наявні меблі.",
  },
  {
    number: "02",
    title: "Призначення",
    description:
      "Матеріали для кухні, передпокою, шафи або ТВ-зони можуть мати різні вимоги до практичності.",
  },
  {
    number: "03",
    title: "Візуальний баланс",
    description:
      "Підбираємо поєднання кольорів і фактур так, щоб меблі не виглядали окремим випадковим об’єктом.",
  },
  {
    number: "04",
    title: "Бюджет",
    description:
      "Рішення можна адаптувати за матеріалами та конструкцією, зберігши загальну логіку проєкту.",
  },
];

const hardwareBrands = [
  {
    number: "01",
    name: "HETTICH",
    label: "FURNITURE HARDWARE",
    description:
      "Петлі, напрямні, системи висування та інша функціональна фурнітура для меблевих конструкцій.",
    featured: true,
  },
  {
    number: "02",
    name: "HÄFELE",
    label: "FURNITURE HARDWARE",
    description:
      "Меблеві механізми, комплектуючі та функціональні рішення для різних типів індивідуальних меблів.",
    featured: true,
  },
  {
    number: "03",
    name: "GIFF PRIME",
    label: "HARDWARE SYSTEMS",
    description:
      "Фурнітура та механізми для сучасних меблевих конструкцій і систем зберігання.",
    featured: false,
  },
  {
    number: "04",
    name: "GIFF",
    label: "FURNITURE HARDWARE",
    description:
      "Функціональна меблева фурнітура для широкого спектра повсякденних меблевих задач.",
    featured: false,
  },
  {
    number: "05",
    name: "INOXA",
    label: "FUNCTIONAL SYSTEMS",
    description:
      "Функціональні системи та комплектуючі, зокрема для кухонних меблів і організації внутрішнього простору.",
    featured: false,
  },
  {
    number: "06",
    name: "VIRNO STYLE",
    label: "FURNITURE DETAILS",
    description:
      "Меблева фурнітура та аксесуари для функціональних і декоративних рішень.",
    featured: false,
  },
];

const combinationItems = [
  {
    number: "01",
    title: "Тон у тон",
    text: "Спокійне рішення, коли меблі підтримують загальну палітру приміщення.",
  },
  {
    number: "02",
    title: "Контраст",
    text: "Темні й світлі площини можуть підкреслювати архітектуру та пропорції меблів.",
  },
  {
    number: "03",
    title: "Фактура",
    text: "Деревні, матові та гладкі поверхні можна комбінувати для більшої глибини інтер’єру.",
  },
  {
    number: "04",
    title: "Акцент",
    text: "Іноді достатньо одного виразного матеріалу або кольору, а інші елементи залишити стриманими.",
  },
];

export default function MaterialsPage() {
  return (
    <main>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={`container ${styles.pageContainer} ${styles.heroInner}`}>
          <div className={styles.heroTop}>
            <p className={styles.eyebrow}>МАТЕРІАЛИ 4HOME</p>

            <div className={styles.heroIndex}>
              <span>05</span>
              <span>/</span>
              <span>MATERIALS</span>
            </div>
          </div>

          <div className={styles.heroGrid}>
            <Reveal>
              <h1 className={styles.heroTitle}>
                Матеріал —
                <br />
                це не просто
                <br />
                <span>колір поверхні.</span>
              </h1>
            </Reveal>

            <Reveal delay={70}>
              <div className={styles.heroSide}>
                <p className={styles.heroText}>
                  Важливі фактура, пропорції, практичність і те, як матеріал
                  працює разом з усім інтер’єром.
                </p>

                <div className={styles.heroActions}>
                  <Link
                    href="/contacts#lead-form"
                    className={styles.primaryButton}
                  >
                    <span>Обговорити матеріали</span>
                    <span aria-hidden="true">→</span>
                  </Link>

                  <Link href="/portfolio" className={styles.textLink}>
                    Реальні роботи
                    <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          <div className={styles.heroFooter}>
            <span>COLOR</span>
            <span className={styles.heroLine} />
            <span>TEXTURE</span>
            <span className={styles.heroLine} />
            <span>FUNCTION</span>
            <span className={styles.heroLine} />
            <span>DETAIL</span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.intro}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <p className={styles.sectionEyebrow}>ПІДБІР МАТЕРІАЛІВ</p>
          </Reveal>

          <div className={styles.introGrid}>
            <Reveal>
              <h2 className={styles.sectionTitle}>
                Спочатку інтер’єр.
                <br />
                <span>Потім конкретний матеріал.</span>
              </h2>
            </Reveal>

            <Reveal delay={70}>
              <div className={styles.introText}>
                <p>
                  Один і той самий фасад може виглядати зовсім по-різному
                  залежно від освітлення, сусідніх поверхонь і пропорцій меблів.
                </p>

                <p>
                  Тому матеріали розглядаємо не окремо, а як частину всього
                  проєкту.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* MATERIAL GROUPS */}
      <section className={styles.materials}>
        <div className={`container ${styles.pageContainer}`}>
          <div className={styles.materialsHeader}>
            <Reveal>
              <div>
                <p className={styles.sectionEyebrow}>01—04 / MATERIALS</p>

                <h2 className={styles.sectionTitle}>
                  Чотири
                  <br />
                  <span>основні шари.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <p className={styles.materialsLead}>
                Зовнішній вигляд і функціональність меблів формуються не одним
                рішенням, а поєднанням кількох рівнів.
              </p>
            </Reveal>
          </div>

          <div className={styles.materialGrid}>
            {materialGroups.map((item, index) => (
              <Reveal
                key={item.number}
                delay={index * 45}
                className={`${styles.materialReveal} ${
                  styles[item.className]
                }`}
              >
                <article className={styles.materialCard}>
                  <div className={styles.materialVisual}>
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      className={styles.materialPhoto}
                      sizes="(max-width: 650px) 100vw, (max-width: 1050px) 50vw, 55vw"
                    />

                    <div className={styles.materialOverlay} />

                    <span className={styles.materialNumber}>{item.number}</span>

                    <span className={styles.materialLabel}>{item.label}</span>
                  </div>

                  <div className={styles.materialContent}>
                    <h3>{item.title}</h3>

                    <p>{item.description}</p>

                    <span>{item.meta}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SELECTION */}
      <section className={styles.selection}>
        <div className={`container ${styles.pageContainer}`}>
          <div className={styles.selectionHeader}>
            <Reveal>
              <div>
                <p className={styles.darkEyebrow}>ЯК ОБИРАЄМО</p>

                <h2 className={styles.darkTitle}>
                  Не за зразком
                  <br />
                  <span>у вакуумі.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <p className={styles.selectionLead}>
                Матеріал оцінюємо у контексті конкретного приміщення, задачі та
                загального бюджету проєкту.
              </p>
            </Reveal>
          </div>

          <div className={styles.selectionList}>
            {selectionItems.map((item, index) => (
              <Reveal key={item.number} delay={index * 45}>
                <article className={styles.selectionItem}>
                  <span className={styles.selectionNumber}>{item.number}</span>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <span className={styles.selectionMark} aria-hidden="true">
                    +
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HARDWARE BRANDS */}
      <section className={styles.brands}>
        <div className={`container ${styles.pageContainer}`}>
          <div className={styles.brandsHeader}>
            <Reveal>
              <div>
                <p className={styles.sectionEyebrow}>ФУРНІТУРА</p>

                <h2 className={styles.sectionTitle}>
                  Бренди,
                  <br />
                  <span>з якими працюємо.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <div className={styles.brandsIntro}>
                <p>
                  Для різних проєктів використовуємо фурнітуру різного класу —
                  відповідно до конструкції, функціональності та бюджету.
                </p>

                <p>
                  Серед рішень, які використовуємо у роботі, є продукція
                  відомих виробників меблевої фурнітури та функціональних
                  систем.
                </p>
              </div>
            </Reveal>
          </div>

          <div className={styles.brandGrid}>
            {hardwareBrands.map((brand, index) => (
              <Reveal key={brand.name} delay={index * 45}>
                <article
                  className={`${styles.brandItem} ${
                    brand.featured ? styles.brandFeatured : ""
                  }`}
                >
                  <div className={styles.brandTop}>
                    <span>{brand.number}</span>
                    <span>{brand.label}</span>
                  </div>

                  <strong>{brand.name}</strong>

                  <p>{brand.description}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className={styles.brandsFooter}>
              <span>HARDWARE / FUNCTION / DETAIL</span>

              <p>
                Конкретний бренд, серія та тип фурнітури підбираються під
                конструкцію, навантаження, сценарій використання та бюджет
                конкретного проєкту.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* COMBINATIONS */}
      <section className={styles.combinations}>
        <div className={`container ${styles.pageContainer}`}>
          <div className={styles.combinationsGrid}>
            <Reveal>
              <div className={styles.combinationsHeading}>
                <p className={styles.sectionEyebrow}>КОЛІР + ФАКТУРА</p>

                <h2 className={styles.sectionTitle}>
                  Важливо
                  <br />
                  <span>не що окремо,</span>
                  <br />
                  а що разом.
                </h2>
              </div>
            </Reveal>

            <div className={styles.combinationsList}>
              {combinationItems.map((item, index) => (
                <Reveal key={item.number} delay={index * 45}>
                  <article className={styles.combinationItem}>
                    <div className={styles.combinationTop}>
                      <span>{item.number}</span>
                      <span className={styles.combinationLine} />
                    </div>

                    <h3>{item.title}</h3>

                    <p>{item.text}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATEMENT */}
      <section className={styles.statement}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <p className={styles.statementMeta}>4HOME / MATERIALS / KYIV</p>
          </Reveal>

          <Reveal delay={70}>
            <p className={styles.statementText}>
              Хороший матеріал
              <br />
              не привертає увагу
              <br />
              <span>окремо від меблів.</span>
              <br />
              Він працює разом із ними.
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <p className={styles.darkEyebrow}>ПІДБЕРЕМО ПІД ПРОЄКТ</p>
          </Reveal>

          <div className={styles.ctaGrid}>
            <Reveal>
              <h2 className={styles.ctaTitle}>
                Є інтер’єр
                <br />
                або просто
                <br />
                <span>ідея?</span>
              </h2>
            </Reveal>

            <Reveal delay={70}>
              <div className={styles.ctaContent}>
                <p>
                  Надішліть фото приміщення або приклад меблів, які подобаються.
                  Під час обговорення визначимо напрямок за матеріалами,
                  кольорами, фурнітурою та конструкцією.
                </p>

                <div className={styles.ctaActions}>
                  <Link
                    href="/contacts#lead-form"
                    className={styles.ctaButton}
                  >
                    <span>Обговорити проєкт</span>
                    <span aria-hidden="true">→</span>
                  </Link>

                  <a href={CONTACTS.phone.href} className={styles.phoneLinkDark}>
                    {CONTACTS.phone.display}
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