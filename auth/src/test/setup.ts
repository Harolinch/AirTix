import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';


let mongo: any;

function defineEnvironmentVariables() {
    process.env.JWT_KEY = 'akljdflkdjf3098kdlf';
}

beforeAll(async () => {
    jest.setTimeout(15000);
    defineEnvironmentVariables();

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();

    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({});
    }
});


afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});


