import request from 'supertest';
import { app } from '../../app';

const SIGNUP = '/api/users/signup';
const SIGNIN = '/api/users/signin';
const SIGNOUT = '/api/users/signout';

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post(SIGNUP)
        .send({
            email: "test@test.com",
            password: "testPass",
        })
        .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post(SIGNUP)
        .send({
            email: "test.com",
            password: "testPass"
        })
        .expect(400);
});

it('returns a 400 with an invalid password', async () => {
    return request(app)
        .post(SIGNUP)
        .send({
            email: "test@test.com",
            password: "t"
        })
        .expect(400);
});

it('returns a 400 with an invalid email and password', async () => {
    return request(app)
        .post(SIGNUP)
        .send({
            email: "testtest.com",
            password: "t"
        })
        .expect(400);
});

it('returns a 400 with a missing email or password', async () => {
    await request(app)
        .post(SIGNUP)
        .send({
            email: "test@test.com",            
        })
        .expect(400);

    await request(app)
        .post(SIGNUP)
        .send({
            password: "testPass",            
        })
        .expect(400);
});

it('disallows duplicate emails', async () => {
    await request(app)
        .post(SIGNUP)
        .send({
            email: 'test@test.com',
            password: 'testPass',
        })
        .expect(201);
    await request(app)
        .post(SIGNUP)
        .send({
            email: 'test@test.com',
            password: 'testPass',
        })
        .expect(400);
});

it('sets a cookie after a successful signup', async () => {
    const response = await request(app)
        .post(SIGNUP)
        .send({
            email: 'test@test.com',
            password: 'testPass',
        })
        .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
}); 