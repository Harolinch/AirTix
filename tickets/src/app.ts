import express from 'express';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler, NotFoundError } from '@airtix/common';
import { extractUser } from '@airtix/common';
import { createTicketRouter, showTicketRouter, IndexRouter, updateRouter } from './routes';

const app = express();

app.set('trust proxy', true);
app.enable('trust proxy');
app.use(json());
app.use(cookieSession({
    signed: false, //preventEncryption
    secure: process.env.NODE_ENV !== 'test',
}));


app.use(extractUser);
app.use(IndexRouter);
app.use(showTicketRouter);
app.use(createTicketRouter);
app.use(updateRouter);


app.all('*', () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export {
    app
}