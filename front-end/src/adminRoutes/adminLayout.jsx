import SideBar from "./sideBar";
import { Outlet } from "react-router-dom";
import AdminHeader from "./adminHeader/adminHeader";


function AdminLayout(){
    return (
        <section className='min-h-screen bg-gradient-to-b from-white via-white to-gray-50 text-gray-900 lg:h-[100dvh] lg:overflow-hidden'>
            <div className='mx-auto max-w-7xl px-3 py-3 sm:px-5 lg:h-full lg:px-7'>
                <AdminHeader />

                <div className='mt-3 grid gap-3 lg:h-[calc(100%-3.75rem)] lg:min-h-0 lg:grid-cols-[22rem,1fr]'>
                    <div className='lg:h-full lg:min-h-0'>
                        <SideBar />
                    </div>

                    <main className='min-h-[70vh] min-w-0 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm ring-1 ring-black/5 sm:p-4 lg:h-full lg:min-h-0 lg:overflow-y-auto'>
                        <Outlet />
                    </main>
                </div>
            </div>
        </section>
    )
}

export default AdminLayout;
