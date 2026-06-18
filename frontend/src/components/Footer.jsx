import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#291B25] text-white py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-3">MealExpress</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Authentic Tunisian products, curated with love and delivered to your doorstep every month.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Navigation</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-sm text-gray-300 hover:text-[#F7B9A1] transition">Home</Link>
              <Link to="/boxes" className="block text-sm text-gray-300 hover:text-[#F7B9A1] transition">Our Boxes</Link>
              <Link to="/about" className="block text-sm text-gray-300 hover:text-[#F7B9A1] transition">About Us</Link>
              <Link to="/contact" className="block text-sm text-gray-300 hover:text-[#F7B9A1] transition">Contact</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">Contact</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-300">📧 hello@mealexpress.tn</p>
              <p className="text-sm text-gray-300">📱 +216 70 000 000</p>
              <p className="text-sm text-gray-300">📍 Tunis, Tunisia</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white border-opacity-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm font-light tracking-widest uppercase text-gray-400">
            From Our Oven to Your Door
          </p>
          <p className="text-sm text-[#F7B9A1]">
            © 2026 MealExpress. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;