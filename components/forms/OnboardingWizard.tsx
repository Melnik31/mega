"use client";

import { useActionState, useEffect, useState } from "react";
import { upsertSeasonGoal } from "@/lib/actions/goals";
import type { ActionState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Field } from "@/components/ui/Field";
import { ScoreSlider } from "@/components/ui/ScoreSlider";

const initialState: ActionState = {};

const SKILLS = [
  { name: "trackingScore", label: "Tracking" },
  { name: "skatingScore", label: "Skating" },
  { name: "edgeControlScore", label: "Edge control" },
  { name: "movementControlScore", label: "Movement/control" },
  { name: "positioningScore", label: "Positioning" },
  { name: "reboundControlScore", label: "Rebound control" },
  { name: "handsScore", label: "Hands" },
  { name: "stickScore", label: "Stick" },
  { name: "readsScore", label: "Reads" },
  { name: "recoveryScore", label: "Recovery" },
  { name: "competeScore", label: "Compete" },
  { name: "confidenceScore", label: "Confidence" },
  { name: "hockeyIqScore", label: "Hockey IQ" },
] as const;

const FIELD_STEP: Record<string, number> = Object.fromEntries(
  SKILLS.map((s) => [s.name, 0]),
);
Object.assign(FIELD_STEP, {
  holdingBack1: 1,
  holdingBack2: 1,
  holdingBack3: 1,
  strength1: 1,
  strength2: 1,
  strength3: 1,
  becomeStatement: 2,
  biggestGoal: 2,
  seasonTarget: 2,
  priority1: 2,
  priority2: 2,
  priority3: 2,
  prioritiesReason: 2,
});

const STEPS = ["Self-Rating", "Reflection", "My Year"];

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="mb-6 flex items-center">
      {STEPS.map((label, i) => (
        <div key={label} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                i === step
                  ? "bg-zinc-900 text-white"
                  : i < step
                    ? "bg-zinc-200 text-zinc-700"
                    : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs ${i === step ? "font-medium text-zinc-900" : "text-zinc-400"}`}
            >
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`mx-2 h-px flex-1 ${i < step ? "bg-zinc-300" : "bg-zinc-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export function OnboardingWizard({
  defaultValues,
}: {
  defaultValues?: {
    trackingScore: number;
    skatingScore: number;
    edgeControlScore: number;
    movementControlScore: number;
    positioningScore: number;
    reboundControlScore: number;
    handsScore: number;
    stickScore: number;
    readsScore: number;
    recoveryScore: number;
    competeScore: number;
    confidenceScore: number;
    hockeyIqScore: number;
    holdingBack: string[];
    strengths: string[];
    becomeStatement: string;
    biggestGoal: string;
    seasonTarget: string;
    priorities: string[];
    prioritiesReason: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(upsertSeasonGoal, initialState);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const errorFields = Object.keys(state.fieldErrors ?? {});
    if (errorFields.length === 0) return;
    setStep(Math.min(...errorFields.map((f) => FIELD_STEP[f] ?? 0)));
  }, [state.fieldErrors]);

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <StepIndicator step={step} />

      <div className={step === 0 ? "flex flex-col gap-4" : "hidden"}>
        <p className="text-sm text-zinc-600">Rate yourself 1–10 in each area.</p>
        {SKILLS.map(({ name, label }) => (
          <ScoreSlider
            key={name}
            name={name}
            label={label}
            defaultValue={defaultValues?.[name]}
          />
        ))}
        <Button type="button" onClick={() => setStep(1)} className="w-full">
          Next
        </Button>
      </div>

      <div className={step === 1 ? "flex flex-col gap-6" : "hidden"}>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-zinc-700">
            What are the 3 things you believe are holding your game back?
          </p>
          <Field label="1" htmlFor="holdingBack1" error={state.fieldErrors?.holdingBack1?.[0]}>
            <Input
              id="holdingBack1"
              name="holdingBack1"
              defaultValue={defaultValues?.holdingBack[0]}
            />
          </Field>
          <Field label="2 (optional)" htmlFor="holdingBack2">
            <Input
              id="holdingBack2"
              name="holdingBack2"
              defaultValue={defaultValues?.holdingBack[1]}
            />
          </Field>
          <Field label="3 (optional)" htmlFor="holdingBack3">
            <Input
              id="holdingBack3"
              name="holdingBack3"
              defaultValue={defaultValues?.holdingBack[2]}
            />
          </Field>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-zinc-700">
            What are the 3 things you believe are your biggest strengths?
          </p>
          <Field label="1" htmlFor="strength1" error={state.fieldErrors?.strength1?.[0]}>
            <Input id="strength1" name="strength1" defaultValue={defaultValues?.strengths[0]} />
          </Field>
          <Field label="2 (optional)" htmlFor="strength2">
            <Input id="strength2" name="strength2" defaultValue={defaultValues?.strengths[1]} />
          </Field>
          <Field label="3 (optional)" htmlFor="strength3">
            <Input id="strength3" name="strength3" defaultValue={defaultValues?.strengths[2]} />
          </Field>
        </div>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => setStep(0)}
            variant="secondary"
            className="w-full"
          >
            Back
          </Button>
          <Button type="button" onClick={() => setStep(2)} className="w-full">
            Next
          </Button>
        </div>
      </div>

      <div className={step === 2 ? "flex flex-col gap-6" : "hidden"}>
        <p className="text-sm font-semibold text-zinc-900">MY YEAR</p>

        <Field
          label="This year I want to become:"
          htmlFor="becomeStatement"
          error={state.fieldErrors?.becomeStatement?.[0]}
        >
          <Textarea
            id="becomeStatement"
            name="becomeStatement"
            rows={2}
            defaultValue={defaultValues?.becomeStatement}
          />
        </Field>

        <Field
          label="My biggest hockey goal is:"
          htmlFor="biggestGoal"
          error={state.fieldErrors?.biggestGoal?.[0]}
        >
          <Textarea
            id="biggestGoal"
            name="biggestGoal"
            rows={2}
            defaultValue={defaultValues?.biggestGoal}
          />
        </Field>

        <Field
          label="By the end of the season, I want to be able to:"
          htmlFor="seasonTarget"
          error={state.fieldErrors?.seasonTarget?.[0]}
        >
          <Textarea
            id="seasonTarget"
            name="seasonTarget"
            rows={2}
            defaultValue={defaultValues?.seasonTarget}
          />
        </Field>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-zinc-700">My Top 3 Development Priorities</p>
          <Field label="1" htmlFor="priority1" error={state.fieldErrors?.priority1?.[0]}>
            <Input id="priority1" name="priority1" defaultValue={defaultValues?.priorities[0]} />
          </Field>
          <Field label="2 (optional)" htmlFor="priority2">
            <Input id="priority2" name="priority2" defaultValue={defaultValues?.priorities[1]} />
          </Field>
          <Field label="3 (optional)" htmlFor="priority3">
            <Input id="priority3" name="priority3" defaultValue={defaultValues?.priorities[2]} />
          </Field>
        </div>

        <Field label="Why are these important to you? (optional)" htmlFor="prioritiesReason">
          <Textarea
            id="prioritiesReason"
            name="prioritiesReason"
            rows={2}
            defaultValue={defaultValues?.prioritiesReason ?? undefined}
          />
        </Field>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={() => setStep(1)}
            variant="secondary"
            className="w-full"
          >
            Back
          </Button>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
