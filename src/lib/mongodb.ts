
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached =
  globalThis.mongooseCache ??
  (globalThis.mongooseCache = {
    conn: null,
    promise: null,
  });

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI || MONGODB_URI;
  if (!uri) {
    throw new Error("Please define MONGODB_URI in your environment variables");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
      })
      .then((instance) => instance)
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;

  return cached.conn;
}
