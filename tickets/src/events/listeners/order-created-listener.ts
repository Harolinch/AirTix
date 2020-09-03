import { AbstractListener, OrderCreatedEvent, Subjects } from '@airtix/common';
import { QUEUE_GROUP_NAME } from '../listeners';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPubliser } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends AbstractListener<OrderCreatedEvent> {
    _subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
    
    queueGroupName = QUEUE_GROUP_NAME;
    
    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        //fetching the ticket that the order is reserving
        const ticket = await Ticket.findById(data.ticket.id);

        //if no ticket, throw error
        if(!ticket){
            throw new Error('Ticket service cant find ticket id sent from Order service');
        }

        //Mark the ticket as being reserved by setting its orderId property
        ticket.set({
            orderId: data.id,
        });

        // save the ticket
        await ticket.save();
        await new TicketUpdatedPubliser(this._client).publish({
            id: ticket.id,
            version: ticket.version,
            price: ticket.price,
            title: ticket.title,
            orderId: ticket.orderId,
            userId: ticket.userId,
        });

        //ack the message
        msg.ack();
    }

}