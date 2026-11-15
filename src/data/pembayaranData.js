export const dataPembayaran = [];
export let nextPembayaranId = 1;
export function ambilPembayaranBerikutnya() {
  const id = nextPembayaranId;
  nextPembayaranId += 1;
  return id;
}
