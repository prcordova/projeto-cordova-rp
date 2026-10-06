"use client";

import { useEffect, useState } from "react";
import { rankBoards, rankCells, rankColumns, type RankKey, type RankPayload } from "@/lib/rankings";

const slots = 10;

export function RankBoards({ payload: given, only }: { payload?: RankPayload | null; only?: RankKey }) {
  const [payload, setPayload] = useState<RankPayload | null | undefined>(given);
  const [loading, setLoading] = useState(given === undefined);
  const [me, setMe] = useState("");

  useEffect(() => {
    if (given !== undefined) return;
    let cancel = false;
    fetch("/api/rankings")
      .then((response) => response.json())
      .then((data) => {
        if (!cancel) setPayload(data.payload || null);
      })
      .catch(() => {
        if (!cancel) setPayload(null);
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });
    return () => {
      cancel = true;
    };
  }, [given]);

  useEffect(() => {
    let cancel = false;
    fetch("/api/me/character")
      .then((response) => response.json())
      .then((data) => {
        if (!cancel && typeof data.name === "string") setMe(data.name.trim().toLocaleLowerCase("pt-BR"));
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
    };
  }, []);

  const boards = only ? rankBoards.filter((board) => board.key === only) : rankBoards;
  if (loading) {
    return <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/75">Carregando ranking...</p>;
  }
  if (!payload) {
    return <p className="rounded-2xl border border-yellow-400/30 bg-black p-5 text-white/75">O ranking da cidade não respondeu. Ele é o mesmo do menu ESC e volta quando o servidor estiver no ar.</p>;
  }
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,350px),1fr))] items-stretch gap-4">
      {boards.map((board) => {
        const rows = payload[board.key] || [];
        const cols = rankColumns(board.key);
        const count = board.key === "factions" ? Math.max(rows.length, 1) : slots;
        const template = `2.25rem minmax(0,1fr) ${cols.map((col) => col.width).join(" ")}`;
        return (
          <article key={board.key} className="flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-yellow-400/30 bg-black">
            <header className="border-b border-yellow-400/20 px-3 py-2.5 sm:px-4 sm:py-3">
              <h2 className="min-w-0 truncate text-sm font-extrabold sm:text-base">{board.title}</h2>
            </header>
            <div className="px-3 sm:px-4">
              <div className="grid items-center gap-2 border-b border-yellow-400/20 py-2 text-[10px] font-extrabold uppercase tracking-wide text-yellow-400 sm:text-xs" style={{ gridTemplateColumns: template }}>
                <span>#</span>
                <span>Nome</span>
                {cols.map((col) => <span key={col.label} className={`${col.text ? "truncate text-left" : "text-right"} last:pr-4`}>{col.label}</span>)}
              </div>
              <div className="max-h-80 overflow-x-hidden overflow-y-auto pb-2 [scrollbar-color:#facc15_#000] [scrollbar-width:thin] sm:max-h-[22.5rem] [&::-webkit-scrollbar]:w-2.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-yellow-400 [&::-webkit-scrollbar-track]:bg-black">
              {Array.from({ length: count }, (_, index) => {
                const cells = rankCells(board.key, rows[index]);
                const mine = Boolean(me) && (rows[index]?.name || "").trim().toLocaleLowerCase("pt-BR") === me;
                return (
                  <div key={`${board.key}-${index}`} className={`grid h-8 items-center gap-2 border-b border-white/10 text-xs last:border-b-0 sm:h-9 sm:text-sm ${mine ? "bg-yellow-400/15" : ""}`} style={{ gridTemplateColumns: template }}>
                    <span className={index < 3 ? "font-extrabold text-yellow-400" : "text-white/45"}>{index + 1}º</span>
                    <span className="truncate font-semibold">{rows[index]?.name || "—"}</span>
                    {cells.map((cell, cellIndex) => (
                      <span key={`${board.key}-${index}-${cols[cellIndex].label}`} className={`min-w-0 truncate tabular-nums last:pr-4 ${cols[cellIndex].text ? "text-left font-semibold text-white/80" : "text-right font-bold text-yellow-400"}`}>{cell}</span>
                    ))}
                  </div>
                );
              })}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
