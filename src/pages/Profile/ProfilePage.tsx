import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import SkeletonProfile from '../../components/Loader/SkeletonProfile';
import { PageContainer } from '../../components/common/PageContainer';
import { PageHeading } from '../../components/common/PageHeading';
import { ErrorState } from '../../components/common/ErrorState';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { AuthService } from '../../api/services/authService';
import type { UserProfile } from '../../types';

// Fetches the current user's profile from /auth/me and shows a logout button.
export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const clearToken = useAuthStore((state) => state.clearToken);
  const userId = useAuthStore((state) => state.userId);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await AuthService.getUserProfile();
        setProfile(data);
      } catch {
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto">
          <PageHeading>Profile</PageHeading>
          <SkeletonProfile />
        </div>
      </PageContainer>
    );
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <PageHeading>Profile</PageHeading>

        <Card className="p-8">
          {profile && (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <img
                src={profile.image}
                alt={profile.username}
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              />
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">@{profile.username}</p>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{profile.email}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 capitalize">{profile.gender}</p>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3">
            <Link
              to="/favorites"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              My Favorites
            </Link>
            <Button
              variant="danger"
              onClick={() => {
                if (userId) {
                  localStorage.removeItem(`favorites_user_${userId}`);
                }
                clearToken();
                toast.success('Logged out successfully');
              }}
              className="rounded-lg"
            >
              Logout
            </Button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}
