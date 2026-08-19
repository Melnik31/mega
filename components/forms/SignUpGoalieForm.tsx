"use client";

import { useActionState } from "react";
import { signUpGoalie, type ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";

const initialState: ActionState = {};

export function SignUpGoalieForm() {
  const [state, formAction, pending] = useActionState(signUpGoalie, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Full name" htmlFor="fullName" error={state.fieldErrors?.fullName?.[0]}>
        <Input id="fullName" name="fullName" autoComplete="name" required />
      </Field>
      <Field label="Email" htmlFor="email" error={state.fieldErrors?.email?.[0]}>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </Field>
      <Field label="Password" htmlFor="password" error={state.fieldErrors?.password?.[0]}>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
      </Field>
      <Field
        label="Invite code"
        htmlFor="inviteCode"
        error={state.fieldErrors?.inviteCode?.[0]}
      >
        <Input id="inviteCode" name="inviteCode" className="uppercase" required />
      </Field>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Joining team..." : "Join team"}
      </Button>
    </form>
  );
}
