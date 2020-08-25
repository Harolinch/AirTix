import {Subjects, AbstractPublisher, TicketUpdatedEvent} from '@airtix/common';

export class TicketUpdatedPubliser extends AbstractPublisher<TicketUpdatedEvent> {
    _subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
}

