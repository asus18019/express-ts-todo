import mongoose, { Schema, model } from 'mongoose';

const user = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: [{
        type: String,
        ref: 'Role'
    }],
    cars: [{
        type: Schema.Types.ObjectId,
        ref: 'Car'
    }]
})

// module.exports = model('User', user);
const User : mongoose.Model<any> = mongoose.model("User", user);
export = User;