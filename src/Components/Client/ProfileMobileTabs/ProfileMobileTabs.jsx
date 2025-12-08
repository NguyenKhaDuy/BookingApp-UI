export function ProfileMobileTabs({ active, setActive }) {
    return (
        <div className="md:hidden flex gap-2 sticky top-16 bg-white p-3 shadow z-10">
            <button
                onClick={() => setActive('profile')}
                className={`flex-1 py-2 rounded-lg font-semibold 
                ${active === 'profile' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
            >
                Thông tin
            </button>

            <button
                onClick={() => setActive('password')}
                className={`flex-1 py-2 rounded-lg font-semibold 
                ${active === 'password' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
            >
                Mật khẩu
            </button>

            <button
                onClick={() => setActive('settings')}
                className={`flex-1 py-2 rounded-lg font-semibold 
                ${active === 'settings' ? 'bg-orange-500 text-white' : 'bg-gray-100'}`}
            >
                Cài đặt
            </button>
        </div>
    );
}
