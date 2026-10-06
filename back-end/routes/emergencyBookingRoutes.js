import express from 'express'
import emergencyBookingController from '../controller/emergencyBookingController/emergencyBookingController.js'
import authMiddleWare from '../middleWare/authMiddleWare/authMiddleWare.js'
import roleAuthMiddleWare from '../middleWare/roleAuthMiddleWare/roleAuthMiddleWare.js'

const router = express.Router()

router.post(
    '/emergency-bookings',
    authMiddleWare,
    roleAuthMiddleWare(['user']),
    emergencyBookingController.createEmergencyBooking,
)

export default router
