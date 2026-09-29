import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { getVerifiedToken } from '../../utils/authToken';
import { API_BASE_URL } from '../../utils/apiUrl';




export const createContact = createAsyncThunk(
    'contact/createContact',
    async (contactData, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/contact`, contactData);
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to send message' });
        }
    }
)


export const getAllContacts = createAsyncThunk(
    'contact/getAllContacts',
    async (_, { rejectWithValue }) => { 
        try {
            const token = getVerifiedToken()
            if(!token){
                return rejectWithValue({ message : "Unauthorized" })
            }
            const response = await axios.get(`${API_BASE_URL}/contacts`, {
                headers : {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.data;
        }
        catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Failed to fetch contacts' });
        }
    }
)



