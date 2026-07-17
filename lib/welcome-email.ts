//this is the welcome email for the user

import { MailtrapClient } from "mailtrap";

const sender = {
  email: "hello@smartopsledgertech.com",
  name: "SmartOps Ledger",
};

/**
 * Send a welcome email using your Mailtrap template.
 * @param userEmail - The recipient's email address
 * @param userName - The recipient's name (to personalize the template)
 */
export async function sendWelcomeEmail(userEmail: string, userName: string) {
  const token = process.env.MAILTRAP_TOKEN;
  if (!token) {
    console.error("Error sending welcome email: MAILTRAP_TOKEN is not configured");
    return { success: false as const, error: "MAILTRAP_TOKEN is not configured" };
  }

  try {
    const client = new MailtrapClient({ token });
    const TEMPLATE_UUID = "9cfc2b6f-b99e-4dbb-b0ef-919341500fe5";

    // The image URLs from your template (these are hosted on Mailtrap's CDN)
    const companyLogoUrl = "https://smartopsledgertech.com/smartops_join.png";
    const heroImageUrl = "https://smartopsledgertech.com/smartops.png";
    const footerImageUrl = "https://smartopsledgertech.com/smartops.png";

    const response = await client.send({
      from: sender,
      to: [{ email: userEmail }],
      template_uuid: TEMPLATE_UUID,
      template_variables: {
        name: userName || "there",
        company_info_name: "SmartOps Ledger",
        company_info_address: "Ntinda",
        company_info_city: "Kampala",
        company_info_zip_code: "10102",
        company_info_country: "Uganda",
        company_logo_url: companyLogoUrl,
        hero_image_url: heroImageUrl,
        footer_image_url: footerImageUrl,
      },
    });

    console.log("Welcome email sent:", response);
    return { success: true as const, messageIds: response.message_ids };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending welcome email:", error);
    return { success: false as const, error: message };
  }
}
