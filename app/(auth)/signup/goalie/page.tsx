import { SignUpGoalieForm } from "@/components/forms/SignUpGoalieForm";

export default function SignUpGoaliePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-medium text-zinc-900">Join a team</h2>
        <p className="text-sm text-zinc-500">
          Ask your coach for the invite code.
        </p>
      </div>
      <SignUpGoalieForm />
    </div>
  );
}
