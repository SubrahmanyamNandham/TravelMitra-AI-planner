import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiArrowRight, FiCheck } from 'react-icons/fi';
import { staggerContainer, staggerItem } from '../../utils/helpers';

export const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setEmail('');
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-950 to-dark-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="glass p-8 sm:p-12 rounded-3xl text-center"
        >
          {/* Header */}
          <motion.h2
            variants={staggerItem}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-display"
          >
            <span className="text-white">Stay Updated with</span>
            <span className="gradient-text block">Travel Tips & Deals</span>
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-gray-300 mb-8 max-w-xl mx-auto"
          >
            Get weekly inspiration, exclusive deals, and AI-powered travel recommendations delivered to your inbox.
          </motion.p>

          {/* Newsletter Form */}
          <motion.form
            variants={staggerItem}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="btn-primary flex items-center justify-center gap-2"
            >
              {isSubmitted ? <FiCheck size={20} /> : <FiArrowRight size={20} />}
              <span>{isSubmitted ? 'Subscribed!' : 'Subscribe'}</span>
            </motion.button>
          </motion.form>

          {/* Benefits */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10"
          >
            {[
              '✉️ Weekly tips',
              '🎉 Exclusive deals',
              '🤖 AI recommendations',
            ].map((benefit: string, index: number) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="text-sm text-gray-300"
              >
                {benefit}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
