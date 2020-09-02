import { Message } from 'node-nats-streaming';
import { Subjects, AbstractListener, TicketUpdatedEvent } from '@airtix/common';
import { Ticket } from '../../models';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class TicketUpdatedListener extends AbstractListener<TicketUpdatedEvent> {
    _subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
    queueGroupName = QUEUE_GROUP_NAME;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const { id, title, price } = data;

        //extract ticket where id match
        const ticket = await Ticket.findByEvent(data);
        if (!ticket) {
            throw new Error('Ticket Not Found');
        }

        //updated ticket with new title and price
        ticket.set({ title, price });

        //save updated ticket
        await ticket.save();
        msg.ack();
    }
}
