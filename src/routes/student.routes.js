import express from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from "../controllers/student.controller.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", createStudent);
router.get("/", getStudents);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
