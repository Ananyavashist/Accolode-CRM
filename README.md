# Accolade CRM

A lead management system for real estate brokers in India. Built as the coded prototype for a 0 to 1 product design project, 2024.

**[Live prototype](https://accolade-crm.vercel.app/)** · **[Full case study](https://ananyadesign.me/case-studies/broker-crm-workflow)**

---

## What this repo is

A working front-end prototype of the broker CRM MVP. It runs on seeded data with no backend, and it exists so the workflow can be clicked through rather than described.

The design work behind it (research, system logic, flows, final screens) lives in the case study. This repo is the artifact that lets someone test whether the workflow actually holds up.

---

## Scope

| | |
|---|---|
| **Client** | Accolade, a New York PropTech company entering Indian residential real estate |
| **Timeline** | Aug 2024 to Dec 2024 |
| **Team** | 3 designers, 3 stakeholders |
| **My role** | Product Designer. Research, system logic, flows, UI, and this prototype |
| **Output** | Broker CRM MVP, built and shipped |

---

## The goal

**For the business:** enter a market where they had data and a renter app but no product. Brokers control supply and sit in every transaction, so a tool brokers use daily is the way in. It also makes the existing renter app more valuable, because renter behaviour feeds the CRM and a faster broker makes the renter app better.

**For the broker:** close more deals with less mental load. Know which lead is worth calling today. Stop rebuilding context before every conversation. Stop losing follow-ups. Do all of that without typing anything.

---

## The problem

India's brokerage market is one of the largest in the world and almost entirely undigitised. Over 500,000 brokers operate in it, most record client data by hand, and most hold deals together with memory.

The project started on the assumption that the problem was discovery, meaning renters and buyers lacked good tools to find property. Research pointed somewhere else.

**Brokers were not short of leads. They were losing track of the ones they had.**

Every deal ran across four things: WhatsApp for client conversation, phone for negotiation, spreadsheets for records, and memory for everything else. Memory is what held the other three together, and it fails as soon as a broker has more than a handful of live deals.

That produced four specific failures:

1. **Duplicate leads.** The same person entered more than once from different sources, so history split and counts went wrong.
2. **Repeated requirements.** Clients explained what they wanted again, because no record held it in one place.
3. **No deal visibility.** Nobody could see where a deal stood without asking the broker, and the broker checked their memory.
4. **Lost follow-ups.** "I'll call them Thursday" lived in someone's head. Thursday passed and nothing noticed.

Brokers were spending more time reconstructing context than closing deals. In contextual inquiry, every time a broker picked up a client conversation they spent the first few minutes checking messages, finding the sheet, and remembering what was said. Nobody reports that as a problem, because it feels like the job.

---

## How the direction changed

Before the pivot, we tested an AI preference matching model that scored properties against stated client preferences. Brokers rejected it for three reasons, and those reasons became the brief for everything after:

- **It felt like replacement.** Scoring properties against stated preferences goes around the judgement brokers are paid for.
- **Stated preferences decay.** Client requirements shift within days of starting a search, so a model built on intake data is stale almost immediately.
- **Onboarding cost was fatal.** Anything that takes twenty minutes to learn gets abandoned by a time-constrained broker.

At week four the question changed from *"How do we match renters to properties faster?"* to *"How do we help brokers manage leads faster?"*

| | Before | After |
|---|---|---|
| Scope | A preference matching model | A lead transparency and workflow model |
| Mental model | Match properties | Understand clients and manage changing preferences |
| Product logic | Static intake of data | Behavioural signals tracked over time |

---

## The solution

The CRM is one half of a two-sided system. The renter app captures stated preferences, enquiries and viewing behaviour. Those flow into the broker CRM, which organises them into workflow that supports the broker's decision rather than making it.

### What's built

| Screen | Route | What it does |
|---|---|---|
| Dashboard | `/` | Lead acquisition charts, platform breakdown, property stats |
| Client Leads | `/client-leads` | Lead triage. Intent counts, lead list, detail panel with signals, accept or deprioritise |
| Client Database | `/clients` | All clients with conversion status and progress stage |
| Client Profile | `/clients/:id` | Personal info, onboarding preferences, pinned documents, and a seven-tab record (Overview, Progress History, Notes, Appointments, Documentation, Log History, Legal) |
| Listed Properties | `/listed-properties` | Property inventory with status and type |
| Staff List | `/staff` | Team directory |
| Calendar | `/calendar` | Appointments and events |
| Messages | `/messages` | Client conversations, deep-linked from the client profile |

### Design decisions worth knowing about

**Intent is shown as behavioural signals, not a score.** High, Medium and Low come from observable signals: enquiry submissions, property viewing activity, and whether browsing matches the stated budget. The signals sit on the card so a broker can see what the system reacted to and disagree with it. A score is faster to read, but it is a conclusion, and when the conclusion is wrong the broker has no way to see why.

**The broker decides, the system watches.** Accept or deprioritise, with intent treated as something that changes rather than a fixed property of a person. The system automates the gathering and never the conclusion.

**Deprioritising costs nothing.** Brokers do not clear their pipeline because clearing feels like losing a lead. Deprioritised leads stay in the system and come back when engagement behaviour changes, so clearing has no downside.

**Status tags carry the navigation load.** Stage tags replace filtering and manual sorting, and preference context sits in the table row. Filtering is work, so that job moved into the row and judging a lead no longer means opening a profile.

**Matched properties come to the workflow.** Matches surface inside the lead card rather than requiring a separate search, so there is no second interface to learn and the broker opens a conversation already holding options.

**Behavioural signals are optional, not required.** The CRM's value would otherwise depend entirely on renter app adoption, which the design team does not control. Leads arriving from portals and referrals have no browsing history, so the behaviour panel is empty and the card still works. Take the signals out and it is still lead coordination that beats WhatsApp and a spreadsheet.

---

## Challenges

**No market standard to build on.** Most CRM work has a shape everyone recognises, so structure is nearly free. Here every structural decision was a judgement call with no template, and each one risked imposing a process on people whose flexibility is part of how they work.

**Structure against flexibility.** Brokers work unstructured for a reason, since deals are relationship-driven and every one is different. But without structure nothing is findable. The rule I used: structure only what the system can fill itself. Intake, behavioural signals and stage tags come from the system. Anything needing the broker's read of a client stayed free-form.

**Brokers will not type.** Recording costs time now and pays off later, which is a bad trade when you are busy. The system has to capture passively or the records rot within a week.

**A hard onboarding ceiling.** Every feature spends against the twenty-minute threshold. Each one had to answer two questions: does it reduce a failure we found in research, and can a broker do useful work with it in the first few minutes without being taught. Filtering failed the second question.

**Trust is asymmetric.** One wrong automated call costs more than fifty right ones earn. That is why nothing in the system decides for the broker.

**Cold start.** Behavioural signals need volume and time, so the product is weakest exactly when it has to prove itself.

**Designing for a market I don't live in.** No intuition to check assumptions against, which is why contextual inquiry mattered more here than it would on a product I use myself.

---

## Impact

Tested with 10 brokers against the current-state workflow.

| Result | What it measures | How it was measured |
|---|---|---|
| **68% fewer steps** | Whether the workflow got simpler | Mapped the current-state lead management journey and the same end-to-end task through the MVP. Counted each discrete action as one step: opening a tool, searching, copying information, updating a status, recording a note, scheduling a follow-up |
| **~30% relative increase in lead prioritisation** | Whether brokers could prioritise more leads | Comparable task under baseline conditions against the MVP |
| **Four tools to one workspace** | How many tools the workflow requires | Count of required tools |
| **~50% fewer switching events** | How often a broker crosses between tools during one task | Cross-tool transitions counted during the same task |

Tool count and switching events are kept separate because they measure different things. Four tools can produce six moves, since brokers go back and forth.

Brokers also estimated around six hours a week saved. That is self-reported rather than observed, so it sits below the measured numbers.

**Not claimed:** lead duplication. It was defined as a success metric (duplicate records over total incoming leads, compared before and after) but an MVP does not run long enough to produce reliable lead records. It is a launch KPI.

**What a prototype test cannot show:** whether brokers still use this in month three when a deal is going badly and WhatsApp is faster right now. These numbers describe the workflow, not adoption.

---

## Tech Stack used for prototype

- React 18 + TypeScript
- Vite
- Tailwind CSS with custom design tokens
- React Router
- React Context for state, persisted to `localStorage`
- Seeded data, no backend
  
---

## Structure

```
src/
├── App.tsx                 # routes
├── types.ts                # Lead, Client, stages, statuses
├── pages/                  # one file per screen
├── components/
│   ├── layout/             # sidebar, topbar, app shell
│   ├── ui/                 # cards, badges, dropdowns, avatars
│   ├── charts/             # dashboard visualisations
│   └── modals/             # add client, add event
├── store/
│   ├── CrmContext.tsx      # leads, clients, conversations, actions
│   └── UiContext.tsx       # modal and UI state
├── data/                   # seed data
└── lib/                    # helpers, theme, metrics
```

---

## What would tell me this worked

- Sustained use past the first few weeks, which is where new tools usually die
- Duplicate lead rate falling against a real baseline
- Deprioritised leads getting resurfaced and acted on, which shows the mechanism works rather than being tolerated
- Brokers dropping at least one of the four tools. If they add this on top of WhatsApp and the spreadsheet, the product made things worse

---

Designed and built by [Ananya Vashist](https://ananyadesign.me). Case study: [Multi-Step Broker 0→1 CRM Workflow Management](https://ananyadesign.me/case-studies/broker-crm-workflow).
