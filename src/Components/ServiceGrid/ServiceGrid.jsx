import ServiceCard from '../ServiceCard/ServiceCard'
import { Wrench, Fan, Zap, Shield } from 'lucide-react';

export default function ServiceGrid() {
    const list = [
        {
            icon: <Wrench />,
            name: 'Sửa điện tại nhà',
            desc: 'Khắc phục nhanh các sự cố chập điện, mất điện, công tắc, ổ cắm...',
            price: 'Từ 80.000đ',
        },
        {
            icon: <Fan />,
            name: 'Sửa máy lạnh',
            desc: 'Bảo trì, nạp gas, sửa block, vệ sinh tận nơi trong 30 phút.',
            price: 'Từ 150.000đ',
        },
        {
            icon: <Zap />,
            name: 'Sửa nước',
            desc: 'Thay vòi nước, sửa bồn cầu, rò rỉ nước, lắp đặt máy lọc.',
            price: 'Từ 90.000đ',
        },
        {
            icon: <Shield />,
            name: 'Sửa camera',
            desc: 'Lắp đặt, sửa chữa camera giám sát chuyên nghiệp.',
            price: 'Từ 200.000đ',
        },
    ];

    return (
        <div className="max-w-6xl mx-auto px-6 mt-10 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">
                {list.map((item, i) => (
                    <ServiceCard key={i} {...item} />
                ))}
            </div>
        </div>
    );
}
