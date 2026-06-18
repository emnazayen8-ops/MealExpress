import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">📦</div>
        <h1 className="text-8xl font-bold text-[#ED5B2D] mb-2">404</h1>
        <h2 className="text-2xl font-bold text-[#291B25] mb-4">Page not found</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Looks like this page got lost in transit. The box you are looking for does not exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Link
            to="/"
            className="bg-[#ED5B2D] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#d94d22] transition"
          >
            ← Back to Home
          </Link>
          <Link
            to="/boxes"
            className="bg-white border border-gray-200 text-[#291B25] px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Browse Boxes
          </Link>
          <Link
            to="/contact"
            className="bg-white border border-gray-200 text-[#291B25] px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
          >
            Contact Us
          </Link>
        </div>

        <p className="text-sm text-gray-400">
          Redirecting to home in <span className="font-semibold text-[#ED5B2D]">{countdown}</span> seconds...
        </p>
      </div>
    </div>
  );
};

export default NotFound;