export const formatDateString = (date) => {
    if (!date) return '';

    // Backend: [yyyy, MM, dd]
    if (Array.isArray(date) && date.length >= 3) {
        const [year, month, day] = date;

        return `${String(day).padStart(2, '0')}/` + `${String(month).padStart(2, '0')}/` + `${year}`;
    }

    // yyyyMMdd
    if (typeof date === 'string' && /^\d{8}$/.test(date)) {
        const year = date.substring(0, 4);
        const month = date.substring(4, 6);
        const day = date.substring(6, 8);

        return `${day}/${month}/${year}`;
    }

    // yyyy-MM-dd
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [year, month, day] = date.split('-');

        return `${day}/${month}/${year}`;
    }

    // ISO: 2003-12-07T00:00:00...
    // KHÔNG dùng new Date() để tránh lệch ngày
    if (typeof date === 'string') {
        const match = date.match(/^(\d{4})-(\d{2})-(\d{2})/);

        if (match) {
            const [, year, month, day] = match;

            return `${day}/${month}/${year}`;
        }
    }

    // Date object
    if (date instanceof Date && !isNaN(date.getTime())) {
        return (
            `${String(date.getDate()).padStart(2, '0')}/` +
            `${String(date.getMonth() + 1).padStart(2, '0')}/` +
            `${date.getFullYear()}`
        );
    }

    return '';
};

export const formatDateArray = (arr) => {
    return formatDateString(arr);
};

export const formatDateTimeArray = (value) => {
    if (!value) return '';

    // Array
    if (Array.isArray(value) && value.length >= 6) {
        const [year, month, day, hour, minute, second] = value;

        return (
            `${String(day).padStart(2, '0')}/` +
            `${String(month).padStart(2, '0')}/` +
            `${year} ` +
            `${String(hour).padStart(2, '0')}:` +
            `${String(minute).padStart(2, '0')}:` +
            `${String(second).padStart(2, '0')}`
        );
    }

    // ISO String
    const date = new Date(value);

    if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
    }

    return '';
};

export const formatTime = (time) => {
    if (!time) return 'N/A';

    // Array
    if (Array.isArray(time)) {
        const [hour, minute] = time;

        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }

    // String
    if (typeof time === 'string') {
        const [hour, minute] = time.split(':');

        return `${hour}:${minute}`;
    }

    return 'N/A';
};

export const formatScheduleDateTime = (date, time) => {
    if (!date || !time) return '';

    return `${formatDateString(date)} ${formatTime(time)}`;
};

export const formatDateForInput = (date) => {
    if (!date) return '';

    // Backend: dd-MM-yyyy
    if (typeof date === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(date)) {
        const [day, month, year] = date.split('-');

        return `${year}-${month}-${day}`;
    }

    // Backend: yyyy-MM-dd
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
    }

    // Backend: [yyyy, MM, dd]
    if (Array.isArray(date) && date.length >= 3) {
        const [year, month, day] = date;

        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    return '';
};

export default {
    formatDateString,
    formatDateArray,
    formatDateTimeArray,
    formatTime,
    formatScheduleDateTime,
    formatDateForInput,
};
