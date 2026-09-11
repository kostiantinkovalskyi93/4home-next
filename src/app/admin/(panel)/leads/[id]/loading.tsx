import styles from "./loading.module.css";

export default function LeadDetailLoading() {
  return (
    <section
      className={styles.panel}
      aria-busy="true"
      aria-label="Завантаження заявки"
    >
      <div className={styles.topbar}>
        <div className={styles.back} />
        <div className={styles.badge} />
      </div>

      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow} />
          <div className={styles.title} />
          <div className={styles.subtitle} />
        </div>

        <div className={styles.call} />
      </header>

      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={styles.card} />
          <div className={styles.cardTall} />
          <div className={styles.card} />
        </div>

        <div className={styles.sidebar}>
          <div className={styles.sideCard} />
          <div className={styles.sideCardTall} />
        </div>
      </div>
    </section>
  );
}
