export default function ProfileMobileHeader() {
    return (
        <div className="md:hidden flex items-center gap-3 p-4 bg-white shadow rounded-xl mb-3">
            <img src="https://i.pravatar.cc/150?img=68" className="w-14 h-14 rounded-full border-2 border-orange-500" />
            <div>
                <h3 className="font-semibold text-base">Nguyễn Văn A</h3>
                <p className="text-sm text-gray-500">nguyenvana@example.com</p>
            </div>
        </div>
    );
}
