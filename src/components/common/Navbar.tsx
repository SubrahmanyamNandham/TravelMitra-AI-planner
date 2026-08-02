import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { FaPlaneDeparture } from 'react-icons/fa';
import { NAV_LINKS } from '../../data/travel-data';
import styles from './Navbar.module.scss';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <motion.nav
        className={styles.navbar}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className={`${styles['nav-inner']} ${scrolled ? styles['nav-inner--scrolled'] : ''}`}>
          {/* Logo */}
          <a href="#hero" className={styles['nav-logo']}>
            <motion.div whileHover={{ rotate: 10 }} className={styles['nav-logo__icon']}>
              <FaPlaneDeparture size={19} />
            </motion.div>
            <span className={styles['nav-logo__text']}>TravelMitra.io</span>
          </a>

          {/* Desktop Links */}
          <nav className={styles['nav-links']}>
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className={styles['nav-link']}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className={styles['nav-actions']}>
            <button className={styles['nav-btn-ghost']}>Login</button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={styles['nav-btn-primary']}
            >
              Explore
              <motion.span animate={{ x: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.3 }}>
                <FiArrowRight size={16} />
              </motion.span>
            </motion.button>
          </div>

          {/* Hamburger */}
          <button
            className={`${styles['nav-toggle']} ${isOpen ? styles['nav-toggle--open'] : ''}`}
            onClick={() => setIsOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </motion.nav>

      {/* Overlay */}
      <div
        className={`${styles['nav-overlay']} ${isOpen ? styles['nav-overlay--open'] : ''}`}
        onClick={closeMenu}
      />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`${styles['nav-drawer']} ${styles['nav-drawer--open']}`}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {NAV_LINKS.map(link => (
              <a key={link.label} href={link.href} className={styles['drawer-link']} onClick={closeMenu}>
                {link.label} <span>→</span>
              </a>
            ))}
            <button className={styles['drawer-cta']} onClick={closeMenu}>
              Get Started Free
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
