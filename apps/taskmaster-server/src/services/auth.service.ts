import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

type RegisterInput = {
  email: string;
  password: string;
  name?: string;
  surname?: string;
  role: "USER" | "ADMIN";
};

type LoginInput = {
  email: string;
  password: string;
};

export const registerUser = async ({
  email,
  password,
  name = "",
  surname = "",
  role,
}: RegisterInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      surname,
      role,
    },
  });

  return {
    email: user.email,
    createdAt: user.createdAt,
  };
};

export const loginUser = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRATION,
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      surname: user.surname,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

export const profileUser = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        surname: true,
        role: true,
        createdAt: true,
        avatarUrl: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Could not fetch user profile");
  }
};
