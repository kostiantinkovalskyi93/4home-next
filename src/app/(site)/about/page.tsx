import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { CONTACTS } from "@/data/contacts";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Про 4HOME — меблі на замовлення у Києві",
  description:
    "4HOME — меблі на замовлення у Києві та передмісті. Індивідуальне проєктування, підбір матеріалів, виготовлення, доставка та монтаж.",
  alternates: {
    canonical: "/about",
  },
};

const principles = [
  {
    number: "01",
    eyebrow: "ПРОСТІР",
    title: "Починаємо не з меблів, а з приміщення",
    description:
      "Розміри, геометрія, розташування комунікацій і доступний простір формують основу майбутнього проєкту.",
  },
  {
    number: "02",
    eyebrow: "ФУНКЦІЯ",
    title: "Продумуємо щоденне користування",
    description:
      "Розташування секцій, шухляд, полиць і робочих зон визначається тим, як саме ви користуватиметеся меблями.",
  },
  {
    number: "03",
    eyebrow: "ДЕТАЛІ",
    title: "Погоджуємо рішення до виготовлення",
    description:
      "Конструкція, зовнішній вигляд, матеріали та внутрішнє наповнення узгоджуються до початку роботи.",
  },
  {
    number: "04",
    eyebrow: "РЕЗУЛЬТАТ",
    title: "Завершуємо проєкт встановленням",
    description:
      "Після виготовлення меблі доставляються на об’єкт і встановлюються у підготовленому приміщенні.",
  },
] as const;

const journey = [
  {
    number: "01",
    title: "Задача",
    description:
      "Ви надсилаєте фото, приблизні розміри та описуєте, які меблі плануєте.",
  },
  {
    number: "02",
    title: "Простір",
    description:
      "Уточнюємо розміри, геометрію приміщення та технічні особливості.",
  },
  {
    number: "03",
    title: "Рішення",
    description:
      "Формуємо конструкцію, підбираємо матеріали й погоджуємо важливі деталі.",
  },
  {
    number: "04",
    title: "Готові меблі",
    description:
      "Проєкт переходить у виготовлення, після чого меблі доставляються та монтуються.",
  },
] as const;

const projects = [
  {
    image: "/images/portfolio/kitchen-luxury/luxury_kitchen_1.webp",
    alt: "Кухня на замовлення 4HOME",
    label: "Кухні",
    href: "/kitchens",
    className: styles.projectLarge,
  },
  {
    image: "/images/portfolio/hinged-02.webp",
    alt: "Розпашна шафа на замовлення 4HOME",
    label: "Шафи",
    href: "/wardrobes",
    className: styles.projectTall,
  },
  {
    image: "/images/portfolio/media-console/media_console_4.webp",
    alt: "Інші меблі на замовлення 4HOME",
    label: "Інші меблі",
    href: "/furniture",
    className: styles.projectSmall,
  },
] as const;

export default function AboutPage() {
  return (
    <main>
      <section className={styles.hero}>
        <div
          className={`container ${styles.pageContainer} ${styles.heroGrid}`}
        >
          <div className={styles.heroCopy}>
            <div className={styles.heroCopyInner}>
              <div className={`${styles.heroReveal} ${styles.heroRevealOne}`}>
                <p className={styles.eyebrow}>ПРО 4HOME</p>
              </div>

              <div className={`${styles.heroReveal} ${styles.heroRevealTwo}`}>
                <h1 className={styles.heroTitle}>
                  Меблі не
                  <br />
                  починаються
                  <br />
                  з каталогу.
                </h1>
              </div>

              <div className={`${styles.heroReveal} ${styles.heroRevealThree}`}>
                <p className={styles.heroStatement}>
                  Вони починаються
                  <br />
                  з вашого простору.
                </p>
              </div>

              <div className={`${styles.heroReveal} ${styles.heroRevealFour}`}>
                <p className={styles.heroText}>
                  Проєктуємо та виготовляємо меблі під конкретне приміщення,
                  ваші потреби та деталі майбутнього інтер’єру.
                </p>
              </div>

              <div className={`${styles.heroReveal} ${styles.heroRevealFive}`}>
                <Link
                  href="/contacts#lead-form"
                  className={styles.primaryButton}
                >
                  Обговорити проєкт
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroImageFrame}>
              <Image
                src="/images/portfolio/kitchen-luxury/luxury_kitchen_7.webp"
                alt="Індивідуальні меблі 4HOME"
                fill
                priority
                sizes="(max-width: 800px) 100vw, (max-width: 1328px) 48vw, 610px"
                className={styles.heroImage}
              />

              <div className={styles.heroImageShade} />

              <div className={styles.heroMarker}>
                <span>4HOME</span>
                <span>INDIVIDUAL FURNITURE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.manifesto}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <p className={styles.sectionEyebrow}>НАШ ПІДХІД</p>
          </Reveal>

          <Reveal delay={80}>
            <h2 className={styles.manifestoTitle}>
              Ми не шукаємо меблі,
              <br />
              які приблизно підійдуть.
              <br />
              <span>Ми створюємо ті, що потрібні саме тут.</span>
            </h2>
          </Reveal>

          <div className={styles.manifestoTextGrid}>
            <Reveal delay={120}>
              <p>
                4HOME працює з індивідуальними замовленнями. Тому відправною
                точкою стає не готова модель, а конкретне приміщення, його
                розміри та ваша задача.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <p>
                Кухні, шафи та інші корпусні меблі отримують свою конструкцію,
                матеріали й наповнення відповідно до того, як вони повинні
                працювати саме у вашому просторі.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className={styles.principles}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <div className={styles.principlesHeading}>
              <p className={styles.sectionEyebrow}>ЩО ДЛЯ НАС ВАЖЛИВО</p>

              <h2 className={styles.sectionTitle}>
                Чотири речі,
                <br />
                навколо яких будується проєкт
              </h2>
            </div>
          </Reveal>

          <div className={styles.principlesList}>
            {principles.map((principle, index) => (
              <Reveal
                key={principle.number}
                delay={index * 90}
                className={styles.principleReveal}
              >
                <article className={styles.principle}>
                  <div className={styles.principleMeta}>
                    <span className={styles.principleNumber}>
                      {principle.number}
                    </span>

                    <span className={styles.principleEyebrow}>
                      {principle.eyebrow}
                    </span>
                  </div>

                  <div className={styles.principleContent}>
                    <h3>{principle.title}</h3>
                    <p>{principle.description}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.journey}>
        <div
          className={`container ${styles.pageContainer} ${styles.journeyGrid}`}
        >
          <div className={styles.journeyIntro}>
            <Reveal>
              <p className={styles.darkEyebrow}>ВІД ІДЕЇ ДО РЕЗУЛЬТАТУ</p>
            </Reveal>

            <Reveal delay={80}>
              <h2 className={styles.darkTitle}>
                Один простір.
                <br />
                Один проєкт.
                <br />
                Послідовний шлях.
              </h2>
            </Reveal>

            <Reveal delay={140}>
              <div className={styles.journeyIndex} aria-hidden="true">
                <span>01</span>
                <span className={styles.journeyArrow}>→</span>
                <span>04</span>
              </div>
            </Reveal>
          </div>

          <div className={styles.journeySteps}>
            {journey.map((step, index) => (
              <Reveal key={step.number} delay={index * 100}>
                <article className={styles.journeyStep}>
                  <span className={styles.journeyNumber}>{step.number}</span>

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

      <section className={styles.work}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <div className={styles.workHeader}>
              <div>
                <p className={styles.sectionEyebrow}>ВИКОНАНІ РОБОТИ</p>

                <h2 className={styles.sectionTitle}>
                  Результат краще
                  <br />
                  пояснює наш підхід
                </h2>
              </div>

              <Link href="/portfolio" className={styles.textLink}>
                Переглянути всі роботи
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>

          <div className={styles.projectComposition}>
            {projects.map((project, index) => (
              <Reveal
                key={project.image}
                delay={index * 110}
                className={project.className}
              >
                <Link href={project.href} className={styles.projectCard}>
                  <div className={styles.projectImageWrap}>
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1328px) 50vw, 640px"
                      className={styles.projectImage}
                    />

                    <div className={styles.projectOverlay} />

                    <div className={styles.projectCaption}>
                      <span>{project.label}</span>
                      <span aria-hidden="true">↗</span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.location}>
        <div
          className={`container ${styles.pageContainer} ${styles.locationGrid}`}
        >
          <Reveal>
            <div>
              <p className={styles.sectionEyebrow}>ГЕОГРАФІЯ</p>

              <h2 className={styles.locationTitle}>
                Київ
                <span>та передмістя</span>
              </h2>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className={styles.locationContent}>
              <p>
                Працюємо з індивідуальними замовленнями у Києві та передмісті.
                Для першого обговорення достатньо фото приміщення, приблизних
                розмірів і короткого опису того, що ви плануєте.
              </p>

              <Link href="/contacts#lead-form" className={styles.textLink}>
                Надіслати запит
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className={styles.finalCta}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <p className={styles.sectionEyebrow}>ВАШ ПРОЄКТ</p>
          </Reveal>

          <div className={styles.finalCtaGrid}>
            <Reveal delay={80}>
              <h2 className={styles.finalCtaTitle}>
                Є простір.
                <br />
                Є ідея.
                <br />
                <span>Перетворимо її на меблі.</span>
              </h2>
            </Reveal>

            <Reveal delay={160}>
              <div className={styles.finalCtaActions}>
                <Link
                  href="/contacts#lead-form"
                  className={styles.finalButton}
                >
                  <span>Обговорити проєкт</span>
                  <span aria-hidden="true">→</span>
                </Link>

                <a
                  href={CONTACTS.primaryPhone.href}
                  className={styles.phoneLink}
                >
                  {CONTACTS.primaryPhone.display}
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}