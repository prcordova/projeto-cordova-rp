import { SERVER_IP } from "./connect";

export const rankBoards = [
  { key: "rich", title: "Top ricos" },
  { key: "online", title: "Top online" },
  { key: "factions", title: "Top facções" },
  { key: "services", title: "Top serviços" },
  { key: "drift", title: "Top Drift" },
  { key: "pvp", title: "Top PvP" },
  { key: "king", title: "Seja o rei" },
  { key: "deathrace", title: "Corrida mortal" },
  { key: "laststanding", title: "Último sobrevivente" },
  { key: "drag", title: "Arrancada carros" },
  { key: "dragtrucks", title: "Arrancada caminhão" },
  { key: "dragwins", title: "Vitórias arrancada carro" },
  { key: "dragtruckswins", title: "Vitória arrancada caminhão" }
] as const;

export type RankKey = (typeof rankBoards)[number]["key"];

export type RankEntry = {
  name?: string;
  value?: string | number;
  kind?: string;
  car?: string;
  sub?: string;
  owner?: string;
};

export type RankPayload = Partial<Record<RankKey, RankEntry[]>>;

function asRows(value: unknown): RankEntry[] {
  if (Array.isArray(value)) return value.filter((row) => row && typeof row === "object") as RankEntry[];
  if (value && typeof value === "object") {
    return Object.keys(value)
      .sort((a, b) => Number(a) - Number(b))
      .map((key) => (value as Record<string, RankEntry>)[key])
      .filter((row) => row && typeof row === "object");
  }
  return [];
}

export function rankingsUrl() {
  return process.env.GAME_RANKINGS_URL || `http://${SERVER_IP}:30120/esc_menu/rankings`;
}

export async function loadRankings(): Promise<RankPayload | null> {
  try {
    const response = await fetch(rankingsUrl(), { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || typeof data !== "object") return null;
    const payload: RankPayload = {};
    for (const board of rankBoards) {
      payload[board.key] = asRows(data[board.key]);
    }
    return payload;
  } catch {
    return null;
  }
}

export type RankColumn = { label: string; width: string; text?: boolean };

const columns: Record<RankKey, RankColumn[]> = {
  rich: [{ label: "R$", width: "7.5rem" }],
  online: [{ label: "Hrs", width: "3.25rem" }, { label: "Min", width: "3.25rem" }],
  factions: [{ label: "R$", width: "7.5rem" }, { label: "Dono", width: "7rem", text: true }],
  services: [{ label: "Nota", width: "3.5rem" }],
  drift: [{ label: "Pts", width: "5.5rem" }, { label: "Mult", width: "3.5rem" }, { label: "Carro", width: "6.5rem", text: true }],
  pvp: [{ label: "Abates", width: "4.5rem" }, { label: "Mortes", width: "4.5rem" }],
  king: [{ label: "Vitórias", width: "4.75rem" }],
  deathrace: [{ label: "Vitórias", width: "4.75rem" }],
  laststanding: [{ label: "Vitórias", width: "4.75rem" }],
  drag: [{ label: "Tempo", width: "4.5rem" }, { label: "km/h", width: "3.75rem" }, { label: "Carro", width: "6.5rem", text: true }],
  dragtrucks: [{ label: "Tempo", width: "4.5rem" }, { label: "km/h", width: "3.75rem" }, { label: "Carro", width: "6.5rem", text: true }],
  dragwins: [{ label: "Vitórias", width: "4.75rem" }],
  dragtruckswins: [{ label: "Vitórias", width: "4.75rem" }]
};

export function rankColumns(key: RankKey) {
  return columns[key];
}

function groupedNumber(value: unknown) {
  const amount = Number(String(value ?? "").replace(/\D/g, "")) || 0;
  return amount.toLocaleString("pt-BR");
}

function firstNumber(value: unknown) {
  const match = String(value ?? "").match(/\d[\d.]*/);
  if (!match) return "—";
  const amount = Number(match[0].replace(/\./g, ""));
  return Number.isFinite(amount) ? amount.toLocaleString("pt-BR") : "—";
}

export function rankCells(key: RankKey, entry?: RankEntry) {
  const blank = columns[key].map(() => "—");
  if (!entry) return blank;
  if (key === "rich") return [groupedNumber(entry.value)];
  if (key === "factions") return [groupedNumber(entry.value), entry.owner || entry.sub || "—"];
  if (key === "online") {
    const text = String(entry.value ?? "");
    const hours = text.match(/(\d+)\s*Hrs/i);
    const mins = text.match(/(\d+)\s*Min/i);
    if (hours || mins) return [hours?.[1] ?? "0", mins?.[1] ?? "0"];
    return [text || "—", "—"];
  }
  if (key === "services") {
    const score = Number(entry.value);
    return [Number.isFinite(score) ? score.toFixed(1).replace(".", ",") : "0,0"];
  }
  if (key === "drift") {
    const [points, mult] = String(entry.value ?? "").split("·").map((part) => part.trim());
    return [(points || "").replace(/\s*pts\s*$/i, "") || "—", (mult || "").replace(/x$/i, "") || "—", entry.car || "—"];
  }
  if (key === "pvp") return [firstNumber(entry.value), firstNumber(entry.sub)];
  if (key === "drag" || key === "dragtrucks") {
    const car = String(entry.car || "");
    const speed = car.match(/(\d+)\s*km\/h/i);
    const vehicle = car.replace(/\d+\s*km\/h\s*·?\s*/i, "").trim();
    return [String(entry.value || "—"), speed?.[1] ?? "—", vehicle || "—"];
  }
  return [firstNumber(entry.value)];
}

export function formatRankValue(entry: RankEntry) {
  if (entry.kind === "money") {
    const amount = Number(String(entry.value ?? "").replace(/\D/g, "")) || 0;
    return `R$ ${amount.toLocaleString("pt-BR")}`;
  }
  if (entry.kind === "likes") {
    const amount = Number(String(entry.value ?? "").replace(/\D/g, "")) || 0;
    return `${amount.toLocaleString("pt-BR")} Curtidas`;
  }
  if (entry.kind === "stars") {
    const score = Number(entry.value);
    const text = Number.isFinite(score) ? score.toFixed(1).replace(".", ",") : "0,0";
    return `${text} ★`;
  }
  return String(entry.value ?? "");
}
