import { Router } from "express";
import { tampilkanPembayaran, tambahPembayaran } from "../controllers/pembayaranController.js";
const router = Router();
router.get("/", tampilkanPembayaran);
router.post("/", tambahPembayaran);
export default router;
