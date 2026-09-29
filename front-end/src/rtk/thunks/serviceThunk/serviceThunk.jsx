import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getVerifiedToken } from "../../utils/authToken";
import { API_BASE_URL } from '../../utils/apiUrl';




export const createService = createAsyncThunk(
    'service/createService',
    async (serviceData, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken()
            if (!token) throw new Error('Authentication required')
            const headers = { Authorization: `Bearer ${token}` }
            const response = await axios.post(`${API_BASE_URL}/addServices`, serviceData, { headers });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to create service');
        }
    }
);

export const fetchServices = createAsyncThunk(
    'service/fetchServices',
    async (_, { rejectWithValue }) => { 
        try {   
            const response = await axios.get(`${API_BASE_URL}/getServices`);
            return response.data.services || [];
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch services');
        }
    }
);

export const updateService = createAsyncThunk(
    'service/updateService',
    async ({ serviceId, serviceData }, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken()
            if (!token) throw new Error('Authentication required')

            const headers = { Authorization: `Bearer ${token}` }
            const response = await axios.put(
                `${API_BASE_URL}/updateService/${serviceId}`,
                serviceData,
                { headers },
            )

            return {
                ...response.data,
                service: response.data?.service,
                serviceId: response.data?.service?._id || serviceId,
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update service')
        }
    },
)

export const deleteService = createAsyncThunk(
    'service/deleteService',
    async (serviceId, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken()
            if (!token) throw new Error('Authentication required')

            const headers = { Authorization: `Bearer ${token}` }
            const response = await axios.delete(`${API_BASE_URL}/deleteService/${serviceId}`, { headers })

            return {
                ...response.data,
                serviceId,
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete service')
        }
    },
)

export const toggleServiceAvailability = createAsyncThunk(
    'service/toggleServiceAvailability',
    async (serviceId, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken()
            if (!token) throw new Error('Authentication required')

            const headers = { Authorization: `Bearer ${token}` }
            const response = await axios.patch(
                `${API_BASE_URL}/toggleServiceAvailability/${serviceId}`,
                {},
                { headers },
            )

            return {
                ...response.data,
                service: response.data?.service,
                serviceId: response.data?.service?._id || serviceId,
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to toggle service availability')
        }
    },
)