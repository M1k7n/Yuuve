"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

// 🎬 Genre map
const genresMap = {
  28: "Action",
  12: "Adventure",
  16: "Anime/Cartoon",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  14: "Fantasy",
  27: "Horror",
  9648: "Mystery",
  10749: "Love",
  878: "Science",
  53: "Thriller",
  10751: "Family",
};

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
          ←
        </button>

        {/* MOVIES */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2"
        >
          {movies.map((movie) => {
            const rating =
              movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null;

            return (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                <div className="w-36 aspect-2/3 bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition">
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />

                  <div className="p-2">
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
          →
        </button>
      </div>
    </div>
  );
}

export default function Page() {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const [search, setSearch] = useState("");

  // 🎬 Fetch movies
  useEffect(() => {
    fetch(
      "https://api.themoviedb.org/3/movie/popular?api_key=8476a7ab80ad76f0936744df0430e67c",
    )
      .then((res) => res.json())
      .then((data) => setMovies(data.results));
  }, []);

  // 🎞 Auto slider
  useEffect(() => {
    if (!movies.length) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  const currentMovie = movies[current];

  const filtered = search
    ? movies.filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
    : [];

  const genres = [...new Set(movies.flatMap((m) => m.genre_ids))].filter(
    (id) => genresMap[id],
  );

  return (
    <main className="p-6 bg-black min-h-screen">
      {/* 🔍 SEARCH */}
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 p-2 rounded bg-white/10 text-white"
      />

      {/* 🎬 HERO */}
      {currentMovie && !search && (
        <div className="relative h-100 mb-10 rounded-xl overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
            className="w-full h-full object-cover"
          />

          <div className="absolute bottom-0 p-6 bg-linear-to-t from-black/80">
            <h2 className="text-white text-2xl font-bold">
              {currentMovie.title}
            </h2>

            <p className="text-white/70 text-sm line-clamp-3">
              {currentMovie.overview}
            </p>
          </div>
        </div>
      )}

      {/* 🔍 SEARCH RESULT */}
      {search ? (
        <MovieRow title={`"${search}" Results`} movies={filtered} />
      ) : (
        <>
          {/* ⭐ Top */}
          <MovieRow
            title="Top Rating"
            movies={[...movies].sort((a, b) => b.vote_average - a.vote_average)}
          />

          {/* 🎭 Genres */}
          {genres.map((g) => (
            <MovieRow
              key={g}
              title={genresMap[g]}
              movies={movies.filter((m) => m.genre_ids.includes(g))}
            />
          ))}
        </>
      )}
    </main>
  );
}
