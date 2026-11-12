import pool from "../config/db.js";

const VALID_STATUSES = ["backlog", "todo", "in_progress", "done"];
const VALID_PRIORITIES = ["low", "medium", "high"];

// Confirma que o projeto existe e pertence ao utilizador
const projectBelongsToUser = async (projectId, userId) => {
  const result = await pool.query(
    "SELECT id FROM projects WHERE id = $1 AND user_id = $2",
    [projectId, userId],
  );
  return result.rows.length > 0;
};

export const getTasks = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    if (Number.isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }
    if (!(await projectBelongsToUser(projectId, req.userId))) {
      return res.status(404).json({ message: "Project not found" });
    }

    const { status, priority, search } = req.query;

    if (status && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status filter" });
    }
    if (priority && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority filter" });
    }

    // Constrói a consulta dinamicamente, mas sempre com parâmetros ($1, $2...)
    let query = `SELECT id, project_id, title, description, status, priority, deadline, created_at
                 FROM tasks WHERE project_id = $1`;
    const params = [projectId];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (priority) {
      params.push(priority);
      query += ` AND priority = $${params.length}`;
    }
    if (search && search.trim()) {
      params.push(`%${search.trim()}%`);
      query += ` AND title ILIKE $${params.length}`;
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, params);
    res.status(200).json({ tasks: result.rows });
  } catch (error) {
    console.error("GetTasks error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTask = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId, 10);
    if (Number.isNaN(projectId)) {
      return res.status(400).json({ message: "Invalid project id" });
    }
    if (!(await projectBelongsToUser(projectId, req.userId))) {
      return res.status(404).json({ message: "Project not found" });
    }

    const {
      title,
      description,
      status = "todo",
      priority = "medium",
      deadline,
    } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({ message: "Task title is required" });
    }
    if (title.trim().length > 150) {
      return res
        .status(400)
        .json({ message: "Task title must have at most 150 characters" });
    }
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    const result = await pool.query(
      `INSERT INTO tasks (project_id, title, description, status, priority, deadline)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, project_id, title, description, status, priority, deadline, created_at`,
      [
        projectId,
        title.trim(),
        description || null,
        status,
        priority,
        deadline || null,
      ],
    );
    res.status(201).json({ task: result.rows[0] });
  } catch (error) {
    // 22007/22008: formato de data inválido no PostgreSQL
    if (error.code === "22007" || error.code === "22008") {
      return res.status(400).json({ message: "Invalid deadline date" });
    }
    console.error("CreateTask error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (Number.isNaN(taskId)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const { title, description, status, priority, deadline } = req.body;

    if (
      title !== undefined &&
      (title.trim().length === 0 || title.trim().length > 150)
    ) {
      return res
        .status(400)
        .json({ message: "Task title must have between 1 and 150 characters" });
    }
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({ message: "Invalid priority" });
    }

    // COALESCE mantém o valor atual quando o campo não é enviado.
    // O JOIN com projects garante que a tarefa pertence ao utilizador.
    const result = await pool.query(
      `UPDATE tasks t
       SET title = COALESCE($1, t.title),
           description = COALESCE($2, t.description),
           status = COALESCE($3, t.status),
           priority = COALESCE($4, t.priority),
           deadline = COALESCE($5, t.deadline)
       FROM projects p
       WHERE t.id = $6 AND t.project_id = p.id AND p.user_id = $7
       RETURNING t.id, t.project_id, t.title, t.description, t.status, t.priority, t.deadline, t.created_at`,
      [
        title !== undefined ? title.trim() : null,
        description !== undefined ? description : null,
        status ?? null,
        priority ?? null,
        deadline ?? null,
        taskId,
        req.userId,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task: result.rows[0] });
  } catch (error) {
    if (error.code === "22007" || error.code === "22008") {
      return res.status(400).json({ message: "Invalid deadline date" });
    }
    console.error("UpdateTask error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id, 10);
    if (Number.isNaN(taskId)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const result = await pool.query(
      `DELETE FROM tasks t
       USING projects p
       WHERE t.id = $1 AND t.project_id = p.id AND p.user_id = $2
       RETURNING t.id`,
      [taskId, req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    console.error("DeleteTask error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
