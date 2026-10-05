import express from 'express'
import emergencyBookingController from '../controller/emergencyBookingController/emergencyBookingController.js'

const router = express.Router()

router.post(
    '/emergency-bookings',
    emergencyBookingController.createEmergencyBooking,
)

export default router
