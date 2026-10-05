import Booking from "../../models/bookingModel/bookingModel.js";
import EmergencyBooking from "../../models/emergencyBookingModel/emergencyBookingModel.js";



const createBooking = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const {
            fullName,
            phone,
            email,
            carModel,
            vehicleBrand,
            manufacturingYear,
            registrationNumber,
            fuelType,
            transmission,
            service,
            otherService,
            problemDescription,
            locationType,
            cityArea,
            completeAddress,
            preferredDate,
            preferredTime,
            notes,
            consent,
            bookingType,
            emergencyType,
        } = req.body;

        const isEmergency = bookingType === 'Emergency';
        if (!fullName || !phone || !carModel || !service || (!isEmergency && (!preferredDate || !preferredTime))) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        if (service === 'Others' && !otherService) {
            return res.status(400).json({ message: 'Please describe the service' });
        }
        if (locationType === 'Mechanic at My Location' && (!cityArea || !completeAddress)) {
            return res.status(400).json({ message: 'City/area and complete address are required for a mechanic visit' });
        }
        if (bookingType === 'Emergency' && (!cityArea || !completeAddress || !emergencyType || !problemDescription)) {
            return res.status(400).json({ message: 'Emergency location and breakdown details are required' });
        }

        const booking = await Booking.create({
            user: userId,
            fullName,
            phone,
            email,
            carModel,
            vehicleBrand,
            manufacturingYear,
            registrationNumber,
            fuelType,
            transmission,
            service,
            otherService,
            problemDescription,
            locationType,
            cityArea,
            completeAddress,
            preferredDate: preferredDate || new Date(),
            preferredTime: preferredTime || 'ASAP',
            notes,
            consent,
            bookingType: isEmergency ? 'Emergency' : 'Regular',
            emergencyType,
        });

        res.status(201).json({ message: 'Booking created', booking });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
};

const getUserBooking = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
      const [regularBookings, emergencyBookings] = await Promise.all([
          Booking.find({ user: userId }),
          EmergencyBooking.find({ user: userId }),
      ]);
      const bookings = [...regularBookings, ...emergencyBookings].sort((a, b) => b.createdAt - a.createdAt);
      res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}



const getAllBookings = async (req, res) => {
    try {
        const [regularBookings, emergencyBookings] = await Promise.all([
            Booking.find(),
            EmergencyBooking.find(),
        ]);
        const bookings = [...regularBookings, ...emergencyBookings].sort((a, b) => b.createdAt - a.createdAt);
        res.status(200).json({ bookings });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}




const updateBookingStatus  = async (req , res) => {
    try {

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
            const { bookingId } = req.params;
            const { status } = req.body;

            if (!['Pending', 'Confirmed', 'Mechanic Assigned', 'In Progress', 'Completed', 'Cancelled'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status value' });
            }

            const booking = await Booking.findById(bookingId) || await EmergencyBooking.findById(bookingId);

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

                booking.status = status;
                await booking.save();
            res.status(200).json({ message: 'Booking status updated', booking });

        
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}



const updateBookingArrival = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { bookingId } = req.params;
        const { arrivalDate, arrivalTime } = req.body;

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!arrivalDate || !arrivalTime) {
            return res.status(400).json({ message: 'Arrival date and time are required' });
        }

        const parsedArrivalDate = new Date(arrivalDate);
        if (Number.isNaN(parsedArrivalDate.getTime())) {
            return res.status(400).json({ message: 'Invalid arrival date' });
        }

        const booking = await Booking.findById(bookingId) || await EmergencyBooking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.arrivalDate = parsedArrivalDate;
        booking.arrivalTime = arrivalTime;
        await booking.save();
        res.status(200).json({ message: 'Booking arrival updated', booking });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server error' });
    }
}


const bookingController = {
    createBooking,
    getUserBooking,
    getAllBookings,
    updateBookingStatus,
    updateBookingArrival,
};
export default bookingController;