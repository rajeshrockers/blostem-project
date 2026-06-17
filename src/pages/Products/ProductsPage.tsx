import { useEffect, useState, useCallback, useRef, memo } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { axiosInstance } from '../../api/axiosInstance';
import { ENDPOINTS } from '../../constants/endponint';
import { useDebounce } from '../../hooks/useDebounce';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { useFavorites } from '../../hooks/useFavorites';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import type { CategoryItem, Product, ProductsResponse } from '../../types';

const LIMIT = 20;

// Heart icon SVG component (memoized — props are stable, avoids re-renders).
const HeartIcon = memo(function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
      />
    </svg>
  );
});

// Product list with debounced search, category filter, and pagination.
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toggle, isFavorite } = useFavorites();
  const { add, remove, isInCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Local input state for the search field (pre-debounce).
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(searchInput, 400);

  const category = searchParams.get('category') || '';
  const skip = (page - 1) * LIMIT;

  // Fetch categories once on mount.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axiosInstance.get<CategoryItem[]>(ENDPOINTS.PRODUCTS.CATEGORIES);
        setCategories(data);
      } catch {
        // silently ignore — categories are optional
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async (signal?: AbortSignal, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      let url: string;
      if (category) {
        url = `${ENDPOINTS.PRODUCTS.BY_CATEGORY(category)}?limit=${LIMIT}&skip=${skip}`;
      } else if (debouncedSearch) {
        url = `${ENDPOINTS.PRODUCTS.SEARCH}?q=${encodeURIComponent(debouncedSearch)}&limit=${LIMIT}&skip=${skip}`;
      } else {
        url = `${ENDPOINTS.PRODUCTS.LIST}?limit=${LIMIT}&skip=${skip}`;
      }
      const { data } = await axiosInstance.get<ProductsResponse>(url, { signal });
      if (signal?.aborted) return; // race: newer request already started
      let updatedCount = 0;
      setProducts((prev) => {
        const nextProducts = append ? [...prev, ...data.products] : data.products;
        updatedCount = nextProducts.length;
        return nextProducts;
      });
      setTotal(data.total);
      setHasMore(updatedCount < data.total);
      setLoading(false);
      setLoadingMore(false);
    } catch (err) {
      if (axios.isCancel(err)) return; // silently ignore cancelled requests
      if (signal?.aborted) return;
      setError('Failed to load products');
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Fetch products whenever filters or pagination change.
  useEffect(() => {
    // Abort any in-flight request before starting a new one.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    fetchProducts(controller.signal, page > 1);

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, category, skip]);

  const buildParams = useCallback(
    (q: string, cat: string): URLSearchParams => {
      const params = new URLSearchParams();
      if (q) params.set('q', q);
      if (cat) params.set('category', cat);
      return params;
    },
    []
  );

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
  };

  // Sync local search input when the URL changes (e.g. browser back/forward).
  useEffect(() => {
    const urlQ = searchParams.get('q') || '';
    setSearchInput(urlQ);
  }, [searchParams]);

  // Commit the debounced search to the URL.
  useEffect(() => {
    const currentQ = searchParams.get('q') || '';
    if (debouncedSearch !== currentQ) {
      setSearchParams(buildParams(debouncedSearch, category), { replace: true });
      setPage(1);
      setProducts([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const handleCategoryChange = (value: string) => {
    setSearchParams(buildParams(debouncedSearch, value), { replace: true });
    setPage(1);
    setProducts([]);
  };

  const loadMore = () => {
    if (loadingMore || loading) return;
    setPage((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Product List</h1>

      {/* Search and filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => handleSearchInput(e.target.value)}
          placeholder="Search products..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
        />
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 dark:text-white"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading && products.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: LIMIT }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-600 dark:text-gray-300">No products found.</div>
      ) : (
        <InfiniteScroll
          dataLength={products.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={`loading-${i}`} />
              ))}
            </div>
          }
          endMessage={
            <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
              You have reached the end ({total} products)
            </div>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {products.map((product) => {
              const isFav = isFavorite(product.id);
              const inCart = isInCart(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
                >
                  <Link to={`/products/${product.id}`} className="block">
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
                      const added = toggle(product.id);
                      toast.success(added ? 'Added to favorites' : 'Removed from favorites');
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ${
                      isFav
                        ? 'text-red-500 bg-white dark:bg-gray-800 hover:bg-red-50'
                        : 'text-gray-400 bg-white dark:bg-gray-800 hover:text-red-500 hover:bg-red-50'
                    }`}
                    aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <HeartIcon filled={isFav} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
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
            })}
          </div>
        </InfiniteScroll>
      )}
    </div>
  );
}
