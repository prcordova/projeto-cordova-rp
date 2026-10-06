"use client";

import { useEffect, useState } from "react";

type Status = {
  online: boolean;
  players: number;
  max: number;
  startedAt: number | null;
  maintenance: string[] | null;
};

function resetLabel(startedAt: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(startedAt * 1000));
}

export function CityStatus() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/city-status")
      .then((response) => response.json())
      .then((data) => {
        if (alive) setStatus(data);
      })
      .catch(() => {
        if (alive) setStatus({ online: false, players: 0, max: 0, startedAt: null, maintenance: null });
      });
    return () => {
      alive = false;
    };
  }, []);

  if (!status) {
    return (
      <aside className="rounded-2xl border border-yellow-400/40 bg-black p-4 text-sm">
        <p className="font-semibold text-white/70">Consultando a cidade...</p>
      </aside>
    );
  }
  const online = status.online;
  return (
    <aside className="rounded-2xl border border-yellow-400/40 bg-black p-4 text-sm">
      <p className={`text-lg font-extrabold tracking-wide ${online ? "text-yellow-400" : "text-white/70"}`}>
        {online ? "ONLINE" : "OFFLINE"}
      </p>
      <p className="mt-1 font-semibold">{online ? `${status.players} pessoas` : "Cidade desligada"}</p>
      <p className="mt-3 text-white/70">
        Último reset: {status.startedAt ? resetLabel(status.startedAt) : online ? "ainda não informado pela cidade" : "sem resposta da cidade"}
      </p>
      {status?.maintenance?.length ? (
        <div className="mt-4 space-y-1 border-t border-yellow-400/30 pt-3 text-white/80">
          {status.maintenance.map((line) => <p key={line}>{line}</p>)}
        </div>
      ) : null}
    </aside>
  );
}
