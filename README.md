# Form Router Documentation

## Overview

This form router handles qualification and routing logic for potential clients based on various criteria. The router directs users to one of three possible landing pages:

- Free Trial (`/thank-you/free-trial`)
- Scheduler (`/thank-you/success`)
- Not Qualified (`/thank-you/no-meeting`)

## Routing Logic

### 1. Disqualification (DQ) Criteria

Users will be routed to the "Not Qualified" page if ANY of the following conditions are met:

#### Business Structure

- Practice is a C Corp
- Practice has multiple owners (answered "Yes")

#### Location

- International (non-US) location

#### Profession Type

- Dietician
- Nutritionist
- Massage Therapist
- Physical Therapist

#### Practice Timeline

- Opening practice in 1+ month

#### Income

- No income
- Less than $20,000 expected annual income

### 2. Scheduler Criteria

If not DQ'd, users will be routed to the Scheduler if they meet the following income criteria:

- Expected annual income is $50,000 or higher
  - Includes: $50,000-$99,999
  - Includes: $100,000-$149,999
  - Includes: $150,000+

### 3. Free Trial Criteria

Users will be routed to Free Trial if:

- Expected annual income is $20,000-$49,999
- Not disqualified by any DQ criteria

### Default Routing

If none of the above criteria are explicitly met, users will be routed to the "Not Qualified" page as a fallback.

## Technical Implementation

### Form Data Handling

- Form submissions are processed client-side using native JavaScript
- All field values are converted to lowercase for consistent comparison
- Form data is stored in localStorage for reference on subsequent pages
- Extensive console logging is implemented for debugging purposes

### Key Form Fields

- `is_your_practice_a_c_corp_or_our_does_it_have_multiple_owners_`
- `state`
- `how_is_your_business_setup__v2`
- `what_is_your_expected_annual_income_for_2024___1099__private_practice_`
- `how_long_have_you_been_running_your_private_practice_`
- `what_best_describes_your_practice_`

### Landing Page Routes

## Using in Webflow

### Option 1: Using jsDelivr (Recommended)

Add the following script tag to your Webflow page's custom code section:

```html
<!-- For production -->
<script src="https://cdn.jsdelivr.net/gh/[your-github-username]/form-router@main/dist/scheduler-bundle.min.js"></script>

<!-- For development/debugging -->
<script src="https://cdn.jsdelivr.net/gh/[your-github-username]/form-router@main/dist/scheduler-bundle.js"></script>
```

### Option 2: Inline Script

If you prefer to embed the code directly, copy the contents of `dist/scheduler-bundle.min.js` into a script tag in your Webflow page's custom code section:

```html
<script>
  // Paste the contents of dist/scheduler-bundle.min.js here
</script>
```

### Version Control

The build process generates both minified (`.min.js`) and debug (`.js`) versions of each file. The minified version is optimized for production use, while the debug version is useful during development.

A `version.js` file is also generated in the dist directory with a timestamp, which can be used for cache busting if needed.

### Important Notes

1. The scripts are built as IIFE (Immediately Invoked Function Expression) modules, which means they will work directly in the browser without any module system.
2. All dependencies are bundled into the final output file.
3. The code automatically initializes when the page loads - no additional setup required.
4. Make sure to add the script to pages where you need the scheduler functionality (typically your scheduling/thank you pages).
