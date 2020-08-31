import express, { NextFunction } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError } from '@airtix/common';
import { Order } from '../models';

const router = express.Router();

router.get('/api/orders/:id',
    requireAuth,
    async (req: any, res: any, next: NextFunction) => {
        const order = await Order.findById(req.params.id).populate('ticket');
        if (!order) {
            return next(new NotFoundError());
        }
        if (req.currentUser.id !== order.userId) {
            return next(new NotAuthorizedError());
        }

        res.send(order);
    });

export {
    router as showOrderRouter,
}