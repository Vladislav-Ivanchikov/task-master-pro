import bcrypt from "bcrypt";
import { prisma } from "../prisma/client";

type RegisterImput = {
  email: string;
  password: string;
  name?: string;
  surname?: string;
  role: string;
};

export const registerUser = async ({
  email,
  password,
  name,
  surname,
  role,
}: RegisterImput) => {
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
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
  };
};
