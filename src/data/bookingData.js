export const dataBooking = [];
export let nextBookingId = 1;
export function ambilBookingBerikutnya() {
  const id = nextBookingId;
  nextBookingId += 1;
  return id;
}
