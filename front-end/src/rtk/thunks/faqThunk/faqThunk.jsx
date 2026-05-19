import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getVerifiedToken } from "../../utils/authToken";

export const addFaq = createAsyncThunk(
    'faq/addFaq',
    async (faqData, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken()
            if (!token) throw new Error('Authentication required')
            const headers = { Authorization: `Bearer ${token}` }
            const response = await axios.post('/api/auth/addFaq', faqData, { headers })
            return response.data.faq
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add FAQ')
        }
    }
)

export const fetchFaqs = createAsyncThunk(
    'faq/fetchFaqs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/auth/getFaqs')
            return response.data.faqs || []
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to load FAQs')
        }
    }
)

export const deleteFaq = createAsyncThunk(
    'faq/deleteFaq',
    async (faqId, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken()
            if (!token) throw new Error('Authentication required')
            const headers = { Authorization: `Bearer ${token}` }
            await axios.delete(`/api/auth/deleteFaq/${faqId}`, { headers })
            return faqId
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete FAQ')
        }
    }
)

export const updateFaq = createAsyncThunk(
    'faq/updateFaq',
    async ({ faqId, faqData }, { rejectWithValue }) => {
        try {   
            const token = getVerifiedToken()
            if (!token) throw new Error('Authentication required')
            const headers = { Authorization: `Bearer ${token}` }
            const response = await axios.put(`/api/auth/updateFaq/${faqId}`, faqData, { headers })
            return response.data.faq
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update FAQ')
        }
    }
)
