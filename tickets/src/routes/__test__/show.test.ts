import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { signin } from '../../test/helpers';

it('returns a 404 if the ticket is not found', async () => {
    await request(app)
        .get('/api/tickets/ab3931fd9012')
        .send({})
        .expect(404);
});

it('returns the ticket if the ticket is found', async () => {
    const title = 'concert';
    const price = 20;
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', await signin())
        .send({ title, price })
        .expect(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)    
        .send()    
        .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
});  