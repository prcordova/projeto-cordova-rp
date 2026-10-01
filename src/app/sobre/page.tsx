export default function SobrePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold">Sobre a cidade</h1>
      <p className="max-w-3xl text-white/75">Cordova RP é uma cidade de roleplay com economia, facções, empregos e suporte. Para entrar, use <strong className="text-yellow-400">connect 45.146.81.194</strong> no F8 do FiveM.</p>
      <section id="organizacoes" className="overflow-hidden rounded-2xl border border-yellow-400/30 bg-black">
        <img src="/imagens/organizacoes.png" alt="" className="h-56 w-full object-cover" />
        <div className="p-5">
          <h2 className="text-xl font-bold">Organizações</h2>
          <p className="mt-2 text-white/75">Facções, polícia, hospital e mecânica funcionam dentro do jogo. O painel da organização abre pelo menu ESC.</p>
        </div>
      </section>
    </div>
  );
}
