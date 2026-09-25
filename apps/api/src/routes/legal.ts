import type { FastifyInstance, FastifyReply } from "fastify";

const supportEmail = "keyvan.andayesh@gmail.com";
const effectiveDate = "24 August 2026";

const styles = `
  :root { color-scheme: dark; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  * { box-sizing: border-box; }
  body { margin: 0; min-height: 100vh; color: #f7f5ff; background: #090811; }
  body::before { content: ""; position: fixed; inset: 0; pointer-events: none; background: radial-gradient(circle at 15% 0%, rgba(141, 90, 255, .22), transparent 34rem), radial-gradient(circle at 100% 25%, rgba(45, 212, 191, .12), transparent 28rem); }
  main { position: relative; width: min(780px, calc(100% - 32px)); margin: 0 auto; padding: 56px 0 88px; }
  nav { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 72px; }
  .brand { color: #fff; font-size: 13px; font-weight: 800; letter-spacing: .18em; text-decoration: none; }
  .nav-links { display: flex; gap: 18px; }
  .nav-links a { color: #aaa4bd; font-size: 14px; text-decoration: none; }
  .nav-links a:hover, .nav-links a:focus-visible { color: #fff; }
  .eyebrow { margin: 0 0 14px; color: #bda7ff; font-size: 12px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; }
  h1 { max-width: 690px; margin: 0; font-size: clamp(42px, 9vw, 72px); line-height: .98; letter-spacing: -.055em; }
  .lede { max-width: 650px; margin: 28px 0 22px; color: #c7c2d6; font-size: 19px; line-height: 1.65; }
  .updated { display: inline-flex; padding: 9px 13px; color: #ded9eb; background: rgba(255,255,255,.055); border: 1px solid rgba(255,255,255,.1); border-radius: 999px; font-size: 13px; }
  article { margin-top: 56px; }
  section { padding: 30px 0; border-top: 1px solid rgba(255,255,255,.11); }
  h2 { margin: 0 0 14px; font-size: 22px; letter-spacing: -.02em; }
  p, li { color: #bdb7cc; font-size: 16px; line-height: 1.75; }
  p { margin: 0 0 14px; }
  ul { margin: 12px 0 0; padding-left: 22px; }
  a { color: #cbbcff; }
  .callout { margin-top: 20px; padding: 22px; border: 1px solid rgba(189,167,255,.28); border-radius: 18px; background: rgba(125,84,214,.1); }
  footer { margin-top: 54px; color: #817a93; font-size: 13px; }
  @media (max-width: 560px) { main { padding-top: 32px; } nav { align-items: flex-start; margin-bottom: 52px; } .nav-links { flex-direction: column; gap: 8px; text-align: right; } }
`;

function page(input: { title: string; eyebrow: string; lede: string; content: string }): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#090811">
  <title>${input.title} · Say It First</title>
  <style>${styles}</style>
</head>
<body>
  <main>
    <nav aria-label="Legal and support">
      <a class="brand" href="/support">SAY IT FIRST</a>
      <div class="nav-links"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/support">Support</a></div>
    </nav>
    <header>
      <p class="eyebrow">${input.eyebrow}</p>
      <h1>${input.title}</h1>
      <p class="lede">${input.lede}</p>
      <span class="updated">Effective ${effectiveDate}</span>
    </header>
    <article>${input.content}</article>
    <footer>Say It First · Practise the difficult conversation before it becomes real.</footer>
  </main>
</body>
</html>`;
}

const privacyPage = page({
  title: "Privacy policy",
  eyebrow: "Clear before you practise",
  lede:
    "Say It First is designed for private workplace-conversation rehearsal. This policy explains what the Android app processes, why it is needed, and the controls available to you.",
  content: `
    <section><h2>Who operates Say It First</h2><p>Say It First is operated by an independent developer in Australia. Privacy questions and deletion requests can be sent to <a href="mailto:${supportEmail}">${supportEmail}</a>.</p></section>
    <section><h2>Information we process</h2><ul><li>A random app identifier used to maintain anonymous app state and purchase access. We do not require your name, employer, or workplace identity.</li><li>Microphone audio during an active rehearsal, transcript events produced from that session, and any optional context you enter.</li><li>Practice feedback displayed during the current app session. The current early-access build does not persist a practice-history archive.</li><li>If you choose Report AI response, the selected Alex response, your report reason, scenario and persona identifiers, and a protected form of your random app identifier.</li><li>Purchase product, transaction, and entitlement records supplied by Google Play and RevenueCat. We do not receive your full payment-card details.</li><li>Operational data such as timestamps, request and trace identifiers, connection timing, app version, purchase status, and error codes. Routine diagnostics exclude audio, transcript text, credentials, and payment details.</li></ul></section>
    <section><h2>How we use information</h2><p>We process this information only to run the simulated conversation, generate transcript-grounded coaching, unlock paid features, restore purchases, protect the service from abuse, and diagnose reliability problems.</p></section>
    <section><h2>AI and service providers</h2><p>OpenAI processes active rehearsal audio, transcript events, and evaluation requests to provide the AI conversation and feedback. Google Cloud hosts the Say It First API. Google Play processes purchases, and RevenueCat manages subscription products and entitlement state. These providers process information under their own terms and privacy commitments and may process it outside Australia.</p></section>
    <section><h2>Retention and deletion</h2><p>The Say It First API does not retain raw microphone audio or persist transcript text by default. Audio and transcript data may be processed transiently by the AI provider to deliver the requested service. Current-session feedback is discarded when the app session is reset or closed.</p><p>Privacy-safe operational logs are retained for 30 days for security, reliability, and debugging. A report you explicitly submit is also retained for 30 days so we can investigate and improve safety safeguards. The report includes only the selected Alex response and report details described above—not microphone audio or your other transcript turns. To request deletion of support correspondence or identifiable operational records we can reasonably locate, email <a href="mailto:${supportEmail}">${supportEmail}</a>.</p></section>
    <section><h2>Your choices</h2><ul><li>You can deny or revoke microphone permission in Android settings, although voice rehearsal will not work without it.</li><li>You can avoid entering names or confidential workplace details.</li><li>You can delete locally stored data by clearing the app's storage or uninstalling it.</li><li>You can manage or cancel subscriptions through Google Play or the in-app subscription centre.</li></ul></section>
    <section><h2>Security and age</h2><p>We use encrypted transport, restricted service identities, secret-backed credentials, structured validation, and content-safe diagnostics. No system is completely secure. Say It First is a professional workplace tool and is not directed to children under 18.</p></section>
    <section><h2>Changes</h2><p>We may update this policy as the product changes. The effective date above will identify the current version. Material changes will be reflected in the app or store listing.</p></section>
    <div class="callout"><strong>Contact</strong><p>Email <a href="mailto:${supportEmail}">${supportEmail}</a> for privacy or support requests.</p></div>
  `,
});

const termsPage = page({
  title: "Terms of use",
  eyebrow: "A focused coaching tool",
  lede:
    "These terms govern your use of Say It First. By using the app, you agree to use it responsibly as a rehearsal aid—not as a substitute for professional judgment.",
  content: `
    <section><h2>Purpose and limitations</h2><p>Say It First provides private AI-assisted rehearsal and coaching for difficult workplace conversations. It is not legal, medical, employment-relations, or professional HR advice. It does not make decisions about employees. AI responses and feedback may be incomplete or inaccurate, so review important wording before using it in a real conversation.</p></section>
    <section><h2>Your responsibilities</h2><p>Use the app lawfully and respectfully. Do not submit information you are not authorised to share, attempt to identify or harm another person, bypass service limits, reverse engineer protected services, or use the product to automate employment decisions.</p></section>
    <section><h2>Subscriptions</h2><p>Paid subscriptions are billed and renewed by Google Play at the price and renewal terms shown before confirmation. You can manage or cancel renewal through Google Play or the in-app subscription centre. Cancellation takes effect under Google Play's billing rules; access normally continues for the paid period. Refund requests are handled under applicable law and Google Play policy.</p></section>
    <section><h2>Availability and changes</h2><p>We work to keep the service reliable but do not guarantee uninterrupted availability. Features, scenarios, and limits may evolve. We will not intentionally remove an active paid entitlement during its current billing period without providing an appropriate remedy.</p></section>
    <section><h2>Liability</h2><p>To the extent permitted by law, Say It First is provided without warranties beyond those that cannot legally be excluded. We are not responsible for workplace decisions or consequences based on AI-generated material. Nothing in these terms excludes rights available under applicable consumer law.</p></section>
    <section><h2>Contact</h2><p>Questions about these terms can be sent to <a href="mailto:${supportEmail}">${supportEmail}</a>.</p></section>
  `,
});

const supportPage = page({
  title: "Support",
  eyebrow: "We are here to help",
  lede:
    "For purchase, privacy, or technical questions, contact the Say It First developer directly. Include your app version and a short description, but never send confidential workplace material.",
  content: `
    <section><h2>Contact support</h2><div class="callout"><p><a href="mailto:${supportEmail}">${supportEmail}</a></p><p>Typical response target: within three business days.</p></div></section>
    <section><h2>Purchases and restoration</h2><p>Open the Pro screen and choose Restore purchases if an existing Google Play subscription is not recognised. Subscription renewal and cancellation are managed through Google Play. Do not email payment-card details.</p></section>
    <section><h2>Voice rehearsal</h2><p>Check Android microphone permission, media volume, and network connectivity. If audio becomes distorted or stops, end the rehearsal before retrying and include the approximate time of the issue in your support message.</p></section>
    <section><h2>Privacy requests</h2><p>See the <a href="/privacy">privacy policy</a> for data details and deletion choices. Privacy requests can use the same support email.</p></section>
  `,
});

function sendLegalPage(reply: FastifyReply, html: string) {
  return reply
    .header("cache-control", "public, max-age=3600")
    .header(
      "content-security-policy",
      "default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
    )
    .header("referrer-policy", "no-referrer")
    .header("x-content-type-options", "nosniff")
    .type("text/html; charset=utf-8")
    .send(html);
}

export function registerLegalRoutes(fastify: FastifyInstance): void {
  fastify.get("/privacy", (_request, reply) => sendLegalPage(reply, privacyPage));
  fastify.get("/terms", (_request, reply) => sendLegalPage(reply, termsPage));
  fastify.get("/support", (_request, reply) => sendLegalPage(reply, supportPage));
}
