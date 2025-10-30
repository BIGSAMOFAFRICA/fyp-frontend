import { useState } from 'react';
import { RefreshCw } from 'lucide-react';

const TokenRefreshButton = () => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefreshToken = async () => {
    setRefreshing(true);
    try {
      const response = await fetch('/api/auth/refresh-token', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
          alert('Token refreshed successfully!');
        }
      } else {
        alert('Token refresh failed. Please login again.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      alert('Token refresh failed. Please login again.');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('role');
      window.location.href = '/login';
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRefreshToken}
      disabled={refreshing}
      className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
      <span>{refreshing ? 'Refreshing...' : 'Refresh Token'}</span>
    </button>
  );
};

export default TokenRefreshButton;




