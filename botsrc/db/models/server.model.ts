import { Schema, model, models } from "mongoose";

export const ServerSchema = new Schema({
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

model('server', ServerSchema);