"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Configurator } from "@/components/configurator";

function BuilderInner() {
  const searchParams = useSearchParams();
  return <Configurator key={searchParams.toString()} />;
}

export function BuilderWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20 text-slate-500 text-sm">
          Loading builder…
        </div>
      }
    >
      <BuilderInner />
    </Suspense>
  );
}
