import request from 'supertest';
import { app } from '../../app';
import { signin } from '../../test/helpers';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@airtix/common';
import {stripe} from '../../stripe';
import { Payment } from '../../models/payment';

jest.mock('../../stripe');

it('returns a 404 when purchasing an order taht does not exist', async () => {
    const cookie = await signin();
    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'askjldfkldj', //this is the stripe token
            orderId: mongoose.Types.ObjectId().toHexString(),
        })
        .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId: mongoose.Types.ObjectId().toHexString(),
        price: 34,
        status: OrderStatus.CREATED,
        version: 0,
    });
    await order.save();

    const cookie = await signin();
    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            token: 'askjldfkldj', //this is the stripe token
            orderId: order.id,
        })
        .expect(401);

});

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        price: 34,
        status: OrderStatus.CANCELLED,
        version: 0,
    });
    await order.save();

    const cookie = await signin(order.userId);
    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            orderId: order.id,
            token: 'dlfjkdklfjdkljdf', //this is the stripe token
        })
        .expect(400);
});



/**this test is using stirpe client as a mock */
// it('returns a 204 with valid inputs', async () => {
//     const userId = mongoose.Types.ObjectId().toHexString();
//     const order = Order.build({
//         id: mongoose.Types.ObjectId().toHexString(),
//         userId,
//         price: 34,
//         status: OrderStatus.CREATED,
//         version: 0,
//     });
//     await order.save();

//     const cookie = await signin(order.userId);
//     await request(app)
//         .post('/api/payments')
//         .set('Cookie', cookie)
//         .send({
//             orderId: order.id,
//             token: 'tok_visa', //this is the stripe token for testing
//         })
//         .expect(201);

    
//     //we make sure that stripe.charges.create called
//     const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
//     expect(chargeOptions.source).toEqual('tok_visa');
//     expect(chargeOptions.amount).toEqual(34*100);
//     expect(chargeOptions.currency).toEqual('usd');
// });

it('returns a 201 with valid inputs', async () => {
    const userId = mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: mongoose.Types.ObjectId().toHexString(),
        userId,
        price: 34,
        status: OrderStatus.CREATED,
        version: 0,
    });
    await order.save();


    const description = 'klauioejf09234834';
    const cookie = await signin(order.userId);
    await request(app)
        .post('/api/payments')
        .set('Cookie', cookie)
        .send({
            orderId: order.id,
            token: 'tok_visa', //this is the stripe token for testing
            description,
        })
        .expect(201);

    const stripeCharges  = await stripe.charges.list();
    const lastCharge = stripeCharges.data[0];

    expect(lastCharge.description).toEqual(description);
    
    const payment = await Payment.findOne({
        orderId: order.id,
        stripeId: lastCharge.id,
    });
    
    expect(payment).not.toBeNull();

});

