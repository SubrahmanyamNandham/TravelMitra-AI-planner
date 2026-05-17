import { motion } from 'framer-motion';
import { FiArrowRight, FiStar } from 'react-icons/fi';
import { DESTINATIONS } from '../../data/travel-data';
import { staggerContainer, staggerItem } from '../../utils/helpers';

export const DestinationsSection = () => {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-dark-900">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
            <div>
              <motion.h2
                variants={staggerItem}
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 font-display"
              >
                <span className="text-white">Popular</span>
                <span className="gradient-text block">Destinations</span>
              </motion.h2>

              <motion.p variants={staggerItem} className="text-gray-300">
                Discover trending destinations loved by our community
              </motion.p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary"
            >
              View All
            </motion.button>
          </div>
        </motion.div>

        {/* Destinations Grid */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {DESTINATIONS.map((destination) => (
            <motion.div
              key={destination.id}
              variants={staggerItem}
              whileHover={{ y: -10 }}
              className="card-hover group overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-48 sm:h-56 mb-4 rounded-xl overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                  transition={{ duration: 0.3 }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
                  <div>
                    <p className="text-sm text-gray-300">{destination.country}</p>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="bg-blue-500 p-2 rounded-lg"
                  >
                    <FiArrowRight size={20} className="text-white" />
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex-1">
                    {destination.name}
                  </h3>
                </div>

                <p className="text-sm text-gray-400 mb-4 min-h-[40px] line-clamp-2">
                  {destination.description}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <FiStar size={16} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold text-white">
                      {destination.rating}
                    </span>
                  </div>
                  <span className="text-sm text-gray-400">
                    ({destination.reviews} reviews)
                  </span>
                </div>

                {/* Budget and Button */}
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <p className="text-gray-400">Est. Budget</p>
                    <p className="text-lg font-bold text-blue-400">
                      {destination.budget}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 px-4 py-2 rounded-lg transition-colors font-medium"
                  >
                    Explore
                  </motion.button>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
                  {destination.highlights.map((highlight: string) => (
                    <span
                      key={highlight}
                      className="px-3 py-1 bg-blue-500/10 text-blue-300 text-xs rounded-full border border-blue-500/20"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
