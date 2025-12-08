import { Send } from 'lucide-react';

export default function ContactForm() {
    return (
        <div className="bg-white p-8 rounded-2xl shadow border">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Gửi tin nhắn</h2>

            <form className="space-y-5">
                <div>
                    <label className="font-medium text-gray-700">Họ và tên</label>
                    <input type="text" className="w-full mt-1 p-3 border rounded-xl" placeholder="Nhập họ và tên" />
                </div>

                <div>
                    <label className="font-medium text-gray-700">Email</label>
                    <input type="email" className="w-full mt-1 p-3 border rounded-xl" placeholder="Nhập email" />
                </div>

                <div>
                    <label className="font-medium text-gray-700">Nội dung</label>
                    <textarea
                        rows="4"
                        className="w-full mt-1 p-3 border rounded-xl"
                        placeholder="Nhập nội dung cần hỗ trợ..."
                    ></textarea>
                </div>

                <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                    <Send size={18} />
                    Gửi tin nhắn
                </button>
            </form>
        </div>
    );
}
