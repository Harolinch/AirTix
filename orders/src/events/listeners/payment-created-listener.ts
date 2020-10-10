import { AbstractListener, OrderStatus, PaymentCreatedEvent, Subjects } from "@airtix/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from 'node-nats-streaming';
import { Order } from "../../models";

export class PaymentCreatedListener extends AbstractListener<PaymentCreatedEvent> {
    _subject: Subjects.PAYMENT_CREATED = Subjects.PAYMENT_CREATED;
    queueGroupName = QUEUE_GROUP_NAME;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId);
        if (!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.COMPLETE });
        await order.save();
        msg.ack();
    }
}