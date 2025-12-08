import { useState } from 'react';

export default function TechnicianCalendar() {
    const [selected, setSelected] = useState(null);

    const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

    return (
        <div className="bg-white rounded-3xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Lịch làm việc</h2>

            <div className="grid grid-cols-7 gap-2 text-center">
                {days.map((d, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className={`
              py-3 rounded-xl border text-sm font-medium 
              transition shadow-sm
              ${
                  selected === i
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-gray-50 text-gray-600 border-gray-300 hover:border-indigo-400'
              }
            `}
                    >
                        {d}
                    </button>
                ))}
            </div>

            {/* Time slots */}
            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-3">Khung giờ trống</h3>
                <div className="flex flex-wrap gap-3">
                    {['08:00', '09:30', '11:00', '13:30', '15:00', '17:00'].map((t) => (
                        <button
                            key={t}
                            className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200 shadow-sm hover:bg-indigo-100"
                        >
                            {t}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
