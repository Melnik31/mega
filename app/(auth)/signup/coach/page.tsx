import { SignUpCoachForm } from "@/components/forms/SignUpCoachForm";

export default function SignUpCoachPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl">Start a team</h2>
        <p className="text-sm text-black/50">
          You&apos;ll get an invite code to share with your goalies.
        </p>
      </div>
      <SignUpCoachForm />
    </div>
  );
}
