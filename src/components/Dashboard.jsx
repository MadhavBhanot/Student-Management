import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardNavbar from './DashboardNavbar';
import StudentList from './StudentList';
import AddStudent from './AddStudent';
import AuthModal from './AuthModal';
import { useAuth } from '../contexts/AuthContext';
import { ThemeContext } from '../App';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'add'
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser } = useAuth();
  
  // Show login modal if user is not authenticated
  useEffect(() => {
    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [currentUser]);
  
  // Don't allow closing the modal if not logged in
  const handleAuthModalClose = () => {
    if (currentUser) {
      setShowAuthModal(false);
    }
  };
  
  return (
    <ThemeContext.Consumer>
      {({ isDark }) => (
        <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
          <DashboardNavbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onSignInClick={() => setShowAuthModal(true)}
          />
          
          {/* Background floating particles */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            <div className={`absolute top-1/4 left-1/4 w-64 h-64 rounded-full ${isDark ? 'bg-purple-600/10' : 'bg-purple-500/5'} blur-3xl animate-float-slow`}></div>
            <div className={`absolute top-3/4 left-2/3 w-96 h-96 rounded-full ${isDark ? 'bg-blue-600/10' : 'bg-blue-500/5'} blur-3xl animate-float-slow-reverse`}></div>
            <div className={`absolute top-1/2 left-1/3 w-72 h-72 rounded-full ${isDark ? 'bg-indigo-600/10' : 'bg-indigo-500/5'} blur-3xl animate-float`}></div>
          </div>
          
          {/* Dashboard Header */}
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-3xl font-bold leading-tight text-black-900 isdark:text-white ">
                  Student Dashboard
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Manage your students and courses in one place
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('students')}
                  className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                    activeTab === 'students'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                >
                  View Students
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('add')}
                  className={`ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                    activeTab === 'add'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500`}
                >
                  Add Student
                </button>
              </div>
            </div>
          </div>
          
          {/* Dashboard Content */}
          <div className="w-full max-w-7xl mx-auto relative z-10">
            {!currentUser ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
              >
                <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-10 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Authentication Required</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Please log in to access student data
                  </p>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    Log In
                  </button>
                </div>
              </motion.div>
            ) : (
              activeTab === 'students' ? <StudentList /> : <AddStudent />
            )}
          </div>
          
          {/* Authentication Modal */}
          <AuthModal isOpen={showAuthModal} onClose={handleAuthModalClose} canSkip={false} />
        </div>
      )}
    </ThemeContext.Consumer>
  );
};

export default Dashboard; 