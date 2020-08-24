import express, { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@airtix/common';
import { User } from '../models/user';
import Password from '../services/password';

const router = express.Router();

router.post('/api/users/signin',
    [
        body('email').isEmail().withMessage('Please Enter a valid email address'),
        body('password').trim().notEmpty().withMessage('Password must be supplied')
    ],
    validateRequest,
    async (req: any, res: any, next: NextFunction) => {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return next(new BadRequestError('Invalid Credentials'));
        }

        const passwordMatch = Password.compare(existingUser.password, password);
        if (!passwordMatch) {
            return next(new BadRequestError('Invalid Credentials'));
        }

        //Generate json web token
        const userJwt = jwt.sign({
            id: existingUser.id,
            email: existingUser.email,
        }, process.env.JWT_KEY!);

        //Store jwt on Session Object
        req.session.jwt = userJwt;

        res.status(200).send(existingUser);



    }
);

export {
    router as signinRouter
}