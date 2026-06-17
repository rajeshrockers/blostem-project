import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { axiosInstance } from '../../api/axiosInstance';
import { ENDPOINTS } from '../../constants/endponint';
import { useCart } from '../../hooks/useCart';
import type { Product } from '../../types';

export default function CartPage() {
  const { items, updateQuantity, remove, totalItems } = useCart();
  const [products, setProducts] = useState<Map<number, Product>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (items.length === 0) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data } = await axiosInstance.get<{ products: Product[] }>(
          `${ENDPOINTS.PRODUCTS.LIST}?limit=0&select=id,title,description,price,thumbnail,category`
        );
        const map = new Map<number, Product>();
        data.products.forEach((p) => map.set(p.id, p));
        setProducts(map);
      } catch {
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [items.length]);

  const subtotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = products.get(item.id);
        return sum + (product?.price ?? 0) * item.quantity;
      }, 0),
    [items, products]
  );

  const cartLines = useMemo(
    () =>
      items.map((item) => ({
        item,
        product: products.get(item.id),
      })),
    [items, products]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Your Cart</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Your cart is empty.</p>
          <Link
            to="/products"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartLines.map(({ item, product }) =>
              product ? (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex gap-4 items-center"
                >
                  <Link to={`/products/${item.id}`} className="shrink-0">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.id}`}>
                      <h2 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                        {product.title}
                      </h2>
                    </Link>
                    <p className="text-sm text-gray-600 dark:text-gray-400">${product.price}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-medium text-gray-800 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-[80px]">
                    <p className="font-semibold text-gray-800 dark:text-white">
                      ${(product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => {
                        remove(item.id);
                        toast.success('Removed from cart');
                      }}
                      className="text-sm text-red-500 hover:text-red-600 mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-gray-500 dark:text-gray-400"
                >
                  Product #{item.id} not found
                </div>
              )
            )}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                Order Summary
              </h2>
              <div className="flex justify-between text-gray-600 dark:text-gray-300 mb-2">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between text-gray-800 dark:text-white text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => toast.success('Checkout coming soon!')}
                className="w-full mt-6 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
