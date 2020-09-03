import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { OrderCreatedEvent, OrderStatus } from '@airtix/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming'


const setup = async () => {
    // create an instacne of the listener 
    const listener = new OrderCreatedListener(natsWrapper.client);

    //create and save a ticket
    const ticket = Ticket.build({
        title: 'building a new ticket',
        price: 230,
        userId: '1b1b1b1b1b1b',
    });
    await ticket.save();

    //create the fake data object
    const data: OrderCreatedEvent['data'] = {
        id: mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.CREATED,
        userId: '1b1b1b1b1b1b',
        expiresAt: 'anyvalue',
        ticket: {
            id: ticket.id,
            price: ticket.price,
        },
    }

    //create a fake msg object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return {
        listener,
        ticket,
        data,
        msg,
    }
}

it('sets the orderId of the ticket', async () => {
    const {listener, ticket, data, msg} = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket?.orderId).toEqual(data.id);

});

it('acks the message', async () => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('publish a ticket updated event', async () => {
    const {listener, ticket, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});