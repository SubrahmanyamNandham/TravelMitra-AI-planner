import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiSearch } from 'react-icons/fi';
import { HERO_STATS } from '../../data/travel-data';
import styles from '../../styles/Hero.module.scss';

interface FormData {
  destination: string;
  date: string;
  budget: string;
  duration: string;
}

const Hero: React.FC = () => {
  const [form, setForm] = useState<FormData>({ destination: '', date: '', budget: '', duration: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); };

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay },
  });

  return (
    <section className={styles.hero} id="hero">
      {/* Blobs */}
      <div className={`${styles.blob ?? 'blob'} blob blob--blue`}
        style={{ width: 520, height: 520, top: 0, right: -100, animationDelay: '0s' }} />
      <div className={`blob blob--purple`}
        style={{ position:'absolute', width: 420, height: 420, bottom: 0, left: -80, borderRadius:'50%', filter:'blur(100px)', opacity:.15, pointerEvents:'none', background:'#9333ea', animation:'float 8s ease-in-out 2.5s infinite' }} />

      <div className={styles.content}>
        {/* Badge */}
        <motion.div {...fadeUp(0)} style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div className={styles.badge}>
            <span className={styles['badge__dot']} />
            ✨ Trusted by 100K+ Travelers Worldwide
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 className={styles.headline} {...fadeUp(0.1)}>
          Travel Smarter with<br />
          <span className="grad-text">AI-Powered Planning</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p className={styles.sub} {...fadeUp(0.2)}>
          Let AI handle the details while you focus on the adventure. Personalized itineraries, smart recommendations, and seamless coordination — all in one platform.
        </motion.p>

        {/* Checks */}
        <motion.div className={styles.checks} {...fadeUp(0.3)}>
          {['Free to start', 'No credit card needed', 'Ready in 30 seconds'].map(t => (
            <div className={styles.check} key={t}>
              <FiCheck size={18} /> {t}
            </div>
          ))}
        </motion.div>

        {/* Form */}
        <motion.form className={`${styles.form} glass`} onSubmit={handleSubmit} {...fadeUp(0.4)}>
          <div className={styles['form-grid']}>
            <div className={styles['form-group']}>
              <label htmlFor="destination">Destination</label>
              <input id="destination" name="destination" type="text" placeholder="e.g. Bali, Paris…"
                className="form-control" value={form.destination} onChange={handleChange} />
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="date">Travel Date</label>
              <input id="date" name="date" type="date"
                className="form-control" value={form.date} onChange={handleChange} />
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="budget">Budget</label>
              <select id="budget" name="budget" className="form-control" value={form.budget} onChange={handleChange}>
                <option value="">Select budget</option>
                <option>$500 – $1,000</option>
                <option>$1,000 – $2,000</option>
                <option>$2,000 – $5,000</option>
                <option>$5,000+</option>
              </select>
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="duration">Duration</label>
              <select id="duration" name="duration" className="form-control" value={form.duration} onChange={handleChange}>
                <option value="">Select days</option>
                <option>3 Days</option>
                <option>5 Days</option>
                <option>7 Days</option>
                <option>10+ Days</option>
              </select>
            </div>
          </div>
          <div className={styles['form-actions']}>
            <motion.button type="submit" className="btn btn--primary btn-primary"
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ flex: 1, minWidth: 160, padding: '14px 28px', borderRadius: 12 }}>
              <FiSearch size={17} /> Generate AI Trip
            </motion.button>
            <motion.button type="button" className="btn btn--secondary btn-secondary"
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ flex: 1, minWidth: 140, padding: '14px 24px', borderRadius: 12 }}>
              🌍 Explore Destinations
            </motion.button>
          </div>
        </motion.form>

        {/* Stats */}
        <motion.div className={styles.stats} {...fadeUp(0.6)}>
          {HERO_STATS.map((s, i) => (
            <motion.div key={s.label} className={styles['stat-card']}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -6 }}>
              <div className={styles['stat-card__number']}>{s.number}</div>
              <div className={styles['stat-card__label']}>{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;