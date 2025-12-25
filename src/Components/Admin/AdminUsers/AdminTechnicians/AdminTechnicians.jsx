import React, { useState } from 'react';
import { Camera, EyeIcon, Plus } from 'lucide-react';

export default function AdminTechnicians() {
    const [query, setQuery] = useState('');

    const [technicians, setTechnicians] = useState([
        {
            id_user: 'TECH001',
            full_name: 'Nguyễn Minh Khang',
            address: 'Quận 1, TP HCM',
            phone_number: '0908123456',
            email: 'khang.tech@example.com',
            avatarBase64: 'https://i.pravatar.cc/150?img=11',
            dob: '15-04-1995',
            gender: 'Male',
            working_area: 'TP HCM',
            experience_year: 5,
            status_technician: 'ACTIVE',
            level: 'Senior',
            total_star: 45,
            technician_debt: 0,
            roleDTOS: [{ role_name: 'TECHNICIAN' }],
            nameServiceTechnician: ['Sửa điện', 'Lắp đặt máy lạnh'],
            nameSkillTechnician: ['Điện dân dụng', 'Điện lạnh'],
            locationTechnicianDTOS: [{ location_name: 'Quận 1' }, { location_name: 'Quận 3' }],
            technicianWalletDTO: {
                balance: 1200000,
                total_income: 8500000,
            },
            created_at: '01-01-2024 09:00:00',
            updated_at: '20-03-2024 14:30:00',
        },
        {
            id_user: 'TECH002',
            full_name: 'Trần Văn Hòa',
            address: 'Quận Thanh Khê, Đà Nẵng',
            phone_number: '0912348899',
            email: 'hoa.tech@example.com',
            avatarBase64: 'https://i.pravatar.cc/150?img=22',
            dob: '10-09-1992',
            gender: 'Male',
            working_area: 'Đà Nẵng',
            experience_year: 7,
            status_technician: 'ACTIVE',
            level: 'Expert',
            total_star: 60,
            technician_debt: 150000,
            roleDTOS: [{ role_name: 'TECHNICIAN' }],
            nameServiceTechnician: ['Sửa ống nước', 'Chống thấm'],
            nameSkillTechnician: ['Cấp thoát nước', 'Xây dựng cơ bản'],
            locationTechnicianDTOS: [{ location_name: 'Thanh Khê' }, { location_name: 'Hải Châu' }],
            technicianWalletDTO: {
                balance: 800000,
                total_income: 12000000,
            },
            created_at: '05-02-2024 10:20:00',
            updated_at: '18-03-2024 16:10:00',
        },
        {
            id_user: 'TECH003',
            full_name: 'Lê Thị Ngọc Anh',
            address: 'Quận Bình Thạnh, TP HCM',
            phone_number: '0934567788',
            email: 'ngocanh.tech@example.com',
            avatarBase64: 'https://i.pravatar.cc/150?img=32',
            dob: '25-12-1998',
            gender: 'Female',
            working_area: 'TP HCM',
            experience_year: 3,
            status_technician: 'INACTIVE',
            level: 'Junior',
            total_star: 25,
            technician_debt: 0,
            roleDTOS: [{ role_name: 'TECHNICIAN' }],
            nameServiceTechnician: ['Vệ sinh máy lạnh'],
            nameSkillTechnician: ['Bảo trì thiết bị'],
            locationTechnicianDTOS: [{ location_name: 'Bình Thạnh' }],
            technicianWalletDTO: {
                balance: 300000,
                total_income: 2500000,
            },
            created_at: '10-03-2024 08:45:00',
            updated_at: '15-03-2024 11:30:00',
        },
    ]);

    // filtered list
    const filtered = technicians.filter((c) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
            c.id_user.toLowerCase().includes(q) ||
            c.full_name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone_number.toLowerCase().includes(q)
        );
    });

    // pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filtered.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filtered.length / usersPerPage);

    // modal states
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [selected, setSelected] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    // form state for edit
    const [form, setForm] = useState({
        id_user: '',
        full_name: '',
        address: '',
        phone_number: '',
        email: '',
        gender: '',
        role: 'USER',
    });

    //sửa biến và các tham số trong edit modal cho phù hợp
    function openEdit(t) {
        setSelected(t);
        setForm({
            id_user: t.id_user,
            full_name: t.full_name,
            address: t.address,
            phone_number: t.phone_number,
            email: t.email,
            avatarBase64: t.avatarBase64,

            dob: t.dob,
            gender: t.gender,
            working_area: t.working_area,
            experience_year: t.experience_year,
            status_technician: t.status_technician,
            level: t.level,

            role: t.roleDTOS?.[0]?.role_name || 'TECHNICIAN',

            nameServiceTechnician: t.nameServiceTechnician || [],
            nameSkillTechnician: t.nameSkillTechnician || [],
        });

        setShowEdit(true);
    }

    function saveEdit() {
        setTechnicians((prev) =>
            prev.map((p) =>
                p.id_user === selected.id_user ? { ...p, ...form, roleDTOS: [{ role_name: form.role }] } : p,
            ),
        );
        setShowEdit(false);
        setSelected(null);
    }

    function openDelete(c) {
        setSelected(c);
        setShowDelete(true);
    }

    function confirmDelete() {
        setTechnicians((prev) => prev.filter((p) => p.id_user !== selected.id_user));
        setShowDelete(false);
        setSelected(null);
    }

    function openDetail(c) {
        setSelected(c);
        setShowDetail(true);
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold text-gray-700 mb-4">Technician Management</h1>

            {/* Search + Add (Add is static placeholder) */}
            <div className="flex items-center justify-between mb-4 gap-4">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    type="text"
                    placeholder="Search by id, name, email or phone..."
                    className="px-4 py-2 border rounded-lg w-80 focus:outline-none focus:ring focus:ring-orange-300"
                />
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            const newCus = {
                                id_user: `CUS${String(technicians.length + 1).padStart(3, '0')}`,
                                full_name: 'New Customer',
                                address: 'Unknown',
                                phone_number: '',
                                email: '',
                                avatarBase64: 'https://i.pravatar.cc/100?img=12',
                                dob: '01-01-1990',
                                gender: 'Male',
                                roleDTOS: [{ role_name: 'USER' }],
                                created_at: new Date().toLocaleString(),
                                updated_at: new Date().toLocaleString(),
                            };
                            setTechnicians((s) => [newCus, ...s]);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-orange-500 text-white border border-orange-500 hover:bg-white hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                    >
                        <Plus size={18} />
                        Add Technician
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-lg border">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                        <tr>
                            <th className="p-3 text-left">Avatar</th>
                            <th className="p-3 text-left">ID</th>
                            <th className="p-3 text-left">Full Name</th>
                            <th className="p-3 text-left">Email</th>
                            <th className="p-3 text-left">Phone</th>
                            <th className="p-3 text-left">Gender</th>
                            <th className="p-3 text-left">Role</th>
                            <th className="p-3 text-left">Created At</th>
                            <th className="p-3 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentUsers.map((c) => (
                            <tr key={c.id_user} className="border-t hover:bg-gray-50 transition hover:scale-100">
                                <td className="p-3">
                                    <img
                                        src={c.avatarBase64}
                                        className="w-12 h-12 rounded-full object-cover"
                                        alt="avatar"
                                    />
                                </td>
                                <td className="p-3">{c.id_user}</td>
                                <td className="p-3">{c.full_name}</td>
                                <td className="p-3">{c.email}</td>
                                <td className="p-3">{c.phone_number}</td>
                                <td className="p-3">{c.gender}</td>
                                <td className="p-3">{c.roleDTOS.map((r) => r.role_name).join(', ')}</td>
                                <td className="p-3">{c.created_at}</td>
                                <td className="p-3 flex gap-2">
                                    <button
                                        onClick={() => openDetail(c)}
                                        className="flex items-center gap-2 px-3 py-1 rounded-md bg-orange-500/15 text-orange-600 font-semibold hover:bg-orange-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-300 transition-all duration-200"
                                    >
                                        <EyeIcon size={16} />
                                        View
                                    </button>

                                    {/* <button
                                        onClick={() => openEdit(c)}
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => openDelete(c)}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                    >
                                        Delete
                                    </button> */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center items-center gap-2 py-4 mt-4">
                    {/* Prev */}
                    <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="
            px-3 py-1 rounded-md border
            bg-white text-gray-600
            hover:bg-orange-100 hover:text-orange-600
            disabled:opacity-40 disabled:cursor-not-allowed
            transition
        "
                    >
                        Prev
                    </button>

                    {/* Pages */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`
                min-w-[36px] h-9
                rounded-md border
                font-semibold
                transition
                ${
                    currentPage === page
                        ? 'bg-orange-500 text-white border-orange-500 shadow'
                        : 'bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                }
            `}
                        >
                            {page}
                        </button>
                    ))}

                    {/* Next */}
                    <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="
            px-3 py-1 rounded-md border
            bg-white text-gray-600
            hover:bg-orange-100 hover:text-orange-600
            disabled:opacity-40 disabled:cursor-not-allowed
            transition
        "
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Edit Technician Modal */}
            {showEdit && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg overflow-y-auto max-h-[90vh]">
                        <h2 className="text-lg font-semibold mb-4">Edit Technician</h2>

                        <div className="space-y-4">
                            {/* Avatar */}
                            <div className="flex justify-center">
                                <div className="relative w-24 h-24">
                                    <img
                                        src={form.avatarBase64 || 'https://i.pravatar.cc/150?img=12'}
                                        alt="Avatar"
                                        className="w-24 h-24 rounded-full object-cover border transition hover:scale-105"
                                    />

                                    <input
                                        type="file"
                                        accept="image/*"
                                        id="avatar-upload"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = () =>
                                                    setForm((s) => ({ ...s, avatarBase64: reader.result }));
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />

                                    <label
                                        htmlFor="avatar-upload"
                                        className="
                                absolute bottom-1 right-1
                                w-8 h-8 flex items-center justify-center
                                rounded-full bg-black/50 text-white
                                cursor-pointer
                                hover:bg-orange-500 hover:ring-2 hover:ring-orange-300
                                transition-all
                            "
                                    >
                                        <Camera size={16} />
                                    </label>
                                </div>
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm text-gray-600">Full Name</label>
                                <input
                                    value={form.full_name}
                                    onChange={(e) => setForm((s) => ({ ...s, full_name: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm text-gray-600">Email</label>
                                <input
                                    value={form.email}
                                    onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm text-gray-600">Phone</label>
                                <input
                                    value={form.phone_number}
                                    onChange={(e) => setForm((s) => ({ ...s, phone_number: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-sm text-gray-600">Address</label>
                                <input
                                    value={form.address}
                                    onChange={(e) => setForm((s) => ({ ...s, address: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>

                            {/* Working Area */}
                            <div>
                                <label className="block text-sm text-gray-600">Working Area</label>
                                <input
                                    value={form.working_area}
                                    onChange={(e) => setForm((s) => ({ ...s, working_area: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>

                            {/* Experience + Level */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600">Experience (years)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.experience_year}
                                        onChange={(e) =>
                                            setForm((s) => ({ ...s, experience_year: Number(e.target.value) }))
                                        }
                                        className="w-full px-3 py-2 border rounded"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600">Level</label>
                                    <select
                                        value={form.level}
                                        onChange={(e) => setForm((s) => ({ ...s, level: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded"
                                    >
                                        <option value="Junior">Junior</option>
                                        <option value="Senior">Senior</option>
                                        <option value="Expert">Expert</option>
                                    </select>
                                </div>
                            </div>

                            {/* Gender + Status */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm text-gray-600">Gender</label>
                                    <select
                                        value={form.gender}
                                        onChange={(e) => setForm((s) => ({ ...s, gender: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600">Status</label>
                                    <select
                                        value={form.status_technician}
                                        onChange={(e) => setForm((s) => ({ ...s, status_technician: e.target.value }))}
                                        className="w-full px-3 py-2 border rounded"
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="INACTIVE">INACTIVE</option>
                                    </select>
                                </div>
                            </div>

                            {/* Date of Birth */}
                            <div>
                                <label className="block text-sm text-gray-600">Date of Birth</label>
                                <input
                                    type="date"
                                    value={form.dob}
                                    onChange={(e) => setForm((s) => ({ ...s, dob: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowEdit(false);
                                    setSelected(null);
                                }}
                                className="px-4 py-2 border rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={saveEdit}
                                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {showDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-sm p-6 shadow-lg">
                        <h3 className="text-lg font-semibold">Delete Customer?</h3>
                        <p className="mt-2 text-sm text-gray-600">
                            Are you sure you want to delete <strong>{selected?.full_name}</strong> ({selected?.id_user}
                            )?
                        </p>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowDelete(false);
                                    setSelected(null);
                                }}
                                className="px-3 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button onClick={confirmDelete} className="px-3 py-2 bg-red-600 text-white rounded">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetail && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6 shadow-lg overflow-y-auto max-h-[90vh]">
                        <h3 className="text-xl font-semibold mb-4">Technician Details</h3>

                        <div className="space-y-3 text-sm">
                            <div className="flex flex-col items-center gap-2">
                                <div>
                                    <strong>ID: </strong>
                                    {selected.id_user}
                                </div>
                                <img src={selected.avatarBase64} className="w-24 h-24 rounded-full object-cover" />
                            </div>
                            <div></div>
                            <div>
                                <strong>Full Name:</strong> {selected.full_name}
                            </div>
                            <div>
                                <strong>Email:</strong> {selected.email}
                            </div>
                            <div>
                                <strong>Phone:</strong> {selected.phone_number}
                            </div>
                            <div>
                                <strong>Gender:</strong> {selected.gender}
                            </div>
                            <div>
                                <strong>Address:</strong> {selected.address}
                            </div>
                            <div>
                                <strong>Date of Birth:</strong> {selected.dob}
                            </div>
                            <div>
                                <strong>Role:</strong> {selected.roleDTOS?.map((r) => r.role_name).join(', ')}
                            </div>
                            <div>
                                <strong>Created At:</strong> {selected.created_at}
                            </div>
                            <div>
                                <strong>Updated At:</strong> {selected.updated_at}
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="mt-5 flex justify-between items-center">
                            {/* Close */}
                            <button
                                onClick={() => {
                                    setShowDetail(false);
                                    setSelected(null);
                                }}
                                className="px-4 py-2 border rounded"
                            >
                                Close
                            </button>

                            <div className="flex gap-2">
                                {/* Edit */}
                                <button
                                    onClick={() => {
                                        openEdit(selected);
                                        setShowDetail(false);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Edit
                                </button>

                                {/* Delete */}
                                <button
                                    onClick={() => {
                                        openDelete(selected);
                                        setShowDetail(false);
                                    }}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
