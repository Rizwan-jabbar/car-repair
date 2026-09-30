import mongoose  from "mongoose";


const servicesSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        image: { type: String, default: '' },
        isAvailable: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Service = mongoose.model('Service', servicesSchema);
export default Service;