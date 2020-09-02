import { Message } from 'node-nats-streaming';
import { Subjects, AbstractListener, TicketCreatedEvent } from '@airtix/common';
import { Ticket } from '../../models';
import { QUEUE_GROUP_NAME } from './queue-group-name';

export class TicketCreatedListener extends AbstractListener<TicketCreatedEvent> {
    _subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
    queueGroupName = QUEUE_GROUP_NAME;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        const { id, title, price } = data;
        const ticket = Ticket.build({
            id,
            title,
            price,
        });
        await ticket.save();
        msg.ack();
    }
}