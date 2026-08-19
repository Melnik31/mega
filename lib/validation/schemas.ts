import { z } from "zod";

export const signUpCoachSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  teamName: z.string().trim().min(1, "Team name is required"),
});

export const signUpGoalieSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required"),
  email: z.email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  inviteCode: z
    .string()
    .trim()
    .min(1, "Invite code is required")
    .transform((v) => v.toUpperCase()),
});

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

const score = z.coerce.number().int().min(1).max(10);

export const seasonGoalSchema = z.object({
  // Part 1: self-rating
  trackingScore: score,
  skatingScore: score,
  edgeControlScore: score,
  movementControlScore: score,
  positioningScore: score,
  reboundControlScore: score,
  handsScore: score,
  stickScore: score,
  readsScore: score,
  recoveryScore: score,
  competeScore: score,
  confidenceScore: score,
  hockeyIqScore: score,

  // Part 2: reflection
  holdingBack1: z.string().trim().min(1, "This field is required"),
  holdingBack2: z.string().trim().optional(),
  holdingBack3: z.string().trim().optional(),
  strength1: z.string().trim().min(1, "This field is required"),
  strength2: z.string().trim().optional(),
  strength3: z.string().trim().optional(),

  // Part 3: MY YEAR
  becomeStatement: z.string().trim().min(1, "This field is required"),
  biggestGoal: z.string().trim().min(1, "This field is required"),
  seasonTarget: z.string().trim().min(1, "This field is required"),
  priority1: z.string().trim().min(1, "At least one priority is required"),
  priority2: z.string().trim().optional(),
  priority3: z.string().trim().optional(),
  prioritiesReason: z.string().trim().optional(),
});

export const FOCUS_AREAS = [
  "tracking",
  "skating",
  "movement",
  "positioning",
  "rebound_control",
  "hands",
  "stick",
  "reads",
  "recovery",
  "compete",
  "mental_game",
  "other",
] as const;

export const FOCUS_AREA_LABELS: Record<(typeof FOCUS_AREAS)[number], string> = {
  tracking: "Tracking",
  skating: "Skating",
  movement: "Movement",
  positioning: "Positioning",
  rebound_control: "Rebound control",
  hands: "Hands",
  stick: "Stick",
  reads: "Reads",
  recovery: "Recovery",
  compete: "Compete",
  mental_game: "Mental game",
  other: "Other",
};

export const preCheckinSchema = z.object({
  energy: score,
  confidence: score,
  focus: score,
  body: score,
  mentalReadiness: score,
  focusArea: z.enum(FOCUS_AREAS),
  oneThing: z.string().trim().min(1, "This field is required"),
});

export const POST_CHECKIN_GROUPS = [
  {
    title: "Technical",
    fields: [
      { name: "tracking", label: "Tracking" },
      { name: "skatingEdges", label: "Skating / edges" },
      { name: "movementControl", label: "Movement / control" },
      { name: "positioning", label: "Positioning" },
      { name: "reboundControl", label: "Rebound control" },
      { name: "hands", label: "Hands" },
      { name: "stick", label: "Stick" },
    ],
  },
  {
    title: "Mental",
    fields: [
      { name: "focus", label: "Focus" },
      { name: "confidence", label: "Confidence" },
      { name: "compete", label: "Compete" },
    ],
  },
  {
    title: "IQ",
    fields: [
      { name: "reads", label: "Reads / recognition" },
      { name: "decisionMaking", label: "Decision making" },
    ],
  },
] as const;

export const postCheckinSchema = z.object({
  tracking: score,
  skatingEdges: score,
  movementControl: score,
  positioning: score,
  reboundControl: score,
  hands: score,
  stick: score,
  focus: score,
  confidence: score,
  compete: score,
  reads: score,
  decisionMaking: score,
  focusHit: z.enum(["true", "false"]).transform((v) => v === "true"),
  note: z.string().trim().optional(),
});

export const RATING_CATEGORIES = [
  "tracking",
  "skating_edges",
  "movement_control",
  "positioning",
  "rebound_control",
  "hands",
  "stick",
  "focus",
  "confidence",
  "compete",
  "reads",
  "decision_making",
] as const;

export const RATING_CATEGORY_LABELS: Record<(typeof RATING_CATEGORIES)[number], string> = {
  tracking: "Tracking",
  skating_edges: "Skating / edges",
  movement_control: "Movement / control",
  positioning: "Positioning",
  rebound_control: "Rebound control",
  hands: "Hands",
  stick: "Stick",
  focus: "Focus",
  confidence: "Confidence",
  compete: "Compete",
  reads: "Reads / recognition",
  decision_making: "Decision making",
};
