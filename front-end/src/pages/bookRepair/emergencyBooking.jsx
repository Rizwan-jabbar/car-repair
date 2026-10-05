import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { createEmergencyBooking } from '../../rtk/thunks/bookingThunk/bookingThunk'
import { getVerifiedToken } from '../../rtk/utils/authToken'

const initialForm = {
    fullName: '', phone: '', vehicleBrand: '', carModel: '', registrationNumber: '',
    cityArea: '', completeAddress: '', emergencyType: 'Car Won’t Start', problemDescription: '',
    service: 'Emergency Mechanic', bookingType: 'Emergency', locationType: 'Mechanic at My Location',
    preferredDate: '', preferredTime: '', consent: true,
}

function EmergencyBooking () {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, booking, error } = useSelector((state) => state.booking)
    const [form, setForm] = useState(initialForm)
    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
    const submit = (event) => {
        event.preventDefault()
        if (!getVerifiedToken()) {
            navigate(`/login?redirect=${encodeURIComponent('/emergency-booking')}`)
            return
        }
        dispatch(createEmergencyBooking(form))
    }
    return <section className='cr-section cr-section-muted'><div className='cr-container cr-section-pad max-w-3xl'>
        <div className='mb-8'><p className='text-xs font-bold uppercase tracking-[0.16em] text-red-600'>Emergency assistance</p><h1 className='mt-3 text-3xl font-extrabold text-[#102957] sm:text-4xl'>Request Emergency Help</h1><p className='mt-3 text-gray-600'>Tell us where your vehicle is and what happened. Our team will review your emergency request.</p></div>
        {booking?.booking?.referenceNumber && <div className='mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-semibold text-emerald-700'>Emergency request sent. Reference: {booking.booking.referenceNumber}</div>}
        {error && <div className='mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700'>{error?.message || error}</div>}
        <form onSubmit={submit} className='grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-7'>
            {['fullName', 'phone', 'vehicleBrand', 'carModel', 'registrationNumber', 'cityArea', 'completeAddress'].map((field) => <label key={field} className={field === 'completeAddress' ? 'sm:col-span-2' : ''}><span className='text-sm font-semibold text-gray-900'>{field === 'fullName' ? 'Customer name' : field === 'phone' ? 'Phone number' : field.replace(/([A-Z])/g, ' $1')}</span><input required={['fullName', 'phone', 'vehicleBrand', 'carModel', 'cityArea', 'completeAddress'].includes(field)} className='cr-input mt-1' value={form[field]} onChange={(e) => setField(field, e.target.value)} /></label>)}
            <label><span className='text-sm font-semibold text-gray-900'>Breakdown type</span><select className='cr-input mt-1' value={form.emergencyType} onChange={(e) => setField('emergencyType', e.target.value)}>{['Car Won’t Start', 'Battery Problem', 'Flat Tyre', 'Engine Problem', 'Overheating', 'Brake Problem', 'Electrical Problem', 'Accident / Vehicle Immobilized', 'Other'].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label className='sm:col-span-2'><span className='text-sm font-semibold text-gray-900'>Problem description</span><textarea required className='cr-input mt-1' rows={4} value={form.problemDescription} onChange={(e) => setField('problemDescription', e.target.value)} /></label>
            <button disabled={loading} className='cr-btn-primary sm:col-span-2' type='submit'>{loading ? 'Sending request...' : 'Send Emergency Request'}</button>
        </form>
    </div></section>
}

export default EmergencyBooking
