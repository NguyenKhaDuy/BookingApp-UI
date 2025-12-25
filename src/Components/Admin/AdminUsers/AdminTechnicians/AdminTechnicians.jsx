import React, { useState } from 'react';
import { EyeIcon, Plus } from 'lucide-react';

export default function AdminCustomer() {
    const [query, setQuery] = useState('');

    const [customers, setCustomers] = useState([
        {
            id_user: 'CUS001',
            full_name: 'Nguyễn Văn A',
            address: 'Hà Nội',
            phone_number: '0901234567',
            email: 'vana@example.com',
            avatarBase64: 'https://i.pravatar.cc/100?img=1',
            dob: '10-05-2001',
            gender: 'Male',
            roleDTOS: [{ role_name: 'USER' }],
            created_at: '01-01-2024 08:30:00',
            updated_at: '10-02-2024 12:10:00',
        },
        {
            id_user: 'CUS002',
            full_name: 'Trần Thị B',
            address: 'TP HCM',
            phone_number: '0939876543',
            email: 'thib@example.com',
            avatarBase64: 'https://i.pravatar.cc/100?img=5',
            dob: '22-08-1999',
            gender: 'Female',
            roleDTOS: [{ role_name: 'ADMIN' }],
            created_at: '15-02-2024 10:00:00',
            updated_at: '15-03-2024 15:10:00',
        },
        {
            id_user: 'CUS003',
            full_name: 'Phạm Quốc C',
            address: 'Đà Nẵng',
            phone_number: '0912345678',
            email: 'quocc@example.com',
            avatarBase64: 'https://i.pravatar.cc/100?img=8',
            dob: '12-02-2000',
            gender: 'Male',
            roleDTOS: [{ role_name: 'USER' }],
            created_at: '20-03-2024 11:15:00',
            updated_at: '21-03-2024 16:40:00',
        },
    ]);
    // filtered list
    const filtered = customers.filter((c) => {
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

    function openEdit(c) {
        setSelected(c);
        setForm({
            id_user: c.id_user,
            full_name: c.full_name,
            address: c.address,
            phone_number: c.phone_number,
            email: c.email,
            gender: c.gender,
            dob: c.dob,
            avatarBase64: c.avatarBase64,
            role: c.roleDTOS?.[0]?.role_name || 'USER',
        });
        setShowEdit(true);
    }

    function saveEdit() {
        setCustomers((prev) =>
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
        setCustomers((prev) => prev.filter((p) => p.id_user !== selected.id_user));
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
                                id_user: `CUS${String(customers.length + 1).padStart(3, '0')}`,
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
                            setCustomers((s) => [newCus, ...s]);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-orange-500 text-white border border-orange-500 hover:bg-white hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300 transition"
                    >
                        <Plus size={18} />
                        Add Customer
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
                                    <img src={c.avatarBase64} className="w-12 h-12 rounded-full object-cover" alt="avatar" />
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
                ${currentPage === page
                                    ? 'bg-orange-500 text-white border-orange-500 shadow'
                                    : 'bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600'}
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

            {/* Edit Modal */}
            {showEdit && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 shadow-lg overflow-y-auto max-h-[90vh]">
                        <h2 className="text-lg font-semibold mb-4">Edit Customer</h2>

                        <div className="space-y-3">
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

                            {/* Gender */}
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

                            {/* Role */}
                            <div>
                                <label className="block text-sm text-gray-600">Role</label>
                                <select
                                    value={form.role}
                                    onChange={(e) => setForm((s) => ({ ...s, role: e.target.value }))}
                                    className="w-full px-3 py-2 border rounded"
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
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

                            {/* Upload Avatar */}
                            <div>
                                <label className="block text-sm text-gray-600">Avatar</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = () =>
                                                setForm((s) => ({ ...s, avatarBase64: reader.result }));
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                    className="w-full"
                                />
                                {form.avatarBase64 && (
                                    <img
                                        src={form.avatarBase64}
                                        alt="Avatar Preview"
                                        className="w-20 h-20 rounded-full mt-2"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => {
                                    setShowEdit(false);
                                    setSelected(null);
                                }}
                                className="px-4 py-2 border rounded"
                            >
                                Cancel
                            </button>
                            <button onClick={saveEdit} className="px-4 py-2 bg-indigo-600 text-white rounded">
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
                        <h3 className="text-xl font-semibold mb-4">Customer Details</h3>

                        <div className="space-y-3 text-sm">
                            <div>
                                <strong>ID:</strong> {selected.id_user}
                            </div>
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
                                <strong>Avatar:</strong>
                            </div>
                            <img src={selected.avatarBase64} className="w-20 h-20 rounded-full" />

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
