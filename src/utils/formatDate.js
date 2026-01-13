const formatDate = (date) => {

    // Trường hợp backend trả yyyyMMdd (vd: 20251118)
    if (typeof date === 'string' && /^\d{8}$/.test(date)) {
        const y = date.slice(0, 4);
        const m = date.slice(4, 6);
        const d = date.slice(6, 8);
        return `${d}/${m}/${y}`;
    }

    // Trường hợp ISO hoặc dạng Date hợp lệ
    const parsed = new Date(date);

    return parsed.toLocaleDateString('vi-VN');
};

export default formatDate;
