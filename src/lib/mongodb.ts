import mongoose from 'mongoose';

/**
 * Global variable to cache the Mongoose connection across hot reloads
 * in development. This prevents multiple connections being established.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

/**
 * MongoDB connection interface for type safety
 */
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Cached connection object to prevent multiple connections during development
 */
const cached: MongooseConnection = global.mongooseCache || { conn: null, promise: null };

/**
 * Initialize the global cache if it doesn't exist
 */
if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose
 * 
 * @param uri - MongoDB connection string (defaults to MONGODB_URI env variable)
 * @returns Promise resolving to the Mongoose connection
 * 
 * @example
 * ```ts
 * import { connectToDatabase } from '@/lib/mongodb';
 * 
 * await connectToDatabase();
 * ```
 */
export async function connectToDatabase(
  uri: string = process.env.MONGODB_URI || ''
): Promise<typeof mongoose> {
  // Return cached connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Validate MongoDB URI
  if (!uri) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // Create new connection promise if not already cached
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maximum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // Timeout for server selection
      socketTimeoutMS: 45000, // Socket timeout
    };

    cached.promise = mongoose.connect(uri, opts).then((connection: typeof mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return connection;
    });
  }

  try {
    // Wait for the connection to be established
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset the promise on error to allow retry
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

/**
 * Disconnects from MongoDB (useful for testing or cleanup)
 * 
 * @returns Promise that resolves when disconnected
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
    console.log('🔌 MongoDB disconnected');
  }
}

/**
 * Checks if MongoDB is currently connected
 * 
 * @returns boolean indicating connection status
 */
export function isConnected(): boolean {
  return mongoose.connection.readyState === 1;
}
