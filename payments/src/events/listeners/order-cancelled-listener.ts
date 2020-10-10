import { AbstractListener, OrderCancelledEvent, OrderStatus, Subjects } from "@airtix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCancelledListener extends AbstractListener<OrderCancelledEvent> {
    _subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1,
        });
        if(!order) {
            throw new Error('Order Not Found');
        }
        order.set({status: OrderStatus.CANCELLED});
        await order.save();

        msg.ack();
    }
}