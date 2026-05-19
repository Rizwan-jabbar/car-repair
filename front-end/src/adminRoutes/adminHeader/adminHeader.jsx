import { FiGlobe, FiLogOut, FiMoon, FiSettings, FiShield, FiUser } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../rtk/slices/userSlice/userSlice'

function AdminHeader () {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout())
        navigate('/', { replace: true })
    }

    return (
        <header className='rounded-2xl border border-gray-200 bg-gradient-to-r from-white via-white to-red-50 px-3 py-2 shadow-sm ring-1 ring-black/5 sm:px-4'>
            <div className='flex flex-wrap items-center justify-between gap-2'>
                <div className='inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-700 shadow-sm'>
                    <FiShield className='h-4 w-4' />
                </div>

                <div className='flex flex-wrap items-center gap-2'>
                    <Link
                        to='/'
                        className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-800'
                        aria-label='Visit website'
                    >
                        <FiGlobe className='h-4 w-4' />
                    </Link>

                    <button
                        type='button'
                        className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-800'
                        aria-label='Toggle mode'
                    >
                        <FiMoon className='h-4 w-4' />
                    </button>

                    <button
                        type='button'
                        className='inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50 hover:text-gray-800'
                        aria-label='Settings'
                    >
                        <FiSettings className='h-4 w-4' />
                    </button>

                    <div className='inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-2 py-1.5 shadow-sm'>
                        <Link
                            to='/profile'
                            className='inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-50'
                        >
                            <FiUser className='h-3.5 w-3.5' />
                            Profile
                        </Link>
                        <button
                            type='button'
                            onClick={handleLogout}
                            className='inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50'
                        >
                            <FiLogOut className='h-3.5 w-3.5' />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AdminHeader
