import Banner from '../../components/banner/banner'
import FeedBack from '../../components/feedBack/feedBack'

import Services from '../services/services'
import WhyUs from '../whyUs/whyUs'
import CustomerReviews from '../customerReviews/customerReviews'
import BookRepair from '../bookRepair/bookRepair'
import ContactUs from '../contactUs/contactUs'
import HowItWorks from '../../components/howItWorks/howItWorks'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { getVerifiedToken } from '../../rtk/utils/authToken'

function Home () {
    const { user } = useSelector((state) => state.user)
    const isAuthed = Boolean(user) || Boolean(getVerifiedToken())

    return (
        <>
             <Banner />
             <Services />
            <HowItWorks />
            <WhyUs />
            <CustomerReviews />
            <FeedBack />    
            {isAuthed ? (
                <BookRepair />
            ) : (
                <section id='book-repair' className='cr-section cr-section-muted'>
                    <div className='cr-container cr-section-pad'>
                        <div className='rounded-2xl border border-gray-200 bg-white p-6 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-8'>
                            <h2 className='cr-heading-md'>
                                Please login to book a repair
                            </h2>
                            <p className='mt-2 text-sm leading-6 text-gray-600'>
                                To submit a booking request, you need to be logged in.
                            </p>
                            <div className='mt-5 flex flex-col gap-3 sm:flex-row'>
                                <NavLink to='/login' className='cr-btn-primary'>Sign In</NavLink>
                                <NavLink to='/register' className='cr-btn-outline'>Sign Up</NavLink>
                            </div>
                        </div>
                    </div>
                </section>
            )}
            <ContactUs />
        </>
    )
}

export default Home
