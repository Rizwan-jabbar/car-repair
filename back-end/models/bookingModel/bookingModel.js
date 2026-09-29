import mongoose from "mongoose";



const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    carModel: { type: String, required: true, trim: true },
    service: { type: String, required: true },
    otherService: { type: String, trim: true },
    cityArea: { type: String, required: true, trim: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    notes: { type: String },
    consent: { type: Boolean, default: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    arrivalTime: { type: String, trim: true },
    arrivalDate: { type: Date },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
