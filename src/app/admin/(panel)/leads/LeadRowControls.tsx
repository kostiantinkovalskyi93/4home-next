"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";

import {
  deleteLead,
  updateLeadStatus,
} from "./actions";

import styles from "./LeadRowControls.module.css";

type LeadStatus = "new" | "in_progress" | "done";

type LeadStatusMenuProps = {
  leadId: string;
  leadName: string;
  status: LeadStatus;
};

type LeadActionsMenuProps = {
  leadId: string;
  name: string;
  phone: string;
  furnitureType: string | null;
  dimensions: string | null;
  comment: string | null;
};


const statusOptions: Array<{
  value: LeadStatus;
  label: string;
}> = [
  { value: "new", label: "Нова" },
  { value: "in_progress", label: "В роботі" },
  { value: "done", label: "Опрацьовано" },
];

function ChevronIcon({
  open,
}: {
  open: boolean;
}) {
  return (
    <svg
      className={`${styles.chevron} ${
        open ? styles.chevronOpen : ""
      }`}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="m7 10 5 5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="5" r="1.6" fill="currentColor" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" />
      <circle cx="12" cy="19" r="1.6" fill="currentColor" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 4h4l2 5-2.5 1.7a15.2 15.2 0 0 0 4.8 4.8L15 13l5 2v4c0 .6-.4 1-1 1C10.7 20 4 13.3 4 5c0-.6.4-1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="8" y="8" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13M10 11v5M14 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function usePopoverState() {
  const [open, setOpen] = useState(false);

  const hide = useCallback(() => {
    setOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setOpen((value) => !value);
  }, []);

  return {
    open,
    hide,
    toggle,
  };
}

export function LeadStatusMenu({
  leadId,
  leadName,
  status,
}: LeadStatusMenuProps) {
  const router = useRouter();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [currentStatus, setCurrentStatus] =
    useState<LeadStatus>(status);
  const [isPending, startTransition] =
    useTransition();
  const {
    open: isStatusMenuOpen,
    hide: hideStatusMenu,
    toggle: toggleStatusMenu,
  } = usePopoverState();

  useEffect(() => {
    if (!isStatusMenuOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        hideStatusMenu();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        hideStatusMenu();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isStatusMenuOpen, hideStatusMenu]);

  const currentLabel =
    statusOptions.find(
      (item) => item.value === currentStatus,
    )?.label ?? "Статус";

  const handleSelect = (nextStatus: LeadStatus) => {
    if (
      nextStatus === currentStatus ||
      isPending
    ) {
      hideStatusMenu();
      return;
    }

    const previousStatus = currentStatus;
    setCurrentStatus(nextStatus);
    hideStatusMenu();

    startTransition(async () => {
      const formData = new FormData();
      formData.set("leadId", leadId);
      formData.set("status", nextStatus);

      try {
        await updateLeadStatus(formData);
        router.refresh();
      } catch (error) {
        console.error(
          "Failed to update lead status:",
          error,
        );
        setCurrentStatus(previousStatus);
      }
    });
  };

  return (
    <div
      ref={rootRef}
      className={styles.statusControl}
    >
      <button
        type="button"
        className={`${styles.statusTrigger} ${
          styles[`status_${currentStatus}`]
        }`}
        onClick={toggleStatusMenu}
        aria-haspopup="menu"
        aria-expanded={isStatusMenuOpen}
        aria-controls={menuId}
        aria-label={`Змінити статус заявки від ${leadName}`}
        disabled={isPending}
      >
        <span>{currentLabel}</span>
        <ChevronIcon open={isStatusMenuOpen} />
      </button>

      <div
        id={menuId}
        className={`${styles.statusMenu} ${
          isStatusMenuOpen
            ? styles.popoverOpen
            : styles.popoverClosed
        }`}
        role="menu"
        aria-hidden={!isStatusMenuOpen}
        aria-label={`Статус заявки від ${leadName}`}
      >
        {statusOptions.map((option) => {
          const selected =
            option.value === currentStatus;

          return (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={selected}
              tabIndex={isStatusMenuOpen ? 0 : -1}
              className={`${styles.statusOption} ${
                styles[`option_${option.value}`]
              }`}
              onClick={() =>
                handleSelect(option.value)
              }
            >
              <span
                className={`${styles.statusDot} ${
                  styles[`dot_${option.value}`]
                }`}
                aria-hidden="true"
              />
              <span>{option.label}</span>
              <span className={styles.optionCheck}>
                {selected ? <CheckIcon /> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function LeadActionsMenu({
  leadId,
  name,
  phone,
  furnitureType,
  dimensions,
  comment,
}: LeadActionsMenuProps) {
  const router = useRouter();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const {
    open: isActionsMenuOpen,
    hide: hideActionsMenu,
    toggle: toggleActionsMenu,
  } = usePopoverState();
  const [copyState, setCopyState] = useState<
    "idle" | "phone" | "lead"
  >("idle");
  const [confirmDelete, setConfirmDelete] =
    useState(false);
  const [isPending, startTransition] =
    useTransition();

  useEffect(() => {
    if (!isActionsMenuOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        hideActionsMenu();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (confirmDelete) {
          setConfirmDelete(false);
        } else {
          hideActionsMenu();
        }
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isActionsMenuOpen, confirmDelete, hideActionsMenu]);

  useEffect(() => {
    if (copyState === "idle") {
      return;
    }

    const timer = setTimeout(
      () => setCopyState("idle"),
      1400,
    );

    return () => clearTimeout(timer);
  }, [copyState]);

  const copyText = async (
    value: string,
    kind: "phone" | "lead",
  ) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopyState(kind);
    } catch (error) {
      console.error("Clipboard error:", error);
    }
  };

  const leadText = [
    `Ім’я: ${name}`,
    `Телефон: ${phone}`,
    `Що потрібно: ${furnitureType || "Не вказано"}`,
    `Розміри: ${dimensions || "Не вказано"}`,
    `Коментар: ${comment || "Без коментаря"}`,
  ].join("\n");

  const handleDelete = () => {
    if (isPending) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteLead(leadId);
        setConfirmDelete(false);
        hideActionsMenu();
        router.refresh();
      } catch (error) {
        console.error(
          "Failed to delete lead:",
          error,
        );
      }
    });
  };

  return (
    <div
      ref={rootRef}
      className={styles.actionsControl}
    >
      <button
        type="button"
        className={styles.moreButton}
        onClick={toggleActionsMenu}
        aria-haspopup="menu"
        aria-expanded={isActionsMenuOpen}
        aria-controls={menuId}
        aria-label={`Додаткові дії для заявки від ${name}`}
      >
        <MoreIcon />
      </button>

      <div
        id={menuId}
        className={`${styles.actionsMenu} ${
          isActionsMenuOpen
            ? styles.popoverOpen
            : styles.popoverClosed
        }`}
        role="menu"
        aria-hidden={!isActionsMenuOpen}
        aria-label={`Дії із заявкою від ${name}`}
      >
        <a
          className={styles.actionItem}
          role="menuitem"
          tabIndex={isActionsMenuOpen ? 0 : -1}
          href={`tel:${phone.replace(/\s+/g, "")}`}
        >
          <PhoneIcon />
          <span>Подзвонити</span>
        </a>

        <button
          type="button"
          className={styles.actionItem}
          role="menuitem"
          tabIndex={isActionsMenuOpen ? 0 : -1}
          onClick={() =>
            copyText(phone, "phone")
          }
        >
          <CopyIcon />
          <span>
            {copyState === "phone"
              ? "Номер скопійовано"
              : "Скопіювати номер"}
          </span>
        </button>

        <button
          type="button"
          className={styles.actionItem}
          role="menuitem"
          tabIndex={isActionsMenuOpen ? 0 : -1}
          onClick={() =>
            copyText(leadText, "lead")
          }
        >
          <CopyIcon />
          <span>
            {copyState === "lead"
              ? "Дані скопійовано"
              : "Скопіювати дані"}
          </span>
        </button>

        <div
          className={styles.menuDivider}
          aria-hidden="true"
        />

        {confirmDelete ? (
          <div
            className={styles.deleteConfirm}
            role="group"
            aria-label="Підтвердження видалення"
          >
            <strong>Видалити заявку?</strong>
            <span>Цю дію не можна скасувати.</span>

            <div className={styles.confirmActions}>
              <button
                type="button"
                onClick={() =>
                  setConfirmDelete(false)
                }
                disabled={isPending}
                tabIndex={isActionsMenuOpen ? 0 : -1}
              >
                Скасувати
              </button>
              <button
                type="button"
                className={styles.confirmDeleteButton}
                onClick={handleDelete}
                disabled={isPending}
                tabIndex={isActionsMenuOpen ? 0 : -1}
              >
                {isPending
                  ? "Видалення..."
                  : "Видалити"}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className={`${styles.actionItem} ${styles.deleteItem}`}
            role="menuitem"
            tabIndex={isActionsMenuOpen ? 0 : -1}
            onClick={() =>
              setConfirmDelete(true)
            }
          >
            <TrashIcon />
            <span>Видалити</span>
          </button>
        )}
      </div>
    </div>
  );
}
