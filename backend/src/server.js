import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Carrega as variáveis do ficheiro .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota de teste para confirmar que o servidor está a funcionar
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "TaskNova API is running" });
});

app.listen(PORT, () => {
  console.log(`Servidor a correr na porta ${PORT}`);
});
