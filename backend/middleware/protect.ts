import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export function protect(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    req.userId = decoded.id;

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
