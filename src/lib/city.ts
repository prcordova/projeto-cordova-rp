import { SERVER_IP } from "./connect";

export type CityBlipType = {
  id: string;
  label: string;
  price: number;
  active?: number;
};

export type CityOrg = {
  id: string;
  name: string;
};

export type CityIdentity = {
  userId: number;
  name: string;
  orgs: { id: string; group: string }[];
};

function cityBase() {
  return (process.env.GAME_CITY_URL || `http://${SERVER_IP}:30120/cordova_orgs`).replace(/\/$/, "");
}

async function cityFetch(path: string, init?: RequestInit) {
  const headers = new Headers(init?.headers);
  const secret = process.env.GAME_DELIVER_SECRET || "";
  if (secret) headers.set("x-cordova-secret", secret);
  return fetch(`${cityBase()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
    signal: AbortSignal.timeout(5000)
  });
}

export async function cityBlipTypes(): Promise<CityBlipType[] | null> {
  try {
    const response = await cityFetch("/blips");
    if (!response.ok) return null;
    const data = await response.json();
    if (!Array.isArray(data.types)) return null;
    return data.types.map((row: { id: string; label: string; price: number | string }) => ({
      id: String(row.id),
      label: String(row.label || row.id),
      price: Number(row.price)
    }));
  } catch {
    return null;
  }
}

export async function citySetBlipPrice(id: string, price: number) {
  try {
    const response = await cityFetch("/blips/price", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, price })
    });
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok && data.ok !== false, message: String(data.message || "Não foi possível salvar o preço.") };
  } catch {
    return { ok: false, message: "A cidade não respondeu." };
  }
}

export async function cityOrgs(): Promise<CityOrg[] | null> {
  try {
    const response = await cityFetch("/orgs");
    if (!response.ok) return null;
    const data = await response.json();
    if (!Array.isArray(data.orgs)) return null;
    return data.orgs.map((row: { id: string; name: string }) => ({
      id: String(row.id),
      name: String(row.name || row.id)
    }));
  } catch {
    return null;
  }
}

export async function cityHoldOrg(org: string, userId: number) {
  try {
    const response = await cityFetch("/orgs/hold", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ org, userId })
    });
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok && data.ok !== false, message: String(data.message || "Não foi possível reservar a organização.") };
  } catch {
    return { ok: false, message: "A cidade não respondeu. Tente de novo." };
  }
}

export async function cityReleaseOrg(org: string, userId: number) {
  try {
    await cityFetch("/orgs/release", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ org, userId })
    });
  } catch {
    return;
  }
}

export async function cityIdentity(query: { discord?: string | null; user?: number }): Promise<
  { state: "ok"; identity: CityIdentity } | { state: "missing" } | { state: "offline" }
> {
  const params = new URLSearchParams();
  if (query.discord) params.set("discord", query.discord);
  if (query.user) params.set("user", String(query.user));
  if (!params.toString()) return { state: "missing" };
  try {
    const response = await cityFetch(`/identity?${params.toString()}`);
    if (response.status === 404) return { state: "missing" };
    if (!response.ok) return { state: "offline" };
    const data = await response.json();
    const userId = Number(data.userId);
    if (!userId) return { state: "missing" };
    return {
      state: "ok",
      identity: {
        userId,
        name: String(data.name || ""),
        orgs: Array.isArray(data.orgs) ? data.orgs.map((org: { id: string; group: string }) => ({
          id: String(org.id),
          group: String(org.group || "")
        })) : []
      }
    };
  } catch {
    return { state: "offline" };
  }
}
