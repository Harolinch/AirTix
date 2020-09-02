import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/helpers';
import { Ticket, Order } from '../../models';
import { OrderStatus } from '@airtix/common';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
    // create a ticket
    const tik = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'test title for the ticket',
        price: 234
    });
    await tik.save();

    const cookie = await signin();

    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: tik.id })
        .expect(201);

    const delResponse = await request(app)
    .del(`/api/orders/${response.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);

    const order = await Order.findById(response.body.id);
    expect(order!.status).toEqual(OrderStatus.CANCELLED);
}); 

it('emit order cancelled event', async () => {
    // create a ticket
    const tik = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'test title for the ticket',
        price: 234
    });
    await tik.save();

    const cookie = await signin();

    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: tik.id })
        .expect(201);

    const delResponse = await request(app)
    .del(`/api/orders/${response.body.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});