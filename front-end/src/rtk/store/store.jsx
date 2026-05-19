import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice/userSlice";
import bookRepairReducer from "../slices/bookRepair/bookRepair";
import reviewReducer from "../slices/reviewSlice/reviewSlice";
import ServiceReducer from "../slices/serviceSlice/serviceSlice";
import faqReducer from "../slices/faqSlice/faqSlice";
import contactReducer from "../slices/contactSlice/contactSlice";
import bannerReducer from "../slices/bannerSlice/bannerSlice";
import aiReducer from '../slices/aiSlice/aiSlice'

const store = configureStore({
    reducer: {
        user: userReducer,
        booking: bookRepairReducer,
        review: reviewReducer,
        service: ServiceReducer,
        faq: faqReducer,
        contact: contactReducer,
        banner: bannerReducer,
        ai: aiReducer
    },
});

export default store;