import express from 'express';
import { extractUser } from '@airtix/common';

const router = express.Router();

router.get(
    '/api/users/currentuser',
    extractUser, 
    (req: any, res: any) => {
        res.send({
            currentUser: req.currentUser || null
        });
    });

export {
    router as currentUserRouter
}