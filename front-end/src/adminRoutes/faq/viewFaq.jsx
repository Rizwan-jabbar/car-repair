import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { FiEdit3, FiEye, FiEyeOff, FiHelpCircle, FiTrash2, FiX } from 'react-icons/fi'

import { deleteFaq, fetchFaqs, updateFaq } from '../../rtk/thunks/faqThunk/faqThunk'

function ViewFaq () {
    const dispatch = useDispatch()
    const { items = [], loading, error } = useSelector((state) => state.faq)

    const [selectedFaq, setSelectedFaq] = useState(null)
    const [editingFaq, setEditingFaq] = useState(null)
    const [editForm, setEditForm] = useState({ category: '', question: '', answer: '' })
    const [hiddenIds, setHiddenIds] = useState([])

    useEffect(() => {
        dispatch(fetchFaqs())
    }, [dispatch])

    const faqs = useMemo(() => {
        const list = Array.isArray(items) ? items : []
        return list
            .map((item) => item?.faq ?? item)
            .filter((faq) => faq && typeof faq === 'object')
    }, [items])

    const getFaqId = (faq) => faq?._id ?? faq?.id

    const visibleFaqCount = useMemo(
        () => faqs.filter((faq) => !hiddenIds.includes(getFaqId(faq))).length,
        [faqs, hiddenIds],
    )

    const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to load FAQs')

    const onHideToggle = (faq) => {
        const id = getFaqId(faq)
        if (!id) return

        setHiddenIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

        if (getFaqId(selectedFaq) === id) {
            setSelectedFaq(null)
        }
    }

    const onDeleteFaq = async (faq) => {
        const id = getFaqId(faq)
        if (!id) return

        const ok = window.confirm('Are you sure you want to delete this FAQ?')
        if (!ok) return

        await dispatch(deleteFaq(id))

        if (getFaqId(selectedFaq) === id) {
            setSelectedFaq(null)
        }
    }

    const openEdit = (faq) => {
        const id = getFaqId(faq)
        if (!id) return

        setEditForm({
            category: faq?.category || '',
            question: faq?.question || '',
            answer: faq?.answer || '',
        })
        setEditingFaq(faq)
    }

    const closeEdit = () => {
        setEditingFaq(null)
        setEditForm({ category: '', question: '', answer: '' })
    }

    const submitEdit = async (e) => {
        e.preventDefault()

        const id = getFaqId(editingFaq)
        if (!id) return

        const category = editForm.category.trim()
        const question = editForm.question.trim()
        const answer = editForm.answer.trim()
        if (!category || !question || !answer) return

        await dispatch(updateFaq({ faqId: id, faqData: { category, question, answer } }))

        if (getFaqId(selectedFaq) === id) {
            setSelectedFaq({ ...selectedFaq, category, question, answer })
        }

        closeEdit()
    }

    return (
        <section className='w-full max-w-full bg-[#f5f9fe]'>
            <div className='relative mb-5 overflow-hidden rounded-2xl border border-white bg-gradient-to-r from-white via-[#f9fbff] to-red-50/70 p-5 shadow-sm sm:p-6'>
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <p className='inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-red-600'>FAQ</p>
                        <h1 className='mt-2 text-2xl font-extrabold tracking-tight text-[#102441] sm:text-3xl'>View FAQs</h1>
                        <p className='mt-1 text-sm text-[#6c83a2]'>Manage FAQ entries in a clean tabular view.</p>
                    </div>

                    <div className='inline-flex items-center gap-2 rounded-2xl border border-red-100 bg-white px-4 py-3 text-xs font-semibold text-red-700 shadow-sm'>
                        <FiHelpCircle className='h-4 w-4 text-red-600' />
                        {visibleFaqCount} visible FAQs
                    </div>
                </div>
            </div>

            {loading && (
                <div className='flex items-center justify-center rounded-xl border border-gray-200 bg-white p-8'>
                    <span className='h-7 w-7 animate-spin rounded-full border-4 border-red-100 border-t-red-600' aria-label='Loading FAQs' />
                </div>
            )}

            {!loading && error && (
                <div className='rounded-xl border border-red-200 bg-red-50 p-4'>
                    <p className='text-sm font-semibold text-red-700'>{errorMessage}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    <div className='hidden overflow-x-auto md:block'>
                        <table className='min-w-full text-left'>
                            <thead className='bg-black text-white'>
                                <tr>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Category</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Question</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='before:block before:h-3 before:content-["_"]'>
                                {faqs.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className='px-4 py-6 text-center text-sm font-semibold text-gray-500'>
                                            No FAQs to show.
                                        </td>
                                    </tr>
                                ) : (
                                    faqs.map((faq, idx) => {
                                        const id = faq?._id ?? faq?.id ?? idx
                                        const isHidden = hiddenIds.includes(id)

                                        return (
                                            <tr
                                                key={id}
                                                onClick={() => setSelectedFaq(faq)}
                                                className='cursor-pointer bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md'
                                            >
                                                <td className='px-4 py-3 text-sm font-semibold text-gray-900'>{faq?.category || '-'}</td>
                                                <td className='px-4 py-3 text-sm text-gray-700'>
                                                    <p className='max-w-2xl truncate'>{faq?.question || '-'}</p>
                                                </td>
                                                <td className='px-4 py-3'>
                                                    <div className='flex items-center gap-2' onClick={(e) => e.stopPropagation()}>
                                                        <button
                                                            type='button'
                                                            onClick={() => openEdit(faq)}
                                                            className='inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50'
                                                        >
                                                            <FiEdit3 className='h-3.5 w-3.5' />
                                                            Edit
                                                        </button>
                                                        <button
                                                            type='button'
                                                            onClick={() => onHideToggle(faq)}
                                                            className='inline-flex items-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100'
                                                        >
                                                            {isHidden ? <FiEye className='h-3.5 w-3.5' /> : <FiEyeOff className='h-3.5 w-3.5' />}
                                                            {isHidden ? 'Show' : 'Hide'}
                                                        </button>
                                                        <button
                                                            type='button'
                                                            onClick={() => onDeleteFaq(faq)}
                                                            className='inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100'
                                                        >
                                                            <FiTrash2 className='h-3.5 w-3.5' />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className='space-y-3 md:hidden'>
                        {faqs.length === 0 ? (
                            <div className='rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-500'>
                                No FAQs to show.
                            </div>
                        ) : (
                            faqs.map((faq, idx) => {
                                const id = faq?._id ?? faq?.id ?? idx
                                const isHidden = hiddenIds.includes(id)

                                return (
                                    <motion.article
                                        key={id}
                                        layout
                                        onClick={() => setSelectedFaq(faq)}
                                        className='rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 shadow-sm ring-1 ring-black/5 transition active:scale-[0.99]'
                                    >
                                        <div className='flex items-start justify-between gap-3'>
                                            <div>
                                                <p className='inline-flex rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-gray-600'>
                                                    {faq?.category || '-'}
                                                </p>
                                                <p className='mt-2 text-sm font-bold leading-5 text-gray-900'>{faq?.question || '-'}</p>
                                            </div>

                                            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${isHidden ? 'border border-amber-200 bg-amber-50 text-amber-700' : 'border border-emerald-200 bg-emerald-50 text-emerald-700'}`}>
                                                {isHidden ? 'Hidden' : 'Visible'}
                                            </span>
                                        </div>

                                        <div className='mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3' onClick={(e) => e.stopPropagation()}>
                                            <button
                                                type='button'
                                                onClick={() => openEdit(faq)}
                                                className='inline-flex items-center justify-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50'
                                            >
                                                <FiEdit3 className='h-3.5 w-3.5' />
                                                Edit
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => onHideToggle(faq)}
                                                className='inline-flex items-center justify-center gap-1 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100'
                                            >
                                                {isHidden ? <FiEye className='h-3.5 w-3.5' /> : <FiEyeOff className='h-3.5 w-3.5' />}
                                                {isHidden ? 'Show' : 'Hide'}
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => onDeleteFaq(faq)}
                                                className='inline-flex items-center justify-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-2 text-xs font-semibold text-red-700 shadow-sm transition hover:bg-red-100'
                                            >
                                                <FiTrash2 className='h-3.5 w-3.5' />
                                                Delete
                                            </button>
                                        </div>
                                    </motion.article>
                                )
                            })
                        )}
                    </div>
                </>
            )}

            <AnimatePresence>
                {selectedFaq && (
                    <motion.div
                        className='fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedFaq(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className='w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 shadow-2xl ring-1 ring-black/5 sm:p-6'
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <p className='text-xs font-semibold uppercase tracking-wide text-red-600'>FAQ Details</p>
                                    <h3 className='mt-1 text-xl font-extrabold text-gray-900'>{selectedFaq?.question || 'FAQ'}</h3>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => setSelectedFaq(null)}
                                    className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50'
                                >
                                    <FiX className='h-4 w-4' />
                                </button>
                            </div>

                            <div className='mt-4 rounded-xl border border-gray-200 bg-gray-50 p-3'>
                                <p className='text-xs font-semibold text-gray-500'>Category</p>
                                <p className='mt-1 text-sm font-semibold text-gray-900'>{selectedFaq?.category || '-'}</p>
                            </div>

                            <div className='mt-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm'>
                                <p className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Answer</p>
                                <p className='mt-2 text-sm leading-6 text-gray-700'>{selectedFaq?.answer || '-'}</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {editingFaq && (
                    <motion.div
                        className='fixed inset-0 z-[90] flex items-center justify-center bg-black/50 p-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeEdit}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.98 }}
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                            className='w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl sm:p-6'
                        >
                            <div className='flex items-start justify-between gap-3'>
                                <div>
                                    <p className='text-xs font-semibold uppercase tracking-wide text-red-600'>Edit FAQ</p>
                                    <h3 className='mt-1 text-xl font-extrabold text-gray-900'>Update FAQ</h3>
                                </div>
                                <button
                                    type='button'
                                    onClick={closeEdit}
                                    className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50'
                                >
                                    <FiX className='h-4 w-4' />
                                </button>
                            </div>

                            <form className='mt-4 space-y-4' onSubmit={submitEdit}>
                                <label className='block'>
                                    <span className='text-sm font-semibold text-gray-900'>Category</span>
                                    <input
                                        type='text'
                                        value={editForm.category}
                                        onChange={(e) => setEditForm((prev) => ({ ...prev, category: e.target.value }))}
                                        className='mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100'
                                    />
                                </label>

                                <label className='block'>
                                    <span className='text-sm font-semibold text-gray-900'>Question</span>
                                    <input
                                        type='text'
                                        value={editForm.question}
                                        onChange={(e) => setEditForm((prev) => ({ ...prev, question: e.target.value }))}
                                        className='mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100'
                                    />
                                </label>

                                <label className='block'>
                                    <span className='text-sm font-semibold text-gray-900'>Answer</span>
                                    <textarea
                                        rows={5}
                                        value={editForm.answer}
                                        onChange={(e) => setEditForm((prev) => ({ ...prev, answer: e.target.value }))}
                                        className='mt-1 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-red-300 focus:ring-2 focus:ring-red-100'
                                    />
                                </label>

                                <div className='flex items-center justify-end gap-2 pt-2'>
                                    <button
                                        type='button'
                                        onClick={closeEdit}
                                        className='rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50'
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type='submit'
                                        className='rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700'
                                    >
                                        Update FAQ
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default ViewFaq