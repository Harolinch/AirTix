import { AbstractPublisher, OrderCreatedEvent, Subjects } from "@airtix/common";

export class OrderCreatedPublisher extends AbstractPublisher<OrderCreatedEvent> {
    _subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
}