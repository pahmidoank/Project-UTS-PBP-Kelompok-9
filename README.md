# KosTerpadu Full Website — Project UTS

Website pencarian, booking, dan pembayaran kos yang terdiri dari frontend HTML/CSS/JavaScript dan backend REST API Node.js + Express.

## Menjalankan project
1. Ekstrak ZIP.
2. Buka folder `KOSTERPADU-FULL` di Visual Studio Code atau terminal.
3. Pastikan Node.js sudah terpasang.
4. Jalankan `npm install`.
5. Jalankan `npm start`.
6. Buka browser ke `http://localhost:3000`.

## Fitur website
- Landing page responsif.
- Daftar kos dan pencarian berdasarkan lokasi serta budget.
- Filter jenis kos.
- Detail kos.
- Booking kamar dengan perhitungan total harga.
- Simulasi pencatatan pembayaran.
- Dashboard pemilik untuk melihat ringkasan, menambah, mengubah, dan menghapus data kos.

## Endpoint API
| Method | Endpoint | Fungsi |
|---|---|---|
| GET | `/api/kos` | Daftar kos |
| GET | `/api/kos/:id` | Detail kos |
| GET | `/api/kos/search?lokasi=Bandung` | Cari kos dengan parameter |
| POST | `/api/kos` | Tambah kos |
| PUT | `/api/kos/:id` | Ubah kos |
| DELETE | `/api/kos/:id` | Hapus kos |
| GET | `/api/booking` | Daftar booking |
| POST | `/api/booking` | Buat booking |
| GET | `/api/pembayaran` | Riwayat pembayaran |
| POST | `/api/pembayaran` | Catat pembayaran simulasi |

## Struktur folder
```text
KOSTERPADU-FULL/
├── public/
│   ├── css/style.css
│   ├── js/app.js
│   ├── js/api.js
│   └── index.html
├── src/
│   ├── controllers/
│   ├── data/
│   ├── routes/
│   ├── utils/
│   └── app.js
├── postman/
├── server.js
└── package.json
```

## Kesesuaian dengan ketentuan UTS
- Minimal lima route utama: tersedia lebih dari lima endpoint.
- GET, POST, GET query parameter, PUT, DELETE: tersedia pada API kos.
- Array dan object literal: data kos, booking, dan pembayaran menggunakan array berisi object literal.
- Percabangan: validasi input, status kamar, dan status pembayaran.
- Perulangan: menghitung jumlah kamar yang tersedia.
- Operator aritmatika: menghitung biaya booking (`hargaPerBulan * durasiBulan`) dan mengurangi kamar tersedia.
- Modules dan packages: kode dibagi ke beberapa modul ES dan menggunakan Express.
- Pengujian Postman: collection tersedia pada folder `postman`.

## Catatan
- Data disimpan sementara di memori menggunakan array. Data yang ditambahkan akan kembali ke data awal saat server direstart.
- Pembayaran adalah simulasi untuk demonstrasi tugas, bukan transaksi uang sungguhan.
- Dashboard pemilik adalah dashboard demonstrasi dan belum menggunakan sistem login/autentikasi.
- Foto contoh menggunakan URL gambar eksternal sehingga memerlukan koneksi internet.
