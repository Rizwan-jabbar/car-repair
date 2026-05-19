import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getVerifiedToken } from "../../utils/authToken";



export const bookRepair = createAsyncThunk(
    'booking/bookRepair',
    async (bookingData, { rejectWithValue }) => {   
        try {
            const token = getVerifiedToken();
            if (!token) {
                return rejectWithValue('No token found');
            }

            // Backend is mounted at /api/auth/* and Vite proxies /api -> http://localhost:5000
            const response = await axios.post('/api/auth/bookings', bookingData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Booking failed');
        }
    }
);


export const getUserBookings = createAsyncThunk(
    'booking/getUserBookings',
    async (_, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken();
            if (!token) {
                return rejectWithValue('No token found');
            }
            const response = await axios.get('/api/auth/bookings', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        }
            catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch bookings');
        }
    }
);



export const getAllBookings = createAsyncThunk(
    'booking/getAllBookings',
    async (_, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken();
            if (!token) {
                return rejectWithValue('No token found');
            }
            const response = await axios.get('/api/auth/allBookings', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch bookings');
        }
    }
);


export const updateBookingStatus = createAsyncThunk(
    'booking/updateBookingStatus',
    async ({ bookingId, status }, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken();
            if (!token) {
                return rejectWithValue('No token found');
            }   
            const response = await axios.patch(`/api/auth/bookings/${bookingId}/status`, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update booking status');
        }
    }
);


export const updateBookingArrival = createAsyncThunk(
    'booking/updateBookingArrival',
    async ({ bookingId, arrivalDate, arrivalTime }, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken();
            if (!token) {
                return rejectWithValue('No token found');
            }
            const response = await axios.patch(`/api/auth/bookings/${bookingId}/arrival`, { arrivalDate, arrivalTime }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update booking arrival');
        }
    }
);