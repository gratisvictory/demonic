import { model, Schema } from 'mongoose';

const MessagesSchema = new Schema({
    Id: String,
    Guild: String,
    User: String,
    Messages: Number,
});

export const Messages = model('messages', MessagesSchema);
