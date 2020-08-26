import express, { NextFunction } from 'express';

const router = express.Router();

router.delete('/api/orders/:id', async (req: any, res: any, next: NextFunction) => {
    res.send({});
});

export {
    router as deleteOrderRouter,
}