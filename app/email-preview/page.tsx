"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type LeadSnapshot = {
  firstName?: string;
  email?: string;
  submittedAt?: string;
  locationPreference?: string;
  workHours?: string;
  workType?: string;
  priorities?: string[];
  personalNotes?: string;
  savingsRange?: string;
  remoteIncomeStatus?: string;
  summarySentences?: string[];
  estimatedCostMin?: number | null;
  estimatedCostMax?: number | null;
  estimatedMonthlyNeeded?: number | null;
  estimatedRunwayMonths?: number | null;
  estimatedRunwayDisplay?: string | null;
};

const fallbackSummary = [
  "You're shaping a lifestyle that feels more intentional and aligned with what matters to you.",
  "Your responses suggest a desire for more flexibility, clarity, and room to design your days with purpose.",
  "This is a strong starting point for turning a vague idea into a direction you can actually act on.",
];

export default function EmailPreviewPage() {
  const [snapshot, setSnapshot] = useState<LeadSnapshot | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem("dreamLifeLeadSnapshot");
    if (!raw) return;
    try {
      setSnapshot(JSON.parse(raw) as LeadSnapshot);
    } catch {
      setSnapshot(null);
    }
  }, []);

  const safeName = snapshot?.firstName?.trim() || "there";
  const safeEmail = snapshot?.email?.trim() || "No email provided";
  const safeSummary = snapshot?.summarySentences?.length ? snapshot.summarySentences : fallbackSummary;
  const safeCostRange =
    snapshot?.estimatedCostMin && snapshot?.estimatedCostMax
      ? `$${snapshot.estimatedCostMin}-$${snapshot.estimatedCostMax}`
      : "Cost range not available";
  const safeMonthlyNeeded = snapshot?.estimatedMonthlyNeeded
    ? `$${snapshot.estimatedMonthlyNeeded}`
    : "Not available";
  const safeRunway = snapshot?.estimatedRunwayDisplay || null;
  const submittedAtLabel = snapshot?.submittedAt ? new Date(snapshot.submittedAt).toLocaleString() : "Not available";

  const userSubject = `${safeName}, your ideal life plan is ready`;

  const userBody = useMemo(() => {
    const summaryBlock = safeSummary.map((line) => `- ${line}`).join("\n");
    const runwayLine = safeRunway
      ? `Based on what you shared, you could likely sustain this lifestyle for about ${safeRunway}.`
      : "";

    return `Hi ${safeName},

Thanks for taking a few minutes to think through what your ideal life might actually look like.

Most people never stop long enough to do that.

Your Ideal Day
${summaryBlock}

What This Could Look Like in Ecuador
A lifestyle like the one you described is very possible in Ecuador.

Depending on location and preferences, it typically falls in this range:
${safeCostRange} per month

For many people, this can be meaningfully lower than comparable lifestyles in much of North America, while still offering a great quality of life.

Your Financial Snapshot
${runwayLine ? `${runwayLine}\n` : ""}To maintain this lifestyle long-term, you'd likely want income of around ${safeMonthlyNeeded} per month.

A Simple Way Forward
1. Get clear on your monthly lifestyle target
2. Explore or test a source of remote or flexible income
3. Plan a short visit to experience Ecuador firsthand
4. Start simplifying your current commitments

If You Want Help With This
If you'd like help thinking through your situation and what this could look like in real life, you may be able to schedule a conversation.

[Schedule a conversation]

There's no pressure here - just something to think about.

But if part of this resonated, it may be worth taking one small step toward it.`;
  }, [safeCostRange, safeMonthlyNeeded, safeName, safeRunway, safeSummary]);

  const coachSubject = `New Ecuador dream life lead: ${safeName}`;

  const coachBody = useMemo(() => {
    const priority1 = snapshot?.priorities?.[0] || "Not provided";
    const priority2 = snapshot?.priorities?.[1] || "Not provided";
    const notes = snapshot?.personalNotes?.trim()
      ? snapshot.personalNotes.trim()
      : "No additional personal details provided.";

    return `A new lead has completed the Dream Life in Ecuador flow.

Lead Info
- Name: ${safeName}
- Email: ${safeEmail}
- Submitted at: ${submittedAtLabel}

Questionnaire Answers
- Location preference: ${snapshot?.locationPreference || "Not provided"}
- Work hours: ${snapshot?.workHours || "Not provided"}
- Work type: ${snapshot?.workType || "Not provided"}
- Priority 1: ${priority1}
- Priority 2: ${priority2}

Personal Notes
${notes}

Financial Snapshot
- Savings range: ${snapshot?.savingsRange || "Not provided"}
- Remote income status: ${snapshot?.remoteIncomeStatus || "Not provided"}
- Estimated monthly cost range: ${safeCostRange}
- Estimated monthly income needed: ${safeMonthlyNeeded}
- Estimated runway: ${safeRunway || "Not available"}

Generated Summary
${safeSummary.map((line) => `- ${line}`).join("\n")}`;
  }, [safeCostRange, safeEmail, safeMonthlyNeeded, safeName, safeRunway, safeSummary, snapshot, submittedAtLabel]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-zinc-50 to-white px-4 py-10 text-zinc-900 sm:px-6 md:py-14">
      <main className="mx-auto w-full max-w-3xl space-y-6">
        <section className="rounded-3xl border border-zinc-300 bg-white/95 p-6 text-center shadow-xl shadow-zinc-200/60 sm:p-8">
          <p className="text-sm font-medium tracking-wide text-emerald-700/85">Development / Testing</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Email Preview</h1>
          <p className="mt-3 text-sm text-zinc-600">
            This page is temporary and for development review only. No real emails are being sent.
          </p>
          <div className="mt-4">
            <Link href="/thank-you" className="text-sm text-zinc-600 underline underline-offset-2 hover:text-zinc-800">
              Back to Thank You page
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-emerald-300 bg-emerald-50/70 p-6 shadow-lg shadow-emerald-100/70 sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-900">User Email Preview</h2>
          <p className="mt-3 text-sm text-zinc-800">
            <span className="font-semibold">Subject:</span> {userSubject}
          </p>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-zinc-300 bg-white p-4 text-sm leading-6 text-zinc-800 shadow-sm">
            {userBody}
          </pre>
        </section>

        <section className="rounded-3xl border border-emerald-300 bg-emerald-50/70 p-6 shadow-lg shadow-emerald-100/70 sm:p-8">
          <h2 className="text-xl font-semibold text-zinc-900">Coach Notification Email Preview</h2>
          <p className="mt-3 text-sm text-zinc-800">
            <span className="font-semibold">Subject:</span> {coachSubject}
          </p>
          <pre className="mt-4 whitespace-pre-wrap rounded-xl border border-zinc-300 bg-white p-4 text-sm leading-6 text-zinc-800 shadow-sm">
            {coachBody}
          </pre>
        </section>
      </main>
    </div>
  );
}
