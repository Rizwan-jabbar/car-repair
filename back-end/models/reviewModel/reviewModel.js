import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        name: { type: String, required: true, trim: true },
        phone: { type: String, trim: true },
        email: { type: String, trim: true },

        rating: { type: Number, required: true, min: 1, max: 5 },
        title: { type: String, required: true, trim: true },
        service: { type: String, required: true, trim: true },
        body: { type: String, required: true, trim: true },
        visible: { type: Boolean, default: true },

        verified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;
