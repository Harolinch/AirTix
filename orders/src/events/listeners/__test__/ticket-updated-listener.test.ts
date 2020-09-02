import { TicketUpdatedListener } from '../ticket-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models';
import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@airtix/common';
import { Message } from 'node-nats-streaming'

const setup = async () => {
    //create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    //create and save a ticket inside a collection
    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'test title',
        price: 394,
    });
    await ticket.save();

    //create a fake data object (!! updated ticket !!)
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new test title',
        price: 199999,
        userId: '1b1b1b1b1b1b',
    }

    //create a fake msg object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    //return all of this stuff
    return {
        data,
        msg,
        ticket,
        listener
    }
}

it('finds, updates, and saves a ticket', async () => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);

});


it('acks the message', async () => {
    const { msg, data, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

});


it("doesn't call ack if the event has a skipped version number", async () => {
    const { msg, data, listener, ticket } = await setup();
    data.version = 11;
    try {
        await listener.onMessage(data, msg);
    } catch (err) {

    }

    expect(msg.ack).not.toHaveBeenCalled();
});