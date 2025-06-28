import { cookies } from "next/headers";
import { verifyJwt } from "./auth";

export async function getDbUserId() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) throw new Error("Unauthorized");

    const payload = verifyJwt(token);
    if (!payload) throw new Error("Invalid token");

    return payload.userId;
  } catch (error) {
    console.log("Error in getting db user id", error);
    return "";
  }
}
