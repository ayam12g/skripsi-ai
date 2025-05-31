import React from "react";

export default function Home() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>
        Selamat Datang di SkripsiAI
      </h1>
      <p style={{ fontSize: "1rem", color: "#666" }}>
        Akses aplikasi melalui:
      </p>
      <div style={{ marginTop: "2rem" }}>
        <a
          href="/app"
          style={{ color: "#4F46E5", textDecoration: "underline" }}
        >
          Buka Aplikasi SkripsiAI
        </a>
      </div>
    </div>
  );
}
