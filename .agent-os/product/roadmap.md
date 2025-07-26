# Product Roadmap

> Last Updated: 2025-07-26
> Version: 1.0.0
> Status: Planning

## Timeline Overview

### Weekend Sprint (Next 2 days)
**Focus:** Authentication completion and basic dashboard structure
**Goal:** Fully functional auth system with role-based routing

### Week 1 (Days 3-7)
**Focus:** Core dashboard implementation for all user types
**Goal:** Working dashboards with real data flow

### Month 1 (Weeks 2-4)
**Focus:** Readiness Index MVP and basic AI coaching
**Goal:** First paying pilot customer

### Quarter 1 (Months 2-3)
**Focus:** Enterprise features and scale testing
**Goal:** 10 enterprise customers, $100K MRR

### Year 1 (Months 4-12)
**Focus:** Full platform maturity and market expansion
**Goal:** $2.5M ARR, 50 enterprise customers

---

## Phase 1: Foundation & Auth (Weekend - 2 days)

**Goal:** Complete authentication system with role-based access
**Success Criteria:** Users can sign up, log in, and access role-specific dashboards

### Must-Have Features

- [ ] Fix Better Auth email integration with Resend `XS`
- [ ] Complete OAuth providers (GitHub, Google, Discord) `S`
- [ ] Implement role-based routing middleware `S`
- [ ] Create unified navigation component `XS`

### Should-Have Features

- [ ] Two-factor authentication setup `S`
- [ ] Password reset flow `S`
- [ ] Session management UI `XS`

### Dependencies

- Resend API key configuration
- OAuth app credentials
- Database schema finalization

---

## Phase 2: Core Dashboards (Week 1 - 5 days)

**Goal:** Implement all five user dashboards with real functionality
**Success Criteria:** Each user type can perform their primary workflows

### Must-Have Features

- [ ] Admin Dashboard - User management and analytics `L`
- [ ] Corporate Dashboard - Team overview and training metrics `L`
- [ ] Coach Dashboard - Learner assignments and progress tracking `M`
- [ ] Learner Dashboard - Learning paths and progress `L`
- [ ] Multi-account switcher component `M`

### Should-Have Features

- [ ] Real-time notifications system `M`
- [ ] Basic reporting exports `S`
- [ ] Mobile-responsive layouts `M`

### Dependencies

- Completed authentication system
- Initial database seed data
- API route structure

---

## Phase 3: Readiness Index MVP (Month 1 - 3 weeks)

**Goal:** Launch predictive algorithm with initial assessment flow
**Success Criteria:** Generate accurate readiness scores for pilot users

### Must-Have Features

- [ ] Assessment questionnaire system `L`
- [ ] Readiness Index calculation engine `XL`
- [ ] Score visualization and insights `M`
- [ ] Learning path generator based on scores `L`
- [ ] Basic AI coaching chat interface `L`

### Should-Have Features

- [ ] A/B testing framework for algorithm `M`
- [ ] Benchmark comparison data `M`
- [ ] API for third-party integrations `M`

### Dependencies

- ML model training data
- Assessment question bank
- OpenAI API integration

---

## Phase 4: Enterprise Scale (Quarter 1 - 2 months)

**Goal:** Build features for enterprise adoption and team management
**Success Criteria:** Platform handles 10,000+ concurrent users

### Must-Have Features

- [ ] Team management and hierarchy `L`
- [ ] Budget tracking and ROI calculator `L`
- [ ] Enterprise SSO (SAML/OIDC) `XL`
- [ ] Advanced analytics dashboard `L`
- [ ] Bulk user import/export `M`
- [ ] Custom branding options `M`

### Should-Have Features

- [ ] API rate limiting and quotas `M`
- [ ] Audit logging system `M`
- [ ] SLA monitoring dashboard `S`

### Dependencies

- Infrastructure scaling plan
- Enterprise sales pipeline
- Compliance certifications

---

## Phase 5: Market Leadership (Year 1 - 9 months)

**Goal:** Establish SenseiiWyze as the category leader
**Success Criteria:** $2.5M ARR with 90%+ customer retention

### Must-Have Features

- [ ] Advanced AI coaching with voice `XL`
- [ ] Peer learning marketplace `XL`
- [ ] Certification prep guarantee program `L`
- [ ] White-label platform options `XL`
- [ ] Multi-language support (5 languages) `XL`
- [ ] Mobile native apps (iOS/Android) `XL`
- [ ] Predictive workforce planning tools `L`

### Should-Have Features

- [ ] VR/AR learning experiences `XL`
- [ ] Blockchain skill credentials `L`
- [ ] AI content generation for courses `L`

### Dependencies

- Series A funding round
- Strategic partnerships
- Expanded engineering team

---

## Success Metrics by Timeline

### Weekend
- Working auth system
- 3 test users created

### Week 1
- 50 beta users onboarded
- All dashboards accessible

### Month 1
- First paying customer
- 500 assessments completed
- 85% prediction accuracy

### Quarter 1
- $100K MRR
- 10 enterprise customers
- 5,000 active learners

### Year 1
- $2.5M ARR
- 50 enterprise customers
- 100,000 active learners
- 87% prediction accuracy
- 40% better outcomes than competitors