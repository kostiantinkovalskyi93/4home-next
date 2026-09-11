import Link from "next/link";

import styles from "./not-found.module.css";

export default function LeadNotFound() {
  return (
    <section className={styles.panel}>
      <span className={styles.eyebrow}>
        ЗАЯВКА
      </span>

      <h1>Заявку не знайдено</h1>

      <p>
        Можливо, її вже видалили або посилання більше не актуальне.
      </p>

      <Link href="/admin/leads">
        ← Повернутися до заявок
      </Link>
    </section>
  );
}
