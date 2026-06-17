import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ImageGallery } from '../../components/product/ImageGallery';
import { ProductInfo } from '../../components/product/ProductInfo';
import { ProductDetailSkeleton } from '../../components/Loader/ProductDetailSkeleton';
import { PageContainer } from '../../components/common/PageContainer';
import { ErrorState } from '../../components/common/ErrorState';
import { Card } from '../../components/common/Card';
import { ProductService } from '../../api/services/productService';
import type { ProductDetail } from '../../types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await ProductService.fetchProductDetail(id ?? '');
        setProduct(data);
      } catch {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <ProductDetailSkeleton />;

  if (error || !product) {
    return <ErrorState message={error || 'Product not found'} />;
  }

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto">
        <Link
          to="/"
          className="inline-block mb-6 text-sm text-blue-600 hover:text-blue-800 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm"
        >
          &larr; Back to products
        </Link>

        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <ImageGallery
              images={product.images}
              thumbnail={product.thumbnail}
              title={product.title}
            />
            <ProductInfo product={product} />
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
