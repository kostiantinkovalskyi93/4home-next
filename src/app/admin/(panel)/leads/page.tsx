import styles from "./page.module.css";

const leads = [
  { name: "Андрій", phone: "+380 97 123 45 67", message: "Цікавить вартість кухні під ключ у ЖК Варшавський", date: "05.09.2026 12:34", status: "Нова" },
  { name: "Олена", phone: "+380 93 555 12 34", message: "Потрібна консультація по шафі-купе", date: "03.09.2026 10:21", status: "В роботі" },
  { name: "Марія", phone: "+380 90 987 65 43", message: "Доброго дня! Цікавлять дитячі меблі.", date: "29.08.2026 16:47", status: "Опрацьовано" },
];

export default function AdminLeadsPage() {
  return (
    <section className={styles.panel}>
      <header><div><span>ЗВОРОТНИЙ ЗВ’ЯЗОК</span><h1>Заявки</h1><p>Заявки, що надходять із форми на сайті.</p></div></header>
      <div className={styles.tableWrap}>
        <table>
          <thead><tr><th>Ім’я</th><th>Телефон</th><th>Повідомлення</th><th>Дата</th><th>Статус</th></tr></thead>
          <tbody>{leads.map((lead) => <tr key={`${lead.phone}-${lead.date}`}><td><strong>{lead.name}</strong></td><td>{lead.phone}</td><td>{lead.message}</td><td>{lead.date}</td><td><span className={lead.status === "Нова" ? styles.new : lead.status === "В роботі" ? styles.work : styles.done}>{lead.status}</span></td></tr>)}</tbody>
        </table>
      </div>
      <p className={styles.note}>Поки це візуальний екран. На етапі інтеграції підключимо його до реальних заявок без зміни існуючого Telegram lead-flow.</p>
    </section>
  );
}
