# My Weather — Next.js Project Structure
## Domain: myweather.ai.studio

---

## Stack
- **Frontend/Backend:** Next.js 14+ (App Router)
- **Auth + DB:** Firebase (Authentication + Firestore)
- **API key management:** Server-side only, via Next.js API routes / Server Actions (never exposed to client)
- **Hosting:** Vercel (recommended for Next.js App Router)
- **SEO:** JSON-LD Schema.org, dynamic `sitemap.ts`, `robots.ts`, Open Graph, Twitter Cards
- **Comments & Ratings:** Firestore-based with admin moderation + auto-spam filter
- **Pro Tier:** Multiple API provider management with enable/disable toggles per user plan

---

## SEO Strategy — Page Titles & Meta Descriptions

Every page uses `generateMetadata()` with high-volume, intent-matched keywords.

| Route | Title (≤60 chars) | Meta Description (≤160 chars) |
|---|---|---|
| `/` | My Weather — Free Live Weather Forecast & Radar | Get accurate live weather forecasts, real-time radar maps, air quality index, and UV alerts for any city worldwide. Free, fast, and no signup required. |
| `/forecast` | 10-Day Weather Forecast — Hourly & Daily | Plan ahead with our detailed 10-day weather forecast and 48-hour hourly predictions. Temperature, precipitation, wind speed, and humidity for any location. |
| `/radar` | Live Weather Radar Map — Real-Time Precipitation | Track storms and rain in real-time with our interactive weather radar map. Live precipitation, cloud cover, and severe weather alerts worldwide. |
| `/air-quality` | Air Quality Index (AQI) — Pollution & Health Alerts | Check real-time air quality index, PM2.5, PM10, ozone levels, and pollen counts. Get health recommendations and pollution alerts for your area. |
| `/about` | About My Weather — Accurate Free Weather App | Learn how My Weather delivers hyperlocal forecasts using multiple free global data sources. Built for accuracy, speed, and zero cost to users. |
| `/terms` | Terms of Use — My Weather | Read the terms and conditions for using My Weather. By accessing our free weather forecast platform, you agree to these terms. |
| `/privacy` | Privacy Policy — My Weather | We respect your privacy. Learn how My Weather collects, uses, and protects your personal data when you use our free weather services. |
| `/contact` | Contact Us — My Weather Support | Have questions or feedback? Contact the My Weather team. We respond to all inquiries about forecasts, features, and technical support. |
| `/login` | Log In — My Weather Account | Sign in to your My Weather account to save locations, customize units, and access personalized weather alerts and dashboard features. |
| `/signup` | Sign Up — Free My Weather Account | Create a free My Weather account. Save favorite cities, set weather alerts, and unlock personalized forecasts and air quality tracking. |
| `/reset-password` | Reset Password — My Weather Account | Forgot your password? Reset it securely to regain access to your saved locations, preferences, and personalized weather dashboard. |
| `/dashboard` | My Weather Dashboard — Saved Locations & Alerts | Manage your saved cities, weather alerts, and account preferences. Your personalized weather command center. |
| `/settings` | Account Settings — Theme, Units & Notifications | Customize your My Weather experience. Change temperature units, time format, theme, and notification preferences. |
| `/admin` | Admin Dashboard — My Weather Management | Admin overview: user management, API configuration, feature flags, comment moderation, and platform analytics. |
| `/admin/users` | Manage Users — My Weather Admin | View, edit, and manage registered users. Assign roles, monitor activity, and handle account issues from the admin panel. |
| `/admin/api-config` | API Configuration — Provider Keys & Load Balancer | Manage multiple weather API providers, monitor usage quotas, add backup keys, and configure load balancing across free-tier sources. |
| `/admin/features` | Feature Flags — Enable/Disable Pro Features | Toggle platform features, manage Pro tier access, control beta rollouts, and configure app-wide settings from the admin panel. |
| `/admin/comments` | Comment Moderation — Review & Approve Ratings | Moderate user comments and ratings. Auto-detected spam, pending approvals, and edit/approve workflow for user-generated content. |
| `/integrations` | Weather API Integrations — Data Sources | Discover the free and premium weather APIs powering My Weather. View provider details, coverage, and integration status. |

---

## JSON-LD Schema Implementation

### Global Schemas (injected in root `layout.tsx`)

**1. Organization Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "My Weather",
  "url": "https://myweather.ai.studio",
  "logo": "https://myweather.ai.studio/logo.png",
  "sameAs": [
    "https://twitter.com/myweather",
    "https://github.com/myweather"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer support",
    "url": "https://myweather.ai.studio/contact"
  }
}
```

**2. WebSite Schema (with Sitelinks Searchbox)**
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "My Weather",
  "url": "https://myweather.ai.studio",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://myweather.ai.studio/?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

### Per-Page Schemas

**Homepage — LocalBusiness + AggregateRating**
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "My Weather",
  "applicationCategory": "WeatherApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "1280",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```

**Forecast Page — WeatherForecast Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "WeatherForecast",
  "name": "10-Day Weather Forecast",
  "provider": {
    "@type": "Organization",
    "name": "My Weather"
  }
}
```

**FAQ Page — FAQPage Schema**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is My Weather completely free?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, My Weather is 100% free to use. We source data from multiple free weather APIs with no credit card required."
      }
    },
    {
      "@type": "Question",
      "name": "How accurate are the weather forecasts?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "My Weather aggregates data from Open-Meteo, OpenWeatherMap, WeatherAPI.com, and other providers to deliver highly accurate hyperlocal forecasts."
      }
    }
  ]
}
```

**BreadcrumbList Schema** (on every page)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://myweather.ai.studio/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Forecast",
      "item": "https://myweather.ai.studio/forecast"
    }
  ]
}
```

---

## Folder Structure

```
my-weather/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                        # Home — live weather dashboard
│   │   ├── forecast/page.tsx               # 10-day / 48-hour forecast
│   │   ├── radar/page.tsx                  # Live radar map
│   │   ├── air-quality/page.tsx            # AQI details & pollen
│   │   ├── about/page.tsx                  # About the app
│   │   ├── terms/page.tsx                  # Terms of Use
│   │   ├── privacy/page.tsx                # Privacy Policy
│   │   ├── contact/page.tsx                # Contact form
│   │   ├── integrations/page.tsx           # Public API integrations list
│   │   └── layout.tsx                      # Public layout with Navbar + Footer
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── reset-password/page.tsx
│   │   └── layout.tsx                      # Auth layout (clean, centered)
│   │
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx              # User's saved locations, alerts
│   │   ├── settings/page.tsx               # Theme, units, time format, notifications
│   │   └── layout.tsx                      # Requires auth, sidebar nav
│   │
│   ├── (admin)/
│   │   ├── admin/page.tsx                  # Admin overview (stats, charts)
│   │   ├── admin/users/page.tsx            # Manage users (table, roles, ban)
│   │   ├── admin/api-config/page.tsx       # Manage API keys & load balancer
│   │   ├── admin/features/page.tsx         # Feature flags (Pro toggles)
│   │   ├── admin/comments/page.tsx         # Comment moderation queue
│   │   └── layout.tsx                      # Requires admin role, admin sidebar
│   │
│   ├── api/
│   │   ├── weather/route.ts                # Proxies Open-Meteo / fallback chain
│   │   ├── forecast/route.ts               # Multi-provider forecast aggregation
│   │   ├── radar/route.ts                  # Proxies RainViewer tile URLs
│   │   ├── alerts/route.ts                 # Proxies NWS / global alerts
│   │   ├── air-quality/route.ts            # AQI data proxy
│   │   ├── geocode/route.ts                # Proxies Open-Meteo geocoding
│   │   ├── comments/route.ts               # CRUD for comments + ratings
│   │   ├── admin/
│   │   │   ├── users/route.ts              # Admin: list/edit users
│   │   │   ├── features/route.ts           # Admin: toggle feature flags
│   │   │   ├── api-keys/route.ts           # Admin: CRUD API keys
│   │   │   └── comments/route.ts           # Admin: moderate comments
│   │   └── sitemap.ts                      # Dynamic sitemap generation
│   │
│   ├── robots.ts                           # Dynamic robots.txt
│   ├── layout.tsx                          # Root layout + global JSON-LD
│   └── globals.css
│
├── components/
│   ├── weather/
│   │   ├── CurrentConditions.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── DailyForecast.tsx
│   │   ├── AirQualityCard.tsx
│   │   ├── UVIndexCard.tsx
│   │   ├── PollenCountCard.tsx
│   │   ├── RadarMap.tsx
│   │   ├── AlertBanner.tsx
│   │   └── WeatherSearch.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── ThemeToggle.tsx
│   │   ├── MobileMenu.tsx
│   │   └── Breadcrumbs.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   └── SocialAuthButtons.tsx
│   ├── admin/
│   │   ├── UserTable.tsx
│   │   ├── FeatureToggleList.tsx
│   │   ├── ApiKeyManager.tsx
│   │   ├── UsageMonitor.tsx
│   │   ├── CommentModerationQueue.tsx
│   │   └── AdminStatsCards.tsx
│   ├── comments/
│   │   ├── CommentSection.tsx
│   │   ├── CommentCard.tsx
│   │   ├── RatingStars.tsx
│   │   ├── CommentForm.tsx
│   │   └── SpamBadge.tsx
│   └── seo/
│       ├── JsonLd.tsx                      # Reusable JSON-LD injector
│       ├── OrganizationSchema.tsx
│       ├── BreadcrumbSchema.tsx
│       └── FaqSchema.tsx
│
├── lib/
│   ├── firebase/
│   │   ├── client.ts                       # Firebase client SDK init
│   │   ├── admin.ts                        # Firebase Admin SDK init (server-only)
│   │   └── auth.ts                         # Auth helpers (login, signup, session)
│   ├── api/
│   │   ├── openMeteo.ts                    # Open-Meteo fetch wrapper
│   │   ├── openWeatherMap.ts               # OpenWeatherMap fetch wrapper
│   │   ├── weatherApiCom.ts                # WeatherAPI.com fetch wrapper
│   │   ├── tomorrowIo.ts                   # Tomorrow.io fetch wrapper
│   │   ├── visualCrossing.ts               # Visual Crossing fetch wrapper
│   │   ├── rainviewer.ts                   # RainViewer tile proxy
│   │   ├── nws.ts                          # NWS alerts proxy
│   │   └── loadBalancer.ts                 # Multi-key + multi-provider router
│   ├── comments/
│   │   ├── spamDetector.ts                 # Auto-detect links/spam in comments
│   │   └── moderation.ts                   # Admin moderation helpers
│   └── utils/
│       ├── units.ts                        # Metric/imperial conversion
│       ├── formatDate.ts
│       └── seo.ts                          # Metadata generators
│
├── middleware.ts                           # Route protection (dashboard/admin)
├── .env.local                              # Server-only secrets
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── next.config.js
└── package.json
```

---

## Firebase Setup

### Authentication
- Email/password + Google sign-in + GitHub sign-in (optional)
- Custom claims for roles: `role: "user" | "admin"`

### Firestore Collections

```
users/{uid}
  - email, displayName, photoURL
  - role: "user" | "admin" (default: "user")
  - plan: "free" | "pro" | "enterprise" (default: "free")
  - savedLocations: [{ name, lat, lon, country }]
  - preferences: { theme, units, timeFormat, language }
  - createdAt, lastLoginAt

featureFlags/{flagId}
  - name: string
  - enabled: boolean
  - description: string
  - scope: "global" | "pro" | "admin"

appConfig/apiStatus
  - openMeteoEnabled: boolean
  - openWeatherMapEnabled: boolean
  - weatherApiComEnabled: boolean
  - tomorrowIoEnabled: boolean
  - visualCrossingEnabled: boolean
  - rainviewerEnabled: boolean
  - nwsEnabled: boolean

apiKeys/{keyId}
  - provider: "openweathermap" | "weatherapi" | "tomorrowio" | "visualcrossing"
  - label: string                          # e.g. "Key #1 — Production"
  - key: string                            # AES-encrypted, server-only
  - dailyLimit: number
  - callsToday: number
  - resetAt: timestamp
  - status: "active" | "disabled" | "exhausted"
  - priority: number                       # Lower = tried first
  - createdAt, updatedAt

comments/{commentId}
  - userId: string
  - userName: string
  - userPhotoURL: string
  - pageUrl: string                        # e.g. "/forecast"
  - rating: number                         # 1–5 stars
  - text: string
  - status: "pending" | "approved" | "rejected" | "spam"
  - hasLinks: boolean                      # auto-detected
  - detectedLinks: string[]                # extracted URLs
  - adminNote: string                      # moderator note
  - createdAt, updatedAt
  - approvedAt, approvedBy: string

ratings/aggregate/{pageUrl}
  - averageRating: number
  - totalReviews: number
  - distribution: { "1": n, "2": n, "3": n, "4": n, "5": n }
```

### Security Rules
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own doc
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    // Admins can read/write any user
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.token.role == "admin";
    }
    // Feature flags: read for all, write only admin
    match /featureFlags/{flagId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == "admin";
    }
    // App config: read for all, write only admin
    match /appConfig/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.role == "admin";
    }
    // API keys: server-only (no client access)
    match /apiKeys/{keyId} {
      allow read, write: if false;
    }
    // Comments: read approved only, write own pending only
    match /comments/{commentId} {
      allow read: if resource.data.status == "approved";
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid
        && request.resource.data.status == "pending";
      allow update, delete: if request.auth != null && request.auth.token.role == "admin";
    }
    // Admin can read all comments
    match /comments/{commentId} {
      allow read: if request.auth != null && request.auth.token.role == "admin";
    }
  }
}
```

---

## Free Weather APIs — No Credit Card Required

| Provider | Free Tier | Auth | Coverage | Best For |
|---|---|---|---|---|
| **Open-Meteo** | Unlimited (non-commercial) | None | Global | Default fallback, no rate limits |
| **OpenWeatherMap** | 1,000 calls/day | API key | Global | Current conditions, One Call 3.0 |
| **WeatherAPI.com** | 1M calls/month | API key | Global | Simple JSON, historical data |
| **Tomorrow.io** | 500 calls/day | API key | Global | AI-driven, hyperlocal, severe alerts |
| **Visual Crossing** | 1,000 records/day | API key | Global | Historical data, CSV export |
| **RainViewer** | Unlimited | None | Global | Live radar tiles, precipitation |
| **NWS (US)** | Unlimited | None | United States | Official US alerts, forecasts |
| **MET Norway** | Unlimited | User-Agent | Global | Government-backed, stable |

> **Strategy:** Use Open-Meteo as the zero-config default. Layer in API-key providers via the load balancer for redundancy and richer data. If all keyed providers exhaust their limits, fall back to Open-Meteo or MET Norway.

---

## Multi-Provider Load Balancer

**Goal:** Route each request to the healthiest API key/provider. If one fails or hits its limit, automatically try the next.

### Load Balancer Logic (`lib/api/loadBalancer.ts`)

1. **Priority Sort:** Active keys sorted by `priority` (lowest first), then by usage ratio `callsToday / dailyLimit` (lowest first).
2. **Provider Fallback:** If a provider's keys are all exhausted/disabled, fall to the next provider in the chain:
   ```
   OpenWeatherMap → WeatherAPI.com → Tomorrow.io → Visual Crossing → Open-Meteo (fallback)
   ```
3. **Usage Tracking:** After each successful call, increment `callsToday`. Reset all counters nightly via a Vercel Cron Job or Firebase Scheduled Function.
4. **Circuit Breaker:** If a provider returns 5xx errors 3 times in a row, mark it `disabled` for 10 minutes.
5. **Response Merging:** For forecast pages, optionally merge/enrich data from multiple providers (e.g., use OpenWeatherMap for current + WeatherAPI for hourly + Tomorrow.io for alerts).

### Admin API Key Manager UI

On `admin/api-config`, display each key as a card with health, limits, actions, and key tutorials.

---

## Comment & Rating System

### User Flow

1. **Authenticated user** visits any page (e.g., `/forecast`).
2. Sees existing **approved** comments + average rating.
3. Clicks **"Write a Review"** → opens modal with:
   - 5-star rating selector
   - Textarea for comment (max 500 chars)
   - Submit button
4. On submit:
   - `spamDetector.ts` scans text for URLs (`https?://`, `www.`, TLD patterns).
   - If links found → `status: "spam"`, `hasLinks: true`, `detectedLinks: [urls]`.
   - If no links → `status: "pending"`.
   - Admin receives notification.
5. Comment is **not visible** until admin approves.

### Admin Moderation Flow (`admin/comments`)
Filter tabs, approval/rejection actions, spam detection alerts, and moderation options.
