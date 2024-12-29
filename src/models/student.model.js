import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    rollNumber: {
      type: String,
      required: true,
    },
    subjectCodes: [
      {
        type: String,
        required: true,
      },
    ],
    regulationYear: {
      type: String,
      required: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
  },
  { timestamps: true }
);

// Add a compound index for rollNumber and semester
studentSchema.index({ rollNumber: 1, semester: 1 }, { unique: true });
export default mongoose.model("Student", studentSchema);
