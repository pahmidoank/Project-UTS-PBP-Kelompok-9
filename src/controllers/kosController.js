import { dataKos, ambilKosBerikutnya } from "../data/kosData.js";
import { kirimSukses, kirimError } from "../utils/response.js";

export function tampilkanSemuaKos(req, res) {
  let totalKamarTersedia = 0;
  for (const kos of dataKos) totalKamarTersedia += kos.kamarTersedia;
  return kirimSukses(res, "Daftar kos berhasil ditampilkan.", {
    jumlahKos: dataKos.length, totalKamarTersedia, kos: dataKos
  });
}
export function tampilkanDetailKos(req, res) {
  const kos = dataKos.find(item => item.id === Number(req.params.id));
  if (!kos) return kirimError(res, "Data kos tidak ditemukan.", 404);
  return kirimSukses(res, "Detail kos ditemukan.", kos);
}
export function cariKos(req, res) {
  const { lokasi, maksHarga, jenis, status } = req.query;
  let hasil = [...dataKos];
  if (lokasi) hasil = hasil.filter(k => k.lokasi.toLowerCase().includes(String(lokasi).toLowerCase()));
  if (maksHarga !== undefined) {
    const batas = Number(maksHarga);
    if (!Number.isFinite(batas) || batas < 0) return kirimError(res, "maksHarga harus angka nol atau lebih.");
    hasil = hasil.filter(k => k.hargaPerBulan <= batas);
  }
  if (jenis) hasil = hasil.filter(k => k.jenis.toLowerCase() === String(jenis).toLowerCase());
  if (status) hasil = hasil.filter(k => k.status.toLowerCase() === String(status).toLowerCase());
  return kirimSukses(res, "Pencarian selesai.", { jumlahHasil: hasil.length, hasil });
}
export function tambahKos(req, res) {
  const { nama, pemilik, lokasi, hargaPerBulan, fasilitas, jenis, kamarTersedia, deskripsi, gambar } = req.body;
  if (!nama || !pemilik || !lokasi || !jenis || hargaPerBulan === undefined || kamarTersedia === undefined)
    return kirimError(res, "Nama, pemilik, lokasi, harga, jenis, dan kamar tersedia wajib diisi.");
  const harga = Number(hargaPerBulan), kamar = Number(kamarTersedia);
  if (!Number.isFinite(harga) || harga <= 0 || !Number.isInteger(kamar) || kamar < 0)
    return kirimError(res, "Harga harus lebih dari 0 dan jumlah kamar berupa bilangan bulat nol atau lebih.");
  const baru = {
    id: ambilKosBerikutnya(), nama: String(nama).trim(), pemilik: String(pemilik).trim(),
    lokasi: String(lokasi).trim(), hargaPerBulan: harga,
    fasilitas: Array.isArray(fasilitas) ? fasilitas : String(fasilitas || "").split(",").map(x => x.trim()).filter(Boolean),
    jenis: String(jenis).trim(), kamarTersedia: kamar,
    status: kamar > 0 ? "tersedia" : "penuh",
    deskripsi: deskripsi || "Informasi kos belum ditambahkan.",
    gambar: gambar || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900"
  };
  dataKos.push(baru);
  return kirimSukses(res, "Kos berhasil ditambahkan.", baru, 201);
}
export function ubahKos(req, res) {
  const id = Number(req.params.id), indeks = dataKos.findIndex(k => k.id === id);
  if (indeks < 0) return kirimError(res, "Data kos tidak ditemukan.", 404);
  const perubahan = req.body;
  if (perubahan.hargaPerBulan !== undefined && (!Number.isFinite(Number(perubahan.hargaPerBulan)) || Number(perubahan.hargaPerBulan) <= 0))
    return kirimError(res, "Harga harus berupa angka lebih dari 0.");
  if (perubahan.kamarTersedia !== undefined && (!Number.isInteger(Number(perubahan.kamarTersedia)) || Number(perubahan.kamarTersedia) < 0))
    return kirimError(res, "Jumlah kamar harus bilangan bulat nol atau lebih.");
  const lama = dataKos[indeks];
  const baru = { ...lama, ...perubahan, id,
    hargaPerBulan: perubahan.hargaPerBulan === undefined ? lama.hargaPerBulan : Number(perubahan.hargaPerBulan),
    kamarTersedia: perubahan.kamarTersedia === undefined ? lama.kamarTersedia : Number(perubahan.kamarTersedia)
  };
  baru.status = baru.kamarTersedia > 0 ? "tersedia" : "penuh";
  dataKos[indeks] = baru;
  return kirimSukses(res, "Data kos berhasil diperbarui.", baru);
}
export function hapusKos(req, res) {
  const indeks = dataKos.findIndex(k => k.id === Number(req.params.id));
  if (indeks < 0) return kirimError(res, "Data kos tidak ditemukan.", 404);
  const [dihapus] = dataKos.splice(indeks, 1);
  return kirimSukses(res, "Data kos berhasil dihapus.", dihapus);
}
