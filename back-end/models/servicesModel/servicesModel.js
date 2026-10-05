import mongoose  from "mongoose";


const servicesSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        image: { type: String, default: '' },
        isAvailable: { type: Boolean, default: true },
        commonSymptoms: [{ type: String, trim: true }],
        inspectionPoints: [{ type: String, trim: true }],
    },
    { timestamps: true }
);

const Service = mongoose.model('Service', servicesSchema);
export default Service;
