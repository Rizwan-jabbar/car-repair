import { Navigate, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { fetchCurrentUser } from './rtk/thunks/userThunk/userThunk'
import { getVerifiedToken } from './rtk/utils/authToken'

import Layout from './layout/layout'
import AuthLayout from './layout/authLayout'

import Home from './pages/home/home'
import WhyUs from './pages/whyUs/whyUs'
import AllServices from './pages/services/allServices'
import AllCustomerReviews from './pages/customerReviews/allCustomerReviews'
import BookRepair from './pages/bookRepair/bookRepair'
import ContactUs from './pages/contactUs/contactUs'
import Faq from './pages/faq/faq'
import TipsForCar from './pages/tipsForCar/tipsForCar'
import FeedBack from './components/feedBack/feedBack'
import UserProfile from './pages/userProfile/userProfile'
import UserBooking from './pages/userBooking/userBooking'

import Login from './pages/auth/login'
import Register from './pages/auth/register'
import NotFound from './pages/notFound/notFound'
import AdminLayout from './adminRoutes/adminLayout'
import MainContents from './adminRoutes/mainContents'
import AdminDashboard from './adminRoutes/dashboard/adminDashboard'
import ViewServices from './adminRoutes/services/viewServices'
import AddNewService from './adminRoutes/services/addNewService'
import ViewReviews from './adminRoutes/reviews/viewReviews'
import ViewFaq from './adminRoutes/faq/viewFaq'
import AddFaq from './adminRoutes/faq/addFaq'
import ViewBookings from './adminRoutes/bookings/viewBooking'
import ViewContacts from './adminRoutes/viewContacts/viewContacts'
import ViewBanner from './adminRoutes/viewBanner/viewBanner'
import UpdateBanner from './adminRoutes/viewBanner/updateBanner'
import Loading from './components/loading/loading'

function App () {
    const [appLoading, setAppLoading] = useState(true)
    const dispatch = useDispatch()
    const { user, loading } = useSelector((state) => state.user)

    useEffect(() => {
        const token = getVerifiedToken()
        if (token) {
            dispatch(fetchCurrentUser())
        }
    }, [dispatch])

    useEffect(() => {
        const timerId = setTimeout(() => {
            setAppLoading(false)
        }, 2000)

        return () => clearTimeout(timerId)
    }, [])

    const hasToken = Boolean(getVerifiedToken())
    const isAuthed = Boolean(user) || hasToken

    const AdminRouteGuard = ({ children }) => {
        if (!isAuthed) {
            return <Navigate to='/login' replace />
        }

        if (hasToken && loading) {
            return null
        }

        if (!user) {
            return <Navigate to='/login' replace />
        }

        if (user.role !== 'admin') {
            return <Navigate to='/' replace />
        }

        return children
    }

    return appLoading ? (
        <Loading />
    ) : (
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path='services' element={<AllServices />} />
                <Route path='why-us' element={<WhyUs />} />
                <Route path='reviews' element={<AllCustomerReviews />} />
                <Route path='faq' element={<Faq />} />
                <Route path='tips-for-car' element={<TipsForCar />} />
                <Route path='feedback' element={<FeedBack />} />
                <Route
                    path='book-repair'
                    element={isAuthed ? <BookRepair /> : <Navigate to='/login' replace />}
                />
                <Route
                    path='profile'
                    element={isAuthed ? <UserProfile /> : <Navigate to='/login' replace />}
                />
                <Route
                    path='my-appointments'
                    element={isAuthed ? <UserBooking /> : <Navigate to='/login' replace />}
                />
                <Route path='contact' element={<ContactUs />} />
                <Route path='*' element={<NotFound />} />
            </Route>

            <Route element={<AuthLayout />}>
                <Route
                    path='login'
                    element={isAuthed ? <Navigate to='/' replace /> : <Login />}
                />
                <Route
                    path='register'
                    element={isAuthed ? <Navigate to='/' replace /> : <Register />}
                />
            </Route>

            <Route
                path='admin'
                element={
                    <AdminRouteGuard>
                        <AdminLayout />
                    </AdminRouteGuard>
                }
            >
                <Route element={<MainContents />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path='services/view' element={<ViewServices />} />
                    <Route path='services/add' element={<AddNewService />} />

                    <Route path='why-us/view' element={<h1 className='text-xl font-extrabold tracking-tight'>Manage Why Us</h1>} />
                    <Route path='reviews/view' element={<ViewReviews />} />
                    <Route path='faq/view' element={<ViewFaq />} />
                    <Route path='faq/add' element={<AddFaq />} />
                    <Route path='bookings/view' element={<ViewBookings />} />
                    <Route path='banner/view' element={<ViewBanner />} />
                    <Route path='banner/update' element={<UpdateBanner />} />
                    <Route path='tips-for-car/view' element={<h1 className='text-xl font-extrabold tracking-tight'>Manage Car Tips</h1>} />
                    <Route path='feedback/view' element={<h1 className='text-xl font-extrabold tracking-tight'>Manage Feedback</h1>} />
                    <Route path='contact/view' element={<ViewContacts />} />
                    <Route path='auth/login-page' element={<h1 className='text-xl font-extrabold tracking-tight'>Login Page Settings</h1>} />
                    <Route path='auth/register-page' element={<h1 className='text-xl font-extrabold tracking-tight'>Register Page Settings</h1>} />
                    <Route path='*' element={<Navigate to='/admin' replace />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default App
