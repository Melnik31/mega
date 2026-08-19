import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-center text-sm text-black/60">How are you joining?</p>
      <Link
        href="/signup/coach"
        className="border border-black/15 p-4 text-center hover:border-brand"
      >
        <span className="block font-medium text-black">I&apos;m a Coach</span>
        <span className="block text-sm text-black/50">Start a team</span>
      </Link>
      <Link
        href="/signup/goalie"
        className="border border-black/15 p-4 text-center hover:border-brand"
      >
        <span className="block font-medium text-black">I&apos;m a Goalie</span>
        <span className="block text-sm text-black/50">Join a team with an invite code</span>
      </Link>
      <p className="text-center text-sm text-black/50">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
