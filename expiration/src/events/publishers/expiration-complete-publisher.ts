import { AbstractPublisher, ExpirationCompleteEvent, Subjects } from '@airtix/common';

export class ExpirationCompletePubliser extends AbstractPublisher<ExpirationCompleteEvent> {
    _subject: Subjects.EXPIRATION_COMPLETE = Subjects.EXPIRATION_COMPLETE;
}

