'use client';
import React, { useState, useRef, useEffect } from 'react';

const NAV_ITEMS = [
  {
    label: "Fashion",
    type: "dropdown",
    columns: [
      {
        heading: "Women",
        featured: true,
        items: [
          { text: "New Arrivals", href: "#" },
          { text: "Dresses & Jumpsuits", href: "#" },
          { text: "Tops & T-Shirts", href: "#" },
          { text: "Jeans & Pants", href: "#" },
          { text: "Kurtas & Ethnic Wear", href: "#" },
          { text: "Sweaters & Jackets", href: "#" },
          { text: "Accessories", href: "#" },
        ],
      },
      {
        heading: "Men",
        items: [
          { text: "New Arrivals", href: "#" },
          { text: "T-Shirts & Shirts", href: "#" },
          { text: "Jeans & Trousers", href: "#" },
          { text: "Ethnic Wear", href: "#" },
          { text: "Jackets & Hoodies", href: "#" },
          { text: "Watches & Accessories", href: "#" },
        ],
      },
      {
        heading: "Kids",
        items: [
          { text: "Boys Clothing", href: "#" },
          { text: "Girls Clothing", href: "#" },
          { text: "Baby Essentials", href: "#" },
          { text: "Footwear", href: "#" },
          { text: "Toys & Games", href: "#" },
        ],
      },
      {
        heading: "More",
        items: [
          { text: "Fashion Deals", href: "#" },
          { text: "Designer Boutique", href: "#" },
          { text: "Festival Collection", href: "#" },
          { text: "Gift Cards", href: "#" },
        ],
      },
    ],
  },
  {
    label: "Home Appliances",
    type: "dropdown",
    columns: [
      {
        heading: "Kitchen",
        featured: true,
        items: [
          { text: "Refrigerators", href: "#" },
          { text: "Microwaves", href: "#" },
          { text: "Mixers & Grinders", href: "#" },
          { text: "Water Purifiers", href: "#" },
          { text: "Dishwashers", href: "#" },
        ],
      },
      {
        heading: "Living Room",
        items: [
          { text: "Televisions", href: "#" },
          { text: "Air Conditioners", href: "#" },
          { text: "Speakers & Soundbars", href: "#" },
          { text: "Fans & Air Coolers", href: "#" },
        ],
      },
      {
        heading: "Laundry & Cleaning",
        items: [
          { text: "Washing Machines", href: "#" },
          { text: "Vacuum Cleaners", href: "#" },
          { text: "Irons & Steamers", href: "#" },
        ],
      },
      {
        heading: "Smart Home",
        items: [
          { text: "Smart Lights", href: "#" },
          { text: "Security Cameras", href: "#" },
          { text: "Home Assistants", href: "#" },
        ],
      },
    ],
  },
  {
    label: "Shoes",
    type: "dropdown",
    columns: [
      {
        heading: "Men's Shoes",
        featured: true,
        items: [
          { text: "Sneakers", href: "#" },
          { text: "Formal Shoes", href: "#" },
          { text: "Loafers", href: "#" },
          { text: "Sandals & Slippers", href: "#" },
          { text: "Boots", href: "#" },
        ],
      },
      {
        heading: "Women's Shoes",
        items: [
          { text: "Heels", href: "#" },
          { text: "Flats", href: "#" },
          { text: "Sneakers", href: "#" },
          { text: "Boots", href: "#" },
          { text: "Ethnic Footwear", href: "#" },
        ],
      },
      {
        heading: "Kids' Shoes",
        items: [
          { text: "Boys Footwear", href: "#" },
          { text: "Girls Footwear", href: "#" },
          { text: "School Shoes", href: "#" },
        ],
      },
      {
        heading: "Trending",
        items: [
          { text: "New Releases", href: "#" },
          { text: "Best Sellers", href: "#" },
          { text: "Seasonal Offers", href: "#" },
        ],
      },
    ],
  },
  {
    label: "My Account",
    type: "dropdown",
    columns: [
      {
        heading: "Orders & Returns",
        featured: true,
        items: [
          { text: "My Orders", href: "#" },
          { text: "Track Order", href: "#" },
          { text: "Returns & Refunds", href: "#" },
          { text: "Cancellations", href: "#" },
        ],
      },
      {
        heading: "Account Info",
        items: [
          { text: "Profile Settings", href: "#" },
          { text: "Saved Addresses", href: "#" },
          { text: "Payment Methods", href: "#" },
          { text: "Wishlist", href: "#" },
        ],
      },
      {
        heading: "Support",
        items: [
          { text: "Customer Support", href: "#" },
          { text: "Help Center", href: "#" },
          { text: "Report a Problem", href: "#" },
        ],
      },
      {
        heading: "Rewards & Membership",
        items: [
          { text: "Loyalty Points", href: "#" },
          { text: "Gift Cards", href: "#" },
          { text: "Refer & Earn", href: "#" },
        ],
      },
    ],
  },
  {
    label: "Quick Links",
    type: "dropdown",
    columns: [
      {
        heading: "About",
        featured: true,
        items: [
          { text: "About Us", href: "#" },
          { text: "Careers", href: "#" },
          { text: "Press", href: "#" },
        ],
      },
      {
        heading: "Policies",
        items: [
          { text: "Terms & Conditions", href: "#" },
          { text: "Privacy Policy", href: "#" },
          { text: "Return Policy", href: "#" },
          { text: "Cookie Policy", href: "#" },
        ],
      },
      {
        heading: "Help & Support",
        items: [
          { text: "FAQs", href: "#" },
          { text: "Contact Us", href: "#" },
          { text: "Order Tracking", href: "#" },
          { text: "Store Locator", href: "#" },
        ],
      },
      {
        heading: "More",
        items: [
          { text: "Affiliate Program", href: "#" },
          { text: "Corporate Enquiries", href: "#" },
          { text: "Site Map", href: "#" },
        ],
      },
    ],
  },
];


export const NavbarTop=()=> {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedItem, setMobileExpandedItem] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  // Blur page content when dropdown is open (desktop only)
  useEffect(() => {
    const pageContent = document.getElementById('page-content');
    if (!pageContent) return;

    if (activeDropdown) {
      pageContent.classList.add('blur-sm', 'pointer-events-none');
    } else {
      pageContent.classList.remove('blur-sm', 'pointer-events-none');
    }
  }, [activeDropdown]);

  const handleDropdownClick = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setMobileExpandedItem(null);
  };

  const toggleMobileItem = (label: string) => {
    setMobileExpandedItem(mobileExpandedItem === label ? null : label);
  };

  return (
    <nav ref={navRef} className="relative bg-transparent md:bg-black/90 md:backdrop-blur-md top-0 z-50">
      {/* Top Navigation Bar */}
      <div className="bg-black/0 md:bg-transparent backdrop-blur-sm md:backdrop-blur-0">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between h-12 md:h-8 px-4">
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className="md:hidden text-black p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map(item =>
                item.type === "link" ? (
                  <a
                    key={item.label}
                    href="#"
                    className="text-gray-300 hover:text-white text-sm font-normal transition-colors duration-200 cursor-pointer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <div key={item.label} className="relative">
                    <button 
                      onClick={() => handleDropdownClick(item.label)}
                      className={`text-sm font-normal transition-colors duration-200 cursor-pointer ${
                        activeDropdown === item.label ? 'text-white' : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  </div>
                )
              )}
            </div>

            {/* Logo */}
            <div className="flex items-center cursor-pointer h-12">
              {/* Mobile logo */}
              <img src="/images/logo.svg" alt="Logo" className="h-8 block md:hidden" />
                        
              {/* Desktop logo */}
              <img src="/images/logo-white.svg" alt="Logo" className="h-full hidden md:block" />
            </div>

            {/* Mobile spacer for layout balance */}
            <div className="md:hidden w-10"></div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`md:hidden fixed inset-0 bg-white/10 backdrop-blur-lg transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ top: '48px' }}
      >
        <div className="h-full overflow-y-auto px-4 py-6">
          {NAV_ITEMS.map(item => (
            <div key={item.label} className="">
              <button
                onClick={() => toggleMobileItem(item.label)}
                className="w-full flex items-center justify-between py-4 text-lg font-medium"
              >
                {item.label}
                <svg 
                  className={`w-5 h-5 transition-transform duration-200 ${
                    mobileExpandedItem === item.label ? 'rotate-180' : ''
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Mobile Dropdown Content */}
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  mobileExpandedItem === item.label ? 'max-h-[1000px] pb-4' : 'max-h-0'
                }`}
              >
                {item.columns?.map((col, idx) => (
                  <div key={idx} className="mb-6">
                    <h3 className="text-gray-600 text-xs font-medium uppercase tracking-wider mb-3">
                      {col.heading}
                    </h3>
                    <div className="space-y-2">
                      {col.items.map((opt, i) => (
                        <a
                          key={i}
                          href={opt.href}
                          className={`block transition-colors duration-200 ${
                            col.featured
                              ? "text-base font-semibold"
                              : "text-sm text-gray-500"
                          }`}
                        >
                          {opt.text}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Dropdown Panel */}
      <div 
        className={`hidden md:block absolute border-b border-gray-100 left-0 w-full bg-white transition-all duration-700 ease overflow-hidden ${
          activeDropdown ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ top: "100%" }}
      >
        {activeDropdown && NAV_ITEMS.find(item => item.label === activeDropdown)?.type === "dropdown" && (
          <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="grid grid-cols-4 gap-8">
              {NAV_ITEMS.find(item => item.label === activeDropdown)?.columns?.map((col, idx) => (
                <div key={idx}>
                  <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-4">
                    {col.heading}
                  </h3>
                  <div className="space-y-3">
                    {col.items.map((opt, i) => (
                      <a
                        key={i}
                        href={opt.href}
                        className={`block transition-colors duration-200 cursor-pointer ${
                          col.featured
                            ? "text-xl font-semibold text-gray-900 hover:text-gray-600"
                            : "text-sm text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        {opt.text}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}