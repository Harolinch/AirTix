import {Subjects, TicketCreatedEvent, AbstractPublisher} from '@airtix/common';

export class TicketCreatedPublisher extends AbstractPublisher<TicketCreatedEvent> {
    _subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
}

