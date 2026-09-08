import type { Metadata } from "next";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { CONTACTS } from "@/data/contacts";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Як відбувається замовлення меблів",
  description:
    "Процес замовлення меблів 4HOME: від першого запиту та заміру до прорахунку, погодження, виготовлення, доставки та монтажу.",
  alternates: {
    canonical: "/process",
  },
};

const processSteps = [
  {
    number: "01",
    label: "START",
    title: "Запит",
    description:
      "Ви надсилаєте фото приміщення, приблизні розміри та коротко описуєте, які меблі потрібні.",
    note: "Фото / розміри / побажання",
  },
  {
    number: "02",
    label: "MEASURE",
    title: "Замір",
    description:
      "Уточнюємо геометрію приміщення, розташування стін, ніш, розеток, комунікацій та інших деталей, які впливають на конструкцію.",
    note: "Простір / геометрія / деталі",
  },
  {
    number: "03",
    label: "ESTIMATE",
    title: "Прорахунок",
    description:
      "Формуємо конструктивне рішення, підбираємо матеріали та фурнітуру й розраховуємо вартість проєкту.",
    note: "Конструкція / матеріали / вартість",
  },
  {
    number: "04",
    label: "APPROVAL",
    title: "Погодження",
    description:
      "Узгоджуємо зовнішній вигляд, наповнення, кольори, матеріали, механізми та ключові технічні деталі.",
    note: "Вигляд / наповнення / деталі",
  },
  {
    number: "05",
    label: "PRODUCTION",
    title: "Виготовлення",
    description:
      "Після погодження меблі виготовляються за затвердженими параметрами та під конкретний простір.",
    note: "За погодженими параметрами",
  },
  {
    number: "06",
    label: "INSTALLATION",
    title: "Доставка та монтаж",
    description:
      "Готові меблі доставляємо на об’єкт, встановлюємо та перевіряємо роботу фасадів, шухляд і механізмів.",
    note: "Доставка / встановлення / перевірка",
  },
];

const approvalItems = [
  {
    number: "01",
    title: "Розміри",
    description:
      "Фіксуємо габарити меблів і прив’язку до конкретного місця встановлення.",
  },
  {
    number: "02",
    title: "Конструкція",
    description:
      "Визначаємо секції, полиці, шухляди, двері та інші функціональні елементи.",
  },
  {
    number: "03",
    title: "Матеріали",
    description:
      "Погоджуємо корпусні матеріали, фасади, стільниці та декоративні елементи.",
  },
  {
    number: "04",
    title: "Фурнітура",
    description:
      "Підбираємо механізми відкривання, напрямні, петлі та інші комплектуючі.",
  },
];

const startItems = [
  "Фото місця, де плануються меблі",
  "Приблизні розміри приміщення або ніші",
  "Приклад того, що подобається",
  "Короткий опис того, що потрібно розмістити або зберігати",
];

export default function ProcessPage() {
  return (
    <main>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={`container ${styles.pageContainer} ${styles.heroInner}`}>
          <div className={styles.heroTop}>
            <p className={styles.eyebrow}>ПРОЦЕС 4HOME</p>

            <div className={styles.heroIndex}>
              <span>04</span>
              <span>/</span>
              <span>PROCESS</span>
            </div>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroTitleWrap}>
              <h1 className={styles.heroTitle}>
                Від першої
                <br />
                ідеї до меблів
                <br />
                <span>у вашому просторі.</span>
              </h1>
            </div>

            <div className={styles.heroSide}>
              <p className={styles.heroText}>
                Послідовний процес без каталогу готових моделей. Спочатку
                розуміємо задачу й простір, потім формуємо конкретне рішення.
              </p>

              <div className={styles.heroActions}>
                <Link
                  href="/contacts#lead-form"
                  className={styles.primaryButton}
                >
                  <span>Обговорити проєкт</span>
                  <span aria-hidden="true">→</span>
                </Link>

                <a href={CONTACTS.phone.href} className={styles.phoneLink}>
                  {CONTACTS.phone.display}
                </a>
              </div>
            </div>
          </div>

          <div className={styles.heroFooter}>
            <span>REQUEST</span>
            <span className={styles.heroLine} />
            <span>MEASURE</span>
            <span className={styles.heroLine} />
            <span>PROJECT</span>
            <span className={styles.heroLine} />
            <span>INSTALL</span>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.intro}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <p className={styles.sectionEyebrow}>ЯК МИ ПРАЦЮЄМО</p>
          </Reveal>

          <div className={styles.introGrid}>
            <Reveal>
              <h2 className={styles.sectionTitle}>
                Кожен етап
                <br />
                <span>має свою задачу.</span>
              </h2>
            </Reveal>

            <Reveal delay={70}>
              <div className={styles.introContent}>
                <p>
                  Меблі на замовлення починаються не з вибору готової моделі, а
                  з розуміння конкретного приміщення та потреб.
                </p>

                <p>
                  Тому процес побудований так, щоб основні рішення були
                  визначені й погоджені ще до виготовлення.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className={styles.timeline}>
        <div className={`container ${styles.pageContainer}`}>
          <div className={styles.timelineHeader}>
            <Reveal>
              <p className={styles.sectionEyebrow}>01—06 / PROCESS</p>
            </Reveal>

            <Reveal delay={60}>
              <p className={styles.timelineLead}>
                Від першого повідомлення до встановлення готових меблів.
              </p>
            </Reveal>
          </div>

          <div className={styles.timelineList}>
            {processSteps.map((step, index) => (
              <Reveal key={step.number} delay={index * 45}>
                <article className={styles.timelineItem}>
                  <div className={styles.timelineNumber}>
                    <span>{step.number}</span>
                    <span>{step.label}</span>
                  </div>

                  <div className={styles.timelineTitleWrap}>
                    <span className={styles.timelineDot} aria-hidden="true" />
                    <h2>{step.title}</h2>
                  </div>

                  <p className={styles.timelineDescription}>
                    {step.description}
                  </p>

                  <span className={styles.timelineNote}>{step.note}</span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* APPROVAL */}
      <section className={styles.approval}>
        <div className={`container ${styles.pageContainer}`}>
          <div className={styles.approvalHeader}>
            <Reveal>
              <div>
                <p className={styles.darkEyebrow}>ДО ВИГОТОВЛЕННЯ</p>

                <h2 className={styles.darkTitle}>
                  Спочатку
                  <br />
                  <span>погоджуємо головне.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <p className={styles.approvalLead}>
                Чим точніше визначені параметри проєкту до початку
                виготовлення, тим передбачуванішим буде результат після
                монтажу.
              </p>
            </Reveal>
          </div>

          <div className={styles.approvalGrid}>
            {approvalItems.map((item, index) => (
              <Reveal key={item.number} delay={index * 45}>
                <article className={styles.approvalItem}>
                  <div className={styles.approvalMeta}>
                    <span>{item.number}</span>
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.description}</p>

                  <span className={styles.approvalMark} aria-hidden="true">
                    +
                  </span>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* START */}
      <section className={styles.start}>
        <div className={`container ${styles.pageContainer}`}>
          <div className={styles.startGrid}>
            <Reveal>
              <div className={styles.startHeading}>
                <p className={styles.sectionEyebrow}>ПЕРШИЙ КРОК</p>

                <h2 className={styles.sectionTitle}>
                  Що потрібно
                  <br />
                  <span>для початку.</span>
                </h2>
              </div>
            </Reveal>

            <Reveal delay={70}>
              <div className={styles.startContent}>
                <p className={styles.startLead}>
                  Для першого обговорення не потрібен готовий кресленик.
                  Достатньо базової інформації про простір і вашу задачу.
                </p>

                <div className={styles.startList}>
                  {startItems.map((item, index) => (
                    <div key={item} className={styles.startItem}>
                      <span>
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <p>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FINAL STATEMENT */}
      <section className={styles.statement}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <p className={styles.statementIndex}>4HOME / PROCESS</p>
          </Reveal>

          <Reveal delay={60}>
            <p className={styles.statementText}>
              Хороший результат —
              <br />
              це не випадковість.
              <br />
              <span>Це послідовність рішень.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={`container ${styles.pageContainer}`}>
          <Reveal>
            <p className={styles.darkEyebrow}>ПОЧНЕМО З ПЕРШОГО КРОКУ</p>
          </Reveal>

          <div className={styles.ctaGrid}>
            <Reveal>
              <h2 className={styles.ctaTitle}>
                Розкажіть,
                <br />
                що потрібно
                <br />
                <span>зробити.</span>
              </h2>
            </Reveal>

            <Reveal delay={70}>
              <div className={styles.ctaContent}>
                <p>
                  Надішліть фото, приблизні розміри та коротко опишіть задачу.
                  Цього достатньо, щоб почати обговорення.
                </p>

                <div className={styles.ctaActions}>
                  <Link
                    href="/contacts#lead-form"
                    className={styles.ctaButton}
                  >
                    <span>Надіслати запит</span>
                    <span aria-hidden="true">→</span>
                  </Link>

                  <a href={CONTACTS.phone.href} className={styles.ctaPhone}>
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