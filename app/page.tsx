"use client";

import { useState } from "react";
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
  beach: { label: "Near the ocean, with a slower pace", graphic: "🌅" },
  city: { label: "In a walkable city with energy and options", graphic: "🏙️" },
  mountains: { label: "Somewhere quiet, green, and peaceful", graphic: "⛰️" },
  simple: { label: "Simple and low-key, without much noise", graphic: "🍃" },
};

const workHoursOptionContent: Record<Exclude<WorkHours, "">, { label: string; graphic: string }> = {
  none: { label: "I wouldn’t work at all (at least for now)", graphic: "🌴" },
  "1-3 hours": { label: "Just a couple of hours, on my own schedule", graphic: "☕" },
  "3-5 hours": { label: "A balanced few hours of focused work", graphic: "⏱️" },
  "5+ hours (self-directed)": { label: "I’d still work a full day—but on my terms", graphic: "📅" },
};

const workTypeOptionContent: Record<Exclude<WorkType, "">, { label: string; graphic: string }> = {
  "remote / online": { label: "Something I can do from anywhere", graphic: "💻" },
  "business / project": { label: "Building a small business or project", graphic: "🚀" },
  "helping others": { label: "Helping or working with people directly", graphic: "🤝" },
  unsure: { label: "I’m still figuring that out", graphic: "🧭" },
};

const priorityOptionContent: Record<Priority, { label: string; graphic: string }> = {
  freedom: { label: "Having control over my time", graphic: "🕊️" },
  "low stress": { label: "Feeling calm and not constantly stressed", graphic: "🌤️" },
  "social life": { label: "Being around people and community", graphic: "🫶" },
  health: { label: "Staying active and feeling physically good", graphic: "💚" },
  "financial growth": { label: "Growing financially", graphic: "📈" },
  simplicity: { label: "Keeping life simple and uncluttered", graphic: "✨" },
};

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
  const [emailFormError, setEmailFormError] = useState("");
  const [questionErrors, setQuestionErrors] = useState<Partial<Record<QuestionKey, string>>>({});
  const [showValidationSummary, setShowValidationSummary] = useState(false);
  const [financialError, setFinancialError] = useState("");

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
    `block cursor-pointer rounded-lg border p-4 shadow-sm transition ${
      selected
        ? "border-blue-500 bg-blue-100"
        : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"
    }`;

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
      "You’re drawn to a relaxed lifestyle near the coast, where life feels lighter and more open.",
    city: "You’re energized by a city lifestyle that balances convenience, movement, and daily variety.",
    mountains:
      "You’re imagining a grounded lifestyle in a quieter setting, with nature and calm built into your day.",
    simple:
      "You’re leaning toward a simple, low-noise lifestyle with less pressure and more room to breathe.",
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
    router.push("/thank-you");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 py-10 text-slate-900 sm:px-6">
      <main className="mx-auto w-full max-w-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
        {step === "intro" ? (
          <section className="space-y-6">
            <p className="text-sm font-medium text-gray-600">Design Your Dream Life</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              What would your life look like if you weren&apos;t tied to a 9–5?
            </h1>
            <p className="text-base leading-7 text-gray-600">
              You&apos;ll answer a few simple questions about your ideal lifestyle. Then we&apos;ll use your
              answers in the next steps to build a personalized picture of what your new life could look
              like.
            </p>
            <button
              type="button"
              onClick={() => setStep("questions")}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Start with your ideal day
            </button>
          </section>
        ) : step === "questions" ? (
          <section className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-gray-600">Step 2 of 7</p>
              <p className="text-base text-gray-600">
                Designing your ideal life starts with getting clear on what you actually want.
              </p>
              <p className="text-base text-gray-600">
                Most people never take the time to do that—they just stay busy.
              </p>
              <p className="text-base text-gray-600">
                In the next few steps, you’ll map out what your day could look like if your time was truly
                your own. Then we’ll show you what that kind of life might look like in Ecuador—and how
                achievable it could be.
              </p>
              <h2 className="text-2xl font-semibold tracking-tight">Your Ideal Day</h2>
              <p className="text-base text-gray-600">Let&apos;s start with a simple question:</p>
              <p className="text-xl font-semibold text-slate-900">
                If your day was truly your own… what would it look like?
              </p>
              <p className="text-sm text-gray-600">
                Don&apos;t overthink it—just go with what feels right.
              </p>
            </div>

            {showValidationSummary && Object.keys(questionErrors).length > 0 && (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">
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
              className={`space-y-3 rounded-xl border bg-blue-50 p-4 outline-none ${
                questionErrors.location ? "border-red-400" : "border-gray-200"
              }`}
            >
              <p className="text-base font-semibold">
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
                    <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-3xl shadow-sm">
                      {locationOptionContent[option].graphic}
                    </span>
                    <span className="text-slate-800">{locationOptionContent[option].label}</span>
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
              className={`space-y-3 rounded-xl border bg-blue-50 p-4 outline-none ${
                questionErrors.workHours ? "border-red-400" : "border-gray-200"
              }`}
            >
              <p className="text-base font-semibold">
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
                    <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-3xl shadow-sm">
                      {workHoursOptionContent[option].graphic}
                    </span>
                    <span className="text-slate-800">{workHoursOptionContent[option].label}</span>
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
              className={`space-y-3 rounded-xl border bg-blue-50 p-4 outline-none ${
                questionErrors.workType ? "border-red-400" : "border-gray-200"
              }`}
            >
              <p className="text-base font-semibold">
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
                    <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-3xl shadow-sm">
                      {workTypeOptionContent[option].graphic}
                    </span>
                    <span className="text-slate-800">{workTypeOptionContent[option].label}</span>
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
              className={`space-y-3 rounded-xl border bg-blue-50 p-4 outline-none ${
                questionErrors.priorities ? "border-red-400" : "border-gray-200"
              }`}
            >
              <p className="text-base font-semibold">
                4. What matters most in your day-to-day life?
              </p>
              <p className="text-sm text-gray-600">(Choose up to two)</p>
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
                    <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-3xl shadow-sm">
                      {priorityOptionContent[option].graphic}
                    </span>
                    <span className="text-slate-800">{priorityOptionContent[option].label}</span>
                  </span>
                </label>
              ))}
              <p className="text-xs text-gray-600">Selected: {priorities.length} of 2</p>
              {questionErrors.priorities && (
                <p className="text-sm font-medium text-red-600">{questionErrors.priorities}</p>
              )}
            </fieldset>

            <fieldset className="space-y-3 rounded-xl border border-gray-200 bg-blue-50 p-4">
              <p className="text-base font-semibold">
                5. You&apos;ve already given a good outline.
                <br />
                This is your chance to make it more real.
              </p>
              <p className="text-sm text-gray-600">
                Is there anything else that&apos;s important to your ideal life?
              </p>
              <p className="text-sm text-gray-600">
                You can take this in any direction, whatever matters to you.
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                <li>what your home feels like</li>
                <li>what your mornings look like</li>
                <li>what you want easy access to</li>
                <li>or anything that didn&apos;t quite fit above</li>
              </ul>
              <textarea
                value={personalNotes}
                onChange={(event) => setPersonalNotes(event.target.value)}
                rows={4}
                placeholder="“I’d love an ocean view in a secure setting, with the ability to walk to beaches, restaurants, and stores. It should feel modern and comfortable, with good access to medical care and a nearby airport.”"
                className="w-full rounded-lg border border-gray-400 bg-white p-4 text-sm text-slate-800 outline-none ring-gray-300 transition focus:ring-2"
              />
            </fieldset>

            <button
              type="button"
              onClick={handleSeeResults}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              See my result
            </button>

            <button
              type="button"
              onClick={() => setStep("intro")}
              className="mt-3 block text-sm font-medium text-gray-600 transition hover:text-gray-800"
            >
              Back to intro
            </button>
          </section>
        ) : step === "results" ? (
          <section className="space-y-6">
            <p className="text-sm font-medium text-gray-600">Step 3 of 5</p>
            <h2 className="text-3xl font-semibold tracking-tight">Here’s what your ideal life could look like</h2>
            <p className="text-base text-gray-600">
              Based on your answers, this is a first picture of the life you&apos;re moving toward.
            </p>

            <div className="space-y-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
              {summarySentences.map((sentence, index) => (
                <div key={index} className="flex items-start gap-3">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-slate-300 bg-white text-2xl shadow-sm">
                    {resultGraphics[index] ?? "✨"}
                  </span>
                  <p className="pt-1 text-base leading-7 text-slate-800">{sentence}</p>
                </div>
              ))}
            </div>

            {estimatedCost && (
              <div className="space-y-2 rounded-xl border border-blue-200 bg-blue-50 p-5">
                <p className="text-sm font-medium text-gray-600">Estimated Monthly Cost in Ecuador</p>
                <p className="text-2xl font-semibold text-slate-900">
                  ${estimatedCost.min}–{estimatedCost.max}
                </p>
                <p className="text-sm text-gray-600">
                  This is a directional range based on your chosen lifestyle location.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setStep("financial")}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Continue
            </button>

            <button
              type="button"
              onClick={() => setStep("questions")}
              className="mt-3 block text-sm font-medium text-gray-600 transition hover:text-gray-800"
            >
              Back to questions
            </button>
          </section>
        ) : step === "financial" ? (
          <section className="space-y-6">
            <p className="text-sm font-medium text-gray-600">Step 4 of 5</p>
            <h2 className="text-3xl font-semibold tracking-tight">Could this lifestyle actually work for you?</h2>
            <p className="text-base text-gray-600">
              Now that you have a clearer picture of the life you want, let&apos;s take a quick look at what
              it might mean financially.
            </p>
            <p className="text-base text-gray-600">
              This doesn&apos;t need to be exact. The goal is simply to help you get a feel for what this
              lifestyle might require and whether it feels within reach.
            </p>

            <section className="space-y-3 rounded-xl border border-gray-200 bg-blue-50 p-4">
              <p className="text-base font-semibold">About how much savings do you currently have?</p>
              <select
                value={savingsRange}
                onChange={(event) => {
                  setSavingsRange(event.target.value as SavingsRange);
                  setFinancialError("");
                }}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none ring-gray-300 transition focus:ring-2"
              >
                <option value="">Select one option</option>
                <option value="Under $10k">Under $10k</option>
                <option value="$10k - $50k">$10k - $50k</option>
                <option value="$50k - $150k">$50k - $150k</option>
                <option value="$150k+">$150k+</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </section>

            <section className="space-y-3 rounded-xl border border-gray-200 bg-blue-50 p-4">
              <p className="text-base font-semibold">
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
                  <span className="text-slate-800">{option}</span>
                </label>
              ))}
            </section>

            {canShowFinancialResults && estimatedCost && estimatedMonthlyNeeded && (
              <section className="space-y-4 rounded-xl border border-blue-200 bg-blue-50 p-5">
                <p className="text-lg font-semibold text-slate-900">What this could look like financially</p>

                <div className="space-y-1 rounded-lg border border-blue-100 bg-white p-4">
                  <p className="text-sm text-gray-600">
                    A lifestyle like the one you described would likely fall in this range:
                  </p>
                  <p className="text-3xl font-semibold text-slate-900">
                    ${estimatedCost.min}–{estimatedCost.max}
                  </p>
                </div>

                {estimatedRunwayMonths !== null ? (
                  <div className="space-y-1 rounded-lg border border-blue-100 bg-white p-4">
                    <p className="text-sm text-gray-600">
                      Based on what you shared, you could likely sustain this lifestyle for about:
                    </p>
                    <p className="text-3xl font-semibold text-slate-900">{formatRunway(estimatedRunwayMonths)}</p>
                  </div>
                ) : (
                  <div className="space-y-1 rounded-lg border border-blue-100 bg-white p-4">
                    <p className="text-sm text-gray-600">
                      Even without estimating your runway, this gives you a useful target for what this
                      lifestyle may require each month.
                    </p>
                  </div>
                )}

                <div className="space-y-1 rounded-lg border border-blue-100 bg-white p-4">
                  <p className="text-sm text-gray-600">
                    To maintain this lifestyle long-term, you&apos;d likely want income of around:
                  </p>
                  <p className="text-3xl font-semibold text-slate-900">${estimatedMonthlyNeeded}</p>
                </div>
              </section>
            )}

            <p className="text-sm leading-6 text-gray-600">
              You do not need to have everything figured out right now. The point is to start turning a
              vague dream into something you can actually see, evaluate, and build toward.
            </p>

            {financialError && <p className="text-sm font-medium text-red-600">{financialError}</p>}

            <button
              type="button"
              onClick={handleContinueFromFinancial}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Continue
            </button>

            <button
              type="button"
              onClick={() => setStep("results")}
              className="mt-3 block text-sm font-medium text-gray-600 transition hover:text-gray-800"
            >
              Back to results
            </button>
          </section>
        ) : (
          <section className="space-y-6">
            <p className="text-sm font-medium text-gray-600">Step 5 of 5</p>
            <h2 className="text-3xl font-semibold tracking-tight">Get your personalized report by email</h2>
            <p className="text-base text-gray-600">
              You&apos;re one step away from turning this into a practical next move. Enter your email and
              we&apos;ll send a clear version of your lifestyle vision so you can revisit it, reflect on it,
              and use it when you&apos;re ready to plan your next chapter.
            </p>
            <p className="text-sm text-gray-600">
              In your report, you&apos;ll get your personalized lifestyle summary, your estimated monthly
              range, and your financial snapshot in one place so you don&apos;t lose momentum.
            </p>

            <section className="space-y-3 rounded-xl border border-gray-200 bg-blue-50 p-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-800">First name</span>
                <input
                  value={firstName}
                  onChange={(event) => {
                    setFirstName(event.target.value);
                    setEmailFormError("");
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none ring-gray-300 transition focus:ring-2"
                  placeholder="Your first name"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-slate-800">Email address</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setEmailFormError("");
                  }}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none ring-gray-300 transition focus:ring-2"
                  placeholder="you@example.com"
                />
              </label>
            </section>

            <section className="space-y-2 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Picture yourself:</p>
              {locationPreference !== "" && workHours !== "" && priorities.length > 0 && (
                <p className="text-sm leading-6 text-slate-800">
                  In an environment that feels like{" "}
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
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Finish
            </button>

            <button
              type="button"
              onClick={() => setStep("financial")}
              className="mt-3 block text-sm font-medium text-gray-600 transition hover:text-gray-800"
            >
              Back to financial snapshot
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
