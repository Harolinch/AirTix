import request from 'supertest';
import { app } from '../../app';
import { signup, signout } from '../../test/helpers';

const SIGNUP = '/api/users/signup';
const SIGNIN = '/api/users/signin';
const SIGNOUT = '/api/users/signout';

it('Responds with details about the current user when signed in', async () => {

    const cookie = await signup();

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);
    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('Responds with null about the current user if not signed in', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')    
        .send()
        .expect(200);
    expect(response.body.currentUser).toEqual(null);
});