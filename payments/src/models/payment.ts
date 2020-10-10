import { Document, model, Model, Schema } from "mongoose";

interface PaymentAtrs {
    orderId: string;
    stripeId: string;
}

interface PaymentDoc extends Document, PaymentAtrs {

}

interface PaymentModel extends Model<PaymentDoc> {
    build(atrs: PaymentAtrs): PaymentDoc;
}

const paymentSchemca = new Schema({
    orderId: {
        required: true,
        type: String,
    },
    stripeId: {
        required: true,
        type: String,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

paymentSchemca.statics.build = (atrs: PaymentAtrs) => {
    return new Payment(atrs);
}

const Payment = model<PaymentDoc, PaymentModel>('Payment', paymentSchemca);

export { Payment };