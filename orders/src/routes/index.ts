import express, { NextFunction } from 'express';
import { requireAuth } from '@airtix/common';
import { Order } from '../models';

const router = express.Router();

router.get('/api/orders',
    requireAuth,
    async (req: any, res: any, next: NextFunction) => {
        const orders = await Order.find({
            userId: req.currentUser.id,
        }).populate('ticket');
        res.send(orders);
    });

export {
    router as indexOrderRouter,
}
export * from './delete';
export * from './show';
export * from './create';