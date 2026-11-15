import { dataKos } from "../data/kosData.js";
import { dataBooking, ambilBookingBerikutnya } from "../data/bookingData.js";
import { kirimSukses, kirimError } from "../utils/response.js";

export function tampilkanBooking(req, res) {
  return kirimSukses(res, "Daftar booking berhasil ditampilkan.", { jumlahBooking: dataBooking.length, booking: dataBooking });
}
export function tambahBooking(req, res) {
  const { kosId, namaPemesan, durasiBulan } = req.body;
  const durasi = Number(durasiBulan);
  if (!kosId || !namaPemesan || durasiBulan === undefined) return kirimError(res, "kosId, namaPemesan, dan durasiBulan wajib diisi.");
  if (!Number.isInteger(durasi) || durasi < 1) return kirimError(res, "Durasi minimal 1 bulan.");
  const kos = dataKos.find(k => k.id === Number(kosId));
  if (!kos) return kirimError(res, "Kos tidak ditemukan.", 404);
  if (kos.kamarTersedia < 1) return kirimError(res, "Kamar sedang penuh.", 409);
  const totalHarga = kos.hargaPerBulan * durasi;
  const booking = {
    id: ambilBookingBerikutnya(), kosId: kos.id, namaKos: kos.nama,
    namaPemesan: String(namaPemesan).trim(), durasiBulan: durasi,
    hargaPerBulan: kos.hargaPerBulan, totalHarga,
    status: "menunggu_pembayaran", tanggalBooking: new Date().toISOString()
  };
  kos.kamarTersedia -= 1;
  kos.status = kos.kamarTersedia > 0 ? "tersedia" : "penuh";
  dataBooking.push(booking);
  return kirimSukses(res, "Booking berhasil dibuat.", booking, 201);
}
