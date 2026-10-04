import { formatRankValue, rankBoards, type RankKey, type RankPayload } from "@/lib/rankings";

export function RankBoards({ payload, only }: { payload: RankPayload | null; only?: RankKey }) {
  const boards = only ? rankBoards.filter((board) => board.key === only) : rankBoards;
  if (!payload) {
    return <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/75">O ranking da cidade não respondeu. Ele é o mesmo do menu ESC e volta quando o servidor estiver no ar.</p>;
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {boards.map((board) => {
        const rows = payload[board.key] || [];
        return (
          <article key={board.key} className="overflow-hidden rounded-2xl border border-yellow-400/30 bg-black">
            <header className="flex items-center justify-between border-b border-yellow-400/20 px-4 py-3">
              <h2 className="text-lg font-extrabold">{board.title}</h2>
              <span className="text-yellow-400">Troféu</span>
            </header>
            {rows.length ? (
              <ol className="divide-y divide-white/10">
                {rows.slice(0, 10).map((entry, index) => (
                  <li key={`${board.key}-${index}`} className="grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-3 px-4 py-2 text-sm">
                    <span className={index < 3 ? "font-extrabold text-yellow-400" : "text-white/60"}>{index + 1}º</span>
                    <span className="truncate font-semibold">{entry.name || "—"}</span>
                    <span className="text-right text-white/80">
                      {formatRankValue(entry)}
                      {entry.car || entry.sub ? <span className="mt-0.5 block text-xs text-white/50">{entry.car || entry.sub}</span> : null}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="px-4 py-6 text-sm text-white/60">Sem dados</p>
            )}
          </article>
        );
      })}
    </div>
  );
}
