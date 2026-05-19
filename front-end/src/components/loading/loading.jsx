function Loading () {
    return (
        <section
            className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-gray-100 px-4'
            role='status'
            aria-live='polite'
            aria-label='Loading Car Repair Pro'
        >
            <div className='pointer-events-none absolute inset-0'>
                <div className='absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-red-500/10 blur-3xl' />
                <div className='absolute -bottom-28 right-0 h-80 w-80 rounded-full bg-slate-900/5 blur-3xl' />
            </div>

            <div className='relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white/90 p-6 text-center shadow-xl ring-1 ring-black/5 backdrop-blur sm:p-7'>
                <p className='text-xs font-bold uppercase tracking-[0.18em] text-red-600'>Car Repair Pro</p>
                <h2 className='mt-2 text-lg font-extrabold tracking-tight text-gray-900 sm:text-xl'>Preparing your garage...</h2>
                <p className='mt-1 text-sm text-gray-600'>Tuning tools, diagnostics, and routes</p>

                <div className='mt-6 flex justify-center'>
                    <div className='relative h-12 w-44'>
                        <div className='absolute bottom-0 left-0 right-0 h-1 rounded-full bg-gray-200' />
                        <div className='absolute bottom-0 left-0 h-1 w-20 animate-pulse rounded-full bg-red-500' />

                        <div className='absolute left-6 top-1'>
                            <div className='relative h-7 w-20 rounded-xl bg-gradient-to-r from-red-500 to-red-600 shadow-md'>
                                <div className='absolute -top-3 left-6 h-4 w-8 rounded-t-lg bg-gradient-to-r from-red-500 to-red-600' />
                            </div>
                            <div className='absolute -bottom-2 left-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-800 border-t-transparent bg-white' />
                            <div className='absolute -bottom-2 right-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-800 border-t-transparent bg-white' />
                        </div>
                    </div>
                </div>

                <p className='mt-5 text-xs font-semibold uppercase tracking-wide text-gray-500'>Loading experience...</p>
            </div>
        </section>
    )
}

export default Loading