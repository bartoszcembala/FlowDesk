import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export function signToken(id: string) {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  const token = jwt.sign({ id }, JWT_SECRET, {
    expiresIn: (process.env.JWT_EXPIRES_IN ??
      "7d") as jwt.SignOptions["expiresIn"],
  });

  return token;
}

function sendToken(res: Response, token: string) {
  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: 90 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
}

export async function signup(req: Request, res: Response, next: any) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const newUser = await prisma.user.create({
      data: {
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
      },
    });

    const token = signToken(newUser.id);

    sendToken(res, token);

    const { password, ...safeUser } = newUser;

    res.status(201).json({
      success: true,
      data: {
        user: safeUser,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export async function login(req: Request, res: Response, next: any) {
  try {
    const { email, password: inputPassword } = req.body;

    if (!email || !inputPassword) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        username: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      inputPassword,
      user.password,
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = signToken(user.id);

    sendToken(res, token);

    const { password, ...safeUser } = user;

    res.status(200).json({
      success: true,
      data: {
        user: safeUser,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}

export function logout(req: Request, res: Response) {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
}
