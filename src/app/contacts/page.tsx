import type { Metadata } from "next";

import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Контакти та розрахунок вартості | 4HOME",
  description:
    "Залиште заявку на виготовлення меблів на замовлення у Києві. Опишіть проєкт, вкажіть орієнтовні розміри та додайте фото або ескіз.",
};

export default function ContactsPage() {
  return (
    <main>
      <LeadForm />
    </main>
  );
}