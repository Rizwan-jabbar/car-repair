import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiBriefcase, FiCalendar, FiMail, FiPhone, FiShield, FiUser } from 'react-icons/fi'

function UserProfile () {
    const { user } = useSelector((state) => state.user)

    const formatDate = (value) => {
        if (!value) return '-'
        const d = new Date(value)
        if (Number.isNaN(d.getTime())) return '-'
        return d.toLocaleString()
    }

    if (!user) {
        return (
            <section className='mx-auto w-full max-w-3xl px-4 py-10 sm:px-6'>
                <div className='rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm ring-1 ring-black/5'>
                    <h1 className='text-xl font-extrabold text-gray-900 sm:text-2xl'>User Profile</h1>
                    <p className='mt-2 text-sm text-gray-600'>Please login to view your profile details.</p>
                    <Link
                        to='/login'
                        className='mt-4 inline-flex items-center justify-center rounded-md border border-red-600 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50'
                    >
                        Go to Login
                    </Link>
                </div>
            </section>
        )
    }

    const profileRows = [
        { label: 'Name', value: user?.name || '-', Icon: FiUser },
        { label: 'Email', value: user?.email || '-', Icon: FiMail },
        { label: 'Contact', value: user?.contact || '-', Icon: FiPhone },
        { label: 'Role', value: user?.role || '-', Icon: FiBriefcase },
        { label: 'User ID', value: user?._id || '-', Icon: FiUser },
        { label: 'Created At', value: formatDate(user?.createdAt), Icon: FiCalendar },
    ]

    return (
        <section className='mx-auto w-full max-w-6xl bg-[#f5f9fe] px-4 py-8 sm:px-6 sm:py-10'>
            <div className='relative overflow-hidden rounded-2xl border border-white bg-gradient-to-r from-white via-[#fffafa] to-red-100/70 p-6 shadow-sm sm:p-8'>
                <div className='pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-[42%] border-[18px] border-red-100/70 rotate-12' />
                <div className='relative flex items-center gap-5'>
                    <div className='relative flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-200 ring-8 ring-red-50 sm:h-32 sm:w-32'>
                        <FiUser className='h-16 w-16 sm:h-20 sm:w-20' />
                        <span className='absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-white bg-emerald-500' />
                    </div>
                    <div>
                        <p className='inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-red-600'><FiUser className='h-3.5 w-3.5' /> My Account</p>
                        <h1 className='mt-3 text-3xl font-extrabold tracking-tight text-[#102441] sm:text-4xl'>User Profile</h1>
                        <p className='mt-1 text-sm text-[#6c83a2] sm:text-base'>Your complete account details are shown below.</p>
                    </div>
                    <FiShield className='absolute right-2 top-1/2 hidden h-32 w-32 -translate-y-1/2 text-red-300/40 sm:block' />
                </div>
            </div>

            <div className='mt-5 overflow-hidden rounded-2xl border border-white bg-white p-4 shadow-sm ring-1 ring-slate-100 sm:p-6'>
                     <div className='grid gap-5 sm:grid-cols-2'>
                    {profileRows.map((row, idx) => (
                        <div
                            key={row.label}
                               className='flex min-h-[110px] items-center gap-5 rounded-2xl border border-[#e0ebf6] bg-white px-5 py-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-100 hover:shadow-md sm:px-6 sm:py-6'
                        >
                            <span className='flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600'><row.Icon className='h-5 w-5' /></span>
                            <div className='min-w-0'><p className='text-xs font-bold uppercase tracking-wide text-[#7b90aa]'>{row.label}</p><p className='mt-1 break-all text-sm font-extrabold text-[#102441] sm:text-base'>{String(row.value)}</p></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default UserProfile