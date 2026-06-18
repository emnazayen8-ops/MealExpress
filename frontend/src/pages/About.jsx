import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    { icon: '🌿', title: 'Authenticity', desc: 'Every product is sourced directly from Tunisian artisans and farmers who have been perfecting their craft for generations.' },
    { icon: '🤝', title: 'Fair Trade', desc: 'We work directly with local producers, ensuring fair prices and sustainable livelihoods for Tunisian communities.' },
    { icon: '📦', title: 'Quality First', desc: 'Each product is hand-selected and quality-checked before it makes it into your box. No compromises.' },
    { icon: '🌍', title: 'Sustainability', desc: 'Eco-friendly packaging and carbon-conscious shipping — we care about the planet as much as we care about taste.' },
  ];

  const team = [
    {
      name: 'Emna Zayen',
      role: 'Founder & CEO',
      photo: '/team/emna.jpg',
      bio: 'Passionate about sharing Tunisian culinary heritage with the world.'
    },
    {
      name: 'Eya Zayen',
      role: 'Head of Sourcing',
      photo: '/team/eya.jpg',
      bio: 'Travels across Tunisia to find the finest artisanal products.'
    },
    {
      name: 'Edam Zayen',
      role: 'Customer Experience',
      photo: '/team/edam.jpg',
      bio: 'Ensures every customer has a seamless and delightful experience.'
    },
  ];

  const stats = [
    { number: '500+', label: 'Happy Customers' },
    { number: '30+', label: 'Artisan Partners' },
    { number: '3', label: 'Curated Boxes' },
    { number: '100%', label: 'Authentic Products' },
  ];

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#291B25] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block bg-[#ED5B2D] bg-opacity-20 text-[#F7B9A1] text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-[#ED5B2D] border-opacity-30">
            🇹🇳 Our Story
          </span>
          <h1 className="text-5xl font-bold mb-6">Bringing Tunisia to Your Doorstep</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
            MealExpress was born from a simple idea — to share the rich, vibrant flavors of Tunisian cuisine with food lovers around the world. We curate the finest artisanal products and deliver them straight to your door, every month.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-[#ED5B2D] py-12 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-bold">{s.number}</p>
              <p className="text-orange-100 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-[#291B25] mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Tunisia has one of the richest culinary traditions in the world — from the fiery depth of harissa to the golden sweetness of Deglet Nour dates, from cold-pressed olive oils to hand-crafted biscuits passed down through families for centuries.
            </p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our mission is simple: connect passionate food lovers with the authentic taste of Tunisia, while supporting the local artisans who make it all possible.
            </p>
            <Link to="/boxes" className="inline-block bg-[#ED5B2D] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d94d22] transition">
              Discover Our Boxes →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['🫒', '🌶️', '🍯', '🥐'].map((emoji, i) => (
              <div key={i} className="bg-[#F7B9A1] rounded-2xl h-32 flex items-center justify-center text-5xl shadow-sm">
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20 px-6 bg-[#291B25]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Our Values</h2>
            <p className="text-gray-400">What drives everything we do at MealExpress</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl p-6">
                <p className="text-3xl mb-3">{v.icon}</p>
                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#291B25] mb-3">Meet the Team</h2>
          <p className="text-gray-500">The people behind MealExpress</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((member) => (
            <div key={member.name} className="bg-white rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition">
              <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-[#F7B9A1]">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.style.background = '#F7B9A1';
                    e.target.parentElement.style.display = 'flex';
                    e.target.parentElement.style.alignItems = 'center';
                    e.target.parentElement.style.justifyContent = 'center';
                    e.target.parentElement.innerHTML = `<span style="font-size:2rem;font-weight:bold;color:#291B25">${member.name.charAt(0)}</span>`;
                  }}
                />
              </div>
              <h3 className="font-bold text-[#291B25] text-lg">{member.name}</h3>
              <p className="text-[#ED5B2D] text-sm font-semibold mb-2">{member.role}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="py-16 px-6">
        <div className="max-w-3xl mx-auto bg-[#F7B9A1] rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-bold text-[#291B25] mb-4">Ready to taste Tunisia?</h2>
          <p className="text-[#291B25] text-opacity-70 mb-8">Join our growing community of food lovers discovering authentic Tunisian flavors.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/boxes" className="bg-[#ED5B2D] text-white px-8 py-3 rounded-full font-bold hover:bg-[#d94d22] transition">
              Browse Boxes
            </Link>
            <Link to="/contact" className="bg-white text-[#291B25] px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;