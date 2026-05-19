import { createSlice } from "@reduxjs/toolkit";
import { addFaq, deleteFaq, fetchFaqs, updateFaq } from "../../thunks/faqThunk/faqThunk";



const initialState = {
    items: [],
    created: null,
    loading: false,
    error: null,
}

const faqSlice = createSlice({
    name: 'faq',
    initialState,
    reducers: {
        resetFaqCreate: (state) => {
            state.created = null
            state.error = null
            state.loading = false
        }
    },
    extraReducers: (builder) => {   
        builder
            .addCase(addFaq.pending, (state) => {   
                state.loading = true
                state.error = null
                state.created = null
            }
            )
            .addCase(addFaq.fulfilled, (state, action) => {
                state.loading = false
                state.created = action.payload
                // Optimistically add to list
                state.items = [action.payload, ...state.items]
            }
            )
            .addCase(addFaq.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            } )
            .addCase(fetchFaqs.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchFaqs.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchFaqs.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            }
            )
            .addCase(deleteFaq.fulfilled, (state, action) => {
                state.loading = false
                state.items = state.items.filter((faq) => (faq?._id ?? faq?.id) !== action.payload)
            }
            )
            .addCase(deleteFaq.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            }
            )
            .addCase(deleteFaq.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateFaq.fulfilled, (state, action) => {
                state.loading = false
                const updatedFaq = action.payload
                const id = updatedFaq?._id ?? updatedFaq?.id
                state.items = state.items.map((faq) => {

                    const faqData = faq?.faq ?? faq
                    const faqId = faqData?._id ?? faqData?.id
                    if (faqId === id) {
                        return action.payload
                    }
                    return faq
                })  

            })
            .addCase(updateFaq.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateFaq.pending, (state) => {
                state.loading = true
                state.error = null
            })
    },
})

export const { resetFaqCreate } = faqSlice.actions
export default faqSlice.reducer