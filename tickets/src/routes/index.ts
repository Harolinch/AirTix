import express from 'express';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (req: any, res: any) => {
    const fethcedTickets = await Ticket.find({});
    res.status(200).send(fethcedTickets);
})

export {
    router as IndexRouter
}
export * from './create';
export * from './show';
export * from './update';