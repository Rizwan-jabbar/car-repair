import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_BASE_URL } from '../../utils/apiUrl'

export const askAi = createAsyncThunk(
    'ai/askAi',
    async (question, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/ask-ai`, { question })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to get AI response' })
        }
    }
)
