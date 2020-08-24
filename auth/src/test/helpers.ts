import { app } from '../app';
import request from 'supertest';


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
    const email = 'test@test.com';
    const password = 'testPass';

    const response = await request(app)
        .post('/api/users/signin')
        .send({ email, password })
        .expect(200);

    const cookie = response.get('Set-Cookie');
    return cookie;
}

const signout = async () => {
    const response = await request(app)
        .post('/api/users/signout')
        .expect(200);
    return response;
}

export { signup, signin, signout };