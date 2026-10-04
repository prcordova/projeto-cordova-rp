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
    const response = await fetch(rankingsUrl(), { next: { revalidate: 60 } });
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
