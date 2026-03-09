import logo from '../../../assets/logo.png'
export default function Header() {
    return (
        <div className="sticky top-0 z-40 flex items-center justify-between bg-white p-4 shadow-sm border-b">
            <h2 className="text-xl font-semibold">KingTech Admin</h2>

            <div>
          <img src={logo} className="w-10 h-10 rounded-full border" />
            </div>
        </div>
    );
}
