import EmergencyBooking from '../../models/emergencyBookingModel/emergencyBookingModel.js'

const createEmergencyBooking = async (req, res) => {
    try {
        const userId = req.user?.userId || null

        const {
            fullName,
            phone,
            vehicleBrand,
            carModel,
            registrationNumber,
            cityArea,
            completeAddress,
            emergencyType,
            problemDescription,
        } = req.body

        if (!fullName || !phone || !vehicleBrand || !carModel || !cityArea || !completeAddress || !emergencyType || !problemDescription) {
            return res.status(400).json({ message: 'Please provide all emergency request details' })
        }

        const booking = await EmergencyBooking.create({
            user: userId || undefined,
            fullName,
            phone,
            vehicleBrand,
            carModel,
            registrationNumber,
            cityArea,
            completeAddress,
            emergencyType,
            problemDescription,
        })

        return res.status(201).json({ message: 'Emergency request created', booking })
    } catch (error) {
        console.error('Create emergency booking error:', error)
        return res.status(500).json({ message: error.message || 'Internal server error' })
    }
}

const emergencyBookingController = { createEmergencyBooking }
export default emergencyBookingController
