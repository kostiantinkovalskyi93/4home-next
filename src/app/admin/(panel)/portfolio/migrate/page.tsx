"use client";

import { useState } from "react";
import Link from "next/link";

export default function MigrateLegacyPortfolioPage(){
  const [state,setState]=useState("Готово до імпорту.");
  const [busy,setBusy]=useState(false);

  const run=async()=>{
    setBusy(true); setState("Імпортуємо старі роботи та фото…");
    try{
      const response=await fetch("/admin/api/migrate-legacy-portfolio",{method:"POST"});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error ?? "Помилка імпорту");
      setState(JSON.stringify(data.report,null,2));
    }catch(error){
      setState(error instanceof Error ? error.message : "Помилка імпорту");
    }finally{setBusy(false);}
  };

  return <div style={{maxWidth:900,padding:"32px"}}>
    <Link href="/admin/portfolio">← Портфоліо</Link>
    <h1>Імпорт старого Portfolio</h1>
    <p>Одноразово переносить 9 старих робіт та їхні фото в Supabase. Повторний запуск не дублює медіа існуючих проєктів.</p>
    <button type="button" onClick={run} disabled={busy}
      style={{padding:"12px 18px",border:0,borderRadius:10,cursor:"pointer"}}>
      {busy ? "Імпортуємо…" : "Імпортувати 9 робіт"}
    </button>
    <pre style={{whiteSpace:"pre-wrap",marginTop:24,padding:18,background:"#f3f0ec",borderRadius:12}}>{state}</pre>
  </div>;
}
