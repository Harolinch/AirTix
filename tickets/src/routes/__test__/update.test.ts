import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { signin } from '../../test/helpers';
import { Ticket } from '../../models/ticket';


const generateId = () => new mongoose.Types.ObjectId().toHexString();

it('returns a 404 if the provided id does not exist', async () => {
    const id = generateId();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', await signin())
        .send({
            title: 'updated title',
            price: 23
        })
        .expect(404);
});
it('returns a 401 if the user is not authenticated', async () => {
    const id = generateId();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'updated title',
            price: 23
        })
        .expect(401);
});
it('returns a 401 if the user does not own the ticket', async () => {
    const cookie1 = await signin();
    const cookie2 = await signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie1)
        .send({
            title: 'create ticket 1',
            price: 293,
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie2)
        .send({
            title: 'updated title',
            price: 342,
        })
        .expect(401)


});
it('returns a 400 if the user provides an invalid title or price', async () => {
    const cookie = await signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'create ticket 1',
            price: 293,
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            price: -5
        })
        .expect(400);
});

it('rejects updates if a ticket is reserved', async () => {
    const cookie = await signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'create ticket 1',
            price: 293,
        })
        .expect(201);

    const tik = await Ticket.findById(response.body.id);
    tik?.set({ orderId: mongoose.Types.ObjectId().toHexString() });
    await tik?.save();
    
    //trying to update while tik is now reserved to orderId
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'can not update',
            price: 234
        })
        .expect(400);
}); 