
import mongoose, { Document, Schema } from 'mongoose';

export interface IQuizScore {
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
}

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedLessons: string[];
  lastAccessedLesson?: string;
  quizScores: IQuizScore[];
  overallProgress: number;
  createdAt: Date;
  updatedAt: Date;
}

const QuizScoreSchema: Schema = new Schema({
  quizId: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  completedAt: { type: String, required: true },
});

const ProgressSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    completedLessons: [{ type: String }],
    lastAccessedLesson: { type: String },
    quizScores: [QuizScoreSchema],
    overallProgress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Ensure uniqueness for userId + courseId combination
ProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export default mongoose.model<IProgress>('Progress', ProgressSchema);
