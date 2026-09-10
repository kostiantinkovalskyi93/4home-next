import Link from "next/link";

import { createClient } from "@/lib/supabase/server";

import { updateLeadStatus } from "./actions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type LeadRow = {
  id: string;
  name: string;
  phone: string;
  furniture_type: string | null;
  dimensions: string | null;
  comment: string | null;
  lead_source: "contacts" | "portfolio_project";
  project_id: string | null;
  project_slug: string | null;
  project_title: string | null;
  project_category: string | null;
  source_path: string | null;
  status: "new" | "in_progress" | "done";
  telegram_sent_at: string | null;
  created_at: string;
};

const statusLabels: Record<LeadRow["status"], string> = {
  new: "Нова",
  in_progress: "В роботі",
  done: "Опрацьовано",
};

function formatCreatedAt(value: string) {
  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function AdminLeadsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .select(`
      id,
      name,
      phone,
      furniture_type,
      dimensions,
      comment,
      lead_source,
      project_id,
      project_slug,
      project_title,
      project_category,
      source_path,
      status,
      telegram_sent_at,
      created_at
    `)
    .order("created_at", { ascending: false })
    .limit(250);

  if (error) {
    console.error("Failed to load leads:", error);
  }

  const leads = (data ?? []) as LeadRow[];

  return (
    <section className={styles.panel}>
      <header>
        <div>
          <span>ЗВОРОТНИЙ ЗВ’ЯЗОК</span>
          <h1>Заявки</h1>
          <p>Реальні заявки з форми 4HOME та їхній поточний статус.</p>
        </div>
        <div className={styles.headerMeta}>
          <strong>{leads.length}</strong>
          <span>останніх заявок</span>
        </div>
      </header>

      {error ? (
        <div className={styles.stateCard} role="alert">
          <strong>Не вдалося завантажити заявки.</strong>
          <p>Перевірте таблицю leads та RLS-політики в Supabase.</p>
        </div>
      ) : leads.length === 0 ? (
        <div className={styles.stateCard}>
          <strong>Поки немає заявок.</strong>
          <p>Після підключення запису в Cloudflare Worker нові звернення з’являтимуться тут автоматично.</p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Клієнт</th>
                <th>Запит</th>
                <th>Джерело</th>
                <th>Дата</th>
                <th>Telegram</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <strong className={styles.clientName}>{lead.name}</strong>
                    <a className={styles.phone} href={`tel:${lead.phone.replace(/\s+/g, "")}`}>
                      {lead.phone}
                    </a>
                  </td>
                  <td>
                    {lead.furniture_type ? (
                      <strong className={styles.requestType}>{lead.furniture_type}</strong>
                    ) : null}
                    {lead.dimensions ? (
                      <span className={styles.dimensions}>{lead.dimensions}</span>
                    ) : null}
                    {lead.comment ? (
                      <p className={styles.message}>{lead.comment}</p>
                    ) : (
                      <p className={styles.messageMuted}>Без коментаря</p>
                    )}
                  </td>
                  <td>
                    {lead.lead_source === "portfolio_project" ? (
                      <div className={styles.sourceBlock}>
                        <span className={styles.sourceBadge}>Портфоліо</span>
                        {lead.project_id && lead.project_title ? (
                          <Link href={`/admin/portfolio/${lead.project_id}/edit`} className={styles.projectLink}>
                            {lead.project_title}
                          </Link>
                        ) : lead.project_title ? (
                          <span className={styles.projectTitle}>{lead.project_title}</span>
                        ) : null}
                        {lead.project_category ? (
                          <span className={styles.sourceMeta}>{lead.project_category}</span>
                        ) : null}
                      </div>
                    ) : (
                      <span className={styles.sourceBadge}>Контакти</span>
                    )}
                  </td>
                  <td className={styles.date}>{formatCreatedAt(lead.created_at)}</td>
                  <td>
                    <span className={lead.telegram_sent_at ? styles.telegramOk : styles.telegramPending}>
                      {lead.telegram_sent_at ? "Надіслано" : "Немає підтвердження"}
                    </span>
                  </td>
                  <td>
                    <form action={updateLeadStatus} className={styles.statusForm}>
                      <input type="hidden" name="leadId" value={lead.id} />
                      <select name="status" defaultValue={lead.status} aria-label={`Статус заявки від ${lead.name}`}>
                        <option value="new">{statusLabels.new}</option>
                        <option value="in_progress">{statusLabels.in_progress}</option>
                        <option value="done">{statusLabels.done}</option>
                      </select>
                      <button type="submit">Зберегти</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className={styles.note}>
        Supabase зберігає історію заявок; Telegram залишається оперативним каналом сповіщення.
      </p>
    </section>
  );
}
