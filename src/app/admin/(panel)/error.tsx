"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import styles from "./error.module.css";

type AdminPanelErrorProps = {
  reset: () => void;
};

export default function AdminPanelError({
  reset,
}: AdminPanelErrorProps) {
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
        PORTFOLIO MANAGER
      </span>

      <h1>Не вдалося завантажити сторінку</h1>

      <p>
        Дані CMS тимчасово недоступні. Спробуйте
        повторити запит. Ваші збережені дані при
        цьому не видаляються.
      </p>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={handleRetry}
        >
          Спробувати ще раз
        </button>

        <Link href="/admin/portfolio">
          До портфоліо
        </Link>
      </div>
    </section>
  );
}
