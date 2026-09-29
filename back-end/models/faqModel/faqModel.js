import mongoose from "mongoose";


const faqSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        trim: true,
    },
    question: {
        type: String,
        required: true,
        trim: true,
    },
    answer: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true })

const Faq = mongoose.model('Faq', faqSchema)

export default Faq