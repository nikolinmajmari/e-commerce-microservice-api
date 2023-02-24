
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongo: any;
beforeAll(async ()=> {
    process.env.JWT_KEY = 'asdfasdf';
    await mongoose.connect('mongodb://localhost/users-repository-test');
});


beforeEach(async ()=> {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll( async () => {
    await mongoose.connection.close();
});