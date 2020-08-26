import express, { NextFunction } from 'express';

const router = express.Router();

router.get('/api/orders', async (req: any, res: any, next: NextFunction) => {
    res.send({});
});

export {
    router as indexOrderRouter,
}
export * from './delete';
export * from './show';
export * from './create';