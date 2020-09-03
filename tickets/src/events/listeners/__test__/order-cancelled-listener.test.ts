import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";
import mongoose from 'mongoose';
import { OrderCancelledEvent } from "@airtix/common";
import { Message } from 'node-nats-streaming';

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const orderId = mongoose.Types.ObjectId().toHexString();

    const ticket = Ticket.build({
        title: 'test title',
        price: 23434,
        userId: mongoose.Types.ObjectId().toHexString(),
    });
    ticket.set({ orderId });
    await ticket.save();

    //create a fake data of type orderCancelledEvent
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id,
        }
    }

    //create a fake msg
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return {
        listener, ticket, data, msg,
    }
}

it('updates the ticket, publishes an event, and ascks the message', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    console.log(updatedTicket);
    expect(updatedTicket?.orderId).toBeFalsy();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();

}); 