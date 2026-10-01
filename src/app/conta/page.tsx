import { readSession } from "@/lib/session";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ContaPage() {
  const user = await readSession();
  if (!user) {
    return <p>Entre para ver sua conta. <Link href="/entrar" className="text-yellow-400">Entrar</Link></p>;
  }
  return (
    <div className="space-y-3 rounded-2xl border border-yellow-400/30 bg-black p-6">
      <h1 className="text-3xl font-extrabold">{user.name}</h1>
      <p>{user.email}</p>
      <p className="text-yellow-400">{user.emailVerified ? "E-mail confirmado." : "Confirme o e-mail para comprar."}</p>
      <form action="/api/auth/logout" method="post"><button className="rounded-xl border border-yellow-400 px-4 py-2">Sair</button></form>
    </div>
  );
}
