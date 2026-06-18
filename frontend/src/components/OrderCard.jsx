import { Link } from 'react-router-dom';

const statusLabels = {
  confirmed: { text: 'Confirmée', color: 'bg-blue-100 text-blue-700' },
  preparing: { text: 'En préparation', color: 'bg-yellow-100 text-yellow-700' },
  shipped: { text: 'Expédiée', color: 'bg-orange-100 text-orange-700' },
  in_transit: { text: 'En route', color: 'bg-[#F7B9A1] text-[#291B25]' },
  delivered: { text: 'Livrée', color: 'bg-green-100 text-green-700' },
  cancelled: { text: 'Annulée', color: 'bg-red-100 text-red-700' }
};

const OrderCard = ({ order }) => {
  const status = statusLabels[order.status] || statusLabels.confirmed;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Commande #{order._id.slice(-8).toUpperCase()}</p>
          <h3 className="font-bold text-lg text-[#291B25]">{order.box?.name || 'Box'}</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
          {status.text}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-[#F6F6E9] rounded-lg flex items-center justify-center">
          {order.box?.image ? (
            <img 
              src={`http://localhost:5000${order.box.image}`} 
              alt={order.box.name}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-2xl">📦</span>
          )}
        </div>
        <div>
          <p className="text-sm text-gray-600">
            Livraison estimée : <span className="font-semibold">
              {order.estimatedDelivery 
                ? new Date(order.estimatedDelivery).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long'
                  })
                : 'Non définie'
              }
            </span>
          </p>
          {order.trackingNumber && (
            <p className="text-sm text-gray-600">
              Suivi : <span className="font-mono text-[#61A6AB]">{order.trackingNumber}</span>
            </p>
          )}
        </div>
      </div>

      <Link
        to={`/orders/${order._id}`}
        className="block w-full text-center bg-[#291B25] text-white py-3 rounded-xl font-semibold hover:bg-[#3d2a38] transition transform hover:scale-105"
      >
        Suivre ma livraison
      </Link>
    </div>
  );
};

export default OrderCard;