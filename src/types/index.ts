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

export interface ProtectedRouteProps {
  children: React.ReactNode;
}

export interface HeartIconProps {
  filled: boolean;
  className?: string;
}

export interface ImageGalleryProps {
  images: string[];
  thumbnail: string;
  title: string;
}

export interface ProductInfoProps {
  product: ProductDetail;
}

export interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface PageHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export interface ErrorStateProps {
  message: string;
}

export interface EmptyStateAction {
  label: string;
  to: string;
}

export interface EmptyStateProps {
  message: string;
  action?: EmptyStateAction;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export type ButtonVariant = 'primary' | 'danger' | 'outline';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}