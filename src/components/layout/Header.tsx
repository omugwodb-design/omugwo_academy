import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, ChevronDown, Heart, BookOpen, Users,
  GraduationCap, MessageCircle, Calendar, User, LogOut
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

const navItems = [
  {
    label: 'Courses',
    href: '/courses',
    children: [
      { label: 'Moms Course', href: '/courses/moms-course', icon: Heart, desc: 'Complete postnatal guide for mothers' },
      { label: 'Dads Course', href: '/courses/dads-course', icon: Users, desc: 'Essential support training for fathers' },
      { label: 'Essential Course', href: '/courses/essential', icon: BookOpen, desc: 'Core fundamentals for all parents' },
      { label: 'Free Mini-Course', href: '/courses/free', icon: GraduationCap, desc: 'Start your journey for free' },
    ],
  },
  {
    label: 'Community',
    href: '/community',
    children: [
      { label: 'Discussion Spaces', href: '/community', icon: MessageCircle, desc: 'Connect with other parents' },
    ],
  },
  { label: 'Webinars', href: '/webinars' },
  { label: 'About', href: '/about' },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-soft py-3' : 'bg-transparent py-5'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Omugwo<span className="text-primary-600">Academy</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-xl transition-all',
                    location.pathname.startsWith(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  )}
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform',
                        activeDropdown === item.label && 'rotate-180'
                      )}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 overflow-hidden"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors group"
                        >
                          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                            <child.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{child.label}</p>
                            <p className="text-xs text-gray-500">{child.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Side â€“ Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                {/* User avatar with hover dropdown */}
                <div className="relative">
                  <button 
                    className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm hover:bg-primary-700 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(activeDropdown === 'profile' ? null : 'profile');
                    }}
                  >
                    {user?.fullName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                  </button>
                  <AnimatePresence>
                    {activeDropdown === 'profile' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50"
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => setActiveDropdown('profile')}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <div className="px-3 py-2 border-b border-gray-100 mb-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName || 'User'}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link 
                          to="/dashboard" 
                          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <User className="w-4 h-4" /> My Dashboard
                        </Link>
                        {(user?.role === 'admin' || user?.role === 'super_admin') && (
                          <Link 
                            to="/admin" 
                            className="flex items-center gap-2 px-3 py-2 text-sm text-purple-700 hover:bg-purple-50 rounded-xl"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <GraduationCap className="w-4 h-4" /> Admin Dashboard
                          </Link>
                        )}
                        <button 
                          onClick={() => {
                            handleSignOut();
                            setActiveDropdown(null);
                          }} 
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl"
                        >
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Start Learning</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden mt-4 pb-4 border-t border-gray-100"
            >
              <nav className="flex flex-col gap-1 pt-4">
                {navItems.map((item) => (
                  <div key={item.label}>
                    <Link
                      to={item.href}
                      className="flex items-center justify-between px-4 py-3 text-gray-700 font-semibold rounded-xl hover:bg-gray-50"
                    >
                      {item.label}
                      {item.children && <ChevronDown className="w-4 h-4" />}
                    </Link>
                  </div>
                ))}
                <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100 px-4">
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-3">
                      <Link to="/dashboard" className="w-full">
                        <Button variant="secondary" className="w-full">Dashboard</Button>
                      </Link>
                      <div className="px-2 py-2 bg-gray-50 rounded-xl">
                        <p className="text-sm font-semibold text-gray-700">{user?.fullName || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-600 font-semibold hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link to="/login">
                        <Button variant="secondary" className="w-full">Sign In</Button>
                      </Link>
                      <Link to="/register">
                        <Button className="w-full">Start Learning</Button>
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
