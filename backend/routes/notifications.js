import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import {
  getNotifications,
  createNotification,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", authMiddleware, getNotifications);
router.post("/", authMiddleware, createNotification);
router.post("/:id/read", authMiddleware, markAsRead);

export default router;
