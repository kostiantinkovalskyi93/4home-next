import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/layout/Header";
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
    image: "/images/portfolio/kitchen-luxury/luxury_kitchen_1.webp",
    alt: "Кухня на замовлення 4HOME",
  },
  {
    number: "02",
    image: "/images/kitchens/kitchen-02.webp",
    alt: "Світла кухня на замовлення 4HOME",
  },
  {
    number: "03",
    image: "/images/portfolio/kitchen-white/big_white_kitchen_2.webp",
    alt: "Сучасна кухня на замовлення 4HOME",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Запит",
    description: "Фото, приблизні розміри та короткий опис побажань.",
  },
  {
    number: "02",
    title: "Замір",
    description: "Уточнюємо геометрію приміщення та технічні особливості.",
  },
  {
    number: "03",
    title: "Прорахунок",
    description: "Підбираємо конструкцію, матеріали та формуємо вартість.",
  },
  {
    number: "04",
    title: "Погодження",
    description: "Фіксуємо зовнішній вигляд, наповнення та деталі проєкту.",
  },
  {
    number: "05",
    title: "Виготовлення",
    description: "Меблі виготовляються за погодженими параметрами.",
  },
  {
    number: "06",
    title: "Монтаж",
    description: "Доставляємо та встановлюємо готову кухню.",
  },
];

export default function KitchensPage() {
  return (
    <>
      <Header />

      <main>
        <section className={styles.hero}>
          <Image
            src="/images/portfolio/kitchen-luxury/luxury_kitchen_7.webp"
            alt="Кухня на замовлення у Києві"
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
              <p className={styles.eyebrow}>КУХНІ НА ЗАМОВЛЕННЯ</p>

              <h1 className={styles.heroTitle}>
                Кухня, створена
                <br />
                під ваш простір
              </h1>

              <p className={styles.heroText}>
                Індивідуальне планування, розміри, матеріали та наповнення —
                відповідно до вашого приміщення і способу життя.
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
              <p className={styles.sectionEyebrow}>КУХНЯ 4HOME</p>

              <h2 className={styles.sectionTitle}>
                Не готовий набір,
                <br />
                а індивідуальний проєкт
              </h2>
            </div>

            <div className={styles.introContent}>
              <p>
                Кухня проєктується під конкретне приміщення: його розміри,
                планування, розташування комунікацій та побутової техніки.
              </p>

              <p>
                Перед виготовленням погоджуються конструкція, зовнішній вигляд,
                наповнення та матеріали. Це дозволяє створити меблі, які
                відповідають саме вашому простору.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.advantages}>
          <div className={`container ${styles.pageContainer}`}>
            <div className={styles.sectionHeading}>
              <p className={styles.sectionEyebrow}>ОСНОВНІ ПРИНЦИПИ</p>

              <h2 className={styles.sectionTitle}>
                Продумуємо кухню
                <br />
                до деталей
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
                  Враховуємо те,
                  <br />
                  що не видно на фото
                </h2>
              </div>

              <p className={styles.planningLead}>
                Хороша кухня — це не лише фасади. Важливо правильно розмістити
                техніку, робочі поверхні, системи зберігання та врахувати
                особливості самого приміщення.
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
                  Приклади кухонь
                  <br />
                  у реальних інтер’єрах
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
                      sizes="(max-width: 700px) 100vw, 33vw"
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
                Від першого запиту
                <br />
                до встановленої кухні
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
                Плануєте
                <br />
                нову кухню?
              </h2>
            </div>

            <div className={styles.ctaContent}>
              <p>
                Надішліть фото приміщення, приблизні розміри або коротко
                опишіть, яку кухню ви плануєте.
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
