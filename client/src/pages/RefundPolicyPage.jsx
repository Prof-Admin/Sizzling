import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-serif font-bold text-dark mb-4">{title}</h2>
      <div className="space-y-3 text-sm text-dark-600 leading-relaxed">{children}</div>
    </div>
  );
}

export default function RefundPolicyPage() {
  return (
    <>
      <SEO
        title="Refund Policy — Sizzling Sensations"
        description="Sizzling Sensations' cancellation and refund policy for Main Menu orders, Individual Food Boxes, and Grazing Tables."
        canonical="/refund-policy"
      />

      <div className="pt-24 pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-2">Legal</p>
            <h1 className="text-4xl font-serif font-bold text-dark mb-3">Refund Policy</h1>
            <p className="text-sm text-dark-600">Last updated: July 2025</p>
          </div>

          <Section title="Overview">
            <p>We understand that plans can change. This policy explains how cancellations and refunds are handled for each of our three services. If you need to cancel, please contact us as early as possible at <a href="mailto:hello@sizzlingsensations.co.uk" className="text-primary underline">hello@sizzlingsensations.co.uk</a>.</p>
          </Section>

          <Section title="Main Menu Orders">
            <div className="bg-offwhite border border-gray-200 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-dark">When you cancel</th>
                    <th className="text-left px-4 py-3 font-semibold text-dark">Refund</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3">Before Monday 12pm (order window still open)</td>
                    <td className="px-4 py-3 text-green-700 font-medium">Full refund</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3">After Monday 12pm (order window closed)</td>
                    <td className="px-4 py-3 text-red-600 font-medium">No refund — preparation has begun</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>Orders open every Saturday and close at 12pm on Monday. Preparation begins on Tuesday. Cancellations after the Monday 12pm cutoff cannot be refunded as food may already be in preparation.</p>
          </Section>

          <Section title="Individual Food Boxes">
            <div className="bg-offwhite border border-gray-200 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-dark">When you cancel</th>
                    <th className="text-left px-4 py-3 font-semibold text-dark">Refund</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3">More than 48 hours before collection / delivery</td>
                    <td className="px-4 py-3 text-green-700 font-medium">Full refund</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <td className="px-4 py-3">24–48 hours before collection / delivery</td>
                    <td className="px-4 py-3 text-amber-600 font-medium">50% refund</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Less than 24 hours before collection / delivery</td>
                    <td className="px-4 py-3 text-red-600 font-medium">No refund</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          <Section title="Grazing Tables">
            <div className="bg-offwhite border border-gray-200 rounded-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-dark">When you cancel</th>
                    <th className="text-left px-4 py-3 font-semibold text-dark">Refund</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="px-4 py-3">More than 14 days before the event</td>
                    <td className="px-4 py-3 text-amber-600 font-medium">Remaining balance refunded; 50% deposit is non-refundable</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <td className="px-4 py-3">7–14 days before the event</td>
                    <td className="px-4 py-3 text-amber-600 font-medium">25% of the remaining balance refunded</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Less than 7 days before the event</td>
                    <td className="px-4 py-3 text-red-600 font-medium">No refund — full balance due</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>The 50% deposit paid at booking is non-refundable in all circumstances, as it covers the costs we incur in reserving your date and beginning event planning.</p>
          </Section>

          <Section title="Quality Issues">
            <p>If you receive food that does not meet the expected standard, please contact us within <strong>24 hours</strong> of receiving your order at <a href="mailto:hello@sizzlingsensations.co.uk" className="text-primary underline">hello@sizzlingsensations.co.uk</a>. Please include:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Your order reference or name</li>
              <li>A description of the issue</li>
              <li>Photos where possible</li>
            </ul>
            <p>We review all quality complaints and will offer a replacement, partial refund, or credit at our discretion depending on the circumstances.</p>
          </Section>

          <Section title="How Refunds Are Processed">
            <p>Approved refunds are returned to the original payment method within 5–10 business days. Refunds to bank transfers may take slightly longer depending on your bank.</p>
          </Section>

          <Section title="Contact">
            <p>To request a cancellation or refund, email us as early as possible at <a href="mailto:hello@sizzlingsensations.co.uk" className="text-primary underline">hello@sizzlingsensations.co.uk</a> with your name, order details, and the reason for cancellation.</p>
            <p>These terms do not affect your statutory rights. For more information see our <Link to="/terms" className="text-primary underline">Terms of Service</Link>.</p>
          </Section>
        </div>
      </div>
    </>
  );
}
