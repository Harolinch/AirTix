import { OrderStatus } from '@airtix/common';
import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';
interface OrderAtrs {
    id: string;
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;

}

interface OrderDoc extends mongoose.Document,  OrderAtrs{
    id: string;
    userId: string;
    status: OrderStatus;
    price: number;
    version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(values: OrderAtrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    version: {
        type: Number,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;            
        }
    }
});

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build = (values: OrderAtrs) => {
    return new Order({
        ...values,
        _id: values.id,
        
    });
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export {Order};