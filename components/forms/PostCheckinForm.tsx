"use client";

import { useActionState } from "react";
import { submitPostCheckin } from "@/lib/actions/checkins";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { ScoreSlider } from "@/components/ui/ScoreSlider";
import { RadioPillGroup } from "@/components/ui/RadioPillGroup";
import { POST_CHECKIN_GROUPS } from "@/lib/validation/schemas";

const initialState: ActionState = {};

export function PostCheckinForm({ sessionId, oneThing }: { sessionId: string; oneThing: string }) {
  const action = submitPostCheckin.bind(null, sessionId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {POST_CHECKIN_GROUPS.map((group) => (
        <div key={group.title} className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand">
            {group.title}
          </p>
          {group.fields.map(({ name, label }) => (
            <ScoreSlider key={name} name={name} label={label} />
          ))}
        </div>
      ))}

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-black">
          Did you hit your one thing? &ldquo;{oneThing}&rdquo;
        </p>
        <RadioPillGroup
          name="focusHit"
          options={[
            { value: "true", label: "Yes" },
            { value: "false", label: "No" },
          ]}
        />
        {state.fieldErrors?.focusHit && (
          <p className="text-sm text-red-600">{state.fieldErrors.focusHit[0]}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="note" className="text-sm font-medium text-black/70">
          Anything else? (optional)
        </label>
        <Textarea id="note" name="note" rows={2} />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Saving..." : "Save"}
      </Button>
    </form>
  );
}
