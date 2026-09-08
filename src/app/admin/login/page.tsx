"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import styles from "./page.module.css";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setErrorMessage("Введіть email і пароль.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    const supabase = createClient();

    try {
      const {
        data: { user },
        error: signInError,
      } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });

      if (signInError || !user) {
        setErrorMessage("Невірний email або пароль.");
        return;
      }

      const { data: admin, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();

        setErrorMessage(
          "Цей обліковий запис не має доступу до CMS.",
        );

        return;
      }

      router.replace("/admin/portfolio");
      router.refresh();
    } catch {
      setErrorMessage(
        "Не вдалося виконати вхід. Перевірте з’єднання та спробуйте ще раз.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.loginCard}>
        <div className={styles.brand}>
          <span className={styles.logo}>4HOME</span>

          <span className={styles.productName}>
            Portfolio Manager
          </span>
        </div>

        <div className={styles.heading}>
          <span className={styles.eyebrow}>
            ADMINISTRATION
          </span>

          <h1>Вхід до CMS</h1>

          <p>
            Увійдіть, щоб керувати роботами портфоліо
            та заявками 4HOME.
          </p>
        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
          noValidate
        >
          <label className={styles.field}>
            <span>Email</span>

            <input
              type="email"
              name="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);

                if (errorMessage) {
                  setErrorMessage("");
                }
              }}
              placeholder="name@example.com"
              autoComplete="email"
              inputMode="email"
              spellCheck={false}
              disabled={isSubmitting}
              required
            />
          </label>

          <label className={styles.field}>
            <span>Пароль</span>

            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);

                if (errorMessage) {
                  setErrorMessage("");
                }
              }}
              placeholder="Введіть пароль"
              autoComplete="current-password"
              disabled={isSubmitting}
              required
            />
          </label>

          {errorMessage ? (
            <div
              className={styles.error}
              role="alert"
              aria-live="polite"
            >
              {errorMessage}
            </div>
          ) : null}

          <button
            className={styles.submit}
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className={styles.spinner}
                  aria-hidden="true"
                />

                <span>Виконуємо вхід...</span>
              </>
            ) : (
              <span>Увійти</span>
            )}
          </button>
        </form>

        <div className={styles.security}>
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 3 5.5 5.8v5.1c0 4.5 2.7 8.5 6.5 10.1 3.8-1.6 6.5-5.6 6.5-10.1V5.8L12 3Z" />
            <path d="m9.4 12 1.7 1.7 3.6-3.7" />
          </svg>

          <span>
            Доступ лише для адміністраторів 4HOME
          </span>
        </div>
      </section>

      <p className={styles.footer}>
        4HOME · Portfolio Manager
      </p>
    </main>
  );
}