import { MongoClient, type Db } from "mongodb";

const globalDb = globalThis as unknown as { cordovaMongo?: MongoClient };

export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI ausente");
  if (!globalDb.cordovaMongo) {
    const client = new MongoClient(uri);
    await client.connect();
    globalDb.cordovaMongo = client;
  }
  return globalDb.cordovaMongo.db(process.env.MONGODB_DB || "cordova");
}
