export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
}

export interface ProductDetail extends Product {
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CategoryItem {
  slug: string;
  name: string;
  url: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

export interface UserProfile extends User {}

export interface LoginResponse extends User {
  accessToken: string;
  refreshToken: string;
}

export interface CartItem {
  id: number;
  quantity: number;
}
