"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./error.module.css";

type PortfolioErrorProps = {
  reset: () => void;
};

export default function PortfolioError({
  reset,
}: PortfolioErrorProps) {
  const router = useRouter();

  const handleRetry = () => {
    reset();
    router.refresh();
  };

  return (
    <main className={styles.page}>
      <section
        className={styles.panel}
        role="alert"
        aria-live="assertive"
      >
        <p className={styles.eyebrow}>
          ПОРТФОЛІО 4HOME
        </p>

        <h1>Не вдалося завантажити роботи</h1>

        <p className={styles.copy}>
          Дані тимчасово недоступні. Спробуйте
          оновити сторінку або поверніться трохи
          пізніше.
        </p>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleRetry}
          >
            Спробувати ще раз
          </button>

          <Link href="/">
            На головну
          </Link>
        </div>
      </section>
    </main>
  );
}
