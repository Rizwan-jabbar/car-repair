import express from 'express';
import userController from '../controller/userController/userController.js';
import authMiddleWare from '../middleWare/authMiddleWare/authMiddleWare.js';
import bookingController from '../controller/bookingController/bookingController.js';
import reviewController from '../controller/reviewController/reviewController.js';
import optionalAuthMiddleWare from '../middleWare/optionalAuthMiddleWare/optionalAuthMiddleWare.js';
import serviceController from '../controller/serviceController/serviceController.js';
import faqController from '../controller/faqController/faqController.js';
import contactController from '../controller/contactController/contactController.js';
import bannerController from '../controller/bannerController/bannerController.js';
import upload from '../middleWare/uploadImage/uploadImage.js';
import roleAuthMiddleWare from '../middleWare/roleAuthMiddleWare/roleAuthMiddleWare.js';
import aiController from '../controller/aiController/aiController.js';
import emergencyBookingRoutes from './emergencyBookingRoutes.js';
const router = express.Router();
router.use(emergencyBookingRoutes);

const bannerUpload = upload.fields([
	{ name: 'imageOne', maxCount: 1 },
	{ name: 'imageTwo', maxCount: 1 },
	{ name: 'imageThree', maxCount: 1 }
])

const serviceUpload = (req, res, next) => {
	upload.single('image')(req, res, (error) => {
		if (error) {
			return res.status(400).json({ message: error.message || 'Invalid service image' })
		}
		next()
	})
}



// user routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/currentUser', authMiddleWare, userController.getCurrentUser);




// booking routes
router.post('/bookings', authMiddleWare, roleAuthMiddleWare(['user']), bookingController.createBooking);
router.get('/bookings', authMiddleWare, roleAuthMiddleWare(['user']), bookingController.getUserBooking);
router.get('/allBookings', authMiddleWare, roleAuthMiddleWare(['admin']), bookingController.getAllBookings);
router.patch('/bookings/:bookingId/status', authMiddleWare, roleAuthMiddleWare(['admin']), bookingController.updateBookingStatus);
router.patch('/bookings/:bookingId/cancel', authMiddleWare, roleAuthMiddleWare(['user']), bookingController.cancelBooking);
router.patch('/bookings/:bookingId/arrival', authMiddleWare, roleAuthMiddleWare(['admin']), bookingController.updateBookingArrival);



// review routes
router.post('/reviews', optionalAuthMiddleWare, reviewController.createReview);
router.get('/reviews', reviewController.getReviews);
router.patch('/reviews/:reviewId/toggle-visibility', authMiddleWare, roleAuthMiddleWare(['admin']), reviewController.toggleReviewVisibility);
router.delete('/reviews/:reviewId', authMiddleWare, roleAuthMiddleWare(['admin']), reviewController.deleteReview);



// services routes
router.post('/addServices', authMiddleWare, roleAuthMiddleWare(['admin']), serviceUpload, serviceController.addService);
router.get('/getServices', serviceController.getServices);
router.get('/admin/services', authMiddleWare, roleAuthMiddleWare(['admin']), serviceController.getAdminServices);
router.get('/services/:serviceId', serviceController.getServiceById);
router.delete('/deleteService/:serviceId', authMiddleWare, roleAuthMiddleWare(['admin']), serviceController.deleteService);
router.put('/updateService/:serviceId', authMiddleWare, roleAuthMiddleWare(['admin']), serviceUpload, serviceController.updateService);
router.patch('/toggleServiceAvailability/:serviceId', authMiddleWare, roleAuthMiddleWare(['admin']), serviceController.toggleServiceAvailability);







// faq routes
router.post('/addFaq', authMiddleWare, roleAuthMiddleWare(['admin']), faqController.addFaq);
router.get('/getFaqs', faqController.getFaqs);
router.delete('/deleteFaq/:faqId', authMiddleWare, roleAuthMiddleWare(['admin']), faqController.deleteFaq);
router.put('/updateFaq/:faqId', authMiddleWare, roleAuthMiddleWare(['admin']), faqController.updateFaq);




// contact routes
router.post('/contact', contactController.createContact);
router.get('/contacts', authMiddleWare, roleAuthMiddleWare(['admin']), contactController.getAllContacts);


// banner routes
router.post('/banners', authMiddleWare, roleAuthMiddleWare(['admin']), bannerUpload, bannerController.createBanner);
router.get('/banners', bannerController.getAllBanners);
router.get('/banners/latest', bannerController.getLatestBanner);
router.put('/banners/:bannerId', authMiddleWare, roleAuthMiddleWare(['admin']), bannerUpload, bannerController.updateBanner);



// ai routes
router.post('/ask-ai', aiController.askFromAI);

export default router;
