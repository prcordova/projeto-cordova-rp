import { Suspense } from "react";
import { AuthNotice } from "@/components/AuthNotice";

const reasons = [
  "A whitelist da cidade abre no Discord.",
  "O painel da loja reconhece o ID do Discord de quem entra.",
  "A conta do site é a mesma da comunidade, sem senha à parte."
];

export default function EntrarPage() {
  return (
    <section className="relative left-1/2 -mb-8 -mt-8 ml-[-50vw] grid w-screen max-w-[100vw] min-h-[calc(100dvh-4.5rem)] grid-rows-[minmax(12rem,42svh)_auto] md:grid-cols-2 md:grid-rows-1">
      <div className="relative min-h-48">
        <img src="/imagens/organizacoes.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="flex items-center justify-center bg-black px-6 py-10">
        <div className="w-full max-w-md space-y-6">
          <Suspense fallback={null}>
            <AuthNotice />
          </Suspense>
          <div>
            <p className="text-sm font-bold tracking-widest text-yellow-400">CORDOVA RP</p>
            <h1 className="mt-2 text-4xl font-extrabold">Entrar</h1>
            <p className="mt-3 text-white/75">A entrada do site é pelo Discord. É a mesma conta usada na whitelist e no painel da cidade.</p>
          </div>
          <ul className="space-y-2 text-sm text-white/80">
            {reasons.map((reason) => <li key={reason}>• {reason}</li>)}
          </ul>
          <a href="/api/auth/discord" className="flex items-center justify-center gap-3 rounded-xl bg-[#5865F2] px-4 py-3 text-lg font-bold text-white">
            <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden="true" fill="currentColor">
              <path d="M19.27 5.33A17.4 17.4 0 0 0 15.09 4l-.43.8a16.1 16.1 0 0 1 4.07 1.3 16.6 16.6 0 0 0-13.46 0A16.5 16.5 0 0 1 9.34 4.8L8.91 4a17.5 17.5 0 0 0-4.18 1.33C2.16 9.04 1.4 12.65 1.63 16.22A17.6 17.6 0 0 0 7 18.68l.87-1.16a11.5 11.5 0 0 1-1.74-.84l.43-.33c3.35 1.55 6.98 1.55 10.28 0l.43.33c-.55.34-1.13.63-1.74.84l.87 1.16a17.5 17.5 0 0 0 5.37-2.46c.3-4.08-.5-7.66-2.5-10.89ZM8.68 14.27c-.99 0-1.8-.92-1.8-2.04s.79-2.04 1.8-2.04 1.82.92 1.8 2.04c0 1.12-.79 2.04-1.8 2.04Zm6.64 0c-.99 0-1.8-.92-1.8-2.04s.79-2.04 1.8-2.04 1.82.92 1.8 2.04c0 1.12-.79 2.04-1.8 2.04Z" />
            </svg>
            Entrar com Discord
          </a>
        </div>
      </div>
    </section>
  );
}
