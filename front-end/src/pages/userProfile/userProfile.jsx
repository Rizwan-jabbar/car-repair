import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

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
        { label: 'Name', value: user?.name || '-' },
        { label: 'Email', value: user?.email || '-' },
        { label: 'Contact', value: user?.contact || '-' },
        { label: 'Role', value: user?.role || '-' },
        { label: 'User ID', value: user?._id || '-' },
        { label: 'Created At', value: formatDate(user?.createdAt) },
    ]

    return (
        <section className='mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10'>
            <div className='rounded-2xl border border-gray-200 bg-gradient-to-r from-white via-white to-red-50 p-5 shadow-sm ring-1 ring-black/5 sm:p-6'>
                <p className='text-xs font-semibold uppercase tracking-wide text-red-600'>My Account</p>
                <h1 className='mt-1 text-2xl font-extrabold tracking-tight text-gray-900'>User Profile</h1>
                <p className='mt-1 text-sm text-gray-600'>Your complete account details are shown below.</p>
            </div>

            <div className='mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5'>
                <div className='grid gap-0 sm:grid-cols-2'>
                    {profileRows.map((row, idx) => (
                        <div
                            key={row.label}
                            className={`border-gray-100 px-4 py-4 sm:px-5 ${idx % 2 === 0 ? 'sm:border-r' : ''} ${idx < profileRows.length - (profileRows.length % 2 === 0 ? 2 : 1) ? 'border-b' : ''}`}
                        >
                            <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>{row.label}</p>
                            <p className='mt-1 break-all text-sm font-semibold text-gray-900'>{String(row.value)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default UserProfile