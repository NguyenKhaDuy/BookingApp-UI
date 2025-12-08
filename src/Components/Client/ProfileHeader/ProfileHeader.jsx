export default function ProfileHeader() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col items-center text-center">
            <img
                src="https://i.pravatar.cc/150"
                className="w-28 h-28 rounded-full shadow-lg border-4 border-orange-500"
            />

            <h2 className="text-2xl font-bold mt-4">Nguyễn Văn A</h2>
            <p className="text-gray-500">nguyenvana@example.com</p>
        </div>
    );
}
