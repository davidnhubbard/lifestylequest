import Link from "next/link";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-10 text-slate-900 sm:px-6">
      <main className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
        <section className="space-y-6">
          <p className="text-sm font-medium text-gray-600">Complete</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Thank you — your personalized summary is on its way
          </h1>
          <p className="text-base leading-7 text-gray-600">
            You’ve done something most people never take the time to do: get clearer about the life you
            actually want.
          </p>
          <p className="text-base leading-7 text-gray-600">
            Right now, your responses are helping turn a vague idea into something more concrete —
            something you can reflect on, revisit, and build toward.
          </p>
        </section>

        <section className="mt-6 space-y-3 rounded-xl border border-gray-200 bg-blue-50 p-4">
          <h2 className="text-lg font-semibold text-slate-900">What to do next</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-slate-800">
            <li>Re-read your vision while it’s fresh</li>
            <li>Think about what parts feel most important to you</li>
            <li>Start noticing what would need to change to move in this direction</li>
          </ul>
        </section>

        <section className="mt-6 space-y-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
          <h2 className="text-xl font-semibold text-slate-900">Want help thinking through your situation?</h2>
          <p className="text-sm leading-6 text-slate-800">
            For some people, the next useful step is talking through their situation with someone who
            understands both the lifestyle side and the practical side of making a move like this.
          </p>
          <p className="text-sm leading-6 text-slate-800">
            If that sounds like you, you may be able to schedule a conversation to talk through your
            plans, questions, and what might make sense for your situation.
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            See if I qualify for a conversation
          </a>
        </section>

        <div className="mt-8">
          <Link href="/email-preview" className="text-xs text-gray-500 underline underline-offset-2">
            Preview development emails
          </Link>
        </div>
      </main>
    </div>
  );
}
