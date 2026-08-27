import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("Beranda");

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>Family TikTok</h1>
        <p style={styles.subtitle}>Aplikasi video privat untuk keluarga</p>
      </header>

      <main style={styles.main}>
        <h2>{activeTab}</h2>

        {activeTab === "Beranda" && (
          <>
            <div style={styles.uploadBox}>
              <h3>📹 Upload Video</h3>
              <input type="file" accept="video/*" />
            </div>

            <h3>Video Keluarga</h3>
            <div style={styles.empty}>
              Belum ada video. Upload video pertama Anda.
            </div>
          </>
        )}

        {activeTab === "Profil" && (
          <div style={styles.empty}>
            👤 Profil Pengguna
          </div>
        )}
      </main>

      <nav style={styles.nav}>
        <button
          onClick={() => setActiveTab("Beranda")}
          style={styles.button}
        >
          🏠 Beranda
        </button>

        <button
          onClick={() => setActiveTab("Profil")}
          style={styles.button}
        >
          👤 Profil
        </button>
      </nav>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "auto",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
    background: "#f5f5f5"
  },
  header: {
    background: "#111",
    color: "white",
    padding: "25px",
    textAlign: "center"
  },
  logo: {
    margin: 0
  },
  subtitle: {
    marginBottom: 0,
    opacity: 0.8
  },
  main: {
    padding: "20px"
  },
  uploadBox: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px"
  },
  empty: {
    background: "white",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center"
  },
  nav: {
    display: "flex",
    gap: "10px",
    padding: "15px"
  },
  button: {
    flex: 1,
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px"
  }
};
