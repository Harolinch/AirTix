import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/helpers';


const createTicket = async () => {
    return request(app)
    .post('/api/tickets')
    .set('Cookie', await signin())
    .send({
        title: 'test title',
        price: 12,
    });
};

it('can fetch a list of tikcets', async () => {
    await createTicket();
    await createTicket();
    await createTicket();
    const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200);
    expect(response.body.length).toEqual(3);
});