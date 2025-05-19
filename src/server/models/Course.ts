
import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: string;
  quizzes?: IQuiz[];
}

export interface IQuiz extends Document {
  id: string;
  title: string;
  questions: IQuestion[];
}

export interface IQuestion extends Document {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
}

export interface IModule extends Document {
  id: string;
  title: string;
  lessons: ILesson[];
}

export interface ICourse extends Document {
  id: string;
  title: string;
  description: string;
  instructorId: mongoose.Types.ObjectId;
  instructorName: string;
  thumbnail: string;
  duration: string;
  modules: IModule[];
  enrolledStudents: mongoose.Types.ObjectId[];
  rating?: number;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema: Schema = new Schema({
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctOptionIndex: { type: Number, required: true },
});

const QuizSchema: Schema = new Schema({
  title: { type: String, required: true },
  questions: [QuestionSchema],
});

const LessonSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  videoUrl: { type: String },
  duration: { type: String, required: true },
  quizzes: [QuizSchema],
});

const ModuleSchema: Schema = new Schema({
  title: { type: String, required: true },
  lessons: [LessonSchema],
});

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    instructorName: { type: String, required: true },
    thumbnail: { type: String, required: true },
    duration: { type: String, required: true },
    modules: [ModuleSchema],
    enrolledStudents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    rating: { type: Number },
    category: { type: String, required: true },
  },
  { timestamps: true }
);

// Create a virtual 'id' field that maps to _id
CourseSchema.virtual('id').get(function () {
  return this._id.toString();
});

// Ensure the virtual fields are included when converting to JSON
CourseSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model<ICourse>('Course', CourseSchema);
