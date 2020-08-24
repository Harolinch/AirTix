import request from 'supertest';
import { app } from '../../app';
import { resolveNaptr } from 'dns';

const SIGNUP = '/api/users/signup';
const SIGNIN = '/api/users/signin';
const SIGNOUT = '/api/users/signout';

it('clears the cookie after signing out', async () => {
    await request(app)
        .post(SIGNUP)
        .send({
            email: 'test@test.com',
            password: 'testPass',
        })
        .expect(201);    
    const response = await request(app)
        .post(SIGNOUT)
        .expect(200);
    expect(response.get('Set-Cookie')[0]).toEqual("express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly");
 
});