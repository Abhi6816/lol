// components/Navbar.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default  Navbar=()=> {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for user profile in localStorage on component mount
    const checkUserProfile = () => {
      try {
        const storedProfile = localStorage.getItem('userProfile');
        if (storedProfile) {
          setUserProfile(JSON.parse(storedProfile));
        }
      } catch (error) {
        console.error('Error reading user profile from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserProfile();

    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'userProfile') {
        if (e.newValue) {
          setUserProfile(JSON.parse(e.newValue));
        } else {
          setUserProfile(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('userProfile');
      setUserProfile(null);
      router.push('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getUserDisplayName = () => {
    if (!userProfile) return '';
    return userProfile.name || 'User';
  };

  const getUserRole = () => {
    if (!userProfile) return '';
    return userProfile.role === 'candidate' ? 'Candidate' : 'Expert';
  };

  if (isLoading) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0">
                <span className="text-xl font-bold text-gray-900">TalentMatch</span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-xl font-bold text-gray-900">TalentMatch</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {userProfile ? (
              // Logged in state
              <>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getUserRole()}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <div className="border-l border-gray-200 h-6"></div>
                
                <Link 
                  href="/dashboard" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Dashboard
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              // Logged out state
              <>
                <Link 
                  href="/login" 
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Login
                </Link>
                <Link 
                  href="/" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}