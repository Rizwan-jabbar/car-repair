import Navbar from '../components/navbar/navbar'
import Footer from '../components/footer/footer'
import { Outlet } from 'react-router-dom'
import WhatsAppBtn from '../components/whatsappBtn/whatsappBtn'
import AiChatBot from '../components/aiChatBot/aiChatBot'
import { useSelector } from 'react-redux'

function Layout () {

    // In the store, `state.user` is the slice, and `state.user.user` is the actual user object.
    const { user } = useSelector((state) => state.user)

    return (
        <div className='min-h-screen bg-gray-50 text-gray-900'>
            {
                user?.role && window.location.pathname.includes('admin') ? null : <Navbar />
            }

            <main>
                <Outlet />
            </main>
            {
                user?.role === 'admin' && window.location.pathname.includes('admin') ? null : <Footer />
            }

            {/* Floating WhatsApp button */}
            <AiChatBot />
            <WhatsAppBtn />
        </div>
    )
}

export default Layout
