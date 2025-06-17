import { prisma } from "../prisma/client";

export const searchUsersService = async (query: string) => {
  const users = await prisma.user.findMany({
    where: {
      role: "USER",
      OR: [
        { email: { contains: query, mode: "insensitive" } },
        { name: { contains: query, mode: "insensitive" } },
        { surname: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      surname: true,
    },
    take: 10, // ограничим до 10 результатов
  });

  return users;
};
