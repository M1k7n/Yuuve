"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      router.push(`/?search=${search}`);
    }
  };

  return (
    <div className="relative z-50 bg-white/10 backdrop-blur-lg border-y border-white/20 shadow-lg p-6 text-white flex items-center justify-between">
      {/* LEFT */}
      <div className="flex items-center">
        <Link href="/">
          <p className="text-white text-3xl font-black tracking-tight flex items-center">
            Movie
            <span className="bg-orange-400 text-black text-[15px] font-bold px-1 py-0.5 rounded ml-1">
              Hub
            </span>
          </p>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 ml-6">
          <Link href="/movies">
            <p className="text-white/60 px-4 py-1.5 rounded-full hover:text-white transition">
              All Movies
            </p>
          </Link>
          <p className="text-white/60 px-4 py-1.5 rounded-full hover:text-white transition">
            TV Channel's
          </p>
        </nav>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        {/* Desktop Search */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="bg-white/10 border border-white/20 text-white placeholder:text-white/30 rounded-lg px-4 py-1.5 w-48 focus:w-64 focus:outline-none focus:border-white/50 transition-all duration-300"
          />
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white/70 hover:text-white transition p-2"
        >
          ☰
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-purple-500 to-pink-200 flex items-center justify-center cursor-pointer">
          <span className="text-white font-bold">U</span>
        </div>
      </div>

      {/* 🔽 MOBILE DROPDOWN */}
      <div
        className={` absolute top-full left-0 w-full transition-all duration-300 z-99999 ${
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="m-4 p-4 rounded-xl bg-black/70 backdrop-blur-xl border border-white/20 shadow-lg">
          {/* Search inside dropdown */}
          <input
            type="text"
            placeholder="Search movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            className="bg-white/10 border border-white/20 text-white placeholder:text-white/30 rounded-lg px-4 py-1.5 w-48 focus:w-64 focus:outline-none focus:border-white/50 transition-all duration-300"
          />

          {/* Nav links */}
          <Link href="/movies">
            <p className="py-2 text-white/70 hover:text-white transition">
              All Movies
            </p>
          </Link>
          <p className="py-2 text-white/70 hover:text-white transition">
            TV Channel's
          </p>
        </div>
      </div>
    </div>
  );
}
