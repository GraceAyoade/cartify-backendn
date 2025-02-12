import mongoose, { Schema, Document } from 'mongoose';

interface IReview extends Document {
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  reviewText: string;
  createdAt: Date;
}

const reviewSchema: Schema = new Schema({
  productId: { type: mongoose.Types.ObjectId, required: true, ref: 'Product' },
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model<IReview>('Review', reviewSchema);
export default Review;
