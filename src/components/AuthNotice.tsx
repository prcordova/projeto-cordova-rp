"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { showErrorToast } from "@/components/toast";

export function AuthNotice() {
  const params = useSearchParams();
  const aviso = params.get("aviso");

  useEffect(() => {
    if (!aviso) return;
    showErrorToast(aviso);
    window.history.replaceState(null, "", "/entrar");
  }, [aviso]);

  return null;
}
