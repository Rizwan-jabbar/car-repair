import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getVerifiedToken } from '../../utils/authToken';
import { API_BASE_URL } from '../../utils/apiUrl';


const API_URL = `${API_BASE_URL}/banners`;

export const createBanner = createAsyncThunk(
    'banners/createBanner',
    async (bannerData, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken();
            if (!token) throw new Error('Authentication required');

            const response = await axios.post(API_URL, bannerData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;

        } catch (error) {
            console.error('Error creating banner:', error);
            return rejectWithValue(error.response?.data?.message || 'Error creating banner');
        }
    }
);

export const fetchLatestBanner = createAsyncThunk(
    'banners/fetchLatestBanner',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/latest`);
            return response.data;
        } catch (error) {
            if (error?.response?.status === 404) {
                return null;
            }
            return rejectWithValue(error.response?.data?.message || 'Error fetching latest banner');
        }
    },
);

export const updateBanner = createAsyncThunk(
    'banners/updateBanner',
    async ({ bannerId, bannerData }, { rejectWithValue }) => {
        try {
            const token = getVerifiedToken();
            if (!token) throw new Error('Authentication required');

            const response = await axios.put(`${API_URL}/${bannerId}`, bannerData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error updating banner');
        }
    },
);

export const fetchBanners = createAsyncThunk(
    'banners/fetchBanners',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            console.error('Error fetching banners:', error);
            return rejectWithValue(error.response?.data?.message || 'Error fetching banners');
        }   
    }
);