import { AbstractListener, ExpirationCompleteEvent, Subjects, OrderStatus } from '@airtix/common';
import { QUEUE_GROUP_NAME } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models';
import { OrderCancelledPublihser } from '../publishers';

export class ExpirationCompleteListener extends AbstractListener<ExpirationCompleteEvent> {
    _subject: Subjects.EXPIRATION_COMPLETE  = Subjects.EXPIRATION_COMPLETE;
    queueGroupName = QUEUE_GROUP_NAME;
    
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message){
        const order = await Order.findById(data.orderId).populate('ticket');
        
        if(!order){
            throw new Error('Order Not Found');            
        }

        if(order.status === OrderStatus.COMPLETE){
            return msg.ack();
        }

        order.set({
            status: OrderStatus.CANCELLED,
        });
        await order.save();
        await new OrderCancelledPublihser(this._client).publish({
            id: order.id,
            version: order.version,
            ticket:{
                id: order.ticket.id,
            }
        });
        msg.ack();
    }
}