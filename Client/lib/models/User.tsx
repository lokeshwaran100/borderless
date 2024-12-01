import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true,
        validate: {
            validator: function(v: number) {
                return /^\d{10}$/.test(v.toString());
            },
            message: (props: { value: number }) => `${props.value} is not a valid 10-digit phone number!`
        }
    },
    oktoId: {
        type: String,
        required: true
    },
    recieveToken: {
        type: String,
        required: true,
        enum: ['USDC', 'USDT']
    }
})

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;