"use client";

import { useActionState } from "react";
import { startPracticeSession } from "@/lib/actions/checkins";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { ScoreSlider } from "@/components/ui/ScoreSlider";
import { RadioPillGroup } from "@/components/ui/RadioPillGroup";
import { FOCUS_AREAS, FOCUS_AREA_LABELS } from "@/lib/validation/schemas";

const initialState: ActionState = {};

const FOCUS_AREA_OPTIONS = FOCUS_AREAS.map((value) => ({
  value,
  label: FOCUS_AREA_LABELS[value],
}));

export function PreCheckinForm() {
  const [state, formAction, pending] = useActionState(startPracticeSession, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium text-zinc-900">How are you feeling?</p>
        <ScoreSlider name="energy" label="Energy" />
        <ScoreSlider name="confidence" label="Confidence" />
        <ScoreSlider name="focus" label="Focus" />
        <ScoreSlider name="body" label="Body" />
        <ScoreSlider name="mentalReadiness" label="Mental readiness" />
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-zinc-900">
          What&apos;s your focus today? Choose one:
        </p>
        <RadioPillGroup name="focusArea" options={FOCUS_AREA_OPTIONS} />
        {state.fieldErrors?.focusArea && (
          <p className="text-sm text-red-600">{state.fieldErrors.focusArea[0]}</p>
        )}
      </div>

      <Field
        label="What is your ONE thing today?"
        htmlFor="oneThing"
        error={state.fieldErrors?.oneThing?.[0]}
      >
        <Input id="oneThing" name="oneThing" placeholder="e.g. Stay square on my angles" />
      </Field>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Checking in..." : "Check in"}
      </Button>
    </form>
  );
}
