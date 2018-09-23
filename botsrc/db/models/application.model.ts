import { Schema, model } from "mongoose";

export const ApplicationSchema = new Schema({
    isActivated: {
        type: Boolean,
        required: true
    },
    application: {
        START: {
            type: {
                type: String
            },
            prompt: String,
            reactions: [
                {
                    type: {
                        type: String
                    },
                    prompt: String,
                    next: {
                        type: String,
                        default: null
                    }
                }
            ]
        },
        type: Schema.Types.Mixed
    },
    server: {
        type: String,
        ref: 'server',
        required: true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    questionTimeout: {
        type: Number,
        required: true
    },
    applicationsRecieved: {
        type: Number,
        default: 0
    }
});

model('application', ApplicationSchema);