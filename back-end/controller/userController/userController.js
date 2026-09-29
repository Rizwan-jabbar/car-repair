import User from "../../models/userModel/userModel.js";
import bcrypt from "bcrypt"

import jwt from "jsonwebtoken";


const emailFormat = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const contactFormat = (contact) => {
    const contactRegex = /^\d{10,15}$/;
    return contactRegex.test(contact);
}


const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';


const registerUser = async (req, res) => {
    try {

        const { name, email, contact, password } = req.body;

        if (!name || !email || !contact || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check if the email format is valid
        if (!emailFormat(email)) {
            return res.status(400).json({ message: 'Please enter a valid email address' });
        }


        if (!contactFormat(contact)) {
            return res.status(400).json({ message: 'Please enter a valid contact number' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);


        // Create a new user
        const newUser = new User({
            name,
            email,
            contact,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });



    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}


const loginUser = async (req, res) => {
    try {



        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign
            ({ userId: 'admin', role: 'admin' }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
            );

            return res.status(200).json({ message: 'Login successful', user: { _id: 'admin', email: adminEmail, role: 'admin' }, token });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return res.status(200).json({ message: 'Login successful', user, token });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
};




const getCurrentUser = async ( req  , res) => {
    try {
            if (!req.user?.userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Handle special admin login (not stored in DB)
            if (req.user.userId === 'admin' && req.user.role === 'admin') {
                return res.status(200).json({
                    user: {
                        _id: 'admin',
                        email: adminEmail,
                        role: 'admin',
                        name: 'Admin',
                    },
                });
            }

            const user = await User.findById(req.user.userId).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ user });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const userController = {
    registerUser,
    loginUser,
    getCurrentUser
}

export default userController;


