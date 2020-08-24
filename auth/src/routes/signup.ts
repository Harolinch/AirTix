import express, { NextFunction } from 'express';
import { body } from 'express-validator';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@airtix/common';
import jwt from 'jsonwebtoken';


const router = express.Router();

router.post('/api/users/signup',
    [
        body('email').isEmail().withMessage('Email must be valid'),
        body('password').trim().isLength({ min: 4, max: 20 }).withMessage('Password must be between 4 and 20 characters')
    ],
    validateRequest,
    async (req: any, res: any, next: NextFunction) => {

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new BadRequestError('User with this email already exsit...'));
        }
        const user = User.build({ email, password });
        await user.save();

        //Generate json web token
        const userJwt = jwt.sign({
            id: user.id,
            email: user.email,
        }, process.env.JWT_KEY!);


        //Store jwt on Session Object
        req.session.jwt = userJwt;

        return res.status(201).send(user);
    });

export {
    router as signupRouter
} 