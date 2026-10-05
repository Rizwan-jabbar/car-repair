import express from 'express'
import authMiddleWare from '../middleWare/authMiddleWare/authMiddleWare.js'
import roleAuthMiddleWare from '../middleWare/roleAuthMiddleWare/roleAuthMiddleWare.js'
import emergencyBookingController from '../controller/emergencyBookingController/emergencyBookingController.js'

const router = express.Router()

router.post(
    '/emergency-bookings',
    authMiddleWare,
    roleAuthMiddleWare(['user']),
    emergencyBookingController.createEmergencyBooking,
)

export default router
