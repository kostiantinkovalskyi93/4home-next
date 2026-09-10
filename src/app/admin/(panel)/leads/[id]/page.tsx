import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { updateLeadStatus } from "../actions";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type LeadStatus = "new" | "in_progress" | "done";
type LeadSource = "contacts" | "portfolio_project";

type LeadRow = {
  id: string;
  submission_id: string;
  name: string;
  phone: string;
  furniture_type: string | null;
  dimensions: string | null;
  comment: string | null;
  lead_source: LeadSource;
  project_id: string | null;
  project_slug: string | null;
  project_title: string | null;
  project_category: string | null;
  source_path: string | null;
  status: LeadStatus;
  telegram_sent_at: string | null;
  created_at: string;
  updated_at: string;
};

type LeadDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const statusLabels: Record<LeadStatus, string> = {
  new: "Нова",
  in_progress: "В роботі",
  done: "Опрацьовано",
};

function formatDateTime(value: string | null) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default async function LeadDetailPage({
  params,
}: LeadDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("leads")
    .select(`
      id,
      submission_id,
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
      created_at,
      updated_at
    `)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to load lead:", error);
  }

  const lead = data as LeadRow | null;

  if (!lead) {
    notFound();
  }

  const phoneHref = `tel:${lead.phone.replace(/\s+/g, "")}`;

  return (
    <section className={styles.panel}>
      <div className={styles.topbar}>
        <Link href="/admin/leads" className={styles.backLink}>
          ← До заявок
        </Link>

        <span className={`${styles.statusBadge} ${styles[`status_${lead.status}`]}`}>
          {statusLabels[lead.status]}
        </span>
      </div>

      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>ЗАЯВКА</span>
          <h1>{lead.name}</h1>
          <p>Отримано {formatDateTime(lead.created_at)}</p>
        </div>

        <a className={styles.callButton} href={phoneHref}>
          Подзвонити
        </a>
      </header>

      <div className={styles.layout}>
        <div className={styles.mainColumn}>
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <span>01</span>
              <h2>Контакт</h2>
            </div>

            <dl className={styles.detailsGrid}>
              <div>
                <dt>Ім’я</dt>
                <dd>{lead.name}</dd>
              </div>
              <div>
                <dt>Телефон</dt>
                <dd>
                  <a href={phoneHref}>{lead.phone}</a>
                </dd>
              </div>
            </dl>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <span>02</span>
              <h2>Запит</h2>
            </div>

            <dl className={styles.detailsGrid}>
              <div>
                <dt>Що потрібно</dt>
                <dd>{lead.furniture_type || "Поки не визначився"}</dd>
              </div>

              <div>
                <dt>Розміри</dt>
                <dd>{lead.dimensions || "Не вказано"}</dd>
              </div>
            </dl>

            <div className={styles.commentBlock}>
              <span>Коментар</span>
              <p>{lead.comment || "Без коментаря"}</p>
            </div>
          </section>

          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <span>03</span>
              <h2>Джерело</h2>
            </div>

            <dl className={styles.detailsGrid}>
              <div>
                <dt>Канал</dt>
                <dd>
                  {lead.lead_source === "portfolio_project"
                    ? "Портфоліо"
                    : "Контакти"}
                </dd>
              </div>

              <div>
                <dt>Сторінка</dt>
                <dd>{lead.source_path || "—"}</dd>
              </div>

              {lead.project_title ? (
                <div className={styles.fullWidth}>
                  <dt>Проєкт</dt>
                  <dd>
                    {lead.project_id ? (
                      <Link href={`/admin/portfolio/${lead.project_id}/edit`}>
                        {lead.project_title}
                      </Link>
                    ) : (
                      lead.project_title
                    )}
                  </dd>
                </div>
              ) : null}

              {lead.project_category ? (
                <div>
                  <dt>Категорія</dt>
                  <dd>{lead.project_category}</dd>
                </div>
              ) : null}
            </dl>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <section className={styles.sideCard}>
            <span className={styles.sideLabel}>СТАТУС</span>

            <form action={updateLeadStatus} className={styles.statusForm}>
              <input type="hidden" name="leadId" value={lead.id} />

              <select
                name="status"
                defaultValue={lead.status}
                aria-label={`Статус заявки від ${lead.name}`}
              >
                <option value="new">{statusLabels.new}</option>
                <option value="in_progress">{statusLabels.in_progress}</option>
                <option value="done">{statusLabels.done}</option>
              </select>

              <button type="submit">Зберегти статус</button>
            </form>
          </section>

          <section className={styles.sideCard}>
            <span className={styles.sideLabel}>ДОСТАВКА</span>

            <div className={styles.deliveryRow}>
              <span>Telegram</span>
              <strong className={lead.telegram_sent_at ? styles.ok : styles.pending}>
                {lead.telegram_sent_at ? "Надіслано" : "Не підтверджено"}
              </strong>
            </div>

            <div className={styles.metaRows}>
              <div>
                <span>Створено</span>
                <strong>{formatDateTime(lead.created_at)}</strong>
              </div>
              <div>
                <span>Оновлено</span>
                <strong>{formatDateTime(lead.updated_at)}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}
