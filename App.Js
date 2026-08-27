import React, { useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  const [anggota, setAnggota] = useState([
    {
      id: 1,
      nama: "KETUA FAMILY",
      role: "ketua",
      idTikTok: "@ketua",
      berlian: 0,
      jamLive: 0,
    },
  ]);

  const [liveList, setLiveList] = useState([]);
  const [chat, setChat] = useState([]);
  const [kodeUndangan, setKodeUndangan] = useState("");

  const [namaAnggota, setNamaAnggota] = useState("");
  const [idTikTokBaru, setIdTikTokBaru] = useState("");
  const [roleAnggota, setRoleAnggota] = useState("anggota");

  const [namaLive, setNamaLive] = useState("");
  const [idLive, setIdLive] = useState("");
  const [jamLive, setJamLive] = useState("");
  const [berlian, setBerlian] = useState("");

  const [pesan, setPesan] = useState("");

  const isKetua = user?.role === "ketua";
  const isAdmin = user?.role === "admin";
  const canManage = isKetua || isAdmin;

  const totalBerlian = useMemo(() => {
    return anggota.reduce((total, item) => total + item.berlian, 0);
  }, [anggota]);

  const totalJam = useMemo(() => {
    return anggota.reduce((total, item) => total + item.jamLive, 0);
  }, [anggota]);

  const ranking = useMemo(() => {
    return [...anggota].sort((a, b) => b.berlian - a.berlian);
  }, [anggota]);

  function login(role) {
    let nama = "ANGGOTA FAMILY";

    if (role === "ketua") nama = "KETUA FAMILY";
    if (role === "admin") nama = "ADMIN FAMILY";

    setUser({
      nama,
      role,
    });

    setActiveTab("dashboard");
  }

  function logout() {
    setUser(null);
    setActiveTab("dashboard");
  }

  function tambahAnggota() {
    if (!canManage) return;

    if (!namaAnggota.trim()) {
      alert("Masukkan nama anggota");
      return;
    }

    const anggotaBaru = {
      id: Date.now(),
      nama: namaAnggota,
      idTikTok: idTikTokBaru || "@belum_diisi",
      role: roleAnggota,
      berlian: 0,
      jamLive: 0,
    };

    setAnggota((data) => [...data, anggotaBaru]);

    setNamaAnggota("");
    setIdTikTokBaru("");
    setRoleAnggota("anggota");

    alert("Anggota berhasil ditambahkan");
  }

  function hapusAnggota(id) {
    if (!canManage || !isKetua) return;

    setAnggota((data) =>
      data.filter((item) => item.id !== id || item.role === "ketua")
    );
  }

  function buatUndangan() {
    if (!canManage) {
      alert("Hanya Ketua dan Admin yang dapat membuat undangan");
      return;
    }

    const kode =
      "FAMILY-" +
      Math.random().toString(36).substring(2, 8).toUpperCase();

    setKodeUndangan(kode);
  }

  function catatLive() {
    if (!namaLive.trim()) {
      alert("Masukkan nama anggota");
      return;
    }

    const jam = Number(jamLive || 0);
    const jumlahBerlian = Number(berlian || 0);

    const dataLive = {
      id: Date.now(),
      nama: namaLive,
      idTikTok: idLive || "@belum_diisi",
      jamLive: jam,
      berlian: jumlahBerlian,
      tanggal: new Date().toLocaleString("id-ID"),
    };

    setLiveList((data) => [dataLive, ...data]);

    setAnggota((data) => {
      const ditemukan = data.some(
        (item) =>
          item.nama.toLowerCase() === namaLive.toLowerCase()
      );

      if (ditemukan) {
        return data.map((item) =>
          item.nama.toLowerCase() === namaLive.toLowerCase()
            ? {
                ...item,
                berlian: item.berlian + jumlahBerlian,
                jamLive: item.jamLive + jam,
              }
            : item
        );
      }

      return [
        ...data,
        {
          id: Date.now() + 1,
          nama: namaLive,
          idTikTok: idLive || "@belum_diisi",
          role: "anggota",
          berlian: jumlahBerlian,
          jamLive: jam,
        },
      ];
    });

    setNamaLive("");
    setIdLive("");
    setJamLive("");
    setBerlian("");

    alert("Data live berhasil disimpan");
  }

  function kirimPesan() {
    if (!pesan.trim()) return;

    setChat((data) => [
      ...data,
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

  function bonusAnggota(item) {
    const bonus =
      item.berlian >= 10000
        ? "BONUS BESAR"
        : item.berlian >= 5000
        ? "BONUS MENENGAH"
        : item.berlian >= 1000
        ? "BONUS DASAR"
        : "BELUM ADA BONUS";

    return bonus;
  }

  if (!user) {
    return (
      <div className="login-page">
        <div className="login-box">
          <h1>👑 FAMILY</h1>
          <p>LIVE • 💎 BERLIAN • 🏆 RANKING</p>

          <h2>Masuk sebagai</h2>

          <button onClick={() => login("ketua")}>
            👑 Masuk sebagai Ketua
          </button>

          <button onClick={() => login("admin")}>
            🛡️ Masuk sebagai Admin
          </button>

          <button onClick={() => login("anggota")}>
            👤 Masuk sebagai Anggota
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header className="header">
        <h1>👑 FAMILY</h1>
        <p>📹 LIVE • 💎 BERLIAN • 🏆 RANKING</p>

        <div className="user-info">
          <span>👤 {user.nama}</span>
          <span className={`role ${user.role}`}>
            {user.role.toUpperCase()}
          </span>
        </div>
      </header>

      <main className="main">

        {activeTab === "dashboard" && (
          <>
            <div className="welcome">
              <h2>Halo, {user.nama} 👋</h2>
              <p>Selamat datang di Dashboard Family</p>
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
                <span>📹 Total Live</span>
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
              <section className="panel">
                <h2>⚙️ Pengelolaan Family</h2>

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
                  onChange={(e) =>
                    setNamaAnggota(e.target.value)
                  }
                />

                <input
                  placeholder="ID TikTok"
                  value={idTikTokBaru}
                  onChange={(e) =>
                    setIdTikTokBaru(e.target.value)
                  }
                />

                <select
                  value={roleAnggota}
                  onChange={(e) =>
                    setRoleAnggota(e.target.value)
                  }
                >
                  <option value="anggota">
                    👤 Anggota
                  </option>

                  {isKetua && (
                    <option value="admin">
                      🛡️ Admin
                    </option>
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
                    <p>🎵 {item.idTikTok}</p>
                    <p>
                      {item.role === "ketua"
                        ? "👑 Ketua"
                        : item.role === "admin"
                        ? "🛡️ Admin"
                        : "👤 Anggota"}
                    </p>
                  </div>

                  <div className="anggota-data">
                    <strong>💎 {item.berlian}</strong>

                    {isKetua &&
                      item.role !== "ketua" && (
                        <button
                          className="hapus"
                          onClick={() =>
                            hapusAnggota(item.id)
                          }
                        >
                          Hapus
                        </button>
                      )}
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
              Halaman ini hanya dapat digunakan oleh Ketua
              dan Admin.
            </p>

            <button onClick={buatUndangan}>
              📨 Buat Kode Undangan
            </button>

            {kodeUndangan && (
              <div className="invite-code">
                <p>Kode Undangan</p>
                <h2>{kodeUndangan}</h2>
                <p>
                  Bagikan kode ini kepada anggota baru.
                </p>
              </div>
            )}
          </section>
        )}

        {activeTab === "live" && (
          <section className="panel">
            <h2>📹 Catat Live</h2>

            <div className="form-box">
              <input
                placeholder="Nama anggota"
                value={namaLive}
                onChange={(e) =>
                  setNamaLive(e.target.value)
                }
              />

              <input
                placeholder="ID TikTok"
                value={idLive}
                onChange={(e) =>
                  setIdLive(e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Durasi Live (Jam)"
                value={jamLive}
                onChange={(e) =>
                  setJamLive(e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Jumlah Berlian"
                value={berlian}
                onChange={(e) =>
                  setBerlian(e.target.value)
                }
              />

              <button onClick={catatLive}>
                💾 Simpan Data Live
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
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : `#${index + 1}`}
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

        {activeTab === "riwayat" && (
          <section className="panel">
            <h2>📜 Riwayat Live</h2>

            {liveList.length === 0 ? (
              <p className="empty">
                Belum ada riwayat live.
              </p>
            ) : (
              liveList.map((item) => (
                <div className="history-row" key={item.id}>
                  <strong>📹 {item.nama}</strong>
                  <p>🎵 {item.idTikTok}</p>
                  <p>
                    ⏱️ {item.jamLive} Jam • 💎{" "}
                    {item.berlian}
                  </p>
                  <small>{item.tanggal}</small>
                </div>
              ))
            )}
          </section>
        )}

        {activeTab === "bonus" && (
          <section className="panel">
            <h2>🎁 Bonus Anggota</h2>

            {anggota.map((item) => (
              <div className="bonus-row" key={item.id}>
                <div>
                  <strong>{item.nama}</strong>
                  <p>
                    💎 {item.berlian} • ⏱️{" "}
                    {item.jamLive} Jam
                  </p>
                </div>

                <strong>{bonusAnggota(item)}</strong>
              </div>
            ))}
          </section>
        )}

        {activeTab === "chat" && (
          <section className="panel chat-panel">
            <h2>💬 Ruang Chat Family</h2>

            <div className="chat-list">
              {chat.length === 0 && (
                <p className="empty">
                  Belum ada pesan.
                </p>
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
                onChange={(e) =>
                  setPesan(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") kirimPesan();
                }}
              />

              <button onClick={kirimPesan}>
                ➤
              </button>
            </div>
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
                <span>💎 Berlian Family</span>
              </div>

              <div>
                <strong>{totalJam}</strong>
                <span>⏱️ Jam Live Family</span>
              </div>
            </div>

            <button
              className="logout"
              onClick={logout}
            >
              🚪 Keluar
            </button>
          </section>
        )}

      </main>

      <nav className="bottom-nav">
        <button
          className={
            activeTab === "dashboard" ? "active" : ""
          }
          onClick={() => setActiveTab("dashboard")}
        >
          💎
          <span>Dashboard</span>
        </button>

        <button
          className={
            activeTab === "anggota" ? "active" : ""
          }
          onClick={() => setActiveTab("anggota")}
        >
          👥
          <span>Anggota</span>
        </button>

        <button
          className={
            activeTab === "live" ? "active" : ""
          }
          onClick={() => setActiveTab("live")}
        >
          📹
          <span>Live</span>
        </button>

        <button
          className={
            activeTab === "ranking" ? "active" : ""
          }
          onClick={() => setActiveTab("ranking")}
        >
          🏆
          <span>Ranking</span>
        </button>

        <button
          className={
            activeTab === "riwayat" ? "active" : ""
          }
          onClick={() => setActiveTab("riwayat")}
        >
          📜
          <span>Riwayat</span>
        </button>

        <button
          className={
            activeTab === "bonus" ? "active" : ""
          }
          onClick={() => setActiveTab("bonus")}
        >
          🎁
          <span>Bonus</span>
        </button>

        <button
          className={
            activeTab === "chat" ? "active" : ""
          }
          onClick={() => setActiveTab("chat")}
        >
          💬
          <span>Chat</span>
        </button>

        <button
          className={
            activeTab === "profil" ? "active" : ""
          }
          onClick={() => setActiveTab("profil")}
        >
          👤
          <span>Profil</span>
        </button>
      </nav>
    </div>
  );
}
