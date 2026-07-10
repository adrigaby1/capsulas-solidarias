"use client";

import { useSearchParams } from "next/navigation";
import { PersonalizationForm } from "@/components/PersonalizationForm";

export function CreaClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-ink/8 bg-white/60 p-6 md:p-10">
      <PersonalizationForm sessionId={sessionId} />
    </div>
  );
}
