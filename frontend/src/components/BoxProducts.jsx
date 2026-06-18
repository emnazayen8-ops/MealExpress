import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from './ProductForm';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../config/api.js';

const BoxProducts = ({ box, user }) => {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data } = await axios.get(`${API_URL}/api/products/box/${box._id}`);
    setProducts(data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await axios.delete(`${API_URL}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      toast.error('Error deleting product');
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">{box.name}</h3>
        <button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="bg-[#ED5B2D] text-white px-3 py-1 rounded text-sm hover:bg-[#d94d22]"
        >
          + Add Product
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product._id} className="bg-[#F6F6E9] rounded-lg p-4">
            <div className="h-24 bg-[#61A6AB] rounded-lg mb-2 flex items-center justify-center text-2xl">
              {product.image ? (
                <img src={`${API_URL}${product.image}`} alt={product.name} className="h-full w-full object-cover rounded-lg" />
              ) : '🍽️'}
            </div>
            <h4 className="font-bold text-sm mb-1">{product.name}</h4>
            <p className="text-xs text-gray-600 mb-2 line-clamp-2">{product.description}</p>
            <div className="flex gap-1">
              <button
                onClick={() => { setEditProduct(product); setShowForm(true); }}
                className="flex-1 bg-[#61A6AB] text-white px-2 py-1 rounded text-xs hover:bg-[#4a8a8f]"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="flex-1 bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ProductForm
          onClose={() => setShowForm(false)}
          onSuccess={fetchProducts}
          editProduct={editProduct}
          boxId={box._id}
        />
      )}
    </div>
  );
};

export default BoxProducts;