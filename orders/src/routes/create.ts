import express, { NextFunction } from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@airtix/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post('/api/orders',
    requireAuth, [
    body('ticketId').not().isEmpty()
        .custom(input => mongoose.Types.ObjectId.isValid(input))
        .withMessage('Invalid ticketId is provided'),
],
    validateRequest,
    async (req: any, res: any, next: NextFunction) => {
        const { ticketId } = req.body;

        //find ticket in database 
        const ticket = await Ticket.findById(ticketId);
        if (!ticket) return next(new NotFoundError());

        //make sure this ticket not associated to any order (reserved)
        const reserved = await ticket.isReserved();
        if(reserved) return next(new BadRequestError('Ticket is already reserved to another order'));

        //calculate expiration time
        const expiration = new Date();
        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);
        
        //build the new order
        const order = Order.build({
            userId: req.currentUser.id,
            status: OrderStatus.CREATED,
            expiresAt: expiration,
            ticket,
        });
        await order.save();

        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            userId: order.userId,
            expiresAt: order.expiresAt.toISOString(),
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price
            }
        })

        res.status(201).send(order);
    }
);

export {
    router as createOrderRouter,
}