import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import { VirtuosoGrid } from 'react-virtuoso';
import { useDebounce } from '../../hooks/useDebounce';
import { ProductService } from '../../api/services/productService';
import SkeletonCard from '../../components/Loader/SkeletonCard';
import { ProductCard } from '../../components/product/ProductCard';
import { PageContainer } from '../../components/common/PageContainer';
import { PageHeading } from '../../components/common/PageHeading';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { MAGIC_NUMBER } from '../../constants/constants';
import type { CategoryItem, Product } from '../../types';

const LIMIT = MAGIC_NUMBER.TWENTY;

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

  const itemContent = useCallback((_index: number, product: Product) => {
    return <ProductCard product={product} />;
  }, []);

  const virtuosoComponents = useMemo(
    () => ({
      Footer: () => {
        if (loadingMore) {
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: MAGIC_NUMBER.EIGHT }).map((_, i) => (
                <SkeletonCard key={`loading-${i}`} />
              ))}
            </div>
          );
        }
        if (!hasMore) {
          return (
            <div className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
              You have reached the end ({total} products)
            </div>
          );
        }
        return null;
      },
    }),
    [loadingMore, hasMore, total]
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const abortControllerRef = useRef<AbortController | null>(null);

  // Local input state for the search field (pre-debounce).
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');
  const debouncedSearch = useDebounce(searchInput, MAGIC_NUMBER.FOUR_HUNDRED);

  const category = searchParams.get('category') || '';
  const skip = (page - 1) * LIMIT;


  // Fetch categories once on mount.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await ProductService.fetchCategories();
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
      const data = await ProductService.fetchProducts({
        limit: LIMIT,
        skip,
        category,
        search: debouncedSearch,
        signal,
      });
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

  const loadMore = useCallback(() => {
    if (loadingMore || loading) return;
    setPage((prev) => prev + 1);
  }, [loading, loadingMore]);

  return (
    <PageContainer>
      <PageHeading>Product List</PageHeading>

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
        <ErrorState message={error} />
      ) : products.length === 0 ? (
        <EmptyState message="No products found." />
      ) : (
        <VirtuosoGrid
          useWindowScroll
          data={products}
          endReached={() => hasMore && loadMore()}
          overscan={200}
          listClassName="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8"
          itemClassName="h-full"
          itemContent={itemContent}
          components={virtuosoComponents}
        />
      )}
    </PageContainer>
  );
}
