import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/helpers';
import { Ticket } from '../../models';


it('fetches the order', async () => {
    // Create a ticket
    const tik = Ticket.build({
        title: 'ticket test',
        price: 20,
    });
    await tik.save();
    
    const cookie = await signin();
    // Make a request to build order with this ticket
    const orderCreateResponse = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
        ticketId: tik.id,
    })
    .expect(201);

    // Make request to fetch the order
    const orderFetchResponse = await request(app)
    .get(`/api/orders/${orderCreateResponse.body.id}`)
    .set('Cookie', cookie)
    .expect(200);

    expect(orderFetchResponse.body.id).toEqual(orderCreateResponse.body.id);
}); 