import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiAlertTriangle, FiMapPin, FiPhone, FiTool, FiUser } from 'react-icons/fi'

import { createEmergencyBooking } from '../../rtk/thunks/bookingThunk/bookingThunk'
import { resetBooking } from '../../rtk/slices/bookRepair/bookRepair'

const initialForm = {
    fullName: '',
    phone: '',
    vehicleBrand: '',
    carModel: '',
    registrationNumber: '',
    cityArea: '',
    completeAddress: '',
    emergencyType: 'Car Won’t Start',
    problemDescription: '',
}

const emergencyTypes = [
    'Car Won’t Start',
    'Battery Problem',
    'Flat Tyre',
    'Engine Problem',
    'Overheating',
    'Brake Problem',
    'Electrical Problem',
    'Accident / Vehicle Immobilized',
    'Other',
]

function EmergencyBooking () {
    const dispatch = useDispatch()
    const { loading, booking, error } = useSelector((state) => state.booking)
    const [form, setForm] = useState(initialForm)

    useEffect(() => {
        dispatch(resetBooking())
    }, [dispatch])

    const setField = (key, value) => setForm((previous) => ({ ...previous, [key]: value }))

    const submit = (event) => {
        event.preventDefault()

        dispatch(createEmergencyBooking(form))
    }

    const errorMessage = typeof error === 'string' ? error : (error?.message || 'Emergency request failed')

    return (
        <section className='cr-section cr-section-muted'>
            <div className='cr-container cr-section-pad'>
                <div className='mx-auto max-w-3xl'>
                    <div className='mb-8 text-center sm:text-left'>
                        <p className='inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-red-600'>
                            <span className='h-px w-8 bg-red-500' />
                            Emergency Assistance
                            <span className='h-px w-8 bg-red-500' />
                        </p>
                        <h1 className='mt-3 text-3xl font-extrabold leading-tight tracking-tight text-[#102957] sm:text-4xl'>
                            Request Emergency Help
                        </h1>
                        <p className='mt-3 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base'>
                            Tell us what happened and where your vehicle is. Our team will review your request and arrange help.
                        </p>
                    </div>

                    {booking?.booking?.referenceNumber && (
                        <div className='mb-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700'>
                            <span className='mt-0.5'>✓</span>
                            <span>Emergency request sent successfully. Reference: {booking.booking.referenceNumber}</span>
                        </div>
                    )}

                    {error && (
                        <div className='mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700'>
                            {errorMessage}
                        </div>
                    )}

                    <div className='overflow-hidden rounded-xl border border-[#dfe8f0] bg-white shadow-sm'>
                        <div className='flex items-center justify-between border-b border-[#e5edf4] px-5 py-4 sm:px-7'>
                            <div className='flex items-center gap-3'>
                                <span className='flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600'>
                                    <FiAlertTriangle className='h-5 w-5' />
                                </span>
                                <div>
                                    <p className='text-sm font-extrabold text-[#17345c]'>Emergency Details</p>
                                    <p className='text-[10px] text-[#6d86a0]'>Please provide accurate information for faster assistance.</p>
                                </div>
                            </div>
                            <span className='hidden rounded-full bg-red-50 px-3 py-2 text-[10px] font-bold text-red-600 sm:inline-flex'>Emergency Request</span>
                        </div>

                        {!booking && (
                            <form onSubmit={submit} className='booking-form space-y-5 p-5 sm:p-7'>
                                <div className='grid gap-4 sm:grid-cols-2'>
                                    <label>
                                        <span className='flex items-center gap-2'><FiUser />Customer Name</span>
                                        <input required className='cr-input' value={form.fullName} onChange={(event) => setField('fullName', event.target.value)} placeholder='e.g. Ali Khan' />
                                    </label>
                                    <label>
                                        <span className='flex items-center gap-2'><FiPhone />Phone Number</span>
                                        <input required type='tel' className='cr-input' value={form.phone} onChange={(event) => setField('phone', event.target.value)} placeholder='e.g. +92 3xx xxxxxxx' />
                                    </label>
                                </div>

                                <div className='grid gap-4 sm:grid-cols-2'>
                                    <label>
                                        <span className='flex items-center gap-2'><FiTool />Vehicle Brand / Make</span>
                                        <input required className='cr-input' value={form.vehicleBrand} onChange={(event) => setField('vehicleBrand', event.target.value)} placeholder='e.g. Toyota' />
                                    </label>
                                    <label>
                                        <span className='flex items-center gap-2'><FiTool />Vehicle Model</span>
                                        <input required className='cr-input' value={form.carModel} onChange={(event) => setField('carModel', event.target.value)} placeholder='e.g. Corolla 2020' />
                                    </label>
                                </div>

                                <div className='grid gap-4 sm:grid-cols-2'>
                                    <label>
                                        <span>Registration Number (optional)</span>
                                        <input className='cr-input' value={form.registrationNumber} onChange={(event) => setField('registrationNumber', event.target.value)} placeholder='e.g. ABC-123' />
                                    </label>
                                    <label>
                                        <span className='flex items-center gap-2'><FiAlertTriangle />Emergency / Breakdown Type</span>
                                        <select className='cr-input' value={form.emergencyType} onChange={(event) => setField('emergencyType', event.target.value)}>
                                            {emergencyTypes.map((type) => <option key={type}>{type}</option>)}
                                        </select>
                                    </label>
                                </div>

                                <div className='grid gap-4 sm:grid-cols-2'>
                                    <label>
                                        <span className='flex items-center gap-2'><FiMapPin />Current City / Area</span>
                                        <input required className='cr-input' value={form.cityArea} onChange={(event) => setField('cityArea', event.target.value)} placeholder='e.g. Lahore, Johar Town' />
                                    </label>
                                    <label>
                                        <span>Complete Breakdown Location</span>
                                        <input required className='cr-input' value={form.completeAddress} onChange={(event) => setField('completeAddress', event.target.value)} placeholder='Enter the complete address' />
                                    </label>
                                </div>

                                <label>
                                    <span>Problem Description</span>
                                    <textarea required rows={4} className='cr-textarea' value={form.problemDescription} onChange={(event) => setField('problemDescription', event.target.value)} placeholder='Describe the issue or breakdown clearly' />
                                </label>

                                <button disabled={loading} className='cr-btn-primary w-full sm:w-auto' type='submit'>
                                    {loading ? 'Sending Request...' : 'Send Emergency Request'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default EmergencyBooking
