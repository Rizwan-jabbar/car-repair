import { createSlice } from "@reduxjs/toolkit";
import {
    bookRepair,
    createEmergencyBooking,
    getUserBookings,
    getAllBookings,
    updateBookingStatus,
    updateBookingArrival

} from "../../thunks/bookingThunk/bookingThunk";

const initialState = {
    booking: null,
    loading: false,
    error: null,
};

const bookRepairSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        resetBooking: (state) => {
            state.booking = null;
            state.loading = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(bookRepair.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(bookRepair.fulfilled, (state, action) => {
                state.loading = false;
                state.booking = action.payload;
            })
            .addCase(bookRepair.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(createEmergencyBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.booking = null;
            }).addCase(createEmergencyBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.booking = action.payload;
            }).addCase(createEmergencyBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(getAllBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.booking = action.payload;
            })
            .addCase(getAllBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(updateBookingStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updatedBooking = action.payload?.booking;
                if (!updatedBooking) return;

                if (Array.isArray(state.booking?.bookings)) {
                    state.booking.bookings = state.booking.bookings.map((item) =>
                        (item?._id === updatedBooking?._id ? updatedBooking : item)
                    );
                }
            })
            .addCase(updateBookingStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateBookingArrival.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBookingArrival.fulfilled, (state, action) => {
                state.loading = false;
                const updatedBooking = action.payload?.booking;
                if (!updatedBooking) return;

                if (Array.isArray(state.booking?.bookings)) {
                    state.booking.bookings = state.booking.bookings.map((item) =>
                        (item?._id === updatedBooking?._id ? updatedBooking : item)
                    );
                }
            })
            .addCase(updateBookingArrival.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            }).addCase(getUserBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUserBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.booking = action.payload;
            })
            .addCase(getUserBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });

    }
});

export const { resetBooking } = bookRepairSlice.actions;
const bookRepairReducer = bookRepairSlice.reducer;
export default bookRepairReducer;