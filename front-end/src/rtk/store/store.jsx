import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../slices/userSlice/userSlice";
import bookRepairReducer from "../slices/bookRepair/bookRepair";
import reviewReducer from "../slices/reviewSlice/reviewSlice";
import ServiceReducer from "../slices/serviceSlice/serviceSlice";
import faqReducer from "../slices/faqSlice/faqSlice";
import contactReducer from "../slices/contactSlice/contactSlice";
import bannerReducer from "../slices/bannerSlice/bannerSlice";
import aiReducer from '../slices/aiSlice/aiSlice'

const operationDelayMiddleware = () => (next) => (action) => {
    const isOperationComplete = action?.type?.endsWith('/fulfilled') || action?.type?.endsWith('/rejected')

    if (!isOperationComplete) return next(action)

    return new Promise((resolve) => {
        setTimeout(() => resolve(next(action)), 3000)
    })
}

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
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(operationDelayMiddleware),
});

export default store;