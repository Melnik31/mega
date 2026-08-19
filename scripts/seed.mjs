// Local dev seed data: one coach + three goalies with distinct trend
// profiles (up / flat / down) across ~3 weeks of practice check-ins, so the
// /profile trend page has something meaningful to show right after
// `supabase db reset`.
//
// Run with: npm run seed
// (requires the local Supabase stack to be running: npm run db:start)

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";

const PASSWORD = "password123";

// index 0 = oldest, index 9 = most recent — applied to every 1-10 rating
// column (pre-ice + post-practice). first-half vs second-half average:
//   UP:    4.8 -> 7.4  (+54%)
//   FLAT:  6.4 -> 6.6  (+3%, under the 8% threshold)
//   DOWN:  7.4 -> 4.8  (-35%)
const TRENDS = {
  up: [4, 4, 5, 5, 6, 6, 7, 7, 8, 9],
  flat: [6, 7, 6, 7, 6, 7, 6, 7, 6, 7],
  down: [9, 8, 7, 7, 6, 6, 5, 5, 4, 4],
};

const FOCUS_AREAS = ["rebound_control", "tracking", "positioning", "compete", "reads"];
const SESSION_COUNT = 10;
const DAYS_BETWEEN = 2;

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function seedGoalie({ email, fullName, inviteCode, trend, seasonId, teamId }) {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: signUp, error: signUpErr } = await client.auth.signUp({
    email,
    password: PASSWORD,
    options: { data: { full_name: fullName, role: "goalie" } },
  });
  if (signUpErr) throw new Error(`signUp(${email}): ${signUpErr.message}`);

  const { error: joinErr } = await client.rpc("join_team_by_invite_code", {
    code: inviteCode,
  });
  if (joinErr) throw new Error(`join(${email}): ${joinErr.message}`);

  const scores = TRENDS[trend];
  const identity =
    trend === "up"
      ? "A calm, technically sharp goalie who controls rebounds."
      : trend === "down"
        ? "A goalie who battles for every save and never gives up on a puck."
        : "A steady, reliable presence in the crease every night.";

  const { error: goalErr } = await client.from("season_goals").upsert(
    {
      season_id: seasonId,
      goalie_id: signUp.user.id,
      tracking_score: scores[9],
      skating_score: scores[9],
      edge_control_score: scores[9],
      movement_control_score: scores[9],
      positioning_score: scores[9],
      rebound_control_score: scores[9],
      hands_score: scores[9],
      stick_score: scores[9],
      reads_score: scores[9],
      recovery_score: scores[9],
      compete_score: scores[9],
      confidence_score: scores[9],
      hockey_iq_score: scores[9],
      holding_back: ["Consistency", "Rebound control", "Lateral movement"],
      strengths: ["Compete level", "Positioning", "Communication"],
      become_statement: identity,
      biggest_goal: "Make the AAA team next season.",
      season_target: "Consistently play a clean, low-event game.",
      top_priorities: ["Improve rebound control", "Better lateral movement", "Stay composed"],
      priorities_reason: "These are the gaps between me and the next level.",
    },
    { onConflict: "season_id,goalie_id" },
  );
  if (goalErr) throw new Error(`season_goals(${email}): ${goalErr.message}`);

  for (let i = 0; i < SESSION_COUNT; i++) {
    const v = scores[i];
    const date = daysAgo((SESSION_COUNT - 1 - i) * DAYS_BETWEEN);
    const focusArea = FOCUS_AREAS[i % FOCUS_AREAS.length];

    const { error: insertErr } = await client.from("practice_sessions").insert({
      season_id: seasonId,
      goalie_id: signUp.user.id,
      practice_date: date.toISOString().slice(0, 10),
      status: "completed",
      pre_energy: v,
      pre_confidence: v,
      pre_focus: v,
      pre_body: v,
      pre_mental_readiness: v,
      pre_focus_area: focusArea,
      pre_one_thing: `Focus on ${focusArea.replace("_", " ")}`,
      pre_submitted_at: date.toISOString(),
      post_tracking: v,
      post_skating_edges: v,
      post_movement_control: v,
      post_positioning: v,
      post_rebound_control: v,
      post_hands: v,
      post_stick: v,
      post_focus: v,
      post_confidence: v,
      post_compete: v,
      post_reads: v,
      post_decision_making: v,
      post_focus_hit: trend !== "down",
      post_note: i === SESSION_COUNT - 1 ? `Latest session — trend: ${trend}` : null,
      post_submitted_at: date.toISOString(),
    });
    if (insertErr) throw new Error(`practice_sessions(${email}, session ${i}): ${insertErr.message}`);
  }

  return { email, fullName, trend };
}

async function main() {
  const coach = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const coachEmail = "coach@goalie.dev";
  const { error: coachErr } = await coach.auth.signUp({
    email: coachEmail,
    password: PASSWORD,
    options: { data: { full_name: "Coach Carter", role: "coach" } },
  });
  if (coachErr) throw new Error(`coach signUp: ${coachErr.message}`);

  const { data: team, error: teamErr } = await coach.rpc("create_team_with_coach", {
    team_name: "Ice Wolves",
  });
  if (teamErr) throw new Error(`create_team_with_coach: ${teamErr.message}`);

  const { data: season, error: seasonErr } = await coach
    .from("seasons")
    .select("id")
    .eq("team_id", team.id)
    .eq("is_active", true)
    .single();
  if (seasonErr) throw new Error(`fetch season: ${seasonErr.message}`);

  const goalies = await Promise.all([
    seedGoalie({
      email: "goalie.up@goalie.dev",
      fullName: "Riley Rising",
      inviteCode: team.invite_code,
      trend: "up",
      seasonId: season.id,
      teamId: team.id,
    }),
    seedGoalie({
      email: "goalie.flat@goalie.dev",
      fullName: "Jordan Steady",
      inviteCode: team.invite_code,
      trend: "flat",
      seasonId: season.id,
      teamId: team.id,
    }),
    seedGoalie({
      email: "goalie.down@goalie.dev",
      fullName: "Casey Falling",
      inviteCode: team.invite_code,
      trend: "down",
      seasonId: season.id,
      teamId: team.id,
    }),
  ]);

  console.log(`\nSeeded team: ${team.name} (invite code: ${team.invite_code})\n`);
  console.log(`Coach:  ${coachEmail} / ${PASSWORD}`);
  for (const g of goalies) {
    console.log(`Goalie: ${g.email} / ${PASSWORD}  (${g.trend} trend, "${g.fullName}")`);
  }
  console.log(`\n${SESSION_COUNT} completed practice sessions per goalie, spread over the last ${(SESSION_COUNT - 1) * DAYS_BETWEEN} days.`);
}

main().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
