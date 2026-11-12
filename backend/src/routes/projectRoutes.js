import express from "express";
import {
  getProjects,
  createProject,
  deleteProject,
} from "../controllers/projectController.js";
import { getTasks, createTask } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Todas as rotas deste ficheiro exigem autenticação
router.use(protect);

router.get("/", getProjects);
router.post("/", createProject);
router.delete("/:id", deleteProject);

// Tarefas de um projeto
router.get("/:projectId/tasks", getTasks);
router.post("/:projectId/tasks", createTask);

export default router;
