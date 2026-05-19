import { createSlice } from "@reduxjs/toolkit";
import { createContact, getAllContacts } from "../../thunks/contactThunk/contactThunk";


const initialState = {
    contacts : [],
    loading : false,
    error : null
}

const contactSlice = createSlice({
    name : 'contact',
    initialState,
    reducers : {
       
    },
    extraReducers : (builder) => {
        builder
            .addCase(createContact.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createContact.fulfilled, (state, action) => {
                state.loading = false;
                const contact = action.payload?.contact;
                if (contact) {
                    state.contacts.push(contact);
                }
            })
            .addCase(createContact.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Handle getAllContacts async thunk
        builder
            .addCase(getAllContacts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.contacts = Array.isArray(action.payload?.contacts) ? action.payload.contacts : [];
            })
            .addCase(getAllContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default contactSlice.reducer;
