"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// 🎬 Movie Row Component
function MovieRow({ title, movies }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: 300 * dir,
      behavior: "smooth",
    });
  };

  if (!movies.length) return null;

  return (
    <div className="mb-10">
      <h2 className="text-white text-xl font-bold mb-4 px-1">{title}</h2>

      <div className="relative group">
        {/* LEFT */}
        <button
          onClick={() => scroll(-1)}
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-linear-to-rrom-black/80 to-transparent opacity-0 group-hover:opacity-100"
        >
          ‹
        </button>

        {/* SCROLL */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2"
        >
          {movies.map((movie) => {
            const rating =
              movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null;

            const isTop = movie.vote_average >= 7.5;

            return (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className="w-36 aspect-2/3 bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />

                  {/* ⭐ badge */}
                  {isTop && (
                    <div className="absolute top-2 right-2 bg-black/60 border border-white/20 rounded px-1.5 py-0.5 text-yellow-400 text-[10px]">
                      ★ {rating}
                    </div>
                  )}

                  {/* bottom info */}
                  <div className="absolute bottom-0 w-full p-2 bg-linear-to-t from-black/80">
                    <p className="text-white text-xs truncate">{movie.title}</p>
                    {rating && (
                      <span className="text-yellow-400 text-xs">
                        ★ {rating}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* RIGHT */}
        <button
          onClick={() => scroll(1)}
          className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-linear-to-l from-black/80 to-transparent opacity-0 group-hover:opacity-100"
        >
          ›
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_KEY =
    "https://api.themoviedb.org/3/movie/popular?api_key=8476a7ab80ad76f0936744df0430e67c&language=en-US&page=1"; // move to .env later

  useEffect(() => {
    Promise.all([
      fetch(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`,
      ).then((r) => r.json()),
      fetch(
        `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}`,
      ).then((r) => r.json()),
      fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}`,
      ).then((r) => r.json()),
    ]).then(([a, b, c]) => {
      setNowPlaying(a.results || []);
      setUpcoming(b.results || []);
      setTopRated(c.results || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const hero = nowPlaying[0];

  return (
    <main className="bg-black min-h-screen p-6">
      {/* 🎬 HERO */}
      {hero && (
        <div className="relative h-105 rounded-2xl overflow-hidden mb-10">
          <img
            src={`https://image.tmdb.org/t/p/original${hero.backdrop_path}`}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-r from-black/80 to-transparent" />

          <div className="absolute bottom-0 p-8 max-w-lg">
            <span className="bg-red-500 text-xs px-3 py-1 rounded-full animate-pulse">
              ● Now Playing
            </span>

            <h2 className="text-white text-3xl font-bold mt-3">{hero.title}</h2>

            <p className="text-white/70 text-sm line-clamp-2 mt-2">
              {hero.overview}
            </p>

            <Link href={`/movie/${hero.id}`}>
              <button className="mt-4 bg-white text-black px-6 py-2 rounded-lg">
                ▶ Watch Now
              </button>
            </Link>
          </div>
        </div>
      )}

      {/* 🎞 ROWS */}
      <MovieRow title="🎬 Now Playing" movies={nowPlaying} />
      <MovieRow title="🔜 Upcoming" movies={upcoming} />
      <MovieRow title="⭐ Top Rated" movies={topRated} />
    </main>
  );
}
