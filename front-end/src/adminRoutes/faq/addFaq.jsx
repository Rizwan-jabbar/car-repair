import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FiCheckCircle, FiPlusCircle } from 'react-icons/fi'

import { addFaq } from '../../rtk/thunks/faqThunk/faqThunk'

function AddFaq () {
    const dispatch = useDispatch()
    const { loading, error } = useSelector((state) => state.faq)

    const [form, setForm] = useState({
        category: '',
        question: '',
        answer: '',
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
        if (!form.category.trim()) e.category = 'Category is required'
        if (!form.question.trim()) e.question = 'Question is required'
        if (!form.answer.trim()) e.answer = 'Answer is required'
        return e
    }, [form])

    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))
    const markTouched = (key) => setTouched((prev) => ({ ...prev, [key]: true }))

    const onSubmit = async (e) => {
        e.preventDefault()
        setTouched({ category: true, question: true, answer: true })

        if (Object.keys(errors).length > 0) return

        try {
            await dispatch(addFaq({
                category: form.category.trim(),
                question: form.question.trim(),
                answer: form.answer.trim(),
            })).unwrap()

            setSubmitted(true)
            setTouched({})
            setForm({ category: '', question: '', answer: '' })
        } catch {
            setSubmitted(false)
        }
    }

    const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to add FAQ')

    return (
        <section className='bg-[#f5f9fe]'>
            <div className='mb-5 rounded-2xl border border-white bg-gradient-to-r from-white via-[#f9fbff] to-red-50/70 p-5 shadow-sm sm:p-6'>
                <p className='inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-red-600'>FAQ</p>
                <h1 className='mt-2 text-2xl font-extrabold tracking-tight text-[#102441] sm:text-3xl'>Add New FAQ</h1>
                <p className='mt-1 text-sm text-[#6c83a2]'>Create a new FAQ using your API flow.</p>
            </div>

            <div className='rounded-2xl border border-[#dce8f5] bg-white p-4 shadow-sm ring-1 ring-white sm:p-6'>
                {submitted && (
                    <div className='mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3'>
                        <p className='inline-flex items-center gap-2 text-sm font-semibold text-emerald-700'>
                            <FiCheckCircle className='h-4 w-4' />
                            FAQ added successfully.
                        </p>
                    </div>
                )}

                <form onSubmit={onSubmit} className='space-y-5'>
                    <label className='block'>
                        <span className='text-sm font-semibold text-gray-900'>Category</span>
                        <input
                            type='text'
                            value={form.category}
                            onChange={(e) => setField('category', e.target.value)}
                            onBlur={() => markTouched('category')}
                            placeholder='e.g. Estimates & Payment'
                            className='cr-input'
                        />
                        {touched.category && errors.category && <p className='mt-1 text-xs font-semibold text-red-600'>{errors.category}</p>}
                    </label>

                    <label className='block'>
                        <span className='text-sm font-semibold text-gray-900'>Question</span>
                        <input
                            type='text'
                            value={form.question}
                            onChange={(e) => setField('question', e.target.value)}
                            onBlur={() => markTouched('question')}
                            placeholder='Type the question'
                            className='cr-input'
                        />
                        {touched.question && errors.question && <p className='mt-1 text-xs font-semibold text-red-600'>{errors.question}</p>}
                    </label>

                    <label className='block'>
                        <span className='text-sm font-semibold text-gray-900'>Answer</span>
                        <textarea
                            rows={5}
                            value={form.answer}
                            onChange={(e) => setField('answer', e.target.value)}
                            onBlur={() => markTouched('answer')}
                            placeholder='Type answer details...'
                            className='cr-textarea'
                        />
                        {touched.answer && errors.answer && <p className='mt-1 text-xs font-semibold text-red-600'>{errors.answer}</p>}
                    </label>

                    {error && (
                        <div className='rounded-xl border border-red-200 bg-red-50 p-3'>
                            <p className='text-sm font-semibold text-red-700'>{errorMessage}</p>
                        </div>
                    )}

                    <button
                        type='submit'
                        className='inline-flex items-center gap-2 rounded-md bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
                        disabled={loading}
                    >
                        <FiPlusCircle className='h-4 w-4' />
                        {loading ? <span className='h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white' aria-label='Adding FAQ' /> : 'Add FAQ'}
                    </button>
                </form>
            </div>
        </section>
    )
}

export default AddFaq
