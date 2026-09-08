"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  GridIcon,
  InboxIcon,
  LogoutIcon,
  UserIcon,
} from "./AdminIcons";

import styles from "./AdminShell.module.css";

const navigation = [
  {
    label: "Портфоліо",
    href: "/admin/portfolio",
    icon: GridIcon,
  },
  {
    label: "Заявки",
    href: "/admin/leads",
    icon: InboxIcon,
  },
];

export function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link
          className={styles.brand}
          href="/admin/portfolio"
          aria-label="4HOME Portfolio Manager"
        >
          <span className={styles.logo}>4HOME</span>

          <span className={styles.logoCaption}>
            PORTFOLIO MANAGER
          </span>
        </Link>

        <nav
          className={styles.nav}
          aria-label="Навігація Portfolio Manager"
        >
          {navigation.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${
                  active ? styles.navItemActive : ""
                }`}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarBottom}>
          <div className={styles.sideMessage}>
            <strong>Просте керування</strong>
            <span>Гарні результати</span>
          </div>

          <form
            className={styles.logoutForm}
            action="/admin/logout"
            method="post"
          >
            <button
              className={styles.logout}
              type="submit"
              aria-label="Вийти з Portfolio Manager"
            >
              <LogoutIcon />
              <span>Вийти</span>
            </button>
          </form>
        </div>
      </aside>

      <div className={styles.workspace}>
        <header className={styles.mobileHeader}>
          <Link
            className={styles.mobileBrand}
            href="/admin/portfolio"
          >
            4HOME
          </Link>

          <Link
            className={styles.mobileUser}
            href="/admin/profile"
            aria-label="Профіль адміністратора"
          >
            <UserIcon />
          </Link>
        </header>

        <main className={styles.main}>
          {children}
        </main>

        <nav
          className={styles.mobileNav}
          aria-label="Мобільна навігація"
        >
          {navigation.map((item) => {
            const active = pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.mobileNavItem} ${
                  active ? styles.mobileNavActive : ""
                }`}
              >
                <Icon />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}