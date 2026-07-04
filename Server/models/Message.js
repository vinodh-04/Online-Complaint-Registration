const mongoose = require("mongoose");

const messagesSchema = mongoose.Schema({
    name: { type: String, required: [true, 'Name is required'] },
    message: { type: String, required: [true, 'Message is required'] },
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: "AssignedComplaint" }
}, {
    timestamps: true
});

module.exports = mongoose.model("Message", messagesSchema);