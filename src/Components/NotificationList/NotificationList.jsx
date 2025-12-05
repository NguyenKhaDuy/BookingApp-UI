import NotificationItem from '../NotificationItem/NotificationItem';
import { Bell, Gift, Info } from 'lucide-react';

export default function NotificationList() {
    const data = [
        {
            icon: <Bell />,
            title: 'Lịch học mới được cập nhật',
            content: 'Bạn có một thay đổi trong thời khóa biểu ngày mai.',
            time: '2 giờ trước',
        },
        {
            icon: <Gift />,
            title: 'Ưu đãi đặc biệt',
            content: 'Nhận mã giảm giá 20% cho dịch vụ tiếp theo của bạn.',
            time: 'Hôm qua',
        },
        {
            icon: <Info />,
            title: 'Thông báo hệ thống',
            content: 'Hệ thống sẽ bảo trì vào lúc 23:00 tối nay.',
            time: '3 ngày trước',
        },
    ];

    return (
        <div className="px-6 mt-6 flex flex-col gap-5 pb-20">
            {data.map((item, i) => (
                <NotificationItem key={i} {...item} />
            ))}
        </div>
    );
}
