import Contact from "../../models/contactModel/contactModel.js";

const createContact = async (req , res) => {
    try {

        const { name , phone , email , message } = req.body
        const normalizedName = String(name || '').trim()
        const normalizedPhone = String(phone || '').trim()
        const normalizedEmail = String(email || '').trim()
        const normalizedMessage = String(message || '').trim()

        if(!normalizedName || !normalizedPhone || !normalizedMessage){
            return res.status(400).json({ message : "Please fill all the required fields" })
        }

        const contact = await Contact.create({
            name: normalizedName,
            phone: normalizedPhone,
            email: normalizedEmail,
            message: normalizedMessage
        })
        res.status(201).json({ message : "Contact created successfully" , contact })

        
    } catch (error) {
        console.error('createContact error:', error)
        if (error?.name === 'ValidationError' || error?.name === 'CastError') {
            return res.status(400).json({ message: error.message })
        }
        res.status(500).json({ message : "Error creating contact" })
    }
}



const getAllContacts = async (req , res) => {
    try {
        const user = req.user
        if(user.role !== "admin"){
            return res.status(403).json({ message : "Access denied" })
        }
        const contacts = await Contact.find()
        res.status(200).json({ message : "Contacts fetched successfully" , contacts })
    } catch (error) {
        res.status(500).json({ message : "Error fetching contacts" })
    }
}



const contactController = {
    createContact,
    getAllContacts
}
export default contactController