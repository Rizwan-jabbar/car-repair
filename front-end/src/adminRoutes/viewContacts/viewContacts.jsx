import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMail, FiMessageSquare, FiPhone, FiUser, FiX } from 'react-icons/fi'

import { getAllContacts } from '../../rtk/thunks/contactThunk/contactThunk'

function ViewContacts () {
    const dispatch = useDispatch()
    const { contacts, loading, error } = useSelector((state) => state.contact)

    const [selectedContact, setSelectedContact] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        dispatch(getAllContacts())
    }, [dispatch])

    const contactItems = useMemo(() => {
        if (Array.isArray(contacts)) return contacts
        if (Array.isArray(contacts?.contacts)) return contacts.contacts
        return []
    }, [contacts])

    const filteredContacts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase()
        if (!q) return contactItems

        return contactItems.filter((item) => {
            return [item?.name, item?.phone, item?.email, item?.message]
                .some((v) => String(v || '').toLowerCase().includes(q))
        })
    }, [contactItems, searchQuery])

    const errorMessage = typeof error === 'string' ? error : (error?.message || 'Failed to load contacts')

    return (
        <section className='bg-[#f5f9fe]'>
            <div className='mb-5 rounded-2xl border border-white bg-gradient-to-r from-white via-[#f9fbff] to-red-50/70 p-5 shadow-sm sm:p-6'>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                        <p className='inline-flex rounded-full bg-red-50 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-red-600'>Contact</p>
                        <h1 className='mt-2 text-2xl font-extrabold tracking-tight text-[#102441] sm:text-3xl'>View Contacts</h1>
                        <p className='mt-1 text-sm text-[#6c83a2]'>All contact messages submitted by users.</p>
                    </div>

                    <div className='inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 shadow-sm'>
                        <FiMessageSquare className='h-4 w-4 text-red-600' />
                        {filteredContacts.length} / {contactItems.length} messages
                    </div>
                </div>
            </div>

            {!loading && !error && (
                <div className='mb-4 rounded-xl border border-gray-200 bg-white p-3 shadow-sm ring-1 ring-black/5 sm:p-4'>
                    <label className='block'>
                        <span className='text-xs font-semibold uppercase tracking-wide text-gray-500'>Search</span>
                        <input
                            type='text'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder='Name, phone, email, message...'
                            className='mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-red-300 focus:ring-2 focus:ring-red-100'
                        />
                    </label>
                </div>
            )}

            {loading && (
                <div className='flex items-center justify-center rounded-xl border border-gray-200 bg-white p-8'>
                    <span className='h-7 w-7 animate-spin rounded-full border-4 border-red-100 border-t-red-600' aria-label='Loading contacts' />
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
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Name</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Phone</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Email</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Message</th>
                                    <th className='px-4 py-3 text-xs font-bold uppercase tracking-wide text-gray-600'>Action</th>
                                </tr>
                            </thead>

                            <tbody className='before:block before:h-3 before:content-["_"]'>
                                {filteredContacts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className='px-4 py-6 text-center text-sm font-semibold text-gray-500'>
                                            No contact messages found.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredContacts.map((item, idx) => {
                                        const id = item?._id ?? idx
                                        return (
                                            <tr
                                                key={id}
                                                onClick={() => setSelectedContact(item)}
                                                className='cursor-pointer bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-md'
                                            >
                                                <td className='px-4 py-3 text-sm font-semibold text-gray-900'>{item?.name || '-'}</td>
                                                <td className='px-4 py-3 text-sm text-gray-700'>{item?.phone || '-'}</td>
                                                <td className='px-4 py-3 text-sm text-gray-700'>{item?.email || '-'}</td>
                                                <td className='max-w-[340px] overflow-hidden px-4 py-3 text-sm text-gray-700 text-ellipsis whitespace-nowrap'>
                                                    {item?.message || '-'}
                                                </td>
                                                <td className='px-4 py-3'>
                                                    <button
                                                        type='button'
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setSelectedContact(item)
                                                        }}
                                                        className='inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-50 hover:shadow'
                                                    >
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className='space-y-3 md:hidden'>
                        {filteredContacts.length === 0 ? (
                            <div className='rounded-xl border border-gray-200 bg-white p-4 text-sm font-semibold text-gray-500'>
                                No contact messages found.
                            </div>
                        ) : (
                            filteredContacts.map((item, idx) => {
                                const id = item?._id ?? idx
                                return (
                                    <motion.article
                                        key={id}
                                        layout
                                        onClick={() => setSelectedContact(item)}
                                        className='rounded-xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-4 shadow-sm ring-1 ring-black/5'
                                    >
                                        <div className='flex items-start justify-between gap-3'>
                                            <div>
                                                <p className='text-sm font-bold text-gray-900'>{item?.name || '-'}</p>
                                                <p className='mt-0.5 text-xs text-gray-500'>{item?.phone || '-'}</p>
                                            </div>
                                            <button
                                                type='button'
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedContact(item)
                                                }}
                                                className='inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50'
                                            >
                                                View
                                            </button>
                                        </div>

                                        <p className='mt-2 text-xs text-gray-500'>{item?.email || '-'}</p>
                                        <p className='mt-2 line-clamp-3 text-sm text-gray-700'>{item?.message || '-'}</p>
                                    </motion.article>
                                )
                            })
                        )}
                    </div>
                </>
            )}

            <AnimatePresence>
                {selectedContact && (
                    <motion.div
                        className='fixed inset-0 z-[90] overflow-y-auto bg-black/50 p-4'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedContact(null)}
                    >
                        <div className='flex min-h-full items-center justify-center py-6'>
                            <motion.div
                                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 24, scale: 0.98 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                onClick={(e) => e.stopPropagation()}
                                className='w-full max-w-2xl rounded-2xl border border-gray-200 bg-gradient-to-b from-white to-gray-50 p-5 shadow-2xl ring-1 ring-black/5 sm:p-6'
                            >
                                <div className='flex items-start justify-between gap-3'>
                                    <div>
                                        <p className='text-xs font-semibold uppercase tracking-wide text-red-600'>Contact Details</p>
                                        <h3 className='mt-1 text-xl font-extrabold text-gray-900'>{selectedContact?.name || 'Customer'}</h3>
                                    </div>

                                    <button
                                        type='button'
                                        onClick={() => setSelectedContact(null)}
                                        className='inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50'
                                    >
                                        <FiX className='h-4 w-4' />
                                    </button>
                                </div>

                                <div className='mt-4 grid gap-3 sm:grid-cols-2'>
                                    <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                        <p className='text-xs font-semibold text-gray-500'>Name</p>
                                        <p className='mt-1 inline-flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                            <FiUser className='h-4 w-4 text-gray-500' />
                                            {selectedContact?.name || '-'}
                                        </p>
                                    </div>

                                    <div className='rounded-xl border border-gray-200 bg-white p-3'>
                                        <p className='text-xs font-semibold text-gray-500'>Phone</p>
                                        <p className='mt-1 inline-flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                            <FiPhone className='h-4 w-4 text-gray-500' />
                                            {selectedContact?.phone || '-'}
                                        </p>
                                    </div>

                                    <div className='rounded-xl border border-gray-200 bg-white p-3 sm:col-span-2'>
                                        <p className='text-xs font-semibold text-gray-500'>Email</p>
                                        <p className='mt-1 inline-flex items-center gap-2 text-sm font-semibold text-gray-900'>
                                            <FiMail className='h-4 w-4 text-gray-500' />
                                            {selectedContact?.email || '-'}
                                        </p>
                                    </div>

                                    <div className='rounded-xl border border-gray-200 bg-white p-3 sm:col-span-2'>
                                        <p className='text-xs font-semibold text-gray-500'>Message</p>
                                        <p className='mt-1 whitespace-pre-wrap text-sm text-gray-700'>{selectedContact?.message || '-'}</p>
                                    </div>

                                    <div className='rounded-xl border border-gray-200 bg-white p-3 sm:col-span-2'>
                                        <p className='text-xs font-semibold text-gray-500'>Contact ID</p>
                                        <p className='mt-1 break-all text-xs font-semibold text-gray-700'>{selectedContact?._id || '-'}</p>
                                    </div>
                                </div>

                                <div className='mt-4 flex justify-end'>
                                    <button
                                        type='button'
                                        onClick={() => setSelectedContact(null)}
                                        className='rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50'
                                    >
                                        Close
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default ViewContacts