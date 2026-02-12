import mongoose from "mongoose";

// Extend the global namespace to include our MongoDB connection cache
declare global {
	var mongoose: {
		conn: typeof mongoose | null;
		promise: Promise<typeof mongoose> | null;
	};
}

// Get the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

// Initialize the cache if it doesn't exist
if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes a connection to MongoDB using Mongoose.
 * Caches the connection to reuse across multiple requests.
 *
 * @returns {Promise<typeof mongoose>} The Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
	// Return the cached connection if it exists
	if (cached.conn) {
		return cached.conn;
	}

	// If there's no active promise, create a new connection
	if (!cached.promise) {
		// Validate that the MongoDB URI is defined before connecting
		if (!MONGODB_URI) {
			throw new Error(
				"Please define the MONGODB_URI environment variable inside .env.local",
			);
		}

		const opts = {
			bufferCommands: false, // Disable mongoose buffering
		};

		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then((mongoose) => {
				console.log("✅ MongoDB connected successfully");
				return mongoose;
			});
	}

	try {
		// Wait for the connection promise to resolve
		cached.conn = await cached.promise;
	} catch (error) {
		// Reset the promise on error so the next call will retry
		cached.promise = null;
		console.error("❌ MongoDB connection error:", error);
		throw error;
	}

	return cached.conn;
}

export default connectDB;
