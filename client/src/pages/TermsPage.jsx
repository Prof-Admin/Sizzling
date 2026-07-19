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

export default function TermsPage() {
  return (
    <>
      <SEO
        title="Terms of Service — Sizzling Sensations"
        description="Terms and conditions for ordering from Sizzling Sensations, including order windows, payment, notice periods, and delivery."
        canonical="/terms"
      />

      <div className="pt-24 pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-10">
            <p className="text-xs font-bold tracking-widest uppercase text-primary mb-2">Legal</p>
            <h1 className="text-4xl font-serif font-bold text-dark mb-3">Terms of Service</h1>
            <p className="text-sm text-dark-600">Last updated: July 2025</p>
          </div>

          <Section title="About These Terms">
            <p>These Terms of Service apply to all orders and bookings made with Sizzling Sensations ("we", "us", "our"). By placing an order or making an enquiry, you agree to these terms.</p>
            <p>Please read them carefully before ordering. If you have any questions, contact us at <a href="mailto:hello@sizzlingsensations.co.uk" className="text-primary underline">hello@sizzlingsensations.co.uk</a> before proceeding.</p>
          </Section>

          <Section title="Our Services">
            <p>We offer three catering services:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li><strong>Main Menu</strong> — Large-portion Nigerian dishes (rice, proteins, soups & stews, sides) for delivery or collection. Minimum order £150.</li>
              <li><strong>Individual Food Boxes</strong> — Individually packed meals at £15 per box. Minimum 10 boxes. London only.</li>
              <li><strong>Grazing Tables</strong> — Fully styled food displays for events, including canapés, bowl food, desserts, and table styling.</li>
            </ul>
          </Section>

          <Section title="Ordering — Main Menu">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Orders open every Saturday and close at 12pm on Monday.</li>
              <li>Orders received after Monday 12pm will be processed in the following week's batch.</li>
              <li>Dispatch begins from Tuesday of each week.</li>
              <li>Minimum order value is £150 (excluding delivery).</li>
              <li>Delivery is free until 31st August 2026.</li>
              <li>Your order is confirmed once full payment is received.</li>
            </ul>
          </Section>

          <Section title="Ordering — Individual Food Boxes">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>A minimum of 10 boxes must be ordered per order.</li>
              <li>At least one week's notice is required from the date of order to the collection/delivery date.</li>
              <li>Available for London orders only.</li>
              <li>Collection is free from our kitchen. Delivery must be arranged and paid for by the customer (e.g. via Uber).</li>
              <li>Your order is confirmed once full payment is received.</li>
            </ul>
          </Section>

          <Section title="Ordering — Grazing Tables">
            <ul className="list-disc pl-5 space-y-1.5">
              <li>A minimum of three weeks' notice is required before the event date.</li>
              <li>A 50% deposit is required to secure your booking. The remaining balance is due no later than 14 days before the event.</li>
              <li>Table styling (£250) is included and covers linen, florals, chafing dishes, serving pieces, plates, napkins, and cutlery, all coordinated to your colour palette.</li>
              <li>Logistics costs (from £100) are confirmed based on your venue location.</li>
              <li>Staffing is charged at £15 per staff member per hour, with a minimum of 4 hours per staff member.</li>
            </ul>
          </Section>

          <Section title="Payment">
            <p>We accept payment by bank transfer or Stripe payment link. Payment details are included in your invoice.</p>
            <p>Orders and bookings are only confirmed upon receipt of the required payment. We reserve the right to cancel an unconfirmed booking if payment is not received within 48 hours of the invoice being sent.</p>
          </Section>

          <Section title="Dietary & Allergen Information">
            <p>All food prepared by Sizzling Sensations is halal. While we take care to avoid cross-contamination, our kitchen handles a variety of ingredients. If you have a severe allergy, please contact us before ordering so we can advise you accordingly.</p>
            <p>It is your responsibility to inform us of any dietary requirements or allergies at the time of ordering. We cannot guarantee allergen-free preparation if we are not informed in advance.</p>
          </Section>

          <Section title="Cancellations & Refunds">
            <p>Cancellations and refunds are handled in accordance with our <Link to="/refund-policy" className="text-primary underline">Refund Policy</Link>.</p>
          </Section>

          <Section title="Quality & Complaints">
            <p>We take the quality of our food seriously. If you have a concern about the quality of your order, please contact us within 24 hours of receiving it at <a href="mailto:hello@sizzlingsensations.co.uk" className="text-primary underline">hello@sizzlingsensations.co.uk</a> with photos where possible.</p>
          </Section>

          <Section title="Limitation of Liability">
            <p>Our liability to you in connection with any order or booking is limited to the amount you paid for that order or booking. We are not liable for any indirect or consequential loss.</p>
          </Section>

          <Section title="Changes to These Terms">
            <p>We may update these Terms of Service from time to time. The current version will always be available at this URL with the "Last updated" date shown at the top.</p>
          </Section>

          <Section title="Governing Law">
            <p>These terms are governed by the laws of England and Wales. Any disputes will be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
          </Section>

          <Section title="Contact">
            <p><strong>Email:</strong> <a href="mailto:hello@sizzlingsensations.co.uk" className="text-primary underline">hello@sizzlingsensations.co.uk</a></p>
          </Section>
        </div>
      </div>
    </>
  );
}
