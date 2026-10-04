import { setDefaultResultOrder } from "node:dns";
import { MongoClient, type Db } from "mongodb";

try {
  setDefaultResultOrder("ipv4first");
} catch {
  // O runtime sem essa opção segue com a família pedida no cliente.
}

const globalDb = globalThis as unknown as { cordovaMongo?: MongoClient };

export function describeDbError(error: unknown) {
  const raw = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  const text = raw.replace(/mongodb(\+srv)?:\/\/\S+/gi, "[uri]");
  if (/bad auth|authentication failed/i.test(text)) return "Usuário ou senha do banco errados na MONGODB_URI. Use o usuário de Database Access, não o login do Atlas.";
  if (/ENOTFOUND|querySrv|EBADNAME/i.test(text)) return "Endereço do cluster errado na MONGODB_URI. Copie de novo em Connect → Drivers.";
  if (/scheme|Invalid connection string|URI/i.test(text)) return "MONGODB_URI fora do formato. Ela começa com mongodb+srv:// e não leva aspas nem < >.";
  if (/SSL|TLS|alert internal|tlsv1|ssl3_read/i.test(text)) return "O MongoDB recusou a conexão TLS. Liberar 0.0.0.0/0 não resolve este aviso. Confira se o cluster está ligado, sem pausa, e se a MONGODB_URI foi copiada em Connect → Drivers. Se a senha tiver @, #, / ou %, troque esses caracteres pelo código da URL.";
  if (/Server selection|ServerSelection|ReplicaSetNoPrimary|timed out|ECONNREFUSED|ETIMEDOUT/i.test(text)) return "Não foi possível conectar ao banco. Não é o Discord: o login passou e a Vercel não conseguiu falar com o MongoDB Atlas. Em Atlas → Network Access, libere 0.0.0.0/0. A Vercel não tem IP fixo.";
  return `Erro do banco: ${text.slice(0, 160)}`;
}

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI ausente");
  if (!globalDb.cordovaMongo) {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
      family: 4,
      autoSelectFamily: false
    });
    await client.connect();
    globalDb.cordovaMongo = client;
  }
  return globalDb.cordovaMongo.db(process.env.MONGODB_DB || "cordova");
}
