import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import DeliveryTimeline from '../components/DeliveryTimeline';
import Loading from '../components/Loading';
import { API_URL } from '../config/api.js';

const statusLabels = {
  confirmed:  'Confirmed',
  preparing:  'Preparing',
  shipped:    'Shipped',
  in_transit: 'In Transit',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
};

const statusColors = {
  confirmed:  'bg-blue-100 text-blue-700',
  preparing:  'bg-yellow-100 text-yellow-700',
  shipped:    'bg-orange-100 text-orange-700',
  in_transit: 'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [simulating, setSimulating] = useState(false);

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/orders/${id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const simulateProgress = async () => {
    const steps = ['confirmed', 'preparing', 'shipped', 'in_transit', 'delivered'];
    const nextStatus = steps[steps.indexOf(order.status) + 1];
    if (!nextStatus) return;
    setSimulating(true);
    try {
      await axios.put(
        `${API_URL}/api/orders/${id}/status`,
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      await fetchOrder();
    } catch (err) {
      alert('Error: ' + err.response?.data?.message);
    } finally {
      setSimulating(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return (
    <div className="text-center py-24">
      <p className="text-red-500 text-lg mb-4">{error}</p>
      <Link to="/dashboard" className="text-[#61A6AB] hover:underline">← Back to My Account</Link>
    </div>
  );
  if (!order) return (
    <div className="text-center py-24">
      <p className="text-gray-500">Order not found.</p>
      <Link to="/dashboard" className="text-[#61A6AB] hover:underline mt-4 block">← Back to My Account</Link>
    </div>
  );

  const statusBadge = statusColors[order.status] || statusColors.confirmed;

  return (
    <div className="bg-[#F6F6E9] min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-[#61A6AB] hover:text-[#291B25] transition font-semibold mb-6">
            ← Back to My Account
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[#291B25]">Order Tracking</h1>
              <p className="text-gray-500 mt-1">
                Order <span className="font-mono font-semibold">#{order._id.slice(-8).toUpperCase()}</span>
              </p>
            </div>
            <span className={`self-start sm:self-auto px-4 py-2 rounded-full text-sm font-semibold ${statusBadge}`}>
              {statusLabels[order.status]}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {/* Timeline — takes 2 cols */}
          <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-bold text-[#291B25] mb-8">Delivery Status</h2>
            <DeliveryTimeline
              timeline={order.timeline}
              currentStatus={order.status}
            />

            {/* Demo advance button */}
            {order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-3">Demo mode — advance delivery status:</p>
                <button
                  onClick={simulateProgress}
                  disabled={simulating}
                  className="w-full bg-[#61A6AB] text-white py-3 rounded-xl font-semibold hover:bg-[#4a8a8f] transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {simulating ? <span className="animate-spin">⟳</span> : '⚡'}
                  {simulating ? 'Updating...' : 'Simulate Next Step'}
                </button>
              </div>
            )}

            {order.status === 'delivered' && (
              <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <p className="text-4xl mb-2">🎉</p>
                <h3 className="font-bold text-green-700 text-lg">Your order has been delivered!</h3>
                <p className="text-green-600 text-sm mt-1">We hope you enjoy your Tunisian products.</p>
                <Link
                  to="/boxes"
                  className="inline-block mt-4 bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
                >
                  Order Again
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Box summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-[#291B25] mb-4">Your Box</h3>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#F6F6E9] rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  {order.box?.image ? (
                    <img
                      src={box.image}
                      alt={order.box.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">📦</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-[#291B25]">{order.box?.name}</p>
                  <p className="text-sm text-gray-500">${order.box?.price}/month</p>
                </div>
              </div>
            </div>

            {/* Delivery info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-[#291B25] mb-4">Delivery Details</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Carrier</p>
                  <p className="font-semibold text-[#291B25]">{order.carrier || 'MealExpress Delivery'}</p>
                </div>

                {order.trackingNumber && (
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Tracking Number</p>
                    <p className="font-mono text-[#61A6AB] font-semibold">{order.trackingNumber}</p>
                  </div>
                )}

                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Estimated Delivery</p>
                  <p className="font-semibold text-[#ED5B2D]">
                    {order.estimatedDelivery
                      ? new Date(order.estimatedDelivery).toLocaleDateString('en-GB', {
                          weekday: 'long', day: 'numeric', month: 'long'
                        })
                      : 'TBD'
                    }
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Delivery Address</p>
                  <p className="font-semibold text-[#291B25]">
                    {order.deliveryAddress?.street || 'Not specified'}
                    {order.deliveryAddress?.city && (
                      <><br />{order.deliveryAddress.city} {order.deliveryAddress.postalCode}</>
                    )}
                    {order.deliveryAddress?.country && (
                      <><br />{order.deliveryAddress.country}</>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Order dates */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-[#291B25] mb-4">Order Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Placed on</span>
                  <span className="font-semibold">{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Order ID</span>
                  <span className="font-mono text-xs">{order._id.slice(-8).toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;