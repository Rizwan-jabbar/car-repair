import mongoose from 'mongoose'
import Counter from '../counterModel/counterModel.js'

const emergencyBookingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    vehicleBrand: { type: String, required: true, trim: true },
    carModel: { type: String, required: true, trim: true },
    registrationNumber: { type: String, trim: true, default: '' },
    service: { type: String, default: 'Emergency Mechanic' },
    problemDescription: { type: String, required: true, trim: true },
    locationType: { type: String, default: 'Mechanic at My Location' },
    cityArea: { type: String, required: true, trim: true },
    completeAddress: { type: String, required: true, trim: true },
    bookingType: { type: String, default: 'Emergency' },
    emergencyType: { type: String, required: true, trim: true },
    preferredDate: { type: Date, default: Date.now },
    preferredTime: { type: String, default: 'ASAP' },
    consent: { type: Boolean, default: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Mechanic Assigned', 'In Progress', 'Completed', 'Cancelled'], default: 'Pending' },
    referenceNumber: { type: String, unique: true, index: true },
}, { timestamps: true })

emergencyBookingSchema.pre('save', async function () {
    if (this.referenceNumber) return
    const year = new Date().getFullYear()
    const counter = await Counter.findOneAndUpdate(
        { name: 'bookingReference' },
        { $inc: { sequence: 1 } },
        { new: true, upsert: true },
    )
    this.referenceNumber = `CR-${year}-${String(counter.sequence).padStart(4, '0')}`
})

const EmergencyBooking = mongoose.model('EmergencyBooking', emergencyBookingSchema)
export default EmergencyBooking
