import { useState } from 'react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import { API_URL } from '../config/api.js';

const ProductForm = ({ onClose, onSuccess, editProduct, boxId }) => {
  const [name, setName] = useState(editProduct?.name || '');
  const [description, setDescription] = useState(editProduct?.description || '');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('box', boxId);
      if (image) formData.append('image', image);

      const url = editBox
         ? `${API_URL}/api/products/${editBox._id}`
         : `${API_URL}/api/products`;
      const method = editProduct ? 'put' : 'post';

      await axios({ method, url, data: formData, headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'multipart/form-data' } });

      toast.success(editProduct ? 'Product updated successfully!' : 'Product created successfully!');
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#61A6AB]" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#61A6AB]" rows="3" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full" />
          </div>
          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-[#ED5B2D] text-white px-4 py-2 rounded-lg hover:bg-[#d94d22] disabled:opacity-50">
              {loading ? 'Saving...' : (editProduct ? 'Update' : 'Create')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;