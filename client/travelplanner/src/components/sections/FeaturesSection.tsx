import { motion } from 'framer-motion';
import { FEATURES } from '../../data/travel-data';
import { staggerContainer, staggerItem } from '../../utils/helpers';

export const FeaturesSection = () => {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-950 via-dark-900 to-dark-950 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-20 -right-40 w-80 h-80 bg-blue-500 opacity-10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 opacity-10 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-20"
        >
          <motion.div variants={staggerItem} className="inline-block mb-6">
            <span className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-sm font-semibold">
              ✨ Powerful Features
            </span>
          </motion.div>

          <motion.h2
            variants={staggerItem}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            <span className="text-white">Everything You Need for</span>
            <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Smart Travel Planning
            </span>
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            From AI-powered recommendations to real-time updates, our platform handles every detail so you can focus on what matters—experiencing the world.
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {FEATURES.map((feature, index: number) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Card Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Card Border */}
              <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-blue-500/50 transition-colors duration-300" />

              {/* Card Content */}
              <div className="relative p-8 h-full flex flex-col">
                {/* Icon Container */}
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 10 }}
                  className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-6 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors duration-300 flex-shrink-0"
                >
                  <div className="text-4xl">{feature.icon}</div>
                </motion.div>

                {/* Feature Title */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Feature Description */}
                <p className="text-gray-400 leading-relaxed mb-6 flex-grow group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Learn More Link */}
                <motion.div
                  whileHover={{ x: 5 }}
                  className="inline-flex items-center gap-2 text-blue-400 font-semibold cursor-pointer"
                >
                  <span>Learn more</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </motion.div>

                {/* Corner Accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 opacity-0 group-hover:opacity-5 rounded-full -mr-8 -mt-8 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <motion.button
            variants={staggerItem}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
