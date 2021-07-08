import mongoose, { Schema, model } from 'mongoose';

const car = new Schema({
    title: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    }
})

// module.exports = model('User', user);
const Car : mongoose.Model<any> = mongoose.model("Car", car);
export = Car;