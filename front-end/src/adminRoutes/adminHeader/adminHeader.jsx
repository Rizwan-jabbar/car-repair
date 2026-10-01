import { FiChevronDown, FiGlobe, FiLogOut, FiMoon, FiSettings, FiShield, FiUser } from 'react-icons/fi'
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
        <header className='rounded-2xl border border-white bg-gradient-to-r from-white via-[#f9fbff] to-red-50/60 px-4 py-3 shadow-sm ring-1 ring-slate-100 sm:px-6'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
                <div className='flex items-center gap-4'>
                    <div className='inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-200'>
                        <FiShield className='h-6 w-6' />
                    </div>
                    <span className='hidden h-12 w-px bg-[#d8e3ee] sm:block' />
                    <div>
                        <p className='text-lg font-extrabold tracking-tight text-[#1b2f4b]'>Admin Panel</p>
                        <p className='text-xs font-medium text-[#7187a3]'>Manage your website efficiently</p>
                    </div>
                </div>

                <div className='flex flex-wrap items-center gap-2'>
                    <Link
                        to='/'
                        className='inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e3ebf4] bg-white text-[#40536c] shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:text-red-600'
                        aria-label='Visit website'
                    >
                        <FiGlobe className='h-5 w-5' />
                    </Link>

                    <button
                        type='button'
                        className='inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e3ebf4] bg-white text-[#40536c] shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:text-red-600'
                        aria-label='Toggle mode'
                    >
                        <FiMoon className='h-5 w-5' />
                    </button>

                    <button
                        type='button'
                        className='relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#e3ebf4] bg-white text-[#40536c] shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50 hover:text-red-600'
                        aria-label='Settings'
                    >
                        <FiSettings className='h-5 w-5' />
                        <span className='absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white' />
                    </button>

                    <span className='hidden h-10 w-px bg-[#d8e3ee] sm:block' />
                    <div className='inline-flex items-center gap-1 rounded-2xl border border-[#e3ebf4] bg-white p-1 shadow-sm'>
                        <Link
                            to='/profile'
                            className='inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-[#304661] transition hover:bg-slate-50'
                        >
                            <FiUser className='h-4 w-4' />
                            Profile
                            <FiChevronDown className='h-4 w-4 text-[#607590]' />
                        </Link>
                        <button
                            type='button'
                            onClick={handleLogout}
                            className='inline-flex items-center gap-2 rounded-xl border border-red-100 bg-red-50/60 px-3 py-2 text-sm font-bold text-red-600 transition hover:bg-red-100'
                        >
                            <FiLogOut className='h-4 w-4' />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default AdminHeader
