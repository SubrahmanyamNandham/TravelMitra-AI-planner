import { motion } from 'framer-motion';
import React from 'react';
import {
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
} from 'react-icons/fi';
import { staggerContainer, staggerItem } from '../../utils/helpers';

export const Footer = () => {
  const socialIcons: Record<string, React.ReactNode> = {
    twitter: <FiTwitter size={20} />,
    facebook: <FiFacebook size={20} />,
    instagram: <FiInstagram size={20} />,
    linkedin: <FiLinkedin size={20} />,
  };

  return (
    <footer className="bg-dark-950 border-t border-white/10">
      {/* Main Footer */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          >
            {/* Brand */}
            <motion.div variants={staggerItem}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-xl font-bold gradient-text">TravelMitra.io</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your AI-powered travel planning companion for unforgettable journeys.
              </p>
            </motion.div>

            {/* Product */}
            <motion.div variants={staggerItem}>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Security', 'Blog'].map((item: string) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Company */}
            <motion.div variants={staggerItem}>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2">
                {['About', 'Careers', 'Press', 'Contact'].map((item: string) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Legal */}
            <motion.div variants={staggerItem}>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Cookies', 'License'].map((item: string) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Bottom */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8"
          >
            {/* Copyright */}
            <motion.p variants={staggerItem} className="text-gray-400 text-sm">
              © 2026 TravelMitra.io. All rights reserved.
            </motion.p>

            {/* Social Links */}
            <motion.div
              variants={staggerItem}
              className="flex items-center gap-6"
            >
              {['twitter', 'facebook', 'instagram', 'linkedin'].map((social: string) => (
                <motion.a
                  key={social}
                  href="#"
                  whileHover={{ scale: 1.2, color: '#3B82F6' }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 transition-colors"
                >
                  {socialIcons[social]}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Floating Background Elements */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-40 h-40 bg-blue-500 opacity-5 rounded-full blur-3xl -z-10"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500 opacity-5 rounded-full blur-3xl -z-10"
      />
    </footer>
  );
};
