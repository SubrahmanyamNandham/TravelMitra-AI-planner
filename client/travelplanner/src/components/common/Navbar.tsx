import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { MENU_LINKS } from '../../data/travel-data';
import { Button } from './Button';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-dark-900/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="hidden sm:inline text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Travel.io
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {MENU_LINKS.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                whileHover={{ scale: 1.05 }}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </motion.a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="secondary" size="sm">
              Log in
            </Button>
            <Button variant="primary" size="sm">
              Sign up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="px-4 py-4 space-y-4 border-t border-white/10">
            {MENU_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block text-gray-300 hover:text-white transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
            <div className="flex gap-3 pt-4">
              <Button variant="secondary" size="md" fullWidth>
                Log in
              </Button>
              <Button variant="primary" size="md" fullWidth>
                Sign up
              </Button>
            </div>
            </div> </motion.div>
      </div>
    </motion.nav>
  );
};

