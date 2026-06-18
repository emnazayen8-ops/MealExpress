import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import { API_URL } from '../config/api.js';

const Boxes = () => {
  const [boxes, setBoxes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Redirect admin to admin dashboard
    if (user?.role === 'admin') {
      navigate('/admin');
      return;
    }

    const fetchBoxes = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/boxes`);
        setBoxes(data);
      } catch (err) {
        console.error('Error fetching boxes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoxes();
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      {/* Header */}
      <div className="bg-[#291B25] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Our Boxes</h1>
          <p className="text-gray-300 max-w-xl mx-auto text-lg">
            Handpicked Tunisian products, delivered monthly. Choose the box that fits your taste.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="py-16 px-6 max-w-7xl mx-auto">
        {boxes.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl">No boxes available yet.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {boxes.map((box) => (
              <div
                key={box._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div className="h-56 bg-[#F7B9A1] relative overflow-hidden">
                  {box.image ? (
                    <img
                      src={`${API_URL}${box.image}`}
                      alt={box.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-7xl">📦</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-[#291B25] text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    {box.interval}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-[#291B25] mb-2">{box.name}</h3>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed flex-1">{box.description}</p>

                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <span className="text-3xl font-bold text-[#ED5B2D]">${box.price}</span>
                      <span className="text-gray-400 text-sm ml-1">/month</span>
                    </div>
                    <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-3 py-1 rounded-full font-semibold">
                      Cancel anytime
                    </span>
                  </div>

                  <Link
                    to={`/boxes/${box._id}`}
                    className="block w-full text-center bg-[#291B25] text-white py-3 rounded-xl font-semibold hover:bg-[#ED5B2D] transition-colors duration-300"
                  >
                    View Details & Subscribe
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Boxes;