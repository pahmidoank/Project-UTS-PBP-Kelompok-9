import { dataBooking } from "../data/bookingData.js";
import { dataPembayaran, ambilPembayaranBerikutnya } from "../data/pembayaranData.js";
import { kirimSukses, kirimError } from "../utils/response.js";

export function tampilkanPembayaran(req, res) {
  return kirimSukses(res, "Riwayat pembayaran berhasil ditampilkan.", { jumlahPembayaran: dataPembayaran.length, pembayaran: dataPembayaran });
}
export function tambahPembayaran(req, res) {
  const { bookingId, metode } = req.body;
  if (!bookingId || !metode) return kirimError(res, "bookingId dan metode wajib diisi.");
  const booking = dataBooking.find(b => b.id === Number(bookingId));
  if (!booking) return kirimError(res, "Booking tidak ditemukan.", 404);
  if (booking.status === "lunas") return kirimError(res, "Booking sudah dibayar.", 409);
  const pembayaran = {
    id: ambilPembayaranBerikutnya(), bookingId: booking.id,
    namaPemesan: booking.namaPemesan, nominal: booking.totalHarga,
    metode: String(metode), status: "berhasil", tanggalPembayaran: new Date().toISOString()
  };
  booking.status = "lunas";
  dataPembayaran.push(pembayaran);
  return kirimSukses(res, "Pembayaran simulasi berhasil dicatat.", pembayaran, 201);
}
