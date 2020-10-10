import { AbstractListener, OrderCreatedEvent, Subjects } from "@airtix/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends AbstractListener<OrderCreatedEvent>{
    _subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version,
        });

        await order.save();
        msg.ack();
    }
}
