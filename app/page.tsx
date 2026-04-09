"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type LocationPreference = "beach" | "city" | "mountains" | "simple" | "";
type WorkHours =
  | "none"
  | "1-3 hours"
  | "3-5 hours"
  | "5+ hours (self-directed)"
  | "";
type WorkType = "remote / online" | "business / project" | "helping others" | "unsure" | "";
type Priority =
  | "freedom"
  | "low stress"
  | "social life"
  | "health"
  | "financial growth"
  | "simplicity";
type QuestionKey = "location" | "workHours" | "workType" | "priorities";
type SavingsRange =
  | "Under $10k"
  | "$10k - $50k"
  | "$50k - $150k"
  | "$150k+"
  | "Prefer not to say"
  | "";
type RemoteIncomeStatus = "Yes" | "Maybe" | "No" | "";

const locationOptions: Exclude<LocationPreference, "">[] = ["beach", "city", "mountains", "simple"];
const workHoursOptions: Exclude<WorkHours, "">[] = [
  "none",
  "1-3 hours",
  "3-5 hours",
  "5+ hours (self-directed)",
];
const workTypeOptions: Exclude<WorkType, "">[] = [
  "remote / online",
  "business / project",
  "helping others",
  "unsure",
];
const priorityOptions: Priority[] = [
  "freedom",
  "low stress",
  "social life",
  "health",
  "financial growth",
  "simplicity",
];

const locationOptionContent: Record<Exclude<LocationPreference, "">, { label: string; graphic: string }> = {
  beach: { label: "Near the ocean, with a slower pace", graphic: "🌊" },
  city: { label: "In a walkable city with energy and options", graphic: "🏙️" },
  mountains: { label: "Somewhere quiet, green, and peaceful", graphic: "⛰️" },
  simple: { label: "Simple and low-key, without much noise", graphic: "🍃" },
};

const workHoursOptionContent: Record<Exclude<WorkHours, "">, { label: string; graphic: string }> = {
  none: { label: "I wouldn't work at all (at least for now)", graphic: "🌴" },
  "1-3 hours": { label: "Just a couple of hours, on my own schedule", graphic: "☕" },
  "3-5 hours": { label: "A balanced few hours of focused work", graphic: "⏱️" },
  "5+ hours (self-directed)": { label: "I'd still work a full day-but on my terms", graphic: "📅" },
};

const workTypeOptionContent: Record<Exclude<WorkType, "">, { label: string; graphic: string }> = {
  "remote / online": { label: "Something I can do from anywhere", graphic: "💻" },
  "business / project": { label: "Building a small business or project", graphic: "🚀" },
  "helping others": { label: "Helping or working with people directly", graphic: "🤝" },
  unsure: { label: "I'm still figuring that out", graphic: "🧭" },
};

const priorityOptionContent: Record<Priority, { label: string; graphic: string }> = {
  freedom: { label: "Having control over my time", graphic: "🕊️" },
  "low stress": { label: "Feeling calm and not constantly stressed", graphic: "🌤️" },
  "social life": { label: "Being around people and community", graphic: "🫶" },
  health: { label: "Staying active and feeling physically good", graphic: "💚" },
  "financial growth": { label: "Growing financially", graphic: "📈" },
  simplicity: { label: "Keeping life simple and uncluttered", graphic: "✨" },
};

function ProgressIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`h-2 flex-1 rounded-full ${
            index < current ? "bg-zinc-900" : "bg-zinc-200"
          }`}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "questions" | "results" | "financial" | "email">("intro");
  const [locationPreference, setLocationPreference] = useState<LocationPreference>("");
  const [workHours, setWorkHours] = useState<WorkHours>("");
  const [workType, setWorkType] = useState<WorkType>("");
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [personalNotes, setPersonalNotes] = useState("");
  const [savingsRange, setSavingsRange] = useState<SavingsRange>("");
  const [remoteIncomeStatus, setRemoteIncomeStatus] = useState<RemoteIncomeStatus>("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [introNameError, setIntroNameError] = useState("");
  const [emailFormError, setEmailFormError] = useState("");
  const [questionErrors, setQuestionErrors] = useState<Partial<Record<QuestionKey, string>>>({});
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [financialError, setFinancialError] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [step]);

  const clearQuestionError = (key: QuestionKey) => {
    setQuestionErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const togglePriority = (priority: Priority) => {
    const isSelected = priorities.includes(priority);
    const nextPriorities = isSelected
      ? priorities.filter((item) => item !== priority)
      : priorities.length < 2
        ? [...priorities, priority]
        : priorities;

    setPriorities(nextPriorities);
    if (nextPriorities.length > 0) {
      clearQuestionError("priorities");
    }
  };

  const optionCardClass = (selected: boolean) =>
    `block cursor-pointer rounded-xl border p-4 transition ${
      selected
        ? "border-zinc-900 bg-zinc-100"
        : "border-zinc-300 bg-white hover:border-zinc-500 hover:bg-zinc-50"
    }`;
  const primaryButtonClass =
    "mx-auto flex h-10 w-full max-w-md items-center justify-center rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-emerald-700 hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:border-emerald-200 disabled:bg-emerald-200 disabled:text-emerald-700";
  const secondaryButtonClass =
    "mt-3 mx-auto block w-fit text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900";

  const canRevealResults =
    locationPreference !== "" && workHours !== "" && workType !== "" && priorities.length > 0;

  const validateQuestions = () => {
    const errors: Partial<Record<QuestionKey, string>> = {};

    if (locationPreference === "") {
      errors.location = "Please choose where you picture yourself waking up most days.";
    }
    if (workHours === "") {
      errors.workHours = "Please choose how much you want to work in a typical day.";
    }
    if (workType === "") {
      errors.workType = "Please choose what kind of work feels right to you.";
    }
    if (priorities.length === 0) {
      errors.priorities = "Please choose at least one priority (up to two).";
    }

    return errors;
  };

  const handleSeeResults = () => {
    const errors = validateQuestions();
    const hasErrors = Object.keys(errors).length > 0;

    if (hasErrors) {
      setQuestionErrors(errors);
      setShowValidationSummary(true);

      const order: QuestionKey[] = ["location", "workHours", "workType", "priorities"];
      const firstMissing = order.find((key) => errors[key]);
      if (firstMissing) {
        const element = document.getElementById(`question-${firstMissing}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          (element as HTMLElement).focus();
        }
      }

      return;
    }

    setQuestionErrors({});
    setShowValidationSummary(false);
    setStep("results");
  };

  const costByLocation: Record<Exclude<LocationPreference, "">, { min: number; max: number }> = {
    beach: { min: 1200, max: 1500 },
    city: { min: 1400, max: 1800 },
    mountains: { min: 1000, max: 1400 },
    simple: { min: 800, max: 1200 },
  };

  const monthlyNeededByLocation: Record<Exclude<LocationPreference, "">, number> = {
    beach: 1350,
    city: 1600,
    mountains: 1200,
    simple: 1000,
  };

  const savingsMidpointMap: Record<Exclude<SavingsRange, "">, number | null> = {
    "Under $10k": 5000,
    "$10k - $50k": 30000,
    "$50k - $150k": 100000,
    "$150k+": 175000,
    "Prefer not to say": null,
  };

  const locationSentenceMap: Record<Exclude<LocationPreference, "">, string> = {
    beach:
      "You're drawn to a relaxed lifestyle near the coast, where life feels lighter and more open.",
    city: "You're energized by a city lifestyle that balances convenience, movement, and daily variety.",
    mountains:
      "You're imagining a grounded lifestyle in a quieter setting, with nature and calm built into your day.",
    simple:
      "You're leaning toward a simple, low-noise lifestyle with less pressure and more room to breathe.",
  };

  const workStyleMap: Record<Exclude<WorkHours, "">, string> = {
    none: "Right now, your ideal structure gives you full space to rest, reset, and move at your own pace.",
    "1-3 hours":
      "Your ideal work rhythm is light and flexible, with just enough structure to stay engaged without feeling boxed in.",
    "3-5 hours":
      "You seem to want a balanced workday, focused enough to feel productive but still leaving room for life around it.",
    "5+ hours (self-directed)":
      "Even with a fuller schedule, you want autonomy, where your work is intentional and aligned with your terms.",
  };

  const workTypeMap: Record<Exclude<WorkType, "">, string> = {
    "remote / online": "with work that can move with you and support location freedom",
    "business / project": "while building something of your own over time",
    "helping others": "through people-centered work that feels meaningful",
    unsure: "while you continue exploring the direction that fits best",
  };

  const priorityPhraseMap: Record<Priority, string> = {
    freedom: "more control over your time",
    "low stress": "a calmer, lower-stress rhythm",
    "social life": "stronger connection and community",
    health: "better day-to-day physical wellbeing",
    "financial growth": "steady financial progress",
    simplicity: "a simpler, less cluttered life",
  };

  const buildPrioritySentence = (selectedPriorities: Priority[]) => {
    const phrases = selectedPriorities.map((priority) => priorityPhraseMap[priority]);
    if (phrases.length === 1) {
      return `What matters most to you right now is ${phrases[0]}.`;
    }
    return `What matters most to you right now is ${phrases[0]} and ${phrases[1]}.`;
  };

  const buildInterpretationSentence = (selectedLocation: Exclude<LocationPreference, "">) => {
    if (selectedLocation === "beach" || selectedLocation === "simple") {
      return "Overall, this points to a life designed around freedom, presence, and emotional breathing room.";
    }
    if (selectedLocation === "city") {
      return "Overall, this points to a life where momentum and flexibility can exist together in a sustainable way.";
    }
    return "Overall, this points to a life centered on intention, stability, and a healthier daily pace.";
  };

  const buildPersonalSentence = (notes: string) => {
    const trimmed = notes.trim();
    if (!trimmed) return "";
    const preview = trimmed.length > 140 ? `${trimmed.slice(0, 140).trim()}...` : trimmed;
    return `You also shared details that make this feel more real for you: "${preview}"`;
  };

  const summarySentences = canRevealResults
    ? [
        locationSentenceMap[locationPreference as Exclude<LocationPreference, "">],
        `${workStyleMap[workHours as Exclude<WorkHours, "">].replace(/\.$/, "")} ${
          workTypeMap[workType as Exclude<WorkType, "">]
        }.`,
        buildPrioritySentence(priorities),
        buildInterpretationSentence(locationPreference as Exclude<LocationPreference, "">),
        buildPersonalSentence(personalNotes),
      ].filter((sentence) => sentence.length > 0)
    : [];

  const resultGraphics = canRevealResults
    ? [
        locationOptionContent[locationPreference as Exclude<LocationPreference, "">].graphic,
        workTypeOptionContent[workType as Exclude<WorkType, "">].graphic,
        priorities.length > 0 ? priorityOptionContent[priorities[0]].graphic : "✨",
        "🧭",
        personalNotes.trim() ? "📝" : "",
      ].filter((graphic) => graphic.length > 0)
    : [];

  const estimatedCost =
    locationPreference !== "" ? costByLocation[locationPreference as Exclude<LocationPreference, "">] : null;

  const estimatedMonthlyNeeded =
    locationPreference !== ""
      ? monthlyNeededByLocation[locationPreference as Exclude<LocationPreference, "">]
      : null;

  const savingsMidpoint =
    savingsRange !== "" ? savingsMidpointMap[savingsRange as Exclude<SavingsRange, "">] : null;

  const estimatedRunwayMonths =
    savingsMidpoint !== null && estimatedMonthlyNeeded
      ? Number((savingsMidpoint / estimatedMonthlyNeeded).toFixed(1))
      : null;

  const formatRunway = (months: number) => {
    if (months > 24) {
      return `${(months / 12).toFixed(1)} years`;
    }
    return `${Math.round(months)} months`;
  };

  const canShowFinancialResults =
    savingsRange !== "" && remoteIncomeStatus !== "" && estimatedCost !== null && estimatedMonthlyNeeded !== null;

  const displayName = firstName.trim();
  const displayNamePossessive = displayName
    ? `${displayName}${displayName.toLowerCase().endsWith("s") ? "'" : "'s"}`
    : "";

  const handleStartQuestions = () => {
    if (!displayName) {
      setIntroNameError("Please enter your first name so we can personalize your experience.");
      return;
    }
    setIntroNameError("");
    setStep("questions");
  };

  const handleContinueFromFinancial = () => {
    if (!canShowFinancialResults) {
      setFinancialError("Please choose your savings range and remote income status to continue.");
      return;
    }

    setFinancialError("");
    setStep("email");
  };

  const handleEmailSubmit = () => {
    const trimmedFirstName = firstName.trim();
    const trimmedEmail = email.trim();
    const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!trimmedFirstName || !emailLooksValid) {
      setEmailFormError("Please enter your first name and a valid email so we can send your summary.");
      return;
    }

    const leadSnapshot = {
      firstName: trimmedFirstName,
      email: trimmedEmail,
      submittedAt: new Date().toISOString(),
      locationPreference,
      workHours,
      workType,
      priorities,
      personalNotes: personalNotes.trim(),
      savingsRange,
      remoteIncomeStatus,
      summarySentences,
      estimatedCostMin: estimatedCost?.min ?? null,
      estimatedCostMax: estimatedCost?.max ?? null,
      estimatedMonthlyNeeded: estimatedMonthlyNeeded ?? null,
      estimatedRunwayMonths: estimatedRunwayMonths ?? null,
      estimatedRunwayDisplay: estimatedRunwayMonths !== null ? formatRunway(estimatedRunwayMonths) : null,
    };

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem("dreamLifeLeadSnapshot", JSON.stringify(leadSnapshot));
    }

    setEmailFormError("");
    router.push("/thank-you", { scroll: true });
  };

  return (
    <div className="min-h-screen bg-zinc-100 px-4 py-10 text-zinc-950 sm:px-6">
      <main className="mx-auto w-full max-w-2xl rounded-2xl border border-zinc-300 bg-white p-6 shadow-sm sm:p-8">
                {step === "intro" ? (
          <section className="mx-auto max-w-xl space-y-7">
            <ProgressIndicator current={1} total={5} />
            <p className="text-center text-sm font-medium uppercase tracking-wide text-zinc-500">
              Design Your Dream Life
            </p>
            <h1 className="text-center text-2xl font-semibold tracking-tight sm:text-3xl">
              What would your life look like if your time was actually your own?
            </h1>
            <div className="space-y-4">
              <p className="text-base leading-7 text-zinc-600">
                Most people never stop long enough to think this through.
              </p>
              <p className="text-base leading-7 text-zinc-600">
                In the next few steps, you&apos;ll map out your ideal day&mdash;and see what it could
                realistically look like.
              </p>
              <p className="text-base leading-7 text-zinc-600">It takes about 2 minutes.</p>
            </div>
            <div className="space-y-3">
              <p className="text-base leading-7 text-zinc-600">Let&apos;s start with your name.</p>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-900">First name</span>
                <input
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value);
                    setIntroNameError("");
                  }}
                  className="w-full rounded-lg border border-zinc-300 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 outline-none ring-zinc-300 transition focus:ring-2"
                  placeholder="First name"
                />
              </label>
            </div>
            {introNameError && <p className="text-sm font-medium text-red-600">{introNameError}</p>}
            <button
              type="button"
              onClick={handleStartQuestions}
              className={primaryButtonClass}
            >
              Start building my plan
            </button>
          </section>
        ) : step === "questions" ? (
          <section className="space-y-8">
            <ProgressIndicator current={2} total={5} />
            <div className="space-y-4">
              {displayName && <p className="text-base text-zinc-600">Nice to meet you, {displayName}.</p>}
              <p className="text-base text-zinc-600">
                Let&apos;s get a clearer picture of what you actually want your day-to-day life to feel like.
              </p>
              <p className="text-base text-zinc-600">
                Answer a few quick questions-just go with what feels right.
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-zinc-900">Your Ideal Day</h2>
              <p className="text-base text-zinc-600">If your time was truly your own… what would it look like?</p>
            </div>

            <p className="text-sm text-zinc-500">
              Start with what feels closest. You can always refine it later.
            </p>

            {showValidationSummary && Object.keys(questionErrors).length > 0 && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-950">
                  Please complete the missing answers before continuing:
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900">
                  {questionErrors.location && <li>Question 1 is required.</li>}
                  {questionErrors.workHours && <li>Question 2 is required.</li>}
                  {questionErrors.workType && <li>Question 3 is required.</li>}
                  {questionErrors.priorities && <li>Question 4 needs at least one selection.</li>}
                </ul>
              </div>
            )}

            <fieldset
              id="question-location"
              tabIndex={-1}
              className={`space-y-4 rounded-xl border bg-zinc-50 p-5 outline-none ${
                questionErrors.location ? "border-red-400" : "border-zinc-300"
              }`}
            >
              <p className="text-base font-semibold text-zinc-900">
                1. Where do you picture yourself waking up most days?
              </p>
              {locationOptions.map((option) => (
                <label key={option} className={optionCardClass(locationPreference === option)}>
                  <input
                    type="radio"
                    name="locationPreference"
                    value={option}
                    checked={locationPreference === option}
                    onChange={() => {
                      setLocationPreference(option);
                      clearQuestionError("location");
                    }}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-3xl">
                      {locationOptionContent[option].graphic}
                    </span>
                    <span className="text-zinc-900">{locationOptionContent[option].label}</span>
                  </span>
                </label>
              ))}
              {questionErrors.location && (
                <p className="text-sm font-medium text-red-600">{questionErrors.location}</p>
              )}
            </fieldset>

            <fieldset
              id="question-workHours"
              tabIndex={-1}
              className={`space-y-4 rounded-xl border bg-zinc-50 p-5 outline-none ${
                questionErrors.workHours ? "border-red-400" : "border-zinc-300"
              }`}
            >
              <p className="text-base font-semibold text-zinc-900">
                2. How much do you want to work in a typical day?
              </p>
              {workHoursOptions.map((option) => (
                <label key={option} className={optionCardClass(workHours === option)}>
                  <input
                    type="radio"
                    name="workHours"
                    value={option}
                    checked={workHours === option}
                    onChange={() => {
                      setWorkHours(option);
                      clearQuestionError("workHours");
                    }}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-3xl">
                      {workHoursOptionContent[option].graphic}
                    </span>
                    <span className="text-zinc-900">{workHoursOptionContent[option].label}</span>
                  </span>
                </label>
              ))}
              {questionErrors.workHours && (
                <p className="text-sm font-medium text-red-600">{questionErrors.workHours}</p>
              )}
            </fieldset>

            <fieldset
              id="question-workType"
              tabIndex={-1}
              className={`space-y-4 rounded-xl border bg-zinc-50 p-5 outline-none ${
                questionErrors.workType ? "border-red-400" : "border-zinc-300"
              }`}
            >
              <p className="text-base font-semibold text-zinc-900">
                3. What kind of work feels right to you?
              </p>
              {workTypeOptions.map((option) => (
                <label key={option} className={optionCardClass(workType === option)}>
                  <input
                    type="radio"
                    name="workType"
                    value={option}
                    checked={workType === option}
                    onChange={() => {
                      setWorkType(option);
                      clearQuestionError("workType");
                    }}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-3xl">
                      {workTypeOptionContent[option].graphic}
                    </span>
                    <span className="text-zinc-900">{workTypeOptionContent[option].label}</span>
                  </span>
                </label>
              ))}
              {questionErrors.workType && (
                <p className="text-sm font-medium text-red-600">{questionErrors.workType}</p>
              )}
            </fieldset>

            <fieldset
              id="question-priorities"
              tabIndex={-1}
              className={`space-y-4 rounded-xl border bg-zinc-50 p-5 outline-none ${
                questionErrors.priorities ? "border-red-400" : "border-zinc-300"
              }`}
            >
              <p className="text-base font-semibold text-zinc-900">
                4. What matters most in your day-to-day life?
              </p>
              <p className="text-sm text-zinc-500">Choose the two that matter most right now</p>
              {priorityOptions.map((option) => (
                <label key={option} className={optionCardClass(priorities.includes(option))}>
                  <input
                    type="checkbox"
                    name="priorities"
                    value={option}
                    checked={priorities.includes(option)}
                    onChange={() => togglePriority(option)}
                    className="sr-only"
                  />
                  <span className="flex items-center gap-3">
                    <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-3xl">
                      {priorityOptionContent[option].graphic}
                    </span>
                    <span className="text-zinc-900">{priorityOptionContent[option].label}</span>
                  </span>
                </label>
              ))}
              <p className="text-xs text-zinc-500">Selected: {priorities.length} of 2</p>
              {questionErrors.priorities && (
                <p className="text-sm font-medium text-red-600">{questionErrors.priorities}</p>
              )}
            </fieldset>

            <fieldset className="space-y-4 rounded-xl border border-zinc-300 bg-zinc-50 p-5">
              <p className="text-base font-semibold text-zinc-900">5. You&apos;ve outlined the basics-now make it more real.</p>
              <p className="text-base text-zinc-700">What else matters to your ideal life?</p>
              <p className="text-sm text-zinc-500">This could be:</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-500">
                <li>what your home feels like</li>
                <li>what your mornings look like</li>
                <li>what you want nearby</li>
                <li>anything that didn&apos;t quite fit above</li>
              </ul>
              <textarea
                value={personalNotes}
                onChange={(event) => setPersonalNotes(event.target.value)}
                rows={4}
                placeholder="I'd love an ocean view in a secure setting, with the ability to walk to beaches, restaurants, and stores. It should feel modern and comfortable, with good access to medical care and a nearby airport."
                className="w-full rounded-lg border border-zinc-300 bg-white p-4 text-sm text-zinc-900 outline-none ring-zinc-300 transition focus:ring-2"
              />
            </fieldset>

            <button
              type="button"
              onClick={handleSeeResults}
              className={primaryButtonClass}
            >
              Show me what this looks like
            </button>

            <button
              type="button"
              onClick={() => setStep("intro")}
              className={secondaryButtonClass}
            >
              Back to intro
            </button>
          </section>
        ) : step === "results" ? (
          <section className="space-y-6">
            <ProgressIndicator current={3} total={5} />
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {displayNamePossessive
                ? `What ${displayNamePossessive} ideal life could look like`
                : "What your ideal life could look like"}
            </h2>
            <p className="text-base text-zinc-600">
              Based on your answers, this is a first picture of the life you&apos;re moving toward.
            </p>

            <div className="space-y-4 rounded-xl border border-zinc-300 bg-zinc-50 p-5">
              {summarySentences.map((sentence, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-300 bg-white text-2xl">
                    {resultGraphics[index] ?? "✨"}
                  </span>
                  <p className="text-base leading-7 text-zinc-900">{sentence}</p>
                </div>
              ))}
            </div>

            {estimatedCost && (
              <div className="space-y-2 rounded-xl border border-zinc-300 bg-zinc-50 p-5">
                <p className="text-sm font-medium text-zinc-600">Estimated Monthly Cost in Ecuador</p>
                <p className="text-2xl font-semibold text-zinc-900">
                  ${estimatedCost.min} - {estimatedCost.max}
                </p>
                <p className="text-sm text-zinc-600">
                  This is a directional range based on your chosen lifestyle location.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep("financial")}
              className={primaryButtonClass}
            >
              Next Steps
            </button>

            <button
              type="button"
              onClick={() => setStep("questions")}
              className={secondaryButtonClass}
            >
              Back to questions
            </button>
          </section>
        ) : step === "financial" ? (
          <section className="space-y-6">
            <ProgressIndicator current={4} total={5} />
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Step 4 of 5</p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Could this lifestyle actually work for you?</h2>
            {displayName && (
              <p className="text-base text-zinc-600">
                Okay, {displayName}, let&apos;s ground this in practical terms.
              </p>
            )}
            <p className="text-base text-zinc-600">
              Now that you have a clearer picture of the life you want, let&apos;s take a quick look at what
              it might mean financially.
            </p>
            <p className="text-base text-zinc-600">
              This doesn&apos;t need to be exact. The goal is simply to help you get a feel for what this
              lifestyle might require and whether it feels within reach.
            </p>

            <section className="space-y-3 rounded-xl border border-zinc-300 bg-zinc-50 p-5">
              <p className="text-base font-semibold text-zinc-900">About how much savings do you currently have?</p>
              <select
                value={savingsRange}
                onChange={(event) => {
                  setSavingsRange(event.target.value as SavingsRange);
                  setFinancialError("");
                }}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-zinc-300 transition focus:ring-2"
              >
                <option value="">Select one option</option>
                <option value="Under $10k">Under $10k</option>
                <option value="$10k - $50k">$10k - $50k</option>
                <option value="$50k - $150k">$50k - $150k</option>
                <option value="$150k+">$150k+</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </section>

            <section className="space-y-3 rounded-xl border border-zinc-300 bg-zinc-50 p-5">
              <p className="text-base font-semibold text-zinc-900">
                Do you currently have income you could continue earning remotely?
              </p>
              {(["Yes", "Maybe", "No"] as RemoteIncomeStatus[]).map((option) => (
                <label key={option} className={optionCardClass(remoteIncomeStatus === option)}>
                  <input
                    type="radio"
                    name="remoteIncomeStatus"
                    value={option}
                    checked={remoteIncomeStatus === option}
                    onChange={() => {
                      setRemoteIncomeStatus(option);
                      setFinancialError("");
                    }}
                    className="sr-only"
                  />
                  <span className="text-zinc-900">{option}</span>
                </label>
              ))}
            </section>

            {canShowFinancialResults && estimatedCost && estimatedMonthlyNeeded && (
              <section className="space-y-4 rounded-xl border border-zinc-300 bg-zinc-50 p-5">
                <p className="text-lg font-semibold text-zinc-900">What this could look like financially</p>

                <div className="space-y-1 rounded-lg border border-zinc-300 bg-white p-4">
                  <p className="text-sm text-zinc-600">
                    A lifestyle like the one you described would likely fall in this range:
                  </p>
                  <p className="text-3xl font-semibold text-zinc-900">
                    ${estimatedCost.min} - {estimatedCost.max}
                  </p>
                </div>

                {estimatedRunwayMonths !== null ? (
                  <div className="space-y-1 rounded-lg border border-zinc-300 bg-white p-4">
                    <p className="text-sm text-zinc-600">
                      Based on what you shared, you could likely sustain this lifestyle for about:
                    </p>
                    <p className="text-3xl font-semibold text-zinc-900">{formatRunway(estimatedRunwayMonths)}</p>
                  </div>
                ) : (
                  <div className="space-y-1 rounded-lg border border-zinc-300 bg-white p-4">
                    <p className="text-sm text-zinc-600">
                      Even without estimating your runway, this gives you a useful target for what this
                      lifestyle may require each month.
                    </p>
                  </div>
                )}

                <div className="space-y-1 rounded-lg border border-zinc-300 bg-white p-4">
                  <p className="text-sm text-zinc-600">
                    To maintain this lifestyle long-term, you&apos;d likely want income of around:
                  </p>
                  <p className="text-3xl font-semibold text-zinc-900">${estimatedMonthlyNeeded}</p>
                </div>
              </section>
            )}

            <p className="text-base leading-7 text-zinc-600">
              You don&apos;t need to have everything figured out right now. The point is to start turning a
              vague dream into something you can actually see, evaluate, and build toward.
            </p>

            {financialError && <p className="text-sm font-medium text-red-600">{financialError}</p>}

            <button
              type="button"
              onClick={handleContinueFromFinancial}
              className={primaryButtonClass}
            >
              Continue
            </button>

            <button
              type="button"
              onClick={() => setStep("results")}
              className={secondaryButtonClass}
            >
              Back to results
            </button>
          </section>
        ) : (
          <section className="space-y-6">
            <ProgressIndicator current={5} total={5} />
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Save Your Personalized Report</h2>
            {displayName && (
              <p className="text-base leading-7 text-zinc-700">
                You&apos;re doing great, {displayName}. Let&apos;s send this to your inbox.
              </p>
            )}
            <p className="text-base leading-7 text-zinc-600">
              You&apos;re one step away from turning this into a practical next move. Enter your email and
              we&apos;ll send a clear version of your lifestyle vision so you can revisit it, reflect on it,
              and use it when you&apos;re ready to plan your next chapter.
            </p>
            <p className="text-base leading-7 text-zinc-600">
              In your report, you&apos;ll get your personalized lifestyle summary, your estimated monthly
              range, and your financial snapshot in one place so you don&apos;t lose momentum.
            </p>

            <section className="space-y-3 rounded-xl border border-zinc-300 bg-zinc-50 p-5">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-900">First name</span>
                <input
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value);
                    setEmailFormError("");
                  }}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-zinc-300 transition focus:ring-2"
                  placeholder="First Name"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-900">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailFormError("");
                  }}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-zinc-300 transition focus:ring-2"
                  placeholder="you@example.com"
                />
              </label>
            </section>

            <section className="space-y-2 rounded-xl border border-zinc-300 bg-zinc-50 p-5">
              {locationPreference !== "" && workHours !== "" && priorities.length > 0 && (
                <p className="text-base leading-7 text-zinc-700">
                  Picture Yourself in an environment that feels like{" "}
                  {locationOptionContent[locationPreference as Exclude<LocationPreference, "">].label.toLowerCase()},
                  working {workHoursOptionContent[workHours as Exclude<WorkHours, "">].label.toLowerCase()} so you
                  can prioritize {priorities.map((p) => priorityOptionContent[p].label.toLowerCase()).join(" and ")}.
                </p>
              )}
            </section>

            {emailFormError && <p className="text-sm font-medium text-red-600">{emailFormError}</p>}

            <button
              type="button"
              onClick={handleEmailSubmit}
              className={primaryButtonClass}
            >
              Finish
            </button>

            <button
              type="button"
              onClick={() => setStep("financial")}
              className={secondaryButtonClass}
            >
              Back to financial snapshot
            </button>
          </section>
        )}
      </main>
    </div>
  );
}





