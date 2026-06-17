import { useEffect, useState, memo } from 'react';
import { toast } from 'sonner';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../api/axiosInstance';
import { ENDPOINTS } from '../../constants/endponint';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

const HeartIcon = memo(function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      className="w-6 h-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
});

// Displays full info for a single product.
export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState('');
  const { toggle, isFavorite } = useFavorites();
  const { add, remove, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchProduct = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axiosInstance.get<Product>(ENDPOINTS.PRODUCTS.DETAIL(id ?? ''));
      setProduct(data);
      setActiveImage(data.thumbnail);
    } catch {
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-5xl mx-auto animate-pulse">
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-6" />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              <div className="space-y-4">
                <div className="w-full h-80 bg-gray-300 dark:bg-gray-600 rounded-lg" />
                <div className="flex gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-md" />
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20" />
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24" />
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-32" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error || 'Product not found'}</div>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);
  const allImages = [product.thumbnail, ...product.images];
  const isFav = isFavorite(product.id);
  const inCart = isInCart(product.id);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-6 text-sm text-blue-600 hover:text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
        >
          &larr; Back to products
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {/* Image gallery */}
            <div>
              <img
                src={activeImage}
                alt={product.title}
                className="w-full h-80 object-cover rounded-lg"
              />
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0 ${
                      activeImage === img ? 'border-blue-500' : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              <span className="text-sm text-blue-600 font-medium uppercase tracking-wide">
                {product.brand}
              </span>
              <div className="flex items-start justify-between gap-4 mt-2">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{product.title}</h1>
                <button
                  onClick={() => {
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
                  <HeartIcon filled={isFav} />
                </button>
              </div>
              <span className="text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-3 py-1 rounded-full mt-3 w-fit">
                {product.category}
              </span>

              <div className="flex items-baseline gap-3 mt-4">
                <span className="text-2xl font-bold text-blue-600">
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-lg text-gray-400 line-through">
                      ${product.price.toFixed(2)}
                    </span>
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
                      setTimeout(() => navigate('/login'), 1000);
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
          </div>
        </div>
      </div>
    </div>
  );
}
