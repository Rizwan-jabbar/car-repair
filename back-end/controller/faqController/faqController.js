import Faq from "../../models/faqModel/faqModel.js";



const addFaq = async (req , res) => {
    try {
        const { question, answer , category } = req.body;

        if (!question || !answer || !category) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const newFaq = new Faq({
            question: question.trim(),
            answer: answer.trim(),
            category: category.trim(),
            });

        await newFaq.save();
        return res.status(201).json({ message: 'FAQ added successfully', faq: newFaq });

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}


const getFaqs = async (req , res) => {
    try {
        const faqs = await Faq.find();
        return res.status(200).json({ faqs });

    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}


const  updateFaq = async (req , res) => {
    try {
        const { faqId } = req.params;
        const { question, answer  , category} = req.body;

        if (!question || !answer || !category) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const updatedFaq = await Faq.findByIdAndUpdate(
            faqId,
            { question: question.trim(), answer: answer.trim(), category: category.trim() },
            { new: true }
        );
        return res.status(200).json({ message: 'FAQ updated successfully', faq: updatedFaq });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}


const deleteFaq = async (req , res) => {
    try {
        const { faqId } = req.params;
        await Faq.findByIdAndDelete
        (faqId);
        return res.status(200).json({ message: 'FAQ deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
}


const faqController = {
    addFaq,
    getFaqs,
    updateFaq,
    deleteFaq,
}

export default faqController
