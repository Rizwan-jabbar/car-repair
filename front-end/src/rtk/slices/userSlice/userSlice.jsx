import { createSlice } from "@reduxjs/toolkit";
import { registerUser , loginUser , fetchCurrentUser} from "../../thunks/userThunk/userThunk";



const initialState = {
    user: (() => {
        try {
            const savedUser = localStorage.getItem('authUser');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch {
            localStorage.removeItem('authUser');
            return null;
        }
    })(),
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
            localStorage.removeItem('authUser');
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
            localStorage.setItem('authUser', JSON.stringify(action.payload.user || null));
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
            localStorage.setItem('authUser', JSON.stringify(action.payload || null));
        }).addCase(fetchCurrentUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            if (typeof action.payload === 'object' && ['invalid token', 'access denied'].some((message) => String(action.payload?.message || '').toLowerCase().includes(message))) {
                state.user = null;
                localStorage.removeItem('token');
                localStorage.removeItem('authUser');
            }
        })
    }
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;