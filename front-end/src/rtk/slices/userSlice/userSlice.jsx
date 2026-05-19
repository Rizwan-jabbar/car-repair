import { createSlice } from "@reduxjs/toolkit";
import { registerUser , loginUser , fetchCurrentUser} from "../../thunks/userThunk/userThunk";



const initialState = {
    user: null,
    loading: false,
    error: null,
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.error = null;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })      
            .addCase(registerUser.fulfilled, (state, action) => {       

                state.loading = false;
                state.user = action.payload;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }
        ).addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
        }).addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })

        .addCase(fetchCurrentUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        }).addCase(fetchCurrentUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
        }).addCase(fetchCurrentUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
    }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;