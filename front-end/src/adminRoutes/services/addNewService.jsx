import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiCheckCircle, FiFileText, FiImage, FiPlusCircle, FiTool, FiUpload } from 'react-icons/fi'

import { createService } from '../../rtk/thunks/serviceThunk/serviceThunk'

function AddNewService () {
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.service)

    const [form, setForm] = useState({
        title: '',
        description: '',
        image: null,
        isAvailable: true,
        commonSymptoms: '',
        inspectionPoints: '',
    })

    const [submitted, setSubmitted] = useState(false)
    const [touched, setTouched] = useState({})

    useEffect(() => {
        if (!submitted) return undefined

        const timerId = setTimeout(() => setSubmitted(false), 3000)
        return () => clearTimeout(timerId)
    }, [submitted])

    const errors = useMemo(() => {
        const e = {}

        if (!form.title.trim()) e.title = 'Title is required'
        if (!form.description.trim()) e.description = 'Description is required'

        if (!form.image) e.image = 'Service image is required'

        return e
    }, [form])

    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
    const markTouched = (key) => setTouched((prev) => ({ ...prev, [key]: true }))

    const onSubmit = async (e) => {
        e.preventDefault()

        setTouched({
            title: true,
            description: true,
            image: true,
            isAvailable: true,
        })

        if (Object.keys(errors).length > 0) return

        try {
            const serviceData = new FormData()
            serviceData.append('title', form.title.trim())
            serviceData.append('description', form.description.trim())
            serviceData.append('isAvailable', String(Boolean(form.isAvailable)))
            serviceData.append('commonSymptoms', form.commonSymptoms.trim())
            serviceData.append('inspectionPoints', form.inspectionPoints.trim())
            serviceData.append('image', form.image)

            await dispatch(createService(serviceData)).unwrap()

            setSubmitted(true)
            setTouched({})
            setForm({
                title: '',
                description: '',
                image: null,
                isAvailable: true,
                commonSymptoms: '',
                inspectionPoints: '',
            })
        } catch {
            setSubmitted(false)
        }
    }

    const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to add service')

    return (
        <section className='bg-[#f5f9fe]'>
            <div className='relative mb-4 overflow-hidden rounded-2xl border border-white bg-gradient-to-r from-white via-[#fffafa] to-red-50 p-5 shadow-sm sm:p-6'>
                <div className='pointer-events-none absolute -right-8 -bottom-16 h-36 w-64 rotate-[-12deg] rounded-[45%] border-2 border-red-100/70' />
                <div className='relative flex items-center gap-4'>
                    <span className='flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 shadow-sm'><FiTool className='h-7 w-7' /></span>
                    <div className='border-l-2 border-red-200 pl-4'>
                        <p className='inline-flex rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-red-600'>Services</p>
                        <h1 className='mt-1 text-2xl font-extrabold tracking-tight text-[#102441] sm:text-3xl'>Add New Service</h1>
                        <p className='mt-1 text-xs text-[#6c83a2] sm:text-sm'>Create a new service with model-based fields.</p>
                    </div>
                </div>
            </div>

            <div className='rounded-2xl border border-[#dce8f5] bg-white p-4 shadow-sm ring-1 ring-white sm:p-5'>
                {submitted && (
                    <div className='mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3'>
                        <p className='inline-flex items-center gap-2 text-sm font-semibold text-emerald-700'>
                            <FiCheckCircle className='h-4 w-4' />
                            Service added successfully.
                        </p>
                    </div>
                )}

                <form onSubmit={onSubmit} className='space-y-5'>
                    <div className='flex gap-4'>
                        <span className='mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600'><FiTool className='h-4 w-4' /></span>
                        <label className='block min-w-0 flex-1'>
                            <span className='text-sm font-bold text-[#203653]'>Title <b className='text-red-600'>*</b></span>
                        <input
                            type='text'
                            value={form.title}
                            onChange={(e) => setField('title', e.target.value)}
                            onBlur={() => markTouched('title')}
                            placeholder='e.g. Engine Diagnostics'
                            className='mt-2 w-full rounded-lg border border-[#d8e5f2] bg-white px-3 py-3 text-sm text-[#314b6d] shadow-sm outline-none transition placeholder:text-[#8da2bf] focus:border-red-300 focus:ring-4 focus:ring-red-100'
                        />
                            {touched.title && errors.title && <p className='mt-1 text-xs font-semibold text-red-600'>{errors.title}</p>}
                        </label>
                    </div>

                    <div className='flex gap-4'>
                        <span className='mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600'><FiFileText className='h-4 w-4' /></span>
                        <label className='block min-w-0 flex-1'>
                            <span className='text-sm font-bold text-[#203653]'>Description <b className='text-red-600'>*</b></span>
                        <textarea
                            value={form.description}
                            onChange={(e) => setField('description', e.target.value)}
                            onBlur={() => markTouched('description')}
                            rows={4}
                            placeholder='Write service details...'
                            className='mt-2 w-full resize-none rounded-lg border border-[#d8e5f2] bg-white px-3 py-3 text-sm text-[#314b6d] shadow-sm outline-none transition placeholder:text-[#8da2bf] focus:border-red-300 focus:ring-4 focus:ring-red-100'
                        />
                            {touched.description && errors.description && <p className='mt-1 text-xs font-semibold text-red-600'>{errors.description}</p>}
                        </label>
                    </div>

                    <div className='grid gap-4 sm:grid-cols-2 sm:pl-[52px]'>
                        <div className='flex gap-3'>
                            <span className='mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600'><FiCheckCircle className='h-4 w-4' /></span>
                            <label className='block min-w-0 flex-1'>
                                <span className='text-sm font-bold text-[#203653]'>Availability <b className='text-red-600'>*</b></span>
                            <div className='mt-2 flex h-[46px] items-center rounded-lg border border-[#d8e5f2] bg-white px-3'>
                                <input
                                    id='isAvailable'
                                    type='checkbox'
                                    checked={form.isAvailable}
                                    onChange={(e) => setField('isAvailable', e.target.checked)}
                                    className='h-4 w-4 accent-red-600'
                                />
                                <span className='ml-2 text-sm font-semibold text-[#526b89]'>
                                    Service is available
                                </span>
                            </div>
                            </label>
                        </div>
                    </div>

                    <div className='grid gap-4 sm:grid-cols-2 sm:pl-[52px]'>
                        <label className='block'>
                            <span className='text-sm font-bold text-[#203653]'>Common Symptoms</span>
                            <textarea
                                value={form.commonSymptoms}
                                onChange={(e) => setField('commonSymptoms', e.target.value)}
                                rows={3}
                                placeholder='One symptom per line'
                                className='mt-2 w-full resize-none rounded-lg border border-[#d8e5f2] bg-white px-3 py-3 text-sm text-[#314b6d] shadow-sm outline-none transition placeholder:text-[#8da2bf] focus:border-red-300 focus:ring-4 focus:ring-red-100'
                            />
                        </label>

                        <label className='block'>
                            <span className='text-sm font-bold text-[#203653]'>Inspection Points</span>
                            <textarea
                                value={form.inspectionPoints}
                                onChange={(e) => setField('inspectionPoints', e.target.value)}
                                rows={3}
                                placeholder='One inspection point per line'
                                className='mt-2 w-full resize-none rounded-lg border border-[#d8e5f2] bg-white px-3 py-3 text-sm text-[#314b6d] shadow-sm outline-none transition placeholder:text-[#8da2bf] focus:border-red-300 focus:ring-4 focus:ring-red-100'
                            />
                        </label>
                    </div>

                    <div className='flex gap-4'>
                        <span className='mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600'><FiImage className='h-4 w-4' /></span>
                        <div className='min-w-0 flex-1'>
                            <span className='text-sm font-bold text-[#203653]'>Service Image <b className='text-red-600'>*</b></span>
                            <label className='mt-2 flex min-h-[66px] cursor-pointer items-center gap-3 rounded-lg border border-dashed border-[#cbd9eb] bg-[#f9fbff] px-4 py-3 transition hover:border-red-300 hover:bg-red-50/30'>
                                <span className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600'><FiImage className='h-4 w-4' /></span>
                                <span className='min-w-0 flex-1'><span className='block text-sm font-bold text-[#203653]'>{form.image?.name || 'Choose File'}</span><span className='block text-xs text-[#8ca0bb]'>{form.image ? 'Image selected' : 'or drag and drop your image here'}</span></span>
                                <FiUpload className='h-5 w-5 shrink-0 text-[#8ca0bb]' />
                                <input type='file' accept='image/jpeg,image/png,image/gif,image/webp' onChange={(e) => setField('image', e.target.files?.[0] || null)} onBlur={() => markTouched('image')} className='hidden' />
                            </label>
                            <p className='mt-2 text-[11px] text-[#7188a7]'>Supported formats: JPG, PNG, WEBP <span className='mx-1'>•</span> Max size: 5MB</p>
                            {touched.image && errors.image && <p className='mt-1 text-xs font-semibold text-red-600'>{errors.image}</p>}
                        </div>
                    </div>

                    {error && (
                        <div className='rounded-xl border border-red-200 bg-red-50 p-3'>
                            <p className='text-sm font-semibold text-red-700'>{errorMessage}</p>
                        </div>
                    )}

                    <button
                        type='submit'
                        className='inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
                        disabled={loading}
                    >
                        <FiPlusCircle className='h-4 w-4' />
                        {loading ? <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' aria-label='Adding service' /> : 'Add Service'}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddNewService
