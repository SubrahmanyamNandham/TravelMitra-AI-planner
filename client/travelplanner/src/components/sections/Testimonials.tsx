import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';
import { TESTIMONIALS } from '../../data/travel-data';
import { staggerContainer, staggerItem } from '../../utils/helpers';

export const TestimonialsSection = () => {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-dark-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            variants={staggerItem}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 font-display"
          >
            <span className="text-white">Loved by</span>
            <span className="gradient-text block">Travelers Worldwide</span>
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Hear from real users who've transformed their travel experience with TravelMitra.io
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={staggerItem}
              whileHover={{ y: -5 }}
              className="glass p-6 sm:p-8 rounded-2xl flex flex-col h-full"
            >
              {/* Rating */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex gap-1 mb-4"
              >
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    size={16}
                    className={`${
                      i < Math.floor(testimonial.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : i < testimonial.rating
                        ? 'fill-yellow-400 text-yellow-400 opacity-50'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </motion.div>

              {/* Quote */}
              <p className="text-gray-100 mb-6 flex-1 leading-relaxed">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-16 pt-16 border-t border-white/10"
        >
          {[
            { label: 'Users', value: '100K+' },
            { label: 'Trips Planned', value: '500K+' },
            { label: 'Avg. Rating', value: '4.9★' },
            { label: 'Countries', value: '195' },
          ].map((badge: { label: string; value: string }, index: number) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className="text-center"
            >
              <motion.div className="text-2xl sm:text-3xl font-bold gradient-text mb-2">
                {badge.value}
              </motion.div>
              <p className="text-sm text-gray-400">{badge.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
