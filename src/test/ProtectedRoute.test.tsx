import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';

import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockedUseAuth = vi.mocked(useAuth);

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows a loading spinner while auth is being validated', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, loading: true, user: null });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('protected-content')).toBeNull();
    expect(document.querySelector('.animate-spin')).not.toBeNull();
  });

  it('renders children when user is authenticated', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      loading: false,
      user: {
        id: 1,
        username: 'alice',
        email: 'alice@test.com',
        firstName: 'Alice',
        lastName: 'Smith',
        gender: 'female',
        image: '',
      },
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByTestId('protected-content').textContent).toBe('Secret');
    expect(document.querySelector('.animate-spin')).toBeNull();
  });

  it('redirects to /login when user is not authenticated', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, loading: false, user: null });

    render(
      <MemoryRouter initialEntries={['/favorites']}>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('protected-content')).toBeNull();
  });

  it('preserves the original location in redirect state for post-login return', () => {
    mockedUseAuth.mockReturnValue({ isAuthenticated: false, loading: false, user: null });

    render(
      <MemoryRouter initialEntries={['/profile']}>
        <ProtectedRoute>
          <div data-testid="protected-content">Secret</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByTestId('protected-content')).toBeNull();
  });
});
