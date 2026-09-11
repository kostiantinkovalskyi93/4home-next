import styles from "./loading.module.css";

export default function ProfileLoading() {
  return (
    <section
      className={styles.panel}
      aria-busy="true"
      aria-label="Завантаження профілю"
    >
      <div className={styles.eyebrow} />
      <div className={styles.title} />
      <div className={styles.subtitle} />

      <div className={styles.divider} />

      <div className={styles.grid}>
        <div className={styles.field} />
        <div className={styles.field} />
        <div className={styles.field} />
        <div className={styles.field} />
      </div>

      <div className={styles.note} />
      <div className={styles.action} />
    </section>
  );
}
