import mongoose from 'mongoose'



const contactSchema  = mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim: true,
    },
    phone : {
        type : String,
        required : true,
        trim: true,
    },

    email : {
        type : String,
        required : false,
        trim: true,
        default: '',
    },
    message : {
        type : String,
        required : true,
        trim: true,
    }
}, { timestamps: true })

const Contact = mongoose.model('Contact' , contactSchema)

export default Contact