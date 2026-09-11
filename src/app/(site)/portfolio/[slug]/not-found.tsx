import Link from "next/link";

import styles from "./not-found.module.css";

export default function PortfolioProjectNotFound() {
  return (
    <main className={styles.page}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>
          ПОРТФОЛІО 4HOME
        </p>

        <h1>Проєкт не знайдено</h1>

        <p>
          Можливо, роботу ще не опубліковано,
          її адресу змінено або проєкт більше
          недоступний.
        </p>

        <Link href="/portfolio">
          ← До всіх робіт
        </Link>
      </section>
    </main>
  );
}
