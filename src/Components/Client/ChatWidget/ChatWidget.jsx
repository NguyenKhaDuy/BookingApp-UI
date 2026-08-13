import { useEffect, useState, useRef } from 'react';
import { X, Send, Bot, MessageSquarePlus, PanelLeftOpen, PanelLeftClose, Trash2 } from 'lucide-react';
import axios from 'axios';
import getCookie from '../../../utils/getToken';
import { API_BASE_URL } from '../../../utils/api';
import logo from '../../../assets/logo.png';

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef(null);

    const getUserId = () => {
        const user = localStorage.getItem('user');

        if (!user) return null;

        return JSON.parse(user).id_user;
    };

    useEffect(() => {
        fetchChatHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
        });
    };

    const fetchChatHistory = async () => {
        try {
            const token = getCookie('token');
            const userId = getUserId();

            if (!userId) return;

            const res = await axios.get(`${API_BASE_URL}/customer/chat/history/idUser=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const list = (res.data.data || []).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

            setConversations(list);

            // load cuộc trò chuyện mới nhất
            if (list.length > 0) {
                selectConversation(list[0]);
            }
        } catch (err) {
            console.error('Lỗi lấy lịch sử chat', err);
        }
    };

    const selectConversation = (conversation) => {
        setSelectedConversation(conversation);

        const msgs = conversation.messageDTOS.map((item) => ({
            sender: item.sender === 'AI' ? 'ai' : 'user',
            content: item.content,
            time: new Date(item.createdAt).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
        }));

        setMessages(msgs);
    };

    const MessageContent = ({ content, sender }) => {
        if (sender !== 'ai') {
            return <span>{content}</span>;
        }

        const formatText = (text) => {
            return (
                text
                    // bỏ markdown bold **text**
                    .replace(/\*\*(.*?)\*\*/g, '$1')
                    // bỏ markdown heading ###
                    .replace(/^#+\s*/gm, '')
                    // bỏ emoji cảnh báo nếu muốn
                    .replace('Lưu ý:')
                    .trim()
            );
        };

        const lines = formatText(content).split('\n');

        return (
            <div className="space-y-2 text-sm leading-relaxed">
                {lines.map((line, index) => {
                    const text = line.trim();

                    if (!text) {
                        return <div key={index} className="h-2" />;
                    }

                    // đường phân cách
                    if (text.includes('---')) {
                        return <div key={index} className="my-3 border-t border-gray-200" />;
                    }

                    // tiêu đề
                    if (
                        text.startsWith('Thiết bị') ||
                        text.startsWith('Nguyên nhân') ||
                        text.startsWith('Chi phí') ||
                        text.startsWith('Cách kiểm tra') ||
                        text.startsWith('Khi nào nên gọi')
                    ) {
                        return (
                            <p
                                key={index}
                                className="
                                mt-3
                                font-bold
                                text-orange-600
                            "
                            >
                                {text}
                            </p>
                        );
                    }

                    // list -
                    if (text.startsWith('-')) {
                        return (
                            <div key={index} className="flex gap-2 text-gray-700">
                                <span>•</span>

                                <span>{text.replace('-', '').trim()}</span>
                            </div>
                        );
                    }

                    // số thứ tự 1. 2. 3.
                    if (/^\d+\./.test(text)) {
                        return (
                            <div key={index} className="flex gap-2 text-gray-700">
                                <span className="font-medium">{text.match(/^\d+\./)[0]}</span>

                                <span>{text.replace(/^\d+\.\s*/, '')}</span>
                            </div>
                        );
                    }

                    // dòng key:value
                    if (text.includes(':')) {
                        const [key, ...rest] = text.split(':');

                        return (
                            <p key={index}>
                                <span className="font-semibold text-gray-700">{key}:</span>

                                <span className="ml-1 text-gray-600">{rest.join(':')}</span>
                            </p>
                        );
                    }

                    return (
                        <p key={index} className="text-gray-700">
                            {text}
                        </p>
                    );
                })}
            </div>
        );
    };

    const TypingMessage = () => {
        return (
            <div className="flex items-center gap-1">
                <span className="animate-bounce [animation-delay:-0.3s]">.</span>
                <span className="animate-bounce [animation-delay:-0.15s]">.</span>
                <span className="animate-bounce">.</span>
            </div>
        );
    };

    const createNewConversation = () => {
        const newConversation = {
            idConversation: null,
            title: 'Cuộc trò chuyện mới',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messageDTOS: [
                {
                    idMessage: null,
                    sender: 'AI',
                    content:
                        'Xin chào! Tôi là trợ lý AI của KingTech.\n\nTôi có thể hỗ trợ bạn:\n\n• Kiểm tra đơn sửa chữa\n• Đặt lịch sửa chữa\n• Tư vấn lỗi thiết bị\n• Báo giá dịch vụ\n• Hướng dẫn xử lý lỗi đơn giản\n\nBạn cần hỗ trợ vấn đề gì?',
                    createdAt: new Date().toISOString(),
                },
            ],
        };

        setSelectedConversation(newConversation);

        setMessages([
            {
                sender: 'ai',
                content:
                    'Xin chào! Tôi là trợ lý AI của KingTech.\n\nTôi có thể hỗ trợ bạn:\n\n• Kiểm tra đơn sửa chữa\n• Đặt lịch sửa chữa\n• Tư vấn lỗi thiết bị\n• Báo giá dịch vụ\n• Hướng dẫn xử lý lỗi đơn giản\n\nBạn cần hỗ trợ vấn đề gì?',
                time: new Date().toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
            },
        ]);
    };

    const sendMessage = async () => {
        if (!input.trim() || sending) return;

        const question = input.trim();

        setInput('');

        const currentTime = new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        });

        // thêm tin nhắn user + loading AI
        setMessages((prev) => [
            ...prev,
            {
                sender: 'user',
                content: question,
                time: currentTime,
            },
            {
                sender: 'ai',
                content: '',
                loading: true,
                time: '',
            },
        ]);

        setSending(true);

        try {
            const token = getCookie('token');

            const payload = {
                idConversation: selectedConversation?.idConversation || null,
                message: question,
            };

            const res = await axios.post(`${API_BASE_URL}/chat`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = res.data;

            // cập nhật id conversation khi tạo chat mới
            if (data.idConversation) {
                setSelectedConversation((prev) => ({
                    ...(prev || {}),
                    idConversation: data.idConversation,
                }));

                // thêm vào sidebar nếu là cuộc trò chuyện mới
                setConversations((prev) => {
                    const exists = prev.some((item) => item.idConversation === data.idConversation);

                    if (exists) return prev;

                    return [
                        {
                            idConversation: data.idConversation,
                            title: question,
                            updatedAt: new Date().toISOString(),
                            messageDTOS: [],
                        },
                        ...prev,
                    ];
                });
            }

            // xóa loading + thêm câu trả lời AI
            setMessages((prev) => [
                ...prev.filter((item) => !item.loading),
                {
                    sender: 'ai',
                    content: data.message,
                    time: new Date().toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                },
            ]);
        } catch (error) {
            console.error('Chat lỗi:', error.response?.data || error);

            // xóa loading + báo lỗi
            setMessages((prev) => [
                ...prev.filter((item) => !item.loading),
                {
                    sender: 'ai',
                    content: 'Xin lỗi, hiện tại tôi không thể trả lời.',
                    time: new Date().toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                },
            ]);
        } finally {
            setSending(false);
        }
    };

    const deleteConversation = async (id) => {
        try {
            const token = getCookie('token');

            await axios.delete(`${API_BASE_URL}/customer/chat/idChat=${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Xóa khỏi sidebar
            const newConversations = conversations.filter((item) => item.idConversation !== id);

            setConversations(newConversations);

            // Nếu đang mở đúng cuộc chat vừa xóa
            if (selectedConversation?.idConversation === id) {
                if (newConversations.length > 0) {
                    selectConversation(newConversations[0]);
                } else {
                    createNewConversation();
                }
            }
        } catch (error) {
            console.error('Xóa cuộc trò chuyện thất bại:', error.response?.data || error);
        }
    };

    return (
        <>
            {open && (
                <div
                    className="
                        fixed inset-0 z-50 flex overflow-hidden
                        bg-white shadow-2xl

                        sm:bottom-6 sm:left-auto sm:right-6 sm:top-auto
                        sm:h-[600px] sm:w-[700px]
                        sm:max-w-[90vw]
                        sm:rounded-3xl sm:border
                    "
                >
                    {/* Sidebar */}

                    <aside
                        className={`
                            absolute inset-y-0 left-0 z-20 w-72
                            bg-gray-50 border-r
                            transition-transform duration-300

                            sm:static sm:block

                            ${showHistory ? 'translate-x-0' : '-translate-x-full sm:hidden'}
                        `}
                    >
                        <div className="flex items-center justify-between border-b p-4">
                            <span className="font-semibold">Lịch sử chat</span>

                            <button
                                onClick={() => setShowHistory(false)}
                                className="rounded-lg p-2 hover:bg-gray-200 sm:hidden"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="border-b p-4">
                            <button
                                onClick={createNewConversation}
                                className="
        flex w-full items-center justify-center gap-2
        rounded-xl bg-orange-500 py-3
        text-sm font-medium text-white
        hover:bg-orange-600
    "
                            >
                                <MessageSquarePlus size={18} />
                                Cuộc trò chuyện mới
                            </button>
                        </div>

                        <div className="h-[calc(100%-130px)] overflow-y-auto">
                            {conversations.map((item) => (
                                <div
                                    key={item.idConversation}
                                    className="
                                        group flex items-center justify-between
                                        border-b px-4 py-3
                                        hover:bg-white
                                    "
                                >
                                    <button
                                        onClick={() => selectConversation(item)}
                                        className="min-w-0 flex-1 text-left"
                                    >
                                        <p className="truncate font-medium">{item.title}</p>

                                        <p className="mt-1 text-xs text-gray-500">
                                            {item.createdAt}
                                        </p>
                                    </button>

                                    <button
                                        onClick={() => deleteConversation(item.idConversation)}
                                        className="
                                            ml-2 rounded-lg p-2
                                            text-gray-400

                                            sm:opacity-0
                                            sm:group-hover:opacity-100

                                            hover:bg-red-100
                                            hover:text-red-500
                                        "
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </aside>

                    {showHistory && (
                        <div
                            onClick={() => setShowHistory(false)}
                            className="
                                absolute inset-0 z-10
                                bg-black/30
                                sm:hidden
                            "
                        />
                    )}

                    {/* Chat */}

                    <section className="flex min-w-0 flex-1 flex-col">
                        {/* Header */}

                        <header
                            className="
                                flex items-center justify-between
                                border-b px-4 py-3
                                sm:px-5 sm:py-4
                            "
                        >
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowHistory(!showHistory)}
                                    className="rounded-lg p-2 hover:bg-gray-100"
                                >
                                    {showHistory ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                                </button>

                                <img src={logo} className="h-10 w-10 rounded-full object-cover" />

                                <div>
                                    <h3 className="font-semibold">KingTech AI</h3>

                                    <p className="text-xs text-gray-500">Trợ lý hỗ trợ khách hàng</p>
                                </div>
                            </div>

                            <button onClick={() => setOpen(false)} className="rounded-lg p-2 hover:bg-gray-100">
                                <X size={20} />
                            </button>
                        </header>

                        {/* Messages */}

                        <main
                            className="
                                flex-1 overflow-y-auto
                                bg-gray-50
                                p-4 sm:p-5
                            "
                        >
                            <div className="space-y-5">
                                {messages.map((item, index) => (
                                    <div
                                        key={index}
                                        className={item.sender === 'ai' ? 'flex gap-3' : 'flex justify-end'}
                                    >
                                        {item.sender === 'ai' && (
                                            <div
                                                className="
                                                    flex h-10 w-10 shrink-0
                                                    items-center justify-center
                                                    rounded-full
                                                    bg-orange-500 text-white
                                                "
                                            >
                                                <Bot size={18} />
                                            </div>
                                        )}

                                        <div className="max-w-[90%] sm:max-w-[75%]">
                                            <div
                                                className={`
                                                    rounded-2xl px-4 py-3 shadow

                                                    ${
                                                        item.sender === 'ai'
                                                            ? 'rounded-tl-sm bg-white'
                                                            : 'rounded-tr-sm bg-orange-500 text-white'
                                                    }
                                                `}
                                            >
                                                {item.loading ? (
                                                    <TypingMessage />
                                                ) : (
                                                    <MessageContent content={item.content} sender={item.sender} />
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs text-gray-400">{item.time}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        </main>

                        {/* Input */}

                        <footer className="border-t bg-white p-3 sm:p-4">
                            <div
                                className="
                                    flex items-center gap-3
                                    rounded-2xl border
                                    bg-gray-50 px-3 py-2
                                "
                            >
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            sendMessage();
                                        }
                                    }}
                                    placeholder="Nhập câu hỏi..."
                                    className="
        h-10 flex-1
        bg-transparent
        outline-none
    "
                                />

                                <button
                                    onClick={sendMessage}
                                    disabled={sending}
                                    className={`
        flex h-10 w-10 items-center justify-center
        rounded-xl
        text-white
        transition

        ${sending ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}
    `}
                                >
                                    {sending ? (
                                        <div className="w-4 h-4 bg-white rounded-sm animate-pulse" />
                                    ) : (
                                        <Send size={18} />
                                    )}
                                </button>
                            </div>
                        </footer>
                    </section>
                </div>
            )}

            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="
                        fixed bottom-5 right-5 z-50
                        transition hover:scale-105
                    "
                >
                    <img
                        src={logo}
                        className="
                            h-14 w-14
                            rounded-full shadow-xl
                            sm:h-16 sm:w-16
                        "
                    />
                </button>
            )}
        </>
    );
}
