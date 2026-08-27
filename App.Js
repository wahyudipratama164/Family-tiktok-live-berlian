import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

export default function App() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [anggota, setAnggota] = useState(() => {
    const data = localStorage.getItem("family_anggota");
    return data ? JSON.parse(data) : [];
  });

  const [liveList, setLiveList] = useState(() => {
    const data = localStorage.getItem("family_live");
    return data ? JSON.parse(data) : [];
  });

  const [nama, setNama] = useState("");
  const [idTikTok, setIdTikTok] = useState("");

  const [namaLive, setNamaLive] = useState("");
  const [jamLive, setJamLive] = useState("");
  const [berlian, setBerlian] = useState("");

  const [cariId, setCariId] = useState("");
  const [hasilCari, setHasilCari] = useState(null);

  useEffect(() => {
    localStorage.setItem("family_anggota", JSON.stringify(anggota));
  }, [anggota]);

  useEffect(() => {
    localStorage.setItem("family_live", JSON.stringify(liveList));
  }, [liveList]);

  const totalBerlian = liveList.reduce(
    (total, item) => total + Number(item.berlian || 0),
    0
  );

  const totalJam = liveList.reduce(
    (total, item) => total + Number(item.jam || 0),
    0
  );

  const ranking = useMemo(() => {
    return anggota
      .map((item) => {
        const dataLive = liveList.filter(
          (live) =>
            live.nama.toLowerCase() === item.nama.toLowerCase()
        );

        const berlianAnggota = dataLive.reduce(
          (total, live) => total + Number(live.berlian || 0),
          0
        );

        const jamAnggota = dataLive.reduce(
          (total, live) => total + Number(live.jam || 0),
          0
        );

        return {
          ...item,
          berlian: berlianAnggota,
          jam: jamAnggota,
        };
      })
      .sort((a, b) => b.berlian - a.berlian);
  }, [anggota, liveList]);

  const tambahAnggota = () => {
    if (!nama.trim() || !idTikTok.trim()) {
      alert("Isi nama dan ID TikTok terlebih dahulu");
      return;
    }

    const sudahAda = anggota.some(
      (item) =>
        item.id.toLowerCase() ===
        idTikTok.trim().replace("@", "").toLowerCase()
    );

    if (sudahAda) {
      alert("ID TikTok sudah terdaftar");
      return;
    }

    setAnggota([
      ...anggota,
      {
        nama: nama.trim(),
        id: idTikTok.trim().replace("@", ""),
      },
    ]);

    setNama("");
    setIdTikTok("");

    alert("Anggota berhasil ditambahkan");
  };

  const catatLive = () => {
    if (!namaLive || !jamLive) {
      alert("Pilih anggota dan isi durasi live");
      return;
    }

    setLiveList([
      ...liveList,
      {
        id: Date.now(),
        nama: namaLive,
        jam: Number(jamLive),
        berlian: Number(berlian || 0),
        tanggal: new Date().toLocaleDateString("id-ID"),
      },
    ]);

    setNamaLive("");
    setJamLive("");
    setBerlian("");

    alert("Data live berhasil disimpan");
  };

  const hapusAnggota = (index) => {
    const konfirmasi = window.confirm(
      "Yakin ingin menghapus anggota ini?"
    );

    if (!konfirmasi) return;

    setAnggota(anggota.filter((_, i) => i !== index));
  };

  const hapusLive = (id) => {
    const konfirmasi = window.confirm(
      "Yakin ingin menghapus riwayat live ini?"
    );

    if (!konfirmasi) return;

    setLiveList(liveList.filter((item) => item.id !== id));
  };

  const cekIdTikTok = () => {
    if (!cariId.trim()) {
      alert("Masukkan ID TikTok");
      return;
    }

    const hasil = anggota.find(
      (item) =>
        item.id.toLowerCase() ===
        cariId.trim().replace("@", "").toLowerCase()
    );

    setHasilCari(hasil || "tidak_ditemukan");
  };

  const hitungBonus = (item) => {
    let bonus = 0;
    let status = "Belum Memenuhi";

    if (item.berlian >= 10000 && item.jam >= 20) {
      bonus = 50000;
      status = "Bonus Tertinggi";
    } else if (item.berlian >= 5000 && item.jam >= 10) {
      bonus = 25000;
      status = "Memenuhi";
    } else if (item.berlian >= 1000 && item.jam >= 5) {
      bonus = 10000;
      status = "Memenuhi";
    }

    return { bonus, status };
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
            <h2>👑 Dashboard Ketua</h2>

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

              {ranking.length === 0 ? (
                <p>Belum ada anggota.</p>
              ) : (
                ranking.map((item, index) => (
                  <div className="list" key={index}>
                    <div>
                      <strong>
                        #{index + 1} {item.nama}
                      </strong>
                      <p>
                        ⏱️ {item.jam} Jam Live
                      </p>
                    </div>

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
              <h2>🔍 Cek ID TikTok</h2>

              <input
                type="text"
                placeholder="Masukkan ID TikTok"
                value={cariId}
                onChange={(e) => setCariId(e.target.value)}
              />

              <button onClick={cekIdTikTok}>
                🔍 Cek ID
              </button>

              {hasilCari && hasilCari !== "tidak_ditemukan" && (
                <div className="hasil">
                  <strong>✅ Anggota ditemukan</strong>
                  <p>👤 {hasilCari.nama}</p>
                  <p>📱 @{hasilCari.id}</p>
                </div>
              )}

              {hasilCari === "tidak_ditemukan" && (
                <div className="hasil">
                  <strong>❌ ID TikTok tidak ditemukan</strong>
                </div>
              )}
            </div>

            <div className="panel">
              <h2>📋 Daftar Anggota</h2>

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
              <select
                value={namaLive}
                onChange={(e) => setNamaLive(e.target.value)}
              >
                <option value="">
                  Pilih anggota
                </option>

                {anggota.map((item, index) => (
                  <option
                    key={index}
                    value={item.nama}
                  >
                    {item.nama}
                  </option>
                ))}
              </select>

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
                [...liveList]
                  .reverse()
                  .map((item) => (
                    <div
                      className="list"
                      key={item.id}
                    >
                      <div>
                        <strong>
                          📹 {item.nama}
                        </strong>
                        <p>
                          📅 {item.tanggal}
                        </p>
                        <p>
                          ⏱️ {item.jam} Jam
                        </p>
                        <p>
                          💎 {item.berlian}
                        </p>
                      </div>

                      <button
                        className="hapus"
                        onClick={() =>
                          hapusLive(item.id)
                        }
                      >
                        Hapus
                      </button>
                    </div>
                  ))
              )}
            </div>
          </>
        )}

        {activeTab === "Bonus" && (
          <>
            <h2>🎁 Tabel & Status Bonus</h2>

            <div className="panel">
              <h3>💎 Total Berlian: {totalBerlian}</h3>
              <h3>⏱️ Total Jam Live: {totalJam} Jam</h3>
            </div>

            <div className="panel">
              {ranking.length === 0 ? (
                <p>Belum ada data anggota.</p>
              ) : (
                ranking.map((item, index) => {
                  const hasilBonus =
                    hitungBonus(item);

                  return (
                    <div
                      className="list"
                      key={index}
                    >
                      <div>
                        <strong>
                          👤 {item.nama}
                        </strong>

                        <p>
                          💎 {item.berlian}
                        </p>

                        <p>
                          ⏱️ {item.jam} Jam
                        </p>

                        <p>
                          🎁 Bonus: Rp{" "}
                          {hasilBonus.bonus.toLocaleString(
                            "id-ID"
                          )}
                        </p>
                      </div>

                      <strong>
                        {hasilBonus.status}
                      </strong>
                    </div>
                  );
                })
              )}
            </div>

            <div className="panel">
              <h3>📌 Ketentuan Bonus</h3>
              <p>
                🥉 1.000 berlian + 5 jam =
                Rp10.000
              </p>
              <p>
                🥈 5.000 berlian + 10 jam =
                Rp25.000
              </p>
              <p>
                🥇 10.000 berlian + 20 jam =
                Rp50.000
              </p>
            </div>
          </>
        )}

      </main>

      <nav className="bottom-nav">

        <button
          className={
            activeTab === "Dashboard"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("Dashboard")
          }
        >
          💎<br />
          Dashboard
        </button>

        <button
          className={
            activeTab === "Anggota"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("Anggota")
          }
        >
          👥<br />
          Anggota
        </button>

        <button
          className={
            activeTab === "Catat Live"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("Catat Live")
          }
        >
          📹<br />
          Catat Live
        </button>

        <button
          className={
            activeTab === "Riwayat"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("Riwayat")
          }
        >
          📜<br />
          Riwayat
        </button>

        <button
          className={
            activeTab === "Bonus"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveTab("Bonus")
          }
        >
          🎁<br />
          Bonus
        </button>

      </nav>
    </div>
  );
}
