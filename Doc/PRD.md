# RailBookPro — Product Requirements Document

## 1. Overview

**Product Name:** RailBookPro  
**Target Market:** India (Indian Railways / IRCTC)  
**Platform:** Web (Responsive)  
**Primary Goal:** Build a complete train ticket booking platform with IRCTC integration, allowing users to search trains, check availability, book tickets, manage bookings, and process cancellations.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14+ (App Router) + TypeScript | SSR, SEO, full-stack React |
| **UI Library** | shadcn/ui + Tailwind CSS | Component library + styling |
| **Design System** | DESIGN.md (BookingFlow from designmd.ai) | Pre-built booking-optimized design tokens |
| **State Mgmt** | React Query / TanStack Query | Server state, caching |
| **Form** | React Hook Form + Zod | Validation |
| **Auth** | NextAuth.js v5 | Authentication |
| **Database** | PostgreSQL (via Docker) | Primary data store |
| **ORM** | Prisma | Type-safe database access |
| **API Integration** | IRCTC-authorized API provider | Railway booking endpoints |
| **Payments** | Razorpay / Cashfree | Indian payment gateway |
| **Docker** | docker-compose | Local dev environment |
| **Container** | Node.js 20 + PostgreSQL 16 | Dev services |

---

## 3. API Provider Analysis (Verification Results)

All API providers were tested. Here are the real findings:

### Provider Status Matrix

| Provider | Read Ops | Book Ops | Sandbox | Status |
|----------|----------|----------|---------|--------|
| **IRCTC Connect** | ✅ Search, Avail, PNR, Tracking | ❌ No booking endpoint | ✅ Free API key | **WORKING (read-only)** |
| **BOS Center** | ✅ All endpoints | ✅ Full booking flow | ✅ Free (needs demo call) | **LEGITIMATE** |

### Key Finding: No Instant Free Sandbox for IRCTC Booking APIs

**IRCTC does not provide any official sandbox/UAT environment for booking.**  
Even professional teams confirm this — see the industry article on Medium (Oct 2025):
> *"IRCTC didn't provide a stable UAT or sandbox for booking APIs. To test train booking flows, we had to perform real bookings on IRCTC's production system."*

**Industry best practice:** Use **WireMock** to mock IRCTC responses after the tentative booking stage. This gives you full control over test scenarios (success, failure, timeout, partial refund) without depending on an unreliable third-party sandbox.

### Recommended Architecture (Dual Provider)

| Operation | Provider | Sandbox | Production |
|-----------|----------|---------|------------|
| **Train Search** | IRCTC Connect | ✅ Free API key (instant) | ✅ Same key |
| **Seat Availability** | IRCTC Connect | ✅ Free API key (instant) | ✅ Same key |
| **PNR Status** | IRCTC Connect | ✅ Free API key (instant) | ✅ Same key |
| **Live Tracking** | IRCTC Connect | ✅ Free API key (instant) | ✅ Same key |
| **Train Info/Schedule** | IRCTC Connect | ✅ Free API key (instant) | ✅ Same key |
| **Ticket Booking** | BOS Center | ✅ Free (onboarding req) | ✅ Commission-based |
| **Cancellation** | BOS Center | ✅ Free (onboarding req) | ✅ Commission-based |
| **Payment** | Razorpay | ✅ Test mode | ✅ Live mode |

### API Endpoints — IRCTC Connect (Read)

```
npm install irctc-connect
```

| Function | Description |
|----------|-------------|
| `searchTrainBetweenStations(from, to)` | Find trains between stations |
| `getAvailability(trainNo, from, to, date, coach, quota)` | Seat availability + fare |
| `checkPNRStatus(pnr)` | Real-time PNR status |
| `getTrainInfo(trainNumber)` | Train route/schedule |
| `trackTrain(trainNumber, date?)` | Live train tracking |
| `liveAtStation(stationCode)` | Live station board |

### API Endpoints — BOS Center (Write)

| Endpoint | Description |
|----------|-------------|
| `POST /api/book` | Book ticket with passenger details |
| `POST /api/cancel` | Cancel ticket with refund |
| `POST /api/tatkal` | Tatkal booking |

### Local Dev Strategy: Mock Layer (WireMock)

Since no IRCTC booking sandbox exists, we use **WireMock** for local development:

```
┌─────────────────────┐
│   Next.js App       │
│   (Docker)          │
└────┬────────────────┘
     │
     ├──→ IRCTC Connect (real) ←── Read operations
     │
     └──→ WireMock (mock) ←── Write operations
               │
               └──→ BOS Center (production only)
```

- **WireMock stubs** simulate: book confirm, PNR generation, refund, cancellation
- Switch to **BOS Center** real endpoints only in production
- This gives deterministic test data without depending on any external sandbox

---

## 4. Design System: BookingFlow (DESIGN.md)

Source: [designmd.ai/chef/bookingflow](https://designmd.ai/chef/bookingflow)

### Token Summary:
- **Primary (#1D4ED8):** CTAs, navigation, active states
- **Secondary (#059669):** Deals, savings indicators
- **Tertiary (#D97706):** Alerts, price changes, urgency
- **Background (#FFFFFF):** Clean light theme
- **Typography:** Clean, readable for data-heavy booking screens

### Design Principles:
- Display prices in monospace for instant scannability
- Max 3 steps to complete booking (Search → Select → Pay)
- Always show total pricing upfront (never hidden)
- Calendar-centric date selection
- Trust signals visible throughout booking flow

### How to Use:
```
Drop DESIGN.md in project root → AI reads design tokens → implements UI consistently
```

---

## 5. Functional Requirements

### 5.1 MVP Features (Phase 1)

| # | Feature | Priority | Description |
|---|---------|----------|-------------|
| F1 | **User Auth** | P0 | Register, login (email/phone), JWT/session |
| F2 | **Train Search** | P0 | Search by source, destination, date, filters (class, quota) |
| F3 | **Seat Availability** | P0 | Real-time availability by class (1AC, 2AC, 3AC, SL, 2S) |
| F4 | **Booking Flow** | P0 | Select train, class, berth → Add passengers → Payment → Confirm |
| F5 | **Payment Integration** | P0 | UPI, Cards, NetBanking, Wallet via Razorpay/Cashfree |
| F6 | **PNR Status** | P0 | Check booking status, seat/berth details |
| F7 | **Cancellation** | P0 | Cancel ticket, refund calculation (as per IRCTC policy) |
| F8 | **Schedule Management** | P1 | View train routes, stoppages, timings |
| F9 | **Admin Dashboard** | P1 | Manage bookings, users, API config, reports |

### 5.2 User Flows

```
Flow: Search → Book → Pay → Confirm
1. User enters source, destination, date
2. System fetches available trains + seat availability
3. User selects train, class, berth preference
4. User enters passenger details (name, age, gender, berth pref)
5. Payment processed via Razorpay/Cashfree
6. Ticket issued → PNR generated → Email/SMS sent
7. Booking visible in "My Bookings"

Flow: Cancel
1. User selects booking from My Bookings
2. System shows refund eligibility (IRCTC policy)
3. User confirms cancellation
4. Refund processed to original payment method
5. PNR cancelled → confirmation sent
```

### 5.3 Pages/Screens

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Search widget, popular routes, offers |
| Search Results | `/search?from=X&to=Y&date=Z` | Train list with availability |
| Seat Layout | `/trains/:id/availability` | Class/berth selection |
| Review Booking | `/booking/review` | Passenger details, fare summary |
| Payment | `/booking/payment` | Payment gateway redirect/embed |
| Confirmation | `/booking/confirm?pnr=X` | Ticket details, download e-ticket |
| My Bookings | `/bookings` | List of past/upcoming bookings |
| Booking Detail | `/bookings/:pnr` | Full booking info + cancel option |
| PNR Status | `/pnr/:pnr` | Real-time PNR status |
| Schedule | `/trains/:id/schedule` | Route/stoppage details |
| Login/Signup | `/auth/*` | Auth pages |
| Admin | `/admin/*` | Dashboard, bookings, users, config |

---

## 6. Technical Architecture

```
┌───────────────────────────────────────┐
│         Next.js App (Docker)          │
│  ┌───────────┐    ┌────────────────┐  │
│  │  Frontend  │    │  API Routes   │  │
│  │  (React)   │    │  (Next.js API)│  │
│  └─────┬─────┘    └───────┬────────┘  │
│        │                  │           │
│  ┌─────┴──────────────────┴────────┐  │
│  │        Server Actions           │  │
│  └──────┬─────────────────────────┘  │
└─────────┼─────────────────────────────┘
          │
    ┌─────┴──────┐       ┌───────────┐
    │ PostgreSQL  │       │  Redis    │
    │ (Prisma)    │       │  (Cache)  │
    └────────────┘       └─────┬─────┘
                               │
    ┌──────────────────────────┴──────────────┐
    │           API Adapter Layer             │
    │  ┌───────────┐  ┌──────────┐  ┌──────┐ │
    │  │IRCTC Conn.│  │WireMock  │  │BOS   │ │
    │  │(Read)     │  │(Dev Mock)│  │(Prod)│ │
    │  └───────────┘  └──────────┘  └──────┘ │
    └──────────────────┬─────────────────────┘
                       │
          ┌────────────┴──────────────┐
          │  Razorpay (Payment)       │
          └───────────────────────────┘
```

### Docker Setup:
```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    depends_on: [db, redis]
    env_file: .env.local
  db:
    image: postgres:16
    volumes: [pgdata:/var/lib/postgresql/data]
  redis:
    image: redis:7-alpine
```

---

## 7. Data Model (Prisma)

```prisma
model User {
  id        String    @id @default(cuid())
  name      String?
  email     String?   @unique
  phone     String    @unique
  bookings  Booking[]
  createdAt DateTime  @default(now())
}

model Booking {
  id           String          @id @default(cuid())
  pnr          String          @unique
  userId       String
  user         User            @relation(fields: [userId], references: [id])
  trainNumber  String
  trainName    String
  fromStation  String
  toStation    String
  travelDate   DateTime
  class        String          // 1AC, 2AC, 3AC, SL, 2S
  quota        String          // GN, TQ, LD, etc.
  status       BookingStatus   @default(CONFIRMED)
  totalFare    Float
  passengers   Passenger[]
  createdAt    DateTime        @default(now())
}

model Passenger {
  id          String   @id @default(cuid())
  bookingId   String
  booking     Booking  @relation(fields: [bookingId], references: [id])
  name        String
  age         Int
  gender      String
  berthPref   String?  // LB, MB, UB, SL, SU
  seatInfo    String?  // S4/34-LB
}
```

---

## 8. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Responsiveness** | Mobile-first, works on all screen sizes (320px+) |
| **Performance** | Lighthouse score > 85, API response < 2s |
| **SEO** | SSR for public pages, proper meta tags |
| **Security** | HTTPS, JWT auth, rate limiting, input sanitization |
| **Docker** | One-command startup: `docker compose up` |
| **Database** | PostgreSQL with Prisma migrations |
| **Error Handling** | Graceful fallbacks, user-friendly error messages |
| **API Resilience** | Retry logic, cache IRCTC responses (Redis), queue booking requests |

---

## 9. Development Phases

### Phase 1 (MVP) — 4-6 weeks
- [ ] Project scaffolding (Next.js + Prisma + Docker)
- [ ] DESIGN.md integration (BookingFlow tokens)
- [ ] WireMock setup (mock IRCTC booking responses)
- [ ] IRCTC Connect integration (real search, availability, PNR)
- [ ] User auth (NextAuth)
- [ ] Train search + availability
- [ ] Booking flow + payment (uses WireMock in dev)
- [ ] PNR status + cancellation (uses WireMock in dev)
- [ ] Docker compose for local dev
- [ ] Basic admin dashboard

### Phase 2 (Enhance) — 2-3 weeks
- [ ] Schedule management
- [ ] Tatkal booking support
- [ ] Email/SMS notifications
- [ ] Advanced admin dashboard (reports, analytics)
- [ ] Redis caching layer

### Phase 3 (Scale)
- [ ] Waitlist management
- [ ] Multi-language support
- [ ] PWA / mobile app
- [ ] Agent / distributor panel
- [ ] Bus booking extension

---

## 10. Confirmed Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Region** | India (IRCTC) | Selected by stakeholder |
| **Tech Stack** | Next.js + TypeScript | Best DX, SSR, API routes |
| **Design System** | DESIGN.md (BookingFlow) | 454+ systems, booking-optimized, AI-ready |
| **Read API** | IRCTC Connect | Proven working, free key, instant access |
| **Write API** | BOS Center | Legitimate booking provider for production |
| **Dev Mock** | WireMock | Simulates booking/cancel locally without sandbox |
| **Payments** | Razorpay | Indian-optimized, UPI/Cards/NB |
| **Local Dev** | Docker Compose | One-command setup, reproducible |
| **Responsiveness** | Mobile-first responsive | All pages adapt 320px+ |

---

## 11. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| No official IRCTC booking sandbox | High | WireMock for local dev; BOS sandbox for UAT |
| IRCTC API rate limits | High | Redis caching, queue booking requests |
| IRCTC API changes | Medium | Abstract adapter layer, versioned per provider |
| Payment failures | High | Idempotency keys, retry logic |
| Tatkal slot contention | Medium | Pre-fill passenger data, fast checkout |
| BOS Center onboarding delay | Medium | Start BOS onboarding in Week 1; use WireMock until ready |
| WireMock vs production mismatch | Low | Validate with BOS sandbox before going live |

---

## 12. Next Steps

1. [ ] Download BookingFlow DESIGN.md from designmd.ai → place in project root
2. [ ] Sign up for IRCTC Connect (irctc.rajivdubey.tech) → get free API key
3. [ ] Set up WireMock with IRCTC stub responses for local dev
4. [ ] Initiate BOS Center onboarding for production booking
5. [ ] Scaffold Next.js + shadcn/ui + Prisma + Docker
6. [ ] Implement train search + availability (IRCTC Connect)
7. [ ] Implement booking flow (WireMock in dev → BOS in prod)
8. [ ] Implement PNR + cancellation
9. [ ] Add admin dashboard
10. [ ] Docker Compose verification (`docker compose up`)
