import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiImage, FiUpload } from 'react-icons/fi'

import {
    createBanner,
    fetchLatestBanner,
    updateBanner,
} from '../../rtk/thunks/bannerThunk/bannerThunk'

function UpdateBanner () {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { latestBanner, loading, error } = useSelector((state) => state.banner)

    const [form, setForm] = useState({
        title: '',
        description: '',
        link: '',
    })

    const [files, setFiles] = useState({
        imageOne: null,
        imageTwo: null,
        imageThree: null,
    })

    const [touched, setTouched] = useState({})
    const [submitError, setSubmitError] = useState('')
    const [successModal, setSuccessModal] = useState({
        open: false,
        message: '',
    })

    useEffect(() => {
        dispatch(fetchLatestBanner())
    }, [dispatch])

    useEffect(() => {
        if (!latestBanner) return

        setForm({
            title: latestBanner.title || '',
            description: latestBanner.description || '',
            link: latestBanner.link || '',
        })
    }, [latestBanner])

    const errors = useMemo(() => {
        const e = {}
        if (!form.title.trim()) e.title = 'Title is required'
        if (!form.description.trim()) e.description = 'Description is required'
        if (!form.link.trim()) e.link = 'Link is required'
        return e
    }, [form])

    const hasExistingImages = Boolean(
        latestBanner?.imageOne && latestBanner?.imageTwo && latestBanner?.imageThree,
    )

    const needsAllImages = !hasExistingImages

    const fileErrors = useMemo(() => {
        const e = {}

        if (needsAllImages) {
            if (!files.imageOne) e.imageOne = 'Image 1 is required'
            if (!files.imageTwo) e.imageTwo = 'Image 2 is required'
            if (!files.imageThree) e.imageThree = 'Image 3 is required'
        }

        return e
    }, [files, needsAllImages])

    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
    const setFile = (key, value) => setFiles((prev) => ({ ...prev, [key]: value }))
    const markTouched = (key) => setTouched((prev) => ({ ...prev, [key]: true }))

    const createPreview = (file, fallbackUrl = '') => {
        if (file) return URL.createObjectURL(file)
        return fallbackUrl
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        setSubmitError('')
        setTouched({
            title: true,
            description: true,
            link: true,
            imageOne: true,
            imageTwo: true,
            imageThree: true,
        })

        if (Object.keys(errors).length > 0 || Object.keys(fileErrors).length > 0) return

        const payload = new FormData()
        payload.append('title', form.title.trim())
        payload.append('description', form.description.trim())
        payload.append('link', form.link.trim())

        if (files.imageOne) payload.append('imageOne', files.imageOne)
        if (files.imageTwo) payload.append('imageTwo', files.imageTwo)
        if (files.imageThree) payload.append('imageThree', files.imageThree)

        const isEditMode = Boolean(latestBanner?._id)

        try {
            if (isEditMode) {
                await dispatch(updateBanner({ bannerId: latestBanner._id, bannerData: payload })).unwrap()
            } else {
                await dispatch(createBanner(payload)).unwrap()
            }

            if (!isEditMode) {
                setForm({
                    title: '',
                    description: '',
                    link: '',
                })
                setFiles({ imageOne: null, imageTwo: null, imageThree: null })
                setTouched({})
            } else {
                await dispatch(fetchLatestBanner())
            }

            setSuccessModal({
                open: true,
                message: isEditMode ? 'Banner updated successfully.' : 'Banner created successfully.',
            })
        } catch (err) {
            const exactError = typeof err === 'string' ? err : (err?.message || 'Failed to save banner')
            setSubmitError(exactError)
        }
    }

    useEffect(() => {
        if (!successModal.open) return undefined

        const timerId = setTimeout(() => {
            setSuccessModal({ open: false, message: '' })
            navigate('/admin/banner/view')
        }, 3000)
        return () => clearTimeout(timerId)
    }, [navigate, successModal.open])

    const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to save banner')

    return (
        <section>
            {successModal.open && (
                <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4'>
                    <div className='w-full max-w-md rounded-2xl border border-emerald-200 bg-white p-5 shadow-xl'>
                        <div className='flex items-start gap-3'>
                            <div className='rounded-full bg-emerald-100 p-2'>
                                <FiCheckCircle className='h-5 w-5 text-emerald-600' />
                            </div>
                            <div>
                                <h2 className='text-lg font-extrabold text-gray-900'>Success</h2>
                                <p className='mt-1 text-sm font-medium text-gray-700'>{successModal.message}</p>
                            </div>
                        </div>

                        <div className='mt-5 flex justify-end'>
                            <button
                                type='button'
                                onClick={() => {
                                    setSuccessModal({ open: false, message: '' })
                                    navigate('/admin/banner/view')
                                }}
                                className='inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700'
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='mb-5 rounded-2xl border border-white bg-gradient-to-r from-white via-[#f9fbff] to-red-50/70 p-5 shadow-sm sm:p-6'>
                <p className='inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-red-600'>Banner</p>
                <h1 className='mt-2 text-2xl font-extrabold tracking-tight text-[#102441] sm:text-3xl'>Update Banner</h1>
                <p className='mt-1 text-sm text-[#6c83a2]'>Upload banner images and update home banner content.</p>
            </div>

            <div className='rounded-2xl border border-[#dce8f5] bg-white p-4 shadow-sm ring-1 ring-white sm:p-6'>
                <form onSubmit={onSubmit} className='space-y-5'>
                    <label className='block'>
                        <span className='text-sm font-semibold text-gray-900'>Title</span>
                        <input
                            type='text'
                            value={form.title}
                            onChange={(e) => setField('title', e.target.value)}
                            onBlur={() => markTouched('title')}
                            placeholder='e.g. Professional Car Repair You Can Trust'
                            className='cr-input'
                        />
                        {touched.title && errors.title && <p className='mt-1 text-xs font-semibold text-red-600'>{errors.title}</p>}
                    </label>

                    <label className='block'>
                        <span className='text-sm font-semibold text-gray-900'>Description</span>
                        <textarea
                            rows={4}
                            value={form.description}
                            onChange={(e) => setField('description', e.target.value)}
                            onBlur={() => markTouched('description')}
                            placeholder='Describe your banner offer...'
                            className='cr-textarea'
                        />
                        {touched.description && errors.description && <p className='mt-1 text-xs font-semibold text-red-600'>{errors.description}</p>}
                    </label>

                    <label className='block'>
                        <span className='text-sm font-semibold text-gray-900'>CTA Link</span>
                        <input
                            type='text'
                            value={form.link}
                            onChange={(e) => setField('link', e.target.value)}
                            onBlur={() => markTouched('link')}
                            placeholder='e.g. /book-repair or https://example.com'
                            className='cr-input'
                        />
                        {touched.link && errors.link && <p className='mt-1 text-xs font-semibold text-red-600'>{errors.link}</p>}
                    </label>

                    <div className='grid gap-4 md:grid-cols-3'>
                        {[
                            { key: 'imageOne', label: 'Banner Image 1', existing: latestBanner?.imageOne },
                            { key: 'imageTwo', label: 'Banner Image 2', existing: latestBanner?.imageTwo },
                            { key: 'imageThree', label: 'Banner Image 3', existing: latestBanner?.imageThree },
                        ].map((imgField) => (
                            <div key={imgField.key} className='rounded-xl border border-gray-200 bg-gray-50 p-3'>
                                <p className='mb-2 text-sm font-semibold text-gray-900'>{imgField.label}</p>

                                <label className='inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-red-300 hover:text-red-700'>
                                    <FiUpload className='h-4 w-4' />
                                    Upload Image
                                    <input
                                        type='file'
                                        accept='image/*'
                                        className='hidden'
                                        onChange={(e) => setFile(imgField.key, e.target.files?.[0] || null)}
                                        onBlur={() => markTouched(imgField.key)}
                                    />
                                </label>

                                {(files[imgField.key] || imgField.existing) && (
                                    <div className='mt-3 overflow-hidden rounded-lg border border-gray-200 bg-white'>
                                        <div className='aspect-[16/10] bg-gray-100'>
                                            <img
                                                src={createPreview(files[imgField.key], imgField.existing)}
                                                alt={imgField.label}
                                                className='h-full w-full object-cover'
                                            />
                                        </div>
                                        <p className='flex items-center gap-1 border-t border-gray-200 px-2 py-1 text-[11px] font-semibold text-gray-600'>
                                            <FiImage className='h-3.5 w-3.5 text-red-600' />
                                            {files[imgField.key]?.name || 'Existing image'}
                                        </p>
                                    </div>
                                )}

                                {touched[imgField.key] && fileErrors[imgField.key] && (
                                    <p className='mt-1 text-xs font-semibold text-red-600'>{fileErrors[imgField.key]}</p>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className='flex flex-col gap-2'>
                        <button
                            type='submit'
                            className='inline-flex w-fit items-center gap-2 rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
                            disabled={loading}
                        >
                            <FiUpload className='h-4 w-4' />
                            {loading ? <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' aria-label='Saving banner' /> : latestBanner?._id ? 'Update Banner' : 'Create Banner'}
                        </button>

                        {(submitError || error) && (
                            <p className='text-sm font-semibold text-red-600'>
                                {submitError || errorMessage}
                            </p>
                        )}
                    </div>
                </form>
            </div>
        </section>
    )
}

export default UpdateBanner