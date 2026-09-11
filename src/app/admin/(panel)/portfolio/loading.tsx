import styles from "./loading.module.css";

const SKELETON_CARDS = [0, 1, 2, 3];

export default function PortfolioLoading() {
  return (
    <div
      className={styles.page}
      aria-busy="true"
      aria-label="Завантаження портфоліо"
    >
      <div className={styles.topbar}>
        <div className={styles.searchSkeleton} />
        <div className={styles.profileSkeleton} />
      </div>

      <section className={styles.panel}>
        <div className={styles.headingRow}>
          <div>
            <div className={styles.titleSkeleton} />
            <div className={styles.subtitleSkeleton} />
          </div>

          <div className={styles.buttonSkeleton} />
        </div>

        <div className={styles.controls}>
          <div className={styles.tabsSkeleton}>
            <span />
            <span />
            <span />
            <span />
          </div>

          <div className={styles.selectSkeleton} />
        </div>

        <div className={styles.grid}>
          {SKELETON_CARDS.map((item) => (
            <div
              className={styles.card}
              key={item}
            >
              <div className={styles.imageSkeleton} />

              <div className={styles.cardBody}>
                <div className={styles.cardTitleSkeleton} />
                <div className={styles.cardMetaSkeleton} />
                <div className={styles.cardCountsSkeleton} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
