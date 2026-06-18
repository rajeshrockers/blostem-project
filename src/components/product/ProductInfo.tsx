import { toast } from 'sonner';
import { useNavigate, useLocation } from 'react-router-dom';
import { HeartIcon } from '../icons/HeartIcon';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { MAGIC_NUMBER } from '../../constants/constants';
import type { ProductInfoProps } from '../../types'; 

export function ProductInfo({ product }: ProductInfoProps) {
  const { toggle, isFavorite } = useFavorites();
  const { add, remove, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const isFav = isFavorite(product.id);
  const inCart = isInCart(product.id);

  return (
    <div className="flex flex-col">
      <span className="text-sm text-blue-600 font-medium uppercase tracking-wide">
        {product.brand}
      </span>

      <div className="flex items-start justify-between gap-4 mt-2">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{product.title}</h1>
        <button
          onClick={() => {
            if (!isAuthenticated) {
              toast.error('Please log in first');
              setTimeout(() => navigate('/login', { state: { from: location } }), MAGIC_NUMBER.ONE_THOUSAND);
              return;
            }
            const added = toggle(product.id);
            toast.success(added ? 'Added to favorites' : 'Removed from favorites');
          }}
          className={`p-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
            isFav
              ? 'text-red-500 bg-red-50 dark:bg-gray-700 hover:bg-red-100'
              : 'text-gray-400 bg-gray-100 dark:bg-gray-700 hover:text-red-500 hover:bg-red-50'
          }`}
          aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <HeartIcon filled={isFav} className="w-6 h-6" />
        </button>
      </div>

      <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full mt-3 w-fit">
        {product.category}
      </span>

      <div className="flex items-baseline gap-3 mt-4">
        <span className="text-2xl font-bold text-blue-600">${discountedPrice.toFixed(2)}</span>
        {product.discountPercentage > 0 && (
          <>
            <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>
            <span className="text-sm text-green-600 font-medium">
              -{product.discountPercentage.toFixed(0)}%
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1 mt-2">
        <span className="text-yellow-500">&#9733;</span>
        <span className="text-sm text-gray-700 dark:text-gray-300">{product.rating} / 5</span>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mt-6 leading-relaxed">{product.description}</p>

      <div className="mt-6">
        <button
          onClick={() => {
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
          className={`px-6 py-3 rounded-md transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            inCart
              ? 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500'
              : 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500'
          }`}
        >
          {inCart ? 'Remove from Cart' : 'Add to Cart'}
        </button>
      </div>

      <div className="mt-auto pt-6">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          <span className="font-medium">Stock:</span>{' '}
          {product.stock > 0 ? (
            <span className="text-green-600">{product.stock} available</span>
          ) : (
            <span className="text-red-600">Out of stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
