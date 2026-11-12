import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// Carrega as variáveis do ficheiro .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// Rota de teste para confirmar que o servidor está a funcionar
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "TaskNova API is running" });
});

// Rota que confirma também a ligação à base de dados
app.get("/api/health/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() AS now");
    res.status(200).json({ status: "ok", dbTime: result.rows[0].now });
  } catch (error) {
    console.error("Erro na ligação à base de dados:", error.message);
    res
      .status(500)
      .json({ status: "error", message: "Database connection failed" });
  }
});

app.listen(PORT, async () => {
  console.log(`Servidor a correr na porta ${PORT}`);
  try {
    await pool.query("SELECT 1");
    console.log("Ligação à base de dados estabelecida com sucesso");
  } catch (error) {
    console.error("Falha ao ligar à base de dados:", error.message);
  }
});
