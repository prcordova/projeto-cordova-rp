import { getDb } from "./db";

export type MaintenanceMode = "off" | "once" | "daily";

export type MaintenanceSchedule = {
  mode: MaintenanceMode;
  date: string;
  start: string;
  end: string;
  note: string;
};

const empty: MaintenanceSchedule = { mode: "off", date: "", start: "11:00", end: "11:10", note: "" };

function clock(value: string) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function readSchedule(input: unknown): MaintenanceSchedule | null {
  if (!input || typeof input !== "object") return null;
  const raw = input as Partial<MaintenanceSchedule>;
  const mode = raw.mode === "once" || raw.mode === "daily" ? raw.mode : "off";
  const start = String(raw.start || "");
  const end = String(raw.end || "");
  const date = String(raw.date || "");
  const note = String(raw.note || "").trim().slice(0, 160);
  if (mode !== "off" && (!clock(start) || !clock(end))) return null;
  if (mode === "once" && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return { mode, date, start, end, note };
}

export async function loadSchedule(): Promise<MaintenanceSchedule> {
  const db = await getDb();
  const doc = await db.collection("city_settings").findOne({ key: "maintenance" });
  return readSchedule(doc) || empty;
}

export async function saveSchedule(schedule: MaintenanceSchedule) {
  const db = await getDb();
  await db.collection("city_settings").updateOne(
    { key: "maintenance" },
    { $set: { ...schedule, updatedAt: new Date() } },
    { upsert: true }
  );
}

function saoPauloNow() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(new Date());
  const pick = (type: string) => parts.find((part) => part.type === type)?.value || "";
  return {
    date: `${pick("year")}-${pick("month")}-${pick("day")}`,
    time: `${pick("hour").padStart(2, "0")}:${pick("minute").padStart(2, "0")}`
  };
}

export function maintenanceMessage(schedule: MaintenanceSchedule) {
  if (schedule.mode === "off") return null;
  if (schedule.mode === "once") {
    const now = saoPauloNow();
    if (schedule.date < now.date) return null;
    if (schedule.date === now.date && schedule.end < now.time) return null;
  }
  const when = schedule.mode === "daily"
    ? `Manutenção diária às ${schedule.start} horas`
    : `Manutenção em ${schedule.date.split("-").reverse().join("/")} às ${schedule.start} horas`;
  const lines = [
    `${when} - Horário de Brasília.`,
    `Previsão de retorno ${schedule.end}.`
  ];
  if (schedule.note) lines.push(schedule.note);
  return lines;
}
