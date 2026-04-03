"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaStar } from "react-icons/fa";

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

// ✅ ADDED: Genre color map for badge styling
const genreColors = {
  28: "#e63946",
  12: "#f4a261",
  16: "#2a9d8f",
  35: "#e9c46a",
  80: "#6d6875",
  18: "#8ecae6",
  14: "#c77dff",
  27: "#e76f51",
  9648: "#480ca8",
  10749: "#fb6f92",
  878: "#00b4d8",
  53: "#d62828",
  10751: "#95d5b2",
};

// ✅ ADDED: GenreBadge component — renders a small colored pill for each genre
function GenreBadge({ genreId }) {
  const name = genresMap[genreId];
  const color = genreColors[genreId] || "#888";
  if (!name) return null;

  return (
    <span
      style={{
        backgroundColor: color + "33",
        color: color,
        border: `1px solid ${color}66`,
      }}
      className="text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide whitespace-nowrap"
    >
      {name}
    </span>
  );
}

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
          className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-linear-to-r from-black/80 to-transparent opacity-0 group-hover:opacity-100"
        >
          ←
        </button>

        {/* MOVIES */}
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-2 scroll overflow-y-hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {movies.map((movie) => {
            const rating =
              movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null;

            return (
              <Link key={movie.id} href={`/movie/${movie.id}`}>
                {/* ✅ CHANGED: card height increased to fit badges below poster */}
                <div className="w-36 shrink-0 bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition flex flex-col h-80.25">
                  <div className="aspect-2/3">
                    <img
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-2 flex flex-col gap-1.5">
                    <p className="text-white text-xs truncate">{movie.title}</p>

                    {rating && (
                      <span className="text-yellow-400 text-xs">
                        ★ {rating}
                      </span>
                    )}

                    {/* ✅ ADDED: Genre badges — maps each genre_id to a colored pill */}
                    <div className="flex flex-wrap gap-1 mt-0.5">
                      {movie.genre_ids
                        .filter((id) => genresMap[id]) // only show genres in our map
                        .slice(0, 2) // max 2 badges to avoid overflow
                        .map((id) => (
                          <GenreBadge key={id} genreId={id} />
                        ))}
                    </div>
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

export default function HomeContent() {
  const [movies, setMovies] = useState([]);
  const [current, setCurrent] = useState(0);
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

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
      {/* 🎬 HERO */}
      {currentMovie && !search && (
        <div className="relative h-100 mb-10 rounded-xl overflow-hidden">
          <img
            src={`https://image.tmdb.org/t/p/original${currentMovie.backdrop_path}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 p-6 bg-linear-to-t from-black/80 w-full">
            <div className="h-5 flex items-center mb-3.5">
              <FaStar color="Gold" className="pb-1 mr-1.5" />
              <h2 className="text-yellow-300 text-md font-bold flex items-center">
                {currentMovie.vote_average}
                <span className="text-white/70 text-xl mx-1">&#183;</span>
                <span className="text-white/70 text-sm font-light">
                  {currentMovie.release_date}
                </span>
              </h2>
            </div>
            <h2 className="text-white text-2xl font-bold mb-3">
              {currentMovie.title}
            </h2>

            {/* ✅ ADDED: Genre badges on the hero banner */}
            <div className="flex flex-wrap gap-2 mb-3">
              {currentMovie.genre_ids
                .filter((id) => genresMap[id])
                .map((id) => (
                  <GenreBadge key={id} genreId={id} />
                ))}
            </div>

            <p className="text-white/70 text-md line-clamp-3 mb-3.5">
              {currentMovie.overview}
            </p>
            <a
              href="https://www.youtube.com/watch?v=8dnJpuWuGn8"
              target="_blank"
            >
              <button className="bg-white px-3 py-1 rounded-md mb-3 text-black/80  shadow-2xl shadow-pink-300">
                &#9658; Watch Now
              </button>
            </a>
          </div>
        </div>
      )}

      {/* 🔍 SEARCH RESULT */}
      {search ? (
        <MovieRow title={`"${search}" Results`} movies={filtered} />
      ) : (
        <>
          <MovieRow
            title="Top Rating"
            movies={[...movies].sort((a, b) => b.vote_average - a.vote_average)}
          />
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
