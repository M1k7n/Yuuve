"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaStar, FaPlay } from "react-icons/fa";

const API_KEY = "8476a7ab80ad76f0936744df0430e67c";
const BASE_URL = "https://api.themoviedb.org/3";

function GenrePill({ name }) {
  return (
    <span
      style={{
        border: "1px solid rgba(255,255,255,0.5)",
        borderRadius: "999px",
        padding: "4px 14px",
        fontSize: "13px",
        color: "#fff",
        whiteSpace: "nowrap",
        backdropFilter: "blur(4px)",
        background: "rgba(255,255,255,0.08)",
      }}
    >
      {name}
    </span>
  );
}

function StatCard({ label, value }) {
  return (
    <div
      style={{
        background: "#1a1a1a",
        borderRadius: "10px",
        padding: "16px 20px",
        flex: 1,
        minWidth: "140px",
      }}
    >
      <p
        style={{
          color: "#888",
          fontSize: "12px",
          margin: "0 0 6px",
          fontWeight: 400,
        }}
      >
        {label}
      </p>
      <p
        style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: 0 }}
      >
        {value || "—"}
      </p>
    </div>
  );
}

function SimilarCard({ movie }) {
  const [hovered, setHovered] = useState(false);
  const rating = movie.vote_average > 0 ? movie.vote_average.toFixed(1) : null;

  return (
    <Link
      href={`/movie/${movie.id}`}
      style={{ textDecoration: "none", flexShrink: 0, width: "140px" }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          transition: "transform 0.2s",
          transform: hovered ? "scale(1.04)" : "scale(1)",
        }}
      >
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
            style={{
              width: "100%",
              aspectRatio: "2/3",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              aspectRatio: "2/3",
              background: "#1e1e1e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#444",
              fontSize: "2rem",
            }}
          >
            🎬
          </div>
        )}
        {/* Title + rating overlay at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
            padding: "24px 8px 8px",
          }}
        >
          <p
            style={{
              color: "#fff",
              fontSize: "11px",
              fontWeight: 600,
              margin: "0 0 2px",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {movie.title}
          </p>
          {rating && (
            <span style={{ color: "#e9c46a", fontSize: "11px" }}>
              ★ {rating}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function MovieDetailPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    async function fetchAll() {
      const [movieRes, similarRes] = await Promise.all([
        fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`),
        fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}`),
      ]);
      const [movieData, similarData] = await Promise.all([
        movieRes.json(),
        similarRes.json(),
      ]);
      setMovie(movieData);
      setSimilar(similarData.results?.slice(0, 10) || []);
      setLoading(false);
    }

    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <main
        style={{
          background: "#111",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#555",
        }}
      >
        Loading...
      </main>
    );
  }

  if (!movie || movie.success === false) {
    return (
      <main
        style={{
          background: "#111",
          minHeight: "100vh",
          padding: "40px",
          color: "#fff",
        }}
      >
        <Link href="/" style={{ color: "#e63946", textDecoration: "none" }}>
          ← Back
        </Link>
        <p style={{ marginTop: "40px", color: "#555" }}>Movie not found.</p>
      </main>
    );
  }

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;

  const year = movie.release_date?.slice(0, 4);

  return (
    <main style={{ background: "#111", minHeight: "100vh", color: "#fff" }}>
      {/* ── HERO with backdrop ── */}
      <div style={{ position: "relative", minHeight: "560px" }}>
        {/* Backdrop image */}
        {movie.backdrop_path && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
              zIndex: 0,
            }}
          />
        )}

        {/* Dark overlay — left heavy, right fades more */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,0,0,0.92) 35%, rgba(0,0,0,0.55) 65%, rgba(0,0,0,0.3) 100%)",
            zIndex: 1,
          }}
        />
        {/* Bottom fade to page bg */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "120px",
            background: "linear-gradient(to bottom, transparent, #111)",
            zIndex: 2,
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            padding: "40px 40px 60px",
            display: "flex",
            gap: "32px",
            alignItems: "flex-start",
            maxWidth: "1100px",
          }}
        >
          {/* Poster */}
          <div style={{ flexShrink: 0 }}>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                alt={movie.title}
                style={{
                  width: "175px",
                  borderRadius: "10px",
                  display: "block",
                }}
              />
            ) : (
              <div
                style={{
                  width: "175px",
                  aspectRatio: "2/3",
                  background: "#1e1e1e",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "3rem",
                  color: "#333",
                }}
              >
                🎬
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ flex: 1, paddingTop: "8px" }}>
            {/* Genre pills */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              {(movie.genres || []).map((g) => (
                <GenrePill key={g.id} name={g.name} />
              ))}
            </div>

            {/* Title */}
            <h1
              style={{
                fontSize: "2.6rem",
                fontWeight: 900,
                margin: "0 0 6px",
                lineHeight: 1.1,
              }}
            >
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p
                style={{
                  color: "rgba(255,255,255,0.55)",
                  fontStyle: "italic",
                  fontSize: "14px",
                  margin: "0 0 14px",
                }}
              >
                "{movie.tagline}"
              </p>
            )}

            {/* Rating · Year · Runtime · Status */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "16px",
              }}
            >
              {movie.vote_average > 0 && (
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    color: "#e9c46a",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  <FaStar size={12} />
                  {movie.vote_average.toFixed(1)}
                  <span
                    style={{
                      color: "rgba(255,255,255,0.4)",
                      fontWeight: 400,
                      fontSize: "13px",
                    }}
                  >
                    {" "}
                    / 10
                  </span>
                </span>
              )}
              {year && <span style={metaPill}>{year}</span>}
              {runtime && <span style={metaPill}>{runtime}</span>}
              {movie.status && <span style={metaPill}>{movie.status}</span>}
            </div>

            {/* Overview */}
            <p
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: "14px",
                lineHeight: 1.7,
                maxWidth: "560px",
                margin: "0 0 24px",
              }}
            >
              {movie.overview}
            </p>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a
                href="https://www.youtube.com/watch?v=8dnJpuWuGn8"
                target="_blank"
              >
                <button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#fff",
                    color: "#111",
                    border: "none",
                    borderRadius: "8px",
                    padding: "11px 22px",
                    fontSize: "14px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  <FaPlay size={11} /> Watch Now
                </button>
              </a>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.4)",
                  borderRadius: "8px",
                  padding: "11px 22px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                + Add to List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <div style={{ padding: "0 40px 40px", maxWidth: "1100px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <StatCard
            label="Budget"
            value={
              movie.budget > 0 ? `$${(movie.budget / 1e6).toFixed(0)}M` : "—"
            }
          />
          <StatCard
            label="Revenue"
            value={
              movie.revenue > 0 ? `$${(movie.revenue / 1e6).toFixed(0)}M` : "—"
            }
          />
          <StatCard
            label="Vote Count"
            value={movie.vote_count?.toLocaleString()}
          />
          <StatCard
            label="Language"
            value={movie.original_language?.toUpperCase()}
          />
        </div>
      </div>

      {/* ── SIMILAR MOVIES ── */}
      {similar.length > 0 && (
        <div style={{ padding: "0 40px 60px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800, margin: "0 0 16px" }}>
            Similar Movies
          </h2>
          <div
            style={{
              display: "flex",
              gap: "12px",
              overflowX: "auto",
              paddingBottom: "8px",
              scrollbarWidth: "none",
            }}
          >
            {similar.map((m) => (
              <SimilarCard key={m.id} movie={m} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

const metaPill = {
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.2)",
  borderRadius: "6px",
  padding: "3px 10px",
  fontSize: "13px",
  color: "rgba(255,255,255,0.8)",
};
