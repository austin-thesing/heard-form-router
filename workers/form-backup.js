// KV namespace binding: FORM_SUBMISSIONS

addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === "POST" && new URL(request.url).pathname === "/backup") {
    try {
      const formData = await request.json();

      // Generate a unique ID for the submission
      const submissionId = `submission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Store in KV
      await FORM_SUBMISSIONS.put(
        submissionId,
        JSON.stringify({
          timestamp: new Date().toISOString(),
          data: formData,
          status: "pending",
        })
      );

      // Notify via Slack webhook
      const slackWebhookUrl = "YOUR_SLACK_WEBHOOK_URL";
      await fetch(slackWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: "New Form Submission 📝",
                emoji: true,
              },
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Submission ID:*\n${submissionId}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Route:*\n${determineRoute(formData)}`,
                },
              ],
            },
            {
              type: "section",
              fields: [
                {
                  type: "mrkdwn",
                  text: `*Income:*\n${formData.what_is_your_expected_annual_income_for_2024___1099__private_practice_ || "N/A"}`,
                },
                {
                  type: "mrkdwn",
                  text: `*Profession:*\n${formData.what_best_describes_your_practice_ || "N/A"}`,
                },
              ],
            },
          ],
        }),
      });

      return new Response("Backup stored successfully", {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      // Send error notification to Slack
      const slackWebhookUrl = "YOUR_SLACK_WEBHOOK_URL";
      await fetch(slackWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: "⚠️ Form Submission Error",
                emoji: true,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*Error Message:*\n\`\`\`${error.message}\`\`\``,
              },
            },
          ],
        }),
      });

      return new Response("Error storing backup: " + error.message, {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
}
