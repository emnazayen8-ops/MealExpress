import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config/api.js';

const UserDashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Check for success param after Stripe redirect
     if (searchParams.get('success') === 'true') {
         setShowSuccess(true);
         // Remove the param from URL without reload
         setSearchParams({});
        // Auto-hide after 6 seconds
        setTimeout(() => setShowSuccess(false), 6000);
      }
  }, [searchParams, setSearchParams]);

  // Recharger les données quand un paiement Stripe réussit
  useEffect(() => {
    if (showSuccess) {
      const reloadData = async () => {
        setLoadingSubs(true);
        setLoadingOrders(true);
        try {
          const [subsRes, ordersRes] = await Promise.all([
            axios.get(`${API_URL}/api/subscriptions/my-subscriptions`, {
              headers: { Authorization: `Bearer ${user.token}` }
            }),
            axios.get(`${API_URL}/api/orders/my-orders`, {
              headers: { Authorization: `Bearer ${user.token}` }
            })
          ]);
          setSubscriptions(subsRes.data);
          setOrders(ordersRes.data);
        } catch (err) {
          console.error('Error reloading data:', err);
        } finally {
          setLoadingSubs(false);
          setLoadingOrders(false);
        }
      };
      
      // Attendre 2 secondes pour laisser le webhook Stripe traiter
      const timer = setTimeout(reloadData, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, user.token]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/subscriptions/my-subscriptions`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setSubscriptions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSubs(false);
      }
    };

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/orders/my-orders`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchSubscriptions();
    fetchOrders();
  }, []);

  const handleCancel = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to cancel this subscription?')) return;
    try {
      await axios.post(
        `${API_URL}/api/subscriptions/cancel`,
        { subscriptionId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Subscription cancelled successfully');
      window.location.reload();
    } catch (err) {
      alert('Error cancelling subscription');
    }
  };

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');

  const statusConfig = {
    confirmed:  { label: 'Confirmed',    color: 'bg-blue-100 text-blue-700' },
    preparing:  { label: 'Preparing',    color: 'bg-yellow-100 text-yellow-700' },
    shipped:    { label: 'Shipped',      color: 'bg-orange-100 text-orange-700' },
    in_transit: { label: 'In Transit',   color: 'bg-purple-100 text-purple-700' },
    delivered:  { label: 'Delivered',    color: 'bg-green-100 text-green-700' },
    cancelled:  { label: 'Cancelled',    color: 'bg-red-100 text-red-700' },
  };

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto">

      {/* ── Success Banner ─────────────────────────────────────────────── */}
      {showSuccess && (
        <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl p-6">
          {/* Background decoration */}
          <div className="absolute -right-8 -top-8 w-40 h-40 bg-white bg-opacity-10 rounded-full" />
          <div className="absolute -right-4 -bottom-10 w-28 h-28 bg-white bg-opacity-10 rounded-full" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                🎉
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">
                  Subscription confirmed!
                </h3>
                <p className="text-green-100 text-sm leading-relaxed">
                  Welcome aboard, <span className="font-semibold text-white">{user.name}</span>! Your first box is being prepared and will be shipped within 3 business days. Track your delivery below.
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-xs text-green-100">
                    <span>✓</span>
                    <span>Payment received</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-green-100">
                    <span>✓</span>
                    <span>Order created</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-green-100">
                    <span>⏳</span>
                    <span>Preparing your box</span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="text-white text-opacity-70 hover:text-opacity-100 text-xl flex-shrink-0 transition"
            >
              ✕
            </button>
          </div>

          {/* Progress bar auto-dismiss */}
          <div className="mt-4 h-1 bg-white bg-opacity-20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white bg-opacity-60 rounded-full"
              style={{ animation: 'shrink 6s linear forwards' }}
            />
          </div>

          <style>{`
            @keyframes shrink {
              from { width: 100%; }
              to { width: 0%; }
            }
          `}</style>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-[#291B25]">My Account</h1>
          <p className="text-gray-500 mt-1">Welcome back, <span className="font-semibold text-[#ED5B2D]">{user.name}</span></p>
        </div>
        <div className="hidden sm:flex items-center gap-3 bg-white rounded-xl shadow px-5 py-3">
          <div className="w-10 h-10 rounded-full bg-[#291B25] flex items-center justify-center text-white font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-[#291B25] text-sm">{user.name}</p>
            <p className="text-gray-400 text-xs">{user.email}</p>
          </div>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Active Subscriptions', value: activeSubscriptions.length, icon: '📦', color: 'bg-[#291B25] text-white' },
          { label: 'Total Orders', value: orders.length, icon: '🚚', color: 'bg-white text-[#291B25]' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, icon: '✅', color: 'bg-white text-[#291B25]' },
          { label: 'In Transit', value: orders.filter(o => ['shipped', 'in_transit'].includes(o.status)).length, icon: '🛣️', color: 'bg-white text-[#291B25]' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-2xl shadow p-5 ${stat.color}`}>
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className={`text-xs mt-1 ${stat.color.includes('291B25') && stat.color.includes('text-white') ? 'text-gray-300' : 'text-gray-500'}`}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <div className="flex gap-2 mb-8 border-b border-gray-200">
        {['orders', 'subscriptions'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold capitalize transition border-b-2 -mb-px ${
              activeTab === tab
                ? 'border-[#ED5B2D] text-[#ED5B2D]'
                : 'border-transparent text-gray-500 hover:text-[#291B25]'
            }`}
          >
            {tab === 'orders' ? `My Orders (${orders.length})` : `Subscriptions (${subscriptions.length})`}
          </button>
        ))}
      </div>

      {/* ── Orders Tab ─────────────────────────────────────────────────── */}
      {activeTab === 'orders' && (
        <div>
          {loadingOrders ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ED5B2D]" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-16 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-[#291B25] mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Subscribe to a box to get your first order.</p>
              <Link
                to="/boxes"
                className="inline-block bg-[#ED5B2D] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d94d22] transition"
              >
                Discover Our Boxes
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = statusConfig[order.status] || statusConfig.confirmed;
                return (
                  <div key={order._id} className="bg-white rounded-2xl shadow hover:shadow-lg transition-all duration-300 overflow-hidden">
                    <div className="flex items-center gap-6 p-6">
                      <div className="w-20 h-20 flex-shrink-0 bg-[#F6F6E9] rounded-xl flex items-center justify-center overflow-hidden">
                        {order.box?.image ? (
                          <img
                            src={`${API_URL}${order.box.image}`}
                            alt={order.box.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl">📦</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-xs text-gray-400 font-mono mb-1">
                              ORDER #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <h3 className="font-bold text-[#291B25] text-lg">{order.box?.name || 'Box'}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                          <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
                            {status.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-6 mt-3 text-sm text-gray-500">
                          <span>
                            Est. delivery:{' '}
                            <span className="font-semibold text-[#291B25]">
                              {order.estimatedDelivery
                                ? new Date(order.estimatedDelivery).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })
                                : 'TBD'}
                            </span>
                          </span>
                          {order.trackingNumber && (
                            <span>
                              Tracking: <span className="font-mono text-[#61A6AB]">{order.trackingNumber}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <Link
                        to={`/orders/${order._id}`}
                        className="flex-shrink-0 bg-[#291B25] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#3d2a38] transition text-sm whitespace-nowrap"
                      >
                        Track Order →
                      </Link>
                    </div>

                    {order.status !== 'cancelled' && (
                      <div className="px-6 pb-4">
                        <div className="flex gap-1">
                          {['confirmed', 'preparing', 'shipped', 'in_transit', 'delivered'].map((s) => {
                            const steps = ['confirmed', 'preparing', 'shipped', 'in_transit', 'delivered'];
                            const currentIdx = steps.indexOf(order.status);
                            const stepIdx = steps.indexOf(s);
                            return (
                              <div
                                key={s}
                                className={`h-1.5 flex-1 rounded-full transition-all ${
                                  stepIdx <= currentIdx ? 'bg-[#ED5B2D]' : 'bg-gray-200'
                                }`}
                              />
                            );
                          })}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Confirmed</span>
                          <span>Preparing</span>
                          <span>Shipped</span>
                          <span>In Transit</span>
                          <span>Delivered</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Subscriptions Tab ──────────────────────────────────────────── */}
      {activeTab === 'subscriptions' && (
        <div>
          {loadingSubs ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ED5B2D]" />
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-16 text-center">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-bold text-[#291B25] mb-2">No subscriptions yet</h3>
              <p className="text-gray-500 mb-6">Choose a box and get authentic Tunisian products delivered monthly.</p>
              <Link
                to="/boxes"
                className="inline-block bg-[#ED5B2D] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#d94d22] transition"
              >
                Browse Boxes
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {subscriptions.map((sub) => (
                <div key={sub._id} className="bg-white rounded-2xl shadow p-6 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-[#F6F6E9] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {sub.box?.image
                        ? <img src={`${API_URL}${sub.box.image}`} alt={sub.box.name} className="w-full h-full object-cover" />
                        : <span className="text-3xl">📦</span>
                      }
                    </div>
                    <div>
                      <h3 className="font-bold text-[#291B25] text-lg">{sub.box?.name || 'Unknown Box'}</h3>
                      <p className="text-sm text-gray-500">
                        ${sub.box?.price}/month · Since {new Date(sub.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <span className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-semibold ${
                        sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {sub.status === 'active' ? 'Active' : sub.status === 'canceled' ? 'Cancelled' : sub.status}
                      </span>
                    </div>
                  </div>
                  {sub.status === 'active' && (
                    <button
                      onClick={() => handleCancel(sub._id)}
                      className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-100 transition font-semibold text-sm"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;