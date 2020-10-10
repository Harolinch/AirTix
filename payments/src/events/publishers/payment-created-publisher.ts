import { AbstractPublisher, PaymentCreatedEvent, Subjects } from "@airtix/common";

export class PaymentCreatedPublisher extends AbstractPublisher<PaymentCreatedEvent> {
    _subject: Subjects.PAYMENT_CREATED = Subjects.PAYMENT_CREATED;
    
}