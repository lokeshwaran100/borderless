import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    fromAddress: {
        type: String,
        required: true
    },
    toAddress: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    fee: {
        type: Number,
        required: true
    },
    dateAndTime: {
        type: Date,
        required: true
    },
    message: {
        type: String,
        required: true,
        default: "default message"
    },
    sendToken: {
        type: String,
        required: true
    },
    receiveToken: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "done"],
        default: "pending",
    }
})

const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", TransactionSchema);

export default Transaction;