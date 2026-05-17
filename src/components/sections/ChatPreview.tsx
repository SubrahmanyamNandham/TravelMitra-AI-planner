import { motion } from 'framer-motion';
import { CHAT_PREVIEW } from '../../data/travel-data';
import { staggerContainer, staggerItem } from '../../utils/helpers';

export const ChatPreviewSection = () => {
  return (
    <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dark-900 to-dark-950">
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
            <span className="text-white">Meet Your AI Travel</span>
            <span className="gradient-text block">Planning Assistant</span>
          </motion.h2>

          <motion.p
            variants={staggerItem}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Get instant, personalized travel recommendations powered by advanced AI
          </motion.p>
        </motion.div>

        {/* Chat Preview */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            variants={staggerItem}
            whileHover={{ y: -10 }}
            className="glass p-6 sm:p-8 rounded-2xl"
          >
            {/* Chat Container */}
            <div className="space-y-4">
              {/* User Message */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="flex justify-end"
              >
                <div className="bg-blue-600 text-white rounded-2xl rounded-tr-sm px-4 sm:px-6 py-3 max-w-md sm:max-w-lg">
                  <p className="text-sm sm:text-base">{CHAT_PREVIEW.user}</p>
                </div>
              </motion.div>

              {/* AI Response */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="flex justify-start"
              >
                <div className="bg-white/10 border border-white/20 text-gray-100 rounded-2xl rounded-tl-sm px-4 sm:px-6 py-4 max-w-md sm:max-w-xl">
                  <div className="text-sm sm:text-base leading-relaxed space-y-3 font-light">
                    {CHAT_PREVIEW.ai.split('\n\n').map((paragraph: string, idx: number) => (
                      <div key={idx}>
                        {paragraph.split('\n').map((line: string, lineIdx: number) => (
                          <p key={lineIdx} className="text-xs sm:text-sm">
                            {line}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Input Field */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  placeholder="Ask me anything about your trip..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary"
                >
                  Send
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12"
          >
            {[
              {
                title: 'Instant Responses',
                description: 'Get answers in seconds',
              },
              {
                title: 'Personalized Plans',
                description: 'Tailored to your preferences',
              },
              {
                title: '24/7 Availability',
                description: 'Always here to help',
              },
            ].map((feature: { title: string; description: string }, index: number) => (
              <motion.div
                key={index}
                variants={staggerItem}
                className="text-center"
              >
                <h4 className="font-semibold text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
