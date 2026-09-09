import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {ProjectDetail} from "@/components/portfolio/ProjectDetail";
import {getPublishedPortfolioProject} from "@/lib/portfolio-db";

type Props={params:Promise<{slug:string}>};
export const dynamic="force-dynamic";

export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params; const project=await getPublishedPortfolioProject(slug);
 if(!project)return {title:"Проєкт не знайдено",robots:{index:false,follow:false}};
 const description=project.shortDescription || `${project.title}. Реалізований проєкт меблів на замовлення 4HOME.`;
 return {title:`${project.title} — портфоліо`,description,alternates:{canonical:`/portfolio/${project.slug}`},
 openGraph:{type:"article",title:`${project.title} — портфоліо 4HOME`,description,images:[{url:project.coverImage,alt:project.title}]},
 twitter:{card:"summary_large_image",title:`${project.title} — портфоліо 4HOME`,description,images:[project.coverImage]}};
}

export default async function Page({params}:Props){
 const {slug}=await params; const project=await getPublishedPortfolioProject(slug); if(!project)notFound();
 return <ProjectDetail project={project}/>;
}
