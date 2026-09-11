"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./error.module.css";

type LeadsErrorProps = {
  reset: () => void;
};

export default function LeadsError({
  reset,
}: LeadsErrorProps) {
  const router = useRouter();

  const handleRetry = () => {
    reset();
    router.refresh();
  };

  return (
    <section
      className={styles.panel}
      role="alert"
      aria-live="assertive"
    >
      <span className={styles.eyebrow}>
        ЗВОРОТНИЙ ЗВ’ЯЗОК
      </span>

      <h1>Не вдалося завантажити дані</h1>

      <p>
        Заявки тимчасово недоступні. Спробуйте повторити запит або поверніться до списку пізніше.
      </p>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleRetry}
        >
          Спробувати ще раз
        </button>

        <Link href="/admin/leads">
          До заявок
        </Link>
      </div>
    </section>
  );
}
