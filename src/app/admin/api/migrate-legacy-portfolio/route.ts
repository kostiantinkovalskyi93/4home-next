import fs from "node:fs/promises";
import path from "node:path";

import { NextResponse } from "next/server";
import sharp from "sharp";

import { portfolioProjects } from "@/data/portfolioProjects";
import { createClient } from "@/lib/supabase/server";

export const runtime="nodejs";

function mapLegacyCategory(category:string){
  if(category==="Кухні") return {category:"kitchen",wardrobe_type:null};
  if(category==="Розпашні шафи") return {category:"wardrobe",wardrobe_type:"hinged"};
  if(category==="Шафи-купе") return {category:"wardrobe",wardrobe_type:"sliding"};
  return {category:"furniture",wardrobe_type:null};
}

export async function POST(){
  const supabase=await createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Потрібна авторизація."},{status:401});

  const {data:admin}=await supabase.from("admin_users").select("user_id").eq("user_id",user.id).maybeSingle();
  if(!admin) return NextResponse.json({error:"Недостатньо прав."},{status:403});

  const report:{slug:string;status:string;photos?:number;error?:string}[]=[];

  for(const legacy of portfolioProjects){
    try{
      const mapped=mapLegacyCategory(legacy.category);
      let {data:project}=await supabase
        .from("portfolio_projects")
        .select("id")
        .eq("slug",legacy.slug)
        .maybeSingle();

      if(!project){
        const inserted=await supabase
          .from("portfolio_projects")
          .insert({
            slug:legacy.slug,
            title:legacy.title,
            category:mapped.category,
            wardrobe_type:mapped.wardrobe_type,
            short_description:"Реалізований проєкт меблів на замовлення 4HOME.",
            materials:[],
            hardware:[],
            features:null,
            year:null,
            status:"published",
            published_at:new Date().toISOString(),
            created_by:user.id,
          })
          .select("id")
          .single();
        if(inserted.error) throw inserted.error;
        project=inserted.data;
      }

      const {count}=await supabase
        .from("portfolio_media")
        .select("id",{count:"exact",head:true})
        .eq("project_id",project.id);

      if((count ?? 0)>0){
        report.push({slug:legacy.slug,status:"skipped-existing-media",photos:count ?? 0});
        continue;
      }

      let sortOrder=0;
      for(const image of legacy.images){
        const absolute=path.join(process.cwd(),"public",image.src.replace(/^\/+/,""));
        const input=await fs.readFile(absolute);
        const mediaId=crypto.randomUUID();

        // Legacy source is WebP. Keep a high-quality JPEG backup in the private originals bucket
        // so the modern crop/reprocess pipeline can manage it exactly like new CMS photos.
        const originalBuffer=await sharp(input).rotate().jpeg({quality:95,mozjpeg:true}).toBuffer();
        const galleryBuffer=await sharp(input).rotate().resize({
          width:1920,height:1920,fit:"inside",withoutEnlargement:true,
        }).webp({quality:82,effort:4}).toBuffer();
        const cardBuffer=await sharp(input).rotate().resize({
          width:1200,height:900,fit:"cover",position:"centre",
        }).webp({quality:82,effort:4}).toBuffer();

        const originalPath=`${project.id}/photos/${mediaId}.jpg`;
        const galleryPath=`${project.id}/gallery/${mediaId}.webp`;
        const cardPath=`${project.id}/card/${mediaId}-${Date.now()}-${sortOrder}.webp`;

        const originalUpload=await supabase.storage.from("portfolio-originals").upload(originalPath,originalBuffer,{
          contentType:"image/jpeg",cacheControl:"3600",upsert:false,
        });
        if(originalUpload.error) throw originalUpload.error;

        const galleryUpload=await supabase.storage.from("portfolio-public").upload(galleryPath,galleryBuffer,{
          contentType:"image/webp",cacheControl:"31536000",upsert:false,
        });
        if(galleryUpload.error) throw galleryUpload.error;

        const cardUpload=await supabase.storage.from("portfolio-public").upload(cardPath,cardBuffer,{
          contentType:"image/webp",cacheControl:"31536000",upsert:false,
        });
        if(cardUpload.error) throw cardUpload.error;

        const meta=await sharp(input).metadata();
        const row=await supabase.from("portfolio_media").insert({
          id:mediaId,
          project_id:project.id,
          media_type:"photo",
          sort_order:sortOrder,
          original_path:originalPath,
          web_path:galleryPath,
          card_path:cardPath,
          width:meta.width ?? null,
          height:meta.height ?? null,
          focal_x:0.5,
          focal_y:0.5,
          crop_zoom:1,
          is_cover:sortOrder===0,
          processing_status:"ready",
        });
        if(row.error) throw row.error;
        sortOrder++;
      }

      report.push({slug:legacy.slug,status:"imported",photos:sortOrder});
    }catch(error){
      report.push({
        slug:legacy.slug,
        status:"failed",
        error:error instanceof Error ? error.message : String(error),
      });
    }
  }

  return NextResponse.json({ok:true,report});
}
