import { Mail, MapPin, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import getCookie from '../../../utils/getToken';
import { useEffect, useState } from 'react';
export default function Footer() {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);
    useEffect(() => {
        const token = getCookie('token');

        const user = localStorage.getItem('user');

        if (!token || !user) {
            setIsLogin(false);
        }
    }, []);
    return (
        <footer className="bg-[#0a1a2f] text-gray-300 pt-20 pb-10 px-6 z-50">
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
                {/* Logo / About */}
                <div>
                    <div className="d-flex align-items-center gap-3">
                        <img src={logo} alt="logo" className="w-20 h-20 object-contain" />
                        <h2 className="text-2xl font-bold text-white mb-4">KingTech</h2>
                    </div>

                    <p className="text-gray-400 leading-relaxed">
                        Dịch vụ sửa chữa tận nơi — nhanh chóng, uy tín, chi phí minh bạch.
                    </p>
                </div>

                {/* Navigation */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Điều hướng</h3>
                    <ul className="space-y-3 text-gray-400">
                        <li>
                            <Link to={'/'} className="hover:text-orange-500 transition">
                                Dịch vụ
                            </Link>
                        </li>
                        <li>
                            <Link to="/technicians" className="hover:text-orange-500 transition">
                                Kỹ thuật viên
                            </Link>
                        </li>
                        <li>
                            <Link to={isLogin ? '/booking' : '/login'} className="hover:text-orange-500 transition">
                                Đặt lịch
                            </Link>
                        </li>
                        <li>
                            <Link to={'/contact'} className="hover:text-orange-500 transition">
                                Liên hệ
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Hỗ trợ</h3>
                    <ul className="space-y-3 text-gray-400">
                        <li>
                            <a href="#" className="hover:text-orange-500 transition">
                                Câu hỏi thường gặp
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-orange-500 transition">
                                Chính sách bảo hành
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-orange-500 transition">
                                Điều khoản dịch vụ
                            </a>
                        </li>
                        <li>
                            <a href="#" className="hover:text-orange-500 transition">
                                Chính sách bảo mật
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Liên hệ</h3>
                    <ul className="space-y-4 text-gray-400">
                        <li className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-orange-500 mt-1" />
                            <span>19 Đường Quảng Trọng Hoàng, Phường Ninh Kiều, TP. Cần Thơ</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-orange-500 mt-1" />
                            <span>0971349801</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-orange-500 mt-1" />
                            <span>KingTechSince2025@gmail.com</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 mt-16 pt-6 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} <span className="text-orange-500">KingTech</span>. All rights reserved.
            </div>
        </footer>
    );
}
