import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import { getVerifiedToken } from "../../utils/authToken";

export const registerUser = createAsyncThunk(
    'user/registerUser',

    async (userData, {rejectWithValue}) => {
        try {
            const response = await axios.post('/api/auth/register', userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Registration failed');
        }
    }
);



export const loginUser = createAsyncThunk(
    'user/loginUser',
    async (credentials, {rejectWithValue}) => {
        try {   
            const response = await axios.post('/api/auth/login', credentials);
            localStorage.setItem('token', response.data.token);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || 'Login failed');
        }
    }
);


export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, {rejectWithValue}) => {
        try {
            const token = getVerifiedToken();
            if (!token) {
                return rejectWithValue('No token found');
            }
            const response = await axios.get('/api/auth/currentUser', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.user;
        }
        catch (error) { 
            return rejectWithValue(error.response?.data || 'Failed to fetch user');
        }
    }
);


