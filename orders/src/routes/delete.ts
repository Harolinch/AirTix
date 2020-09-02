import express, { NextFunction } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError, OrderStatus } from '@airtix/common';
import { Order } from '../models';
import { OrderCancelledPublihser } from '../events/publishers';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete('/api/orders/:orderId',
    requireAuth,
    async (req: any, res: any, next: NextFunction) => {
        const order = await Order.findById(req.params.orderId).populate('ticket');
        if(!order) {
            return next(new NotFoundError()); 
        }
        if(req.currentUser.id !== order.userId){
            return next(new NotAuthorizedError());
        }
        order.status = OrderStatus.CANCELLED;
        await order.save();      
        
        new OrderCancelledPublihser(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id,                
            }
        })
        
        res.status(204).send();
    }
);

export {
    router as deleteOrderRouter,  
} 