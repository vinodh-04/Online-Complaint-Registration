const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'] },
    password: { type: String, required: [true, 'Password is required'] },
    phone: { type: Number, required: [true, 'Phone is required'] },
    role: {
        type: String,
        enum: ["Admin", "Agent", "Ordinary"],
        default: "Ordinary"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);