import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/layout/Header";

import styles from "./page.module.css";

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
      </main>
    </>
  );
}