"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getUrlParam, removeUrlParams } from '@/lib/utils/url';

export default function LoginSuccessPage() {
  const router = useRouter();
  const { handleOAuthSuccess, user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Get token and user data from URL parameters
        const token = getUrlParam('token');
        const userDataString = getUrlParam('user');
        
        if (!token) {
          console.log('No authentication token found', token);
          // setTimeout(() => router.push('/login'), 2000);
          return;
        }

        if (!userDataString) {
          console.log('No user data found', userDataString);
          // setTimeout(() => router.push('/login'), 2000);
          return;
        }

        // Parse user data
        let userData;
        try {
          userData = JSON.parse(decodeURIComponent(userDataString));
        } catch (parseError) {
          console.error('Failed to parse user data:', parseError);
          console.log('Invalid user data format');
          // setTimeout(() => router.push('/login'), 2000);
          return;
        }

        // Handle OAuth success (now synchronous)
        handleOAuthSuccess(token, userData);
        
        // Clean up URL parameters
        removeUrlParams(['token', 'user']);
        
        // Redirect to home page immediately after processing
        router.push('/');
        
      } catch (error) {
        console.error('OAuth callback processing failed:', error);
        setError('Authentication failed. Please try again.');
        // setTimeout(() => router.push('/login'), 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    processOAuthCallback();
  }, [handleOAuthSuccess, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Authentication Failed</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Completing Sign In</h1>
          <p className="text-gray-600">Please wait while we log you in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
        <p className="text-gray-600 mb-4">
          {user ? `Hello ${user.name}, you've been successfully signed in.` : 'You have been successfully signed in.'}
        </p>
        <p className="text-sm text-gray-500">Redirecting to home page...</p>
      </div>
    </div>
  );
}
