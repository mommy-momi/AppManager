import { Schema, model } from "mongoose";

const CategorySchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    applications: [
        {
            type: Schema.Types.ObjectId,
            ref: 'application'
        }
    ]
});

model('server', CategorySchema);