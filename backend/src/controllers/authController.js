import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

// Gera um token JWT com o id do utilizador
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Validação simples de formato de email
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validar os dados recebidos
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }
    if (name.trim().length < 2 || name.trim().length > 100) {
      return res
        .status(400)
        .json({ message: "Name must have between 2 and 100 characters" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must have at least 6 characters" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 2. Verificar se o email já existe
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      normalizedEmail,
    ]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Fazer o hash da palavra-passe (10 = custo computacional)
    const passwordHash = await bcrypt.hash(password, 10);

    // 4. Guardar o utilizador (consulta parametrizada: previne SQL injection)
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name.trim(), normalizedEmail, passwordHash],
    );

    const user = result.rows[0];
    res.status(201).json({ user, token: generateToken(user.id) });
  } catch (error) {
    console.error("Register error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = $1",
      [normalizedEmail],
    );

    // Mensagem genérica: não revela se foi o email ou a palavra-passe que falhou
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email },
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Devolve os dados do utilizador autenticado
export const getMe = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE id = $1",
      [req.userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    console.error("GetMe error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
