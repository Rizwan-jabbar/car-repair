function Loading () {
    return (
        <section
            className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-white to-red-50 px-4'
            role='status'
            aria-live='polite'
            aria-label='Loading Car Repair Pro'
        >
            <div className='pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_32%)]' />

            <div className='relative w-full max-w-sm rounded-3xl border border-white/80 bg-white/90 p-7 text-center shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 backdrop-blur sm:p-8'>
                <div className='mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 ring-8 ring-red-50/70'>
                    <span className='h-9 w-9 animate-spin rounded-full border-4 border-red-100 border-t-red-600' aria-hidden='true' />
                </div>
                <p className='mt-6 text-xs font-bold uppercase tracking-[0.18em] text-red-600'>Car Repair Pro</p>
                <h2 className='mt-2 text-lg font-extrabold tracking-tight text-gray-900 sm:text-xl'>Preparing your garage</h2>
                <p className='mt-1 text-sm text-gray-600'>Setting up your workspace</p>

                <div className='mx-auto mt-7 h-1.5 w-44 overflow-hidden rounded-full bg-slate-100' aria-hidden='true'>
                    <div className='h-full w-1/2 animate-pulse rounded-full bg-red-600' />
                </div>
            </div>
        </section>
    )
}

export default Loading