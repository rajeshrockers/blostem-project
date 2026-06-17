import { axiosInstance } from '../interceptors/axiosInstance';
import { ENDPOINTS } from '../../constants/endponint';
import { MAGIC_NUMBER } from '../../constants/constants';
import type { CategoryItem, Product, ProductDetail, ProductsResponse } from '../../types';

export class ProductService {
  static async fetchProducts(params: {
    limit: number;
    skip: number;
    category?: string;
    search?: string;
    signal?: AbortSignal;
  }): Promise<ProductsResponse> {
    const { limit, skip, category, search, signal } = params;
    let url: string;

    if (search) {
      url = `${ENDPOINTS.PRODUCTS.SEARCH}?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
    } else if (category) {
      url = `${ENDPOINTS.PRODUCTS.BY_CATEGORY(category)}?limit=${limit}&skip=${skip}`;
    } else {
      url = `${ENDPOINTS.PRODUCTS.LIST}?limit=${limit}&skip=${skip}`;
    }

    const { data } = await axiosInstance.get<ProductsResponse>(url, { signal });
    return data;
  }

  static async fetchProductDetail(id: string | number): Promise<ProductDetail> {
    const { data } = await axiosInstance.get<ProductDetail>(ENDPOINTS.PRODUCTS.DETAIL(id));
    return data;
  }

  static async fetchCategories(): Promise<CategoryItem[]> {
    const { data } = await axiosInstance.get<CategoryItem[]>(ENDPOINTS.PRODUCTS.CATEGORIES);
    return data;
  }

  static async fetchAllProducts(select?: string): Promise<Product[]> {
    const selectParam = select ? `&select=${select}` : '';
    const { data } = await axiosInstance.get<{ products: Product[] }>(
      `${ENDPOINTS.PRODUCTS.LIST}?limit=${MAGIC_NUMBER.ZERO}${selectParam}`
    );
    return data.products;
  }
}
