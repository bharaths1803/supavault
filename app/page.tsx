import Link from "next/link";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
  return <div className="hidden">Hi</div>;
}
