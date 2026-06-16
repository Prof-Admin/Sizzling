import { useState } from 'react';
import axios from 'axios';
import SEO from '../components/common/SEO';

const EVENT_TYPES = [
  'Wedding', 'Corporate Event', 'Birthday Party',
  'Private Dining', 'Brand Launch', 'Gala Dinner', 'Other',
];

const BUDGET_RANGES = [
  'Under £500', '£500 - £1,000', '£1,000 - £2,500',
  '£2,500 - £5,000', '£5,000 - £10,000', 'Over £10,000', 'To be discussed',
];

const SERVICE_STYLES = [
  'Full-Service Catering', 'Grazing Table', 'Platter Delivery',
  'Buffet', 'Fine Dining / Plated', 'Not sure yet',
];

const INITIAL = {
  name: '', email: '', eventType: '', eventDate: '',
  guestCount: '', budget: '', venue: '', serviceStyle: '', message: '',
};

function SelectIcon() {
  return (
    <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverMsg, setServerMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.eventType) errs.eventType = 'Please select an event type';
    if (!form.eventDate) errs.eventDate = 'Event date is required';
    else if (new Date(form.eventDate) < new Date()) errs.eventDate = 'Date must be in the future';
    if (!form.guestCount) errs.guestCount = 'Guest count is required';
    else if (Number(form.guestCount) < 1) errs.guestCount = 'Must be at least 1';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('loading');
    try {
      const res = await axios.post('/api/enquiries', {
        ...form,
        guestCount: Number(form.guestCount),
      });
      setStatus('success');
      setServerMsg(res.data.message);
      setForm(INITIAL);
    } catch (err) {
      setStatus('error');
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.';
      setServerMsg(msg);
    }
  };

  return (
    <>
      <SEO
        title="Request a Quote — Talk it Through"
        description="Not sure which catering option suits your event? Tell us about your occasion and we'll come back to you with a tailored proposal. No obligation."
        canonical="/contact"
      />

      <div className="min-h-screen bg-offwhite pt-20 pb-16">
        {/* Decorative dots */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {[...Array(12)].map((_, i) => (
            <div key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-gray-200"
              style={{ top: `${10 + i * 8}%`, left: `${5 + (i % 3) * 30}%`, opacity: 0.6 }}
            />
          ))}
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 relative">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-dark">
              Talk it through?
            </h1>
            <p className="mt-3 text-sm md:text-base text-dark-600 max-w-lg mx-auto">
              Not sure which option suits your event, or simply prefer a more personal approach? Tell us about your occasion and we'll come back to you with a tailored proposal — no obligation.
            </p>
          </div>

          <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 md:p-10">
            {status === 'success' ? (
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-serif font-bold text-dark mb-2">Enquiry Received!</h2>
                <p className="text-dark-600">{serverMsg}</p>
                <button onClick={() => setStatus('idle')} className="btn-outline-dark mt-6 px-8">
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate aria-label="Event enquiry form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-dark mb-1.5">
                      Your Name <span className="text-primary">*</span>
                    </label>
                    <input
                      id="name" name="name" type="text"
                      value={form.name} onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`input-field ${errors.name ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
                      autoComplete="name"
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-dark mb-1.5">
                      Email Address <span className="text-primary">*</span>
                    </label>
                    <input
                      id="email" name="email" type="email"
                      value={form.email} onChange={handleChange}
                      placeholder="example@domain.com"
                      className={`input-field ${errors.email ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
                      autoComplete="email"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  {/* Event Type */}
                  <div>
                    <label htmlFor="eventType" className="block text-sm font-medium text-dark mb-1.5">
                      Event Type <span className="text-primary">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="eventType" name="eventType"
                        value={form.eventType} onChange={handleChange}
                        className={`select-field ${errors.eventType ? 'border-red-400' : ''}`}
                      >
                        <option value="">Select event type</option>
                        {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <SelectIcon />
                    </div>
                    {errors.eventType && <p className="text-xs text-red-500 mt-1">{errors.eventType}</p>}
                  </div>

                  {/* Event Date */}
                  <div>
                    <label htmlFor="eventDate" className="block text-sm font-medium text-dark mb-1.5">
                      Event Date <span className="text-primary">*</span>
                    </label>
                    <input
                      id="eventDate" name="eventDate" type="date"
                      value={form.eventDate} onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`input-field ${errors.eventDate ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
                    />
                    {errors.eventDate && <p className="text-xs text-red-500 mt-1">{errors.eventDate}</p>}
                  </div>

                  {/* Guest Count */}
                  <div>
                    <label htmlFor="guestCount" className="block text-sm font-medium text-dark mb-1.5">
                      Guest Count <span className="text-primary">*</span>
                    </label>
                    <input
                      id="guestCount" name="guestCount" type="number"
                      value={form.guestCount} onChange={handleChange}
                      placeholder="0" min="1" max="5000"
                      className={`input-field ${errors.guestCount ? 'border-red-400 focus:ring-red-400 focus:border-red-400' : ''}`}
                    />
                    {errors.guestCount && <p className="text-xs text-red-500 mt-1">{errors.guestCount}</p>}
                  </div>

                  {/* Budget */}
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-dark mb-1.5">
                      Approximate Budget
                    </label>
                    <div className="relative">
                      <select
                        id="budget" name="budget"
                        value={form.budget} onChange={handleChange}
                        className="select-field"
                      >
                        <option value="">Select budget range</option>
                        {BUDGET_RANGES.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                      <SelectIcon />
                    </div>
                  </div>

                  {/* Venue */}
                  <div className="sm:col-span-2">
                    <label htmlFor="venue" className="block text-sm font-medium text-dark mb-1.5">
                      Venue / Location
                    </label>
                    <input
                      id="venue" name="venue" type="text"
                      value={form.venue} onChange={handleChange}
                      placeholder="e.g. Venue name or City"
                      className="input-field"
                      autoComplete="off"
                    />
                  </div>

                  {/* Service Style */}
                  <div className="sm:col-span-2">
                    <label htmlFor="serviceStyle" className="block text-sm font-medium text-dark mb-1.5">
                      Service Style
                    </label>
                    <div className="relative">
                      <select
                        id="serviceStyle" name="serviceStyle"
                        value={form.serviceStyle} onChange={handleChange}
                        className="select-field"
                      >
                        <option value="">What kind of service are you looking for?</option>
                        {SERVICE_STYLES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <SelectIcon />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-medium text-dark mb-1.5">
                      Tell us more
                    </label>
                    <textarea
                      id="message" name="message"
                      value={form.message} onChange={handleChange}
                      placeholder="Any specific requirements, dietary needs, or visions for your event?"
                      rows={5}
                      maxLength={2000}
                      className="input-field resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">{form.message.length}/2000</p>
                  </div>
                </div>

                {status === 'error' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-600">
                    {serverMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary w-full mt-6 py-4 text-base justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit Enquiry
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
