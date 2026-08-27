# FAMILY TIKTOK — LIVE & BERLIAN

Jalankan file `diamonds_live_schema.sql` di Supabase SQL Editor SETELAH schema utama.

## Fitur
- Total berlian per anggota
- Riwayat setiap Live
- Durasi Live
- Berlian yang diperoleh
- Catatan Live
- Sumber data: `manual` atau `official_api`
- Fungsi database yang otomatis menambahkan berlian
- Ranking otomatis berdasarkan total berlian

## Cara pakai sekarang
Ketua/Admin memasukkan hasil setelah Live:
1. Pilih anggota.
2. Masukkan durasi Live.
3. Masukkan jumlah berlian.
4. Simpan.
5. Total berlian dan ranking langsung diperbarui.

## Integrasi API resmi di masa depan
Backend menerima data resmi yang memang diizinkan TikTok, lalu memanggil:
`record_live(member_id, duration, diamonds, notes, 'official_api')`

Jangan memasukkan Client Secret TikTok atau Service Role Supabase ke aplikasi HP/browser.
