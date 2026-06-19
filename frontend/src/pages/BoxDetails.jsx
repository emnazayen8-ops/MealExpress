import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../config/api.js';

const BoxDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [box, setBox] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [stripeError, setStripeError] = useState(false);
  const toast = useToast();

  const user = JSON.parse(localStorage.getItem('user'));
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    if (isAdmin) { navigate('/admin'); return; }
    const fetchData = async () => {
      try {
        const [boxRes, productsRes] = await Promise.all([
          axios.get(`${API_URL}/api/boxes/${id}`),
          axios.get(`${API_URL}/api/products/box/${id}`)
        ]);
        setBox(boxRes.data);
        setProducts(productsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubscribe = async () => {
    if (!user) { navigate('/login'); return; }
    setSubscribing(true);
    setStripeError(false);
    try {
      const { data } = await axios.post(
        `${API_URL}/api/subscriptions/create-checkout-session`,
        { boxId: id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      window.location.href = data.url;
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (msg.includes('not configured')) {
        setStripeError(true);
      } else {
        toast.error(msg);
      }
      setSubscribing(false);
    }
  };

  const handleSimulate = async () => {
    if (!user) { navigate('/login'); return; }
    setSubscribing(true);
    try {
      await axios.post(
        `${API_URL}/api/subscriptions/simulate`,
        { boxId: id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      navigate('/dashboard?success=true');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (msg.includes('already have an active subscription')) {
        toast.warning('You already have an active subscription for this box.');
        navigate('/dashboard');
      } else {
        toast.error(msg);
      }
      setSubscribing(false);
    }
  };

  if (loading) return <Loading />;
  if (!box) return (
    <div className="text-center py-24">
      <p className="text-xl text-gray-500">Box not found.</p>
      <Link to="/boxes" className="text-[#61A6AB] mt-4 inline-block hover:underline">← Back to Boxes</Link>
    </div>
  );

  return (
    <div>
      <div className="bg-white border-b px-6 py-3">
        <div className="max-w-7xl mx-auto text-sm text-gray-500">
          <Link to="/" className="hover:text-[#291B25]">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/boxes" className="hover:text-[#291B25]">Boxes</Link>
          <span className="mx-2">/</span>
          <span className="text-[#291B25] font-semibold">{box.name}</span>
        </div>
      </div>

      <div className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="sticky top-24">
            <div className="h-96 bg-[#F7B9A1] rounded-3xl overflow-hidden shadow-xl">
              {box.image ? (
                <img src={box.image} alt={box.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center"><span className="text-9xl">📦</span></div>
              )}
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[{ icon: '✓', text: 'Cancel anytime' }, { icon: '🚚', text: 'Free delivery' }, { icon: '✓', text: '100% authentic' }].map((b) => (
                <div key={b.text} className="bg-white rounded-xl p-3 text-center shadow-sm">
                  <p className="text-lg">{b.icon}</p>
                  <p className="text-xs text-gray-500 mt-1">{b.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="inline-block bg-[#F7B9A1] text-[#291B25] text-xs font-semibold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
              {box.interval} subscription
            </span>
            <h1 className="text-4xl font-bold text-[#291B25] mb-4">{box.name}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">{box.description}</p>
            <div className="bg-[#F6F6E9] rounded-2xl p-6 mb-8">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-4xl font-bold text-[#ED5B2D]">${box.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-sm text-gray-400">Billed monthly · Cancel anytime</p>
            </div>

            {!isAdmin && (
              <div className="space-y-3">
                {stripeError && (
                  <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
                    <span className="text-orange-500 text-lg mt-0.5">⚠️</span>
                    <p className="text-sm text-orange-800 leading-relaxed">
                      Stripe is not configured in this environment.{' '}
                      Use <span className="font-semibold">Demo Mode</span> below to test the full subscription flow.
                    </p>
                  </div>
                )}
                <button onClick={handleSubscribe} disabled={subscribing}
                  className="w-full bg-[#ED5B2D] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#d94d22] transition transform hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2">
                  {subscribing ? <span className="animate-spin">⟳</span> : <>💳 Subscribe with Stripe</>}
                </button>
                <button onClick={handleSimulate} disabled={subscribing}
                  className="w-full bg-[#61A6AB] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:bg-[#4a8a8f] transition transform hover:scale-[1.02] disabled:opacity-50">
                  🧪 Subscribe (Demo Mode)
                </button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  Demo mode creates a subscription without real payment — for testing only.
                </p>
              </div>
            )}
          </div>
        </div>

        {products.length > 0 && (
          <div className="mt-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[#291B25] mb-2">What's Inside</h2>
              <p className="text-gray-500">Every box includes {products.length} handpicked products</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="h-32 bg-gradient-to-br from-[#61A6AB] to-[#4a8a8f] rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                      <img src={`${API_URL}${product.image}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : <span className="text-4xl">🍽️</span>}
                  </div>
                  <h3 className="font-bold text-[#291B25] mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{product.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BoxDetails;