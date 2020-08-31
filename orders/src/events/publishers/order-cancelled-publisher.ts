import { AbstractPublisher, OrderCancelledEvent, Subjects } from "@airtix/common";


export class OrderCancelledPublihser extends AbstractPublisher<OrderCancelledEvent>{
    _subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
}