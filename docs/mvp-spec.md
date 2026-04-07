# MVP Specification — Design Your Dream Life in Ecuador

## 🧭 Overview

This application is a simple, guided experience that helps users:
1. Clarify what their ideal lifestyle looks like
2. See what that lifestyle might cost in Ecuador
3. Understand how financially feasible it is
4. Take a first step toward making it real

It also functions as a **lead-generation tool** for a coaching service that helps people transition to living in Ecuador.

---

## 🧩 Current Implementation Status (Development)

The current build implements the guided flow in the frontend with local state only:

- Landing page
- Questionnaire
- Personalized results summary
- Financial snapshot
- Email capture
- Thank you / next steps page
- Development-only email preview page (`/email-preview`)

Temporary behavior in development:

- No real backend persistence yet
- No real email delivery yet
- Email content is rendered in preview form for testing

---

## 🎯 Objectives

- Help users reflect on their ideal lifestyle
- Make the idea of living in Ecuador feel real and achievable
- Provide a rough financial framework
- Capture high-quality leads with context
- Deliver immediate value via a personalized report

---

## 👤 Target User

Someone who:
- Feels stuck in a 9–5 lifestyle
- Is curious about living abroad
- Wants more freedom, flexibility, or purpose
- Has not yet taken concrete steps toward change

---

## 🔄 User Flow

### Step 1 — Landing Page

**Purpose:** Provide context and reduce friction before asking questions

**Content:**
- Headline: “What would your life look like if you weren’t tied to a 9–5?”
- Short explanation of what the user will do
- CTA: “Start with your ideal day”

---

### Step 2 — Ideal Day Questions

**Purpose:** Capture structured inputs about desired lifestyle

**Inputs:**

1. Location preference (single choice)
   - beach
   - city
   - mountains
   - simple

2. Desired work hours (single choice)
   - none
   - 1–3 hours
   - 3–5 hours
   - 5+ hours (self-directed)

3. Work type (single choice)
   - remote / online
   - business / project
   - helping others
   - unsure

4. Priorities (max 2 selections)
   - freedom
   - low stress
   - social life
   - health
   - financial growth
   - simplicity

---

### Step 3 — Personal Input (Optional)

**Purpose:** Add depth and personalization

**Input:**
- Free-text field

**Prompt:**
“Is there anything else that’s important to your ideal life?”

**Characteristics:**
- Optional
- Open-ended
- No validation required

---

### Step 4 — Lifestyle Summary

**Purpose:** Reflect inputs back to the user in a human way

**Output:**
- 3–5 sentence summary
- Generated using rule-based logic

**Construction:**
- Sentence 1: lifestyle + location tone
- Sentence 2: work structure
- Sentence 3: priorities
- Sentence 4: interpretation
- Sentence 5 (optional): personal text reference

---

### Step 5 — Cost Estimate

**Purpose:** Ground the lifestyle in financial reality

**Output:**
- Estimated monthly cost range

**Mapping:**
- beach → $1200–1500
- city → $1400–1800
- mountains → $1000–1400
- simple → $800–1200

**Additional:**
- Optional comparison to North America

---

### Step 6 — Financial Snapshot

**Purpose:** Show feasibility based on user situation

**Inputs:**

1. Savings (range selection)
2. Remote income status:
   - yes
   - maybe
   - no

**Outputs:**
- Estimated runway (months or years)
- Suggested monthly income target

**Note:**
Calculations are intentionally simple and directional

---

### Step 7 — Email Capture

**Purpose:** Deliver value and capture lead

**Inputs:**
- First name
- Email address

**Output:**
- Confirmation message
- Route to Thank You / Next Steps screen

---

### Step 8 — Thank You / Next Steps (Current Build)

**Purpose:** Confirm completion, reinforce momentum, and present optional coaching CTA

**Includes:**
- Completion confirmation
- Practical next steps
- Calm coaching conversation CTA
- Subtle link to development email preview page

---

## 📩 Email System

### User Email

**Subject:**
Includes user’s first name

**Content:**
- lifestyle summary
- cost estimate
- financial snapshot
- next steps

---

### Coach Notification Email

**Content:**
- name and email
- structured answers
- personal notes
- generated summary
- timestamp

---

## 🗃️ Data Storage

### Lead Record Fields

- id
- created_at
- first_name
- email
- location_preference
- work_hours
- work_type
- priority_1
- priority_2
- personal_notes
- savings_range
- remote_income_status
- generated_summary
- estimated_cost_min
- estimated_cost_max
- estimated_monthly_needed
- estimated_runway
- status (default: new)

---

## ⚙️ Functional Requirements

- The app must guide the user through the full flow without page reloads
- The app must generate a summary from structured inputs
- The app must handle missing optional inputs gracefully

Current build requirement:

- The app must render the two final email drafts (user + coach) on a development preview page without sending real emails

Production target requirement:

- The app must store lead data
- The app must send:
  - one email to the user
  - one email to the coach

---

## 🚫 Non-Functional Requirements

- Keep implementation simple
- Avoid unnecessary dependencies
- Optimize for clarity over features
- Ensure mobile usability
- Ensure easy deployment to Vercel

---

## 🧪 Success Criteria

The MVP is successful if:
- Users complete the flow
- Users say the output feels “accurate” or “interesting”
- Emails are delivered successfully
- Leads are captured with usable context
- The coach can follow up meaningfully

---

## 🔮 Future Enhancements

- AI-generated summaries
- Location recommendations
- Multiple entry funnels
- CRM integration
- Follow-up automation
- Analytics and tracking
- Personalized action plans

---

## 🧠 Guiding Principle

This is not a planning tool.

It is a **clarity tool**.

Its job is to help users move from:
“I want something different”

to:

“This is the kind of life I want—and it might actually be possible.”
