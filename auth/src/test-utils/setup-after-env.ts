import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Before Everything
// Create an instance of mongodb server
// connect to mongodb server via mongoose
let mongoMemoryServer: MongoMemoryServer;
beforeAll(async () => {
  mongoMemoryServer = await MongoMemoryServer.create();
  const mongoUri = mongoMemoryServer.getUri();
  await mongoose.connect(mongoUri);
});

// Before each test
// Clean up the database
beforeEach(async () => {
  const allCollections = await mongoose.connection.db.collections();

  for (const collection of allCollections) {
    await collection.deleteMany({});
  }
});

// After all tests
// Close the connection with the database
afterAll(async () => {
  mongoMemoryServer.stop();
  mongoose.connection.close();
});
