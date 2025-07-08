import { authOptions } from "@/utils/auth";
import NextAuth from "next-auth";

async function handler(req, res) {
  try {
    return await NextAuth(req, res, authOptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error in NextAuth" });
  }
}

export { handler as GET, handler as POST };
