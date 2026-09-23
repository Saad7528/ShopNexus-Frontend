import mongoose from 'mongoose';

const DEFAULT_MONGODB_URI = 'mongodb+srv://shopnexus:OY0pd4jFeL8Iojlw@sadasaad.pszei0q.mongodb.net/shopnexus?retryWrites=true&w=majority&appName=SadaSaad';
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI || DEFAULT_MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache || { conn: null, promise: null };
globalThis.mongooseCache = cached;

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
