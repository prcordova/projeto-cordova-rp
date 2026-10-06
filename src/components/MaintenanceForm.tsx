"use client";

import { useEffect, useState } from "react";

type Schedule = {
  mode: "off" | "once" | "daily";
  date: string;
  start: string;
  end: string;
  note: string;
};

const initial: Schedule = { mode: "off", date: "", start: "11:00", end: "11:10", note: "" };

export function MaintenanceForm() {
  const [schedule, setSchedule] = useState<Schedule>(initial);
  const [message, setMessage] = useState("Carregando manutenção.");

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/maintenance")
      .then((response) => response.json())
      .then((data) => {
        if (!alive) return;
        if (data.schedule) setSchedule({ ...initial, ...data.schedule });
        setMessage(data.ok ? "Um dia aparece só nessa data. Diária aparece todo dia, no horário de Brasília." : (data.message || "Não foi possível ler a manutenção."));
      })
      .catch(() => {
        if (alive) setMessage("Não foi possível ler a manutenção.");
      });
    return () => {
      alive = false;
    };
  }, []);

  function set<K extends keyof Schedule>(key: K, value: Schedule[K]) {
    setSchedule((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setMessage("Salvando...");
    const response = await fetch("/api/admin/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(schedule)
    });
    const data = await response.json().catch(() => ({}));
    setMessage(data.message || "Não foi possível salvar a manutenção.");
  }

  return (
    <div className="max-w-xl space-y-4 rounded-2xl border border-yellow-400/30 bg-black p-5">
      <label className="block text-sm font-semibold">
        Modo
        <select className="mt-1 w-full rounded-xl border border-yellow-400/40 bg-black px-3 py-2 font-normal" value={schedule.mode} onChange={(event) => set("mode", event.target.value as Schedule["mode"])}>
          <option value="off">Sem manutenção</option>
          <option value="once">Agendar um dia</option>
          <option value="daily">Diária, todo dia</option>
        </select>
      </label>
      {schedule.mode === "once" ? (
        <label className="block text-sm font-semibold">
          Data
          <input type="date" className="mt-1 w-full rounded-xl border border-yellow-400/40 bg-black px-3 py-2 font-normal" value={schedule.date} onChange={(event) => set("date", event.target.value)} />
        </label>
      ) : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm font-semibold">
          Começa
          <input type="time" className="mt-1 w-full rounded-xl border border-yellow-400/40 bg-black px-3 py-2 font-normal" value={schedule.start} onChange={(event) => set("start", event.target.value)} />
        </label>
        <label className="block text-sm font-semibold">
          Previsão de retorno
          <input type="time" className="mt-1 w-full rounded-xl border border-yellow-400/40 bg-black px-3 py-2 font-normal" value={schedule.end} onChange={(event) => set("end", event.target.value)} />
        </label>
      </div>
      <label className="block text-sm font-semibold">
        Texto extra
        <input className="mt-1 w-full rounded-xl border border-yellow-400/40 bg-black px-3 py-2 font-normal" value={schedule.note} maxLength={160} placeholder="Reset planejado para limpeza." onChange={(event) => set("note", event.target.value)} />
      </label>
      <button type="button" className="rounded-xl bg-yellow-400 px-4 py-2 font-bold text-black" onClick={save}>Salvar</button>
      <p className="text-sm text-white/70">{message}</p>
    </div>
  );
}
