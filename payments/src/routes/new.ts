import express, { NextFunction } from 'express';
import { body } from 'express-validator';
import {
    requireAuth,
    validateRequest,
    BadRequestError,
    NotFoundError,
    NotAuthorizedError,
    OrderStatus,
} from '@airtix/common';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post('/api/payments',
    requireAuth,
    [
        body('token').not().isEmpty(),
        body('orderId').not().isEmpty(),
        validateRequest,
    ],

    async (req: any, res: any, next: NextFunction) => {
        //description used for only testing purposes
        const { token, orderId, description } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return next(new NotFoundError());
        }
        if (order.userId !== req.currentUser!.id) {
            return next(new NotAuthorizedError());
        }
        if (order.status === OrderStatus.CANCELLED) {
            return next(new BadRequestError('cant pay for an cancelled order'));
        }
        //AT THIS POINT WE MUST HAVE STRIPE ACCOUNT TO SEND TOKEN TO CHARGE THE USER SOME MONEY
        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: token,
            description: description || '',
        });

        const payment = Payment.build({
            orderId,
            stripeId: charge.id,
        });
        await payment.save();
        
        new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId,
        });

        res.status(201).send({ success: true });
    });

export { router as createChargeRouter };