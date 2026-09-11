"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

const LEAD_STATUSES = ["new", "in_progress", "done"] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isLeadStatus(value: string): value is LeadStatus {
  return LEAD_STATUSES.includes(value as LeadStatus);
}

function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

export async function updateLeadStatus(formData: FormData) {
  const leadId = String(formData.get("leadId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!isUuid(leadId) || !isLeadStatus(status)) {
    throw new Error("Некоректні дані для зміни статусу заявки.");
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims?.sub) {
    throw new Error("Потрібна авторизація адміністратора.");
  }

  const { data: updatedLead, error } = await supabase
    .from("leads")
    .update({ status })
    .eq("id", leadId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to update lead status:", error);
    throw new Error("Не вдалося змінити статус заявки.");
  }

  if (!updatedLead) {
    throw new Error("Заявку не знайдено або вона вже була видалена.");
  }

  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteLead(leadId: string) {
  const cleanLeadId = String(leadId ?? "").trim();

  if (!isUuid(cleanLeadId)) {
    throw new Error("Некоректний ID заявки.");
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();

  if (!claimsData?.claims?.sub) {
    throw new Error("Потрібна авторизація адміністратора.");
  }

  const { data: deletedLead, error } = await supabase
    .from("leads")
    .delete()
    .eq("id", cleanLeadId)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to delete lead:", error);
    throw new Error("Не вдалося видалити заявку.");
  }

  if (!deletedLead) {
    throw new Error("Заявку не знайдено або вона вже була видалена.");
  }

  revalidatePath("/admin/leads");
}
