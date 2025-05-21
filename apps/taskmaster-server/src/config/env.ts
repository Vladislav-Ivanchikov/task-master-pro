import dotenv from "dotenv";
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

if (!process.env.JWT_EXPIRATION) {
  throw new Error(
    "JWT_EXPIRATION is not defined in the environment variables."
  );
}

export const env = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRATION: process.env.JWT_EXPIRATION as `${number}${
    | "s"
    | "m"
    | "h"
    | "d"}`,
};
