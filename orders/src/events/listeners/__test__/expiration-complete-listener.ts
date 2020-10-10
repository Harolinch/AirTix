import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from 'mongoose';
import { Ticket, Order } from "../../../models";
import { OrderStatus, ExpirationCompleteEvent } from "@airtix/common";
import { Message } from 'node-nats-streaming';


const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: mongoose.Types.ObjectId().toHexString(),
        title: 'first ticket',
        price: 343,
    });
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.CREATED,
        userId: mongoose.Types.ObjectId().toHexString(),
        expiresAt: new Date(),
        ticket: ticket,
    });
    await order.save();

    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id,
    }

    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    return {
        listener,
        ticket,
        order,
        data,
        msg,
    }
}

it('updatets the order status to cancelled', async () => {
    const { listener, ticket, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.CANCELLED);
});

it('emit an OrderCancelled event', async () => {
    const { listener, ticket, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish as jest.Mock).toHaveBeenCalled();

    //first dimenstion of mock.calls is the number of the call of that function
    //second dimenstion of mock.calls is the number of the argument passed to that function
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
    const { listener, ticket, order, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

});