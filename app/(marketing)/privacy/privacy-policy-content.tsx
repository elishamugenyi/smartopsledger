import type { ReactNode } from "react";

const EFFECTIVE_DATE = "May 29, 2026";

function PolicyTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse border border-neutral-300 text-sm">
        <thead>
          <tr className="bg-neutral-100">
            {headers.map((header) => (
              <th
                key={header}
                className="border border-neutral-300 px-3 py-2 text-left font-semibold text-neutral-900"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="even:bg-neutral-50">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="border border-neutral-300 px-3 py-2 align-top text-neutral-800"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mt-10 scroll-mt-20 text-xl font-semibold text-neutral-900">
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: ReactNode }) {
  return <h3 className="mt-6 text-lg font-semibold text-neutral-900">{children}</h3>;
}

function Paragraph({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-base leading-relaxed text-neutral-800">{children}</p>;
}

function List({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 list-disc space-y-2 pl-6 text-neutral-800">
      {items.map((item, index) => (
        <li key={index} className="leading-relaxed">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function PrivacyPolicyContent() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <header className="border-b border-neutral-300 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-950">
          Privacy Notice for SmartOps Ledger
        </h1>
        <p className="mt-4 text-sm text-neutral-600">
          Effective Date: {EFFECTIVE_DATE}
          <br />
          Last Updated: {EFFECTIVE_DATE}
        </p>
      </header>

      <div className="mt-8 text-neutral-900">
        <Paragraph>
          SmartOps Ledger LLC (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
          operates the SmartOps Ledger software-as-a-service platform (the &quot;Service&quot;). This
          Privacy Notice explains how we collect, use, disclose, and protect your personal information
          when you use our Service.
        </Paragraph>

        <div className="mt-6 rounded border border-neutral-300 bg-neutral-50 p-4 text-sm text-neutral-800">
          <p className="font-semibold text-neutral-900">Company Information:</p>
          <p className="mt-2">SmartOps Ledger LLC</p>
          <p>[Your Registered Agent Address in Delaware]</p>
          <p>[Your Business Email]</p>
          <p>[Your Business Phone Number]</p>
        </div>

        <SectionHeading id="data-we-collect">1. Data We Collect</SectionHeading>
        <Paragraph>
          We collect several categories of personal information to provide and improve our Service.
        </Paragraph>

        <SubHeading>1.1 Information You Provide Directly</SubHeading>
        <PolicyTable
          headers={["Category", "Specific Data Points", "Legal Basis (GDPR)"]}
          rows={[
            [
              "Account Information",
              "Full name, email address, password (hashed), business name, business address, phone number",
              "Contract performance",
            ],
            [
              "Billing Information",
              "Payment method details (processed directly by Stripe - we do not store full payment credentials), subscription plan choice, billing address",
              "Contract performance",
            ],
            [
              "Organization Data",
              "Organization name, team member email addresses and roles, business tax ID (if provided)",
              "Contract performance",
            ],
            [
              "Client Data",
              "Client names, email addresses, phone numbers, billing addresses (for invoice recipients)",
              "Contract performance",
            ],
            [
              "Invoice Data",
              "Invoice amounts, descriptions, due dates, status (paid/unpaid), payment history, line items",
              "Contract performance",
            ],
            [
              "Automation Rules",
              "Trigger configurations, action settings, conditions you define",
              "Contract performance",
            ],
            [
              "Communications",
              "Messages sent through our support channels, feedback, feature requests",
              "Legitimate interest",
            ],
          ]}
        />

        <SubHeading>1.2 Information Collected Automatically</SubHeading>
        <PolicyTable
          headers={["Category", "Specific Data Points", "Purpose"]}
          rows={[
            [
              "Usage Data",
              "Pages visited, features used, time spent, click paths, automation execution logs",
              "Service improvement, analytics",
            ],
            [
              "Device Information",
              "IP address, browser type, operating system, device identifiers",
              "Security, fraud prevention, analytics",
            ],
            [
              "Log Data",
              "Access times, error logs, API request/response metadata",
              "Troubleshooting, performance monitoring",
            ],
          ]}
        />

        <SubHeading>1.3 Information from Third Parties</SubHeading>
        <PolicyTable
          headers={["Source", "Data Received", "When"]}
          rows={[
            [
              "Stripe",
              "Payment status, subscription status, invoice payment confirmation, customer ID",
              "After payment processing",
            ],
            [
              "Authentication Providers",
              "Email address, name (if you use OAuth login)",
              "During account creation/sign-in",
            ],
          ]}
        />

        <SubHeading>1.4 Special Note on Client Data</SubHeading>
        <Paragraph>
          When you add clients to SmartOps Ledger and send them invoices, you are providing us with
          their personal information (name, email). You are the data controller for your client data,
          and we are the data processor acting on your instructions. You are responsible for:
        </Paragraph>
        <List
          items={[
            "Having a legal basis to share your clients' information with us",
            "Providing your clients with appropriate notice about your use of SmartOps Ledger",
            "Responding to your clients' data subject requests",
          ]}
        />

        <SectionHeading id="how-we-use">2. How We Use Your Data</SectionHeading>

        <SubHeading>2.1 Core Service Operations</SubHeading>
        <PolicyTable
          headers={["Purpose", "Legal Basis (GDPR)", "Data Used"]}
          rows={[
            [
              "Create and manage your account",
              "Contract performance",
              "Account information",
            ],
            [
              "Process subscription payments",
              "Contract performance",
              "Billing information (via Stripe)",
            ],
            [
              "Send invoices to your clients",
              "Contract performance",
              "Client data, invoice data",
            ],
            [
              "Track invoice status and automate follow-ups",
              "Contract performance",
              "Invoice data, automation rules",
            ],
            [
              "Manage team access to your organization",
              "Contract performance",
              "Organization data",
            ],
            [
              "Provide customer support",
              "Legitimate interest",
              "Communications, usage data",
            ],
          ]}
        />

        <SubHeading>2.2 Service Improvement &amp; Security</SubHeading>
        <PolicyTable
          headers={["Purpose", "Legal Basis (GDPR)", "Data Used"]}
          rows={[
            [
              "Monitor and analyze usage patterns",
              "Legitimate interest",
              "Usage data, device information",
            ],
            [
              "Detect and prevent fraud or abuse",
              "Legal obligation (fraud laws)",
              "Log data, IP addresses",
            ],
            [
              "Troubleshoot technical issues",
              "Contract performance",
              "Log data, error reports",
            ],
            [
              "Improve features and user experience",
              "Legitimate interest",
              "Usage data, feedback",
            ],
          ]}
        />

        <SubHeading>2.3 Communications &amp; Marketing</SubHeading>
        <PolicyTable
          headers={["Purpose", "Legal Basis (GDPR)", "Data Used"]}
          rows={[
            [
              "Send service updates and security notices",
              "Contract performance",
              "Account email",
            ],
            [
              "Send billing-related communications",
              "Contract performance",
              "Account email",
            ],
            [
              "Send marketing communications (new features, tips)",
              "Consent (opt-in required for EU users)",
              "Account email",
            ],
            [
              "Request feedback or reviews",
              "Legitimate interest (opt-out available)",
              "Account email",
            ],
          ]}
        />

        <SubHeading>2.4 Legal Compliance</SubHeading>
        <PolicyTable
          headers={["Purpose", "Legal Basis (GDPR)", "Data Used"]}
          rows={[
            [
              "Comply with tax and accounting laws",
              "Legal obligation",
              "Billing information, invoice data",
            ],
            [
              "Respond to lawful requests from authorities",
              "Legal obligation",
              "Relevant data as required",
            ],
            [
              "Enforce our Terms of Service",
              "Legitimate interest",
              "Account, usage, and organization data",
            ],
          ]}
        />

        <SectionHeading id="how-we-share">3. How We Share Your Data</SectionHeading>

        <SubHeading>3.1 Third-Party Service Providers (Sub-Processors)</SubHeading>
        <Paragraph>
          We share your data with the following third parties to operate our Service:
        </Paragraph>
        <PolicyTable
          headers={[
            "Provider",
            "Data Shared",
            "Purpose",
            "Location",
            "GDPR Safeguard",
          ]}
          rows={[
            [
              "Stripe, Inc.",
              "Customer ID, email, subscription details, payment method token, invoice amounts",
              "Payment processing, subscription management, invoice payment collection",
              "USA",
              "EU-US Data Privacy Framework certified",
            ],
            [
              "Vercel Inc.",
              "All data processed through our application (account, client, invoice, automation data)",
              "Application hosting, serverless functions, deployment",
              "USA",
              "EU-US Data Privacy Framework certified + SCCs",
            ],
            [
              "Neon, Inc. (or your PostgreSQL provider)",
              "All data stored in your database (users, organizations, invoices, clients, automations)",
              "Database hosting",
              "USA (or specified region)",
              "SCCs + encryption at rest",
            ],
            [
              "Resend / SendGrid / AWS SES (if applicable)",
              "Email addresses of your clients (for invoice delivery), your account email",
              "Email delivery for invoices and notifications",
              "USA",
              "SCCs",
            ],
          ]}
        />

        <SubHeading>3.2 When You Explicitly Instruct Us</SubHeading>
        <List
          items={[
            <>
              <strong>Invoice Recipients:</strong> When you send an invoice to a client via SmartOps
              Ledger, we share the invoice details (amount, due date, description, payment link) with
              your client via email.
            </>,
            <>
              <strong>Team Members:</strong> When you add members to your organization, those members
              can access organization data (invoices, clients, automations) according to their assigned
              role (Owner, Admin, Member).
            </>,
            <>
              <strong>Payment Processing:</strong> When a client pays an invoice, we share transaction
              details with Stripe to complete payment, and Stripe shares confirmation back to us.
            </>,
          ]}
        />

        <SubHeading>3.3 Legal Compliance &amp; Enforcement</SubHeading>
        <Paragraph>
          We may disclose your data if required by law or in good faith belief that such action is
          necessary to:
        </Paragraph>
        <List
          items={[
            "Comply with a legal obligation (e.g., tax audit, court order, subpoena)",
            "Protect and defend our rights or property",
            "Prevent or investigate possible wrongdoing in connection with the Service",
            "Protect the personal safety of users or the public",
            "Protect against legal liability",
          ]}
        />

        <SubHeading>3.4 Business Transfers</SubHeading>
        <Paragraph>
          If SmartOps Ledger LLC is involved in a merger, acquisition, or asset sale, your data may be
          transferred. We will provide notice before your data is transferred and becomes subject to a
          different privacy policy.
        </Paragraph>

        <SubHeading>3.5 Aggregated or De-Identified Data</SubHeading>
        <Paragraph>
          We may share aggregated or de-identified information that cannot reasonably identify you.
          For example: &quot;50% of users use the overdue invoice automation feature.&quot;
        </Paragraph>

        <SectionHeading id="how-we-protect">4. How We Protect Your Data</SectionHeading>

        <SubHeading>4.1 Technical Security Measures</SubHeading>
        <PolicyTable
          headers={["Measure", "Implementation"]}
          rows={[
            [
              "Encryption in Transit",
              "TLS 1.3 for all data transmitted between your browser and our servers",
            ],
            [
              "Encryption at Rest",
              "AES-256 encryption for all data stored in our database",
            ],
            [
              "Access Controls",
              "Role-based access control (RBAC) for internal employee access",
            ],
            ["API Security", "Rate limiting, authentication tokens, request validation"],
            [
              "Backup & Recovery",
              "Automated daily backups stored in encrypted, geographically redundant locations",
            ],
            [
              "Monitoring",
              "Intrusion detection systems, automated security scanning, log monitoring",
            ],
          ]}
        />

        <SubHeading>4.2 Organizational Security Measures</SubHeading>
        <List
          items={[
            <>
              <strong>Employee Access:</strong> Only essential employees have access to production data,
              and access is granted on a need-to-know basis.
            </>,
            <>
              <strong>Security Training:</strong> All employees undergo annual security and privacy
              training.
            </>,
            <>
              <strong>Vendor Management:</strong> We require all third-party providers to sign Data
              Processing Agreements and maintain appropriate security certifications.
            </>,
          ]}
        />

        <SubHeading>4.3 Payment Security (Stripe)</SubHeading>
        <Paragraph>
          We do not collect, store, or process full payment card details. All payment information is
          handled directly by Stripe, which is certified as a PCI Service Provider Level 1 (the highest
          level of certification). Your payment data is tokenized, and we only store references to
          payment methods, not the actual card numbers.
        </Paragraph>

        <SubHeading>4.4 Data Retention</SubHeading>
        <PolicyTable
          headers={["Data Category", "Retention Period"]}
          rows={[
            ["Active account data", "Duration of your subscription + 30 days"],
            ["Invoices (paid)", "7 years (tax/accounting compliance)"],
            ["Deleted accounts", "Anonymized after 30 days, or deleted upon request"],
            ["Log data", "90 days (security and troubleshooting)"],
            ["Automation execution history", "12 months"],
          ]}
        />

        <SubHeading>4.5 User Responsibility</SubHeading>
        <Paragraph>You are responsible for:</Paragraph>
        <List
          items={[
            "Maintaining the security of your account credentials (strong password, not sharing access)",
            "Configuring appropriate team member access levels",
            "Securing your own devices used to access SmartOps Ledger",
            "Complying with your own obligations to protect your clients' data",
          ]}
        />

        <SectionHeading id="third-party">5. Third-Party Applications</SectionHeading>

        <SubHeading>5.1 Core Service Providers</SubHeading>
        <div className="mt-4 space-y-4 text-neutral-800">
          <div>
            <p className="font-semibold text-neutral-900">Stripe, Inc.</p>
            <p className="mt-1 text-sm">
              Purpose: Payment processing, subscription management, invoice payment collection
            </p>
            <p className="text-sm">
              Data Shared: Customer name, email, subscription plan, payment method token, invoice
              amounts
            </p>
            <p className="text-sm">
              Privacy Policy:{" "}
              <a
                href="https://stripe.com/privacy"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://stripe.com/privacy
              </a>
            </p>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">Vercel Inc.</p>
            <p className="mt-1 text-sm">
              Purpose: Application hosting, serverless functions, global CDN
            </p>
            <p className="text-sm">
              Data Shared: All application data (account, organization, invoice, client, automation
              data)
            </p>
            <p className="text-sm">
              Privacy Policy:{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://vercel.com/legal/privacy-policy
              </a>
            </p>
          </div>
          <div>
            <p className="font-semibold text-neutral-900">Neon, Inc. (PostgreSQL hosting)</p>
            <p className="mt-1 text-sm">Purpose: Database hosting and management</p>
            <p className="text-sm">Data Shared: All data stored in your application database</p>
            <p className="text-sm">
              Privacy Policy:{" "}
              <a
                href="https://neon.tech/legal/privacy"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://neon.tech/legal/privacy
              </a>
            </p>
          </div>
        </div>

        <SubHeading>5.2 Optional Integrations (Future Features)</SubHeading>
        <Paragraph>
          The following integrations may be added in future versions. You will receive notice before
          enabling them:
        </Paragraph>
        <PolicyTable
          headers={["Potential Integration", "Purpose"]}
          rows={[
            ["Slack/Discord webhooks", "Automation notifications"],
            ["Zapier/Make.com", "Workflow automation connections"],
            ["Google Sheets", "Data export and reporting"],
            ["QuickBooks/Xero", "Accounting software sync"],
          ]}
        />

        <SubHeading>5.3 Third-Party Links</SubHeading>
        <Paragraph>
          Our Service may contain links to third-party websites or services (e.g., Stripe&apos;s
          customer portal). We are not responsible for the privacy practices of these third parties.
          We encourage you to review their privacy policies before providing them with your
          information.
        </Paragraph>

        <SectionHeading id="privacy-rights">6. Your Privacy Rights</SectionHeading>

        <SubHeading>6.1 Rights for All Users (US &amp; International)</SubHeading>
        <PolicyTable
          headers={["Right", "Description", "How to Exercise"]}
          rows={[
            [
              "Access",
              "Request a copy of data we hold about you",
              "Email privacy@smartopsledger.com",
            ],
            [
              "Correction",
              "Correct inaccurate or incomplete data",
              "Update in account settings or contact support",
            ],
            [
              "Deletion",
              "Request deletion of your data",
              "Contact support (subject to legal retention obligations)",
            ],
            [
              "Data Portability",
              "Receive your data in machine-readable format",
              "Email privacy@smartopsledger.com",
            ],
            [
              "Opt-out of Marketing",
              "Stop receiving marketing communications",
              'Click "unsubscribe" in emails or update account preferences',
            ],
          ]}
        />

        <SubHeading>6.2 Additional Rights for EU/UK Users (GDPR)</SubHeading>
        <Paragraph>
          Under the General Data Protection Regulation, you also have:
        </Paragraph>
        <PolicyTable
          headers={["Right", "Description"]}
          rows={[
            [
              "Right to Restrict Processing",
              "Limit how we use your data while a dispute is resolved",
            ],
            ["Right to Object", "Object to processing based on legitimate interests"],
            [
              "Right to Withdraw Consent",
              "Withdraw previously given consent for marketing or cookies",
            ],
            [
              "Right to Lodge a Complaint",
              "File a complaint with your local supervisory authority",
            ],
          ]}
        />
        <Paragraph>
          To exercise these rights, contact us at privacy@smartopsledger.com. We will respond within
          30 days as required by GDPR.
        </Paragraph>

        <SubHeading>6.3 Rights for California Residents (CCPA/CPRA)</SubHeading>
        <Paragraph>
          If you are a California resident, you have additional rights under the California Consumer
          Privacy Act:
        </Paragraph>
        <PolicyTable
          headers={["Right", "Description"]}
          rows={[
            [
              "Right to Know",
              "Categories and specific pieces of personal information collected",
            ],
            [
              "Right to Delete",
              "Request deletion of personal information (subject to exceptions)",
            ],
            [
              "Right to Opt-Out",
              'Opt-out of "sales" of personal information (we do not sell your data)',
            ],
            [
              "Right to Non-Discrimination",
              "No denial of service for exercising your rights",
            ],
          ]}
        />
        <Paragraph>
          To exercise CCPA rights, call our toll-free number or email privacy@smartopsledger.com. We
          will verify your identity before responding.
        </Paragraph>

        <SectionHeading id="international-transfers">7. International Data Transfers</SectionHeading>
        <Paragraph>
          SmartOps Ledger LLC is based in the United States. If you access our Service from outside the
          US, your data will be transferred to and processed in the US.
        </Paragraph>

        <SubHeading>7.1 EU-US Data Transfers</SubHeading>
        <Paragraph>
          For users in the European Economic Area (EEA), we ensure adequate protection for your data
          through:
        </Paragraph>
        <List
          items={[
            <>
              <strong>EU-US Data Privacy Framework (DPF):</strong> Our sub-processor Stripe is DPF
              certified
            </>,
            <>
              <strong>Standard Contractual Clauses (SCCs):</strong> For non-DPF certified providers, we
              have executed SCCs approved by the European Commission
            </>,
            <>
              <strong>Transfer Impact Assessments (TIAs):</strong> Conducted where required to assess
              local laws
            </>,
          ]}
        />
        <Paragraph>
          You have the right to request a copy of our SCCs by contacting us at privacy@smartopsledger.com.
        </Paragraph>

        <SubHeading>7.2 UK-US Data Transfers</SubHeading>
        <Paragraph>
          For users in the United Kingdom, we rely on the UK Extension to the EU-US DPF (where
          applicable) or UK Addendum to the SCCs.
        </Paragraph>

        <SectionHeading id="children">8. Children&apos;s Privacy</SectionHeading>
        <Paragraph>
          Our Service is not directed to individuals under 18 years of age. We do not knowingly collect
          personal information from children under 18. If you become aware that a child has provided us
          with personal information, please contact us. If we become aware that we have collected
          personal information from a child under 18 without verification of parental consent, we will
          delete that information promptly.
        </Paragraph>

        <SectionHeading id="changes">9. Changes to This Privacy Notice</SectionHeading>
        <Paragraph>
          We may update this Privacy Notice from time to time to reflect changes in our practices,
          legal requirements, or operational needs.
        </Paragraph>
        <PolicyTable
          headers={["Type of Change", "Notice Method", "Effective Date"]}
          rows={[
            [
              "Minor updates (clarifications, typo fixes)",
              'Updated "Last Updated" date on this page',
              "Immediately",
            ],
            [
              "Material changes (new data uses, new third parties, changed rights)",
              "Email notice to account holders + in-app notification + 30-day advance notice",
              "30 days after notice",
            ],
            [
              "Emergency changes (security incidents, legal compliance)",
              "Direct email notification + banner on login page",
              "As soon as reasonably possible",
            ],
          ]}
        />
        <Paragraph>
          Your continued use of SmartOps Ledger after the effective date of any material changes
          constitutes your acceptance of the updated Privacy Notice. If you do not agree with the
          changes, you may cancel your subscription and request deletion of your data before the changes
          take effect.
        </Paragraph>
        <Paragraph>
          We encourage you to review this Privacy Notice periodically for any changes. The &quot;Last
          Updated&quot; date at the top indicates when this notice was last revised.
        </Paragraph>

        <SectionHeading id="contact">10. Contact Information</SectionHeading>

        <SubHeading>10.1 Privacy Inquiries</SubHeading>
        <Paragraph>
          For privacy-related questions, data subject requests, or concerns about this Privacy Notice:
        </Paragraph>
        <div className="mt-3 space-y-1 text-neutral-800">
          <p>
            <strong>Email:</strong> privacy@smartopsledger.com
          </p>
          <p>
            <strong>Response Time:</strong> We aim to respond within 5 business days (GDPR requires
            responses within 30 days)
          </p>
          <p className="mt-3 font-semibold text-neutral-900">Mail:</p>
          <p>SmartOps Ledger LLC</p>
          <p>Attn: Privacy Officer</p>
          <p>[Your Registered Agent Address]</p>
          <p>[City, State, ZIP Code]</p>
          <p>Delaware, USA</p>
        </div>

        <SubHeading>10.2 Data Protection Officer (DPO)</SubHeading>
        <Paragraph>For EU/UK users, you may contact our Data Protection Officer at:</Paragraph>
        <p className="mt-2 text-neutral-800">
          Email:{" "}
          <a href="mailto:dpo@smartopsledger.com" className="underline">
            dpo@smartopsledger.com
          </a>
        </p>

        <SubHeading>10.3 Supervisory Authority Complaints (EU/UK)</SubHeading>
        <Paragraph>
          If you are in the EEA or UK and believe we have processed your data unlawfully, you have the
          right to lodge a complaint with your local supervisory authority:
        </Paragraph>
        <List
          items={[
            <>
              EEA: Find your authority at{" "}
              <a
                href="https://edpb.europa.eu/about-edpb/about-edpb/members_en"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://edpb.europa.eu/about-edpb/about-edpb/members_en
              </a>
            </>,
            <>
              UK: Information Commissioner&apos;s Office -{" "}
              <a
                href="https://ico.org.uk"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://ico.org.uk
              </a>
            </>,
          ]}
        />
        <Paragraph>
          We would appreciate the opportunity to address your concerns directly before you contact a
          supervisory authority. Please contact us first at privacy@smartopsledger.com.
        </Paragraph>

        <SubHeading>10.4 California Residents (CCPA)</SubHeading>
        <Paragraph>
          For CCPA requests, you may also contact us toll-free at: [Your Toll-Free Number if
          applicable]
        </Paragraph>

        <SectionHeading id="acknowledgment">11. Acknowledgment</SectionHeading>
        <p className="mt-4 text-sm font-semibold uppercase leading-relaxed tracking-wide text-neutral-900">
          BY USING SMART OPS LEDGER, YOU ACKNOWLEDGE THAT YOU HAVE READ AND UNDERSTAND THIS PRIVACY
          NOTICE AND AGREE TO THE COLLECTION, USE, AND SHARING OF YOUR INFORMATION AS DESCRIBED HEREIN.
        </p>
        <Paragraph>
          This Privacy Notice is provided for informational purposes and does not constitute legal
          advice. SmartOps Ledger LLC recommends consulting with qualified legal counsel to ensure
          compliance with all applicable laws and regulations specific to your use of the Service.
        </Paragraph>
      </div>
    </article>
  );
}
