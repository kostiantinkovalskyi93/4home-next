import {notFound} from "next/navigation";
import {ProjectDetail} from "@/components/portfolio/ProjectDetail";
import {createClient} from "@/lib/supabase/server";

type Props={params:Promise<{id:string}>};
export const dynamic="force-dynamic";
const specs=(v:unknown)=>Array.isArray(v)?v.filter((x):x is {label:string;value:string}=>!!x&&typeof x==="object"&&"label" in x&&"value" in x).map(x=>({label:String(x.label),value:String(x.value)})):[];
export default async function Preview({params}:Props){
 const {id}=await params; const s=await createClient();
 const {data:p}=await s.from("portfolio_projects").select("id,title,category,wardrobe_type,short_description,materials,hardware,features,year,location,color,production_term").eq("id",id).maybeSingle();
 if(!p)notFound();
 const {data:m}=await s.from("portfolio_media").select("id,web_path,sort_order").eq("project_id",id).eq("media_type","photo").eq("processing_status","ready").order("sort_order");
 const images=(m??[]).filter(x=>x.web_path).map((x,i)=>({src:s.storage.from("portfolio-public").getPublicUrl(x.web_path!).data.publicUrl,alt:`${p.title} — фото ${i+1}`}));
 const category=p.category==="kitchen"?"Кухні":p.category==="furniture"?"Інші меблі":p.wardrobe_type==="sliding"?"Шафа-купе":"Розпашна шафа";
 return <ProjectDetail preview editHref={`/admin/portfolio/${id}/edit`} project={{title:p.title,category,shortDescription:p.short_description,materials:specs(p.materials),hardware:specs(p.hardware),features:p.features,year:p.year,location:p.location,color:p.color,productionTerm:p.production_term,images}}/>;
}
