
import mongoose, { Document, Schema } from 'mongoose';

export interface ILearningPath extends Document {
  id: string;
  title: string;
  description: string;
  courses: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Create a virtual 'id' field that maps to _id
LearningPathSchema.virtual('id').get(function () {
  return this._id.toString();
});

// Ensure the virtual fields are included when converting to JSON
LearningPathSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model<ILearningPath>('LearningPath', LearningPathSchema);
