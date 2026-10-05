import mongoose from "mongoose";



const bookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    carModel: { type: String, required: true, trim: true },
    vehicleBrand: { type: String, trim: true, default: '' },
    manufacturingYear: { type: String, trim: true, default: '' },
    registrationNumber: { type: String, trim: true, default: '' },
    fuelType: { type: String, trim: true, default: '' },
    transmission: { type: String, trim: true, default: '' },
    service: { type: String, required: true },
    otherService: { type: String, trim: true },
    problemDescription: { type: String, trim: true, default: '' },
    locationType: { type: String, enum: ['Visit Workshop', 'Mechanic at My Location'], default: 'Visit Workshop' },
    cityArea: { type: String, trim: true, default: '' },
    completeAddress: { type: String, trim: true, default: '' },
    bookingType: { type: String, enum: ['Regular', 'Emergency'], default: 'Regular' },
    emergencyType: { type: String, trim: true, default: '' },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    notes: { type: String },
    consent: { type: Boolean, default: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Mechanic Assigned', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    referenceNumber: { type: String, unique: true, sparse: true, index: true },
    arrivalTime: { type: String, trim: true },
    arrivalDate: { type: Date },
}, { timestamps: true });

bookingSchema.pre('save', async function (next) {
    if (this.referenceNumber) return next();
    const year = new Date().getFullYear();
    const count = await mongoose.model('Booking').countDocuments();
    this.referenceNumber = `CR-${year}-${String(count + 1).padStart(4, '0')}`;
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
