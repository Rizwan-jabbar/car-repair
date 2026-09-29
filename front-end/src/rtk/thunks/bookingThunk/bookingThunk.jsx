import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getVerifiedToken } from "../../utils/authToken";
import { API_BASE_URL } from "../../utils/apiUrl";



export const bookRepair = createAsyncThunk(
    'booking/bookRepair',
    async (bookingData, { rejectWithValue }) => {   
        try {
            const token = getVerifiedToken();
            if (!token) {
                return rejectWithValue('No token found');
            }

            const response = await axios.post(`${API_BASE_URL}/bookings`, bookingData, {
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
            const response = await axios.get(`${API_BASE_URL}/bookings`, {
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
            const response = await axios.get(`${API_BASE_URL}/allBookings`, {
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
            const response = await axios.patch(`${API_BASE_URL}/bookings/${bookingId}/status`, { status }, {
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
            const response = await axios.patch(`${API_BASE_URL}/bookings/${bookingId}/arrival`, { arrivalDate, arrivalTime }, {
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