import mongoose, { Schema, model } from 'mongoose';

const role = new Schema({
    value: {
        type: String,
        unique: true,
        default: "USER"
    }
})

// module.exports = model('Role', role);

const Role : mongoose.Model<any> = mongoose.model("Role", role);
export = Role;