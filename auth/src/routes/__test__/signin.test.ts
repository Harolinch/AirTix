import request from 'supertest';
import { app } from '../../app';

const SIGNUP = '/api/users/signup';
const SIGNIN = '/api/users/signin';
const SIGNOUT = '/api/users/signout';

it('fails when an email that doesnt exist is supplied', async () => {
    await request(app)
        .post(SIGNIN)
        .send({
            email: 'test@test.com',
            password: 'testPass'
        })
        .expect(400);
}); 

it('fails when an incorrect password is supplied', async () => {
    await request(app)
        .post(SIGNUP)
        .send({
            email: 'test@test.com',
            password: 'testPass'
        })
        .expect(201);
    await request(app)
        .post(SIGNIN)
        .send({
            email: 'test@test.com',
            password: 'testfail'
        })
        .expect(400);
});

it ('response with a cookie when given valid credentials', async () => {
    await request(app)
        .post(SIGNUP)
        .send({
            email: 'test@test.com',
            password: 'testPass'
        })
        .expect(201);
    const response = await request(app)
        .post(SIGNIN)
        .send({
            email: 'test@test.com',
            password: 'testPass'
        })
        .expect(200);
    expect(response.get('Set-Cookie')).toBeDefined();
});