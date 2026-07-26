import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-black border-r-2 border-[#00FF85] text-white min-h-screen shadow-2xl">

      {/* Logo */}
      <div className="flex items-center justify-center border-b border-[#00FF85]/20 py-8">
        <h1 className="text-5xl font-black tracking-[0.35em] text-[#00FF85] drop-shadow-[0_0_12px_#00FF85]">
          BCS
        </h1>
      </div>

      {/* Menu */}
      <nav className="p-5 space-y-2">

        <Link
          href="/"
          className="flex items-center rounded-xl px-4 py-3 transition-all duration-200 hover:bg-[#00FF85] hover:text-black"
        >
          🏠 <span className="ml-3 font-medium">หน้าหลัก</span>
        </Link>

        <Link
          href="/equipment"
          className="flex items-center rounded-xl px-4 py-3 transition-all duration-200 hover:bg-[#00FF85] hover:text-black"
        >
          📦 <span className="ml-3 font-medium">อุปกรณ์</span>
        </Link>

        <Link
          href="/add-equipment"
          className="flex items-center rounded-xl px-4 py-3 transition-all duration-200 hover:bg-[#00FF85] hover:text-black"
        >
          ➕ <span className="ml-3 font-medium">เพิ่มอุปกรณ์</span>
        </Link>

        <Link
          href="/current-rentals"
          className="flex items-center rounded-xl px-4 py-3 transition-all duration-200 hover:bg-[#00FF85] hover:text-black"
        >
          📝 <span className="ml-3 font-medium">กำลังเช่า</span>
        </Link>

        <Link
          href="/customers"
          className="flex items-center rounded-xl px-4 py-3 transition-all duration-200 hover:bg-[#00FF85] hover:text-black"
        >
          👥 <span className="ml-3 font-medium">ลูกค้า</span>
        </Link>

        <Link
          href="/reports"
          className="flex items-center rounded-xl px-4 py-3 transition-all duration-200 hover:bg-[#00FF85] hover:text-black"
        >
          📊 <span className="ml-3 font-medium">รายงาน</span>
        </Link>

        <Link
          href="/history"
          className="flex items-center rounded-xl px-4 py-3 transition-all duration-200 hover:bg-[#00FF85] hover:text-black"
        >
          📜 <span className="ml-3 font-medium">ประวัติการเช่า</span>
        </Link>

      </nav>

    </aside>
  );
}