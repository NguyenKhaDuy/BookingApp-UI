import React from 'react';

export default function LoadingOverlay({ show }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] !mt-0 !mb-0">
            <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
