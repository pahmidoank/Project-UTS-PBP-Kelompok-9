// Array berisi object literal sebagai penyimpanan data sesuai ketentuan UTS.
export const dataKos = [
  {
    id: 1, nama: "Kos Melati", pemilik: "Ibu Rina",
    lokasi: "Cileunyi, Bandung", hargaPerBulan: 800000,
    fasilitas: ["WiFi", "Kasur", "Lemari", "Kamar mandi dalam"],
    jenis: "Putri", kamarTersedia: 3, status: "tersedia",
    deskripsi: "Kos nyaman dengan lingkungan tenang, cocok untuk mahasiswa.",
    gambar: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900"
  },
  {
    id: 2, nama: "Kos Samudra", pemilik: "Pak Dedi",
    lokasi: "Jatinangor, Sumedang", hargaPerBulan: 950000,
    fasilitas: ["WiFi", "AC", "Meja belajar", "Parkir"],
    jenis: "Campur", kamarTersedia: 2, status: "tersedia",
    deskripsi: "Kamar luas dengan fasilitas lengkap dan akses mudah.",
    gambar: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900"
  },
  {
    id: 3, nama: "Kos Nusa Indah", pemilik: "Ibu Sari",
    lokasi: "Cibiru, Bandung", hargaPerBulan: 650000,
    fasilitas: ["Kasur", "Lemari", "Dapur bersama"],
    jenis: "Putra", kamarTersedia: 0, status: "penuh",
    deskripsi: "Kos sederhana, bersih, dan dekat dengan fasilitas umum.",
    gambar: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900"
  },
  {
    id: 4, nama: "Pondok Harmoni", pemilik: "Pak Agus",
    lokasi: "Cimahi, Bandung", hargaPerBulan: 1100000,
    fasilitas: ["WiFi", "AC", "Kamar mandi dalam", "Parkir"],
    jenis: "Campur", kamarTersedia: 5, status: "tersedia",
    deskripsi: "Hunian praktis dengan suasana nyaman dan fasilitas memadai.",
    gambar: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900"
  }
];
export let nextKosId = 5;
export function ambilKosBerikutnya() {
  const id = nextKosId;
  nextKosId += 1;
  return id;
}
