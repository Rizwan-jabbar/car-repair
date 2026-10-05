import Service from "../../models/servicesModel/servicesModel.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const uploadsPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../uploads')

const toPersistentImage = (file) => {
    if (!file?.path || !file?.mimetype) return ''

    const imageData = fs.readFileSync(file.path).toString('base64')
    return `data:${file.mimetype};base64,${imageData}`
}

const migrateLegacyImage = (service) => {
    if (!service?.image || !service.image.includes('/uploads/')) return false

    let filename = ''
    try {
        filename = path.basename(new URL(service.image).pathname)
    } catch {
        filename = path.basename(service.image)
    }

    const filePath = path.join(uploadsPath, filename)
    if (!filename || !fs.existsSync(filePath)) return false

    const imageData = fs.readFileSync(filePath).toString('base64')
    const extension = path.extname(filename).toLowerCase()
    const mimeType = extension === '.jpg' || extension === '.jpeg' ? 'image/jpeg' : `image/${extension.slice(1)}`
    service.image = `data:${mimeType};base64,${imageData}`
    return true
}

const addService = async (req, res) => {
    try {
        const { title, description, isAvailable } = req.body;
        if (!title || !description || !req.file) {
            return res.status(400).json({ message: 'Please fill in all fields and upload an image' });
        }
        const service = await Service.create({
            title,
            description,
            isAvailable: isAvailable !== 'false',
            image: toPersistentImage(req.file),
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
        await Promise.all(services.map(async (service) => {
            if (migrateLegacyImage(service)) await service.save()
        }))
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
        const { title, description } = req.body;
        const service = await Service.findByIdAndUpdate(
            serviceId,
            { title, description },
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