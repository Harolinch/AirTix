import express, { NextFunction } from 'express';

const router = express.Router();

router.get('/api/orders/:id', async (req: any, res: any, next: NextFunction) => {
    res.send({});
});

export {
    router as showOrderRouter,
}