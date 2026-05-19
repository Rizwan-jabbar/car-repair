import { createSlice } from "@reduxjs/toolkit";
import {
    createService,
    deleteService,
    fetchServices,
    toggleServiceAvailability,
    updateService,
} from "../../thunks/serviceThunk/serviceThunk";
const initialState = {
    items: [],
    created: null,
    loading: false,
    error: null,
}


const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {
        resetServiceCreate: (state) => {
            state.created = null
            state.error = null
            state.loading = false
        }
    },
    extraReducers: (builder) => {
        builder 
            .addCase(createService.pending, (state) => {
                state.loading = true
                state.error = null
                state.created = null
            })
            .addCase(createService.fulfilled, (state, action) => {
                state.loading = false
                state.created = action.payload
                // Optimistically add to list
                state.items = [action.payload, ...state.items]
            })
            .addCase(createService.rejected, (state, action) => {
                state.loading = false   
                state.error = action.payload
            })
            .addCase(fetchServices.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(updateService.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(updateService.fulfilled, (state, action) => {
                state.loading = false
                const updatedService = action.payload?.service
                const updatedId = action.payload?.serviceId

                if (!updatedId || !updatedService) return

                state.items = state.items.map((item) => {
                    const service = item?.service ?? item
                    const id = service?._id ?? service?.id

                    if (id !== updatedId) return item

                    if (item?.service) {
                        return { ...item, service: updatedService }
                    }

                    return updatedService
                })
            })
            .addCase(updateService.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(toggleServiceAvailability.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(toggleServiceAvailability.fulfilled, (state, action) => {
                state.loading = false
                const updatedService = action.payload?.service
                const updatedId = action.payload?.serviceId

                if (!updatedId || !updatedService) return

                state.items = state.items.map((item) => {
                    const service = item?.service ?? item
                    const id = service?._id ?? service?.id

                    if (id !== updatedId) return item

                    if (item?.service) {
                        return { ...item, service: updatedService }
                    }

                    return updatedService
                })
            })
            .addCase(toggleServiceAvailability.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
            .addCase(deleteService.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.loading = false
                const deletedId = action.payload?.serviceId
                if (!deletedId) return

                state.items = state.items.filter((item) => {
                    const service = item?.service ?? item
                    const id = service?._id ?? service?.id
                    return id !== deletedId
                })
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload
            })
    },
})

export const { resetServiceCreate } = serviceSlice.actions
export default serviceSlice.reducer