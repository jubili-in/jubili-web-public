"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUrlParam, removeUrlParams } from '@/lib/utils/url';

export default function LoginErrorPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // Get error message from URL parameters
    const message = getUrlParam('message') || 'Authentication failed';
    setErrorMessage(message);
    
    // Clean up URL parameters
    removeUrlParams(['message']);
    
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const handleRetryLogin = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center p-8 bg-white rounded-lg shadow-lg">
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Authentication Failed</h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {errorMessage}
        </p>
        
        <div className="space-y-4">
          <button
            onClick={handleRetryLogin}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            Try Again
          </button>
          
          <p className="text-sm text-gray-500">
            Or wait 5 seconds to be automatically redirected to the login page
          </p>
        </div>
        
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Common issues:</h3>
          <ul className="text-xs text-gray-600 space-y-1 text-left">
            <li>• Google account access was denied</li>
            <li>• Network connection interrupted</li>
            <li>• Browser blocked the authentication popup</li>
            <li>• Cookies or JavaScript are disabled</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
