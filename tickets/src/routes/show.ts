import express, { NextFunction } from 'express';
import { Ticket } from '../models/ticket';
import { NotFoundError } from '@airtix/common';

const router = express.Router();

router.get('/api/tickets/:id', async (req: any, res: any, next: NextFunction) => {
    const ticket = await Ticket.findById(req.params.id)
    if (!ticket) {
        return next(new NotFoundError());
    }
    res.send(ticket);
});

export {
    router as showTicketRouter,
};  