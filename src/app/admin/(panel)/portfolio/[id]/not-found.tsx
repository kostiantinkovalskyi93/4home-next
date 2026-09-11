import Link from "next/link";

import styles from "./not-found.module.css";

export default function PortfolioProjectNotFound() {
  return (
    <section className={styles.panel}>
      <span className={styles.eyebrow}>
        ПОРТФОЛІО
      </span>

      <h1>Проєкт не знайдено</h1>

      <p>
        Можливо, проєкт уже видалили або це
        посилання більше не актуальне.
      </p>

      <Link href="/admin/portfolio">
        ← Повернутися до портфоліо
      </Link>
    </section>
  );
}
