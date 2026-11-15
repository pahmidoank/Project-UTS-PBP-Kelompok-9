import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import kosRoutes from "./routes/kosRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import pembayaranRoutes from "./routes/pembayaranRoutes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.resolve(__dirname, "../public");

app.use(express.json());
app.use(express.static(publicPath));

app.get("/api", (req, res) => {
  res.json({
    message: "Selamat datang di REST API KosTerpadu",
    endpoints: {
      kos: "/api/kos",
      pencarian: "/api/kos/search?lokasi=Bandung",
      booking: "/api/booking",
      pembayaran: "/api/pembayaran"
    }
  });
});

app.use("/api/kos", kosRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/pembayaran", pembayaranRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "Endpoint API tidak ditemukan." });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(publicPath, "index.html"));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
});

export default app;
