import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { signin } from '../../test/helpers';
import { Ticket, Order } from '../../models';
import { OrderStatus } from '@airtix/common';
import { natsWrapper } from '../../nats-wrapper';


it('returns ans error if the ticket does not exsit', async () => {
    const ticketId = mongoose.Types.ObjectId();
    await request(app)
        .post('/api/orders')
        .set('Cookie', await signin())
        .send({ ticketId })
        .expect(404);
});


it('returns ans error if the ticket is reserved', async () => {
    const ticket = Ticket.build({
        title: 'ticket test',
        id: mongoose.Types.ObjectId().toHexString(),
        price: 20,
    });
    await ticket.save();
    const order = Order.build({
        ticket,
        userId: 'jdflksjljdflksjfs',
        status: OrderStatus.CREATED,
        expiresAt: new Date()
    });
    order.save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', await signin())
        .send({
            ticketId: ticket.id,
        })
        .expect(400);


});
it('reserves', async () => {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'first ticket',
        price: 20,
    });
    await ticket.save();

    await request(app)
    .post('/api/orders')
    .set('Cookie', await signin())
    .send({
        ticketId: ticket.id,
    })
    .expect(201);


});


it('emits an order craeted event', async ()=> {
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'first ticket',
        price: 20,
    });
    await ticket.save();

    await request(app)
    .post('/api/orders')
    .set('Cookie', await signin())
    .send({
        ticketId: ticket.id,
    })
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});