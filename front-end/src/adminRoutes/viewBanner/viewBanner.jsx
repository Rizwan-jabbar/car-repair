import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiImage, FiLink2 } from 'react-icons/fi'

import { fetchBanners } from '../../rtk/thunks/bannerThunk/bannerThunk'

function ViewBanner () {
    const dispatch = useDispatch()
    const { banners = [], loading, error } = useSelector((state) => state.banner)

    useEffect(() => {
        dispatch(fetchBanners())
    }, [dispatch])

    const latestBanner = useMemo(() => {
        if (!Array.isArray(banners) || banners.length === 0) return null
        return banners[0]
    }, [banners])

    const imageList = useMemo(() => {
        if (!latestBanner) return []
        return [latestBanner.imageOne, latestBanner.imageTwo, latestBanner.imageThree].filter(Boolean)
    }, [latestBanner])

    const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to load banner data')

    return (
        <section className='bg-[#f5f9fe]'>
            <div className='mb-5 rounded-2xl border border-white bg-gradient-to-r from-white via-[#f9fbff] to-red-50/70 p-5 shadow-sm sm:p-6'>
                <p className='inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-red-600'>Banner</p>
                <h1 className='mt-2 text-2xl font-extrabold tracking-tight text-[#102441] sm:text-3xl'>View Banner</h1>
                <p className='mt-1 text-sm text-[#6c83a2]'>Preview current banner content shown on home page.</p>
            </div>

            {loading && (
                <div className='flex items-center justify-center rounded-xl border border-gray-200 bg-white p-8'>
                    <span className='h-7 w-7 animate-spin rounded-full border-4 border-red-100 border-t-red-600' aria-label='Loading banner' />
                </div>
            )}

            {!loading && error && (
                <div className='rounded-xl border border-red-200 bg-red-50 p-4'>
                    <p className='text-sm font-semibold text-red-700'>{errorMessage}</p>
                </div>
            )}

            {!loading && !error && !latestBanner && (
                <div className='rounded-xl border border-gray-200 bg-white p-6 text-center'>
                    <p className='text-sm font-semibold text-gray-600'>No banner available yet. Please add one from update banner page.</p>
                </div>
            )}

            {!loading && !error && latestBanner && (
                <div className='space-y-4'>
                    <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-5'>
                        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
                            <div>
                                <p className='text-xs font-semibold uppercase tracking-wide text-red-600'>Active Banner</p>
                                <h2 className='mt-1 text-xl font-extrabold text-gray-900'>{latestBanner.title}</h2>
                                <p className='mt-2 text-sm leading-6 text-gray-600'>{latestBanner.description}</p>
                            </div>
                            <a
                                href={latestBanner.link}
                                target='_blank'
                                rel='noreferrer'
                                className='inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50'
                            >
                                <FiLink2 className='h-4 w-4 text-red-600' />
                                Open Link
                            </a>
                        </div>
                    </div>

                    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        {imageList.map((image, idx) => (
                            <article key={`${image}-${idx}`} className='overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm ring-1 ring-black/5'>
                                <div className='aspect-[16/10] bg-gray-100'>
                                    <img
                                        src={image}
                                        alt={`Banner preview ${idx + 1}`}
                                        className='h-full w-full object-cover'
                                        loading='lazy'
                                    />
                                </div>
                                <div className='flex items-center justify-between border-t border-gray-200 px-3 py-2'>
                                    <p className='text-xs font-semibold text-gray-700'>Image {idx + 1}</p>
                                    <FiImage className='h-4 w-4 text-red-600' />
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}

export default ViewBanner