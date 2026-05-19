import mongoose from "mongoose";


const bannerSchema = new mongoose.Schema({
    imageOne: {
        type: String,
        required: true
    },
    imageTwo: {
        type: String,
        required: true
    },

    imageThree : {
        type : String,
        required : true
    },
    title: {
        type: String,
        required: true
    },
    description: {  
        type: String,
        required: true
    },
    link: { 
        type: String,
        required: true
    }
}, { timestamps: true })

const Banner = mongoose.model("Banner" , bannerSchema)

export default Banner