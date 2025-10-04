"use client";

import Link from "next/link";
import { useState } from "react";
import { FiHome, FiBarChart2, FiSettings, FiMenu } from "react-icons/fi";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`${
        open ? "w-64" : "w-20"
      } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className={`${open ? "text-lg" : "hidden"} font-bold`}>CryptoDash</h1>
        <FiMenu className="cursor-pointer" onClick={() => setOpen(!open)} />
      </div>

      {/* Links */}
      <nav className="flex flex-col gap-2 mt-6">
        <Link href="/" className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded">
          <FiHome /> {open && "Dashboard"}
        </Link>
        <a href="/analytics" className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded">
          <FiBarChart2 /> {open && "Analytics"}
        </a>
        <a href="/settings" className="flex items-center gap-3 p-3 hover:bg-gray-700 rounded">
          <FiSettings /> {open && "Settings"}
        </a>
      </nav>
    </aside>
  );
}
