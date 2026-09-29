import { Outlet } from 'react-router-dom'

function AuthLayout () {
    return (
        <div className='min-h-screen bg-gradient-to-b from-white via-white to-gray-50 text-gray-900'>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default AuthLayout
