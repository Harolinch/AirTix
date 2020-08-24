import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@airtix/common';

const app = express();

app.set('trust proxy', true);
app.enable('trust proxy');
app.use(json());
app.use(cookieSession({
    signed: false, //preventEncryption
    secure: process.env.NODE_ENV !== 'test',
}));

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.all('*', () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export {
    app
}