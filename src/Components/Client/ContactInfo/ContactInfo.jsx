import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactInfo() {
    return (
        <div className="bg-gray-100 p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Thông tin liên hệ</h2>

            <div className="flex items-center gap-4 mb-5">
                <Phone className="text-orange-500" />
                <p className="text-gray-700 font-medium">+84 0971349801</p>
            </div>

            <div className="flex items-center gap-4 mb-5">
                <Mail className="text-orange-500" />
                <p className="text-gray-700 font-medium">Bookingappsince2025@gmail.com</p>
            </div>

            <div className="flex items-center gap-4 mb-5">
                <MapPin className="text-orange-500" />
                <p className="text-gray-700 font-medium">19 Đường Quảng Trọng Hoàng, Phường Ninh Kiều, TP.Cần Thơ</p>
            </div>
        </div>
    );
}
