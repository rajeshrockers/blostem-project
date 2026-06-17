import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { axiosInstance } from '../../api/axiosInstance';
import { ENDPOINTS } from '../../constants/endponint';
import SkeletonProfile from '../../components/ui/SkeletonProfile';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
}

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
        const { data } = await axiosInstance.get<UserProfile>(ENDPOINTS.AUTH.ME);
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Profile</h1>
          <SkeletonProfile />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Profile</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
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
            <button
              onClick={() => {
                if (userId) {
                  localStorage.removeItem(`favorites_user_${userId}`);
                }
                clearToken();
                toast.success('Logged out successfully');
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
