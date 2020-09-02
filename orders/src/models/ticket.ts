import mongoose from 'mongoose';
import { Order } from './order';
import { OrderStatus } from '@airtix/common';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
    id: string,
    title: string,
    price: number,
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number,
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(eventData: { id: string, version: number }): Promise<TicketDoc | null>;
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


ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.methods.isReserved = async function () {
    const reserved = await Order.findOne({
        ticket: this.id,
        status: { $nin: [OrderStatus.CANCELLED] }
    });
    return !!reserved;
}

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
}

ticketSchema.statics.findByEvent = (eventData: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: eventData.id,
        version: eventData.version - 1,
    });
}


const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export {
    Ticket,
    TicketDoc,
}