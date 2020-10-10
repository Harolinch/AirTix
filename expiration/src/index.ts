import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

const start = async () => {
    const envs = ['NATS_CLUSTER_ID', 'NATS_CLIENT_ID', 'NATS_URL'];
    envs.forEach(env => {
        if (!process.env[env]) {
            throw new Error(`${env} not provided in envronment variables`);
        }
    });


    try {    
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

        new OrderCreatedListener(natsWrapper.client).listen();

    } catch (err) {
        console.log(err);
    }
    
}

start();