import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const askAi = createAsyncThunk(
    'ai/askAi',
    async (question, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/auth/ask-ai', { question })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Failed to get AI response' })
        }
    }
)
