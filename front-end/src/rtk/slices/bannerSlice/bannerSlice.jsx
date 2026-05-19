import { createSlice } from "@reduxjs/toolkit";
import {
    createBanner,
    fetchBanners,
    fetchLatestBanner,
    updateBanner,
} from "../../thunks/bannerThunk/bannerThunk";

const initialState = {
    banners: [],
    latestBanner: null,
    loading: false,
    error: null,
};

const bannerSlice = createSlice({
    name: 'banners',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.banners.push(action.payload);
                state.latestBanner = action.payload;
            })
            .addCase(createBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.loading = false;
                state.banners = action.payload;
                state.latestBanner = action.payload?.[0] || null;
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchLatestBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLatestBanner.fulfilled, (state, action) => {
                state.loading = false;
                state.latestBanner = action.payload;
            })
            .addCase(fetchLatestBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateBanner.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateBanner.fulfilled, (state, action) => {
                const updatedBanner = action.payload;
                state.loading = false;
                state.latestBanner = updatedBanner;

                const idx = state.banners.findIndex((banner) => banner?._id === updatedBanner?._id);
                if (idx >= 0) {
                    state.banners[idx] = updatedBanner;
                } else {
                    state.banners.unshift(updatedBanner);
                }
            })
            .addCase(updateBanner.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default bannerSlice.reducer;
