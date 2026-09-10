import Link from "next/link";

import { SearchIcon } from "@/app/admin/components/AdminIcons";
import { createClient } from "@/lib/supabase/server";

import { LeadActionsMenu, LeadStatusMenu } from "./LeadRowControls";

import styles from "./page.module.css";

export const dynamic = "force-dynamic";

type LeadStatus = "new" | "in_progress" | "done";
type LeadSource = "contacts" | "portfolio_project";

type LeadRow = {
  id: string;
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
};

type AdminLeadsPageProps = {
  searchParams: Promise<{
    status?: string;
    q?: string;
  }>;
};

const statusLabels: Record<LeadStatus, string> = {
  new: "Нова",
  in_progress: "В роботі",
  done: "Опрацьовано",
};

const statusFilters: Array<{
  value: "all" | LeadStatus;
  label: string;
}> = [
  { value: "all", label: "Усі" },
  { value: "new", label: "Нові" },
  { value: "in_progress", label: "В роботі" },
  { value: "done", label: "Опрацьовані" },
];

function normalizeStatus(value?: string): "all" | LeadStatus {
  if (value === "new" || value === "in_progress" || value === "done") {
    return value;
  }

  return "all";
}

function normalizeSearch(value?: string) {
  return String(value ?? "").trim().slice(0, 120);
}

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

function matchesSearch(lead: LeadRow, query: string) {
  if (!query) {
    return true;
  }

  const haystack = [
    lead.name,
    lead.phone,
    lead.furniture_type,
    lead.dimensions,
    lead.comment,
    lead.project_title,
    lead.project_category,
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("uk-UA");

  return haystack.includes(query.toLocaleLowerCase("uk-UA"));
}

function buildFilterHref({
  status,
  query,
}: {
  status: "all" | LeadStatus;
  query: string;
}) {
  const params = new URLSearchParams();

  if (status !== "all") {
    params.set("status", status);
  }

  if (query) {
    params.set("q", query);
  }

  const search = params.toString();

  return search ? `/admin/leads?${search}` : "/admin/leads";
}

export default async function AdminLeadsPage({
  searchParams,
}: AdminLeadsPageProps) {
  const params = await searchParams;
  const activeStatus = normalizeStatus(params.status);
  const query = normalizeSearch(params.q);

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
  const visibleLeads = leads.filter((lead) => {
    const statusMatches =
      activeStatus === "all" || lead.status === activeStatus;

    return statusMatches && matchesSearch(lead, query);
  });

  const counts = {
    all: leads.length,
    new: leads.filter((lead) => lead.status === "new").length,
    in_progress: leads.filter((lead) => lead.status === "in_progress").length,
    done: leads.filter((lead) => lead.status === "done").length,
  };

  return (
    <section className={styles.panel}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>ЗВОРОТНИЙ ЗВ’ЯЗОК</span>
          <h1>Заявки</h1>
          <p>Реальні звернення з форм 4HOME та їхній поточний статус.</p>
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
      ) : (
        <>
          <div className={styles.toolbar}>
            <nav className={styles.filters} aria-label="Фільтр заявок за статусом">
              {statusFilters.map((filter) => {
                const active = filter.value === activeStatus;
                const count = counts[filter.value];

                return (
                  <Link
                    key={filter.value}
                    href={buildFilterHref({
                      status: filter.value,
                      query,
                    })}
                    className={`${styles.filterChip} ${
                      active ? styles.filterChipActive : ""
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <span>{filter.label}</span>
                    <strong>{count}</strong>
                  </Link>
                );
              })}
            </nav>

            <form className={styles.searchForm} action="/admin/leads" method="get">
              {activeStatus !== "all" ? (
                <input type="hidden" name="status" value={activeStatus} />
              ) : null}

              <label className={styles.searchField}>
                <span className={styles.srOnly}>Пошук заявок</span>
                <SearchIcon />
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Ім’я, телефон, запит..."
                  autoComplete="off"
                />
              </label>

              <button type="submit">Знайти</button>

              {query ? (
                <Link
                  className={styles.clearSearch}
                  href={buildFilterHref({
                    status: activeStatus,
                    query: "",
                  })}
                >
                  Очистити
                </Link>
              ) : null}
            </form>
          </div>

          {leads.length === 0 ? (
            <div className={styles.stateCard}>
              <strong>Поки немає заявок.</strong>
              <p>Нові звернення з форми з’являтимуться тут автоматично.</p>
            </div>
          ) : visibleLeads.length === 0 ? (
            <div className={styles.stateCard}>
              <strong>Нічого не знайдено.</strong>
              <p>Змініть фільтр або пошуковий запит.</p>
            </div>
          ) : (
            <>
              <div className={styles.resultMeta}>
                <span>
                  Показано <strong>{visibleLeads.length}</strong> із{" "}
                  <strong>{leads.length}</strong>
                </span>
              </div>

              <div className={styles.desktopTableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>Ім’я</th>
                      <th>Телефон</th>
                      <th>Повідомлення</th>
                      <th>Дата</th>
                      <th>Статус</th>
                      <th>Дії</th>
                    </tr>
                  </thead>

                  <tbody>
                    {visibleLeads.map((lead) => (
                      <tr key={lead.id}>
                        <td>
                          <strong className={styles.clientName}>{lead.name}</strong>
                        </td>

                        <td>
                          <a
                            className={styles.phone}
                            href={`tel:${lead.phone.replace(/\s+/g, "")}`}
                          >
                            {lead.phone}
                          </a>
                        </td>

                        <td>
                          <div className={styles.messageCell}>
                            {lead.furniture_type ? (
                              <strong className={styles.requestType}>
                                {lead.furniture_type}
                              </strong>
                            ) : null}

                            {lead.comment ? (
                              <p className={styles.message}>{lead.comment}</p>
                            ) : (
                              <p className={styles.messageMuted}>Без коментаря</p>
                            )}
                          </div>
                        </td>

                        <td className={styles.date}>
                          {formatCreatedAt(lead.created_at)}
                        </td>

                        <td>
                          <LeadStatusMenu
                            leadId={lead.id}
                            leadName={lead.name}
                            status={lead.status}
                          />
                        </td>

                        <td className={styles.actionsCell}>
                          <div className={styles.actionsGroup}>
                            <LeadActionsMenu
                              leadId={lead.id}
                              name={lead.name}
                              phone={lead.phone}
                              furnitureType={lead.furniture_type}
                              dimensions={lead.dimensions}
                              comment={lead.comment}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.mobileList}>
                {visibleLeads.map((lead) => (
                  <article className={styles.leadCard} key={lead.id}>
                    <div className={styles.leadCardTop}>
                      <div>
                        <strong className={styles.clientName}>{lead.name}</strong>
                        <a
                          className={styles.phone}
                          href={`tel:${lead.phone.replace(/\s+/g, "")}`}
                        >
                          {lead.phone}
                        </a>
                      </div>

                      <span className={`${styles.statusBadge} ${styles[`status_${lead.status}`]}`}>
                        {statusLabels[lead.status]}
                      </span>
                    </div>

                    <div className={styles.leadCardBody}>
                      <div>
                        <span className={styles.cardLabel}>Запит</span>
                        <strong className={styles.requestType}>
                          {lead.furniture_type || "Поки не визначився"}
                        </strong>
                        {lead.comment ? (
                          <p className={styles.message}>{lead.comment}</p>
                        ) : null}
                      </div>

                      <div className={styles.cardMetaRow}>
                        <span className={styles.sourceBadge}>
                          {lead.lead_source === "portfolio_project"
                            ? "Портфоліо"
                            : "Контакти"}
                        </span>
                        <span>{formatCreatedAt(lead.created_at)}</span>
                      </div>
                    </div>

                    <div className={styles.leadCardActions}>
                      <a href={`tel:${lead.phone.replace(/\s+/g, "")}`}>
                        Подзвонити
                      </a>
                      <Link href={`/admin/leads/${lead.id}`}>Відкрити заявку</Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <p className={styles.note}>
        Supabase зберігає історію заявок; Telegram залишається оперативним каналом сповіщення.
      </p>
    </section>
  );
}
