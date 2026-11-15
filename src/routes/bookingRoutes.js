import { Router } from "express";
import { tampilkanBooking, tambahBooking } from "../controllers/bookingController.js";
const router = Router();
router.get("/", tampilkanBooking);
router.post("/", tambahBooking);
export default router;
