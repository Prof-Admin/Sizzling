import SEO from '../components/common/SEO';

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-serif font-bold text-dark mb-4">{title}</h2>
      <div className="space-y-3 text-sm text-dark-600 leading-relaxed">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <SEO
        title="Privacy Policy | Sizzling Sensations"
        description="How Sizzling Sensations collects, uses, and protects your personal information."
        canonical="/privacy"
      />

      <div className="pt-24 pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-2">Legal</p>
            <h1 className="text-4xl font-serif font-bold text-dark mb-3">Privacy Policy</h1>
            <p className="text-sm text-dark-600">Last updated: July 2025</p>
          </div>

          <Section title="Who We Are">
            <p>Sizzling Sensations is a Nigerian catering business based in London, United Kingdom. We provide Main Menu catering, Individual Food Boxes, and Grazing Table services for events and gatherings.</p>
            <p>You can reach us at <a href="mailto:hello@sizzlingsensations.co.uk" className="text-primary underline">hello@sizzlingsensations.co.uk</a>.</p>
          </Section>

          <Section title="Information We Collect">
            <p>When you place an order or make an enquiry, we collect:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Your full name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Delivery address (if applicable)</li>
              <li>Event details (date, venue, guest count)</li>
              <li>Dietary requirements or allergy information you choose to share</li>
              <li>Order details (items, quantities, preferences)</li>
            </ul>
            <p>We do not collect payment card information directly. Any payments are handled through bank transfer or Stripe's secure payment infrastructure.</p>
          </Section>

          <Section title="How We Use Your Information">
            <p>We use the information you provide to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Process and fulfil your order</li>
              <li>Send you an order confirmation and updates</li>
              <li>Respond to enquiries</li>
              <li>Contact you if there is an issue with your order</li>
              <li>Comply with our legal obligations</li>
            </ul>
            <p>We do not use your information for marketing without your explicit consent.</p>
          </Section>

          <Section title="How We Share Your Information">
            <p>Your personal information is never sold to third parties. We may share your details with:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>WhatsApp (Meta Platforms):</strong> Orders are submitted via WhatsApp. When you click "Send Order via WhatsApp", your order details are passed to the WhatsApp platform subject to Meta's privacy policy.</li>
              <li><strong>Stripe:</strong> If you pay via Stripe payment link, your payment is processed by Stripe subject to their privacy policy.</li>
              <li><strong>Email service providers:</strong> Used to send order confirmations and enquiry responses.</li>
            </ul>
          </Section>

          <Section title="Data Retention">
            <p>We retain your order and contact information for up to 2 years to comply with accounting and tax obligations. After this period, your data is deleted unless you have an ongoing relationship with us.</p>
          </Section>

          <Section title="Your Rights (UK GDPR)">
            <p>Under UK data protection law, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to how we process your data</li>
              <li>Lodge a complaint with the Information Commissioner's Office (ICO) at <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary underline">ico.org.uk</a></li>
            </ul>
            <p>To exercise any of these rights, email us at <a href="mailto:hello@sizzlingsensations.co.uk" className="text-primary underline">hello@sizzlingsensations.co.uk</a>.</p>
          </Section>

          <Section title="Cookies">
            <p>Our website does not use tracking or advertising cookies. We may use essential cookies only to ensure the website functions correctly (e.g. remembering your order builder progress within a session).</p>
          </Section>

          <Section title="Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. The most recent version will always be available on this page, with the "Last updated" date at the top.</p>
          </Section>

          <Section title="Contact Us">
            <p>If you have any questions about this policy or how we handle your data:</p>
            <p><strong>Email:</strong> <a href="mailto:hello@sizzlingsensations.co.uk" className="text-primary underline">hello@sizzlingsensations.co.uk</a></p>
          </Section>
        </div>
      </div>
    </>
  );
}
