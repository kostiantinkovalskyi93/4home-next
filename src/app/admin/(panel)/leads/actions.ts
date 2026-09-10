"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

const LEAD_STATUSES = ["new", "in_progress", "done"] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];

function isLeadStatus(value: string): value is LeadStatus {
  return LEAD_STATUSES.includes(value as LeadStatus);
}

export async function updateLeadStatus(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!leadId || !isLeadStatus(status)) {
    throw new Error("Некоректні дані для зміни статусу заявки.");
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims?.sub) {
    throw new Error("Потрібна авторизація адміністратора.");
  }

  const { error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId);

  if (error) {
    console.error("Failed to update lead status:", error);
    throw new Error("Не вдалося змінити статус заявки.");
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteLead(leadId: string) {
  const cleanLeadId = String(leadId ?? "").trim();

  if (!cleanLeadId) {
    throw new Error("Некоректний ID заявки.");
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims?.sub) {
    throw new Error("Потрібна авторизація адміністратора.");
  }

  const { error } = await supabase
    .from("leads")
    .delete()
    .eq("id", cleanLeadId);

  if (error) {
    console.error("Failed to delete lead:", error);
    throw new Error("Не вдалося видалити заявку.");
  }

  revalidatePath("/admin/leads");
}
