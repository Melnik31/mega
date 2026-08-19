import { SignUpGoalieForm } from "@/components/forms/SignUpGoalieForm";

export default function SignUpGoaliePage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl">Join a team</h2>
        <p className="text-sm text-black/50">
          Ask your coach for the invite code.
        </p>
      </div>
      <SignUpGoalieForm />
    </div>
  );
}
