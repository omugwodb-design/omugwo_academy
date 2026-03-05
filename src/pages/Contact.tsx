import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, Phone, MapPin, Clock, Send, Calendar, 
  MessageCircle, CheckCircle, ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

const contactInfo = [
  { icon: Mail, label: 'Email', value: 'support@omugwoacademy.com', link: 'mailto:support@omugwoacademy.com' },
  { icon: Phone, label: 'Phone', value: '+234 810 555 0123', link: 'tel:+2348105550123' },
  { icon: MapPin, label: 'Address', value: 'Omugwo Plaza, Victoria Island, Lagos, Nigeria' },
  { icon: Clock, label: 'Hours', value: 'Mon - Fri: 9AM - 6PM WAT' },
];

const consultationTypes = [
  { id: 'general', label: 'General Inquiry', description: 'Questions about our courses or platform' },
  { id: 'enrollment', label: 'Enrollment Help', description: 'Assistance with course enrollment' },
  { id: 'partnership', label: 'Partnership', description: 'Business or collaboration opportunities' },
  { id: 'consultation', label: '1-on-1 Consultation', description: 'Personal postnatal guidance session' },
];

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'general',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto px-4"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">Message Sent!</h1>
          <p className="text-gray-600 mb-8">
            Thank you for reaching out. We'll get back to you within 24 hours.
          </p>
          <Button onClick={() => setIsSubmitted(false)}>
            Send Another Message
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-b from-primary-50 to-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-2xl mx-auto"
          >
            <Badge className="mb-4">Contact Us</Badge>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
              We're Here to Help
            </h1>
            <p className="text-xl text-gray-600">
              Have questions about our courses or need support? Reach out and we'll respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8 -mt-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-4 gap-4">
            {contactInfo.map((info, idx) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary-600">
                    <info.icon className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{info.label}</p>
                  {info.link ? (
                    <a href={info.link} className="font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                      {info.value}
                    </a>
                  ) : (
                    <p className="font-semibold text-gray-900">{info.value}</p>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="p-8">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>

                  <Input
                    label="Phone (Optional)"
                    type="tel"
                    placeholder="+234 xxx xxx xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What can we help you with?
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {consultationTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: type.id })}
                          className={`p-4 rounded-xl text-left border-2 transition-all ${
                            formData.type === type.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-semibold text-gray-900 text-sm">{type.label}</p>
                          <p className="text-xs text-gray-500">{type.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      placeholder="Tell us how we can help..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all resize-none"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    isLoading={isSubmitting}
                    rightIcon={<Send className="w-5 h-5" />}
                  >
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Book Consultation */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card className="p-8 bg-gradient-to-br from-primary-600 to-primary-700 text-white border-0">
                <Calendar className="w-12 h-12 mb-4 opacity-80" />
                <h3 className="text-2xl font-black mb-4">Book a Consultation</h3>
                <p className="text-primary-100 mb-6">
                  Need personalized guidance? Schedule a 1-on-1 consultation with one of our postnatal experts.
                </p>
                <ul className="space-y-3 mb-6">
                  {[
                    '30-minute video call',
                    'Personalized advice',
                    'Follow-up resources',
                    'Flexible scheduling',
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-primary-100">
                      <CheckCircle className="w-5 h-5 text-primary-300" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Book Now — ₦15,000
                </Button>
              </Card>

              <Card className="p-8">
                <MessageCircle className="w-12 h-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Join Our Community</h3>
                <p className="text-gray-600 mb-4">
                  Get instant support from our community of 15,000+ parents and experts.
                </p>
                <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Join Community
                </Button>
              </Card>

              {/* Map Placeholder */}
              <Card className="p-0 overflow-hidden h-64">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7286354344!2d3.4216!3d6.4281!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjUnNDEuMiJOIDPCsDI1JzE3LjgiRQ!5e0!3m2!1sen!2sng!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Omugwo Academy Location"
                />
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl font-black text-gray-900 mb-4">
            Looking for Quick Answers?
          </h2>
          <p className="text-gray-600 mb-6">
            Check our FAQ section for answers to commonly asked questions.
          </p>
          <Button variant="outline" rightIcon={<ArrowRight className="w-5 h-5" />}>
            View FAQ
          </Button>
        </div>
      </section>
    </div>
  );
};
