"use client";
import Navbar from "@/components/layout/Navbar";
import { useState } from "react";

export default function FAQPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const faqData = [
    {
      id: "startup",
      question: "So, you're a startup?",
      answer: "Yes, Jubili is a startup focused on revolutionizing the ecommerce experience. We're building the next generation of online shopping with innovative features and exceptional customer service."
    },
    {
      id: "right-for-me",
      question: "Is Jubili right for me?",
      answer: "Jubili is perfect for anyone who values quality products, personalized shopping experiences, and exceptional customer service. Whether you're a fashion enthusiast, tech lover, or just looking for reliable online shopping, we've got you covered."
    },
    {
      id: "signup",
      question: "How do I sign up?",
      answer: "Signing up is easy! Click the 'Sign Up' button in the navigation, provide your email address, create a password, and verify your email. You'll be shopping in minutes with access to exclusive deals and personalized recommendations."
    },
    {
      id: "onboarding",
      question: "What's the onboarding like? Do you charge for implementation?",
      answer: "Our onboarding process is completely free and designed to get you started quickly. We'll guide you through setting up your account, exploring our features, and making your first purchase. No hidden fees or implementation charges - just a smooth, enjoyable shopping experience."
    }
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header Section */}
          <div className="text-center mb-16">
            {/* Jubili FAQ Label */}
            <div className="inline-block bg-gray-200 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium mb-6">
              Jubili FAQ
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              We&apos;re here to answer all your questions.
            </h1>
            
            {/* Introductory Paragraph */}
                         <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
               If you&apos;re new to Jubili or looking to supercharge your shopping experience, this section will help you learn more about the platform and its features.
             </p>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <button
                  onClick={() => toggleSection(item.id)}
                  className="flex justify-between items-center w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
                >
                  <span className="text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                  </span>
                  <span className="flex-shrink-0">
                    <svg 
                      className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${
                        activeSection === item.id ? 'rotate-45' : ''
                      }`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                
                {activeSection === item.id && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed pt-4">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <section className="text-center mt-16">
            <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Still Have Questions?</h3>
              <p className="text-gray-600 mb-6">
                Can&apos;t find what you&apos;re looking for? Our customer support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                  Contact Support
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                  Live Chat
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
