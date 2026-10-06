import { formatRankValue, rankBoards, type RankEntry, type RankKey, type RankPayload } from "@/lib/rankings";

const slots = 10;

export function RankBoards({ payload, only }: { payload: RankPayload | null; only?: RankKey }) {
  const boards = only ? rankBoards.filter((board) => board.key === only) : rankBoards;
  if (!payload) {
    return <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/75">O ranking da cidade não respondeu. Ele é o mesmo do menu ESC e volta quando o servidor estiver no ar.</p>;
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,350px),1fr))] items-stretch gap-4">
      {boards.map((board) => {
        const rows = payload[board.key] || [];
        const full = board.key === "factions";
        const count = full ? rows.length : slots;
        return (
          <article key={board.key} className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-yellow-400/30 bg-black">
            <header className="flex items-center justify-between gap-3 border-b border-yellow-400/20 px-3 py-2.5 sm:px-4 sm:py-3">
              <h2 className="min-w-0 truncate text-sm font-extrabold sm:text-base">{board.title}</h2>
              <span className="shrink-0 text-xs text-yellow-400 sm:text-sm">Troféu</span>
            </header>
            <ol className={`min-h-0 flex-1 ${full ? "max-h-80 overflow-x-hidden overflow-y-auto sm:max-h-[22.5rem]" : "grid grid-rows-10"}`}>
              {Array.from({ length: count }, (_, index) => {
                const entry: RankEntry | undefined = rows[index];
                const extra = entry?.car || entry?.sub || entry?.owner;
                return (
                  <li key={`${board.key}-${index}`} className="grid h-8 shrink-0 grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-2 border-b border-white/10 px-3 text-xs last:border-b-0 sm:h-9 sm:grid-cols-[2.75rem_minmax(0,1fr)_auto] sm:gap-3 sm:px-4 sm:text-sm">
                    <span className={index < 3 ? "font-extrabold text-yellow-400" : "text-white/45"}>{index + 1}º</span>
                    <span className="truncate font-semibold">{entry?.name || "—"}</span>
                    <span className="max-w-[45%] truncate text-right text-white/75">
                      {entry ? formatRankValue(entry) : "—"}
                      {extra ? <span className="text-white/45"> · {extra}</span> : null}
                    </span>
                  </li>
                );
              })}
            </ol>
          </article>
        );
      })}
    </div>
  );
}
