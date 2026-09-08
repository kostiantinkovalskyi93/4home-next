import type { Metadata } from "next";

import { LeadForm } from "@/components/forms/LeadForm";

export const metadata: Metadata = {
  title: "Контакти та розрахунок вартості",
  description:
    "Залиште заявку на виготовлення меблів на замовлення у Києві. Опишіть проєкт, вкажіть орієнтовні розміри та додайте фото або ескіз.",
  alternates: {
    canonical: "/contacts",
  },
};

export default function ContactsPage() {
  return (
    <main>
      <LeadForm />
    </main>
  );
}