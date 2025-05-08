import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';

const DashboardNavbar = ({ activeTab, setActiveTab, onSignInClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  
  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle user logout
  const handleLogout = async () => {
    try {
      await logout();
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Open profile modal and close menu
  const handleOpenProfile = () => {
    setIsProfileModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  // Handle sign in click - either use callback or show modal
  const handleSignInClick = () => {
    if (onSignInClick) {
      onSignInClick();
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Handle tab navigation
  const handleNavigation = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };
  
  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
          isScrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNavigation('students')}>
                <svg className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm0-9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                </svg>
                <p  className="ml-2 text-xl font-bold font-bold leading-tight text-black-900 isdark:text-white  ">Student Manager</p>
              </div>
            </div>
            
            {/* Navigation links - desktop */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
              <button 
                onClick={() => handleNavigation('students')}
                className={`text-gray-700 dark:text-gray-200 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 text-sm font-medium ${
                  activeTab === 'students' ? 'text-purple-600 dark:text-purple-400 font-semibold' : ''
                }`}
              >
                Students
              </button>
              <button 
                onClick={() => handleNavigation('add')}
                className={` font-bold leading-tight text-black-900 isdark:text-white hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 text-sm font-medium ${
                  activeTab === 'add' ? 'text-purple-600 isdark:text-purple-400 font-semibold' : ''
                }`}
              >
                Add Student
              </button>
            </div>
            
            {/* Right side items: theme toggle and user menu */}
            <div className="flex items-center">
              {/* User Profile / Login Button */}
              {currentUser ? (
                <div className="relative ml-3">
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-purple-600 flex items-center justify-center text-white">
                        {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </button>
                    <div className="ml-3 hidden sm:block">
                      <div className="text-sm  font-medium  text-gray-500 font-bold leading-tight  isdark:text-white">
                        {currentUser.email?.split('@')[0] || 'User'}
                      </div>
                      <div className="text-xs text-gray-500 font-bold leading-tight text-black-900 isdark:text-white">
                        Logged in
                      </div>
                    </div>
                  </div>
                  
                  {/* Dropdown Menu */}
                  {isMobileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 py-1 bg-white  rounded-md shadow-lg z-10 border border-gray-200 isdark:border-gray-700">
                      <div className="block w-full text-left px-4 py-2 text-sm text-gray-700 isdark:text-gray-200 hover:bg-gray-100 isdark:hover:bg-gray-700 ">
                        {currentUser.email}
                      </div>
                      <button
                        onClick={handleOpenProfile}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 isdark:text-gray-200 hover:bg-gray-100 isdark:hover:bg-gray-700"
                      >
                        Your Profile
                      </button>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 isdark:text-red-400 hover:bg-gray-100 isdark:hover:bg-gray-700"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleSignInClick}
                  className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Sign In
                </button>
              )}
              
              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden ml-4">
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-600 isdark:text-gray-300 hover:bg-gray-100 isdark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden bg-white isdark:bg-gray-900 shadow-md">
            <div className="pt-2 pb-3 space-y-1">
              <button
                onClick={() => handleNavigation('students')}
                className={`block w-full text-left px-3 py-2 text-base font-medium ${
                  activeTab === 'students' 
                    ? 'bg-purple-100 isdark:bg-purple-900 text-purple-700 isdark:text-purple-200' 
                    : 'text-gray-700 isdark:text-gray-200 hover:bg-gray-100 isdark:hover:bg-gray-800'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => handleNavigation('add')}
                className={`block w-full text-left px-3 py-2 text-base font-medium ${
                  activeTab === 'add' 
                    ? 'bg-purple-100 isdark:bg-purple-900 text-purple-700 isdark:text-purple-200' 
                    : 'text-gray-700 isdark:text-gray-200 hover:bg-gray-100 isdark:hover:bg-gray-800'
                }`}
              >
                Add Student
              </button>
            </div>
            {currentUser && (
              <div className="pt-4 pb-3 border-t border-gray-200 isdark:border-gray-700">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-purple-600 flex items-center justify-center text-white">
                      {currentUser.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800 isdark:text-white">
                      {currentUser.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-sm font-medium text-gray-500 isdark:text-gray-400">
                      {currentUser.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <button
                    onClick={handleOpenProfile}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 isdark:text-gray-200 hover:bg-gray-100 isdark:hover:bg-gray-800"
                  >
                    Your Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-red-600 isdark:text-red-400 hover:bg-gray-100 isdark:hover:bg-gray-800"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.nav>
      
      {/* Authentication Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
      {/* User Profile Modal */}
      {isProfileModalOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setIsProfileModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()}>
            <UserProfile onClose={() => setIsProfileModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNavbar; 