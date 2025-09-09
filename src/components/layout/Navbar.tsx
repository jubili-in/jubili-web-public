import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // Get active tab based on current pathname
  const getActiveTab = () => {
    const navItems = [
      { name: 'Home', path: '/' },
      { name: 'Search', path: '/search' },
      { name: 'Favourite', path: '/favourite' },
      { name: 'Cart', path: '/cart' },
      { name: 'User', path: '/user' }
    ];
    
    const activeItem = navItems.find(item => item.path === pathname);
    return activeItem ? activeItem.name : 'Home';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Update active tab when pathname changes
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [pathname]);

  // Detect keyboard open/close on mobile
  useEffect(() => {
    const handleResize = () => {
      if (showSearchInput && typeof window !== 'undefined') {
        const viewport = window.visualViewport;
        if (viewport) {
          const keyboardHeight = window.innerHeight - viewport.height;
          setKeyboardOpen(keyboardHeight > 150); // Threshold for keyboard detection
        } else {
          // Fallback for browsers without Visual Viewport API
          const viewportHeight = window.innerHeight;
          const documentHeight = document.documentElement.clientHeight;
          setKeyboardOpen(documentHeight < viewportHeight * 0.75);
        }
      }
    };

    if (typeof window !== 'undefined') {
      const viewport = window.visualViewport;
      if (viewport) {
        viewport.addEventListener('resize', handleResize);
        return () => {
          viewport.removeEventListener('resize', handleResize);
        };
      } else {
        // Fallback event listener
        window.addEventListener('resize', handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
    }
  }, [showSearchInput]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 10) {
        setShow(true);
        setLastScrollY(window.scrollY);
        return;
      }
      if (window.scrollY > lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Custom SVG Icons
  const HomeIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 10.5L12 3l8 7.5v8a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-8z" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </svg>
  );

  const SearchIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  );

  const FavouriteIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
  <path d="M10 17.992C9.35502 17.42 8.62602 16.825 7.85502 16.192H7.84502C5.13002 13.972 2.05302 11.46 0.694023 8.44997C0.24754 7.4917 0.0109268 6.4491 1.1406e-05 5.39197C-0.00297039 3.94145 0.578794 2.55095 1.61383 1.53474C2.64887 0.518518 4.04981 -0.0376365 5.50002 -0.008031C6.68065 -0.00616619 7.83586 0.33505 8.82802 0.974969C9.26399 1.25794 9.65844 1.60022 10 1.99197C10.3435 1.60176 10.7381 1.25968 11.173 0.974969C12.1648 0.334924 13.3197 -0.00631245 14.5 -0.008031C15.9502 -0.0376365 17.3512 0.518518 18.3862 1.53474C19.4213 2.55095 20.003 3.94145 20 5.39197C19.9898 6.45078 19.7532 7.49516 19.306 8.45497C17.947 11.465 14.871 13.976 12.156 16.192L12.146 16.2C11.374 16.829 10.646 17.424 10.001 18L10 17.992ZM5.50002 1.99197C4.56853 1.98031 3.67009 2.33681 3.00002 2.98397C2.35441 3.61813 1.99358 4.48701 1.99994 5.39197C2.01135 6.16247 2.18585 6.92182 2.51202 7.61997C3.15353 8.91868 4.01913 10.094 5.06902 11.092C6.06002 12.092 7.20002 13.06 8.18602 13.874C8.45902 14.099 8.73702 14.326 9.01502 14.553L9.19002 14.696C9.45702 14.914 9.73302 15.14 10 15.362L10.013 15.35L10.019 15.345H10.025L10.034 15.338H10.044L10.062 15.323L10.103 15.29L10.11 15.284L10.121 15.276H10.127L10.136 15.268L10.974 14.58C11.255 14.351 11.533 14.124 11.806 13.899C12.792 13.085 13.933 12.118 14.924 11.113C15.9741 10.1155 16.8397 8.94048 17.481 7.64197C17.8131 6.93777 17.9901 6.17047 18.0001 5.39197C18.0042 4.48981 17.6435 3.62426 17 2.99197C16.3312 2.34189 15.4326 1.98245 14.5 1.99197C13.3619 1.9823 12.274 2.45934 11.51 3.30297L10 5.04297L8.49002 3.30297C7.72609 2.45934 6.6381 1.9823 5.50002 1.99197Z" fill="currentColor"/>
</svg>

  );

  const CartIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 20 26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 6C5 2.5 7.025 1 9.5 1C11.975 1 14 2.77623 14 6" />
      <rect x="1" y="6" width="18" height="19" rx="3" />
    </svg>
  );

  const UserIcon = ({ size = 20, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );

  const CloseIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );

  const navItems = [
    { name: 'Home', icon: HomeIcon, href: '/' },
    { name: 'Search', icon: SearchIcon, href: '/search' },
    { name: 'Favourite', icon: FavouriteIcon, href: '/favourite' },
    { name: 'Cart', icon: CartIcon, href: '/cart' },
    { name: 'User', icon: UserIcon, href: '/user' }
  ];

  const handleTabClick = (tabName: string) => {
    if (tabName === 'Search') {
      setShowSearchInput(true);
      setActiveTab(tabName);
      // Don't navigate for search, just show search input
    } else {
      setShowSearchInput(false);
      setActiveTab(tabName);
      
      // Navigate to the corresponding route
      const routes: { [key: string]: string } = {
        'Home': '/',
        'Favourite': '/favourite',
        'Cart': '/cart',
        'User': '/user'
      };
      
      if (routes[tabName]) {
        router.push(routes[tabName]);
      }
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page with query
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSearchInput(false);
      console.log('Searching for:', searchQuery);
    }
  };

  const closeSearch = () => {
    setShowSearchInput(false);
    setSearchQuery('');
    setKeyboardOpen(false);
    // Don't change active tab, keep current page
  };

  // Calculate navbar position based on keyboard state
  const getNavbarPosition = () => {
    if (showSearchInput && keyboardOpen) {
      return 'top-30'; // Move to top when keyboard is open
    }
    return 'bottom-6'; // Default bottom position
  };

  return (
    <nav
      className={`fixed ${getNavbarPosition()} left-1/2 -translate-x-1/2 z-50 transition-all duration-300 w-[95vw] max-w-2xl md:w-auto ${
        show ? 'translate-y-0' : (showSearchInput && keyboardOpen ? '-translate-y-0' : 'translate-y-32')
      }`}
    >
      <div className={`bg-gray-900 rounded-full shadow-2xl transition-all duration-500 ease-in-out ${
        showSearchInput ? 'px-4 py-3' : 'px-6 py-4'
      }`}>
        {showSearchInput ? (
          // Search Input Mode
          <div className="flex items-center gap-3">
            <SearchIcon size={18} className="text-gray-400 flex-shrink-0" />
            <form onSubmit={handleSearchSubmit} className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full bg-transparent text-white placeholder-gray-400 outline-none text-sm"
                autoFocus
              />
            </form>
            <button
              onClick={closeSearch}
              className="text-gray-400 hover:text-white transition-colors duration-200 flex-shrink-0"
            >
              <CloseIcon size={16} /> 
            </button>
          </div>
        ) : (
          // Normal Navigation Mode
          <div className="flex items-center justify-between gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;
              
              return (
                <div
                  key={item.name}
                  onClick={() => handleTabClick(item.name)}
                  className="cursor-pointer transition-all duration-300 hover:scale-101 hover:-translate-y-1"
                >
                  {isActive ? (
                    // Active state: White pill with black icon and text
                    <div className="flex items-center gap-2 bg-white rounded-full px-4 py-2 transform transition-all duration-300 ease-out">
                      <Icon 
                        size={18} 
                        className="text-gray-900 transition-all duration-300"
                      />
                      <span className="font-medium text-sm text-gray-900 animate-fade-in">
                        {item.name}
                      </span>
                    </div>
                  ) : (
                    // Inactive state: Just the outline icon
                    <div className="p-2 transition-all duration-300">
                      <Icon 
                        size={20} 
                        className="text-gray-400 hover:text-gray-300 transition-colors duration-300"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;