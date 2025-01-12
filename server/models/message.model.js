import mongoose from "mongoose";

/**
 * Schema for Messages 
 */
const messageSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }

})

const Message = mongoose.model('Message', messageSchema) ;