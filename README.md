# Design Your Dream Life in Ecuador

A simple web app that helps people visualize their ideal lifestyle and see what it could realistically look like in Ecuador.

This is a lead-generation tool designed to:
- help users clarify what they want
- show them a rough cost of living in Ecuador
- give them a simple path forward
- capture leads for follow-up coaching

---

## 🧭 What This App Does

The app walks users through a short experience:

1. Describe their ideal day (location, work, priorities)
2. Add personal details in their own words (optional)
3. See a personalized lifestyle summary
4. View estimated cost of living in Ecuador
5. Check financial runway based on savings/income
6. Enter email to receive a personalized report

---

## 🎯 Goal

Turn a vague idea ("I want a different life") into something:
- clear
- personal
- financially grounded
- actionable

---

## 🧱 MVP Scope

This is intentionally simple.

### Included:
- Landing page with intro
- Guided questionnaire
- Optional open-text personalization
- Rule-based summary generation (no AI required)
- Cost estimate (based on lifestyle type)
- Financial snapshot (basic calculation)
- Email capture
- Thank You / Next Steps page
- Development email preview page (user + coach drafts)

### Not included (yet):
- Advanced personalization
- Real lead storage (Supabase integration pending)
- Real email sending (Resend integration pending)
- CRM integrations
- Automation sequences
- Complex financial modeling
- Location-specific recommendations

---

## ⚙️ Tech Stack

- Next.js (App Router)
- Tailwind CSS
- Supabase (lead storage)
- Resend (email delivery)
- Vercel (deployment)

---

## 🧠 How Summary Generation Works

The app uses simple rule-based logic:

Inputs:
- location preference
- work hours
- work type
- priorities
- optional personal notes

These are mapped to phrases and combined into a short summary:

Example output:

> You’re aiming for a slower, more relaxed lifestyle, likely near the coast.  
> Your time is mostly your own, with a few hours of flexible work each day.  
> You value freedom and low stress, with a focus on enjoying your time.

If personal input is provided, it is incorporated into the output.

---

## 💰 Cost Estimates

Rough monthly ranges:

- Beach: $1200–1500  
- City: $1400–1800  
- Mountains: $1000–1400  
- Simple: $800–1200  

These are intentionally broad and meant for orientation, not precision.

---

## 📩 Email Flow

When a user submits their email:

1. Their responses are saved in local app state/session (development only)
2. A personalized report draft is generated
3. The app shows:
   - Thank You / Next Steps page
   - Development Email Preview page
4. The preview renders the two email drafts that will later be sent:
   - user email draft with:
   - summary
   - cost estimate
   - financial snapshot
   - next steps
   - coach notification draft with lead details

---

## 🗃️ Lead Data (MVP)

Current (development):

- Lead data is kept locally in app state and session storage for flow continuity and email preview rendering.

Target (when backend is enabled):

- name
- email
- questionnaire responses
- personal notes
- generated summary
- cost estimate
- financial snapshot
- timestamp
- status (new, contacted, etc.)

---

## 🚀 Running Locally

```bash
npm install
npm run dev
```

Then open:

- `/` for the main experience
- `/thank-you` for the post-submit page
- `/email-preview` for development-only email rendering
