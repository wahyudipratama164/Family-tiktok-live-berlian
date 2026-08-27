import React, { useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [anggota, setAnggota] = useState([
    {
      id: 1,
      nama: "WAHYUDI PRATAMA",
      role: "ketua",
      berlian: 0,
      jamLive: 0,
      warna: "#35b8ff",
    },
  ]);

  const [liveList, setLiveList] = useState([]);
  const [nama, setNama] = useState("");
  const [idTikTok, setIdTikTok] = useState("");
  const [jamLive, setJamLive] = useState("");
  const [berlian, setBerlian] = useState("");

  const [namaAnggota, setNamaAnggota] = useState("");
  const [roleAnggota, setRoleAnggota] = useState("anggota");
  const [kodeUndangan, setKodeUndangan] = useState("");
  const [chat, setChat] = useState([]);
  const [pesan, setPesan] = useState("");

  const isKetua = user?.role === "ketua";
  const isAdmin = user?.role === "admin";
  const canManage = isKetua || isAdmin;

  const totalBerlian = useMemo(
    () => liveList.reduce((total, item) => total + Number(item.berlian || 0), 0),
    [liveList]
  );

  const totalJam = useMemo(
    () => liveList.reduce((total, item) => total + Number(item.jamLive || 0), 0),
    [liveList]
  );

  function login(role) {
    setUser({
      nama:
        role === "ketua"
          ? "WAHYUDI PRATAMA"
          : role === "admin"
          ? "ADMIN FAMILY"
          : "ANGGOTA FAMILY",
      role,
    });

    setActiveTab("dashboard");
  }

  function logout() {
    setUser(null);
    setActiveTab("dashboard");
  }

  function tambahAnggota() {
    if (!namaAnggota.trim()) {
      alert("Masukkan nama anggota terlebih dahulu");
      return;
    }

    const anggotaBaru = {
      id: Date.now(),
      nama: namaAnggota,
      role: roleAnggota,
      berlian: 0,
      jamLive: 0,
      warna: "#35b8ff",
    };

    setAnggota([...anggota, anggotaBaru]);
    setNamaAnggota("");
    setRoleAnggota("anggota");
    alert("Anggota berhasil ditambahkan");
  }

  function buatUndangan() {
    const kode =
      "FAMILY-" + Math.random().toString(36).substring(2, 8).toUpperCase();

    setKodeUndangan(kode);
  }

  function catatLive() {
    if (!nama.trim() || !idTikTok.trim()) {
      alert("Nama dan ID TikTok wajib diisi");
      return;
    }

    const dataBaru = {
      id: Date.now(),
      nama,
      idTikTok,
      jamLive: Number(jamLive || 0),
      berlian: Number(berlian || 0),
      waktu: new Date().toLocaleString("id-ID"),
    };

    setLiveList([dataBaru, ...liveList]);

    setAnggota((data) =>
      data.map((item) =>
        item.nama.toLowerCase() === nama.toLowerCase()
          ? {
              ...item,
              berlian: item.berlian + Number(berlian || 0),
              jamLive: item.jamLive + Number(jamLive || 0),
            }
          : item
      )
    );

    setNama("");
    setIdTikTok("");
    setJamLive("");
    setBerlian("");

    alert("Live berhasil dicatat");
    setActiveTab("riwayat");
  }

  function kirimPesan() {
    if (!pesan.trim()) return;

    setChat([
      ...chat,
      {
        id: Date.now(),
        nama: user.nama,
        pesan,
        waktu: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setPesan("");
  }

  if (!user) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1>👑 FAMILY TIKTOK</h1>
          <p>LIVE • 💎 BERLIAN • 🏆 RANKING</p>

          <h2>Masuk sebagai</h2>

          <button onClick={() => login("ketua")}>
            👑 Masuk Ketua
          </button>

          <button onClick={() => login("admin")}>
            🛡️ Masuk Admin
          </button>

          <button onClick={() => login("anggota")}>
            👤 Masuk Anggota
          </button>
        </div>
      </div>
    );
  }

  const ranking = [...anggota].sort(
    (a, b) => Number(b.berlian) - Number(a.berlian)
  );

  return (
    <div className="container">
      <header className="header">
        <h1>👑 FAMILY TIKTOK</h1>
        <p>
          🎥 LIVE • 💎 BERLIAN • 🏆 RANKING
        </p>

        <div className="user-info">
          👤 {user.nama}
          <span className={"role " + user.role}>
            {user.role.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="main">

        {activeTab === "dashboard" && (
          <>
            <div className="welcome">
              <h2>Halo, {user.nama} 👋</h2>
              <p>Dashboard Family TikTok</p>
            </div>

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
                <strong>{liveList.length}</strong>
                <span>🎥 Total Live</span>
              </div>

              <div className="card">
                <strong>{totalJam}</strong>
                <span>⏱️ Total Jam Live</span>
              </div>
            </div>

            <section className="panel">
              <h2>🏆 Ranking Berlian</h2>

              {ranking.map((item, index) => (
                <div className="ranking-row" key={item.id}>
                  <span>#{index + 1}</span>
                  <strong>{item.nama}</strong>
                  <span>💎 {item.berlian}</span>
                </div>
              ))}
            </section>

            {canManage && (
              <section className="panel manage-box">
                <h2>⚙️ Menu Pengelolaan</h2>

                <button
                  onClick={() => setActiveTab("anggota")}
                >
                  👥 Kelola Anggota
                </button>

                <button
                  onClick={() => setActiveTab("undangan")}
                >
                  📨 Buat Undangan
                </button>
              </section>
            )}
          </>
        )}

        {activeTab === "anggota" && (
          <section className="panel">
            <h2>👥 Daftar Anggota</h2>

            {canManage && (
              <div className="form-box">
                <input
                  placeholder="Nama anggota"
                  value={namaAnggota}
                  onChange={(e) => setNamaAnggota(e.target.value)}
                />

                <select
                  value={roleAnggota}
                  onChange={(e) => setRoleAnggota(e.target.value)}
                >
                  <option value="anggota">👤 Anggota</option>

                  {isKetua && (
                    <option value="admin">🛡️ Admin</option>
                  )}
                </select>

                <button onClick={tambahAnggota}>
                  ➕ Tambah Anggota
                </button>
              </div>
            )}

            <div className="anggota-list">
              {anggota.map((item) => (
                <div className="anggota-row" key={item.id}>
                  <div>
                    <strong>{item.nama}</strong>
                    <p>
                      {item.role === "ketua"
                        ? "👑 Ketua"
                        : item.role === "admin"
                        ? "🛡️ Admin"
                        : "👤 Anggota"}
                    </p>
                  </div>

                  <div>
                    💎 {item.berlian}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === "undangan" && canManage && (
          <section className="panel">
            <h2>📨 Undangan Family</h2>

            <p>
              Hanya Ketua dan Admin yang dapat membuat undangan.
            </p>

            <button onClick={buatUndangan}>
              📨 Buat Kode Undangan
            </button>

            {kodeUndangan && (
              <div className="invite-code">
                <p>Kode Undangan:</p>
                <h2>{kodeUndangan}</h2>
                <p>Bagikan kode ini kepada anggota baru.</p>
              </div>
            )}
          </section>
        )}

        {activeTab === "live" && (
          <section className="panel">
            <h2>🎥 Catat Live</h2>

            <div className="form-box">
              <input
                placeholder="Nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />

              <input
                placeholder="ID TikTok"
                value={idTikTok}
                onChange={(e) => setIdTikTok(e.target.value)}
              />

              <input
                type="number"
                placeholder="Jam Live"
                value={jamLive}
                onChange={(e) => setJamLive(e.target.value)}
              />

              <input
                type="number"
                placeholder="Jumlah Berlian"
                value={berlian}
                onChange={(e) => setBerlian(e.target.value)}
              />

              <button onClick={catatLive}>
                💾 Simpan Catatan Live
              </button>
            </div>
          </section>
        )}

        {activeTab === "ranking" && (
          <section className="panel">
            <h2>🏆 Ranking Family</h2>

            {ranking.map((item, index) => (
              <div className="ranking-row" key={item.id}>
                <span className="rank">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                </span>

                <div>
                  <strong>{item.nama}</strong>
                  <p>
                    {item.role === "ketua"
                      ? "👑 Ketua"
                      : item.role === "admin"
                      ? "🛡️ Admin"
                      : "👤 Anggota"}
                  </p>
                </div>

                <strong>💎 {item.berlian}</strong>
              </div>
            ))}
          </section>
        )}

        {activeTab === "chat" && (
          <section className="panel chat-panel">
            <h2>💬 Ruang Chat Family</h2>

            <div className="chat-list">
              {chat.length === 0 && (
                <p className="empty">Belum ada pesan.</p>
              )}

              {chat.map((item) => (
                <div className="chat-message" key={item.id}>
                  <strong>{item.nama}</strong>
                  <p>{item.pesan}</p>
                  <small>{item.waktu}</small>
                </div>
              ))}
            </div>

            <div className="chat-input">
              <input
                placeholder="Tulis pesan..."
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") kirimPesan();
                }}
              />

              <button onClick={kirimPesan}>➤</button>
            </div>
          </section>
        )}

        {activeTab === "riwayat" && (
          <section className="panel">
            <h2>📜 Riwayat Live</h2>

            {liveList.length === 0 && (
              <p className="empty">Belum ada riwayat live.</p>
            )}

            {liveList.map((item) => (
              <div className="history-row" key={item.id}>
                <strong>{item.nama}</strong>
                <p>🎵 @{item.idTikTok}</p>
                <p>
                  ⏱️ {item.jamLive} jam • 💎 {item.berlian}
                </p>
                <small>{item.waktu}</small>
              </div>
            ))}
          </section>
        )}

        {activeTab === "profil" && (
          <section className="panel profile">
            <div className="profile-avatar">
              👤
            </div>

            <h2>{user.nama}</h2>

            <p>
              {isKetua
                ? "👑 Ketua Family"
                : isAdmin
                ? "🛡️ Admin Family"
                : "👤 Anggota Family"}
            </p>

            <div className="profile-stats">
              <div>
                <strong>{totalBerlian}</strong>
                <span>💎 Berlian</span>
              </div>

              <div>
                <strong>{totalJam}</strong>
                <span>⏱️ Jam Live</span>
              </div>
            </div>

            <button className="logout" onClick={logout}>
              🚪 Keluar
            </button>
          </section>
        )}
      </main>

      <nav className="bottom-nav">
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          💎
          <span>Dashboard</span>
        </button>

        <button
          className={activeTab === "anggota" ? "active" : ""}
          onClick={() => setActiveTab("anggota")}
        >
          👥
          <span>Anggota</span>
        </button>

        <button
          className={activeTab === "live" ? "active" : ""}
          onClick={() => setActiveTab("live")}
        >
          🎥
          <span>Catat Live</span>
        </button>

        <button
          className={activeTab === "ranking" ? "active" : ""}
          onClick={() => setActiveTab("ranking")}
        >
          🏆
          <span>Ranking</span>
        </button>

        <button
          className={activeTab === "chat" ? "active" : ""}
          onClick={() => setActiveTab("chat")}
        >
          💬
          <span>Chat</span>
        </button>

        <button
          className={activeTab === "riwayat" ? "active" : ""}
          onClick={() => setActiveTab("riwayat")}
        >
          📜
          <span>Riwayat</span>
        </button>

        <button
          className={activeTab === "profil" ? "active" : ""}
          onClick={() => setActiveTab("profil")}
        >
          👤
          <span>Profil</span>
        </button>
      </nav>
    </div>
  );
}
