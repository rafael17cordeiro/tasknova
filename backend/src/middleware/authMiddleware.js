import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // O cabeçalho tem de ter o formato: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized: token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // disponibiliza o id às rotas seguintes
    next(); // deixa o pedido continuar
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Not authorized: invalid or expired token" });
  }
};
