export default function Header() {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-sm border-b">
      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div>
        <img
          src="https://i.pravatar.cc/300"
          className="w-10 h-10 rounded-full border"
        />
      </div>
    </div>
  );
}
