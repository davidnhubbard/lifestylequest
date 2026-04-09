"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ThankYouPage() {
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.sessionStorage.getItem("dreamLifeLeadSnapshot");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { firstName?: string };
      setFirstName(parsed.firstName?.trim() || "");
    } catch {
      setFirstName("");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-zinc-50 to-white px-4 py-10 text-zinc-950 sm:px-6 md:py-14">
      <main className="mx-auto w-full max-w-2xl rounded-3xl border border-zinc-300/90 bg-white/95 p-6 shadow-xl shadow-zinc-200/60 backdrop-blur sm:p-8 md:p-10">
        <div className="space-y-12">
          <header className="space-y-5 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-emerald-700/85">You&apos;re all set</p>
            <h1 className="text-2xl font-medium leading-snug tracking-tight text-zinc-900 md:text-[30px]">
            Thank you{firstName ? `, ${firstName}` : ""}
            </h1>
            <p className="mx-auto max-w-md text-lg leading-relaxed text-zinc-600">
              Your personalized summary is on its way. Check your inbox in the next few minutes.
            </p>
          </header>

          <section className="space-y-6 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-7 text-left md:p-9">
            <h2 className="text-lg font-medium text-zinc-900">What happens next?</h2>
            <ul className="space-y-6">
              <li className="flex gap-5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-sm font-medium text-zinc-600">
                  1
                </div>
                <div className="pt-0.5">
                  <p className="font-medium text-zinc-900">Review your summary</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-zinc-600">
                    We&apos;ve put together a breakdown of costs, lifestyle details, and things to consider.
                  </p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-sm font-medium text-zinc-600">
                  2
                </div>
                <div className="pt-0.5">
                  <p className="font-medium text-zinc-900">Explore at your own pace</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-zinc-600">
                    Learn about visa options, neighborhoods, and stories from others who made the move.
                  </p>
                </div>
              </li>
              <li className="flex gap-5">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-sm font-medium text-zinc-600">
                  3
                </div>
                <div className="pt-0.5">
                  <p className="font-medium text-zinc-900">Take your time</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-zinc-600">
                    This is a big decision. Let it sit, revisit your summary, and reach out when you&apos;re ready.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section className="space-y-5 rounded-3xl border border-emerald-200 bg-emerald-50/70 p-7 text-center md:p-9">
            <h2 className="text-xl font-medium text-zinc-900">Want to talk it through?</h2>
            <p className="mx-auto max-w-sm leading-relaxed text-zinc-600">
              Sometimes it helps to chat with someone who&apos;s been there. We&apos;re happy to help - no pressure, no pitch.
            </p>
            <a
              href="#"
              className="mx-auto inline-flex h-14 w-full max-w-xs items-center justify-center rounded-2xl border border-emerald-600 bg-emerald-600 px-8 text-sm font-medium text-white transition-colors hover:border-emerald-700 hover:bg-emerald-700"
            >
              Book a Free Call
              <span className="ml-2" aria-hidden="true">
                {"->"}
              </span>
            </a>
          </section>

          <p className="text-center text-sm text-zinc-500">
            Questions? Just reply to the email - a real person will get back to you.
          </p>

          <div className="border-t border-zinc-200 pt-2 text-center">
            <Link
              href="/email-preview"
              scroll
              className="text-xs text-zinc-500 underline underline-offset-2 transition-colors hover:text-zinc-700"
            >
              Preview development emails
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}


