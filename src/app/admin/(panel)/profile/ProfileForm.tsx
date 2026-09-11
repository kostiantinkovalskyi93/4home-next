"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import styles from "./page.module.css";

type ProfileFormProps = {
  initialName: string;
  initialEmail: string;
};

type FormStatus =
  | "idle"
  | "saving"
  | "success"
  | "error";

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function ProfileForm({
  initialName,
  initialEmail,
}: ProfileFormProps) {
  const router = useRouter();

  const [savedName, setSavedName] =
    useState(initialName);
  const [savedEmail, setSavedEmail] =
    useState(initialEmail);

  const [name, setName] =
    useState(initialName);
  const [email, setEmail] =
    useState(initialEmail);
  const [password, setPassword] =
    useState("");
  const [passwordConfirm, setPasswordConfirm] =
    useState("");

  const [status, setStatus] =
    useState<FormStatus>("idle");
  const [message, setMessage] =
    useState("");

  const cleanName = name.trim();
  const cleanEmail = normalizeEmail(email);

  const hasChanges = useMemo(
    () =>
      cleanName !== savedName ||
      cleanEmail !==
        normalizeEmail(savedEmail) ||
      password.length > 0 ||
      passwordConfirm.length > 0,
    [
      cleanEmail,
      cleanName,
      password,
      passwordConfirm,
      savedEmail,
      savedName,
    ],
  );

  const clearFeedback = () => {
    if (status !== "saving") {
      setStatus("idle");
      setMessage("");
    }
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (status === "saving") {
      return;
    }

    if (!cleanEmail) {
      setStatus("error");
      setMessage("Вкажіть email.");
      return;
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail,
      )
    ) {
      setStatus("error");
      setMessage("Перевірте формат email.");
      return;
    }

    if (
      password ||
      passwordConfirm
    ) {
      if (password.length < 8) {
        setStatus("error");
        setMessage(
          "Новий пароль має містити щонайменше 8 символів.",
        );
        return;
      }

      if (password !== passwordConfirm) {
        setStatus("error");
        setMessage(
          "Паролі не збігаються.",
        );
        return;
      }
    }

    if (!hasChanges) {
      setStatus("success");
      setMessage(
        "Змін для збереження немає.",
      );
      return;
    }

    setStatus("saving");
    setMessage("");

    const supabase = createClient();

    try {
      const updates: {
        email?: string;
        password?: string;
        data?: {
          display_name: string;
        };
      } = {};

      if (
        cleanEmail !==
        normalizeEmail(savedEmail)
      ) {
        updates.email = cleanEmail;
      }

      if (password) {
        updates.password = password;
      }

      if (cleanName !== savedName) {
        updates.data = {
          display_name: cleanName,
        };
      }

      const {
        data,
        error,
      } = await supabase.auth.updateUser(
        updates,
      );

      if (error || !data.user) {
        throw error ?? new Error(
          "Не вдалося оновити профіль.",
        );
      }

      const resultingName =
        typeof data.user.user_metadata
          ?.display_name === "string"
          ? data.user.user_metadata
              .display_name
          : cleanName;

      const resultingEmail =
        data.user.email ?? cleanEmail;

      setSavedName(resultingName);
      setSavedEmail(resultingEmail);
      setName(resultingName);
      setEmail(resultingEmail);
      setPassword("");
      setPasswordConfirm("");

      const emailChanged =
        cleanEmail !==
        normalizeEmail(initialEmail);

      setStatus("success");
      setMessage(
        emailChanged &&
          resultingEmail !== cleanEmail
          ? "Зміни збережено. Підтвердьте новий email за посиланням, яке Supabase надішле на пошту."
          : "Зміни профілю збережено.",
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Failed to update admin profile:",
        error,
      );

      setStatus("error");
      setMessage(
        error instanceof Error &&
          error.message
            .toLowerCase()
            .includes("email")
          ? "Не вдалося змінити email. Перевірте адресу та спробуйте ще раз."
          : "Не вдалося зберегти зміни. Спробуйте ще раз.",
      );
    }
  };

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={styles.grid}>
        <label className={styles.field}>
          <span>Ім’я</span>

          <input
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              clearFeedback();
            }}
            autoComplete="name"
            maxLength={80}
            disabled={status === "saving"}
          />
        </label>

        <label className={styles.field}>
          <span>Email</span>

          <input
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              clearFeedback();
            }}
            type="email"
            autoComplete="email"
            inputMode="email"
            spellCheck={false}
            maxLength={254}
            disabled={status === "saving"}
            required
          />
        </label>

        <label className={styles.field}>
          <span>Новий пароль</span>

          <input
            value={password}
            onChange={(event) => {
              setPassword(
                event.target.value,
              );
              clearFeedback();
            }}
            type="password"
            placeholder="Залиште порожнім, щоб не змінювати"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            disabled={status === "saving"}
          />
        </label>

        <label className={styles.field}>
          <span>
            Підтвердити пароль
          </span>

          <input
            value={passwordConfirm}
            onChange={(event) => {
              setPasswordConfirm(
                event.target.value,
              );
              clearFeedback();
            }}
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            disabled={status === "saving"}
          />
        </label>
      </div>

      <div className={styles.securityNote}>
        <strong>Безпека облікового запису</strong>
        <p>
          Email використовується для входу. Якщо в
          Supabase увімкнено підтвердження зміни
          email, нова адреса почне діяти лише після
          підтвердження листа.
        </p>
      </div>

      {message ? (
        <div
          className={`${styles.feedback} ${
            status === "error"
              ? styles.feedbackError
              : styles.feedbackSuccess
          }`}
          role={
            status === "error"
              ? "alert"
              : "status"
          }
          aria-live="polite"
        >
          {message}
        </div>
      ) : null}

      <div className={styles.actions}>
        <button
          type="submit"
          disabled={
            status === "saving" ||
            !hasChanges
          }
          aria-busy={
            status === "saving"
          }
        >
          {status === "saving"
            ? "Зберігаємо…"
            : "Зберегти зміни"}
        </button>

        <span className={styles.formState}>
          {status === "saving"
            ? "Оновлюємо обліковий запис…"
            : hasChanges
              ? "Є незбережені зміни."
              : "Усі зміни збережено."}
        </span>
      </div>
    </form>
  );
}
