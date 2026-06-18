import { memo } from 'react';
import { toast } from 'sonner';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HeartIcon } from '../icons/HeartIcon';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { MAGIC_NUMBER } from '../../constants/constants';
import type { Product } from '../../types';

// Product card rendered inside VirtuosoGrid — subscribes to stores directly
// so the parent doesn't re-render (and recreate itemContent) on store changes.
export const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const { toggle, isFavorite } = useFavorites();
  const { add, remove, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fav = isFavorite(product.id);
  const inCart = isInCart(product.id);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative h-full flex flex-col">
      <Link to={`/products/${product.id}`} className="block flex-1">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4 pb-14 flex flex-col">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-1">
            {product.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 flex-1">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-blue-600">${product.price}</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>
        </div>
      </Link>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isAuthenticated) {
            toast.error('Please log in first');
            setTimeout(() => navigate('/login', { state: { from: location } }), MAGIC_NUMBER.ONE_THOUSAND);
            return;
          }
          const added = toggle(product.id);
          toast.success(added ? 'Added to favorites' : 'Removed from favorites');
        }}
        className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
          fav
            ? 'text-red-500 bg-white dark:bg-gray-800 hover:bg-red-50'
            : 'text-gray-400 bg-white dark:bg-gray-800 hover:text-red-500 hover:bg-red-50'
        }`}
        aria-label={fav ? 'Remove from favorites' : 'Add to favorites'}
      >
        <HeartIcon filled={fav} />
      </button>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isAuthenticated) {
            toast.error('Please log in first');
            setTimeout(() => navigate('/login', { state: { from: location } }), MAGIC_NUMBER.ONE_THOUSAND);
            return;
          }
          if (inCart) {
            remove(product.id);
            toast.success('Removed from cart');
          } else {
            add(product.id);
            toast.success('Added to cart');
          }
        }}
        className={`absolute bottom-3 right-3 px-3 py-1.5 text-sm font-medium rounded-md transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
          inCart
            ? 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500'
            : 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500'
        }`}
      >
        {inCart ? 'Remove from Cart' : 'Add to Cart'}
      </button>
    </div>
  );
});
