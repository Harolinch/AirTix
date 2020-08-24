import express, { NextFunction } from 'express';
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';
import { requireAuth, NotFoundError, NotAuthorizedError, validateRequest } from '@airtix/common';

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
    res.status(200).send(ticket);
});

export {
    router as updateRouter
}