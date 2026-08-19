import { SignUpCoachForm } from "@/components/forms/SignUpCoachForm";

export default function SignUpCoachPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-lg font-medium text-zinc-900">Start a team</h2>
        <p className="text-sm text-zinc-500">
          You&apos;ll get an invite code to share with your goalies.
        </p>
      </div>
      <SignUpCoachForm />
    </div>
  );
}
