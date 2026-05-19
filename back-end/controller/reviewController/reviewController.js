import Review from '../../models/reviewModel/reviewModel.js';
import User from '../../models/userModel/userModel.js';

const createReview = async (req, res) => {
    try {
        const {
            name,
            phone,
            email,
            rating,
            title,
            service,
            body,
            verified,
        } = req.body;

        if (!rating || !title || !service || !body) {
            return res.status(400).json({ message: 'Rating, title, service and body are required' });
        }

        // If logged in, we can auto-fill missing identity fields from the user profile.
        let finalName = name;
        let finalPhone = phone;
        let finalEmail = email;
        let finalVerified = Boolean(verified);
        let userId = null;

        if (req.user?.userId) {
            userId = req.user.userId;
            const user = await User.findById(userId).select('name email contact');

            if (user) {
                finalName = finalName || user.name;
                finalEmail = finalEmail || user.email;
                finalPhone = finalPhone || user.contact;
                // Logged-in review can be treated as verified by default.
                finalVerified = true;
            }
        }

        if (!finalName) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const review = await Review.create({
            user: userId,
            name: finalName,
            phone: finalPhone,
            email: finalEmail,
            rating,
            title,
            service,
            body,
            verified: finalVerified,
        });

        return res.status(201).json({ message: 'Review created', review });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        return res.status(200).json({ reviews });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};




const toggleReviewVisibility = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.visible = !review.visible;
        await review.save();

        return res.status(200).json({ message: 'Review visibility updated', review });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};



const deleteReview = async (req , res) => {

    try {
        const { reviewId } = req.params;

        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await review.deleteOne();

        return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }

}




const reviewController = {
    createReview,
    getReviews,
    toggleReviewVisibility,
    deleteReview,
};

export default reviewController;
