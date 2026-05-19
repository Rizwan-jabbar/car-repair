import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageCircle, FiSend, FiX } from 'react-icons/fi'

import { askAi } from '../../rtk/thunks/aiThunk/aiThunk'

function AiChatBot () {
    const dispatch = useDispatch()
    const inputRef = useRef(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isHoveringChat, setIsHoveringChat] = useState(false)
    const [loading, setLoading] = useState(false)
    const [question, setQuestion] = useState('')
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            sender: 'bot',
            text: 'Assalam o Alaikum! Main AI Car Assistant hoon. Aap apni car issue yahan type karain.',
        },
    ])

    const canSend = useMemo(() => !loading && question.trim().length > 0, [loading, question])

    useEffect(() => {
        document.body.style.overflow = isOpen && isHoveringChat ? 'hidden' : ''

        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen, isHoveringChat])

    const closeChat = () => {
        setIsHoveringChat(false)
        setIsOpen(false)
    }

    const handleSend = async (e) => {
        e.preventDefault()

        const trimmedQuestion = question.trim()
        if (!trimmedQuestion || loading) return

        const userMessage = {
            id: `${Date.now()}-user`,
            sender: 'user',
            text: trimmedQuestion,
        }

        setMessages((prev) => [...prev, userMessage])
        setQuestion('')
        setLoading(true)

        try {
            const response = await dispatch(askAi(trimmedQuestion)).unwrap()
            setMessages((prev) => [
                ...prev,
                {
                    id: `${Date.now()}-bot`,
                    sender: 'bot',
                    text: response?.answer || 'Mujhe is waqt koi jawab nahi mila. Dobara try karain.',
                },
            ])
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: `${Date.now()}-error`,
                    sender: 'bot',
                    text: (typeof error === 'string' ? error : error?.error) || 'AI response nahi aa saka. Please thori dair baad try karain.',
                },
            ])
        } finally {
            setLoading(false)
            setTimeout(() => inputRef.current?.focus(), 0)
        }
    }

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.section
                        className='fixed bottom-20 left-3 right-3 z-50 flex h-[min(68vh,28rem)] flex-col overflow-hidden rounded-2xl border border-red-200 bg-white shadow-2xl sm:left-auto sm:right-5 sm:h-[28rem] sm:w-[21rem]'
                        initial={{ opacity: 0, y: 14, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        onMouseEnter={() => setIsHoveringChat(true)}
                        onMouseLeave={() => setIsHoveringChat(false)}
                    >
                        <div className='flex items-center justify-between bg-red-600 px-4 py-3 text-white'>
                            <div>
                                <p className='text-sm font-extrabold'>AI Car Assistant</p>
                                <p className='text-xs text-red-100'>Online</p>
                            </div>
                            <button
                                type='button'
                                onClick={closeChat}
                                className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25'
                                aria-label='Close AI chat'
                            >
                                <FiX className='h-4 w-4' aria-hidden='true' />
                            </button>
                        </div>

                        <div className='flex-1 space-y-3 overflow-y-auto bg-gray-50 p-3'>
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <p
                                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                                            message.sender === 'user'
                                                ? 'rounded-br-sm bg-red-600 text-white'
                                                : 'rounded-bl-sm border border-gray-200 bg-white text-gray-700'
                                        }`}
                                    >
                                        {message.text}
                                    </p>
                                </div>
                            ))}

                            {loading && (
                                <div className='flex justify-start'>
                                    <p className='rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600'>
                                        Typing...
                                    </p>
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleSend} className='border-t border-red-200 bg-red-50 p-3'>
                            <div className='flex items-end gap-2'>
                                <textarea
                                    ref={inputRef}
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    rows={1}
                                    placeholder='Type your car problem...'
                                    className='min-h-10 flex-1 resize-none rounded-xl border border-red-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-200'
                                />
                                <button
                                    type='submit'
                                    disabled={!canSend}
                                    className='inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
                                    aria-label='Send message'
                                >
                                    <FiSend className='h-4 w-4' aria-hidden='true' />
                                </button>
                            </div>
                        </form>
                    </motion.section>
                )}
            </AnimatePresence>

            {!isOpen && (
                <motion.button
                    type='button'
                    onClick={() => setIsOpen(true)}
                    aria-label='Open AI chat'
                    className='fixed bottom-20 right-4 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg ring-1 ring-white/45 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:from-red-600 hover:to-red-800 hover:shadow-2xl sm:right-5'
                    whileHover={{ y: -3, scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                >
                    <FiMessageCircle className='h-5 w-5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.22)]' aria-hidden='true' />
                </motion.button>
            )}
        </>
    )
}

export default AiChatBot
