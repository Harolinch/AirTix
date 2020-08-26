import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    private _client?: Stan;

    get client() {
        if(!this._client){
            throw new Error('Cannot access NATS client before connecting to the server');
        }
        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise((resolve, reject) => {
            this._client!.on('connect', () => {
                console.log('Connected to Nats');
                return resolve();
            });

            this._client!.on('error', (err) => {
                return reject(err);
            });
        });
    }
}


export const natsWrapper = new NatsWrapper();