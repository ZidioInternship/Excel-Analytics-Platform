import mongoose from 'mongoose';
const { Schema } = mongoose;

const uploadSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Upload = mongoose.model('Upload', uploadSchema);
export default Upload
