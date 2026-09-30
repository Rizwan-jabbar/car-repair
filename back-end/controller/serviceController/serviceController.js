import Service from "../../models/servicesModel/servicesModel.js";

const addService = async (req, res) => {
    try {
        const { title, description, price, isAvailable } = req.body;
        if (!title || !description || price === undefined || !req.file) {
            return res.status(400).json({ message: 'Please fill in all fields and upload an image' });
        }
        const service = await Service.create({
            title,
            description,
            price,
            isAvailable: isAvailable !== 'false',
            image: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        });
        return res.status(201).json({ message: 'Service added successfully', service });
    } catch (error) {
        console.error('Add service error:', error);
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};




const getServices = async (req, res) => {
    try {
        const services = await Service.find();
        return res.status(200).json({ services });  
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}; 



const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const service = await Service.findByIdAndDelete(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        return res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};



const updateService = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const { title, description, price } = req.body;
        const service = await Service.findByIdAndUpdate(
            serviceId,
            { title, description, price },
            { new: true }
        );
        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        return res.status(200).json({ message: 'Service updated successfully', service });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const toggleServiceAvailability = async (req, res) => {
    try {
        const { serviceId } = req.params;
        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({ message: 'Service not found' });
        }
        service.isAvailable = !service.isAvailable;
        await service.save();
        return res.status(200).json({ message: 'Service availability toggled successfully', service });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const serviceController = {
    addService,
    getServices,
    deleteService,
    updateService,
    toggleServiceAvailability,
};

export default serviceController