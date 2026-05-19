import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiCheckCircle, FiPlusCircle } from 'react-icons/fi'

import { createService } from '../../rtk/thunks/serviceThunk/serviceThunk'

function AddNewService () {
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.service)

    const [form, setForm] = useState({
        title: '',
        description: '',
        price: '',
        isAvailable: true,
    })

    const [submitted, setSubmitted] = useState(false)
    const [touched, setTouched] = useState({})

    const errors = useMemo(() => {
        const e = {}

        if (!form.title.trim()) e.title = 'Title is required'
        if (!form.description.trim()) e.description = 'Description is required'

        if (form.price === '' || form.price === null || form.price === undefined) {
            e.price = 'Price is required'
        } else if (Number(form.price) < 0 || Number.isNaN(Number(form.price))) {
            e.price = 'Price must be 0 or greater'
        }

        return e
    }, [form])

    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
    const markTouched = (key) => setTouched((prev) => ({ ...prev, [key]: true }))

    const onSubmit = async (e) => {
        e.preventDefault()

        setTouched({
            title: true,
            description: true,
            price: true,
            isAvailable: true,
        })

        if (Object.keys(errors).length > 0) return

        try {
            await dispatch(
                createService({
                    title: form.title.trim(),
                    description: form.description.trim(),
                    price: Number(form.price),
                    isAvailable: Boolean(form.isAvailable),
                }),
            ).unwrap()

            setSubmitted(true)
            setTouched({})
            setForm({
                title: '',
                description: '',
                price: '',
                isAvailable: true,
            })
        } catch {
            setSubmitted(false)
        }
    }

    const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to add service')

    return (
        <section>
            <div className='mb-5 rounded-2xl border border-gray-200 bg-gradient-to-r from-white via-white to-red-50 p-4 shadow-sm sm:p-5'>
                <h1 className='text-2xl font-extrabold tracking-tight text-gray-900'>Add New Service</h1>
                <p className='mt-1 text-sm text-gray-600'>Create a new service with model-based fields.</p>
            </div>

            <div className='rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ring-1 ring-black/5 sm:p-6'>
                {submitted && (
                    <div className='mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3'>
                        <p className='inline-flex items-center gap-2 text-sm font-semibold text-emerald-700'>
                            <FiCheckCircle className='h-4 w-4' />
                            Service added successfully.
                        </p>
                    </div>
                )}

                {error && (
                    <div className='mb-4 rounded-xl border border-red-200 bg-red-50 p-3'>
                        <p className='text-sm font-semibold text-red-700'>{errorMessage}</p>
                    </div>
                )}

                <form onSubmit={onSubmit} className='space-y-5'>
                    <label className='block'>
                        <span className='text-sm font-semibold text-gray-900'>Title</span>
                        <input
                            type='text'
                            value={form.title}
                            onChange={(e) => setField('title', e.target.value)}
                            onBlur={() => markTouched('title')}
                            placeholder='e.g. Engine Diagnostics'
                            className='cr-input'
                        />
                        {touched.title && errors.title && <p className='mt-1 text-xs font-semibold text-red-600'>{errors.title}</p>}
                    </label>

                    <label className='block'>
                        <span className='text-sm font-semibold text-gray-900'>Description</span>
                        <textarea
                            value={form.description}
                            onChange={(e) => setField('description', e.target.value)}
                            onBlur={() => markTouched('description')}
                            rows={4}
                            placeholder='Write service details...'
                            className='cr-textarea'
                        />
                        {touched.description && errors.description && <p className='mt-1 text-xs font-semibold text-red-600'>{errors.description}</p>}
                    </label>

                    <div className='grid gap-4 sm:grid-cols-2'>
                        <label className='block'>
                            <span className='text-sm font-semibold text-gray-900'>Price (PKR)</span>
                            <input
                                type='number'
                                min='0'
                                value={form.price}
                                onChange={(e) => setField('price', e.target.value)}
                                onBlur={() => markTouched('price')}
                                placeholder='e.g. 2500'
                                className='cr-input'
                            />
                            {touched.price && errors.price && <p className='mt-1 text-xs font-semibold text-red-600'>{errors.price}</p>}
                        </label>

                        <label className='block'>
                            <span className='text-sm font-semibold text-gray-900'>Availability</span>
                            <div className='mt-2 flex h-[46px] items-center rounded-md border border-gray-200 bg-white px-3'>
                                <input
                                    id='isAvailable'
                                    type='checkbox'
                                    checked={form.isAvailable}
                                    onChange={(e) => setField('isAvailable', e.target.checked)}
                                    className='h-4 w-4 accent-red-600'
                                />
                                <label htmlFor='isAvailable' className='ml-2 text-sm font-semibold text-gray-700'>
                                    Service is available
                                </label>
                            </div>
                        </label>
                    </div>

                    <button
                        type='submit'
                        className='inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
                        disabled={loading}
                    >
                        <FiPlusCircle className='h-4 w-4' />
                        {loading ? 'Adding...' : 'Add Service'}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddNewService