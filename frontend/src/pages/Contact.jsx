import { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../config/api.js';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/contact`, form);
      toast.success('Message sent! We will get back to you within 24 hours.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const infos = [
    { icon: '📧', label: 'Email', value: 'hello@mealexpress.tn', href: 'mailto:hello@mealexpress.tn' },
    { icon: '📱', label: 'Phone', value: '+216 70 000 000', href: 'tel:+21670000000' },
    { icon: '📍', label: 'Address', value: 'Tunis, Tunisia', href: null },
    { icon: '🕐', label: 'Hours', value: 'Mon–Fri, 9am–6pm', href: null },
  ];

  const faqs = [
    { q: 'When will my box be delivered?', a: 'Boxes are shipped within 3 business days of your subscription being confirmed.' },
    { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime from your dashboard with no extra fees.' },
    { q: 'Do you ship internationally?', a: 'Currently we ship within Tunisia. International shipping is coming soon!' },
    { q: 'What if a product is damaged?', a: 'Contact us within 48 hours of delivery and we will make it right.' },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#291B25] text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            Have a question, feedback, or just want to say hello? We would love to hear from you.
          </p>
        </div>
      </div>

      <div className="py-16 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-[#291B25] mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text" name="name" value={form.name} onChange={handleChange} required
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#61A6AB] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email" name="email" value={form.email} onChange={handleChange} required
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#61A6AB] text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <select
                  name="subject" value={form.subject} onChange={handleChange} required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#61A6AB] text-sm bg-white"
                >
                  <option value="">Select a subject</option>
                  <option value="order">My Order</option>
                  <option value="subscription">Subscription</option>
                  <option value="product">Product Question</option>
                  <option value="delivery">Delivery Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  name="message" value={form.message} onChange={handleChange} required
                  rows="5" placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#61A6AB] text-sm resize-none"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-[#ED5B2D] text-white py-3.5 rounded-xl font-semibold hover:bg-[#d94d22] transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <><span className="animate-spin">⟳</span> Sending...</> : '✉️ Send Message'}
              </button>
            </form>
          </div>

          {/* Info + FAQ */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#291B25] mb-6">Contact Info</h2>
              <div className="space-y-4">
                {infos.map((info) => (
                  <div key={info.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#F6F6E9] rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                      {info.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-sm font-semibold text-[#61A6AB] hover:underline">{info.value}</a>
                      ) : (
                        <p className="text-sm font-semibold text-[#291B25]">{info.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#291B25] mb-6">FAQ</h2>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <p className="font-semibold text-[#291B25] text-sm mb-1">{faq.q}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;