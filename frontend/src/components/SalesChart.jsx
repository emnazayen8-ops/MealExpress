import { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = {
  primary: '#ED5B2D',
  secondary: '#61A6AB',
  dark: '#291B25',
  highlight: '#F7B9A1',
};

const BAR_COLORS = ['#ED5B2D', '#61A6AB', '#F7B9A1', '#291B25', '#22c55e', '#a855f7', '#f59e0b'];

const STATUS_COLORS = {
  confirmed: '#61A6AB',
  preparing: '#F7B9A1',
  shipped: '#ED5B2D',
  in_transit: '#291B25',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3">
        {label && <p className="text-xs text-gray-400 mb-1">{label}</p>}
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.name === 'Revenue' ? `$${Number(entry.value).toFixed(2)}` : entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const SalesChart = ({ orders, boxes }) => {

  // ── Revenue & Orders per month ──────────────────────────────────────────
  const monthlyData = useMemo(() => {
    const map = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!map[key]) map[key] = { month: key, orders: 0, revenue: 0 };
      map[key].orders += 1;
      map[key].revenue += order.box?.price || 0;
    });
    return Object.values(map).slice(-6);
  }, [orders]);

  // ── Orders by status ────────────────────────────────────────────────────
  const statusData = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const label = {
        confirmed: 'Confirmed', preparing: 'Preparing', shipped: 'Shipped',
        in_transit: 'In Transit', delivered: 'Delivered', cancelled: 'Cancelled',
      }[o.status] || o.status;
      if (!map[label]) map[label] = { name: label, value: 0, status: o.status };
      map[label].value += 1;
    });
    return Object.values(map);
  }, [orders]);

  const boxData = useMemo(() => {
  // Créer un Set des noms de boxes actives pour recherche rapide
  const activeBoxNames = new Set(boxes.map(box => box.name));
  
  // Start with all boxes (even those with 0 orders)
  const map = {};
  boxes.forEach((box) => {
    map[box.name] = { name: box.name, orders: 0, revenue: 0 };
  });
  
  // Fill in order data - only for active boxes
  orders.forEach((o) => {
    const name = o.box?.name;
    // Ignorer les orders sans box ou avec une box inactive
    if (!name || !activeBoxNames.has(name)) return;
    
    if (!map[name]) map[name] = { name, orders: 0, revenue: 0 };
    map[name].orders += 1;
    map[name].revenue += o.box?.price || 0;
  });
  
  return Object.values(map);
}, [orders, boxes]);

  // ── KPIs ────────────────────────────────────────────────────────────────
  const totalRevenue = orders.reduce((sum, o) => sum + (o.box?.price || 0), 0);
  const delivered = orders.filter(o => o.status === 'delivered').length;
  const cancelled = orders.filter(o => o.status === 'cancelled').length;
  const deliveryRate = orders.length > 0 ? ((delivered / orders.length) * 100).toFixed(0) : 0;

  const kpis = [
    { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: '💰', sub: `${orders.length} orders`, color: 'bg-[#ED5B2D] text-white' },
    { label: 'Delivered', value: delivered, icon: '✅', sub: `${deliveryRate}% delivery rate`, color: 'bg-white' },
    { label: 'Active Boxes', value: boxes.length, icon: '📦', sub: 'products available', color: 'bg-white' },
    { label: 'Cancelled', value: cancelled, icon: '❌', sub: `${orders.length > 0 ? ((cancelled / orders.length) * 100).toFixed(0) : 0}% cancellation rate`, color: 'bg-white' },
  ];

  if (orders.length === 0 && boxes.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <p className="text-5xl mb-4">📊</p>
        <h3 className="text-xl font-bold text-[#291B25] mb-2">No data yet</h3>
        <p className="text-gray-400">Statistics will appear once orders come in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className={`rounded-2xl shadow p-5 ${k.color}`}>
            <p className="text-2xl mb-1">{k.icon}</p>
            <p className="text-3xl font-bold">{k.value}</p>
            <p className={`text-xs mt-1 font-semibold ${k.color.includes('ED5B2D') ? 'text-orange-100' : 'text-gray-500'}`}>{k.label}</p>
            <p className={`text-xs mt-0.5 ${k.color.includes('ED5B2D') ? 'text-orange-200' : 'text-gray-400'}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Over Time */}
      {monthlyData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-[#291B25] mb-1">Revenue Over Time</h3>
          <p className="text-sm text-gray-400 mb-6">Monthly revenue and order volume</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={COLORS.primary} strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: COLORS.primary, r: 4 }} />
              <Area type="monotone" dataKey="orders" name="Orders" stroke={COLORS.secondary} strokeWidth={2.5} fill="url(#ordersGrad)" dot={{ fill: COLORS.secondary, r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Orders by Box + Status Pie */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Orders per Box — dynamic colors */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-[#291B25] mb-1">Orders by Box</h3>
          <p className="text-sm text-gray-400 mb-6">Which boxes are most popular</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={boxData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="orders" name="Orders" radius={[6, 6, 0, 0]}>
                {boxData.map((entry, index) => (
                  <Cell key={index} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-[#291B25] mb-1">Order Status</h3>
          <p className="text-sm text-gray-400 mb-4">Breakdown of current order states</p>
          {statusData.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">No orders yet</div>
          ) : (
            <div className="flex items-center gap-4">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {statusData.map((entry, index) => (
                      <Cell key={index} fill={STATUS_COLORS[entry.status] || COLORS.secondary} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {statusData.map((entry, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: STATUS_COLORS[entry.status] || COLORS.secondary }} />
                      <span className="text-xs text-gray-600">{entry.name}</span>
                    </div>
                    <span className="text-xs font-bold text-[#291B25]">{entry.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Revenue per Box — dynamic */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-[#291B25] mb-1">Revenue by Box</h3>
        <p className="text-sm text-gray-400 mb-6">Total revenue generated per product</p>
        <div className="space-y-4">
          {boxData
            .sort((a, b) => b.revenue - a.revenue)
            .map((box, i) => {
              const max = Math.max(...boxData.map(b => b.revenue), 1);
              const pct = (box.revenue / max) * 100;
              return (
                <div key={i}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-[#291B25]">{box.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-[#ED5B2D]">${box.revenue.toFixed(2)}</span>
                      <span className="text-xs text-gray-400 ml-2">{box.orders} orders</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, backgroundColor: BAR_COLORS[i % BAR_COLORS.length] }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default SalesChart;