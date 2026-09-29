import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getVerifiedToken } from "../../utils/authToken";
import { API_BASE_URL } from "../../utils/apiUrl";

export const addFaq = createAsyncThunk(
    'faq/addFaq',
    async (faqData, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken()
            if (!token) throw new Error('Authentication required')
            const headers = { Authorization: `Bearer ${token}` }
            const response = await axios.post(`${API_BASE_URL}/addFaq`, faqData, { headers })
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
            const response = await axios.get(`${API_BASE_URL}/getFaqs`)
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
            await axios.delete(`${API_BASE_URL}/deleteFaq/${faqId}`, { headers })
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
            const response = await axios.put(`${API_BASE_URL}/updateFaq/${faqId}`, faqData, { headers })
            return response.data.faq
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update FAQ')
        }
    }
)
