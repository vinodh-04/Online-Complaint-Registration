const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderRole: { type: String, enum: ['USER', 'AGENT', 'ADMIN'], required: true },
    message: { type: String, required: true, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const complaintSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['BILLING', 'TECHNICAL', 'SERVICE', 'PRODUCT', 'STAFF_BEHAVIOR', 'OTHER'],
      default: 'OTHER',
    },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'],
      default: 'OPEN',
    },
    attachments: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    comments: [commentSchema],
    resolutionNote: { type: String, trim: true },
    resolvedAt: { type: Date },
  },
  { timestamps: true }
);

complaintSchema.index({ status: 1 });
complaintSchema.index({ user: 1 });
complaintSchema.index({ agent: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
