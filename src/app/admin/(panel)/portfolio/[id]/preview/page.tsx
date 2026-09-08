import Link from "next/link";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import styles from "@/app/(site)/portfolio/[slug]/page.module.css";
import { ProjectGallery } from "@/app/(site)/portfolio/[slug]/ProjectGallery";

type Props={params:Promise<{id:string}>};

export const dynamic="force-dynamic";

export default async function AdminPortfolioPreview({params}:Props){
  const {id}=await params;
  const supabase=await createClient();

  const {data:project}=await supabase
    .from("portfolio_projects")
    .select("id,title,category,wardrobe_type")
    .eq("id",id)
    .maybeSingle();

  if(!project) notFound();

  const {data:media}=await supabase
    .from("portfolio_media")
    .select("id,web_path,sort_order,processing_status")
    .eq("project_id",id)
    .eq("media_type","photo")
    .eq("processing_status","ready")
    .order("sort_order",{ascending:true});

  const images=(media ?? [])
    .filter((item)=>item.web_path)
    .map((item,index)=>({
      src:supabase.storage.from("portfolio-public").getPublicUrl(item.web_path!).data.publicUrl,
      alt:index===0 ? `${project.title} — 4HOME` : `${project.title} — фото ${index+1}`,
    }));

  const category =
    project.category==="kitchen" ? "Кухні" :
    project.category==="furniture" ? "Інші меблі" :
    project.wardrobe_type==="sliding" ? "Шафи-купе" : "Розпашні шафи";

  return (
    <main>
      <section className={styles.hero}>
        <div className={`container ${styles.pageContainer}`}>
          <nav className={styles.breadcrumbs}>
            <Link href={`/admin/portfolio/${id}/edit`}>← До редагування</Link>
            <span>/</span>
            <span>Попередній перегляд</span>
          </nav>
          <div className={styles.heroTop}>
            <p className={styles.eyebrow}>{category}</p>
            <div className={styles.projectIndex}><span>PREVIEW</span><span>DRAFT</span></div>
          </div>
          <div className={styles.heroMain}>
            <h1 className={styles.title}>{project.title}</h1>
            <div className={styles.heroMeta}><span>4HOME</span><span>PREVIEW</span><span>KYIV</span></div>
          </div>
        </div>
      </section>
      <section className={styles.gallery}>
        {images.length ? <ProjectGallery images={images} /> : (
          <div className="container" style={{padding:"64px 0"}}>Немає готових фото для перегляду.</div>
        )}
      </section>
    </main>
  );
}
