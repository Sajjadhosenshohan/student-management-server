import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true
  },
  subjectCodes: [{
    type: String,
    required: true
  }],
  regulationYear: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);