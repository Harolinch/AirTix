import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.mock('../nats-wrapper');

let mongo: any;

function defineEnvironmentVariables() {
    process.env.JWT_KEY = 'akljdflkdjf3098kdlf';
}

beforeAll(async () => {
    defineEnvironmentVariables();

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});


afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});


