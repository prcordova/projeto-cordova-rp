import { SERVER_IP } from "./connect";
import { rankingsUrl } from "./rankings";

export type CityLive = {
  online: boolean;
  players: number;
  max: number;
  startedAt: number | null;
};

function cityOrigin() {
  const rankings = process.env.GAME_RANKINGS_URL || rankingsUrl();
  try {
    const url = new URL(rankings);
    return `${url.protocol}//${url.host}`;
  } catch {
    return `http://${SERVER_IP}:30120`;
  }
}

async function readJson(url: string) {
  const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(4000) });
  if (!response.ok) return null;
  return response.json();
}

export async function loadCityLive(): Promise<CityLive> {
  const origin = cityOrigin();
  const offline = { online: false, players: 0, max: 0, startedAt: null };
  try {
    const [status, dynamic] = await Promise.all([
      readJson(`${origin}/esc_menu/status`).catch(() => null),
      readJson(`${origin}/dynamic.json`).catch(() => null)
    ]);
    const players = Number(status?.players ?? dynamic?.clients);
    if (!Number.isFinite(players)) return offline;
    const max = Number(status?.max ?? dynamic?.sv_maxclients);
    const startedAt = Number(status?.startedAt);
    return {
      online: true,
      players: Math.max(0, players),
      max: Number.isFinite(max) ? max : 0,
      startedAt: Number.isFinite(startedAt) && startedAt > 0 ? startedAt : null
    };
  } catch {
    return offline;
  }
}
