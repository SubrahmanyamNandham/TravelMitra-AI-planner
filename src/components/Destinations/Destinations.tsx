const destinations = [
  {
    img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    alt: 'Bali, Indonesia', country: '📍 Indonesia', name: 'Bali', rating: '4.9',
    desc: 'Tropical paradise with stunning temples, lush rice terraces, vibrant nightlife, and pristine beaches.',
    reviews: '12.4K', budget: '$1,200 / wk', tags: ['Beaches', 'Temples', 'Nightlife', 'Wellness'],
  },
  {
    img: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=600&q=80',
    alt: 'Paris, France', country: '📍 France', name: 'Paris', rating: '4.8',
    desc: 'The city of light — iconic Eiffel Tower, world-class cuisine, art museums, and romantic boulevards.',
    reviews: '28.1K', budget: '$2,500 / wk', tags: ['Romance', 'Culture', 'Cuisine', 'Art'],
  },
  {
    img: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=600&q=80',
    alt: 'Kyoto, Japan', country: '📍 Japan', name: 'Kyoto', rating: '4.9',
    desc: 'Ancient Japan at its finest — thousand-year-old shrines, bamboo groves, tea ceremonies, and cherry blossoms.',
    reviews: '19.7K', budget: '$1,800 / wk', tags: ['History', 'Nature', 'Temples', 'Food'],
  },
  {
  img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',
  alt: 'Taj Mahal, India',
  country: '📍 India',
  name: 'Agra',
  rating: '4.8',
  desc: 'Home to the iconic Taj Mahal, rich Mughal heritage, historic forts, and vibrant local culture.',
  reviews: '24.5K',
  budget: '$900 / wk',
  tags: ['Heritage', 'History', 'Architecture', 'Culture'],
},
{
  img: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?w=600&q=80',
  alt: 'Rome, Italy',
  country: '📍 Italy',
  name: 'Rome',
  rating: '4.9',
  desc: 'The Eternal City featuring the Colosseum, ancient ruins, Vatican landmarks, and authentic Italian cuisine.',
  reviews: '31.2K',
  budget: '$2,200 / wk',
  tags: ['History', 'Architecture', 'Food', 'Culture'],
},
{
  img: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=600&q=80',
  alt: 'Maldives',
  country: '📍 Maldives',
  name: 'Maldives',
  rating: '5.0',
  desc: 'Crystal-clear turquoise waters, luxury overwater villas, coral reefs, and relaxing island experiences.',
  reviews: '16.8K',
  budget: '$3,000 / wk',
  tags: ['Beaches', 'Luxury', 'Resorts', 'Honeymoon'],
},
]

export default function Destinations() {
  return (
    <section className="section" id="destinations">
      <div className="blob blob-purple" style={{ width: 380, height: 380, top: 0, right: '20%', opacity: 0.07 }} />

      <div className="container">
        <div className="destinations-head">
          <div className="text">
            <div className="section-badge badge-green">🌍 Explore the World</div>
            <h2>Popular Destinations<br /><span className="grad-text">Loved by Travelers</span></h2>
            <p>Handpicked destinations loved by our community — from iconic cities to hidden gems waiting to be discovered.</p>
          </div>
          <button className="btn-outline">
            View All Destinations
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="dest-grid">
          {destinations.map(({ img, alt, country, name, rating, desc, reviews, budget, tags }) => (
            <div className="dest-card" key={name}>
              <div className="dest-img-wrap">
                <img src={img} alt={alt} loading="lazy" />
                <div className="dest-overlay" />
                <div className="dest-country-badge">{country}</div>
                <button className="dest-explore-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="dest-body">
                <div className="dest-title-row">
                  <h3 className="dest-name">{name}</h3>
                  <div className="dest-rating"><span className="star">★</span> {rating}</div>
                </div>
                <p className="dest-desc">{desc}</p>
                <div className="dest-meta">
                  <div className="dest-meta-item"><div className="label">Reviews</div><div className="value">{reviews}</div></div>
                  <div className="dest-meta-item right"><div className="label">Est. Budget</div><div className="value">{budget}</div></div>
                </div>
                <div className="dest-tags">
                  {tags.map(tag => <span className="dest-tag" key={tag}>{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
