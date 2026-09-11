import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { ProfileForm } from "./ProfileForm";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/admin/login");
  }

  const displayName =
    typeof user.user_metadata?.display_name === "string"
      ? user.user_metadata.display_name
      : "";

  return (
    <section className={styles.panel}>
      <header className={styles.header}>
        <span className={styles.eyebrow}>
          АДМІНІСТРАТОР
        </span>

        <h1>Профіль</h1>

        <p>
          Дані облікового запису для входу та роботи
          в Portfolio Manager.
        </p>
      </header>

      <ProfileForm
        initialName={displayName}
        initialEmail={user.email ?? ""}
      />
    </section>
  );
}
