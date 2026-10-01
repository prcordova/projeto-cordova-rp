import { Suspense } from "react";
import { AuthForm } from "@/components/AuthForm";
import { AuthNotice } from "@/components/AuthNotice";
import Link from "next/link";

export default function EntrarPage() {
  return (
    <div className="space-y-4">
      <Suspense fallback={null}>
        <AuthNotice />
      </Suspense>
      <h1 className="text-center text-3xl font-extrabold">Entrar</h1>
      <AuthForm mode="login" />
      <p className="text-center text-sm"><Link href="/cadastro" className="text-yellow-400">Criar conta</Link> · <Link href="/recuperar" className="text-yellow-400">Esqueci a senha</Link></p>
    </div>
  );
}
