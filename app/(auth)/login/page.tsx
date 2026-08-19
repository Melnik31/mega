import Link from "next/link";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl">Log in</h2>
      <LoginForm />
      <p className="text-center text-sm text-black/50">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-brand hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
