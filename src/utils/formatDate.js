// =========================
// Format Date từ chuỗi yyyyMMdd → dd/MM/yyyy
// hoặc từ ISO string
// =========================
export const formatDateString = (date) => {
    if (!date) return '';

    // Nếu backend trả yyyyMMdd (ví dụ: "20251118")
    if (typeof date === 'string' && /^\d{8}$/.test(date)) {
        const y = date.slice(0, 4);
        const m = date.slice(4, 6);
        const d = date.slice(6, 8);
        return `${d}/${m}/${y}`;
    }

    // Nếu là ISO date hoặc Format mà new Date() parse được
    const parsed = new Date(date);
    if (!isNaN(parsed)) {
        return parsed.toLocaleDateString('vi-VN');
    }

    return '';
};

// =========================
// Format DateTime từ mảng [yyyy, MM, dd, HH, mm, ss]
// =========================
export const formatDateTimeArray = (arr) => {
    if (!arr || arr.length < 6) return '';
    const [year, month, day, hour, minute, second] = arr;

    return (
        `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year} ` +
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second
            .toString()
            .padStart(2, '0')}`
    );
};

// =========================
// Format Date từ mảng [yyyy, MM, dd]
// =========================
export const formatDateArray = (arr) => {
    if (!arr || arr.length < 3) return '';
    const [year, month, day] = arr;

    return `${day.toString().padStart(2, '0')}/${month.toString().padStart(2, '0')}/${year}`;
};

// =========================
// DEFAULT EXPORT (để tiện import)
// =========================
export default {
    formatDateString,
    formatDateArray,
    formatDateTimeArray,
};
