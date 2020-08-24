import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';


const signup = async () => {
    const email = 'test@test.com';
    const password = 'testPass';

    const response = await request(app)
        .post('/api/users/signup')
        .send({ email, password })
        .expect(201);

    const cookie = response.get('Set-Cookie');
    return cookie;
}

const signin = async () => {
    // Build a JWT payload. {id, email}
    const payload = {
        id: mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com"
    }
    
    //Create the JWT
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    //Build session Object {jwt: MY_JWT}
    const session = {
        jwt: token,
    }

    //Turn that session into json
    const sessionJson = JSON.stringify(session);

    //Take JSON and encode it as base 64
    const sessionBase64 = Buffer.from(sessionJson).toString('base64');

    //return a string tha's the cookie with the encoded data
    const cookie = [`express:sess=${sessionBase64}`];
    return cookie;
}

const signout = async () => {
    const response = await request(app)
        .post('/api/users/signout')
        .expect(200);
    return response;
}

export { signup, signin, signout };