import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api.js';

const Home = () => {
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/boxes`)
      .then(({ data }) => setBoxes(data))
      .catch(console.error);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="bg-[#291B25] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-[#ED5B2D] blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-[#61A6AB] blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block bg-[#ED5B2D] bg-opacity-20 text-[#F7B9A1] text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-[#ED5B2D] border-opacity-30">
              🇹🇳 Authentic Tunisian Products
            </span>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Taste Tunisia,<br />
              <span className="text-[#F7B9A1]">Every Month.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-xl leading-relaxed">
              Curated boxes of artisanal Tunisian food — harissa, olive oil, dates, and more — delivered straight to your door.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/boxes"
                className="inline-block bg-[#ED5B2D] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#d94d22] transition transform hover:scale-105 text-center"
              >
                Discover Our Boxes
              </Link>
              <Link
                to="/register"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-[#291B25] transition text-center"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#291B25] mb-3">Why MealExpress?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">We work directly with local Tunisian artisans so every product is the real thing.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: '🎯', color: 'bg-[#61A6AB]', title: 'Curated Selection', desc: 'Handpicked products from local artisans — no mass-produced substitutes, ever.' },
            { icon: '🚚', color: 'bg-[#ED5B2D]', title: 'Monthly Delivery', desc: 'Fresh boxes shipped right to your door, with real-time order tracking.' },
            { icon: '✓', color: 'bg-[#F7B9A1]', title: 'Cancel Anytime', desc: 'No long-term contracts. Pause or cancel your subscription with one click.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group">
              <div className={`w-14 h-14 ${f.color} rounded-2xl mb-5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#291B25]">{f.title}</h3>
              <p className="text-gray-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Boxes Preview */}
      <section className="py-20 px-6 bg-[#291B25]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[#F7B9A1] text-sm font-semibold tracking-widest uppercase">Our Boxes</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">Find Your Perfect Box</h2>
            </div>
            <Link to="/boxes" className="mt-4 md:mt-0 text-[#61A6AB] hover:text-white transition font-semibold">
              View All →
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {boxes.length > 0 ? boxes.map((box) => (
              <div key={box._id} className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl overflow-hidden hover:bg-opacity-10 transition-all duration-300 group">
                <div className="h-48 bg-[#F7B9A1] bg-opacity-20 flex items-center justify-center overflow-hidden">
                  {box.image ? (
                    <img src={box.image} alt={box.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <span className="text-6xl">📦</span>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[#291B25] text-lg">{box.name}</h3>
                    <span className="text-[#ED5B2D] font-bold text-xl">${box.price}</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-5 line-clamp-2">{box.description}</p>
                  <Link to={`/boxes/${box._id}`} className="block w-full text-center bg-[#ED5B2D] text-white py-2.5 rounded-xl font-semibold hover:bg-[#d94d22] transition">
                    View Details
                  </Link>
                </div>
              </div>
            )) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="bg-white bg-opacity-5 rounded-2xl overflow-hidden animate-pulse">
                  <div className="h-48 bg-white bg-opacity-10" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-white bg-opacity-10 rounded w-2/3" />
                    <div className="h-4 bg-white bg-opacity-10 rounded w-full" />
                    <div className="h-4 bg-white bg-opacity-10 rounded w-3/4" />
                    <div className="h-10 bg-white bg-opacity-10 rounded-xl mt-4" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#291B25] mb-3">How It Works</h2>
          <p className="text-gray-500">Three simple steps to your first Tunisian box.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-1/3 right-1/3 h-0.5 bg-gray-200" />
          {[
            { step: '01', title: 'Choose a Box', desc: 'Pick the box that matches your taste — from discovery to premium.' },
            { step: '02', title: 'Subscribe', desc: 'Subscribe monthly. Cancel or pause anytime from your dashboard.' },
            { step: '03', title: 'Track & Enjoy', desc: 'Follow your delivery in real time and enjoy authentic Tunisian products.' },
          ].map((s) => (
            <div key={s.step} className="text-center relative">
              <div className="w-16 h-16 rounded-full bg-[#291B25] text-white flex items-center justify-center text-xl font-bold mx-auto mb-5 relative z-10">
                {s.step}
              </div>
              <h3 className="text-xl font-bold text-[#291B25] mb-2">{s.title}</h3>
              <p className="text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto bg-[#ED5B2D] rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Taste Tunisia?</h2>
          <p className="text-white text-opacity-80 mb-8 text-lg">Join hundreds of food lovers discovering authentic Tunisian flavors every month.</p>
          <Link to="/register" className="inline-block bg-white text-[#ED5B2D] px-10 py-4 rounded-full text-lg font-bold hover:bg-[#F7B9A1] hover:text-[#291B25] transition">
            Start Your Subscription
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;