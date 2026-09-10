"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  InstagramIcon,
  MailIcon,
  TelegramIcon,
} from "@/components/ui/ContactIcons";
import { CONTACTS } from "@/data/contacts";

import styles from "./LeadForm.module.css";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_COMMENT_LENGTH = 1500;
const ATTRIBUTED_COMMENT_MAX_LENGTH = 1250;

const TURNSTILE_SCRIPT_ID = "cloudflare-turnstile-script";

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const furnitureOptions = [
  "Кухня",
  "Розпашна шафа",
  "Шафа-купе",
  "ТВ-тумба / комод",
  "Меблі у передпокій",
  "Інші меблі",
  "Поки не визначився",
] as const;

type FormState = {
  name: string;
  phone: string;
  furnitureType: string;
  dimensions: string;
  comment: string;
  website: string;
};

export type LeadSourceContext = {
  type: "portfolio_project";
  projectId: string;
  projectSlug: string;
  projectTitle: string;
  projectCategory: string;
  projectPath: string;
};

type LeadFormProps = {
  sourceContext?: LeadSourceContext | null;
};

type FilePreview = {
  file: File;
  url: string;
};

type SubmitError = {
  title: string;
  message: string;
};

type ApiErrorResponse = {
  ok?: boolean;
  error?: string;
};

type TurnstileRenderOptions = {
  sitekey: string;
  theme?: "light" | "dark" | "auto";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: TurnstileRenderOptions,
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const initialFormState: FormState = {
  name: "",
  phone: "",
  furnitureType: "Кухня",
  dimensions: "",
  comment: "",
  website: "",
};

function getFurnitureTypeForSource(sourceContext?: LeadSourceContext | null) {
  if (!sourceContext) return initialFormState.furnitureType;

  if (sourceContext.projectCategory === "Кухні") return "Кухня";
  if (sourceContext.projectCategory === "Розпашні шафи") {
    return "Розпашна шафа";
  }
  if (sourceContext.projectCategory === "Шафи-купе") return "Шафа-купе";
  if (sourceContext.projectCategory === "Інші меблі") return "Інші меблі";

  return initialFormState.furnitureType;
}

function createInitialFormState(
  sourceContext?: LeadSourceContext | null,
): FormState {
  return {
    ...initialFormState,
    furnitureType: getFurnitureTypeForSource(sourceContext),
  };
}

function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  return digits.length >= 10 && digits.length <= 15;
}

function formatFileSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

function getSubmitError({
  status,
  errorCode,
  retryAfter,
}: {
  status: number;
  errorCode?: string;
  retryAfter?: string | null;
}): SubmitError {
  if (status === 429 || errorCode === "Too many requests") {
    const seconds = Number(retryAfter);

    const waitMessage =
      Number.isFinite(seconds) && seconds > 0
        ? `Зачекайте приблизно ${seconds} секунд та спробуйте ще раз.`
        : "Зачекайте приблизно хвилину та спробуйте ще раз.";

    return {
      title: "Забагато спроб за короткий час",
      message: `Ви надіслали кілька заявок поспіль. ${waitMessage}`,
    };
  }

  if (
    errorCode === "Turnstile verification required" ||
    errorCode === "Turnstile verification failed" ||
    errorCode === "Turnstile hostname rejected"
  ) {
    return {
      title: "Не вдалося пройти перевірку безпеки",
      message:
        "Оновіть перевірку Cloudflare та спробуйте надіслати заявку ще раз.",
    };
  }

  if (errorCode === "Invalid phone") {
    return {
      title: "Перевірте номер телефону",
      message:
        "Вкажіть коректний номер телефону, за яким можна з вами зв’язатися.",
    };
  }

  if (errorCode === "Too many files") {
    return {
      title: "Забагато фотографій",
      message: `До заявки можна додати не більше ${MAX_FILES} фото.`,
    };
  }

  if (errorCode === "Unsupported file type") {
    return {
      title: "Непідтримуваний формат фото",
      message:
        "До заявки можна додати фотографії у форматах JPG, PNG або WEBP.",
    };
  }

  if (errorCode === "File is too large") {
    return {
      title: "Фото завеликого розміру",
      message:
        "Розмір одного фото не повинен перевищувати 10 МБ.",
    };
  }

  if (errorCode === "Origin not allowed") {
    return {
      title: "Не вдалося надіслати заявку",
      message:
        "Форма недоступна з цієї адреси сайту. Спробуйте оновити сторінку.",
    };
  }

  if (
    status >= 500 ||
    errorCode === "Internal server error" ||
    errorCode === "Server configuration error"
  ) {
    return {
      title: "Сервіс тимчасово недоступний",
      message:
        "Не вдалося передати заявку. Спробуйте ще раз трохи пізніше або зателефонуйте нам.",
    };
  }

  return {
    title: "Не вдалося надіслати заявку",
    message:
      "Спробуйте ще раз. Якщо помилка повториться — зателефонуйте нам.",
  };
}

export function LeadForm({ sourceContext = null }: LeadFormProps) {
  const [form, setForm] = useState<FormState>(() =>
    createInitialFormState(sourceContext),
  );

  const [files, setFiles] = useState<FilePreview[]>([]);

  const [phoneError, setPhoneError] = useState("");
  const [fileError, setFileError] = useState("");

  const [submitError, setSubmitError] =
    useState<SubmitError | null>(null);

  const [turnstileError, setTurnstileError] =
    useState("");

  const [turnstileToken, setTurnstileToken] =
    useState("");

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success"
  >("idle");

  const filesRef = useRef<FilePreview[]>([]);

  const submissionIdRef = useRef<string | null>(null);

  const phoneInputRef = useRef<HTMLInputElement>(null);

  const turnstileContainerRef =
    useRef<HTMLDivElement>(null);

  const turnstileWidgetIdRef =
    useRef<string | null>(null);

  const isSubmitting = status === "submitting";
  const isSuccess = status === "success";
  const endpoint =
    process.env.NEXT_PUBLIC_LEAD_ENDPOINT;

  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const canAddFiles = files.length < MAX_FILES;

  const accept = useMemo(
    () => ALLOWED_FILE_TYPES.join(","),
    [],
  );

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    return () => {
      filesRef.current.forEach((item) => {
        URL.revokeObjectURL(item.url);
      });
    };
  }, []);

  useEffect(() => {
    if (!turnstileSiteKey || isSuccess) {
      return;
    }

    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout> | null =
      null;

    const renderTurnstile = () => {
      if (
        cancelled ||
        !window.turnstile ||
        !turnstileContainerRef.current ||
        turnstileWidgetIdRef.current
      ) {
        return;
      }

      try {
        turnstileWidgetIdRef.current =
          window.turnstile.render(
            turnstileContainerRef.current,
            {
              sitekey: turnstileSiteKey,
              theme: "light",

              callback: (token) => {
                if (cancelled) {
                  return;
                }

                setTurnstileToken(token);
                setTurnstileError("");
              },

              "expired-callback": () => {
                if (cancelled) {
                  return;
                }

                setTurnstileToken("");

                setTurnstileError(
                  "Час перевірки минув. Пройдіть її ще раз.",
                );
              },

              "error-callback": () => {
                if (cancelled) {
                  return;
                }

                setTurnstileToken("");

                setTurnstileError(
                  "Не вдалося виконати перевірку. Спробуйте ще раз.",
                );
              },
            },
          );
      } catch {
        if (!cancelled) {
          setTurnstileToken("");

          setTurnstileError(
            "Не вдалося завантажити перевірку безпеки.",
          );
        }
      }
    };

    const waitForTurnstile = () => {
      if (cancelled) {
        return;
      }

      if (window.turnstile) {
        renderTurnstile();
        return;
      }

      retryTimer = setTimeout(
        waitForTurnstile,
        100,
      );
    };

    if (window.turnstile) {
      renderTurnstile();
    } else {
      const existingScript =
        document.getElementById(
          TURNSTILE_SCRIPT_ID,
        ) as HTMLScriptElement | null;

      if (existingScript) {
        waitForTurnstile();
      } else {
        const script =
          document.createElement("script");

        script.id = TURNSTILE_SCRIPT_ID;
        script.src =
          "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;

        script.addEventListener(
          "load",
          renderTurnstile,
        );

        script.addEventListener(
          "error",
          () => {
            if (!cancelled) {
              setTurnstileError(
                "Не вдалося завантажити перевірку безпеки.",
              );
            }
          },
        );

        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;

      if (retryTimer) {
        clearTimeout(retryTimer);
      }

      if (
        window.turnstile &&
        turnstileWidgetIdRef.current
      ) {
        try {
          window.turnstile.remove(
            turnstileWidgetIdRef.current,
          );
        } catch {
          // Widget could already be removed by Cloudflare.
        }
      }

      turnstileWidgetIdRef.current = null;
    };
  }, [turnstileSiteKey, isSuccess]);

  const resetTurnstile = () => {
    setTurnstileToken("");

    if (
      window.turnstile &&
      turnstileWidgetIdRef.current
    ) {
      try {
        window.turnstile.reset(
          turnstileWidgetIdRef.current,
        );
      } catch {
        setTurnstileError(
          "Оновіть сторінку, щоб повторити перевірку безпеки.",
        );
      }
    }
  };

  const updateField = (
    field: keyof FormState,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "phone") {
      setPhoneError("");
    }

    setSubmitError(null);
  };

  const handleFiles = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(
      event.target.files ?? [],
    );

    event.target.value = "";

    if (!selectedFiles.length) {
      return;
    }

    setFileError("");
    setSubmitError(null);

    const availableSlots =
      MAX_FILES - files.length;

    if (availableSlots <= 0) {
      setFileError(
        `Можна додати не більше ${MAX_FILES} фото.`,
      );

      return;
    }

    const acceptedFiles: FilePreview[] = [];

    for (const file of selectedFiles.slice(
      0,
      availableSlots,
    )) {
      if (
        !ALLOWED_FILE_TYPES.includes(
          file.type as (typeof ALLOWED_FILE_TYPES)[number],
        )
      ) {
        setFileError(
          "Дозволені формати: JPG, PNG та WEBP.",
        );

        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setFileError(
          `Файл «${file.name}» більший за 10 МБ.`,
        );

        continue;
      }

      acceptedFiles.push({
        file,
        url: URL.createObjectURL(file),
      });
    }

    setFiles((current) => [
      ...current,
      ...acceptedFiles,
    ]);

    if (selectedFiles.length > availableSlots) {
      setFileError(
        `Можна додати не більше ${MAX_FILES} фото.`,
      );
    }
  };

  const removeFile = (index: number) => {
    setFiles((current) => {
      const item = current[index];

      if (item) {
        URL.revokeObjectURL(item.url);
      }

      return current.filter(
        (_, fileIndex) => fileIndex !== index,
      );
    });

    setFileError("");
    setSubmitError(null);
  };

  const resetForm = () => {
    files.forEach((item) => {
      URL.revokeObjectURL(item.url);
    });

    setFiles([]);
    setForm(createInitialFormState(sourceContext));
    setPhoneError("");
    setFileError("");
    setSubmitError(null);
    setTurnstileError("");
    setTurnstileToken("");
  };

  const focusPhoneError = () => {
    window.requestAnimationFrame(() => {
      phoneInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      window.setTimeout(() => {
        phoneInputRef.current?.focus({
          preventScroll: true,
        });
      }, 350);
    });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setPhoneError("");
    setSubmitError(null);

    if (!isValidPhone(form.phone)) {
      setPhoneError(
        "Вкажіть коректний номер телефону.",
      );

      focusPhoneError();

      return;
    }

    if (!endpoint) {
      setSubmitError({
        title: "Форма тимчасово недоступна",
        message:
          "Не вдалося підключитися до сервісу заявок. Зателефонуйте нам або спробуйте пізніше.",
      });

      return;
    }

    if (!turnstileSiteKey) {
      setSubmitError({
        title: "Перевірка безпеки недоступна",
        message:
          "Оновіть сторінку та спробуйте ще раз. Якщо проблема залишиться — зателефонуйте нам.",
      });

      return;
    }

    if (!turnstileToken) {
      setTurnstileError(
        "Дочекайтеся завершення перевірки безпеки.",
      );

      return;
    }

    try {
      setStatus("submitting");

      const formData = new FormData();

      const submissionId =
        submissionIdRef.current ?? crypto.randomUUID();

      submissionIdRef.current = submissionId;
      formData.append("submissionId", submissionId);

      formData.append(
        "name",
        form.name.trim(),
      );

      formData.append(
        "phone",
        form.phone.trim(),
      );

      formData.append(
        "furnitureType",
        form.furnitureType,
      );

      formData.append(
        "dimensions",
        form.dimensions.trim(),
      );

      const userComment = form.comment.trim();
      const portfolioReference = sourceContext
        ? `Референс із портфоліо: «${sourceContext.projectTitle}» (${sourceContext.projectPath})`
        : "";
      const submittedComment = portfolioReference
        ? [userComment, portfolioReference].filter(Boolean).join("\n\n")
        : userComment;

      formData.append("comment", submittedComment);

      if (sourceContext) {
        formData.append("leadSource", sourceContext.type);
        formData.append("projectId", sourceContext.projectId);
        formData.append("projectSlug", sourceContext.projectSlug);
        formData.append("projectTitle", sourceContext.projectTitle);
        formData.append("projectCategory", sourceContext.projectCategory);
        formData.append("sourcePath", sourceContext.projectPath);
      } else {
        formData.append("leadSource", "contacts");
      }

      formData.append(
        "website",
        form.website,
      );

      formData.append(
        "cf-turnstile-response",
        turnstileToken,
      );

      files.forEach(({ file }) => {
        formData.append("files", file);
      });

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      let responseData: ApiErrorResponse = {};

      try {
        responseData =
          (await response.json()) as ApiErrorResponse;
      } catch {
        responseData = {};
      }

      if (!response.ok) {
        if (
          responseData.error === "Invalid phone"
        ) {
          setPhoneError(
            "Вкажіть коректний номер телефону.",
          );

          focusPhoneError();
        }

        setSubmitError(
          getSubmitError({
            status: response.status,
            errorCode: responseData.error,
            retryAfter:
              response.headers.get("Retry-After"),
          }),
        );

        setStatus("idle");

        /*
         * Turnstile tokens are single-use.
         * After the Worker has checked one, we always
         * request a fresh token before another attempt.
         */
        resetTurnstile();

        return;
      }

      submissionIdRef.current = null;
      resetForm();
      setStatus("success");
    } catch {
      setStatus("idle");

      setSubmitError({
        title: "Не вдалося з’єднатися із сервером",
        message:
          "Перевірте підключення до інтернету та спробуйте ще раз. Якщо проблема повториться — зателефонуйте нам.",
      });

      /*
       * We cannot know whether the request reached
       * Siteverify, therefore use a fresh token.
       */
      resetTurnstile();
    }
  };

  if (status === "success") {
    return (
      <section
        className={styles.section}
        id="lead-form"
      >
        <div
          className={`container ${styles.container}`}
        >
          <div className={styles.successCard}>
            <span
              className={styles.successIcon}
              aria-hidden="true"
            >
              ✓
            </span>

            <p className={styles.eyebrow}>
              Заявку отримано
            </p>

            <h2 className={styles.successTitle}>
              Дякуємо
            </h2>

            <p className={styles.successText}>
              {sourceContext ? (
                <>
                  Заявку щодо «{sourceContext.projectTitle}» отримано. Сергій
                  зв&apos;яжеться з вами для уточнення деталей.
                </>
              ) : (
                <>
                  Сергій зв&apos;яжеться з вами для уточнення деталей проєкту.
                </>
              )}
            </p>

            <div
              className={styles.successActions}
            >
              <button
                type="button"
                className={
                  styles.secondaryButton
                }
                onClick={() =>
                  setStatus("idle")
                }
              >
                Надіслати ще одну заявку
              </button>

              <Link
                href="/portfolio"
                className={styles.primaryLink}
              >
                Подивитися наші роботи
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={styles.section}
      id="lead-form"
    >
      <div
        className={`container ${styles.container}`}
      >
        <div className={styles.layout}>
          <div className={styles.intro}>
            <div
              className={styles.introContent}
            >
              <p className={styles.eyebrow}>
                Індивідуальний прорахунок
              </p>

              <h2 className={styles.title}>
                Розрахувати
                <br />
                вартість меблів
              </h2>

              <p
                className={styles.description}
              >
                Надішліть короткий опис
                проєкту. Зв’яжемося, уточнимо
                деталі та запропонуємо рішення.
              </p>

              <div
                className={styles.features}
              >
                <div
                  className={styles.feature}
                >
                  <span
                    className={
                      styles.featureIcon
                    }
                    aria-hidden="true"
                  >
                    01
                  </span>

                  <span>
                    Індивідуальний підхід до
                    кожного проєкту
                  </span>
                </div>

                <div
                  className={styles.feature}
                >
                  <span
                    className={
                      styles.featureIcon
                    }
                    aria-hidden="true"
                  >
                    02
                  </span>

                  <span>
                    Підбір матеріалів та
                    сучасних рішень
                  </span>
                </div>

                <div
                  className={styles.feature}
                >
                  <span
                    className={
                      styles.featureIcon
                    }
                    aria-hidden="true"
                  >
                    03
                  </span>

                  <span>
                    Узгодження деталей до
                    початку виготовлення
                  </span>
                </div>
              </div>
            </div>

            <div
              className={styles.contactCard}
            >
              <div>
                <span
                  className={
                    styles.contactLabel
                  }
                >
                  Ваш контакт
                </span>

                <strong
                  className={
                    styles.contactName
                  }
                >
                  {
                    CONTACTS.primaryPhone
                      .name
                  }
                </strong>

                <a
                  href={
                    CONTACTS.primaryPhone
                      .href
                  }
                  className={
                    styles.contactPhone
                  }
                >
                  {
                    CONTACTS.primaryPhone
                      .display
                  }
                </a>
              </div>

              <div
                className={styles.channels}
              >
<a
  href={CONTACTS.email.href}
  className={styles.channel}
  aria-label="Написати на електронну пошту"
  title="Написати на email"
>
  <MailIcon
    className={styles.channelIcon}
  />
</a>

                <a
                  href={
                    CONTACTS.telegram.href
                  }
                  target="_blank"
                  rel="noreferrer"
                  className={styles.channel}
                  aria-label="Написати у Telegram"
                >
                  <TelegramIcon
                    className={
                      styles.channelIcon
                    }
                  />
                </a>

                <a
                  href={
                    CONTACTS.instagram.href
                  }
                  target="_blank"
                  rel="noreferrer"
                  className={styles.channel}
                  aria-label="Відкрити Instagram"
                >
                  <InstagramIcon
                    className={
                      styles.channelIcon
                    }
                  />
                </a>
              </div>
            </div>
          </div>

          <div className={styles.formCard}>
            <form
              className={styles.form}
              onSubmit={handleSubmit}
              noValidate
            >
              {sourceContext && (
                <div className={styles.sourceContext}>
                  <div>
                    <span className={styles.sourceContextLabel}>
                      Референс із портфоліо
                    </span>
                    <strong>{sourceContext.projectTitle}</strong>
                  </div>

                  <Link
                    href={sourceContext.projectPath}
                    className={styles.sourceContextLink}
                  >
                    Переглянути роботу <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              )}

              <div className={styles.field}>
                <label htmlFor="lead-name">
                  Ім’я
                </label>

                <input
                  id="lead-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={80}
                  placeholder="Ваше ім’я"
                  value={form.name}
                  onChange={(event) =>
                    updateField(
                      "name",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="lead-phone">
                  Телефон{" "}
                  <span
                    className={
                      styles.required
                    }
                  >
                    *
                  </span>
                </label>

                <input
                  ref={phoneInputRef}
                  id="lead-phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={30}
                  placeholder="+380 99 300 22 45"
                  value={form.phone}
                  aria-invalid={Boolean(
                    phoneError,
                  )}
                  aria-describedby={
                    phoneError
                      ? "lead-phone-error"
                      : undefined
                  }
                  onChange={(event) =>
                    updateField(
                      "phone",
                      event.target.value,
                    )
                  }
                />

                {phoneError ? (
                  <span
                    id="lead-phone-error"
                    className={
                      styles.errorText
                    }
                  >
                    {phoneError}
                  </span>
                ) : (
                  <span
                    className={styles.hint}
                  >
                    Вкажіть номер, за яким
                    можна з вами зв’язатися.
                  </span>
                )}
              </div>

              <div className={styles.field}>
                <label
                  htmlFor="lead-furniture-type"
                >
                  Що потрібно
                </label>

                <select
                  id="lead-furniture-type"
                  name="furnitureType"
                  value={
                    form.furnitureType
                  }
                  onChange={(event) =>
                    updateField(
                      "furnitureType",
                      event.target.value,
                    )
                  }
                >
                  {furnitureOptions.map(
                    (option) => (
                      <option
                        key={option}
                        value={option}
                      >
                        {option}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div className={styles.field}>
                <label htmlFor="lead-dimensions">
                  Орієнтовні розміри
                </label>

                <input
                  id="lead-dimensions"
                  name="dimensions"
                  type="text"
                  maxLength={120}
                  placeholder="Наприклад: 3,2 × 2,4 м"
                  value={form.dimensions}
                  onChange={(event) =>
                    updateField(
                      "dimensions",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="lead-comment">
                  Коментар
                </label>

                <textarea
                  id="lead-comment"
                  name="comment"
                  rows={5}
                  maxLength={
                    sourceContext
                      ? ATTRIBUTED_COMMENT_MAX_LENGTH
                      : MAX_COMMENT_LENGTH
                  }
                  placeholder="Опишіть задачу, стиль, побажання..."
                  value={form.comment}
                  onChange={(event) =>
                    updateField(
                      "comment",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div
                className={styles.honeypot}
                aria-hidden="true"
              >
                <label htmlFor="lead-website">
                  Website
                </label>

                <input
                  id="lead-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.website}
                  onChange={(event) =>
                    updateField(
                      "website",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div
                className={
                  styles.uploadSection
                }
              >
                <div
                  className={
                    styles.uploadHeading
                  }
                >
                  <div>
                    <strong>
                      Фото або ескіз
                    </strong>

                    <span>
                      до 3 файлів
                    </span>
                  </div>
                </div>

                {canAddFiles && (
                  <label
                    className={
                      styles.uploadArea
                    }
                  >
                    <input
                      type="file"
                      accept={accept}
                      multiple
                      onChange={
                        handleFiles
                      }
                    />

                    <span
                      className={
                        styles.uploadIcon
                      }
                      aria-hidden="true"
                    >
                      ↑
                    </span>

                    <strong>
                      Додати фото
                    </strong>

                    <span>
                      JPG, PNG, WEBP — до
                      10 МБ кожен
                    </span>
                  </label>
                )}

                {files.length > 0 && (
                  <div
                    className={
                      styles.previews
                    }
                  >
                    {files.map(
                      (item, index) => (
                        <div
                          className={
                            styles.preview
                          }
                          key={`${item.file.name}-${item.file.lastModified}`}
                        >
                          <Image
                            src={item.url}
                            alt={`Вибране фото ${index + 1}`}
                            fill
                            unoptimized
                            sizes="96px"
                            className={
                              styles.previewImage
                            }
                          />

                          <button
                            type="button"
                            className={
                              styles.removeFile
                            }
                            aria-label={`Видалити файл ${item.file.name}`}
                            onClick={() =>
                              removeFile(
                                index,
                              )
                            }
                          >
                            ×
                          </button>

                          <span
                            className={
                              styles.fileSize
                            }
                          >
                            {formatFileSize(
                              item.file.size,
                            )}
                          </span>
                        </div>
                      ),
                    )}

                    {canAddFiles && (
                      <label
                        className={
                          styles.addMore
                        }
                        aria-label="Додати ще фото"
                      >
                        <input
                          type="file"
                          accept={accept}
                          multiple
                          onChange={
                            handleFiles
                          }
                        />

                        <span
                          aria-hidden="true"
                        >
                          +
                        </span>
                      </label>
                    )}
                  </div>
                )}

                {fileError && (
                  <span
                    className={
                      styles.errorText
                    }
                  >
                    {fileError}
                  </span>
                )}
              </div>

              <div
                className={
                  styles.turnstileSection
                }
              >
                <div
                  ref={
                    turnstileContainerRef
                  }
                  className={
                    styles.turnstile
                  }
                />

                {turnstileError && (
                  <span
                    className={
                      styles.errorText
                    }
                    role="alert"
                  >
                    {turnstileError}
                  </span>
                )}
              </div>

              {submitError && (
                <div
                  className={
                    styles.submitError
                  }
                  role="alert"
                >
                  <strong>
                    {submitError.title}
                  </strong>

                  <span>
                    {submitError.message}
                  </span>

                  <a
                    href={
                      CONTACTS
                        .primaryPhone.href
                    }
                  >
                    {
                      CONTACTS
                        .primaryPhone.display
                    }
                  </a>
                </div>
              )}

              <button
                type="submit"
                className={
                  styles.submitButton
                }
                disabled={
                  isSubmitting ||
                  !turnstileToken
                }
              >
                <span>
                  {isSubmitting
                    ? "Надсилаємо..."
                    : "Надіслати заявку"}
                </span>

                {!isSubmitting && (
                  <span
                    aria-hidden="true"
                  >
                    →
                  </span>
                )}
              </button>

              <p
                className={styles.consent}
              >
                Натискаючи кнопку, ви
                погоджуєтесь з обробкою
                персональних даних для
                зв’язку щодо вашої заявки.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}