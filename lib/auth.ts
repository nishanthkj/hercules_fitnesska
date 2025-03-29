// lib/auth.ts
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export interface DecodedToken {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const getUserFromToken = async (): Promise<DecodedToken | null> => {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    return decoded;
  } catch  {
    return null;
  }
};

export const generateToken = (user: DecodedToken) => {
  return jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: "7d" });
};
