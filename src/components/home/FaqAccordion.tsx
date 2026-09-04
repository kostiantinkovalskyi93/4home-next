"use client";

import { useEffect, useRef, useState } from "react";

import styles from "@/app/page.module.css";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqAccordionProps = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openIndex === null) {
      return;
    }

    function handleOutsideClick(event: PointerEvent) {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (!faqRef.current?.contains(target)) {
        setOpenIndex(null);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, [openIndex]);

  function toggleItem(index: number) {
    setOpenIndex((currentIndex) =>
      currentIndex === index ? null : index,
    );
  }

  return (
    <div ref={faqRef} className={styles.faqList}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const answerId = `faq-answer-${index}`;

        return (
          <article
            key={item.question}
            className={`${styles.faqItem} ${
              isOpen ? styles.faqItemOpen : ""
            }`}
          >
            <button
              type="button"
              className={styles.faqQuestion}
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => toggleItem(index)}
            >
              <span className={styles.faqNumber}>
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className={styles.faqQuestionText}>
                {item.question}
              </span>

              <span
                className={`${styles.faqIcon} ${
                  isOpen ? styles.faqIconOpen : ""
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>

            <div
              id={answerId}
              className={`${styles.faqAnswerWrapper} ${
                isOpen ? styles.faqAnswerWrapperOpen : ""
              }`}
            >
              <div className={styles.faqAnswer}>
                <p>{item.answer}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}