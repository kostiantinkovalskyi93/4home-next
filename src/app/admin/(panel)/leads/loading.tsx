import styles from "./loading.module.css";

const ROWS = [0, 1, 2, 3, 4];

export default function LeadsLoading() {
  return (
    <section
      className={styles.panel}
      aria-busy="true"
      aria-label="Завантаження заявок"
    >
      <header className={styles.header}>
        <div>
          <div className={styles.eyebrow} />
          <div className={styles.title} />
          <div className={styles.subtitle} />
        </div>
        <div className={styles.meta} />
      </header>

      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <span /><span /><span /><span />
        </div>
        <div className={styles.search} />
      </div>

      <div className={styles.table}>
        <div className={styles.tableHead} />
        {ROWS.map((row) => (
          <div className={styles.row} key={row}>
            <span /><span /><span /><span /><span /><span />
          </div>
        ))}
      </div>

      <div className={styles.cards}>
        {ROWS.slice(0, 3).map((row) => (
          <div className={styles.card} key={row}>
            <div className={styles.cardTop} />
            <div className={styles.cardLine} />
            <div className={styles.cardLineShort} />
            <div className={styles.cardActions} />
          </div>
        ))}
      </div>
    </section>
  );
}
