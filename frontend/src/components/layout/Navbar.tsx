import { useState, useEffect } from 'react';
import { ShoppingCart, Menu, X, Globe, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'الرئيسية', href: '/' },
    { label: 'تصفح الباقات', href: '/plans' },
    { label: 'كيف يعمل؟', href: '/#how-it-works' },
    { label: 'الدعم', href: '/#faq' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md border-b border-white/10 shadow-lg py-3' 
          : 'bg-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-105 transition-transform">
              G
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Go<span className="text-cyan-400">SIM</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full rounded-full"></span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <div className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer px-2">
              <Globe className="w-4 h-4" />
              <span>AR / DZD</span>
            </div>
            
            <Link to="/login" className="text-gray-300 hover:text-white transition-colors hidden lg:flex items-center gap-2">
              <User className="w-4 h-4" /> تسجيل الدخول
            </Link>
            
            <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-colors relative">
              <ShoppingCart className="w-4 h-4" />
              <span>سلة المشتريات</span>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-background">
                0
              </span>
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-card border-b border-border overflow-hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium text-gray-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <hr className="border-border my-2" />
              <div className="flex items-center justify-between text-gray-300">
                <span className="flex items-center gap-2"><Globe className="w-5 h-5"/> اللغة والعملة</span>
                <span>AR / DZD</span>
              </div>
              <button className="bg-gradient-to-r from-violet-600 to-cyan-500 text-white py-3 rounded-xl font-bold mt-4 shadow-lg shadow-violet-500/20">
                تسجيل الدخول
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
