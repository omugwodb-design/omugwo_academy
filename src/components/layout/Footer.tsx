import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { BrandLogo } from '../branding/BrandLogo';

const footerLinks = {
  courses: [
    { label: 'Moms Course', href: '/courses/moms-course' },
    { label: 'Dads Course', href: '/courses/dads-course' },
    { label: 'Essential Course', href: '/courses/essential' },
    { label: 'Free Mini-Course', href: '/courses/free' },
  ],
  resources: [
    { label: 'Blog', href: '/blog' },
    { label: 'Podcast', href: '/podcast' },
    { label: 'Webinars', href: '/webinars' },
    { label: 'Community', href: '/community' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Team', href: '/team' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Refund Policy', href: '/refund' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/omugwoacademy', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com/omugwoacademy', label: 'Twitter' },
  { icon: Facebook, href: 'https://facebook.com/omugwoacademy', label: 'Facebook' },
  { icon: Youtube, href: 'https://youtube.com/omugwoacademy', label: 'YouTube' },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Join Our Community</h3>
              <p className="text-primary-100">Get weekly tips, resources, and exclusive content delivered to your inbox.</p>
            </div>
            <form className="flex gap-3 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white focus:ring-white/20"
              />
              <Button variant="secondary" className="whitespace-nowrap">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <BrandLogo nameClassName="text-xl font-bold text-white" />
            </Link>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Modern postnatal education for African families. Bridging tradition and science for a healthier motherhood journey.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400 hover:bg-primary-600 hover:text-white transition-all"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">Courses</h4>
            <ul className="space-y-3">
              {footerLinks.courses.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-300">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Victoria Island, Lagos, Nigeria</span>
              </li>
              <li>
                <a href="mailto:hello@omugwoacademy.com" className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>hello@omugwoacademy.com</span>
                </a>
              </li>
              <li>
                <a href="tel:+2348100000000" className="flex items-center gap-3 text-gray-400 hover:text-white text-sm transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>+234 810 000 0000</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            Â© {currentYear} Omugwo Academy. All rights reserved.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link key={link.label} to={link.href} className="text-gray-500 hover:text-white text-sm transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
