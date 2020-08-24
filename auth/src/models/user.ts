import mongoose from 'mongoose';
import Password from '../services/password';

interface UserAttrs {
    email: string;
    password: string;
}

interface UserDoc extends mongoose.Document, UserAttrs { }


interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret.password;
            delete ret._id;
            delete ret.__v;
        }
    }
});

userSchema.pre<UserDoc>('save', function (done) {
    if (this.isModified('password')) {
        const hashedPassword = Password.toHash(this.password);
        this.set('password', hashedPassword);
    }
    done();
});

userSchema.statics.build = function (attrs: UserDoc) {
    return new User(attrs);
}






const User = mongoose.model<UserDoc, UserModel>('User', userSchema);


export { User }