import { api } from "./api.js";

const grid = document.querySelector("#kosGrid");
const count = document.querySelector("#resultCount");
const backdrop = document.querySelector("#modalBackdrop");
const modalContent = document.querySelector("#modalContent");
const toastBox = document.querySelector("#toast");
let currentType = "";

const rupiah = value => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(value);

function toast(message) {
  toastBox.textContent = message;
  toastBox.classList.add("show");
  setTimeout(() => toastBox.classList.remove("show"), 2600);
}
function openModal(html) {
  modalContent.innerHTML = html;
  backdrop.classList.add("show");
}
function closeModal() {
  backdrop.classList.remove("show");
  modalContent.innerHTML = "";
}
document.querySelector("#modalClose").addEventListener("click", closeModal);
backdrop.addEventListener("click", event => {
  if (event.target === backdrop) closeModal();
});

function renderKos(items) {
  count.textContent = `${items.length} kos ditemukan`;
  if (!items.length) {
    grid.innerHTML = `<div class="empty-state"><strong>Belum ada kos yang cocok.</strong><p>Coba ubah lokasi atau rentang budget pencarianmu.</p></div>`;
    return;
  }
  grid.innerHTML = items.map(kos => `
    <article class="kos-card">
      <div class="kos-image">
        <img src="${escapeHtml(kos.gambar || "")}" alt="${escapeHtml(kos.nama)}" onerror="this.src='https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900'">
        <span class="status-tag ${kos.status === "penuh" ? "full" : ""}">${kos.status === "penuh" ? "Kamar penuh" : "● Tersedia"}</span>
      </div>
      <div class="kos-info">
        <div class="kos-title-row"><div><h3>${escapeHtml(kos.nama)}</h3><div class="kos-location">⌖ ${escapeHtml(kos.lokasi)}</div></div>
          <div class="kos-price">${rupiah(kos.hargaPerBulan)}<small>/ bulan</small></div>
        </div>
        <div class="kos-meta">
          <span class="meta-chip">${escapeHtml(kos.jenis)}</span>
          ${(kos.fasilitas || []).slice(0, 2).map(f => `<span class="meta-chip">${escapeHtml(f)}</span>`).join("")}
        </div>
        <div class="kos-bottom"><span class="room-count">${kos.kamarTersedia} kamar tersedia</span><button class="detail-button" data-detail="${kos.id}">Lihat detail →</button></div>
      </div>
    </article>
  `).join("");
  grid.querySelectorAll("[data-detail]").forEach(button => {
    button.addEventListener("click", () => showDetail(Number(button.dataset.detail)));
  });
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

async function loadKos(params = {}) {
  try {
    const result = Object.keys(params).length ? await api.searchKos(params) : await api.getKos();
    renderKos(result.hasil || result.kos || []);
  } catch (error) {
    grid.innerHTML = `<div class="empty-state">Tidak dapat mengambil data. Pastikan server sudah berjalan dengan perintah <b>npm start</b>.</div>`;
    count.textContent = "Gagal memuat";
  }
}

async function showDetail(id) {
  try {
    const kos = await api.getKosById(id);
    openModal(`
      <div class="eyebrow">DETAIL TEMPAT TINGGAL</div>
      <img class="modal-image" src="${escapeHtml(kos.gambar || "")}" alt="${escapeHtml(kos.nama)}">
      <h2 id="modalTitle">${escapeHtml(kos.nama)}</h2>
      <p>⌖ ${escapeHtml(kos.lokasi)} · Pemilik: ${escapeHtml(kos.pemilik)}</p>
      <div class="modal-price">${rupiah(kos.hargaPerBulan)} <span style="font-size:11px;color:#8994a5;font-weight:500">/ bulan</span></div>
      <p>${escapeHtml(kos.deskripsi || "")}</p>
      <div class="kos-meta">${(kos.fasilitas || []).map(f => `<span class="meta-chip">${escapeHtml(f)}</span>`).join("")}</div>
      <p><b>Jenis:</b> ${escapeHtml(kos.jenis)} &nbsp; <b>Kamar tersedia:</b> ${kos.kamarTersedia}</p>
      <div class="modal-actions">
        <button class="btn btn-primary" id="bookNow" ${kos.kamarTersedia < 1 ? "disabled" : ""}>Booking sekarang</button>
        <button class="btn btn-outline" id="closeDetail">Tutup</button>
      </div>
    `);
    document.querySelector("#closeDetail").addEventListener("click", closeModal);
    document.querySelector("#bookNow")?.addEventListener("click", () => showBookingForm(kos));
  } catch (error) { toast(error.message); }
}

function showBookingForm(kos) {
  openModal(`
    <div class="eyebrow">PEMESANAN KAMAR</div><h2 id="modalTitle">Booking ${escapeHtml(kos.nama)}</h2>
    <p>Lengkapi informasi berikut untuk membuat pemesanan.</p>
    <form id="bookingForm">
      <div class="form-field"><label>Nama pemesan</label><input name="namaPemesan" required placeholder="Masukkan nama lengkap"></div>
      <div class="form-field"><label>Durasi sewa (bulan)</label><input name="durasiBulan" type="number" min="1" value="1" required></div>
      <p>Harga per bulan: <b>${rupiah(kos.hargaPerBulan)}</b></p>
      <div class="modal-actions"><button class="btn btn-primary" type="submit">Buat booking</button><button class="btn btn-outline" type="button" id="cancelBooking">Batal</button></div>
    </form>
  `);
  document.querySelector("#cancelBooking").addEventListener("click", () => showDetail(kos.id));
  document.querySelector("#bookingForm").addEventListener("submit", async event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      const booking = await api.addBooking({
        kosId: kos.id,
        namaPemesan: form.get("namaPemesan"),
        durasiBulan: Number(form.get("durasiBulan"))
      });
      showPaymentForm(booking);
      await loadKos();
    } catch (error) { toast(error.message); }
  });
}

function showPaymentForm(booking) {
  openModal(`
    <div class="eyebrow">BOOKING BERHASIL DIBUAT</div><h2 id="modalTitle">Lanjutkan pembayaran</h2>
    <p>Booking #${booking.id} · ${escapeHtml(booking.namaKos)}</p>
    <div class="stat-box"><small>Total pembayaran simulasi</small><strong>${rupiah(booking.totalHarga)}</strong></div>
    <form id="paymentForm">
      <div class="form-field"><label>Metode pembayaran</label><select name="metode"><option>QRIS (simulasi)</option><option>Transfer bank (simulasi)</option><option>E-wallet (simulasi)</option></select></div>
      <div class="modal-actions"><button class="btn btn-primary" type="submit">Konfirmasi pembayaran</button></div>
    </form>
    <p class="api-note">Ini merupakan simulasi pencatatan pembayaran untuk kebutuhan demonstrasi, bukan transaksi uang sungguhan.</p>
  `);
  document.querySelector("#paymentForm").addEventListener("submit", async event => {
    event.preventDefault();
    const metode = new FormData(event.currentTarget).get("metode");
    try {
      await api.addPayment({ bookingId: booking.id, metode });
      openModal(`<div class="step-icon">✓</div><h2 id="modalTitle">Pembayaran tercatat!</h2><p>Transaksi booking #${booking.id} berhasil dicatat sebagai simulasi.</p><button class="btn btn-primary" id="finishPayment">Selesai</button>`);
      document.querySelector("#finishPayment").addEventListener("click", closeModal);
      toast("Pembayaran simulasi berhasil.");
    } catch (error) { toast(error.message); }
  });
}

async function openOwnerDashboard() {
  try {
    const [kosResult, bookingResult, paymentResult] = await Promise.all([
      api.getKos(), api.getBooking(), api.getPayments()
    ]);
    const kos = kosResult.kos, bookings = bookingResult.booking, payments = paymentResult.pembayaran;
    openModal(`
      <div class="eyebrow">AREA PENGELOLAAN</div><h2 id="modalTitle">Dashboard Pemilik Kos</h2>
      <p>Ringkasan data kos dan aktivitas pemesanan pada aplikasi.</p>
      <div class="dashboard-stats">
        <div class="stat-box"><small>Total kos</small><strong>${kos.length}</strong></div>
        <div class="stat-box"><small>Booking</small><strong>${bookings.length}</strong></div>
        <div class="stat-box"><small>Pembayaran</small><strong>${payments.length}</strong></div>
      </div>
      <div class="modal-actions"><button class="btn btn-primary" id="addKosButton">+ Tambah kos</button></div>
      <div class="owner-list" style="margin-top:15px">
        ${kos.map(k => `<div class="owner-row"><div><strong>${escapeHtml(k.nama)}</strong><small>${escapeHtml(k.lokasi)} · ${rupiah(k.hargaPerBulan)}/bulan</small></div><div class="row-actions"><button class="mini-btn" data-edit="${k.id}">Edit</button><button class="mini-btn danger" data-delete="${k.id}">Hapus</button></div></div>`).join("")}
      </div>
      <p class="api-note">Dashboard demonstrasi ini belum memakai autentikasi/login pemilik.</p>
    `);
    document.querySelector("#addKosButton").addEventListener("click", () => showKosForm());
    document.querySelectorAll("[data-edit]").forEach(b => b.addEventListener("click", () => showKosForm(kos.find(k => k.id === Number(b.dataset.edit)))));
    document.querySelectorAll("[data-delete]").forEach(b => b.addEventListener("click", async () => {
      if (!confirm("Yakin ingin menghapus data kos ini?")) return;
      try { await api.deleteKos(Number(b.dataset.delete)); toast("Data kos dihapus."); openOwnerDashboard(); await loadKos(); }
      catch (error) { toast(error.message); }
    }));
  } catch (error) { toast(error.message); }
}

function showKosForm(kos = null) {
  const editing = Boolean(kos);
  openModal(`
    <div class="eyebrow">DATA PROPERTI</div><h2 id="modalTitle">${editing ? "Ubah informasi kos" : "Tambah kos baru"}</h2>
    <form id="kosForm">
      <div class="form-grid">
        <div class="form-field"><label>Nama kos</label><input name="nama" required value="${escapeHtml(kos?.nama || "")}"></div>
        <div class="form-field"><label>Nama pemilik</label><input name="pemilik" required value="${escapeHtml(kos?.pemilik || "")}"></div>
        <div class="form-field full"><label>Lokasi</label><input name="lokasi" required value="${escapeHtml(kos?.lokasi || "")}" placeholder="Kecamatan, Kota"></div>
        <div class="form-field"><label>Harga per bulan (Rp)</label><input name="hargaPerBulan" type="number" min="1" required value="${kos?.hargaPerBulan || ""}"></div>
        <div class="form-field"><label>Kamar tersedia</label><input name="kamarTersedia" type="number" min="0" required value="${kos?.kamarTersedia ?? 1}"></div>
        <div class="form-field"><label>Jenis kos</label><select name="jenis"><option ${kos?.jenis === "Putra" ? "selected" : ""}>Putra</option><option ${kos?.jenis === "Putri" ? "selected" : ""}>Putri</option><option ${kos?.jenis === "Campur" ? "selected" : ""}>Campur</option></select></div>
        <div class="form-field"><label>Fasilitas (pisahkan koma)</label><input name="fasilitas" value="${escapeHtml((kos?.fasilitas || []).join(", "))}" placeholder="WiFi, Kasur, Lemari"></div>
        <div class="form-field full"><label>Deskripsi</label><textarea name="deskripsi">${escapeHtml(kos?.deskripsi || "")}</textarea></div>
        <div class="form-field full"><label>URL foto (opsional)</label><input name="gambar" value="${escapeHtml(kos?.gambar || "")}" placeholder="https://..."></div>
      </div>
      <div class="modal-actions"><button class="btn btn-primary" type="submit">${editing ? "Simpan perubahan" : "Tambah kos"}</button><button class="btn btn-outline" type="button" id="cancelKosForm">Batal</button></div>
    </form>
  `);
  document.querySelector("#cancelKosForm").addEventListener("click", openOwnerDashboard);
  document.querySelector("#kosForm").addEventListener("submit", async event => {
    event.preventDefault();
    const f = new FormData(event.currentTarget);
    const data = {
      nama: f.get("nama"), pemilik: f.get("pemilik"), lokasi: f.get("lokasi"),
      hargaPerBulan: Number(f.get("hargaPerBulan")), kamarTersedia: Number(f.get("kamarTersedia")),
      jenis: f.get("jenis"), fasilitas: String(f.get("fasilitas")).split(",").map(x => x.trim()).filter(Boolean),
      deskripsi: f.get("deskripsi"), gambar: f.get("gambar")
    };
    try {
      if (editing) await api.updateKos(kos.id, data); else await api.addKos(data);
      toast(editing ? "Data kos berhasil diperbarui." : "Kos berhasil ditambahkan.");
      await loadKos(); openOwnerDashboard();
    } catch (error) { toast(error.message); }
  });
}

document.querySelector("#searchButton").addEventListener("click", async () => {
  const lokasi = document.querySelector("#searchLocation").value.trim();
  const maksHarga = document.querySelector("#maxPrice").value;
  const params = {};
  if (lokasi) params.lokasi = lokasi;
  if (maksHarga) params.maksHarga = maksHarga;
  if (currentType) params.jenis = currentType;
  await loadKos(params);
  document.querySelector("#daftar-kos").scrollIntoView({ behavior: "smooth" });
});
document.querySelector("#resetSearch").addEventListener("click", () => {
  document.querySelector("#searchLocation").value = "";
  document.querySelector("#maxPrice").value = "";
  currentType = "";
  document.querySelectorAll(".filter-pill").forEach(b => b.classList.toggle("active", !b.dataset.type));
  loadKos();
});
document.querySelectorAll(".filter-pill").forEach(button => button.addEventListener("click", async () => {
  currentType = button.dataset.type;
  document.querySelectorAll(".filter-pill").forEach(b => b.classList.toggle("active", b === button));
  const params = {};
  const lokasi = document.querySelector("#searchLocation").value.trim();
  const max = document.querySelector("#maxPrice").value;
  if (lokasi) params.lokasi = lokasi;
  if (max) params.maksHarga = max;
  if (currentType) params.jenis = currentType;
  await loadKos(params);
}));
document.querySelector("#ownerNav").addEventListener("click", openOwnerDashboard);
document.querySelector("#ownerBanner").addEventListener("click", openOwnerDashboard);

loadKos();
