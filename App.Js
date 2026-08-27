import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [anggota, setAnggota] = useState([]);
  const [nama, setNama] = useState("");
  const [idTikTok, setIdTikTok] = useState("");

  const [liveList, setLiveList] = useState([]);
  const [namaLive, setNamaLive] = useState("");
  const [jamLive, setJamLive] = useState("");
  const [berlian, setBerlian] = useState("");

  const totalBerlian = liveList.reduce(
    (total, item) => total + Number(item.berlian || 0),
    0
  );

  const totalJam = liveList.reduce(
    (total, item) => total + Number(item.jam || 0),
    0
  );

  const tambahAnggota = () => {
    if (!nama || !idTikTok) {
      alert("Isi nama dan ID TikTok terlebih dahulu");
      return;
    }

    setAnggota([
      ...anggota,
      {
        nama,
        id: idTikTok,
      },
    ]);

    setNama("");
    setIdTikTok("");
  };

  const catatLive = () => {
    if (!namaLive || !jamLive) {
      alert("Isi nama anggota dan durasi live");
      return;
    }

    setLiveList([
      ...liveList,
      {
        nama: namaLive,
        jam: Number(jamLive),
        berlian: Number(berlian || 0),
        tanggal: new Date().toLocaleDateString("id-ID"),
      },
    ]);

    setNamaLive("");
    setJamLive("");
    setBerlian("");
  };

  const hapusAnggota = (index) => {
    setAnggota(anggota.filter((_, i) => i !== index));
  };

  return (
    <div className="container">
      <header className="header">
        <h1>👑 FAMILY TIKTOK</h1>
        <p>📹 LIVE • 💎 BERLIAN • 🏆 RANKING</p>
      </header>

      <main className="main">

        {activeTab === "Dashboard" && (
          <>
            <h2>📊 Dashboard</h2>

            <div className="cards">
              <div className="card">
                <strong>{anggota.length}</strong>
                <span>👥 Total Anggota</span>
              </div>

              <div className="card">
                <strong>{totalBerlian}</strong>
                <span>💎 Total Berlian</span>
              </div>

              <div className="card">
                <strong>{totalJam}</strong>
                <span>⏱️ Total Jam Live</span>
              </div>
            </div>

            <div className="panel">
              <h2>🏆 Ranking Berlian</h2>

              {liveList.length === 0 ? (
                <p>Belum ada data live.</p>
              ) : (
                [...liveList]
                  .sort((a, b) => b.berlian - a.berlian)
                  .map((item, index) => (
                    <div className="list" key={index}>
                      <span>#{index + 1} {item.nama}</span>
                      <strong>💎 {item.berlian}</strong>
                    </div>
                  ))
              )}
            </div>
          </>
        )}

        {activeTab === "Anggota" && (
          <>
            <h2>👥 Tambah Anggota</h2>

            <div className="panel">
              <input
                type="text"
                placeholder="Nama anggota"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />

              <input
                type="text"
                placeholder="ID TikTok"
                value={idTikTok}
                onChange={(e) => setIdTikTok(e.target.value)}
              />

              <button onClick={tambahAnggota}>
                ➕ Tambah Anggota
              </button>
            </div>

            <div className="panel">
              <h2>🔍 Daftar & Cek ID</h2>

              {anggota.length === 0 ? (
                <p>Belum ada anggota.</p>
              ) : (
                anggota.map((item, index) => (
                  <div className="list" key={index}>
                    <div>
                      <strong>{item.nama}</strong>
                      <p>@{item.id}</p>
                    </div>

                    <button
                      className="hapus"
                      onClick={() => hapusAnggota(index)}
                    >
                      Hapus
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === "Catat Live" && (
          <>
            <h2>📹 Catat Live</h2>

            <div className="panel">
              <input
                type="text"
                placeholder="Nama anggota"
                value={namaLive}
                onChange={(e) => setNamaLive(e.target.value)}
              />

              <input
                type="number"
                placeholder="Durasi live (jam)"
                value={jamLive}
                onChange={(e) => setJamLive(e.target.value)}
              />

              <input
                type="number"
                placeholder="Jumlah berlian"
                value={berlian}
                onChange={(e) => setBerlian(e.target.value)}
              />

              <button onClick={catatLive}>
                💾 Simpan Data Live
              </button>
            </div>
          </>
        )}

        {activeTab === "Riwayat" && (
          <>
            <h2>📜 Riwayat Live</h2>

            <div className="panel">
              {liveList.length === 0 ? (
                <p>Belum ada riwayat live.</p>
              ) : (
                liveList.map((item, index) => (
                  <div className="list" key={index}>
                    <div>
                      <strong>📹 {item.nama}</strong>
                      <p>📅 {item.tanggal}</p>
                    </div>

                    <div>
                      <p>⏱️ {item.jam} Jam</p>
                      <strong>💎 {item.berlian}</strong>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === "Bonus" && (
          <>
            <h2>🎁 Bonus Anggota</h2>

            <div className="panel">
              <h3>💎 Total Berlian: {totalBerlian}</h3>
              <h3>⏱️ Total Jam Live: {totalJam} Jam</h3>

              <p>
                Bonus dapat ditentukan berdasarkan jumlah berlian
                dan total jam live setiap anggota.
              </p>
            </div>
          </>
        )}

      </main>

      <nav className="bottom-nav">
        <button onClick={() => setActiveTab("Dashboard")}>
          💎<br />
          Dashboard
        </button>

        <button onClick={() => setActiveTab("Anggota")}>
          👥<br />
          Anggota
        </button>

        <button onClick={() => setActiveTab("Catat Live")}>
          📹<br />
          Catat Live
        </button>

        <button onClick={() => setActiveTab("Riwayat")}>
          📜<br />
          Riwayat
        </button>

        <button onClick={() => setActiveTab("Bonus")}>
          🎁<br />
          Bonus
        </button>
      </nav>
    </div>
  );
}
