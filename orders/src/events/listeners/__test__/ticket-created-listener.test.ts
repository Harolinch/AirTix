import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedEvent } from '@airtix/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models';

const setup = async () => {
    // 1- create an instance of the Listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // 2- create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 10,
        userId: new mongoose.Types.ObjectId().toHexString(),
    };

    // 3- create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    return {
        listener, data, msg,
    }
};


it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await setup();

    // 2- call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // 3- write assertions to make sure a ticket was created!
    const ticket = await Ticket.findById(data.id);
    expect(ticket).toBeDefined();
    expect(ticket?.title).toEqual(data.title);
    expect(ticket?.price).toEqual(data.price);

});


it('acks the message', async () => {
    const { listener, data, msg } = await setup();

    // 2- call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // 3- write assertions to make sure acks function called
    expect(msg.ack).toHaveBeenCalled();
});