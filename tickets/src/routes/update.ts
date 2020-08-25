import express, { NextFunction } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketUpdatedPubliser } from '../events/publishers/ticket-updated-publisher';
import { requireAuth, NotFoundError, NotAuthorizedError, validateRequest } from '@airtix/common';
import { natsWrapper } from '../nats-wrapper';


const router = express.Router();

router.put('/api/tickets/:id', [
    requireAuth,
    body('title').not().isEmpty().withMessage('title is required'),
    body('price').isFloat({
        gt: 0
    }).withMessage('price must be greater that zero'),
    validateRequest
], async (req: any, res: any, next: NextFunction) => {
    
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        return next(new NotFoundError());
    }
    if (ticket.userId !== req.currentUser.id) {
        return next(new NotAuthorizedError());
    }
    ticket.set(req.body);
    await ticket.save();

    //what happens if publish failure ??? => Database Transaction is the solution
    new TicketUpdatedPubliser(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
    });

    res.status(200).send(ticket);
});

export {
    router as updateRouter
}