const API_BASE = "/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options
  });
  const result = await response.json();
  if (!response.ok || result.success === false) {
    throw new Error(result.message || "Permintaan gagal.");
  }
  return result.data;
}

export const api = {
  getKos: () => request("/kos"),
  searchKos: params => request(`/kos/search?${new URLSearchParams(params)}`),
  getKosById: id => request(`/kos/${id}`),
  addKos: data => request("/kos", { method: "POST", body: JSON.stringify(data) }),
  updateKos: (id, data) => request(`/kos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteKos: id => request(`/kos/${id}`, { method: "DELETE" }),
  getBooking: () => request("/booking"),
  addBooking: data => request("/booking", { method: "POST", body: JSON.stringify(data) }),
  getPayments: () => request("/pembayaran"),
  addPayment: data => request("/pembayaran", { method: "POST", body: JSON.stringify(data) })
};
