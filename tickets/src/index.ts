import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener, OrderCancelledListener } from './events/listeners';



const start = async () => {
    const envs = ['JWT_KEY', 'MONGO_URI', 'NATS_CLUSTER_ID', 'NATS_CLIENT_ID', 'NATS_URL'];
    envs.forEach(env => {
        if (!process.env[env]) {
            throw new Error(`${env} not provided in envronment variables`);
        }
    });


    try {
        await mongoose.connect(process.env.MONGO_URI!, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log('connected to db');


        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID!,
            process.env.NATS_CLIENT_ID!,
            process.env.NATS_URL!);

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
        process.on('SIGINT', () => process.exit());
        process.on('SIGTERM', () => process.exit());


        //listening to incoming events.....
        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderCancelledListener(natsWrapper.client).listen();

    } catch (err) {
        console.log(err);
    }
    app.listen(3000, () => {
        console.log('tickets server is listening on port 3000...!');
        
    });
}

start();