import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { axiosInstance } from '../../api/axiosInstance';
import { ENDPOINTS } from '../../constants/endponint';
import { useFavorites } from '../../hooks/useFavorites';
import SkeletonCard from '../../components/ui/SkeletonCard';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
}

// Displays products the user has favorited (stored in localStorage, scoped by user).
export default function FavoritesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { favorites, remove } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load all products so we can match them to saved IDs.
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await axiosInstance.get<{ products: Product[] }>(`${ENDPOINTS.PRODUCTS.LIST}?limit=0`);
        setProducts(data.products);
      } catch {
        setError('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const favoriteProducts = useMemo(
    () => products.filter((p) => favorites.includes(p.id)),
    [products, favorites]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Your Favorites</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Your Favorites</h1>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">No favorites yet.</p>
          <Link to="/" className="text-blue-600 hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">{product.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-blue-600">${product.price}</span>
                  <button
                    onClick={() => {
                      remove(product.id);
                      toast.success('Removed from favorites');
                    }}
                    className="text-sm text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
