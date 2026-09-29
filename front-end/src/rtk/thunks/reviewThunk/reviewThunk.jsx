import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { getVerifiedToken } from '../../utils/authToken'
import { API_BASE_URL } from '../../utils/apiUrl'




export const createReview = createAsyncThunk(
    'review/createReview',
    async (reviewData, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken()
            const headers = {}
            if (token) headers.Authorization = `Bearer ${token}`

            const response = await axios.post(`${API_BASE_URL}/reviews`, reviewData, { headers })
            return response.data.review
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Review submission failed')
        }
    }
)

export const fetchReviews = createAsyncThunk(
    'review/fetchReviews',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/reviews`)
            const payload = response?.data

            if (Array.isArray(payload)) return payload
            if (Array.isArray(payload?.reviews)) return payload.reviews
            if (Array.isArray(payload?.data)) return payload.data
            if (Array.isArray(payload?.result)) return payload.result

            return []
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to load reviews')
        }
    }
)



export const toggleReviewVisibility = createAsyncThunk(
    'review/toggleReviewVisibility',
    async (reviewId, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken()
            if (!token) throw new Error('Authentication required')
            const headers = { Authorization: `Bearer ${token}` }

            const response = await axios.patch(`${API_BASE_URL}/reviews/${reviewId}/toggle-visibility`, null, { headers })
            return response.data.review
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to toggle review visibility')
        }
    }
)