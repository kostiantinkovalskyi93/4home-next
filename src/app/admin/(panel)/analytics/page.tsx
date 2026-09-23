"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import styles from "./page.module.css";

type Period = "today" | "7d" | "30d";

type MetricRow = {
  visitors: number;
  pageviews: number;
};

type TimelineRow = MetricRow & {
  timestamp: string;
};

type PageRow = MetricRow & {
  requestPath: string;
};

type ReferrerRow = MetricRow & {
  referrerHostname: string;
};

type CountryRow = MetricRow & {
  country: string;
};

type DeviceRow = MetricRow & {
  deviceType: string;
};

type BrowserRow = MetricRow & {
  browserName: string;
};

type OsRow = MetricRow & {
  osName: string;
};

type Aggregate<T> = {
  data?: T[];
};

type AnalyticsResponse = {
  ok: true;
  period: Period;
  updatedAt: string;
  analytics: {
    totals: {
      data?: MetricRow;
    };
    timeline: Aggregate<TimelineRow>;
    pages: Aggregate<PageRow>;
    referrers: Aggregate<ReferrerRow>;
    countries: Aggregate<CountryRow>;
    devices: Aggregate<DeviceRow>;
    browsers: Aggregate<BrowserRow>;
    operatingSystems: Aggregate<OsRow>;
    leads: {
      total: number;
      new: number;
      inProgress: number;
      done: number;
    };
    conversion: number;
    projectTitles: Record<string, string>;
  };
};

const periods: Array<{ value: Period; label: string }> = [
  { value: "today", label: "Сьогодні" },
  { value: "7d", label: "7 днів" },
  { value: "30d", label: "30 днів" },
];

const countryNames: Record<string, string> = {
  UA: "Україна",
  PL: "Польща",
  DE: "Німеччина",
  FR: "Франція",
  NL: "Нідерланди",
  CA: "Канада",
  US: "США",
  GB: "Велика Британія",
};

const deviceNames: Record<string, string> = {
  desktop: "Комп’ютер",
  mobile: "Смартфон",
  tablet: "Планшет",
};

function formatUpdatedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "щойно";
  }

  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("uk-UA").format(value);
}

function formatChartDate(value: string, period: Period) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  if (period === "today") {
    return "Сьогодні";
  }

  return new Intl.DateTimeFormat("uk-UA", {
    timeZone: "Europe/Kyiv",
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

function pageLabel(path: string) {
  if (path === "/") return "Головна";
  if (path === "/portfolio") return "Портфоліо";
  if (path === "/contacts") return "Контакти";
  if (path === "/about") return "Про нас";
  if (path === "/kitchens") return "Кухні";
  if (path === "/wardrobes") return "Шафи";
  if (path === "/furniture") return "Інші меблі";
  if (path === "/materials") return "Матеріали";
  if (path === "/process") return "Процес";
  return path;
}

function projectLabel(
  path: string,
  projectTitles: Record<string, string>,
) {
  const slug = path.replace(/^\/portfolio\//, "");
  const projectTitle = projectTitles[slug];

  if (projectTitle) {
    return projectTitle;
  }

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildPoints(values: number[], width: number, height: number, max: number) {
  if (values.length === 0) return "";

  if (values.length === 1) {
    const y = height - (values[0] / max) * height;
    return `0,${y} ${width},${y}`;
  }

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * width;
      const y = height - (value / max) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

function TrafficChart({ rows, period }: { rows: TimelineRow[]; period: Period }) {
  const width = 760;
  const height = 210;
  const max = Math.max(1, ...rows.flatMap((row) => [row.visitors, row.pageviews]));
  const visitorPoints = buildPoints(rows.map((row) => row.visitors), width, height, max);
  const pageviewPoints = buildPoints(rows.map((row) => row.pageviews), width, height, max);
  const labels = rows.length <= 8 ? rows : rows.filter((_, index) => index % Math.ceil(rows.length / 6) === 0 || index === rows.length - 1);

  if (rows.length === 0) {
    return <div className={styles.emptyState}>За цей період ще немає даних відвідуваності.</div>;
  }

  return (
    <div className={styles.chartWrap}>
      <div className={styles.chartLegend}>
        <span><i className={styles.legendVisitors} />Відвідувачі</span>
        <span><i className={styles.legendViews} />Перегляди</span>
      </div>
      <div className={styles.chartCanvas}>
        <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Графік відвідувачів та переглядів">
          <line x1="0" y1="0" x2={width} y2="0" className={styles.gridLine} />
          <line x1="0" y1={height / 2} x2={width} y2={height / 2} className={styles.gridLine} />
          <line x1="0" y1={height} x2={width} y2={height} className={styles.gridLine} />
          <polyline points={pageviewPoints} className={styles.viewsLine} />
          <polyline points={visitorPoints} className={styles.visitorsLine} />
          {rows.map((row, index) => {
            const x = rows.length === 1
              ? width / 2
              : (index / (rows.length - 1)) * width;
            const visitorY = height - (row.visitors / max) * height;
            const pageviewY = height - (row.pageviews / max) * height;

            return (
              <g key={row.timestamp}>
                <circle cx={x} cy={pageviewY} r="3.5" className={styles.viewsPoint}>
                  <title>{`${formatChartDate(row.timestamp, period)}: ${row.pageviews} переглядів`}</title>
                </circle>
                <circle cx={x} cy={visitorY} r="3.5" className={styles.visitorsPoint}>
                  <title>{`${formatChartDate(row.timestamp, period)}: ${row.visitors} відвідувачів`}</title>
                </circle>
              </g>
            );
          })}
        </svg>
      </div>
      <div className={styles.chartLabels}>
        {labels.map((row) => (
          <span key={row.timestamp}>{formatChartDate(row.timestamp, period)}</span>
        ))}
      </div>
    </div>
  );
}

function RankingList({
  rows,
  label,
}: {
  rows: Array<{ key: string; title: string; visitors: number; pageviews: number }>;
  label: string;
}) {
  if (rows.length === 0) {
    return <div className={styles.emptyState}>{label}</div>;
  }

  const max = Math.max(1, ...rows.map((row) => row.pageviews));

  return (
    <div className={styles.rankingList}>
      {rows.map((row, index) => (
        <div className={styles.rankingRow} key={row.key}>
          <span className={styles.rank}>{index + 1}</span>
          <div className={styles.rankingMain}>
            <div className={styles.rankingTitleRow}>
              <strong title={row.title}>{row.title}</strong>
              <span>{formatNumber(row.pageviews)} перегл.</span>
            </div>
            <div className={styles.barTrack} aria-hidden="true">
              <span style={{ width: `${Math.max(4, (row.pageviews / max) * 100)}%` }} />
            </div>
            <small>{formatNumber(row.visitors)} відвідувачів</small>
          </div>
        </div>
      ))}
    </div>
  );
}

function BreakdownList({ rows, empty }: { rows: Array<{ key: string; label: string; visitors: number; pageviews: number }>; empty: string }) {
  if (rows.length === 0) {
    return <div className={styles.emptyState}>{empty}</div>;
  }

  const total = Math.max(1, rows.reduce((sum, row) => sum + row.visitors, 0));

  return (
    <div className={styles.breakdownList}>
      {rows.map((row) => {
        const share = Math.round((row.visitors / total) * 100);
        return (
          <div className={styles.breakdownRow} key={row.key}>
            <div>
              <strong>{row.label}</strong>
              <span>{formatNumber(row.visitors)} відвідувачів</span>
            </div>
            <div className={styles.breakdownValue}>
              <strong>{share}%</strong>
              <span>{formatNumber(row.pageviews)} перегл.</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7d");
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const loadAnalytics = useCallback(async (selectedPeriod: Period, background = false) => {
    const requestId = ++requestIdRef.current;

    if (background) setRefreshing(true);
    else setLoading(true);

    setError(null);

    try {
      const response = await fetch(`/admin/api/analytics?period=${selectedPeriod}`, { cache: "no-store" });
      const payload: unknown = await response.json().catch(() => null);

      if (!response.ok) {
        const message = payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string"
          ? payload.error
          : "Не вдалося завантажити аналітику.";
        throw new Error(message);
      }

      if (requestId === requestIdRef.current) {
        setData(payload as AnalyticsResponse);
      }
    } catch (loadError) {
      if (requestId === requestIdRef.current) {
        setError(loadError instanceof Error ? loadError.message : "Не вдалося завантажити аналітику.");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  useEffect(() => {
    const initialLoadId = window.setTimeout(() => void loadAnalytics(period), 0);
    const intervalId = window.setInterval(() => void loadAnalytics(period, true), 60_000);

    return () => {
      window.clearTimeout(initialLoadId);
      window.clearInterval(intervalId);
    };
  }, [loadAnalytics, period]);

  const currentData = data?.period === period ? data : null;
  const analytics = currentData?.analytics;
  const totals = analytics?.totals.data;
  const visitors = totals?.visitors ?? 0;
  const pageviews = totals?.pageviews ?? 0;
  const leads = analytics?.leads.total ?? 0;
  const conversion = analytics?.conversion ?? 0;

  const pages = useMemo(() => (analytics?.pages.data ?? [])
    .filter((row) => !row.requestPath.startsWith("/admin"))
    .map((row) => ({
      key: row.requestPath,
      title: pageLabel(row.requestPath),
      visitors: row.visitors,
      pageviews: row.pageviews,
    })), [analytics]);

  const projects = useMemo(() => (analytics?.pages.data ?? [])
    .filter((row) => row.requestPath.startsWith("/portfolio/"))
    .map((row) => ({
      key: row.requestPath,
      title: projectLabel(row.requestPath, analytics?.projectTitles ?? {}),
      visitors: row.visitors,
      pageviews: row.pageviews,
    })), [analytics]);

  const referrers = useMemo(() => (analytics?.referrers.data ?? []).map((row) => ({
    key: row.referrerHostname || "direct",
    label: row.referrerHostname || "Прямий перехід",
    visitors: row.visitors,
    pageviews: row.pageviews,
  })), [analytics]);

  const countries = useMemo(() => (analytics?.countries.data ?? []).map((row) => ({
    key: row.country || "unknown",
    label: countryNames[row.country] ?? row.country ?? "Невідомо",
    visitors: row.visitors,
    pageviews: row.pageviews,
  })), [analytics]);

  const devices = useMemo(() => (analytics?.devices.data ?? []).map((row) => ({
    key: row.deviceType || "unknown",
    label: deviceNames[row.deviceType] ?? row.deviceType ?? "Невідомо",
    visitors: row.visitors,
    pageviews: row.pageviews,
  })), [analytics]);

  const browsers = useMemo(() => (analytics?.browsers.data ?? []).map((row) => ({
    key: row.browserName || "unknown",
    label: row.browserName || "Невідомо",
    visitors: row.visitors,
    pageviews: row.pageviews,
  })), [analytics]);

  const operatingSystems = useMemo(() => (analytics?.operatingSystems.data ?? []).map((row) => ({
    key: row.osName || "unknown",
    label: row.osName || "Невідомо",
    visitors: row.visitors,
    pageviews: row.pageviews,
  })), [analytics]);

  return (
    <section className={styles.panel}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>СТАТИСТИКА 4HOME</span>
          <h1>Аналітика</h1>
          <p>Відвідуваність сайту та заявки в одному місці.</p>
        </div>
        <div className={styles.headerActions}>
          <div className={styles.periods} aria-label="Період аналітики">
            {periods.map((item) => (
              <button key={item.value} type="button" className={`${styles.periodButton} ${period === item.value ? styles.periodButtonActive : ""}`} aria-pressed={period === item.value} onClick={() => setPeriod(item.value)}>
                {item.label}
              </button>
            ))}
          </div>
          <button type="button" className={styles.refreshButton} onClick={() => void loadAnalytics(period, true)} disabled={loading || refreshing}>
            {refreshing ? "Оновлення…" : "Оновити"}
          </button>
        </div>
      </header>

      {error && !currentData ? (
        <div className={styles.stateCard} role="alert">
          <strong>Не вдалося завантажити аналітику.</strong>
          <p>{error}</p>
          <button type="button" onClick={() => void loadAnalytics(period)}>Спробувати ще раз</button>
        </div>
      ) : (
        <>
          <div className={styles.statusRow} aria-live="polite">
            <span>{currentData ? `Оновлено о ${formatUpdatedAt(currentData.updatedAt)}` : "Завантаження даних…"}</span>
            {refreshing ? <span>Отримуємо свіжі дані…</span> : null}
          </div>

          <div className={styles.metricsGrid}>
            {loading && !currentData ? Array.from({ length: 4 }).map((_, index) => <div className={styles.metricSkeleton} key={index} />) : (
              <>
                <article className={styles.metricCard}><span className={styles.metricLabel}>Відвідувачі</span><strong>{formatNumber(visitors)}</strong><span className={styles.metricHint}>Унікальні відвідувачі</span></article>
                <article className={styles.metricCard}><span className={styles.metricLabel}>Перегляди</span><strong>{formatNumber(pageviews)}</strong><span className={styles.metricHint}>Перегляди сторінок</span></article>
                <article className={styles.metricCard}><span className={styles.metricLabel}>Заявки</span><strong>{formatNumber(leads)}</strong><span className={styles.metricHint}>Звернення за період</span></article>
                <article className={`${styles.metricCard} ${styles.metricAccent}`}><span className={styles.metricLabel}>Конверсія</span><strong>{conversion.toLocaleString("uk-UA")}%</strong><span className={styles.metricHint}>Заявки до відвідувачів</span></article>
              </>
            )}
          </div>

          {!loading && currentData ? (
            <div className={styles.dashboard}>
              <section className={`${styles.sectionCard} ${styles.chartCard}`}>
                <div className={styles.sectionHeading}><div><span className={styles.sectionEyebrow}>ДИНАМІКА</span><h2>Відвідуваність</h2></div><span className={styles.sectionMeta}>{formatNumber(pageviews)} переглядів</span></div>
                <TrafficChart rows={analytics?.timeline.data ?? []} period={period} />
              </section>

              <section className={styles.sectionCard}>
                <div className={styles.sectionHeading}><div><span className={styles.sectionEyebrow}>ЗАЯВКИ</span><h2>Стан звернень</h2></div><strong className={styles.sectionTotal}>{formatNumber(currentData.analytics.leads.total)}</strong></div>
                <div className={styles.leadStats}>
                  <div><span>Нові</span><strong>{formatNumber(currentData.analytics.leads.new)}</strong></div>
                  <div><span>В роботі</span><strong>{formatNumber(currentData.analytics.leads.inProgress)}</strong></div>
                  <div><span>Опрацьовані</span><strong>{formatNumber(currentData.analytics.leads.done)}</strong></div>
                </div>
              </section>

              <section className={styles.sectionCard}>
                <div className={styles.sectionHeading}><div><span className={styles.sectionEyebrow}>КОНТЕНТ</span><h2>Популярні сторінки</h2></div></div>
                <RankingList rows={pages} label="Переглядів сторінок за цей період ще немає." />
              </section>

              <section className={styles.sectionCard}>
                <div className={styles.sectionHeading}><div><span className={styles.sectionEyebrow}>ПОРТФОЛІО</span><h2>Популярні роботи</h2></div></div>
                <RankingList rows={projects} label="Окремі роботи портфоліо за цей період ще не переглядали." />
              </section>

              <section className={styles.sectionCard}>
                <div className={styles.sectionHeading}><div><span className={styles.sectionEyebrow}>ТРАФІК</span><h2>Джерела переходів</h2></div></div>
                <BreakdownList rows={referrers} empty="Джерела переходів поки не визначені." />
              </section>

              <section className={styles.sectionCard}>
                <div className={styles.sectionHeading}><div><span className={styles.sectionEyebrow}>АУДИТОРІЯ</span><h2>Країни</h2></div></div>
                <BreakdownList rows={countries} empty="Даних про країни поки немає." />
              </section>

              <section className={styles.sectionCard}>
                <div className={styles.sectionHeading}><div><span className={styles.sectionEyebrow}>ТЕХНІКА</span><h2>Пристрої</h2></div></div>
                <BreakdownList rows={devices} empty="Даних про пристрої поки немає." />
              </section>

              <section className={styles.sectionCard}>
                <div className={styles.sectionHeading}><div><span className={styles.sectionEyebrow}>СЕРЕДОВИЩЕ</span><h2>Браузери</h2></div></div>
                <BreakdownList rows={browsers} empty="Даних про браузери поки немає." />
              </section>

              <section className={styles.sectionCard}>
                <div className={styles.sectionHeading}><div><span className={styles.sectionEyebrow}>СЕРЕДОВИЩЕ</span><h2>Операційні системи</h2></div></div>
                <BreakdownList rows={operatingSystems} empty="Даних про операційні системи поки немає." />
              </section>
            </div>
          ) : null}

          {error && currentData ? <div className={styles.inlineError} role="status">Дані залишилися на екрані, але останнє автоматичне оновлення не вдалося.</div> : null}
        </>
      )}
    </section>
  );
}
