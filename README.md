# Form Router Documentation

## Overview

This form router handles qualification and routing logic for potential clients based on various criteria. The router directs users to one of three possible landing pages:

- Free Trial
- Scheduler
- Not Qualified (DQ)

## Routing Logic

### 1. Disqualification (DQ) Criteria

Users will be disqualified and routed to the "Not Qualified" page if ANY of the following conditions are met:

#### Business Structure

- Practice is a C Corp
- Practice has multiple owners (answered "Yes")

#### Location

- International (non-US) location

#### Profession Type

- Physical Therapist
- Dietician
- Nutritionist
- Massage Therapist

#### Practice Timeline

- Opening practice in 1+ month

#### Income

- No income
- Less than $20,000 expected annual income

### 2. Scheduler Criteria

If not DQ'd, users will be routed to the Scheduler if:

- Expected annual income is $50,000 or higher (includes $50,000-$99,999, $100,000-$149,999, $150,000+)

### 3. Free Trial Criteria

If not DQ'd and not routed to Scheduler, users will be routed to Free Trial if:

- Expected annual income is $20,000-$49,999

### Default Routing

- If none of the above criteria are met, users will be routed to the "Not Qualified" page by default

## Technical Implementation

- Form data is processed client-side
- All field values are converted to lowercase for consistent comparison
- Form data is stored in localStorage for reference
- Routing decisions are logged to console for debugging purposes
