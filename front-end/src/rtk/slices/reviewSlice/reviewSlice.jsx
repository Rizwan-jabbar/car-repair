import { createSlice } from '@reduxjs/toolkit'
import { createReview, fetchReviews , toggleReviewVisibility } from '../../thunks/reviewThunk/reviewThunk'

const initialState = {
    items: [],
    created: null,
    loading: false,
    error: null,
}

const reviewSlice = createSlice({
    name: 'review',
    initialState,
    reducers: {
        resetReviewCreate: (state) => {
            state.created = null
            state.error = null
            state.loading = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createReview.pending, (state) => {
                state.loading = true
                state.error = null
                state.created = null
            })
            .addCase(createReview.fulfilled, (state, action) => {
                state.loading = false
                state.created = action.payload
                // Optimistically add to list
                state.items = [action.payload, ...state.items]
            })
            .addCase(createReview.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(toggleReviewVisibility.fulfilled, (state, action) => {
                const updatedReview = action.payload
                const id = updatedReview?._id ?? updatedReview?.id
                const review = state.items.find((r) => (r?._id ?? r?.id) === id)
                if (review) {
                    review.visible = Boolean(updatedReview?.visible)
                    review.isVisible = Boolean(updatedReview?.visible)
                }
            })
    },
})

export const { resetReviewCreate } = reviewSlice.actions
export default reviewSlice.reducer
