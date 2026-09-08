import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { AdminShell } from "../components/AdminShell";

type AdminPanelLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function AdminPanelLayout({
  children,
}: AdminPanelLayoutProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/admin/login");
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !admin) {
    await supabase.auth.signOut();

    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}