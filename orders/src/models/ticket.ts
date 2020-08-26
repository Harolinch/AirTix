import mongoose from 'mongoose';
import {Order} from './order';
import {OrderStatus} from '@airtix/common';

interface TicketAttrs {
    title: string,
    price: number,
}

interface TicketDoc extends mongoose.Document, TicketAttrs {
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.methods.isReserved = async function(){
    const reserved = await Order.findOne({
        ticket: this.id,
        status: { $nin: [OrderStatus.CANCELLED] }
    });
    return !!reserved;
}

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}


const Ticket = mongoose.model<TicketDoc, TicketModel>('Order', ticketSchema);

export {
    Ticket,
    TicketDoc,
}