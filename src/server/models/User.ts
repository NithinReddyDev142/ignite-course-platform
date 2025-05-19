
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'instructor' | 'student';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['instructor', 'student'], default: 'student' },
    avatar: { type: String },
  },
  { timestamps: true }
);

// Create a virtual 'id' field that maps to _id
UserSchema.virtual('id').get(function () {
  return this._id.toString();
});

// Ensure the virtual fields are included when converting to JSON
UserSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    delete ret.password; // Don't send password in responses
    return ret;
  },
});

export default mongoose.model<IUser>('User', UserSchema);
