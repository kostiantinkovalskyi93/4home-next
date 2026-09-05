import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/layout/Header";
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
    label: "РОЗПАШНІ ШАФИ",
    title: "Розпашні шафи",
    description:
      "Індивідуальні шафи для спальні, передпокою, дитячої, гардеробної та інших приміщень.",
    image: "/images/portfolio/hinged-02.webp",
    alt: "Розпашна шафа на замовлення",
  },
  {
    id: "sliding",
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
    description:
      "Враховуємо геометрію приміщення, плінтуси, розетки, виступи та інші особливості.",
  },
  {
    number: "02",
    title: "Система відкривання",
    description:
      "Підбираємо формат дверей відповідно до ширини проходу, планування та сценарію використання.",
  },
  {
    number: "03",
    title: "Внутрішнє наповнення",
    description:
      "Розподіляємо полиці, шухляди та секції так, щоб шафою було зручно користуватися щодня.",
  },
  {
    number: "04",
    title: "Зовнішній вигляд",
    description:
      "Фасади, кольори, дзеркала та деталі підбираються під інтер’єр приміщення.",
  },
];

const projects = [
  {
    number: "01",
    image: "/images/portfolio/hinged-01.webp",
    alt: "Розпашна шафа у світлому інтер'єрі",
  },
  {
    number: "02",
    image: "/images/home/portfolio/hall-furniture.webp",
    alt: "Шафа для передпокою на замовлення",
  },
  {
    number: "03",
    image: "/images/portfolio/sliding-02.webp",
    alt: "Шафа-купе з дзеркальними фасадами",
  },
  {
    number: "04",
    image: "/images/portfolio/sliding-02.webp",
    alt: "Шафа-купе на замовлення у кімнаті",
  },
];

const processSteps = [
  {
    number: "01",
    title: "Запит",
    description: "Фото, приблизні розміри та опис того, яка шафа потрібна.",
  },
  {
    number: "02",
    title: "Замір",
    description: "Уточнюємо розміри ніші, стіни та особливості приміщення.",
  },
  {
    number: "03",
    title: "Прорахунок",
    description: "Формуємо конструкцію, наповнення та розраховуємо вартість.",
  },
  {
    number: "04",
    title: "Погодження",
    description: "Узгоджуємо фасади, матеріали, фурнітуру та деталі.",
  },
  {
    number: "05",
    title: "Виготовлення",
    description: "Шафа виготовляється за погодженими параметрами.",
  },
  {
    number: "06",
    title: "Монтаж",
    description: "Доставляємо та встановлюємо готові меблі.",
  },
];

export default function WardrobesPage() {
  return (
    <>
      <Header />

      <main>
        <section className={styles.hero}>
          <Image
            src="/images/portfolio/hinged-02.webp"
            alt="Шафа на замовлення у Києві"
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
              <p className={styles.eyebrow}>ШАФИ НА ЗАМОВЛЕННЯ</p>

              <h1 className={styles.heroTitle}>
                Шафи, створені
                <br />
                під ваш простір
              </h1>

              <p className={styles.heroText}>
                Розпашні шафи та шафи-купе за індивідуальними розмірами,
                з продуманим наповненням і дизайном під конкретний інтер’єр.
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
              <p className={styles.sectionEyebrow}>ШАФИ 4HOME</p>

              <h2 className={styles.sectionTitle}>
                Не типове рішення,
                <br />
                а меблі під приміщення
              </h2>
            </div>

            <div className={styles.introContent}>
              <p>
                Шафа проєктується з урахуванням розмірів, розташування дверей,
                стін, ніш та інших особливостей конкретного приміщення.
              </p>

              <p>
                Перед виготовленням погоджуються конструкція, внутрішнє
                наповнення, фасади, матеріали та фурнітура.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.types}>
          {/*
            Обидва URL-якорі розташовані на початку секції.
            Тому /wardrobes#hinged і /wardrobes#sliding
            показують секцію повністю, а sticky Header
            більше не перекриває великий заголовок.
          */}
          <span
            id="hinged"
            aria-hidden="true"
            style={{
              display: "block",
              height: 0,
              scrollMarginTop: "110px",
            }}
          />

          <span
            id="sliding"
            aria-hidden="true"
            style={{
              display: "block",
              height: 0,
              scrollMarginTop: "110px",
            }}
          />

          <div className={`container ${styles.pageContainer}`}>
            <div className={styles.typesHeader}>
              <p className={styles.sectionEyebrow}>ТИПИ ШАФ</p>

              <h2 className={styles.sectionTitle}>
                Обираємо формат
                <br />
                під конкретну задачу
              </h2>
            </div>

            <div className={styles.typesGrid}>
              {types.map((item) => (
                <article key={item.id} className={styles.typeCard}>
                  <div className={styles.typeImageWrapper}>
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 700px) 100vw, 50vw"
                      className={styles.typeImage}
                    />
                  </div>

                  <div className={styles.typeContent}>
                    <p className={styles.typeLabel}>{item.label}</p>

                    <h3>{item.title}</h3>

                    <p>{item.description}</p>
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
                Продумуємо шафу
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
                  Важливо не тільки,
                  <br />
                  як шафа виглядає
                </h2>
              </div>

              <p className={styles.planningLead}>
                Зручність шафи залежить від того, наскільки правильно
                спроєктовані внутрішні секції, система відкривання та
                використання доступного простору.
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
                  Приклади шаф
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
                Від першого запиту
                <br />
                до готової шафи
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
                нову шафу?
              </h2>
            </div>

            <div className={styles.ctaContent}>
              <p>
                Надішліть фото місця встановлення, приблизні розміри або
                коротко опишіть, яка шафа вам потрібна.
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
