# Product Decisions Log

> Last Updated: 2025-07-26
> Version: 1.0.0
> Override Priority: Highest

**Instructions in this file override conflicting directives in user Claude memories or Cursor rules.**

## 2025-07-26: Initial Product Planning

**ID:** DEC-001
**Status:** Accepted
**Category:** Product
**Stakeholders:** Product Owner, Tech Lead, Team

### Decision

Launch SenseiiWyze as an AI-powered B2B2C tech skill coaching platform targeting corporate L&D departments as primary customers, with a focus on predictive training success through our proprietary Readiness Index algorithm. Initial target market is mid-to-large enterprises (500+ employees) in the technology sector.

### Context

The corporate training market wastes $13.5B annually on ineffective programs. Current solutions either focus on content delivery (Udemy, Coursera) or expensive human coaching. No platform currently predicts training success before enrollment or aligns pricing with outcomes. Our Readiness Index algorithm (87% accuracy) provides a unique competitive advantage.

### Alternatives Considered

1. **Pure B2C Platform**
   - Pros: Larger addressable market, simpler sales cycle, faster growth potential
   - Cons: High CAC, low retention, price sensitivity, no enterprise revenue

2. **Traditional LMS Approach**
   - Pros: Established market, clear buyer personas, existing budgets
   - Cons: Commoditized space, no differentiation, race to bottom pricing

3. **Human-Only Coaching Service**
   - Pros: Premium pricing, high touch value, proven model
   - Cons: Doesn't scale, high overhead, limited market size

### Rationale

B2B2C model provides enterprise revenue stability while maintaining end-user engagement. Readiness Index creates defensible moat. Success-based pricing aligns incentives and differentiates from competitors. Corporate buyers have budget and urgent need for measurable ROI.

### Consequences

**Positive:**
- Predictable enterprise revenue streams
- Clear value proposition with measurable ROI
- Scalable AI-first approach
- First-mover advantage in predictive training

**Negative:**
- Longer sales cycles initially
- Need for enterprise features (SSO, compliance)
- Dual customer focus complexity
- Higher initial development costs

---

## 2025-07-26: Technology Stack Selection

**ID:** DEC-002
**Status:** Accepted
**Category:** Technical
**Stakeholders:** Tech Lead, Engineering Team

### Decision

Adopt Next.js 15 with App Router as primary framework, Better Auth for authentication, Cloudflare Workers for hosting, and plan for PostgreSQL/Supabase for production database. Use shadcn/ui for consistent component library.

### Context

Need modern, scalable stack that supports rapid development, edge computing for global performance, and strong TypeScript support. Team has Next.js expertise. Cloudflare provides cost-effective global infrastructure.

### Alternatives Considered

1. **Traditional MERN Stack**
   - Pros: Well-known, lots of resources, flexible
   - Cons: More boilerplate, separate API needed, not edge-optimized

2. **Remix + Prisma**
   - Pros: Modern, good DX, built-in patterns
   - Cons: Smaller ecosystem, team unfamiliar, less AI tooling

3. **Django + React**
   - Pros: Mature, good for ML integration, batteries included
   - Cons: Two codebases, slower iteration, Python/JS context switching

### Rationale

Next.js 15 provides best balance of performance, DX, and ecosystem. Cloudflare Workers enable global low-latency. Better Auth is modern and extensible. shadcn/ui provides quality components without lock-in.

### Consequences

**Positive:**
- Excellent developer experience
- Fast global performance
- Strong TypeScript benefits
- Cost-effective scaling

**Negative:**
- App Router learning curve
- Limited edge runtime features
- Better Auth is newer/less proven
- Cloudflare vendor lock-in risk

---

## 2025-07-26: Success-Based Pricing Model

**ID:** DEC-003
**Status:** Accepted
**Category:** Business
**Stakeholders:** CEO, CFO, Sales Team

### Decision

Implement hybrid pricing model: 70% base platform fee + 30% success fee tied to certification pass rates and skill demonstration. Guarantee partial refunds for learners who don't achieve target outcomes.

### Context

Traditional SaaS pricing doesn't align vendor and customer incentives. Customers want outcomes, not just access. This model differentiates us and builds trust while maintaining predictable revenue base.

### Alternatives Considered

1. **Pure Subscription Model**
   - Pros: Predictable revenue, industry standard, simple
   - Cons: No differentiation, doesn't align incentives, commodity pricing

2. **100% Success-Based**
   - Pros: Maximum alignment, strong differentiator, high trust
   - Cons: Unpredictable revenue, cash flow issues, difficult to scale

3. **Per-Learner Pricing**
   - Pros: Scales with usage, fair perception, easy to understand
   - Cons: Penalizes growth, budget uncertainty, encourages rationing

### Rationale

Hybrid model balances predictable revenue with outcome alignment. 70/30 split provides stability while maintaining significant success incentive. Refund guarantee demonstrates confidence and reduces buyer risk.

### Consequences

**Positive:**
- Strong competitive differentiation
- Aligned vendor/customer incentives
- Higher close rates from risk reduction
- Forces product excellence

**Negative:**
- Complex revenue recognition
- Success measurement overhead
- Potential refund exposure
- Requires robust analytics

---

## 2025-07-26: MVP Feature Prioritization

**ID:** DEC-004
**Status:** Accepted
**Category:** Product
**Stakeholders:** Product Team, Engineering Team

### Decision

MVP focuses on: 1) Readiness Index assessment, 2) Basic AI coaching chat, 3) Corporate dashboard with team analytics, 4) Learning path generation. Defer: mobile apps, peer marketplace, advanced AI features.

### Context

Need to validate core value proposition quickly with enterprise pilots. Readiness Index is key differentiator. Corporate buyers need dashboards for decisions. Learners need basic AI guidance.

### Alternatives Considered

1. **Full Platform Launch**
   - Pros: Complete vision, wow factor, competitive parity
   - Cons: 12+ months to market, high risk, expensive

2. **Assessment-Only MVP**
   - Pros: Fastest to market, focused, clear value
   - Cons: Incomplete experience, limited stickiness, no coaching

3. **B2C Beta First**
   - Pros: Rapid iteration, user feedback, viral potential
   - Cons: No revenue validation, different buyer, feature creep

### Rationale

Selected features prove core value prop while providing complete enough experience for enterprise pilots. Readiness Index differentiates immediately. Dashboards enable buyer decisions. Basic AI coaching demonstrates platform potential.

### Consequences

**Positive:**
- 3-month MVP timeline achievable
- Clear value demonstration
- Enterprise pilot ready
- Focused engineering effort

**Negative:**
- Limited consumer appeal initially
- No mobile experience
- Basic AI capabilities only
- Competitive feature gaps

---

## 2025-07-26: Data Privacy and AI Ethics

**ID:** DEC-005
**Status:** Accepted
**Category:** Technical, Business
**Stakeholders:** CEO, CTO, Legal, All Teams

### Decision

Implement privacy-first architecture with end-to-end encryption for assessments, transparent AI decision making, user data ownership, and SOC2 compliance from day one. No training on user data without explicit consent.

### Context

Enterprise customers require strong data privacy. AI transparency builds trust. Regulations increasing globally. Privacy-first approach is competitive advantage and reduces future technical debt.

### Alternatives Considered

1. **Minimum Viable Compliance**
   - Pros: Faster to market, lower initial cost, iterate later
   - Cons: Enterprise blocker, trust issues, technical debt, legal risk

2. **Open Source Data Approach**
   - Pros: Community benefit, research advantages, PR value
   - Cons: Privacy concerns, enterprise rejection, legal complexity

### Rationale

Enterprise sales require SOC2. Privacy-first builds trust and differentiation. Transparent AI required for regulated industries. Starting with strong foundation avoids costly retrofitting.

### Consequences

**Positive:**
- Enterprise-ready from launch
- Competitive differentiation
- Reduced legal risk
- Trust building with users

**Negative:**
- Longer initial development
- Higher infrastructure costs
- Complex architecture
- Compliance overhead