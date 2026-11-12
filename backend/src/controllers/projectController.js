import pool from "../config/db.js";

export const getProjects = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, created_at FROM projects WHERE user_id = $1 ORDER BY created_at ASC",
      [req.userId],
    );
    res.status(200).json({ projects: result.rows });
  } catch (error) {
    console.error("GetProjects error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "Project name is required" });
    }
    if (name.trim().length > 100) {
      return res
        .status(400)
        .json({ message: "Project name must have at most 100 characters" });
    }

    const result = await pool.query(
      "INSERT INTO projects (user_id, name) VALUES ($1, $2) RETURNING id, name, created_at",
      [req.userId, name.trim()],
    );
    res.status(201).json({ project: result.rows[0] });
  } catch (error) {
    console.error("CreateProject error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    if (Number.isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }

    // O filtro por user_id garante que só se apaga um projeto próprio
    const result = await pool.query(
      "DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id",
      [projectId, req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted" });
  } catch (error) {
    console.error("DeleteProject error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
