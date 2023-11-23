import { MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.NEXT_PUBLIC_MONGO_DB_URL || "";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 100,
  wtimeoutMS: 5000,
});

export async function connectToDatabase() {
  await client.connect();
  return client.db();
}
