
import mongoose from 'mongoose';

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  imageUrl: { type: String, required: true },
}, { timestamps: true });

export const TeamMember = mongoose.model('TeamMember', teamMemberSchema);
