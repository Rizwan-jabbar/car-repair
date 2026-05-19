import { createSlice } from '@reduxjs/toolkit'
import { askAi } from '../../thunks/aiThunk/aiThunk'

const initialState = {
    answer: '',
    loading: false,
    error: null,
}

const aiSlice = createSlice({
    name: 'ai',
    initialState,
    reducers: {
        clearAiAnswer: (state) => {
            state.answer = ''
            state.error = null
            state.loading = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(askAi.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(askAi.fulfilled, (state, action) => {
                state.loading = false
                state.answer = action.payload?.answer || ''
            })
            .addCase(askAi.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    }
})

export const { clearAiAnswer } = aiSlice.actions
export default aiSlice.reducer
