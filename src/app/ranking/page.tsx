import { RankBoards } from "@/components/RankBoards";

export default function RankingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold">Ranking</h1>
        <p className="max-w-3xl text-white/70">A mesma classificação do menu ESC: ricos, tempo online, facções, serviços, drift, PvP e corridas. O prêmio semanal continua sendo resgatado no jogo, com /ranking.</p>
      </div>
      <RankBoards />
    </div>
  );
}
