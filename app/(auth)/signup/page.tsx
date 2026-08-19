import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm text-zinc-600">How are you joining?</p>
      <Link
        href="/signup/coach"
        className="rounded-md border border-zinc-300 p-4 text-center hover:border-zinc-500"
      >
        <span className="block font-medium text-zinc-900">I&apos;m a Coach</span>
        <span className="block text-sm text-zinc-500">Start a team</span>
      </Link>
      <Link
        href="/signup/goalie"
        className="rounded-md border border-zinc-300 p-4 text-center hover:border-zinc-500"
      >
        <span className="block font-medium text-zinc-900">I&apos;m a Goalie</span>
        <span className="block text-sm text-zinc-500">Join a team with an invite code</span>
      </Link>
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-zinc-900 underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
