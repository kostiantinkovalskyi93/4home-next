import styles from "./page.module.css";

export default function AdminProfilePage() {
  return (
    <section className={styles.panel}>
      <span className={styles.eyebrow}>АДМІНІСТРАТОР</span>
      <h1>Профіль</h1>
      <div className={styles.grid}>
        <label><span>Ім’я</span><input defaultValue="Костянтин" /></label>
        <label><span>Email</span><input defaultValue="you@4home.kyiv.ua" type="email" /></label>
        <label><span>Новий пароль</span><input type="password" placeholder="Залиште порожнім, щоб не змінювати" /></label>
        <label><span>Підтвердити пароль</span><input type="password" /></label>
      </div>
      <button type="button">Зберегти зміни</button>
    </section>
  );
}
