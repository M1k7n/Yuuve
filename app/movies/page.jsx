"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const API_KEY = "8476a7ab80ad76f0936744df0430e67c";

const genresMap = {
  28: "Action",
  12: "Adventure",
  16: "Anime",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  14: "Fantasy",
  27: "Horror",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10751: "Family",
  99: "Documentary",
  36: "History",
  10402: "Music",
  37: "Western",
};

const genreColors = {
  28: "#ff4d6d",
  12: "#f4a261",
  16: "#2ec4b6",
  35: "#ffd166",
  80: "#9b72cf",
  18: "#74b3ce",
  14: "#b388ff",
  27: "#ff6b6b",
  9648: "#7b2d8b",
  10749: "#f9a8d4",
  878: "#38bdf8",
  53: "#ef4444",
  10751: "#86efac",
  99: "#64748b",
  36: "#a16207",
  10402: "#fb923c",
  37: "#d97706",
};

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Most Popular" },
  { value: "vote_average.desc", label: "Top Rated" },
  { value: "release_date.desc", label: "Newest" },
  { value: "release_date.asc", label: "Oldest" },
  { value: "title.asc", label: "A → Z" },
];

function GenrePill({ id, active, onClick }) {
  const color = genreColors[id] || "#888";
  return (
    <button
      onClick={() => onClick(id)}
      style={{
        background: active ? color : "transparent",
        color: active ? "#000" : color,
        border: `1px solid ${color}`,
        fontFamily: "'DM Mono', monospace",
      }}
      className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 hover:opacity-80 whitespace-nowrap"
    >
      {genresMap[id]}
    </button>
  );
}

function MovieCard({ movie, index }) {
  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null;
  const year = movie.release_date?.slice(0, 4);
  const genres = (movie.genre_ids || [])
    .filter((id) => genresMap[id])
    .slice(0, 2);

  return (
    <Link href={`/movie/${movie.id}`}>
      <div
        className="group relative bg-[#0f0f1a] rounded-lg overflow-hidden hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        style={{ border: "1px solid #1e1e35" }}
      >
        <div className="aspect-2/3 overflow-hidden relative">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1a1a2e] text-4xl">
              🎬
            </div>
          )}

          {rating && (
            <div
              className="absolute top-2 right-2 text-xs font-black px-2 py-0.5 rounded"
              style={{
                background:
                  parseFloat(rating) >= 7
                    ? "#22c55e"
                    : parseFloat(rating) >= 5
                      ? "#f59e0b"
                      : "#ef4444",
                color: "#000",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              ★ {rating}
            </div>
          )}

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
            <p className="text-white/80 text-[10px] leading-relaxed line-clamp-4">
              {movie.overview}
            </p>
          </div>
        </div>

        <div className="p-2.5 flex flex-col gap-1.5">
          <p
            className="text-white text-xs font-semibold truncate leading-snug"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            {movie.title}
          </p>
          {year && (
            <span
              className="text-[10px] text-white/40"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {year}
            </span>
          )}
          <div className="flex flex-wrap gap-1">
            {genres.map((id) => {
              const color = genreColors[id] || "#888";
              return (
                <span
                  key={id}
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide"
                  style={{
                    background: color + "25",
                    color,
                    border: `1px solid ${color}55`,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {genresMap[id]}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}

function Pagination({ page, totalPages, onPage }) {
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  const btn =
    "w-9 h-9 rounded flex items-center justify-center text-sm font-bold transition-all duration-150";

  return (
    <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
      <button
        onClick={() => onPage(1)}
        disabled={page === 1}
        className={`${btn} border border-white/10 text-white/40 hover:border-white/30 hover:text-white disabled:opacity-20`}
      >
        «
      </button>
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className={`${btn} border border-white/10 text-white/40 hover:border-white/30 hover:text-white disabled:opacity-20`}
      >
        ‹
      </button>
      {start > 1 && <span className="text-white/20 text-sm">…</span>}
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          className={`${btn} ${p === page ? "bg-red-500 text-white border-red-500" : "border border-white/10 text-white/50 hover:border-white/30 hover:text-white"}`}
          style={{ fontFamily: "'DM Mono', monospace" }}
        >
          {p}
        </button>
      ))}
      {end < totalPages && <span className="text-white/20 text-sm">…</span>}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className={`${btn} border border-white/10 text-white/40 hover:border-white/30 hover:text-white disabled:opacity-20`}
      >
        ›
      </button>
      <button
        onClick={() => onPage(totalPages)}
        disabled={page === totalPages}
        className={`${btn} border border-white/10 text-white/40 hover:border-white/30 hover:text-white disabled:opacity-20`}
      >
        »
      </button>
    </div>
  );
}

export default function MoviesPage() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState(null);
  const [sortBy, setSortBy] = useState("popularity.desc");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      let url;
      if (search) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(search)}&page=${page}`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=${sortBy}&page=${page}${activeGenre ? `&with_genres=${activeGenre}` : ""}&vote_count.gte=50`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setMovies(data.results || []);
      setTotalPages(Math.min(data.total_pages || 1, 500));
      setTotalResults(data.total_results || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, activeGenre, sortBy, search]);

  useEffect(() => {
    fetchMovies();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchMovies]);

  const handleGenre = (id) => {
    setActiveGenre((prev) => (prev === id ? null : id));
    setPage(1);
    setSearch("");
    setSearchInput("");
  };

  const handleSort = (val) => {
    setSortBy(val);
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
    setActiveGenre(null);
  };

  return (
    <main
      className="min-h-screen bg-[#080810] text-white"
      style={{ fontFamily: "'Georgia', serif" }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');`}</style>

      {/* Sticky header */}
      <div
        className="sticky top-0 z-50 backdrop-blur-md border-b px-6 py-4"
        style={{ background: "rgba(8,8,16,0.92)", borderColor: "#1e1e35" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col gap-4">
          {/* Top row */}

          {/* Genre pills */}
          {!search && (
            <div
              className="flex gap-2 overflow-x-auto pb-1"
              style={{ scrollbarWidth: "none" }}
            >
              {Object.keys(genresMap).map((id) => (
                <GenrePill
                  key={id}
                  id={Number(id)}
                  active={activeGenre === Number(id)}
                  onClick={handleGenre}
                />
              ))}
            </div>
          )}

          {/* Sort */}
          {!search && (
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-white/30 text-xs uppercase tracking-widest"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                Sort:
              </span>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSort(opt.value)}
                  className="text-xs px-3 py-1 rounded transition-all duration-150"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    background:
                      sortBy === opt.value ? "#ef4444" : "transparent",
                    color:
                      sortBy === opt.value ? "#fff" : "rgba(255,255,255,0.35)",
                    border: `1px solid ${sortBy === opt.value ? "#ef4444" : "rgba(255,255,255,0.1)"}`,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Movie grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden animate-pulse">
                <div className="aspect-2/3 bg-[#1a1a2e]" />
                <div className="p-2.5 bg-[#0f0f1a] space-y-2">
                  <div className="h-3 bg-[#1a1a2e] rounded w-3/4" />
                  <div className="h-2 bg-[#1a1a2e] rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-24 text-white/20 text-lg">
            No movies found.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie, i) => (
                <MovieCard key={movie.id} movie={movie} index={i} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onPage={setPage} />
          </>
        )}
      </div>
    </main>
  );
}
