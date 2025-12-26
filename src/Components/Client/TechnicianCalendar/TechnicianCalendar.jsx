import { useState } from 'react';

/* ===== HELPER FUNCTIONS ===== */
const formatTime = ([h, m]) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

const formatDate = ([y, m, d]) => `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
export default function TechnicianCalendar({ schedules }) {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-6">Lịch làm việc</h2>

            <div className="space-y-4">
                {schedules.map((s) => {
                    const date = formatDate(s.date);
                    const start = formatTime(s.time_start);
                    const end = formatTime(s.time_end);

                    const isOvernight =
                        s.time_start[0] > s.time_end[0] ||
                        (s.time_start[0] === s.time_end[0] && s.time_start[1] > s.time_end[1]);

                    return (
                        <div
                            key={s.idSchedule}
                            className="flex items-center justify-between p-4 rounded-2xl border shadow-sm"
                        >
                            {/* Date */}
                            <div>
                                <p className="text-sm text-gray-500">Ngày</p>
                                <p className="font-semibold">{date}</p>
                            </div>

                            {/* Time */}
                            <div>
                                <p className="text-sm text-gray-500">Thời gian</p>
                                <p className="font-semibold">
                                    {start} – {end}
                                    {isOvernight && <span className="ml-2 text-xs text-orange-500">(qua đêm)</span>}
                                </p>
                            </div>

                            {/* Status */}
                            <div
                                className={`px-4 py-1 rounded-full text-sm font-semibold
                  ${s.status_code === 'OFFLINE' ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}
                `}
                            >
                                {s.status_code}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
