import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/helpers';
import { Ticket } from '../../models';
import mongoose from 'mongoose';

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'random title',
        price: 23,
    });
    await ticket.save();
    return ticket;
}

it('fetches orders for an particular user', async () => {
    // Create three tickets
    const tik1 = await buildTicket();
    const tik2 = await buildTicket();
    const tik3 = await buildTicket();

    // Create 2 users
    const usr1 = await signin();
    const usr2 = await signin();

    // first ticket to user1
    const order1 = await request(app).post('/api/orders')
        .set('Cookie', usr1)
        .send({ ticketId: tik1.id })
        .expect(201);

    // second and third to user2
    const order2 = await request(app).post('/api/orders')
        .set('Cookie', usr2)
        .send({ ticketId: tik2.id })
        .expect(201);
    const order3 = await request(app).post('/api/orders')
        .set('Cookie', usr2)
        .send({ ticketId: tik3.id })
        .expect(201);


    // make request to get orders for user2
    const response = await request(app)
    .get('/api/orders')
    .set('Cookie', usr2)
    .expect(200);

    // make sure we only get orders for user2
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(order2.body.id);
    expect(response.body[1].id).toEqual(order3.body.id);
    expect(response.body[0].ticket.id).toEqual(tik2.id);
    expect(response.body[1].ticket.id).toEqual(tik3.id);
    
});