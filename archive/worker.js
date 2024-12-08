// Configuration for routing logic
const ROUTING_CRITERIA = {
  COMPANY_SIZES: {
    SMALL: ["25-50", "51-100"],
    LARGE: ["101-500", "501-1000", "1000+"],
  },
  INDUSTRIES: ["technology", "healthcare", "retail", "manufacturing"],
  ROLES: {
    MID_LEVEL: ["hr_manager", "people_ops"],
    SENIOR: ["hr_director", "vp_hr", "chief_hr_officer"],
  },
  BUSINESS_SETUPS: ["C Corp", "S Corp", "LLC or PLLC"],
};

export default {
  async fetch(request, env, ctx) {
    // Handle CORS
    if (request.method === "OPTIONS") {
      return handleCORS();
    }

    if (request.method === "POST") {
      try {
        const formData = await request.json();
        const routingDecision = determineRoute(formData);

        return new Response(JSON.stringify(routingDecision), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        });
      } catch (error) {
        console.error("Error processing request:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }
    }

    return new Response("Method not allowed", { status: 405 });
  },
};

function determineRoute(formData) {
  const { company_size, industry, role_responsibility, how_is_your_business_setup__v2 } = formData;

  // Check if not qualified
  if (!isQualified(company_size, industry, role_responsibility, how_is_your_business_setup__v2)) {
    return { route: "not_qualified" };
  }

  // Check if they should go to scheduler (larger companies or senior roles)
  if (shouldGoToSalesCall(company_size, role_responsibility)) {
    return { route: "scheduler" };
  }

  // Default to free trial for qualified smaller companies
  return { route: "free_trial" };
}

function isQualified(company_size, industry, role, business_setup) {
  return (
    [...ROUTING_CRITERIA.COMPANY_SIZES.SMALL, ...ROUTING_CRITERIA.COMPANY_SIZES.LARGE].includes(company_size) &&
    ROUTING_CRITERIA.INDUSTRIES.includes(industry) &&
    [...ROUTING_CRITERIA.ROLES.MID_LEVEL, ...ROUTING_CRITERIA.ROLES.SENIOR].includes(role) &&
    ROUTING_CRITERIA.BUSINESS_SETUPS.includes(business_setup)
  );
}

function shouldGoToSalesCall(company_size, role) {
  return ROUTING_CRITERIA.COMPANY_SIZES.LARGE.includes(company_size) || ROUTING_CRITERIA.ROLES.SENIOR.includes(role);
}

function handleCORS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
