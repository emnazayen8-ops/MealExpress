import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import BoxForm from '../components/BoxForm';
import BoxProducts from '../components/BoxProducts';
import SalesChart from '../components/SalesChart';
import { useToast } from '../context/ToastContext';

const STATUS_CONFIG = {
  confirmed:  { label: 'Confirmed',   color: 'bg-blue-100 text-blue-700' },
  preparing:  { label: 'Preparing',   color: 'bg-yellow-100 text-yellow-700' },
  shipped:    { label: 'Shipped',     color: 'bg-orange-100 text-orange-700' },
  in_transit: { label: 'In Transit',  color: 'bg-purple-100 text-purple-700' },
  delivered:  { label: 'Delivered',   color: 'bg-green-100 text-green-700' },
  cancelled:  { label: 'Cancelled',   color: 'bg-red-100 text-red-700' },
};

const SUBJECT_LABELS = {
  order: 'My Order',
  subscription: 'Subscription',
  product: 'Product Question',
  delivery: 'Delivery Issue',
  other: 'Other',
};

// ✅ Opens Gmail compose in a new tab
const openGmailReply = (email, subject) => {
  const gmailUrl = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}&su=${encodeURIComponent('Re: ' + subject)}`;
  window.open(gmailUrl, '_blank');
};

const AdminDashboard = () => {
  const [boxes, setBoxes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('statistics');
  const [showForm, setShowForm] = useState(false);
  const [editBox, setEditBox] = useState(null);
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [expandedMessage, setExpandedMessage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const user = JSON.parse(localStorage.getItem('user'));
  const toast = useToast();

  useEffect(() => {
    fetchBoxes();
    fetchOrders();
    fetchMessages();
  }, []);

  const fetchBoxes = async () => {
    const { data } = await axios.get('http://localhost:5000/api/boxes');
    setBoxes(data);
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrders(data);
    } catch (err) {
      toast.error('Error fetching orders');
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/contact', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages(data);
    } catch (err) {
      toast.error('Error fetching messages');
    }
  };

  const handleDeleteBox = async (id) => {
    if (!window.confirm('Delete this box and all its products?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/boxes/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Box deleted successfully!');
      fetchBoxes();
    } catch (err) {
      toast.error('Error deleting box');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    setUpdatingOrder(orderId);
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      toast.success(`Order updated to "${STATUS_CONFIG[status].label}"`);
      fetchOrders();
    } catch (err) {
      toast.error('Error updating order status');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/contact/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages((prev) => prev.map((m) => m._id === id ? { ...m, status: 'read' } : m));
    } catch (err) {
      toast.error('Error marking as read');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/contact/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Message deleted');
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (expandedMessage === id) setExpandedMessage(null);
    } catch (err) {
      toast.error('Error deleting message');
    }
  };

  const unreadCount = messages.filter((m) => m.status === 'unread').length;
  const statusSteps = ['confirmed', 'preparing', 'shipped', 'in_transit', 'delivered'];

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        order.user?.name?.toLowerCase().includes(q) ||
        order.user?.email?.toLowerCase().includes(q) ||
        order.box?.name?.toLowerCase().includes(q) ||
        order._id.slice(-8).toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [orders, searchQuery, statusFilter]);

  const tabs = [
    { id: 'statistics', label: '📊 Statistics' },
    { id: 'boxes',      label: `📦 Boxes (${boxes.length})` },
    { id: 'products',   label: '🍽️ Products' },
    { id: 'orders',     label: `🚚 Orders (${orders.length})` },
    { id: 'messages',   label: unreadCount > 0 ? `✉️ Messages (${unreadCount} new)` : `✉️ Messages (${messages.length})` },
  ];

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#291B25]">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage boxes, products, orders, and customer messages.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-gray-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold transition border-b-2 -mb-px whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-[#ED5B2D] text-[#ED5B2D]'
                : tab.id === 'messages' && unreadCount > 0
                ? 'border-transparent text-green-600 hover:text-[#291B25]'
                : 'border-transparent text-gray-500 hover:text-[#291B25]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Statistics */}
      {activeTab === 'statistics' && <SalesChart orders={orders} boxes={boxes} />}

      {/* Boxes */}
      {activeTab === 'boxes' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">All Boxes</h2>
            <button onClick={() => { setEditBox(null); setShowForm(true); }}
              className="bg-[#ED5B2D] text-white px-4 py-2 rounded-lg hover:bg-[#d94d22] font-semibold">
              + Add Box
            </button>
          </div>
          {boxes.length === 0 ? (
            <p className="text-gray-400 text-center py-10">No boxes yet.</p>
          ) : (
            <div className="space-y-3">
              {boxes.map((box) => (
                <div key={box._id} className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 hover:bg-gray-50 transition">
                  <div className="w-14 h-14 rounded-xl bg-[#F6F6E9] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {box.image ? <img src={`http://localhost:5000${box.image}`} alt={box.name} className="w-full h-full object-cover" /> : <span className="text-2xl">📦</span>}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#291B25]">{box.name}</h3>
                    <p className="text-sm text-gray-500">${box.price} / {box.interval}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditBox(box); setShowForm(true); }}
                      className="bg-[#61A6AB] text-white px-3 py-1.5 rounded-lg hover:bg-[#4a8a8f] text-sm font-semibold">Edit</button>
                    <button onClick={() => handleDeleteBox(box._id)}
                      className="bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 text-sm font-semibold">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Products */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold mb-6">Products by Box</h2>
          <div className="space-y-6">
            {boxes.map((box) => <BoxProducts key={box._id} box={box} user={user} />)}
          </div>
        </div>
      )}

      {/* Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold">All Customer Orders</h2>
            <span className="text-sm text-gray-400">
              Showing <span className="font-semibold text-[#291B25]">{filteredOrders.length}</span> of {orders.length} orders
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input type="text" placeholder="Search by customer, email, box or order ID..."
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#61A6AB]" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
              )}
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#61A6AB] bg-white">
              <option value="all">All statuses</option>
              {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">🔍</p>
              <p className="text-gray-500 font-semibold">No orders match your search</p>
              <button onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                className="mt-3 text-sm text-[#61A6AB] hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed;
                const currentStepIdx = statusSteps.indexOf(order.status);
                return (
                  <div key={order._id} className="border border-gray-100 rounded-2xl p-5 hover:border-gray-200 transition">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-mono text-xs text-gray-400">#{order._id.slice(-8).toUpperCase()}</p>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${status.color}`}>{status.label}</span>
                        </div>
                        <p className="font-bold text-[#291B25]">{order.box?.name || 'Box'}</p>
                        <p className="text-sm text-gray-500">
                          Customer: <span className="font-semibold">{order.user?.name}</span> · <span>{order.user?.email}</span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Placed {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      {order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Update to:</span>
                          <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#61A6AB]"
                            defaultValue=""
                            onChange={(e) => { if (e.target.value) handleUpdateOrderStatus(order._id, e.target.value); }}
                            disabled={updatingOrder === order._id}>
                            <option value="" disabled>Select status</option>
                            {statusSteps.slice(currentStepIdx + 1).map((s) => (
                              <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
                            ))}
                          </select>
                          {updatingOrder === order._id && <span className="animate-spin text-[#ED5B2D]">⟳</span>}
                        </div>
                      )}
                    </div>
                    {order.status !== 'cancelled' && (
                      <div className="mt-4">
                        <div className="flex gap-1">
                          {statusSteps.map((s, i) => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full ${i <= currentStepIdx ? 'bg-[#ED5B2D]' : 'bg-gray-200'}`} />
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          {statusSteps.map((s) => <span key={s}>{STATUS_CONFIG[s].label}</span>)}
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

      {/* Messages */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Customer Messages</h2>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">{unreadCount} unread</span>
              )}
              <span className="text-sm text-gray-400">{messages.length} total</span>
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">✉️</p>
              <p className="text-gray-500 font-semibold">No messages yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg._id} className={`border rounded-2xl overflow-hidden transition ${msg.status === 'unread' ? 'border-[#61A6AB] bg-blue-50' : 'border-gray-100'}`}>
                  <div
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition"
                    onClick={() => {
                      setExpandedMessage(expandedMessage === msg._id ? null : msg._id);
                      if (msg.status === 'unread') handleMarkAsRead(msg._id);
                    }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#291B25] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {msg.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#291B25] text-sm">{msg.name}</p>
                        {msg.status === 'unread' && <span className="w-2 h-2 rounded-full bg-[#61A6AB] flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-400">{msg.email}</p>
                    </div>
                    <span className="text-xs bg-[#F6F6E9] text-[#291B25] px-2 py-1 rounded-full font-medium flex-shrink-0">
                      {SUBJECT_LABELS[msg.subject] || msg.subject}
                    </span>
                    <p className="text-xs text-gray-400 flex-shrink-0 hidden sm:block">
                      {new Date(msg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <span className="text-gray-400 text-sm flex-shrink-0">{expandedMessage === msg._id ? '▲' : '▼'}</span>
                  </div>

                  {expandedMessage === msg._id && (
                    <div className="px-4 pb-4 border-t border-gray-100">
                      <div className="bg-white rounded-xl p-4 mt-3">
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        {/* ✅ Opens Gmail compose directly */}
                        <button
                          onClick={() => openGmailReply(msg.email, SUBJECT_LABELS[msg.subject] || msg.subject)}
                          className="bg-[#61A6AB] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#4a8a8f] transition"
                        >
                          ↩ Reply via Gmail
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showForm && (
        <BoxForm onClose={() => setShowForm(false)} onSuccess={fetchBoxes} editBox={editBox} />
      )}
    </div>
  );
};

export default AdminDashboard;