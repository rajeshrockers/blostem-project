import { useEffect, useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useFavorites } from '../../hooks/useFavorites';
import SkeletonCard from '../../components/Loader/SkeletonCard';
import { PageContainer } from '../../components/common/PageContainer';
import { PageHeading } from '../../components/common/PageHeading';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Card } from '../../components/common/Card';
import { ProductService } from '../../api/services/productService';
import { MAGIC_NUMBER } from '../../constants/constants';
import type { Product } from '../../types';

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
        const products = await ProductService.fetchAllProducts();
        setProducts(products);
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
      <PageContainer>
        <PageHeading className="mb-8">Your Favorites</PageHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: MAGIC_NUMBER.EIGHT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <PageContainer>
      <PageHeading className="mb-8">Your Favorites</PageHeading>

      {favoriteProducts.length === 0 ? (
        <EmptyState
          message="No favorites yet."
          action={{ label: 'Browse products', to: '/' }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
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
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
