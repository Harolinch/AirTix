import { AbstractListener, OrderCancelledEvent, Subjects } from "@airtix/common";
import { QUEUE_GROUP_NAME } from "./queue-group-name";
import { Message } from 'node-nats-streaming';
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPubliser } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCancelledListener extends AbstractListener<OrderCancelledEvent> {
    _subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
    queueGroupName = QUEUE_GROUP_NAME;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);

        if (!ticket) {
            throw new Error('Ticket Not Found to handle order cancelation');
        }

        ticket.set({ orderId: undefined });
        await ticket.save();

        new TicketUpdatedPubliser(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
        });

        msg.ack();
    }
}

